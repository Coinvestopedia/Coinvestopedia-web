// functions/[[path]].ts
// Cloudflare Pages Function to inject route-specific SEO & GEO metadata
// This ensures that crawlers (including LLMs like GPTBot, PerplexityBot) see the correct metadata
// without needing to execute client-side JavaScript.

const ROUTE_META: Record<string, { title: string; description: string; type?: string }> = {
  '/': {
    title: 'Coinvestopedia | Institutional Crypto Research & Data',
    description: 'World-class institutional-grade crypto research, educational simulators, whale tracking, and market intelligence.',
  },
  '/compare': {
    title: 'Compare Crypto Exchanges | Coinvestopedia',
    description: 'Compare top cryptocurrency exchanges on fees, regulatory compliance, and institutional features.',
  },
  '/whale-tracker': {
    title: 'Live Whale Tracker & Institutional Flows | Coinvestopedia',
    description: 'Track large-scale cryptocurrency institutional movements, live whale data, and institutional capital flow patterns across blockchains.',
  },
  '/macro-intel': {
    title: 'Macro Intelligence Reports | Coinvestopedia',
    description: 'Deep-dive institutional research and macroeconomic analysis on the cryptocurrency market.',
    type: 'article'
  },
  '/tools': {
    title: 'Crypto Tools & Simulators | Coinvestopedia',
    description: 'Educational simulators, cost of capital calculators, and quantitative tools for finance professionals.',
  },
  '/exchanges': {
    title: 'Exchange Directory & Regulatory Matrix | Coinvestopedia',
    description: 'Comprehensive directory of crypto exchanges and regulatory compliance matrix for institutional investors.',
  },
  '/learn': {
    title: 'Learn Crypto | Coinvestopedia',
    description: 'Educational resources and foundational knowledge for cryptocurrency investing and technology.',
  },
  '/insights': {
    title: 'Market Insights | Coinvestopedia',
    description: 'Latest market insights, trends, and data-driven analysis from the Coinvestopedia research team.',
    type: 'article'
  },
  '/research': {
    title: 'Deep Research | Coinvestopedia',
    description: 'In-depth cryptocurrency research papers and thematic reports.',
    type: 'article'
  },
  '/glossary': {
    title: 'Crypto Glossary | Coinvestopedia',
    description: 'Comprehensive glossary of cryptocurrency, blockchain, and Web3 terminology.',
  }
};

export async function onRequest(context: any) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Let static assets and existing API routes pass through
  if (path.startsWith('/assets/') || path.startsWith('/api/') || path.startsWith('/rss/') || path.includes('.')) {
    return next();
  }

  // Fetch the static index.html from Cloudflare Pages ASSETS
  const indexUrl = new URL('/index.html', request.url);
  const response = await env.ASSETS.fetch(new Request(indexUrl));

  // Determine metadata for the current route
  // Try exact match, or fallback to root, or basic sub-route matching
  let meta = ROUTE_META[path];
  if (!meta) {
    const baseRoute = '/' + path.split('/')[1];
    meta = ROUTE_META[baseRoute] || ROUTE_META['/'];
  }

  // Use HTMLRewriter to inject the metadata
  const rewriter = new HTMLRewriter()
    .on('title', {
      element(element) {
        element.setInnerContent(meta.title);
      }
    })
    .on('meta[name="description"]', {
      element(element) {
        element.setAttribute('content', meta.description);
      }
    })
    .on('meta[property="og:title"]', {
      element(element) {
        element.setAttribute('content', meta.title);
      }
    })
    .on('meta[property="og:description"]', {
      element(element) {
        element.setAttribute('content', meta.description);
      }
    })
    .on('meta[name="twitter:title"]', {
      element(element) {
        element.setAttribute('content', meta.title);
      }
    })
    .on('meta[name="twitter:description"]', {
      element(element) {
        element.setAttribute('content', meta.description);
      }
    })
    .on('head', {
      element(element) {
        // Inject Open Graph URL explicitly
        element.append(`<meta property="og:url" content="${url.href}" />`, { html: true });
        
        // If it's an article type, inject og:type article
        if (meta.type === 'article') {
          element.append(`<meta property="og:type" content="article" />`, { html: true });
        }
      }
    });

  return rewriter.transform(response);
}
