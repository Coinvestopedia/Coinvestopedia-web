// Cloudflare Pages Function — Dune proxy
export const onRequest: PagesFunction = async (context) => {
  const pathSegments = context.params.path as string[];
  const path = pathSegments.join('/');
  const url = new URL(context.request.url);
  const env = context.env as { DUNE_API_KEY?: string; VITE_DUNE_API_KEY?: string };
  const apiKey = env.DUNE_API_KEY || env.VITE_DUNE_API_KEY;

  const targetUrl = new URL(`https://api.dune.com/${path}`);
  url.searchParams.forEach((v, k) => targetUrl.searchParams.set(k, v));

  try {
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (apiKey) headers['X-Dune-API-Key'] = apiKey;

    const response = await fetch(targetUrl.toString(), { headers });
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
