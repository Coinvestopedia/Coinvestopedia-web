// Cloudflare Pages Function — RSS proxy
// Replaces the Vite dev proxy for /rss/* routes in production

const RSS_MAP: Record<string, string> = {
  coindesk: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
  cointelegraph: 'https://cointelegraph.com/rss',
  decrypt: 'https://decrypt.co/feed',
};

export const onRequestGet: PagesFunction = async (context) => {
  const source = context.params.source as string;
  const targetUrl = RSS_MAP[source];

  if (!targetUrl) {
    return new Response('Unknown RSS source', { status: 404 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Coinvestopedia/1.0; +https://coinvestopedia.com)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
      cf: { cacheTtl: 21600, cacheEverything: true }, // 6h edge cache
    });

    if (!response.ok) {
      return new Response(`RSS upstream returned ${response.status}`, {
        status: 502,
      });
    }

    const body = await response.text();

    return new Response(body, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(`RSS proxy error: ${error.message}`, { status: 502 });
  }
};
