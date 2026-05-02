// Cloudflare Pages Function — CryptoPanic proxy
// Replaces the Vite dev proxy for /api/cryptopanic/* routes in production

export const onRequestGet: PagesFunction = async (context) => {
  const pathSegments = context.params.path as string[];
  const path = pathSegments.join('/');
  const url = new URL(context.request.url);

  const env = context.env as { CRYPTOPANIC_API?: string; VITE_CRYPTOPANIC_API?: string };
  const apiKey = env.CRYPTOPANIC_API || env.VITE_CRYPTOPANIC_API;

  const targetUrl = new URL(`https://cryptopanic.com/${path}`);
  // Copy all search params except auth_token (which we inject)
  url.searchParams.forEach((value, key) => {
    if (key !== 'auth_token') targetUrl.searchParams.set(key, value);
  });
  
  if (apiKey) {
    targetUrl.searchParams.set('auth_token', apiKey);
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Coinvestopedia/1.0; +https://coinvestopedia.com)',
      },
      cf: { cacheTtl: 21600, cacheEverything: true },
    });

    if (!response.ok) {
      return new Response(`CryptoPanic upstream returned ${response.status}`, {
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
      JSON.stringify({ error: `CryptoPanic proxy error: ${error.message}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
