// Cloudflare Pages Function — CoinGecko proxy
// Hardens security by injecting the API key server-side

interface Env {
  COINGECKO_API?: string;
  VITE_COINGECKO_API?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const pathSegments = context.params.path as string[];
  const path = pathSegments.join('/');
  const url = new URL(context.request.url);

  const env = context.env;
  const apiKey = env.COINGECKO_API || env.VITE_COINGECKO_API;

  const targetUrl = new URL(`https://api.coingecko.com/api/v3/${path}`);
  
  // Copy all search params
  url.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'Coinvestopedia/1.0',
    };

    if (apiKey) {
      headers['x-cg-demo-api-key'] = apiKey;
    }

    const response = await fetch(targetUrl.toString(), {
      headers,
      cf: { cacheTtl: 21600, cacheEverything: true },
    });

    if (!response.ok) {
      return new Response(`CoinGecko upstream returned ${response.status}`, { status: 502 });
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
      JSON.stringify({ error: `CoinGecko proxy error: ${error.message}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
