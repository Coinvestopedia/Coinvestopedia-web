/**
 * PrerenderFallbacks.tsx
 *
 * Static HTML content served to crawlers during prerender snapshots.
 * Each component mirrors the real page's content structure but uses
 * no API calls, animations, or dynamic state.
 *
 * Import and use like:
 *   const isPrerendering = useIsPrerendering()
 *   if (isPrerendering) return <HomeStatic />
 */

import React from 'react'

// ─── HOME ─────────────────────────────────────────────────
export const HomeStatic: React.FC = () => (
  <main data-page="home">
    <h1>Coinvestopedia — Institutional Crypto Research &amp; Data</h1>
    <p>
      Coinvestopedia bridges traditional capital markets with digital assets,
      providing institutional-grade cryptocurrency research, real-time on-chain
      analytics, macro intelligence, and AI-powered market overviews for
      professional investors, hedge funds, family offices, and crypto analysts.
    </p>

    <section>
      <h2>AI Market Overview</h2>
      <p>
        A synthesis engine that monitors cross-market correlations between
        traditional equity indices and digital asset flows. Tracks institutional
        participant behavior using on-chain activity and macro trend data to
        generate high-level strategic intelligence.
      </p>
    </section>

    <section>
      <h2>Smart Money Confidence Index</h2>
      <p>
        A proprietary composite metric derived from three on-chain inputs:
        Exchange Flows, Spent Output Profit Ratio (SOPR), and Miner Reserves.
        Measures real-time institutional positioning in the digital asset market.
      </p>
    </section>

    <section>
      <h2>Institutional On-Chain Pulse</h2>
      <p>
        Real-time metrics tracking global digital asset flows and blockchain
        network utilization. Covers major Layer 1 networks, smart contract
        platforms, and DeFi ecosystems.
      </p>
    </section>

    <section>
      <h2>Market Pulse (LIVE)</h2>
      <p>
        Aggregated real-time market data powered by TradingView. Covers crypto
        asset pricing, traditional equity indices (SPX, IXIC), forex (USD/JPY),
        and commodities (XAU/USD), reinforcing a cross-asset analytical approach.
      </p>
    </section>

    <section>
      <h2>Fear &amp; Greed Index</h2>
      <p>
        Real-time sentiment indicator for the cryptocurrency market. Composite
        of volatility, market momentum, social signals, and dominance metrics.
      </p>
    </section>

    <section>
      <h2>The GEO Framework</h2>
      <p>
        A structured analytical model for evaluating Bitcoin's macro positioning
        across three dimensions: Global Liquidity, Ecosystem Leverage, and
        On-Chain Activity.
      </p>
    </section>

    <nav aria-label="Site sections">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/exchanges">Exchange Research &amp; Comparison</a></li>
        <li><a href="/macro-intel">Macro Intelligence</a></li>
        <li><a href="/tools">Tools &amp; Calculators</a></li>
        <li><a href="/knowledge">Knowledge Base</a></li>
        <li><a href="/the-briefing">The Briefing</a></li>
        <li><a href="/whale-tracker">Whale Tracker</a></li>
        <li><a href="/asset-comparison">Asset Comparison</a></li>
      </ul>
    </nav>
  </main>
)

// ─── EXCHANGES ────────────────────────────────────────────
export const ExchangesStatic: React.FC = () => (
  <main data-page="exchanges">
    <h1>Crypto Exchange Research &amp; Comparison — Coinvestopedia</h1>
    <p>
      Institutional-grade analysis and comparison of cryptocurrency exchanges.
      Evaluated across security infrastructure, fee structures, liquidity depth,
      regulatory compliance, and institutional service offerings.
    </p>

    <section>
      <h2>Coinvesto AI Score™</h2>
      <p>
        A multi-model AI research synthesis score evaluating each exchange across
        seven categories: Security &amp; Custody, Fee Structure, Liquidity &amp; Volume,
        Regulatory Compliance, Product Suite, User Experience, and Institutional
        Support. Scores are generated via AI analysis and clearly attributed as such.
      </p>
    </section>

    <section>
      <h2>Exchange Categories</h2>
      <ul>
        <li>Centralized Exchanges (CEX) — Full order book, fiat on-ramps, institutional custody</li>
        <li>Decentralized Exchanges (DEX) — Non-custodial, on-chain settlement, AMM and order book models</li>
        <li>Derivatives Platforms — Perpetuals, options, and structured products</li>
        <li>OTC Desks — Block trading for institutional size orders</li>
      </ul>
    </section>

    <section>
      <h2>Evaluation Criteria</h2>
      <ul>
        <li>Security: Cold storage ratio, insurance funds, audit history, proof of reserves</li>
        <li>Fees: Maker/taker spreads, withdrawal fees, VIP tier structures</li>
        <li>Liquidity: 24h volume, order book depth, slippage on large orders</li>
        <li>Compliance: Licensing jurisdictions, KYC/AML standards, regulatory history</li>
        <li>Products: Spot, derivatives, staking, lending, API access</li>
        <li>Institutional: Sub-accounts, dedicated support, custody integration</li>
      </ul>
    </section>
  </main>
)

// ─── MACRO INTEL ──────────────────────────────────────────
export const MacroIntelStatic: React.FC = () => (
  <main data-page="macro-intel">
    <h1>Macro Intelligence — Coinvestopedia</h1>
    <p>
      Cross-asset macroeconomic analysis for digital asset investors. Tracks
      global liquidity cycles, central bank policy, equity market correlations,
      and their impact on cryptocurrency market structure.
    </p>

    <section>
      <h2>Global Liquidity Monitoring</h2>
      <p>
        Tracks M2 money supply expansions, Fed balance sheet movements, and
        global central bank policy to identify liquidity-driven crypto market cycles.
      </p>
    </section>

    <section>
      <h2>Cross-Asset Correlations</h2>
      <p>
        Measures rolling correlations between Bitcoin, Ethereum, and traditional
        asset classes including SPX, NASDAQ, Gold (XAU/USD), and DXY. Identifies
        risk-on/risk-off regime shifts.
      </p>
    </section>

    <section>
      <h2>Institutional Flow Tracking</h2>
      <p>
        Monitors ETF inflows/outflows, futures positioning (CME open interest),
        and options market structure to infer institutional sentiment and positioning.
      </p>
    </section>
  </main>
)

// ─── TOOLS ────────────────────────────────────────────────
export const ToolsStatic: React.FC = () => (
  <main data-page="tools">
    <h1>Crypto Investment Tools &amp; Calculators — Coinvestopedia</h1>
    <p>
      Professional-grade calculators and analytical tools for digital asset
      investors. Covers DCA strategy modeling, profit/loss analysis, impermanent
      loss calculation, and portfolio allocation frameworks.
    </p>

    <section>
      <h2>Available Tools</h2>
      <ul>
        <li>DCA Strategy Calculator — Dollar-cost averaging return modeling across custom intervals</li>
        <li>Profit/Loss Calculator — Entry, exit, and fee-adjusted P&amp;L for any asset</li>
        <li>Impermanent Loss Calculator — AMM liquidity position loss estimation</li>
        <li>Asset Simulator — Scenario modeling for portfolio allocations under historical volatility</li>
        <li>Position Sizing Tool — Risk-adjusted position sizing based on account size and stop-loss</li>
      </ul>
    </section>
  </main>
)

// ─── KNOWLEDGE ────────────────────────────────────────────
export const KnowledgeStatic: React.FC = () => (
  <main data-page="knowledge">
    <h1>Crypto Knowledge Base — Coinvestopedia</h1>
    <p>
      Institutional-grade educational library covering blockchain fundamentals,
      DeFi mechanics, on-chain analytics, and traditional finance concepts applied
      to digital asset markets.
    </p>

    <section>
      <h2>Topics Covered</h2>
      <ul>
        <li>Blockchain architecture — consensus mechanisms, Layer 1 vs Layer 2, sharding</li>
        <li>DeFi protocols — AMMs, lending platforms, yield strategies, stablecoin models</li>
        <li>On-chain analytics — UTXO analysis, SOPR, MVRV, NVT ratio, exchange flows</li>
        <li>Tokenomics — supply schedules, emission curves, vesting structures, unlock calendars</li>
        <li>Market structure — order book dynamics, funding rates, basis trading, options skew</li>
        <li>Macro fundamentals — liquidity cycles, risk-on/off regimes, Fed policy impact</li>
        <li>Portfolio theory — modern portfolio theory applied to digital assets, Sharpe ratio, correlation matrices</li>
      </ul>
    </section>
  </main>
)

// ─── THE BRIEFING ─────────────────────────────────────────
export const BriefingStatic: React.FC = () => (
  <main data-page="the-briefing">
    <h1>The Briefing — Daily Institutional Crypto Intelligence</h1>
    <p>
      A curated daily summary of the most relevant developments in cryptocurrency
      and traditional finance markets. Written for institutional investors and
      professional analysts who need signal, not noise.
    </p>

    <section>
      <h2>Coverage Areas</h2>
      <ul>
        <li>Macro market developments — equity, forex, commodities, and crypto</li>
        <li>On-chain activity highlights — whale movements, exchange inflows/outflows</li>
        <li>Regulatory developments — global policy updates affecting digital assets</li>
        <li>Institutional moves — ETF flows, public company treasury updates, fund activity</li>
        <li>Protocol-level events — upgrades, exploits, governance votes, major launches</li>
      </ul>
    </section>
  </main>
)

// ─── WHALE TRACKER ────────────────────────────────────────
export const WhaleTrackerStatic: React.FC = () => (
  <main data-page="whale-tracker">
    <h1>Whale Tracker — Large Holder Monitoring — Coinvestopedia</h1>
    <p>
      Real-time monitoring of significant cryptocurrency transactions and wallet
      movements by large market participants. Identifies accumulation patterns,
      exchange deposits/withdrawals, and inter-wallet transfers that signal
      institutional activity.
    </p>

    <section>
      <h2>What Is Tracked</h2>
      <ul>
        <li>Transactions above defined USD thresholds across major blockchain networks</li>
        <li>Exchange inflow/outflow by address cluster — distinguishes sell pressure vs custody moves</li>
        <li>Dormant wallet activity — coins unmoved for 1+ years beginning to transfer</li>
        <li>Miner wallet behavior — OTC sales vs exchange deposits</li>
        <li>Smart contract interactions by known institutional address labels</li>
      </ul>
    </section>
  </main>
)

// ─── ASSET COMPARISON ─────────────────────────────────────
export const AssetComparisonStatic: React.FC = () => (
  <main data-page="asset-comparison">
    <h1>Crypto Asset Comparison — Coinvestopedia</h1>
    <p>
      Side-by-side comparison of digital assets across fundamental, technical,
      and on-chain metrics. Designed for institutional due diligence and
      portfolio allocation research.
    </p>

    <section>
      <h2>Comparison Dimensions</h2>
      <ul>
        <li>Market structure — market cap, circulating supply, fully diluted valuation</li>
        <li>On-chain health — active addresses, transaction volume, NVT ratio</li>
        <li>Volatility profile — 30/90-day realized volatility, max drawdown history</li>
        <li>Liquidity — average daily volume, exchange distribution, bid-ask spread</li>
        <li>Tokenomics — supply schedule, inflation rate, unlock events</li>
        <li>Developer activity — GitHub commits, protocol upgrades, ecosystem growth</li>
      </ul>
    </section>
  </main>
)
