/**
 * prerender.mjs — Post-build static HTML injection
 *
 * Replaces <div id="root"></div> in dist/index.html with fully populated
 * static HTML for each route. Crawlers (Googlebot, GPTBot, etc.) receive
 * real content; React hydrates over it for human users.
 *
 * Run: node scripts/prerender.mjs
 * Triggered automatically by: npm run build
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, '..', 'dist')

// ─── Route configurations with JSON-LD and HTML ──────────────

const ROUTES = {
  '/': {
    title: 'Coinvestopedia | Institutional Crypto Research & Data',
    description: 'Institutional-grade cryptocurrency research, real-time on-chain analytics, macro intelligence, and AI-powered market overviews.',
    html: `
      <main data-page="home">
        <h1>Coinvestopedia — Institutional Crypto Research &amp; Data</h1>
        <p>Coinvestopedia bridges traditional capital markets with digital assets. 
        Free, publicly accessible. No login required.</p>

        <section>
          <h2>AI Market Overview</h2>
          <p>Auto-generated every 4 hours. Synthesizes cross-market correlations 
          between traditional equity indices and digital asset flows. Tracks 
          institutional participant behavior using on-chain activity and macro 
          trend data.</p>
        </section>

        <section>
          <h2>Smart Money Confidence Index</h2>
          <p>Proprietary composite of Exchange Flows, Spent Output Profit Ratio 
          (SOPR), and Miner Reserves. Measures real-time institutional positioning 
          on a 0–100 scale. Current methodology: equal-weighted composite of three 
          on-chain inputs updated every 30 minutes.</p>
        </section>

        <section>
          <h2>Institutional On-Chain Pulse</h2>
          <p>Real-time metrics: Total Value Locked (DeFi), Stablecoin Market Cap, 
          ETH Staking Ratio, DEX Volume (24h). Sourced from on-chain aggregators, 
          refreshed continuously.</p>
        </section>

        <section>
          <h2>The GEO Framework</h2>
          <p>Structured analytical model evaluating Bitcoin across three dimensions: 
          Global Liquidity, Ecosystem Leverage, and On-Chain Activity. Applied 
          monthly as a macro positioning assessment.</p>
        </section>

        <section>
          <h2>Market Pulse (LIVE)</h2>
          <p>TradingView-powered real-time data covering BTC, ETH, SPX, IXIC, 
          XAU/USD, USD/JPY. Cross-asset view designed for institutional 
          portfolio context.</p>
        </section>

        <nav>
          <h2>Platform Sections — All Free, No Login Required</h2>
          <ul>
            <li><a href="/exchanges">Exchange Research &amp; Comparison</a> — 
            Coinvesto AI Score™ across 7 evaluation categories</li>
            <li><a href="/macro-intel">Macro Intelligence</a> — 
            Research articles: Institutional Lens, Geopolitical Decoder, 
            Cross-Market, Weekly Briefing</li>
            <li><a href="/tools">Tools &amp; Calculators</a> — 
            DCA Strategy, Profit/Loss, Impermanent Loss, Position Sizing</li>
            <li><a href="/knowledge">Knowledge Base</a> — 
            On-chain analytics, DeFi mechanics, macro fundamentals</li>
            <li><a href="/the-briefing">The Briefing</a> — 
            Weekly institutional market summary</li>
            <li><a href="/whale-tracker">Whale Tracker</a> — 
            Large holder movement monitoring</li>
            <li><a href="/compare">Asset Comparison</a> — 
            BTC, ETH, Gold, SPY, QQQ, DXY side-by-side</li>
          </ul>
        </nav>
      </main>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Coinvestopedia",
      "url": "https://www.coinvestopedia.com",
      "description": "Institutional-grade cryptocurrency research, real-time on-chain analytics, macro intelligence, and AI-powered market overviews."
    }
  },

  '/macro-intel': {
    title: 'Macro Intelligence | Coinvestopedia',
    description: 'Institutional macro research covering liquidity cycles, DXY regimes, yield curve dynamics, and cross-asset correlations.',
    html: `
      <main data-page="macro-intel">
        <h1>Macro Intelligence — Coinvestopedia</h1>
        <p>Publicly accessible research articles. No login required. 
        Updated regularly. Categorized by confidence level: High, Medium, Low.</p>

        <section>
          <h2>Research Categories</h2>
          <ul>
            <li><strong>Institutional Lens</strong> — Fed balance sheet analysis, 
            TGA mechanics, institutional flow interpretation</li>
            <li><strong>Geopolitical Decoder</strong> — Dollar Milkshake Theory, 
            DXY regime analysis, geopolitical risk and crypto</li>
            <li><strong>Cross-Market</strong> — BTC/ETH correlation with SPX, 
            QQQ, Gold; risk-on/risk-off regime detection</li>
            <li><strong>Weekly Briefing</strong> — Curated weekly summary of 
            macro developments affecting digital assets</li>
          </ul>
        </section>

        <section>
          <h2>Published Research (Sample Titles)</h2>
          <ul>
            <li>Liquidity and Inflation Mechanics: Fed Balance Sheet Runoff vs 
            Crypto Liquidity — 18 min read, High Confidence</li>
            <li>Dollar Milkshake Theory &amp; DXY Regimes — 15 min read, 
            Medium Confidence</li>
            <li>Yield Curve Normalization and US Debt Ceiling — 16 min read, 
            High Confidence</li>
            <li>Net Liquidity Formula: Δ(Fed Assets) – Δ(TGA) – Δ(ON RRP) — 
            Applied framework for Bitcoin cycle analysis</li>
          </ul>
        </section>

        <section>
          <h2>Methodology</h2>
          <p>Articles integrate Federal Reserve H.4.1 data, BEA releases, 
          FRED database metrics, and on-chain signals. Confidence ratings 
          reflect data availability and analytical certainty. 
          All content for informational purposes only.</p>
        </section>
      </main>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Macro Intelligence",
      "description": "Institutional crypto macro research",
      "publisher": {
        "@type": "Organization",
        "name": "Coinvestopedia",
        "url": "https://www.coinvestopedia.com"
      },
      "isAccessibleForFree": true,
      "hasPart": [
        {
          "@type": "Article",
          "name": "Fed Balance Sheet Runoff vs Crypto Liquidity",
          "timeRequired": "PT18M"
        },
        {
          "@type": "Article", 
          "name": "Dollar Milkshake Theory & DXY Regimes",
          "timeRequired": "PT15M"
        }
      ]
    }
  },

  '/exchanges': {
    title: 'Exchange Research & Comparison | Coinvestopedia',
    description: 'Institutional-grade crypto exchange analysis using the Coinvesto AI Score™ across security, fees, liquidity, compliance, and institutional support.',
    html: `
      <main data-page="exchanges">
        <h1>Exchange Research &amp; Comparison — Coinvestopedia</h1>
        <p>Free, publicly accessible. No login required. 
        Evaluated using the Coinvesto AI Score™.</p>

        <section>
          <h2>Coinvesto AI Score™</h2>
          <p>Multi-model AI research synthesis scoring system. Evaluates exchanges 
          across 7 categories. AI-generated scores clearly attributed as such. 
          Not financial advice.</p>
          <ul>
            <li>Security &amp; Custody — cold storage ratio, insurance, 
            proof of reserves, audit history</li>
            <li>Fee Structure — maker/taker spreads, withdrawal fees, 
            VIP tier analysis</li>
            <li>Liquidity &amp; Volume — 24h volume, order book depth, 
            slippage on large orders</li>
            <li>Regulatory Compliance — licensing jurisdictions, 
            KYC/AML standards</li>
            <li>Product Suite — spot, derivatives, staking, lending, API</li>
            <li>User Experience — interface, onboarding, support quality</li>
            <li>Institutional Support — sub-accounts, custody integration, 
            dedicated support</li>
          </ul>
        </section>
      </main>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Exchange Research & Comparison",
      "description": "Institutional-grade crypto exchange analysis using the Coinvesto AI Score™",
      "isAccessibleForFree": true
    }
  },

  '/tools': {
    title: 'Crypto Tools & Calculators | Coinvestopedia',
    description: 'Professional crypto investment calculators: DCA strategy, profit/loss, impermanent loss, position sizing, and asset simulation.',
    html: `
      <main data-page="tools">
        <h1>Crypto Tools &amp; Calculators — Coinvestopedia</h1>
        <p>Free to use. No login required.</p>
        <ul>
          <li><strong>DCA Strategy Calculator</strong> — Dollar-cost averaging 
          return modeling across custom intervals and assets</li>
          <li><strong>Profit/Loss Calculator</strong> — Entry, exit, and 
          fee-adjusted P&amp;L for any asset</li>
          <li><strong>Impermanent Loss Calculator</strong> — AMM liquidity 
          position loss estimation</li>
          <li><strong>Asset Simulator</strong> — Portfolio scenario modeling 
          under historical volatility</li>
          <li><strong>Position Sizing Tool</strong> — Risk-adjusted sizing 
          based on account size and stop-loss level</li>
        </ul>
      </main>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Crypto Tools & Calculators",
      "description": "Professional crypto investment calculators",
      "isAccessibleForFree": true
    }
  },

  '/whale-tracker': {
    title: 'Whale Tracker | Large Holder Monitoring | Coinvestopedia',
    description: 'Real-time monitoring of large cryptocurrency holder movements, exchange flows, and institutional on-chain activity.',
    html: `
      <main data-page="whale-tracker">
        <h1>Whale Tracker — Coinvestopedia</h1>
        <p>Monitors significant on-chain movements by large market participants. 
        Free, publicly accessible.</p>
        <ul>
          <li>Transactions above defined USD thresholds across major networks</li>
          <li>Exchange inflow/outflow — distinguishes sell pressure from 
          custody moves</li>
          <li>Dormant wallet activity — coins unmoved 1+ years beginning 
          to transfer</li>
          <li>Miner wallet behavior — OTC sales vs exchange deposits</li>
        </ul>
      </main>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Whale Tracker",
      "description": "Real-time monitoring of large cryptocurrency holder movements",
      "applicationCategory": "FinanceApplication",
      "isAccessibleForFree": true
    }
  },

  '/knowledge': {
    title: 'Knowledge Base | Coinvestopedia',
    description: 'Institutional-grade crypto education: blockchain fundamentals, DeFi mechanics, on-chain analytics, tokenomics, and macro framework application.',
    html: `
      <main data-page="knowledge">
        <h1>Knowledge Base — Coinvestopedia</h1>
        <p>Free educational library. No login required.</p>
        <ul>
          <li>Blockchain architecture — consensus mechanisms, L1 vs L2, sharding</li>
          <li>DeFi protocols — AMMs, lending, yield strategies, stablecoin models</li>
          <li>On-chain analytics — UTXO analysis, SOPR, MVRV, NVT, 
          exchange flows</li>
          <li>Tokenomics — supply schedules, emission curves, unlock calendars</li>
          <li>Market structure — funding rates, basis trading, options skew</li>
          <li>Macro fundamentals — liquidity cycles, Fed policy, 
          risk-on/off regimes</li>
        </ul>
      </main>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Knowledge Base",
      "description": "Institutional-grade crypto education",
      "isAccessibleForFree": true
    }
  },

  '/the-briefing': {
    title: 'The Briefing | Weekly Institutional Crypto Intelligence | Coinvestopedia',
    description: 'Weekly curated summary of macro, on-chain, regulatory, and institutional developments affecting digital asset markets.',
    html: `
      <main data-page="the-briefing">
        <h1>The Briefing — Weekly Institutional Crypto Intelligence</h1>
        <p>One email per week. No ads. Unsubscribe anytime. Free.</p>
        <ul>
          <li>Macro market developments — equity, forex, commodities, crypto</li>
          <li>On-chain highlights — whale movements, exchange flows</li>
          <li>Regulatory developments — global policy affecting digital assets</li>
          <li>Institutional moves — ETF flows, treasury updates, fund activity</li>
          <li>Protocol events — upgrades, governance votes, major launches</li>
        </ul>
      </main>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "The Briefing",
      "description": "Weekly curated summary of macro, on-chain, regulatory, and institutional developments",
      "isAccessibleForFree": true
    }
  },

  '/compare': {
    title: 'Asset Comparison | Coinvestopedia',
    description: 'Side-by-side comparison of BTC, ETH, Gold, SPY, QQQ, and DXY across performance, volatility, correlation, and allocation metrics.',
    html: `
      <main data-page="asset-comparison">
        <h1>Asset Comparison — Coinvestopedia</h1>
        <p>Cross-asset comparison dashboard. Free, no login required. 
        Assets covered: BTC, ETH, XAU/USD, SPY, QQQ, DXY.</p>
        <ul>
          <li>Performance — YTD, 7-day, 24h, 1-year returns</li>
          <li>Volatility — 30/90-day realized volatility, max drawdown</li>
          <li>Correlation — rolling correlation matrix across all 6 assets</li>
          <li>Allocation — portfolio weight modeling</li>
          <li>Analyst Views — directional bias and confidence ratings</li>
        </ul>
      </main>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Asset Comparison",
      "description": "Cross-asset comparison dashboard for BTC, ETH, Gold, SPY, QQQ, and DXY",
      "applicationCategory": "FinanceApplication",
      "isAccessibleForFree": true
    }
  }
}

// ─── Main ─────────────────────────────────────────────────

function run() {
  const templatePath = path.join(DIST, 'index.html')

  if (!fs.existsSync(templatePath)) {
    console.error('❌ dist/index.html not found. Run vite build first.')
    process.exit(1)
  }

  const template = fs.readFileSync(templatePath, 'utf-8')
  let processed = 0

  for (const [route, config] of Object.entries(ROUTES)) {
    // Inject static content into <div id="root"></div>
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${config.html}</div>`
    )

    // Update <title> tag for this specific route
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${config.title}</title>`
    )

    // Update meta description for this specific route
    html = html.replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${config.description}"`
    )

    // Update canonical URL
    const canonicalUrl = route === '/'
      ? 'https://coinvestopedia.com/'
      : `https://coinvestopedia.com${route}`
    html = html.replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${canonicalUrl}"`
    )

    // Update OG URL
    html = html.replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${canonicalUrl}"`
    )

    // Inject JSON-LD into <head>
    if (config.jsonLd) {
      html = html.replace('</head>', 
        `\n    <script type="application/ld+json">
      ${JSON.stringify(config.jsonLd)}
    </script>\n  </head>`
      )
    }

    // Add hydration guard to prevent FOUC
    const hydrationGuard = `
    <style>#root { visibility: hidden; opacity: 0; transition: opacity 0.15s ease; }</style>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        var r = document.getElementById('root');
        r.style.visibility = 'visible';
        requestAnimationFrame(function() { r.style.opacity = '1'; });
      });
    </script>
    `;
    html = html.replace('</head>', hydrationGuard + '</head>')

    // Write to the correct path
    if (route === '/') {
      fs.writeFileSync(templatePath, html, 'utf-8')
    } else {
      const dir = path.join(DIST, route)
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8')
    }

    processed++
    console.log(`  ✅ ${route}`)
  }

  console.log(`\n🎯 Prerendered ${processed} routes into dist/`)
}

console.log('\n📄 Injecting static HTML for crawlers...\n')
run()
console.log('\n✨ Done! Crawlers will see fully populated HTML.\n')
