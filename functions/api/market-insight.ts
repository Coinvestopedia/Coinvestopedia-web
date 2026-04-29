// Cloudflare Pages Function — AI Market Insight
// Converted from Vercel serverless function (api/market-insight.ts)

interface Env {
  VITE_GEMINI_API_KEY?: string;
  VITE_GEMINI_SECOND_FALLBACK_API_KEY?: string;
  VITE_GEMINI_THIRD_FALLBACK_API_KEY?: string;
}

const SYSTEM_INSTRUCTION =
  "You are an institutional-grade research analyst for Coinvestopedia. Your goal is to provide data-driven, educational, and strictly neutral observations. DO NOT provide financial advice, trading signals, price predictions, or specific 'buy/sell' recommendations. Maintain an academic and professional tone.";

async function tryGemini(
  apiKey: string,
  prompt: string,
  model: string = 'gemini-2.0-flash'
): Promise<{ text: string; sources?: any[] } | null> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
        }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (text) {
      const chunks =
        candidate?.groundingMetadata?.groundingChunks || [];
      const sources = chunks
        .filter((c: any) => c.web)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
      return { text, sources: sources.length > 0 ? sources : undefined };
    }
  } catch (e: any) {
    console.error(`[CF Function] Gemini ${model} Failed:`, e?.message || e);
  }
  return null;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const env = context.env;
  const url = new URL(context.request.url);
  const topic = url.searchParams.get('topic') || 'current crypto market';

  const keys = [
    env.VITE_GEMINI_API_KEY || '',
    env.VITE_GEMINI_SECOND_FALLBACK_API_KEY || '',
    env.VITE_GEMINI_THIRD_FALLBACK_API_KEY || '',
  ].filter(Boolean);

  const prompt = `${SYSTEM_INSTRUCTION}\n\nAnalyze the ${topic} based on LIVE data. Provide a highly accurate, dynamic 3-4 sentence market overview. \nYou MUST cover the following interconnected dynamics:\n1. Current major geopolitical, financial, or political events globally.\n2. How Traditional Markets (TradFi) and Crypto markets are performing today in response.\n3. How these markets and events are actively affecting each other, focusing on structural impacts on the crypto ecosystem.\nBe factual. Do not state that you lack real-time access.`;

  let result = null;
  const shuffled = [...keys].sort(() => Math.random() - 0.5);

  // Try gemini-2.0-flash first (fast, reliable)
  for (const key of shuffled) {
    result = await tryGemini(key, prompt, 'gemini-2.0-flash');
    if (result) break;
  }

  // Fallback: gemini-2.0-flash-lite
  if (!result) {
    for (const key of shuffled) {
      result = await tryGemini(key, prompt, 'gemini-2.0-flash-lite');
      if (result) break;
    }
  }

  if (!result) {
    const staticFallback = {
      text: 'The global financial landscape is currently navigating a period of structural re-alignment. Institutional participants are closely monitoring cross-market correlations between traditional equity indices and digital asset flows. We observe continued resilience in the core decentralized infrastructure, with on-chain activity suggesting a phase of disciplined accumulation and strategic risk management across major liquidity hubs.',
    };
    return new Response(JSON.stringify(staticFallback), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=60',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
