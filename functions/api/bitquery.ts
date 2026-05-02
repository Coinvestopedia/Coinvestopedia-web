// Cloudflare Pages Function — Bitquery proxy

export const onRequestAll: PagesFunction = async (context) => {
  const targetUrl = 'https://streaming.bitquery.io/graphql';

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const env = context.env as { BITQUERY_API_KEY?: string; VITE_BITQUERY_API_KEY?: string };
    const apiKey = env.BITQUERY_API_KEY || env.VITE_BITQUERY_API_KEY;

    if (apiKey) {
      headers['Authorization'] = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;
    }

    const body = context.request.method === 'POST'
      ? await context.request.text()
      : undefined;

    const response = await fetch(targetUrl, {
      method: context.request.method,
      headers,
      body,
    });

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: `Bitquery proxy error: ${error.message}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
