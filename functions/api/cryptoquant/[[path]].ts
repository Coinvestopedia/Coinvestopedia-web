// Cloudflare Pages Function — CryptoQuant proxy

export const onRequestAll: PagesFunction = async (context) => {
  const pathSegments = context.params.path as string[];
  const path = pathSegments.join('/');
  const url = new URL(context.request.url);

  const targetUrl = `https://api.cryptoquant.com/${path}${url.search}`;

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (compatible; Coinvestopedia/1.0)',
    };

    // Forward Authorization header if present from client
    const authHeader = context.request.headers.get('Authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    } else if (context.env?.CRYPTOQUANT_API_KEY) {
      // Or use server-side API key if configured
      headers['Authorization'] = `Bearer ${context.env.CRYPTOQUANT_API_KEY}`;
    }

    const response = await fetch(targetUrl, {
      method: context.request.method,
      headers,
      cf: { cacheTtl: 21600, cacheEverything: true },
    });

    const body = await response.text();
    const contentType = response.headers.get('Content-Type') || 'application/json; charset=utf-8';

    return new Response(body, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: `CryptoQuant proxy error: ${error.message}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
