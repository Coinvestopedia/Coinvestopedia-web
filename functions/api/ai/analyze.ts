/**
 * Cloudflare Pages Function — AI Asset Analysis
 */

interface Env {
  GEMINI_API_KEY: string;
}

const SYSTEM_INSTRUCTION = "You are an institutional-grade research analyst for Coinvestopedia. Your goal is to provide data-driven, educational, and strictly neutral observations. DO NOT provide financial advice, trading signals, price predictions, or specific 'buy/sell' recommendations. Maintain an academic and professional tone.";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), { status: 500 });
  }

  try {
    const { asset, movementType, amount, fromAddress, toAddress } = await request.json() as any;
    
    const prompt = `${SYSTEM_INSTRUCTION}
      
      A transfer of ${amount} in ${asset} (${movementType}) just occurred from ${fromAddress || 'Unknown'} to ${toAddress || 'Unknown'}. 
      
      Analyze this specific data point in the context of:
      1. Operational Logic:
         - Describe the flow (e.g., Exchange to Private Wallet, Wallet to Wallet) using institutional terminology.
         - Explain the technical nature of such movements (e.g., cold storage migration, liquidity provisioning) without assuming intent.
      
      2. Contextual Data: Research recent ${asset} structural developments (upgrades, regulatory filings) to provide factual context for this on-chain activity.

      Provide a 2-3 sentence objective observation. Focus on WHAT the data shows, not what it 'implies' for future price action.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        tools: [{ googleSearchRetrieval: {} }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${errText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Analysis unavailable.";
    
    const chunks = data.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));

    return new Response(JSON.stringify({ text, sources: sources.length > 0 ? sources : undefined }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=60',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'AI Analysis Proxy Error', details: String(error) }), { status: 502 });
  }
};
