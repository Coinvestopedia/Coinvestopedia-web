/**
 * Cloudflare Pages Function Proxy for Financial Modeling Prep (FMP)
 * Injects FMP_API_KEY server-side
 */

interface Env {
  FMP_API_KEY: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const url = new URL(request.url);
  
  // Extract the path after /api/fmp/
  const path = (params.path as string[])?.join('/') || '';
  if (!path) {
    return new Response(JSON.stringify({ error: 'Path required' }), { status: 400 });
  }

  const fmpKey = env.FMP_API_KEY;
  if (!fmpKey) {
    return new Response(JSON.stringify({ error: 'FMP_API_KEY not configured' }), { status: 500 });
  }

  // Construct target FMP URL
  // Example: /api/fmp/v3/quote/AAPL -> https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=...
  const targetUrl = new URL(`https://financialmodelingprep.com/api/${path}`);
  
  // Copy search params and append apikey
  url.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });
  targetUrl.searchParams.set('apikey', fmpKey);

  try {
    const fmpResponse = await fetch(targetUrl.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Coinvestopedia-Proxy/1.0'
      }
    });

    const data = await fmpResponse.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'FMP Proxy Error', details: String(error) }), { status: 502 });
  }
};
