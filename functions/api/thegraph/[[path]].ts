// Cloudflare Pages Function — The Graph proxy

export const onRequestAll: PagesFunction = async (context) => {
  const pathSegments = context.params.path as string[];
  const path = pathSegments.join('/');
  const url = new URL(context.request.url);

  const targetUrl = `https://api.studio.thegraph.com/${path}${url.search}`;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const body = context.request.method === 'POST'
      ? await context.request.text()
      : undefined;

    const response = await fetch(targetUrl, {
      method: context.request.method,
      headers,
      body,
    });

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: `TheGraph proxy error: ${error.message}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
