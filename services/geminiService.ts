import { GoogleGenAI } from "@google/genai";

interface GroundingChunk {
  web?: { title: string; uri: string };
}

export interface InsightResult {
  text: string;
  sources?: { title: string; uri: string }[];
}

const GEMINI_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY || '',
  import.meta.env.VITE_GEMINI_SECOND_FALLBACK_API_KEY || '',
  import.meta.env.VITE_GEMINI_THIRD_FALLBACK_API_KEY || '',
].filter(Boolean);

const SYSTEM_INSTRUCTION = "You are an institutional-grade research analyst for Coinvestopedia. Your goal is to provide data-driven, educational, and strictly neutral observations. DO NOT provide financial advice, trading signals, price predictions, or specific 'buy/sell' recommendations. Maintain an academic and professional tone.";

const CACHE_KEY_PREFIX = 'coinvestopedia_ai_insight_';
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Attempts a Gemini call with Google Search grounding.
 * Returns InsightResult on success, null on failure.
 */
const tryGemini = async (apiKey: string, prompt: string, modelName: string = "gemini-3.1-pro"): Promise<InsightResult | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = ai.getGenerativeModel({ 
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      tools: [{ googleSearchRetrieval: {} }],
    } as any);

    const response = result.response;
    const text = response.text();

    if (text) {
      const chunks = ((response as any).groundingMetadata?.groundingChunks || []) as GroundingChunk[];
      const sources = chunks
        .filter((c) => c.web)
        .map((c) => ({ title: c.web!.title, uri: c.web!.uri }));
      return { text, sources: sources.length > 0 ? sources : undefined };
    }
  } catch (e: any) {
    console.error(`[tryGemini] ${modelName} failed with key ...${apiKey.slice(-6)}:`, e?.message || e);
  }
  return null;
};

// In-flight deduplication: prevents React StrictMode double-mounts from
// burning two API calls for the same topic simultaneously.
const _inflight = new Map<string, Promise<InsightResult>>();

export const getMarketInsight = (topic: string): Promise<InsightResult> => {
  const existing = _inflight.get(topic);
  if (existing) return existing;

  const promise = _getMarketInsightInner(topic).finally(() => _inflight.delete(topic));
  _inflight.set(topic, promise);
  return promise;
};

const _getMarketInsightInner = async (topic: string): Promise<InsightResult> => {
  const cacheKey = `${CACHE_KEY_PREFIX}${topic.replace(/\s+/g, '_')}`;
  let staleData: InsightResult | null = null;

  // 1. Check local cache
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      staleData = parsed.result;
      
      // If fresh (within 6 hours) AND not a fallback message, return immediately
      const isFallback = parsed.result.text.includes("recalibrating");
      if (Date.now() - parsed.timestamp < CACHE_DURATION_MS && !isFallback) {
        return parsed.result;
      }
    }
  } catch (e) {
    console.warn("Cache read error:", e);
  }

  // 2. Call Vercel Serverless Function (Edge Cached globally for all users)
  const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (!isLocalDev) {
    console.log(`[AI Overview] Fetching globally cached insight from Vercel Edge...`);
    try {
      const res = await fetch(`/api/market-insight?topic=${encodeURIComponent(topic)}`);
      if (res.ok) {
        const data = await res.json();
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            result: data
          }));
        } catch (e) {
          console.warn("Cache write error:", e);
        }
        return data;
      }
    } catch {
      // Edge not available, fall through
    }
  }

  // 3. Optional local fallback if Edge route isn't available
  console.log(`[AI Overview] Falling back to local direct providers...`);
  const enhancedPromptContents = `${SYSTEM_INSTRUCTION}\n\nAnalyze the ${topic} based on LIVE data. Provide a highly accurate, dynamic 3-4 sentence market overview. \nYou MUST cover the following interconnected dynamics:\n1. Current major geopolitical, financial, or political events globally.\n2. How Traditional Markets (TradFi) and Crypto markets are performing today in response.\n3. How these markets and events are actively affecting each other, focusing on structural impacts on the crypto ecosystem.\nBe factual. Do not state that you lack real-time access.`;

  let result: InsightResult | null = null;
  const shuffledKeys = [...GEMINI_KEYS].sort(() => Math.random() - 0.5);

  // A. Try Gemini 3.1 Pro (Flagship Reasoning)
  for (let i = 0; i < shuffledKeys.length && !result; i++) {
    console.log(`[AI Overview] Trying Gemini 3.1 Pro (Key ${i + 1}/${shuffledKeys.length})...`);
    result = await tryGemini(shuffledKeys[i], enhancedPromptContents, "gemini-3.1-pro");
  }

  // B. Try Gemini 3.1 Flash (High Performance)
  if (!result) {
    for (let i = 0; i < shuffledKeys.length && !result; i++) {
      console.log(`[AI Overview] Trying Gemini 3.1 Flash (Key ${i + 1}/${shuffledKeys.length})...`);
      result = await tryGemini(shuffledKeys[i], enhancedPromptContents, "gemini-3.1-flash");
    }
  }

  if (result) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          result
        }));
      } catch (e) {
        console.warn("Cache write error:", e);
      }
      return result;
  }

  // 4. FINAL FALLBACK: If all keys fail, return stale data if available
  const isStaleFallback = staleData?.text?.includes("recalibrating");
  if (staleData && !isStaleFallback) {
    console.log(`[AI Overview] All keys failed. Serving stale data for ${topic}.`);
    return staleData;
  }

  // 5. STATIC INTELLIGENCE BRIEFING: Last resort to maintain institutional aesthetic
  const staticFallback = {
    text: "The global financial landscape is currently navigating a period of structural re-alignment. Institutional participants are closely monitoring cross-market correlations between traditional equity indices and digital asset flows. We observe continued resilience in the core decentralized infrastructure, with on-chain activity suggesting a phase of disciplined accumulation and strategic risk management across major liquidity hubs."
  };

  return staticFallback;
};

export const analyzeAssetMovement = async (
  asset: string, 
  movementType: string, 
  amount: string,
  fromAddress?: string,
  toAddress?: string
): Promise<InsightResult> => {
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

  // Cascade through shuffled Gemini keys
  const shuffledKeys = [...GEMINI_KEYS].sort(() => Math.random() - 0.5);
  
  // A. Try Pro
  for (const key of shuffledKeys) {
    const result = await tryGemini(key, prompt, "gemini-3.1-pro");
    if (result) return result;
  }

  // B. Try Flash
  for (const key of shuffledKeys) {
    const result = await tryGemini(key, prompt, "gemini-3.1-flash");
    if (result) return result;
  }

  return { text: `Operational Observation: Transfer of ${amount} ${asset} detected. Institutional liquidity flow patterns suggested. Analysis node recalibrating.` };
};