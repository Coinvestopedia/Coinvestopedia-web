/**
 * Cloudflare Pages Function — Market Pulse AI Insights
 */

interface Env {
  GEMINI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), { status: 500 });
  }

  try {
    const { marketContext } = await request.json() as any;
    
    const prompt = `
      You are an elite, institutional-grade crypto analyst for 'Coinvestopedia Knowledge'.
      Context: ${marketContext}
      Generate exactly 5 distinct market insights as a valid JSON array.
      [ { "type": "technical"|"fundamental"|"sentiment"|"onchain", "category": "...", "title": "...", "content": "..." } ]
      Return ONLY the JSON array.
    `;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${errText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    
    return new Response(text, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=60',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'AI Proxy Error', details: String(error) }), { status: 502 });
  }
};
