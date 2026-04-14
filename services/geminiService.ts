import { GoogleGenAI } from "@google/genai";

interface GroundingChunk {
  web?: { title: string; uri: string };
}

export interface InsightResult {
  text: string;
  sources?: { title: string; uri: string }[];
}

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free';
const CRYPTOPANIC_API = import.meta.env.VITE_CRYPTOPANIC_API || '';

const SYSTEM_INSTRUCTION = "You are an institutional-grade research analyst for Coinvestopedia. Your goal is to provide data-driven, educational, and strictly neutral observations. DO NOT provide financial advice, trading signals, price predictions, or specific 'buy/sell' recommendations. Maintain an academic and professional tone.";

const CACHE_KEY_PREFIX = 'coinvestopedia_ai_insight_';
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

export const getMarketInsight = async (topic: string): Promise<InsightResult> => {
  const cacheKey = `${CACHE_KEY_PREFIX}${topic.replace(/\s+/g, '_')}`;
  
  // 1. Check local cache
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      if (Date.now() - parsed.timestamp < CACHE_DURATION_MS) {
        return parsed.result;
      }
    }
  } catch (e) {
    console.warn("Cache read error:", e);
  }

  const enhancedPromptContents = `${SYSTEM_INSTRUCTION}

Analyze the ${topic} based on LIVE data. Provide a highly accurate, dynamic 3-4 sentence market overview. 
You MUST cover the following interconnected dynamics:
1. Current major geopolitical, financial, or political events globally.
2. How Traditional Markets (TradFi) and Crypto markets are performing today in response.
3. How these markets and events are actively affecting each other, focusing on structural impacts on the crypto ecosystem.
Be factual. Do not state that you lack real-time access.`;

  let result: InsightResult | null = null;

  // 2. Try Gemini FIRST (Primary - has native Google Search)
  if (GEMINI_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: enhancedPromptContents,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      if (response.text) {
        const text = response.text;
        const chunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];
        
        const sources = chunks
          .filter((c) => c.web)
          .map((c) => ({
            title: c.web!.title,
            uri: c.web!.uri
          }));

        result = { text, sources: sources.length > 0 ? sources : undefined };
      }
    } catch (e) {
      console.warn("Gemini fetch failed, attempting fallback to OpenRouter:", e);
    }
  }

  // 3. Fallback to OpenRouter (With Live News Injection)
  if (!result && OPENROUTER_KEY) {
    try {
      let liveNewsContext = "";
      // Optional: Attempt to fetch CryptoPanic news for live context
      if (CRYPTOPANIC_API) {
        try {
          const newsRes = await fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=${CRYPTOPANIC_API}&filter=hot&public=true`);
          if (newsRes.ok) {
            const newsData = await newsRes.json();
            const headlines = newsData.results?.slice(0, 8).map((r: any) => `- ${r.title}`).join('\n');
            if (headlines) {
              liveNewsContext = `\n\nLIVE CONTEXT - RECENT HEADLINES:\n${headlines}\nUse the above live news to inform your analysis.`;
            }
          }
        } catch (cn) {
          console.warn("Could not inject CryptoPanic news (possible CORS/config issue). Proceeding silently.");
        }
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
          "HTTP-Referer": window.location?.origin || "", 
          "X-Title": "Coinvestopedia", 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: "user", content: enhancedPromptContents + liveNewsContext }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          result = { text, sources: undefined };
        }
      } else {
        console.warn(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }
    } catch (e) {
      console.warn("OpenRouter fallback failed:", e);
    }
  }

  // 4. Ultimate Fallback (Error State)
  if (!result) {
    return { text: "Unable to fetch live insights at this moment. Please verify API configurations for Gemini or OpenRouter." };
  }

  // 5. Save to Cache
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      result
    }));
  } catch (e) {
    console.warn("Cache write error:", e);
  }

  return result;
};

export const analyzeAssetMovement = async (
  asset: string, 
  movementType: string, 
  amount: string,
  fromAddress?: string,
  toAddress?: string
): Promise<InsightResult> => {
  if (!GEMINI_KEY) {
    return { text: "Analysis unavailable. Configure API Key." };
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

  try {
    const fromStr = fromAddress || 'Unknown Wallet';
    const toStr = toAddress || 'Unknown Wallet';

    const prompt = `${SYSTEM_INSTRUCTION}
    
    A transfer of ${amount} in ${asset} (${movementType}) just occurred from ${fromStr} to ${toStr}. 
    
    Analyze this specific data point in the context of:
    1. Operational Logic:
       - Describe the flow (e.g., Exchange to Private Wallet, Wallet to Wallet) using institutional terminology.
       - Explain the technical nature of such movements (e.g., cold storage migration, liquidity provisioning) without assuming intent.
    
    2. Contextual Data: Research recent ${asset} structural developments (upgrades, regulatory filings) to provide factual context for this on-chain activity.

    Provide a 2-3 sentence objective observation. Focus on WHAT the data shows, not what it 'implies' for future price action.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Analysis unavailable.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri
      }));

    return { text, sources: sources.length > 0 ? sources : undefined };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Unable to analyze movement at this moment." };
  }
};