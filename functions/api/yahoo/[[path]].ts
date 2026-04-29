// Cloudflare Pages Function — Yahoo Finance proxy
// Replaces the Vite dev proxy for /api/yahoo/* routes in production

export const onRequestGet: PagesFunction = async (context) => {
  const pathSegments = context.params.path as string[];
  const path = pathSegments.join('/');
  const url = new URL(context.request.url);

  const targetUrl = `https://query1.finance.yahoo.com/${path}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
      cf: { cacheTtl: 21600, cacheEverything: true },
    });

    if (!response.ok) {
      return new Response(`Yahoo upstream returned ${response.status}`, {
        status: 502,
      });
    }

    const body = await response.text();

    return new Response(body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: `Yahoo proxy error: ${error.message}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
