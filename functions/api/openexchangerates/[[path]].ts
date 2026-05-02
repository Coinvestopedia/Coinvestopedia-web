// Cloudflare Pages Function — Open Exchange Rates proxy
export const onRequest: PagesFunction = async (context) => {
  const pathSegments = context.params.path as string[];
  const path = pathSegments.join('/');
  const url = new URL(context.request.url);
  const env = context.env as { OPEN_EXCHANGE_APP_ID?: string; VITE_OPEN_EXCHANGE_APP_ID?: string };
  const apiKey = env.OPEN_EXCHANGE_APP_ID || env.VITE_OPEN_EXCHANGE_APP_ID;

  const targetUrl = new URL(`https://openexchangerates.org/${path}`);
  url.searchParams.forEach((v, k) => targetUrl.searchParams.set(k, v));
  if (apiKey) targetUrl.searchParams.set('app_id', apiKey);

  try {
    const response = await fetch(targetUrl.toString());
    const body = await response.text();
    return new Response(body, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 502 });
  }
};
