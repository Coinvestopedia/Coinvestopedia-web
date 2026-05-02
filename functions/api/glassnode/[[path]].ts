// Cloudflare Pages Function — Glassnode proxy
export const onRequest: PagesFunction = async (context) => {
  const pathSegments = context.params.path as string[];
  const path = pathSegments.join('/');
  const url = new URL(context.request.url);
  const env = context.env as { GLASSNODE_API_KEY?: string; VITE_GLASSNODE_API_KEY?: string };
  const apiKey = env.GLASSNODE_API_KEY || env.VITE_GLASSNODE_API_KEY;

  const targetUrl = new URL(`https://api.glassnode.com/${path}`);
  url.searchParams.forEach((v, k) => targetUrl.searchParams.set(k, v));
  if (apiKey) targetUrl.searchParams.set('api_key', apiKey);

  try {
    const response = await fetch(targetUrl.toString());
    const body = await response.text();
    return new Response(body, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=21600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 502 });
  }
};
