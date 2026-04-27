import { GoogleGenAI } from "@google/genai";
// Generic types for Vercel functions to avoid missing @vercel/node module errors
type VercelRequest = any;
type VercelResponse = any;

const GEMINI_KEYS = [
  process.env.VITE_GEMINI_API_KEY || '',
  process.env.VITE_GEMINI_SECOND_FALLBACK_API_KEY || '',
  process.env.VITE_GEMINI_THIRD_FALLBACK_API_KEY || '',
].filter(Boolean);

const SYSTEM_INSTRUCTION = "You are an institutional-grade research analyst for Coinvestopedia. Your goal is to provide data-driven, educational, and strictly neutral observations. DO NOT provide financial advice, trading signals, price predictions, or specific 'buy/sell' recommendations. Maintain an academic and professional tone.";

const tryGemini = async (apiKey: string, prompt: string, model: string = "gemini-3.1-pro") => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    if (response.text) {
      const chunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
      const sources = (chunks as any[])
        .filter((c) => c.web)
        .map((c) => ({ title: c.web!.title, uri: c.web!.uri }));
      return { text: response.text, sources: sources.length > 0 ? sources : undefined };
    }
  } catch (e: any) {
    console.error(`[Vercel Server] Gemini ${model} Failed:`, e?.message || e);
  }
  return null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const topic = (req.query.topic as string) || 'current crypto market';
  
  const enhancedPromptContents = `${SYSTEM_INSTRUCTION}\n\nAnalyze the ${topic} based on LIVE data. Provide a highly accurate, dynamic 3-4 sentence market overview. \nYou MUST cover the following interconnected dynamics:\n1. Current major geopolitical, financial, or political events globally.\n2. How Traditional Markets (TradFi) and Crypto markets are performing today in response.\n3. How these markets and events are actively affecting each other, focusing on structural impacts on the crypto ecosystem.\nBe factual. Do not state that you lack real-time access.`;

  let result = null;
  const shuffledKeys = [...GEMINI_KEYS].sort(() => Math.random() - 0.5);

  // A. Try Gemini 3.1 Pro (Flagship Reasoning)
  for (const key of shuffledKeys) {
    result = await tryGemini(key, enhancedPromptContents, "gemini-3.1-pro");
    if (result) break;
  }

  // B. Try Gemini 3.1 Flash (High Performance)
  if (!result) {
    for (const key of shuffledKeys) {
      result = await tryGemini(key, enhancedPromptContents, "gemini-3.1-flash");
      if (result) break;
    }
  }

  if (!result) {
    const staticFallback = {
      text: "The global financial landscape is currently navigating a period of structural re-alignment. Institutional participants are closely monitoring cross-market correlations between traditional equity indices and digital asset flows. We observe continued resilience in the core decentralized infrastructure, with on-chain activity suggesting a phase of disciplined accumulation and strategic risk management across major liquidity hubs."
    };
    return res.status(200).json(staticFallback);
  }

  // Set Vercel Edge Cache to 6 HOURS (21600 seconds)
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=60');
  
  return res.status(200).json(result);
}
