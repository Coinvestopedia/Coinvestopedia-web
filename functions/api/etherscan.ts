/**
 * Cloudflare Pages Function Proxy for Etherscan
 * Injects ETHERSCAN_API server-side
 */

interface Env {
  ETHERSCAN_API: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const etherscanKey = env.ETHERSCAN_API;
  if (!etherscanKey) {
    return new Response(JSON.stringify({ error: 'ETHERSCAN_API not configured' }), { status: 500 });
  }

  // Construct target Etherscan URL
  // Example: /api/etherscan?module=proxy&... -> https://api.etherscan.io/api?module=proxy&...&apikey=...
  const targetUrl = new URL(`https://api.etherscan.io/api`);
  
  // Copy search params and append apikey
  url.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });
  targetUrl.searchParams.set('apikey', etherscanKey);

  try {
    const etherscanResponse = await fetch(targetUrl.toString());
    const data = await etherscanResponse.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=10',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Etherscan Proxy Error', details: String(error) }), { status: 502 });
  }
};
