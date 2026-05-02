// Cloudflare Pages Function — Whale Alert proxy
export const onRequest: PagesFunction = async (context) => {
  const pathSegments = context.params.path as string[];
  const path = pathSegments.join('/');
  const url = new URL(context.request.url);
  const env = context.env as { WHALE_ALERT_API_KEY?: string; VITE_WHALE_ALERT_API_KEY?: string };
  const apiKey = env.WHALE_ALERT_API_KEY || env.VITE_WHALE_ALERT_API_KEY;

  const targetUrl = new URL(`https://api.whale-alert.io/${path}`);
  url.searchParams.forEach((v, k) => targetUrl.searchParams.set(k, v));
  if (apiKey) targetUrl.searchParams.set('api_key', apiKey);

  try {
    const response = await fetch(targetUrl.toString());
    const body = await response.text();
    return new Response(body, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 502 });
  }
};
