import { PageMeta, articleSchema, faqSchema } from '../components/PageMeta';


import { KeyInsights } from '../components/KeyInsights';
import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import {
  Clock, Globe, TrendingUp, Shield, BarChart3, 
  AlertTriangle, Eye, Database, Layers, Archive as ArchiveIcon, 
  Lock, Zap, ArrowUpRight, ArrowDownRight, HelpCircle,
  Activity, Sparkles, Calendar, ChevronRight, Maximize2,
  ChevronDown, Filter, Search, Download
} from 'lucide-react';
import { fetchMacroIndicators, fetchDefiLlamaTVL } from '../services/api';
import { LivePrice } from '../components/LivePrice';

import { useAppContext } from '../context/AppContext';
import { PageRoute } from '../types';
import { MobilePageCategories } from '../components/MobilePageCategories';
import { trackEvent } from '../utils/analytics';


// ─── TYPES ────────────────────────────────────────────────────────────────────

type MacroTab = 'all' | 'weekly' | 'geopolitical' | 'cross-market' | 'institutional' | 'archive';

interface ReportSection {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

interface MacroReport {
  id: string;
  title: string;
  subtitle: string;
  tab: MacroTab;
  date: string;
  readTime: string;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  keyMetrics: { label: string; value?: string; direction?: 'up' | 'down' | 'neutral'; symbol?: string; format?: 'currency' | 'number' | 'percent' }[];
  keyInsights: string[];
  sections: ReportSection[];
  faq?: { question: string; answer: string }[];
}

// ─── TABS ─────────────────────────────────────────────────────────────────────

const TABS: { id: MacroTab; label: string; icon: React.ReactNode; isPro?: boolean }[] = [
  { id: 'all', label: 'All Intel', icon: <Layers size={16} /> },
  { id: 'weekly', label: 'Weekly Briefing', icon: <Zap size={16} /> },
  { id: 'geopolitical', label: 'Geopolitical Decoder', icon: <Globe size={16} /> },
  { id: 'cross-market', label: 'Cross-Market', icon: <BarChart3 size={16} /> },
  { id: 'institutional', label: 'Institutional Lens', icon: <Eye size={16} /> },
  { id: 'archive', label: 'Archive', icon: <ArchiveIcon size={16} />, isPro: true },
];

// ─── SEED REPORTS ─────────────────────────────────────────────────────────────

const REPORTS: MacroReport[] = [
  {
    id: 'ppi-shock-risk-off',
    title: `Producer Price Shock: Systemic Implications for BTC/Markets`,
    subtitle: `How May's 6.5% PPI surge and the KOSPI collapse are enforcing a 'higher-for-longer' regime.`,
    tab: 'weekly',
    date: 'June 23, 2026',
    readTime: '12 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"May PPI (YoY)","value":"6.5%","direction":"up"},{"label":"10Y Treasury","value":"4.49%","direction":"up"},{"label":"30-Day ETF Outflows","value":"$8.0B","direction":"down"}],
    keyInsights: ["U.S. Producer Price Index spiked 6.5% YoY in May, cementing a restrictive Fed.","Global equities violently corrected, with the Nasdaq dropping 2% and South Korea's KOSPI plunging 10%.","Institutional digital asset outflows hit $8 billion over the past 30 days as capital rotates to yield.","BlackRock's BITA launch signals a shift toward yield-generation to combat high risk-free rates."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">The macroeconomic landscape shifted violently on June 23 as the May Producer Price Index (PPI) registered a shocking <span className="text-emerald-400 font-bold">6.5%</span> year-over-year increase, the largest since late 2022. This inflationary resurgence entirely dismantled remaining hopes for near-term Federal Reserve rate cuts, enforcing a 'higher-for-longer' reality. The immediate shockwave triggered a global equity liquidation: the Nasdaq shed <span className="text-emerald-400 font-bold">2%</span>, while South Korea's KOSPI index plummeted an unprecedented <span className="text-emerald-400 font-bold">10%</span>, forcing trading halts. Bitcoin, acting as a high-beta liquidity proxy, broke down to $62,000, finalizing $575 million in long liquidations.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (<><p className="mb-4">**1. The Yield Vector:** With the 10-year Treasury note anchored at <span className="text-emerald-400 font-bold">4.49%</span> and the 2-year surging to <span className="text-emerald-400 font-bold">4.19%</span>, the risk-free rate provides a formidable alternative to zero-yield digital assets.</p><p className="mb-4">**2. The Liquidity Vacuum:** An $8 billion exodus from spot Bitcoin ETFs over the last 30 days highlights institutional de-risking. Capital is retreating from structural crypto exposure.</p><p className="mb-4">**3. The Yield-Generation Pivot:** In response to high rates, BlackRock launched the iShares Bitcoin Premium Income ETF (BITA), utilizing covered calls to generate 15<span className="text-red-400 font-bold">-25%</span> yields, attempting to make BTC palatable in a <span className="text-emerald-400 font-bold">5%</span> risk-free world.</p></>),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (<><ul className="space-y-4 mb-4"><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**The $60K Support Level:</strong><span className="text-text-muted">** If BTC loses the $60,000 structural support, forced selling from momentum quant funds will likely trigger.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**ETF Flow Reversals:</strong><span className="text-text-muted">** Monitoring if BlackRock's BITA can stanch the bleeding of the $8 billion 30-day outflow trend.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**PCE Print:</strong><span className="text-text-muted">** The upcoming Personal Consumption Expenditures data will serve as the final confirmation of the Fed's next dot-plot trajectory.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**Tech Equity Correlation:</strong><span className="text-text-muted">** Assessing if the AI/semiconductor sell-off (Nvidia, Alphabet, SK Hynix) finds a floor, stabilizing the broader risk-on beta.</span></div></li></ul></>),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4">**Base Case (<span className="text-emerald-400 font-bold">60%</span>):** 'Higher for Longer' persists. BTC ranges tightly between $58,000 and $64,000 as institutional capital remains sidelined in Treasuries and yield-generating products like BITA.</p><p className="mb-4">**Bull Case (<span className="text-emerald-400 font-bold">15%</span>):** The KOSPI collapse and tech sell-off force central banks to preemptively inject liquidity, causing a sudden bid for scarce assets. BTC reclaims $68,000.</p><p className="mb-4">**Bear Case (<span className="text-emerald-400 font-bold">25%</span>):** Inflation data continues to run hot, pushing the 10-year yield toward <span className="text-emerald-400 font-bold">5.0%</span>. The tech bubble deflates further, dragging BTC down to the $52,000 macro support zone.</p></>),
      },
    ]
  },
  {
    id: 'pce-pause-institutional-indecision',
    title: `The PCE Pause: Institutional Indecision Ahead of Critical Inflation Print`,
    subtitle: `How the impending June 25 core PCE data and a hawkish Fed are paralyzing digital asset momentum.`,
    tab: 'weekly',
    date: 'June 22, 2026',
    readTime: '6 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"2-Year Treasury Yield","value":"4.23%","direction":"up"},{"label":"DXY Index","value":"101.0","direction":"up"},{"label":"BTC 24h Volatility","value":"Low","direction":"down"}],
    keyInsights: ["Market participants have entered a holding pattern ahead of Thursday's May PCE inflation release, keeping Bitcoin pinned near $64,000.","The 2-year Treasury yield hit a 16-month high of 4.23%, reflecting entrenched expectations for a 'higher-for-longer' Fed policy under Chair Kevin Warsh.","While spot Bitcoin ETF outflows are decelerating, institutions remain hesitant to allocate fresh capital until the inflation trajectory is confirmed.","The U.S. dollar's strength (DXY > 101.0) continues to act as a mechanical headwind for dollar-denominated risk assets."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">The global financial system has entered a state of suspended animation as of late June 22. Following the Federal Reserve's overtly hawkish pivot—where policymakers raised their 2026 terminal rate projection to <span className="text-emerald-400 font-bold">3.8%</span>—markets are desperate for data validation. All eyes are now fixed on the upcoming May Personal Consumption Expenditures (PCE) price index, the Fed's preferred inflation gauge, scheduled for June 25. This anticipation has pushed the 2-year Treasury yield to a 16-month high of <span className="text-emerald-400 font-bold">4.23%</span> and kept the US Dollar Index (DXY) firmly above 101.0. Consequently, Bitcoin is trapped in a tight $64,000–$64,500 band, lacking the macro catalyst necessary to break resistance or the institutional panic required to breach support.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (<><p className="mb-4">**1. The Yield Curve Anchor:** The sharp rise in the 2-year yield to <span className="text-emerald-400 font-bold">4.23%</span> directly competes with digital asset allocations. Short-duration, risk-free paper is currently offering a compelling premium, draining momentum liquidity from the crypto ecosystem.</p><p className="mb-4">**2. The Dollar Dominance Channel:** A DXY trading near 101.0 creates a persistent, mechanical headwind. As the dollar strengthens on hawkish rate expectations, non-yielding assets priced in dollars automatically face downward pressure.</p><p className="mb-4">**3. The Institutional Pause:** Institutional allocators are notoriously data-dependent. While the severe $6.35B outflow from spot Bitcoin ETFs has decelerated, asset managers are refusing to deploy new capital 'blind' into a potentially hot inflation print, resulting in an anemic, low-volume consolidation phase.</p></>),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (<><ul className="space-y-4 mb-4"><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**May Core PCE (June 25):</strong><span className="text-text-muted">** The definitive signal for the week. A print above expectations will cement the Fed's hawkish trajectory and likely trigger a crypto sell-off.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**ICE and OKX Joint Venture:</strong><span className="text-text-muted">** The newly announced partnership to build a U.S.-regulated broker-dealer signals long-term institutional commitment despite short-term macro headwinds.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**U.S.-Iran Negotiations:</strong><span className="text-text-muted">** Progress in Switzerland has eased oil prices; any breakdown could cause an energy shock, complicating the Fed's inflation fight.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**Stablecoin AML Regulations:</strong><span className="text-text-muted">** Proposed rules classifying Permitted Payment Stablecoin Issuers as financial institutions under the Bank Secrecy Act.</span></div></li></ul></>),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4">**Base Case (<span className="text-emerald-400 font-bold">65%</span> Probability):** The PCE prints in line with expectations. Bitcoin remains range-bound between $62,000 and $66,000. Institutions slowly resume systematic accumulation, but explosive upside remains capped by the <span className="text-emerald-400 font-bold">4.50%</span> 10-year Treasury yield.</p><p className="mb-4">**Bear Case (<span className="text-emerald-400 font-bold">25%</span> Probability):** Core PCE comes in significantly hot. The market prices in near-zero probability of rate cuts in 2026. The 2-year yield spikes toward <span className="text-emerald-400 font-bold">4.40%</span>, triggering a brutal risk-off rotation that breaks Bitcoin's $60,000 psychological support.</p><p className="mb-4">**Bull Case (<span className="text-emerald-400 font-bold">10%</span> Probability):** The PCE print shows a dramatic, unexpected disinflationary drop. The yield curve shifts downward, the DXY breaks below 100, and institutional capital violently rotates back into spot Bitcoin ETFs, driving a swift rally toward $68,000.</p></>),
      },
    ]
  },
  {
    id: 'warsh-pivot-terminal-rate-crypto',
    title: `The Warsh Pivot: 3.8% Terminal Rate Projections Suppress Crypto Multiples`,
    subtitle: `How the FOMC's abrupt hawkish shift and elevated 2026 inflation targets are rewiring institutional risk appetite and sapping liquidity from digital assets.`,
    tab: 'weekly',
    date: 'June 22, 2026',
    readTime: '6 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"Projected 2026 Terminal Rate","value":"3.80%","direction":"up"},{"label":"10-Year Treasury Yield","value":"4.49%","direction":"up"},{"label":"Spot BTC ETF 30-Day Outflow","value":"$6.35B","direction":"down"}],
    keyInsights: ["Fed Chair Kevin Warsh’s debut FOMC meeting eliminated forward guidance and raised the median 2026 Fed Funds projection to 3.8%.","Core PCE inflation forecasts were aggressively adjusted upward to 3.3%, signaling a prolonged battle against structural inflation.","The 2-year Treasury yield surged 13 basis points to multi-year highs, sharply steepening the opportunity cost for holding zero-yield assets like Bitcoin.","Institutional capital has responded defensively, driving a historic $6.35 billion 30-day net outflow from U.S. spot Bitcoin ETFs."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">The June 2026 FOMC meeting fundamentally altered the macroeconomic baseline. Under the new leadership of Chair Kevin Warsh, the Federal Reserve not only held the federal funds rate at <span className="text-emerald-400 font-bold">3.50%</span>–<span className="text-emerald-400 font-bold">3.75%</span> but executed a hawkish pivot that surprised dovish consensus. Policymakers aggressively revised their Summary of Economic Projections (SEP), elevating the 2026 core PCE inflation target to <span className="text-emerald-400 font-bold">3.3%</span> due to resilient energy shocks and labor market tightness. Consequently, the median projection for the terminal rate jumped to <span className="text-emerald-400 font-bold">3.8%</span>. This 'higher-for-longer' reality pushed the US Dollar Index (DXY) to a one-year high and anchored the 10-year Treasury yield near <span className="text-emerald-400 font-bold">4.49%</span>, creating a fiercely competitive environment for risk assets.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (<><p className="mb-4">**1. The Liquidity Vacuum:** The immediate repricing of the short-end of the yield curve (with 2-year yields spiking 13 basis points) acts as a direct liquidity drain. Capital that previously sought momentum in Bitcoin is now finding <span className="text-emerald-400 font-bold">4%</span>+ risk-free yields highly attractive.</p><p className="mb-4">**2. The Currency Channel:** The resurgent DXY mechanically suppresses dollar-denominated assets. The 30-day rolling correlation between BTC and the DXY has deepened to -0.68, meaning dollar strength is actively suppressing Bitcoin's technical rebounds near the $64,000 level.</p><p className="mb-4">**3. The Institutional Exodus:** Institutional allocators operate on risk-adjusted return metrics. The rising risk-free rate has compressed the equity risk premium proxy for crypto, triggering a record six consecutive weeks of withdrawals from U.S. spot Bitcoin ETFs, totaling $6.35 billion.</p></>),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (<><ul className="space-y-4 mb-4"><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**May PCE Print (June 25):</strong><span className="text-text-muted">** The market is bracing for the Bureau of Economic Analysis release. A print above the <span className="text-emerald-400 font-bold">3.3%</span> Fed forecast could trigger a catastrophic repricing of risk assets.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**$63,000 Technical Support:</strong><span className="text-text-muted">** Analysts are monitoring the $63,000–$64,000 consolidation zone. A high-volume breakdown below this could force systemic liquidations.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**U.S.-Iran Diplomatic Progress:</strong><span className="text-text-muted">** Vice President JD Vance's negotiations in Switzerland. A breakdown in talks could spark an oil price shock, further entrenching the Fed's hawkish bias.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**MiCA Compliance Cliff (July 1):</strong><span className="text-text-muted">** The impending deadline for European service providers threatens to temporarily fragment liquidity across EU trading venues.</span></div></li></ul></>),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4">**Base Case (<span className="text-emerald-400 font-bold">60%</span> Probability):** The Fed maintains its <span className="text-emerald-400 font-bold">3.75%</span> hold through Q3 as inflation remains sticky. Bitcoin continues to consolidate in a tight, low-volatility $60,000–$66,000 range as ETF outflows gradually taper but fail to reverse into net inflows until macroeconomic clarity emerges.</p><p className="mb-4">**Bear Case (<span className="text-emerald-400 font-bold">25%</span> Probability):** The May PCE print severely misses expectations to the upside, forcing the Fed to actively hike rates to <span className="text-emerald-400 font-bold">4.00%</span>. The 10-year yield breaks <span className="text-emerald-400 font-bold">4.70%</span>, triggering a massive risk-off liquidation event that breaks Bitcoin's $59,000 miner-surrender support.</p><p className="mb-4">**Bull Case (<span className="text-emerald-400 font-bold">15%</span> Probability):** Disinflation resumes faster than the Fed's pessimistic projections, and geopolitical tensions ease, lowering oil prices. The DXY retreats, providing breathing room for Bitcoin to reclaim the $68,000 psychological threshold.</p></>),
      },
    ]
  },
  {
    id: 'strait-of-hormuz-energy-deflation-meets-hawkish-fed-june-2026',
    title: `Strait of Hormuz Reopens: Energy Deflation Meets a Hawkish Fed Framework`,
    subtitle: `As 17 million barrels of oil resume transit through the Strait of Hormuz, energy-driven inflation cools—but the Fed's hawkish posturing keeps risk assets grounded.`,
    tab: 'weekly',
    date: 'June 20, 2026',
    readTime: '15 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"BTC Price","value":"$63,500–$63,700","direction":"up"},{"label":"Brent Crude","value":"$80/bbl","direction":"down"},{"label":"Spot BTC ETF Outflows","value":"$90.66M","direction":"down"},{"label":"Gold Price","value":"$4,173/oz","direction":"down"}],
    keyInsights: ["The U.S.-Iran memorandum of understanding has reopened the Strait of Hormuz, allowing 55 merchant ships carrying over 17 million barrels of oil to transit, significantly easing energy inflation pressures.","Despite the deflationary energy signal, the Federal Reserve's hawkish hold (3.5%–3.75%) and upwardly revised 2026 PCE inflation forecast (3.6%) maintain a structurally tight financial environment.","Bitcoin is attempting a technical bounce from $59,100 lows to the $63,600 zone, but faces heavy institutional selling, evidenced by recent $90.66 million daily outflows from U.S. spot ETFs.","The Bank of England and the Swiss National Bank holding rates steady reflects a global central bank consensus prioritizing inflation containment over immediate growth stimulation."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">A critical geopolitical bottleneck has been unblocked, sending immediate disinflationary signals through the global energy complex. The U.S.-Iran memorandum of understanding has effectively reopened the Strait of Hormuz, a chokepoint that handles a significant portion of global petroleum liquids consumption. On June 20, U.S. Central Command confirmed the transit of 55 merchant ships carrying over 17 million barrels of oil. Brent crude responded by stabilizing near $80 per barrel, breaking a sustained period of risk-premium pricing.</p><p className="mb-4">However, this positive supply-side shock is clashing directly with a stubbornly hawkish U.S. Federal Reserve. Under Chair Kevin Warsh, the FOMC opted to hold the federal funds rate at <span className="text-emerald-400 font-bold">3.5%</span>–<span className="text-emerald-400 font-bold">3.75%</span> while sharply increasing its 2026 PCE inflation forecast from <span className="text-emerald-400 font-bold">2.7%</span> to <span className="text-emerald-400 font-bold">3.6%</span>. This signals a fundamental shift: the Fed is looking past volatile energy prices and focusing on sticky core inflation, ensuring that the risk-free rate remains elevated despite geopolitical de-escalation.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (<><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">Channel 1 — The Energy-Yield Paradox</h4><p className="text-xs text-text-muted">Historically, a drop in crude prices reduces inflation expectations, pulling down long-end Treasury yields. However, the Fed's aggressive terminal rate posturing has short-circuited this transmission. While Brent falls, the 2-year yield remains anchored above <span className="text-emerald-400 font-bold">4.20%</span>, creating an inverted environment where energy relief does not translate into liquidity relief for risk assets.</p></div><div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">Channel 2 — The Dollar Supremacy</h4><p className="text-xs text-text-muted">The DXY continues to hover near one-year highs, supported by the yield differential between the U.S. and Europe (where the ECB recently hiked to <span className="text-emerald-400 font-bold">2.25%</span>). A strong dollar mathematically suppresses Bitcoin's purchasing power parity, explaining why BTC has struggled to reclaim $70,000 despite the lack of systemic crypto-native shocks.</p></div><div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">Channel 3 — Institutional Capital Flight</h4><p className="text-xs text-text-muted">The combination of high risk-free yields and strong dollar performance has triggered a defensive rotation out of spot Bitcoin ETFs. With recent daily outflows hitting $90.66 million, traditional asset managers are prioritizing <span className="text-emerald-400 font-bold">4.4%</span>+ risk-free Treasury yields over the volatility of digital assets in a tight liquidity regime.</p></div></div></>),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (<><ul className="space-y-4 mb-4"><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">Strait of Hormuz Transit Volumes:</strong><span className="text-text-muted"> A sustained flow above 15 million barrels per day is required to keep Brent crude suppressed below the $85 threshold, which is critical for global disinflationary narratives.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">DXY Resistance at 106.0:</strong><span className="text-text-muted"> The U.S. Dollar Index is testing multi-month highs. A confirmed breakout above this level would signal extreme global liquidity tightening, likely forcing BTC below the $60,000 support floor.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">Spot ETF Cumulative Flows:</strong><span className="text-text-muted"> The current trend of net negative flows must reverse. A return to consistent $50M+ daily inflows is necessary to absorb the current structural sell pressure from leveraged derivatives liquidations.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">U.S. Core PCE Print:</strong><span className="text-text-muted"> The next inflation release will determine if the Fed's upwardly revised <span className="text-emerald-400 font-bold">3.6%</span> forecast is accurate. A downside surprise is the most probable catalyst for a dovish Fed pivot.</span></div></li></ul></>),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4"><strong>Base Case (60% probability):</strong> The Strait of Hormuz remains open but geopolitical friction persists. The Fed maintains its hawkish hold through Q3. The DXY remains elevated, and Bitcoin continues to consolidate in a wide $59,000–$65,000 channel, acting as a high-beta liquidity sponge rather than an independent growth asset.</p><p className="mb-4"><strong>Bull Case (25% probability):</strong> Energy prices collapse below $70/bbl due to unimpeded Middle East supply and weakening global demand. Core inflation drops sharply, forcing the Fed to signal a Q4 rate cut. The DXY retreats, and Bitcoin breaks out above $67,000 on renewed institutional ETF inflows.</p><p className="mb-4"><strong>Bear Case (15% probability):</strong> The U.S.-Iran MOU collapses, and the Strait of Hormuz is closed again. Oil spikes above $100/bbl, causing a secondary inflation shock. The Fed is forced to execute a surprise 25 bps rate hike. The DXY surges, and Bitcoin breaks $55,000 support in a generalized global margin call.</p></>),
      },
    ]
  },
  {
    id: 'global-central-bank-divergence-btc-june-2026',
    title: `Global Central Bank Divergence: How the Fed-ECB-BoE Policy Split Is Reshaping Bitcoin's Risk Premium`,
    subtitle: `A synchronised global tightening cycle has fractured into divergent paths — and Bitcoin sits at the epicentre of the resulting capital flow repricing.`,
    tab: 'weekly',
    date: 'June 18, 2026',
    readTime: '15 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"BTC Price","value":"$64,000–$64,500","direction":"down"},{"label":"10Y Treasury Yield","value":"4.45%","direction":"down"},{"label":"DXY","value":"100.3","direction":"up"},{"label":"ECB Deposit Rate","value":"2.25%","direction":"up"}],
    keyInsights: ["The Bank of England held at 3.75% in a 7-2 vote on June 18, adding another data point to an increasingly fragmented global rate cycle that is creating asymmetric capital flows.","The ECB's first rate hike since 2023 — 25 bps to 2.25% on June 11 — driven by Middle East-linked energy inflation is compressing euro liquidity and pushing dollar demand higher, suppressing BTC.","U.S. equities rebounded sharply on June 18 led by Intel (+9.9%) on an Apple chip deal, erasing FOMC losses — a risk-on signal that crypto has yet to follow.","The 10-year Treasury yield eased to 4.45% in a bull-flattening move, providing brief relief, but the Fed's dot plot projecting a 2026 hike remains the binding ceiling on risk asset multiples."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">June 18, 2026 crystallised a macro environment defined by global central bank divergence. Within 48 hours, three of the world's most systemically important central banks delivered divergent signals: the Federal Reserve (hawkish hold at <span className="text-emerald-400 font-bold">3.50%</span>–<span className="text-emerald-400 font-bold">3.75%</span>), the Bank of England (cautious hold at <span className="text-emerald-400 font-bold">3.75%</span>, 7-2 vote), and the Swiss National Bank (floor hold at <span className="text-emerald-400 font-bold">0%</span>). The ECB had already broken ranks a week earlier with its first rate hike since 2023 — a 25 bps move to <span className="text-emerald-400 font-bold">2.25%</span> driven by Middle East energy shocks.</p><p className="mb-4">This policy fragmentation is not merely academic. It creates a direct mechanism for dollar demand: when the Fed signals a potential hike and global peers hold or trail, the DXY gravitates toward a four-month high near 100.3. Bitcoin, which maintains a strong negative 90-day correlation coefficient of approximately -0.72 with the DXY, absorbs this repricing pressure directly as the cost of holding non-yielding digital assets rises relative to an expanding global risk-free rate differentials.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (<><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">Channel 1 — The Dollar Pressure Valve</h4><p className="text-xs text-text-muted">The Fed-ECB-BoE divergence creates a structural bid for USD. Every basis point of Fed hawkishness relative to peers amplifies dollar strength, compressing BTC valuations via the DXY correlation channel. With the DXY at 100.3 and the ECB catching up from behind, the compression is likely to persist until the global rate differential narrows.</p></div><div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">Channel 2 — The Equity Relief Valve</h4><p className="text-xs text-text-muted">On June 18, U.S. equities staged a significant recovery — Intel surged <span className="text-emerald-400 font-bold">9.9%</span>, Nvidia and Micron also gained — on a combination of geopolitical de-escalation (U.S.-Iran Strait of Hormuz deal) and semiconductor sector catalysts. This risk-on equity signal has historically preceded crypto recovery by 48–72 hours. However, the 10-year yield bull-flattening to <span className="text-emerald-400 font-bold">4.45%</span> is the prerequisite for this to translate into BTC upside.</p></div><div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">Channel 3 — The GENIUS Act Timeline</h4><p className="text-xs text-text-muted">The U.S. GENIUS Act stablecoin framework, with final rules expected by July 18, 2026, is creating an institutional "holding pattern." Capital that would typically rotate into on-chain DeFi protocols is parked in compliance review, temporarily suppressing on-chain TVL velocity even as raw DeFi TVL metrics remain stable.</p></div></div></>),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (<><ul className="space-y-4 mb-4"><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">10-Year Treasury Yield:</strong><span className="text-text-muted"> A sustained break below <span className="text-emerald-400 font-bold">4.40%</span> would signal a meaningful easing of the rate compression on BTC. A break above <span className="text-emerald-400 font-bold">4.65%</span> would likely trigger spot ETF outflows and retest $60,000 support.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">DXY Reversal Signal:</strong><span className="text-text-muted"> If the U.S.-Iran peace deal holds and Brent crude stays below $80, the DXY could lose its 100.0 support floor. A move to 98.5 would likely unlock BTC's next $5,000 upside leg.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">GENIUS Act Final Rules (July 18):</strong><span className="text-text-muted"> Clarity on stablecoin AML/CFT requirements will either accelerate institutional on-chain capital deployment or trigger further compliance-driven delays in digital asset allocation.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">Fed CME FedWatch Hike Probability:</strong><span className="text-text-muted"> Currently sitting at ~<span className="text-emerald-400 font-bold">35%</span> for a Q4 2026 hike. A move above <span className="text-emerald-400 font-bold">50%</span> probability would trigger a broad risk-asset deleveraging event and likely push BTC below $60,000.</span></div></li></ul></>),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4"><strong>Base Case (55% probability):</strong> Global central bank divergence persists through Q3. The DXY trades in a 99–101 range. BTC consolidates between $62,000–$67,000, behaving as a liquidity barometer rather than a directional asset. Institutional flows remain mixed but structurally positive as ETF infrastructure matures.</p><p className="mb-4"><strong>Bull Case (30% probability):</strong> The U.S.-Iran deal holds, energy prices fall, global inflation cools faster than expected, and the ECB pauses hikes. The DXY breaks 98.5. The Fed abandons its hike projection in August. BTC rallies to $73,000–$75,000 as the risk premium unwinds and institutional ETF inflows accelerate past $500M/week.</p><p className="mb-4"><strong>Bear Case (15% probability):</strong> A secondary inflation shock (oil supply disruption) forces the Fed to execute a surprise 25 bps hike. The BoE follows. The DXY breaks 102. BTC breaks $60,000 support and retests $55,000 as leveraged crypto longs are systematically liquidated.</p></>),
      },
    ]
  },
  {
    id: 'warsh-fomc-hawkish-hold-btc-implications',
    title: `Warsh's Inaugural FOMC Hold: The Higher-for-Longer Regime's Constraint on Bitcoin Liquidity`,
    subtitle: `How the Fed's 12-0 unanimous rate decision at 3.50%–3.75% and the removal of the easing bias solidify a strong dollar paradigm that suppresses risk-asset multiples.`,
    tab: 'weekly',
    date: 'June 17, 2026',
    readTime: '14 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"Fed Funds Rate","value":"3.50–3.75%","direction":"neutral"},{"label":"US May CPI","value":"4.2%","direction":"up"},{"label":"DXY Level","value":"99.6","direction":"up"},{"label":"BTC ETF Flows","value":"+$10.06M","direction":"up"}],
    keyInsights: ["Kevin Warsh's first FOMC meeting as Chair delivered a 12-0 unanimous vote to hold rates at 3.50%–3.75%, explicitly removing 'easing bias' language from the policy statement.","The updated dot plot reveals 9 of 18 policymakers now favor at least one rate hike before the end of 2026, driven by sticky headline inflation at 4.2%.","Despite temporary geopolitical relief pushing Brent crude below $80, the resilient DXY near 99.6 continues to exert a tightening effect on global M2 liquidity, capping Bitcoin's upside.","Institutional allocators are demonstrating selective risk appetite; while S&P 500 tech equities face pressure, spot Bitcoin ETFs recorded a contrarian $10.06 million net inflow led by BlackRock's IBIT."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">On June 17, 2026, the Federal Reserve marked a definitive era shift as Kevin Warsh presided over his first FOMC meeting. The committee voted unanimously (12-0) to maintain the federal funds rate at <span className="text-emerald-400 font-bold">3.50%</span>–<span className="text-emerald-400 font-bold">3.75%</span>. More consequentially, the Fed scrubbed all 'easing bias' language from its statement—a stark reversal from the Powell era's dovish leanings. This hawkish pivot was catalyzed by May's headline CPI print of <span className="text-emerald-400 font-bold">4.2%</span>, representing a three-year high driven largely by supply-side energy shocks and a tight labor market. The updated Summary of Economic Projections (dot plot) underscored this tightening posture, with half of the committee (9 of 18 members) projecting at least one rate hike before year-end. In response, the U.S. Dollar Index (DXY) stabilized near 99.6, overriding the deflationary impulse of a reported U.S.-Iran interim peace framework that had briefly pushed Brent crude below $80.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (<><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">Channel 1 — The Cost of Capital</h4><p className="text-xs text-text-muted">A terminal rate floor of <span className="text-emerald-400 font-bold">3.50%</span> significantly increases the opportunity cost of holding non-yielding digital assets. For institutional treasuries, the risk premium required to allocate to Bitcoin over <span className="text-emerald-400 font-bold">5.0%</span> short-duration Treasury bills remains elevated.</p></div><div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">Channel 2 — Dollar Dominance (DXY)</h4><p className="text-xs text-text-muted">The Fed's willingness to tolerate higher rates relative to the ECB and BOJ maintains a structural bid for the USD. Bitcoin's historic negative correlation to the DXY (currently sitting at a 90-day r² of -0.72) suggests that sustained dollar strength will compress BTC valuations regardless of internal crypto fundamentals.</p></div><div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">Channel 3 — Institutional Flow Reversal</h4><p className="text-xs text-text-muted">Despite the challenging macro backdrop, spot Bitcoin ETFs recorded a surprise $10.06 million net inflow on June 16, breaking a multi-day outflow streak. This suggests that a subset of institutional capital, primarily routed through BlackRock's IBIT, is utilizing BTC as a structural hedge against fiat debasement rather than a pure beta play on tech liquidity.</p></div></div></>),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (<><ul className="space-y-4 mb-4"><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">The 10-Year Treasury Yield:</strong><span className="text-text-muted"> A sustained breakout above <span className="text-emerald-400 font-bold">4.50%</span> would likely trigger a broader risk-off event, accelerating outflows from spot crypto products.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">July CPI Print:</strong><span className="text-text-muted"> Any print above <span className="text-emerald-400 font-bold">4.0%</span> will cement the 'hike' probability in the Fed's dot plot, pushing the CME FedWatch Tool's odds of a Q4 hike above <span className="text-emerald-400 font-bold">60%</span>.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">DXY Resistance Levels:</strong><span className="text-text-muted"> If the Dollar Index breaks through the 100.5 resistance threshold, expect significant downside pressure on BTC, potentially testing the $60,000 support floor.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">ETF Concentration Metrics:</strong><span className="text-text-muted"> Monitoring whether inflows remain concentrated in BlackRock (IBIT) and Fidelity (FBTC) or broaden to smaller issuers, which would indicate retail rather than purely institutional accumulation.</span></div></li></ul></>),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4"><strong>Base Case (60% probability):</strong> The Fed maintains the <span className="text-emerald-400 font-bold">3.50%</span>–<span className="text-emerald-400 font-bold">3.75%</span> band through Q3 2026. Inflation remains sticky around <span className="text-emerald-400 font-bold">3.8%</span>–<span className="text-emerald-400 font-bold">4.0%</span>. Bitcoin consolidates in a broad $62,000–$68,000 range, behaving strictly as a macro-correlated asset governed by DXY fluctuations.</p><p className="mb-4"><strong>Bull Case (25% probability):</strong> Inflation cools rapidly due to the U.S.-Iran deal easing energy prices. Warsh reintroduces easing language in August. The DXY drops below 97.0, and institutional ETF inflows exceed $200M daily, driving BTC to retest all-time highs above $73,000.</p><p className="mb-4"><strong>Bear Case (15% probability):</strong> The Fed executes a surprise 25 bps rate hike in Q3 due to a secondary inflation shock. The DXY surges past 101.0, triggering a severe liquidity contraction across risk assets. Bitcoin breaks $60,000 support, entering a mid-$50k accumulation zone.</p></>),
      },
    ]
  },
  {
    id: 'warsh-fomc-btc-risk-off-regime',
    title: `Warsh's First Hold: Bitcoin Enters Rate-Regime Crossfire as New Fed Chair Signals Higher-for-Longer`,
    subtitle: `How Kevin Warsh's inaugural FOMC stance, sticky inflation, and MiCA's Binance deadline combine to create Bitcoin's most complex macro backdrop since April 2024`,
    tab: 'weekly',
    date: 'June 17, 2026',
    readTime: '12 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"BTC Price","value":"$65,456","direction":"down"},{"label":"Fed Rate","value":"3.50–3.75%","direction":"neutral"},{"label":"RWA Market","value":"$43B","direction":"up"},{"label":"BTC ETF Holdings","value":"678K BTC","direction":"up"}],
    keyInsights: ["Kevin Warsh's first FOMC as Chair held rates at 3.50%–3.75%, with the dot plot shifting to signal zero 2026 cuts — a hawkish surprise pushing BTC down 1.2% to $65,456.","MiCA enforcement risk: Binance faces a June 30 EU licensing deadline in Greece, threatening regulated institutional access for European capital flows into crypto.","RWA tokenization surpassed $43 billion globally (+37% in 180 days), with Ethereum hosting 57.8% of tokenized assets — signaling structural demand beyond pure Bitcoin speculation.","U.S. spot Bitcoin ETFs hold 678,000 BTC ($54B cumulative inflows), but mid-June saw mixed daily flows as institutional capital rotated toward Ethereum and Solana products."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">The Federal Reserve's June 17 FOMC meeting — the first chaired by Kevin Warsh following Powell's exit last month — delivered an expected rate hold at <span className="text-emerald-400 font-bold">3.50%</span>–<span className="text-emerald-400 font-bold">3.75%</span>, but the hawkish surprise came in the dot plot. The updated Summary of Economic Projections now signals zero rate cuts for the remainder of 2026, a sharp deviation from the one-to-two cuts markets had priced in. Warsh cited persistent inflation, partly driven by energy price shocks and robust job growth, as the rationale for extending the higher-for-longer posture. Bitcoin, which had rebounded from a June dip to $61,000 following May CPI data, stalled at $65,800 pre-announcement and slid <span className="text-emerald-400 font-bold">1.2%</span> to $65,456 as traders digested the hawkish dot plot. The DXY held firm above 104, reinforcing the inverse correlation with BTC that has defined 2026's risk-off macro environment.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (<><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">Channel 1 — Rate Expectations</h4><p className="text-xs text-text-muted">Zero cuts priced for 2026 compresses Bitcoin's theoretical fair value by removing the anticipated liquidity injection that historically supports risk assets. The CME FedWatch tool showed odds of any 2026 cut collapse from <span className="text-emerald-400 font-bold">62%</span> to <span className="text-emerald-400 font-bold">31%</span> post-announcement.</p></div><div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">Channel 2 — Regulatory Risk (MiCA)</h4><p className="text-xs text-text-muted">Binance's failure to secure a MiCA-compliant license in Greece by the June 30 deadline risks a full EU market suspension — a $4.2 billion annualized revenue exposure. This creates a second-order risk: European institutional flows dependent on Binance's infrastructure face disruption, reducing addressable liquidity.</p></div><div className="p-4 bg-surface border border-border rounded-xl"><h4 className="text-sm font-bold text-primary mb-2">Channel 3 — Institutional Rotation</h4><p className="text-xs text-text-muted">Mid-June ETF data showed Bitcoin spot products experiencing net outflows while Ethereum, Solana, and XRP funds attracted capital — a tactical shift driven partly by AI-adjacent blockchain narratives and a post-SpaceX IPO risk appetite rotation.</p></div></div></>),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (<><ul className="space-y-4 mb-4"><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">Warsh's July press conference language:</strong><span className="text-text-muted"> Any dovish softening toward 2027 cuts would be a primary catalyst for a BTC breakout above $68,000–$70,000.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">Binance MiCA outcome (June 30 deadline):</strong><span className="text-text-muted"> A license denial triggers European crypto market structure disruption, potentially widening BTC/ETH spreads across EU venues by 15–25 bps.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">RWA tokenization milestone:</strong><span className="text-text-muted"> If the market crosses $50 billion by Q3 2026, it signals structural blockchain utility demand that decouples from speculative Bitcoin cycles.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">US inflation data (July print):</strong><span className="text-text-muted"> Core PCE above <span className="text-emerald-400 font-bold">2.8%</span> would further anchor the hawkish dot plot and suppress BTC below $63,000 support.</span></div></li></ul></>),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4"><strong>Bull Case (25% probability):</strong> Warsh strikes a constructive tone in July, CPI softens toward <span className="text-emerald-400 font-bold">2.4%</span>, and Binance secures EU licensing. ETF inflows resume daily at $200M+, driving BTC toward $72,000–$75,000 by August.</p><p className="mb-4"><strong>Base Case (55% probability):</strong> Fed holds through Q3, BTC consolidates $62,000–$68,000, ETF flows remain mixed, and RWA tokenization continues steady growth toward $50B. Bitcoin trades as a macro-correlated asset with limited independent upside catalysts.</p><p className="mb-4"><strong>Bear Case (20% probability):</strong> Warsh tightens language further, Binance loses EU access, and a second-quarter inflation surprise above <span className="text-emerald-400 font-bold">3.0%</span> triggers institutional deleveraging. BTC tests $58,000–$60,000 support range, with ETF daily outflows exceeding $150M.</p></>),
      },
    ]
  },
  {
    id: 'us-april-cpi-report-btc-q2-trajectory-2024-05-17',
    title: `US April CPI Report: Implications for BTC's Q2 Trajectory`,
    subtitle: `Softer inflation data has re-calibrated Fed rate cut expectations, directly influencing risk asset appeal and dollar strength, impacting Bitcoin's near-term outlook.`,
    tab: 'weekly',
    date: 'May 17, 2024',
    readTime: '14 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"DXY Index","value":"104.57","direction":"down","symbol":"DXY","format":"number"},{"label":"Bitcoin Price","value":"66920.00","direction":"up","symbol":"BTC","format":"number"},{"label":"US 10-Year Yield","value":"4.38","direction":"down","symbol":"^TNX","format":"percent"},{"label":"S&P 500 Index","value":"5304.72","direction":"up","symbol":"^GSPC","format":"number"}],
    keyInsights: ["The April Core CPI print registered +0.3% MoM, a deceleration from March's +0.4% MoM, signaling a potential resumption of disinflationary trends.","Following the CPI release on May 15th, the probability of a September Fed rate cut surged from approximately 50% to over 70% according to the CME FedWatch Tool.","The DXY Index dropped from 105.05 to 104.57 within 24 hours post-CPI, weakening the dollar and traditionally boosting risk assets like Bitcoin.","Bitcoin rallied over 7% from $61,500 to $66,000 in the immediate aftermath of the CPI data, demonstrating acute sensitivity to shifting monetary policy expectations."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">The macroeconomic landscape has seen a significant recalibration following the release of the US Bureau of Labor Statistics' April Consumer Price Index (CPI) report on May 15, 2024. The data presented a welcome cooling trend, with the headline CPI rising by <span className="text-emerald-400 font-bold">0.3%</span> month-over-month (MoM), slightly below the <span className="text-emerald-400 font-bold">0.4%</span> recorded in March and matching consensus expectations. More critically for the Federal Reserve's policy stance, the core CPI, which excludes volatile food and energy prices, also increased by <span className="text-emerald-400 font-bold">0.3%</span> MoM, decelerating from the prior month's <span className="text-emerald-400 font-bold">0.4%</span>.</p><p className="mb-4">This softer inflation print has provided a much-needed reprieve for markets anticipating Fed rate cuts. Prior to the report, Federal Reserve officials, including Chairman Jerome Powell, had maintained a cautious 'higher for longer' rhetoric, emphasizing the need for greater confidence in sustained disinflation. Governor Christopher Waller, a known hawk, had even suggested a potential lack of urgency for cuts. However, the April data has allowed the market to re-price rate expectations significantly. The probability of a September rate cut, as reflected by Fed funds futures, jumped from roughly <span className="text-emerald-400 font-bold">50%</span> to over <span className="text-emerald-400 font-bold">70%</span> almost immediately, signaling renewed confidence in the Fed's ability to achieve its <span className="text-emerald-400 font-bold">2%</span> inflation target without jeopardizing economic growth. This shift contrasts sharply with the hawkish sentiment that had pervaded markets since the sticky Q1 inflation reports, and aligns the US outlook more closely with the European Central Bank (ECB) and Bank of England (BoE), both of whom are increasingly signaling potential rate cuts in the near future.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (<><p className="mb-4">The impact of the US April CPI report on crypto markets, particularly Bitcoin, is primarily transmitted through three interconnected channels: risk appetite, global liquidity, and opportunity cost.</p><p className="mb-4">**Channel 1: Risk Appetite** — Softer inflation data, coupled with increased certainty around future Fed rate cuts, inherently boosts investor appetite for risk assets. When the path of monetary policy appears less restrictive, capital tends to rotate out of safe-haven assets and into growth-oriented or speculative investments. Bitcoin, often categorized as a high-beta risk asset, benefits significantly from this shift. Post-CPI, both the S&P 500 and Nasdaq 100 rallied to new all-time highs, reflecting broad market optimism. Bitcoin's 60-day rolling correlation with the Nasdaq 100 has recently strengthened to 0.72, indicating its heightened sensitivity to tech-driven risk-on sentiment, leading to its rapid ascent above $66,000.</p><p className="mb-4">**Channel 2: Liquidity** — A weakening US Dollar, driven by diminishing rate hike expectations and the prospect of future cuts, often translates into enhanced global liquidity. As the DXY Index declines, the cost of borrowing in USD decreases, and capital flows out of dollar-denominated assets. This dynamic can increase the overall pool of capital available for deployment into alternative assets, including cryptocurrencies. Historically, a <span className="text-emerald-400 font-bold">1%</span> drop in the DXY has often coincided with a 2<span className="text-red-400 font-bold">-3%</span> increase in total crypto market capitalization over a 7-day period, as global investors seek returns outside of a less appealing dollar. The DXY's drop from 105.05 to 104.57 post-CPI is a clear example of this mechanism at play, directly contributing to Bitcoin's rally.</p><p className="mb-4">**Channel 3: Opportunity Cost** — Lower bond yields, a direct consequence of shifting rate expectations, reduce the opportunity cost of holding non-yielding assets like Bitcoin. When the US 10-year Treasury yield declines (it fell from <span className="text-emerald-400 font-bold">4.49%</span> pre-CPI to <span className="text-emerald-400 font-bold">4.38%</span> post-CPI), the attractive 'risk-free' return offered by traditional fixed income diminishes. Furthermore, the US 10-year real yield (inflation-indexed TIPS) fell approximately 15 basis points, making assets with potential for capital appreciation, such as Bitcoin, comparatively more appealing. This reallocation of capital from bonds to growth assets is a fundamental driver for crypto demand in a loosening monetary environment.</p><p className="mb-4">In synthesis, the April CPI report provided a strong catalyst across all three channels, fostering a more favorable macro backdrop for Bitcoin. The confluence of increased risk appetite, improved dollar liquidity, and reduced opportunity cost propelled BTC's swift recovery, demonstrating its continued correlation with macro monetary policy shifts.</p></>),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (<><p className="mb-4">Professional investors are closely monitoring several key levels and thresholds that could signal further regime shifts in the crypto and broader macro markets.</p><ul className="space-y-4 mb-4"><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**DXY 104.0:</strong><span className="text-text-muted">** A sustained break and hold below the 104.0 level for the DXY Index would unequivocally signal a definitive weakening of the US dollar. Such a move is anticipated to strengthen the inverse correlation between DXY and BTC, potentially pushing Bitcoin towards the $70,000 mark as global capital flows out of dollar-denominated assets and into risk-on alternatives.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span className="text-text-muted">**US 10-Year Yield <span className="text-emerald-400 font-bold">4.25%</span>:** A decisive breach below the <span className="text-emerald-400 font-bold">4.25%</span> threshold for the US 10-year Treasury yield would cement market expectations for at least two, if not three, Fed rate cuts in 2024. This would significantly bolster the appeal of risk assets across the board, including Bitcoin, by reducing the opportunity cost of holding non-yielding assets and signaling a more accommodative monetary policy.</span></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**BTC $69,000:</strong><span className="text-text-muted">** A reclaim and sustained hold above Bitcoin's all-time high of approximately $69,000 (achieved on March 5th, 2024) would validate renewed bullish momentum. This level is crucial for technical analysts, and a clear break above it, especially on strong volume, would likely target the next psychological resistance levels of $75,000 to $78,000.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span className="text-text-muted">**CME FedWatch September Cut Probability <span className="text-emerald-400 font-bold">80%</span>+:** If the CME FedWatch Tool shows the probability of a September rate cut strengthening to <span className="text-emerald-400 font-bold">80%</span> or higher, it would indicate an overwhelming market consensus for impending monetary easing. This would likely trigger another significant leg up across all risk assets, including Bitcoin, as investors front-run the anticipated policy pivot by the Federal Reserve.</span></li></ul></>),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4"><strong>Base Case (55% probability):</strong> The April CPI data marks the beginning of a sustained, albeit gradual, disinflationary trend. The Federal Reserve proceeds with one or two 25 basis point rate cuts by year-end, likely commencing in September. This measured approach allows risk assets to consolidate gains, with Bitcoin maintaining support above $65,000 and gradually targeting the $72,000-$75,000 range by the end of Q3 2024, driven by steady institutional inflows and a supportive macro backdrop.</p><p className="mb-4"><strong>Bull Case (25% probability):</strong> Inflation decelerates faster than anticipated in Q2 and Q3, prompting the Fed to signal a more aggressive rate-cutting cycle, potentially three or more cuts by year-end. Concurrently, a Spot Ethereum ETF gains regulatory approval in the US, injecting significant new capital into the crypto ecosystem. Under this scenario, Bitcoin convincingly breaks its all-time high, entering price discovery mode and targeting $80,000-$85,000 by Q3, fueled by strong liquidity and renewed speculative interest.</p><p className="mb-4"><strong>Bear Case (20% probability):</strong> The disinflationary trend proves transient, with subsequent inflation reports showing renewed stickiness or even re-acceleration, forcing the Fed to maintain higher rates for longer or even hint at further tightening. This could be exacerbated by an unforeseen geopolitical shock or a significant increase in market volatility. In this environment, risk assets face considerable headwinds, and Bitcoin would likely retest critical support levels in the $58,000-$60,000 range, as capital rotates back into safe-haven assets and the opportunity cost of holding non-yielding assets rises.</p></>),
      },
    ]
  },
  {
    id: 'april-cpi-btc-implication-2024-05-16',
    title: `US April CPI Report: Reshaping Fed Expectations and Bolstering Bitcoin's Rebound`,
    subtitle: `Softer-than-expected inflation data for April 2024 has recalibrated market expectations for Federal Reserve rate cuts, driving a risk-on pivot that directly benefits uncorrelated digital assets like Bitcoin through enhanced liquidity and reduced opportunity cost.`,
    tab: 'weekly',
    date: 'May 16, 2024',
    readTime: '14 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"DXY Index","value":"104.55","direction":"down","symbol":"DXY","format":"number"},{"label":"Bitcoin (BTC)","value":"66,250","direction":"up","symbol":"BTC","format":"number"},{"label":"US 10Y Yield","value":"4.37%","direction":"down","symbol":"^TNX","format":"percent"},{"label":"S&P 500","value":"5,308","direction":"up","symbol":"^SPX","format":"number"}],
    keyInsights: ["US headline CPI for April 2024 registered 0.3% MoM, falling below the consensus estimate of 0.4% and the prior month's 0.4%.","Core CPI, excluding volatile food and energy, also came in at 0.3% MoM, aligning with expectations but indicating a deceleration from recent sticky prints.","The probability of a September Federal Reserve rate cut surged to approximately 75% following the CPI release, up from roughly 60% just 24 hours prior.","Bitcoin (BTC) price advanced over 7% from its pre-CPI low of $61,500 to touch $66,000+ within 12 hours, demonstrating a strong risk-on response."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">The release of the US April Consumer Price Index (CPI) on May 15, 2024, marked a pivotal moment for financial markets, offering a reprieve from several months of stubbornly high inflation readings. Both the headline CPI and core CPI, which strips out volatile food and energy components, registered a <span className="text-emerald-400 font-bold">0.3%</span> month-over-month increase. This headline print was notably below the <span className="text-emerald-400 font-bold">0.4%</span> consensus forecast from economists polled by Bloomberg, while core CPI met expectations, collectively signaling a potential re-acceleration of disinflationary forces.</p><p className="mb-4">Prior to this report, Federal Reserve officials, including Chairman Jerome Powell, had maintained a cautious 'higher for longer' stance, emphasizing the need for greater confidence in sustained disinflation before considering rate cuts. Regional Fed presidents like Neel Kashkari (Minneapolis) and Loretta Mester (Cleveland) had even floated the possibility of holding rates steady for the entirety of 2024, or even hiking, if inflation proved persistent. However, the latest CPI data has immediately shifted market sentiment, with futures markets now pricing in a significantly higher probability (around <span className="text-emerald-400 font-bold">75%</span>) of a Fed rate cut as early as September, compared to approximately <span className="text-emerald-400 font-bold">60%</span> before the report. This recalibration suggests that the Fed’s path of monetary policy normalization may resume sooner than previously anticipated, easing financial conditions across the board despite lingering geopolitical tensions in the Middle East and Eastern Europe.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (<><p className="mb-4">The softer April CPI data translates into immediate and tangible impacts on digital assets like Bitcoin through three primary channels: risk appetite, liquidity, and opportunity cost. These mechanisms collectively drive capital flows and influence price discovery in the volatile crypto market.</p><p className="mb-4">**Channel 1: Risk Appetite** — A disinflationary signal from the CPI report fosters a significant improvement in broad market risk appetite. Lower inflation reduces the perceived need for aggressive monetary tightening, which typically dampens economic growth and corporate earnings. As such, traditional risk assets such as technology stocks (represented by the Nasdaq 100) and growth-oriented equities experienced a strong rally post-CPI. Bitcoin, often acting as a high-beta risk asset, demonstrates a robust positive correlation with major equity indices, with its 30-day correlation coefficient to the Nasdaq 100 frequently oscillating between +0.65 and +0.72. Following the May 15 CPI release, this correlation strengthened as BTC mirrored the equity market's upward trajectory, surging over <span className="text-emerald-400 font-bold">7%</span> from its intra-day low of $61,500.</p><p className="mb-4">**Channel 2: Liquidity** — Easing inflation pressures and the prospect of earlier Fed rate cuts typically lead to a weakening US Dollar. A declining Dollar Index (DXY) signals increased global liquidity and reduced demand for dollar-denominated safe-haven assets. The DXY notably dropped from 105.3 pre-CPI to a low of 104.2 within hours of the announcement, a decline of over <span className="text-emerald-400 font-bold">1%</span>. Historically, Bitcoin exhibits a strong inverse correlation with the DXY, with a 30-day coefficient often ranging from -0.50 to -0.65. This inverse relationship intensified post-CPI, as a weaker dollar made riskier, non-yielding assets like BTC more attractive to international investors and facilitated broader capital flows into the crypto ecosystem.</p><p className="mb-4">**Channel 3: Opportunity Cost** — The most direct impact of shifting rate expectations is on the opportunity cost of holding non-yielding assets. The US 10-Year Treasury yield, a benchmark for global borrowing costs, plummeted by over 12 basis points from <span className="text-emerald-400 font-bold">4.49%</span> to <span className="text-emerald-400 font-bold">4.37%</span> within hours of the CPI release. This sharp decline makes holding cash or fixed-income instruments less appealing relative to growth-oriented or speculative assets. Bitcoin, as a non-yielding asset, benefits significantly from this dynamic; the reduced return on 'safe' investments decreases the opportunity cost of allocating capital to crypto. Lag analysis suggests that Bitcoin often reacts to significant shifts in benchmark Treasury yields with a lag of 4 to 8 hours, reflecting the time required for institutional capital to reallocate and for market sentiment to fully coalesce around new monetary policy expectations.</p><p className="mb-4">Collectively, the improved risk sentiment, enhanced global liquidity from a weaker dollar, and reduced opportunity cost from falling yields create a potent tailwind for Bitcoin and the broader crypto market. The CPI print served as a catalyst, reinforcing the narrative that macro factors remain a dominant driver of digital asset performance.</p></>),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (<><p className="mb-4">Professional investors are closely monitoring several key macro and crypto-specific levels to gauge the sustainability of the post-CPI rally and potential regime shifts:</p><ul className="space-y-4 mb-4"><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**DXY 104.0:</strong><span className="text-text-muted">** A sustained break below this critical support level would signal a more aggressive weakening of the US Dollar, likely strengthening the inverse correlation between DXY and BTC to -0.75 or greater, suggesting a significant liquidity injection into risk assets.</span></div></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span className="text-text-muted">**US 10-Year Treasury Yield <span className="text-emerald-400 font-bold">4.25%</span>:** A decisive move and close below this threshold would indicate a strong conviction in continued disinflation and increased probability of a second Fed rate cut in 2024, further reducing the opportunity cost for non-yielding assets.</span></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span className="text-text-muted">**Bitcoin Dominance (BTC.D) <span className="text-emerald-400 font-bold">55.0%</span>:** A sustained push above this level would suggest capital rotation from altcoins back into Bitcoin, often seen during periods of initial market strength or when investors seek the relative safety of the largest crypto asset amidst broader macro uncertainty.</span></li><li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><div><strong className="text-text">**S&P 500 (SPX) 5,350:</strong><span className="text-text-muted">** A clear breakout and consolidation above this new all-time high would confirm robust institutional risk appetite across traditional markets, providing a strong correlated tailwind for Bitcoin's price appreciation.</span></div></li></ul></>),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4">The post-CPI environment introduces a range of potential outcomes for Bitcoin and broader markets, each contingent on forthcoming economic data and central bank commentary.</p><p className="mb-4">**Base Case (<span className="text-emerald-400 font-bold">55%</span> probability):** Disinflationary trends continue at a moderate pace, but core services inflation remains somewhat sticky, leading the Federal Reserve to implement a single rate cut in Q3 2024 (e.g., September). Under this scenario, Bitcoin consolidates its gains above the $65,000 level, absorbing profit-taking while gradually building momentum towards a target range of $70,000-$72,000 by the end of Q2, supported by persistent institutional ETF inflows and improved macro sentiment.</p><p className="mb-4">**Bull Case (<span className="text-emerald-400 font-bold">25%</span> probability):** Subsequent inflation reports, including the Personal Consumption Expenditures (PCE) price index, surprise to the downside (e.g., core PCE below <span className="text-emerald-400 font-bold">0.2%</span> MoM), indicating a faster path to the Fed's <span className="text-emerald-400 font-bold">2%</span> target. This prompts the Fed to signal the likelihood of two rate cuts in 2024. In this more accommodative environment, Bitcoin experiences a significant breakout above its previous all-time highs, targeting the $78,000-$80,000 range, potentially testing the psychological $80,000 barrier as a result of aggressive liquidity expansion and heightened risk-on speculation.</p><p className="mb-4">**Bear Case (<span className="text-emerald-400 font-bold">20%</span> probability):** Upcoming economic data, particularly the next CPI or PCE report, shows a re-acceleration of inflationary pressures, or labor market tightness persists unexpectedly. This forces the Federal Reserve to revert to a more hawkish stance, potentially delaying rate cuts until 2025 or even hinting at further tightening if inflation proves recalcitrant. Under this adverse scenario, Bitcoin would likely retest critical support levels, initially falling back to $60,000, and potentially sliding further to the $58,000-$55,000 range as risk assets are repriced lower amid tightening financial conditions.</p></>),
      },
    ]
  },
  {
    id: 'macro-warsh-era-june-2026',
    title: `The Warsh Era Begins: FOMC Braces for Easing Bias Cancellation`,
    subtitle: `With futures pricing in a 96.4% pause, market focus turns to updated dot plot projections under new Fed leadership.`,
    tab: 'weekly',
    date: 'June 15, 2026',
    readTime: '5 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"Pause Probability","value":"96.4%","direction":"neutral"},{"label":"U.S. Base Rate Range","value":"3.50%–3.75%","direction":"neutral"},{"label":"BTC Spot Rate","value":"$65,550","direction":"up"},{"label":"Mining Difficulty Adjustment","value":"-10.0%","direction":"down"}],
    keyInsights: ["Markets price in a 96.4% probability of a rate pause, but expect hawkish forward guidance to dismantle previous rate cut scenarios.","The upcoming June 16-17 FOMC meeting is Kevin Warsh's debut as Fed Chairman, driving speculation of long-term rate hikes.","Bitcoin exhibits signs of structural consolidation near $65,500, supported by a 10% downward difficulty correction that stabilized miners.","Persistent inflation data forces a higher-for-longer regime, shifting expectations for policy easing into late 2027."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">Global markets are entering a highly critical window ahead of the June 16–17, 2026 Federal Open Market Committee (FOMC) meeting, which marks the policy debut of new Federal Reserve Chairman Kevin Warsh. The consensus among economists and treasury markets points to a near-universal expectation that the benchmark rate will remain paused in the 3.50%–3.75% target range. However, the true macro signal lies in the upcoming policy projections and forward guidance. With core inflation persisting above 4% annually, the FOMC is widely anticipated to officially cancel its historical 'easing bias' and signal a more aggressive stance, potentially raising the prospect of further interest rate hikes in late 2026 to firmly anchor long-term price targets.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (
          <>
            <p className="mb-4">The transmission of this hawkish policy outlook affects digital asset markets through three distinct channels.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 1: Yield Spread</h4>
                <p className="text-xs text-text-muted">As short-term risk-free rates remain elevated near <span className="text-red-400 font-bold">3.75%</span>, institutional allocators face a high opportunity cost for holding non-yielding assets, suppressing speculative flows.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 2: USD Liquidity</h4>
                <p className="text-xs text-text-muted">Expectations of contractionary monetary policy keep the DXY index elevated, creating historical headwinds for Bitcoin valuation.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 3: Asset Rotation</h4>
                <p className="text-xs text-text-muted">As high yields persist, institutional credit is directed into cash equivalents and high-profile tech stocks, rather than digital assets.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (
          <>
            <p className="mb-4">Professional allocators are focusing on three primary data points.</p>
            <ul className="space-y-4 mb-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">June 17 Dot Plot:</strong>
                  <span className="text-text-muted"> Looking for changes in the consensus policy rate projection for late 2026 and 2027.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">Warsh's Inaugural Press Conference:</strong>
                  <span className="text-text-muted"> Checking the tone for specific hawkish policy cues.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">Spot Bitcoin ETF Net Flows:</strong>
                  <span className="text-text-muted"> After weeks of record outflows, a stabilization in daily flow metrics is needed to establish a sustainable price floor.</span>
                </div>
              </li>
            </ul>
          </>
        ),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4">In our Base Case (55% probability), the Fed pauses but delivers hawkish forward guidance, keeping BTC range-bound between $62,000 and $66,000. Under the Bear Case (35% probability), resurgent inflation fears prompt the Fed to actively warn of a Q3 rate hike, triggering a risk-off liquidation that breaks BTC below $58,000. In the Bull Case (10% probability), geopolitical resolutions rapidly ease energy prices, allowing the Fed to present a more neutral outlook and launching BTC toward $70,000.</p></>),
      },
    ]
  },
  {
    id: 'macro-inflation-june-2026',
    title: `Inflation Shock: US May CPI at 4.2% Hardens Fed's Higher-for-Longer Path`,
    subtitle: `As energy costs surge 23.5%, persistent pricing pressures neutralize rate cut scenarios ahead of the June 16-17 FOMC meeting.`,
    tab: 'weekly',
    date: 'June 12, 2026',
    readTime: '5 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"US May CPI","value":"4.2%","direction":"up"},{"label":"Energy Price Surge","value":"23.5%","direction":"up"},{"label":"Fed Funds Target","value":"3.50%–3.75%","direction":"neutral"},{"label":"BTC Spot Rate","value":"$61,800","direction":"down"}],
    keyInsights: ["US headline CPI accelerates to 4.2% in May, fueled by a 23.5% surge in energy prices, locking in a hawkish policy floor.","The upcoming June 16-17 FOMC meeting, chaired by Kevin Warsh, is expected to pivot away from easing biases toward rate hike scenarios.","Sustained high sovereign yields increase the opportunity cost of holding BTC, triggering capital migration into short-term cash instruments.","Spot Bitcoin ETFs experience their longest net outflow streak in history, reflecting institutional de-risking amidst macro contraction."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">The macroeconomic landscape has taken a decidedly hawkish turn in June 2026. According to the latest data, U.S. Consumer Price Index (CPI) inflation accelerated to 4.2% annually in May, marking its highest rate since late 2023. The primary driver of this print was a sharp 23.5% surge in energy costs, exacerbated by ongoing supply line tensions in the Middle East and the closure of the Strait of Hormuz. The resurgent price pressures have effectively eliminated any remaining market expectations for interest rate cuts in 2026. Instead, market participants are now preparing for the upcoming June 16–17 Federal Open Market Committee (FOMC) meeting, which marks the debut of Kevin Warsh as Federal Reserve Chairman. Consensus is forming around a contractionary policy stance, with yields on 10-year Treasury notes rising in response.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (
          <>
            <p className="mb-4">This persistent higher-for-longer rate regime transmits direct downward pressure on digital assets through three distinct channels.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 1: Yield Opportunity Cost</h4>
                <p className="text-xs text-text-muted">As risk-free yields on short-term U.S. debt instruments hover near <span className="text-emerald-400 font-bold">3.75%</span>, the hurdle rate for holding non-yielding assets like Bitcoin increases. Institutional portfolios are rotating out of speculative vehicles.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 2: Liquidity Contraction</h4>
                <p className="text-xs text-text-muted">Contraction in central bank balance sheets reduces global M2 growth, directly dry-docking the excess liquidity that historically fuels crypto bull markets.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 3: Risk Prevention</h4>
                <p className="text-xs text-text-muted">Elevated geopolitical risks encourage investors to seek safe-haven sovereign bonds, draining liquidity from high-beta crypto assets.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (
          <>
            <p className="mb-4">Professional allocators are monitoring three main indicators.</p>
            <ul className="space-y-4 mb-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">June 17 Dot Plot & Warsh's Guidance:</strong>
                  <span className="text-text-muted"> Looking for explicit signals regarding a return to rate hikes.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">Stablecoin Reserves:</strong>
                  <span className="text-text-muted"> A decline in total stablecoin market cap would confirm active capital flight out of the digital asset ecosystem.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">On-Chain Capitulation:</strong>
                  <span className="text-text-muted"> Particularly the percentage of short-term holder supply held in loss, currently testing cyclical support levels.</span>
                </div>
              </li>
            </ul>
          </>
        ),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4">In our Base Case (60% probability), the Fed holds rates steady while signaling a hawkish bias, keeping Bitcoin range-bound between $58,000 and $63,000. Under the Bear Case (30% probability), resurgent inflation forces the Fed to hike rates by 25bps in Q3, triggering a liquidation cascade that breaks Bitcoin below the critical $54,000 support level. In the Bull Case (10% probability), a rapid resolution of Middle East energy blockades drops oil prices, allowing the Fed to return to a neutral stance and pushing Bitcoin back above $66,000.</p></>),
      },
    ]
  },
  {
    id: 'ecb-hawkish-pivot-june-2026',
    title: `ECB's Hawkish Pivot: Strait of Hormuz Crisis Forces First Rate Hike Since 2023`,
    subtitle: `As Eurozone growth drops to 0.8%, ECB's 25bps hike tightens global liquidity, placing downward pressure on BTC support at $61,500.`,
    tab: 'weekly',
    date: 'June 11, 2026',
    readTime: '4 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"Deposit Facility Rate","value":"2.25%","direction":"up"},{"label":"Eurozone GDP Forecast","value":"0.8%","direction":"down"},{"label":"May US CPI","value":"4.2%","direction":"up"}],
    keyInsights: ["ECB raises all three key rates by 25bps to address Middle East energy shocks feeding into persistent headline inflation, projected to average 3.0% in 2026.","Eurozone GDP growth lowered to 0.8% due to trade disruption, amplifying stagflation risks that restrict speculative retail risk appetite.","Diminished expectations for Fed rate cuts following 4.2% US inflation strengthen the USD index (DXY), reinforcing a capital drag on digital assets.","Bitcoin tests critical support at $61,500 as global liquidity contractions limit institutional capital allocation."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">On June 11, 2026, the European Central Bank (ECB) executed its first interest rate hike since September 2023, raising the deposit rate by 25 basis points to 2.25%. This policy adjustment comes in direct response to severe energy market shocks sparked by the geopolitical crisis in the Middle East and the closure of the Strait of Hormuz. With energy supply disruptions driving Eurozone inflation expectations up to 3.0% for 2026, the ECB was forced to prioritize inflation anchoring over economic growth, revising its Eurozone GDP growth forecast downward to 0.8%. At the same time, the U.S. Federal Reserve faces persistent price pressures as U.S. May CPI accelerated to 4.2% year-over-year. This global central bank tightening cycle has effectively ended any short-term rate cut narrative, bolstering the US Dollar Index (DXY) and restricting capital flows into high-beta risk assets like Bitcoin.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (
          <>
            <p className="mb-4">The monetary tightening transmits to digital assets through three distinct channels.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 1: Sovereign Yields</h4>
                <p className="text-xs text-text-muted">Higher risk-free yields in both the US and Europe make yield-barren assets like Bitcoin less attractive to macro allocators.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 2: USD Strength</h4>
                <p className="text-xs text-text-muted">A hawkish Fed and ECB support a 'higher-for-longer' interest rate regime, causing the DXY to strengthen, exerting immediate negative pressure on BTC valuations.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 3: Credit Contraction</h4>
                <p className="text-xs text-text-muted">Higher cost of capital limits leverage across major crypto desks, dampening synthetic demand in derivatives markets.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (
          <>
            <p className="mb-4">Professional investors should monitor three critical developments.</p>
            <ul className="space-y-4 mb-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">June 16-17 FOMC Meeting:</strong>
                  <span className="text-text-muted"> Any hawkish Fed guidance could solidify rate hike expectations for late 2026.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">Middle East Geopolitics:</strong>
                  <span className="text-text-muted"> Further energy escalations could push inflation expectations higher.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">Stablecoin Velocity:</strong>
                  <span className="text-text-muted"> While spot Bitcoin ETFs have seen outflows, tokenized RWA growth suggests capital is staying on-chain, waiting for macroeconomic stabilization.</span>
                </div>
              </li>
            </ul>
          </>
        ),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4">In our Base Case (55% probability), the Fed holds rates steady while the ECB pauses further hikes, keeping BTC trading in a $58,000 to $63,000 range. Under the Bear Case (35% probability), persistent inflation forces the Fed to hike rates to 4.0% in Q3, causing a liquidation event that breaks BTC below $54,000. In the Bull Case (10% probability), geopolitical resolutions rapidly ease energy prices, allowing central banks to adopt a dovish stance and launching BTC back toward $68,000.</p></>),
      },
    ]
  },
  {
    id: 'warsh-fed-hawkish-pivot-btc-june-2026',
    title: `Warsh's Hawkish Pivot: BTC Under Pressure as Higher-For-Longer Returns`,
    subtitle: `How a revived contractionary bias at the FOMC under Chair Kevin Warsh reshapes BTC's risk-return profile ahead of the June 16–17 meeting.`,
    tab: 'weekly',
    date: 'June 11, 2026',
    readTime: '14 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"DXY (Dollar Index)","value":"99.8","direction":"up","symbol":"DXY","format":"number"},{"label":"Fed Rate (Target)","value":"3.50–3.75%","direction":"neutral"},{"label":"BTC (Bitcoin)","value":"$61,800","direction":"down","symbol":"BTC"},{"label":"S&P 500","value":"7,240","direction":"down","symbol":"SPY","format":"number"}],
    keyInsights: ["DXY holds firm near 100 as sticky CPI (3.8–4.2%) and Middle East safe-haven demand converge, creating classic dollar-strength headwinds for BTC.","Kevin Warsh's FOMC is signaling a contractionary shift: May's 172,000 jobs print and persistent inflation are eliminating near-term cut probabilities.","ETF structural bid weakening: Spot BTC ETF cumulative volumes crossed $2T in 2026, but net outflows in May–June signal allocator caution during risk-off regimes.","BTC/Supply-in-Loss at 50%+ mirrors Q4 2022 capitulation structure — historically a mean-reversion inflection zone when paired with a macro policy pivot."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context`,
        content: (<><p className="mb-4">The Federal Reserve's June 16–17 FOMC meeting arrives at a critical inflection point. Under Chair Kevin Warsh — who assumed the role following Jerome Powell's departure — the Committee has held the federal funds rate at 3.5–3.75% through H1 2026, but the rhetorical posture has decisively shifted. Where the prior Fed communicated an easing bias, Warsh's FOMC is now openly discussing a return to restriction if inflation fails to decelerate.</p><p className="mb-4">The data supporting this shift is hard to dismiss. May's Non-Farm Payrolls came in at 172,000 — above consensus — while the latest CPI reading registered between 3.8% and 4.2%, far above the Fed's 2% mandate. The dual combination of labor market resilience and sticky services inflation gives the FOMC minimal political cover to cut. Markets are now pricing the June meeting as a hold with an increasingly hawkish statement.</p><p className="mb-4">Geopolitically, Middle East tensions continue to underpin safe-haven dollar demand, keeping the DXY pinned near 99–100 despite technical resistance at that level. The S&P 500 has pulled back toward 7,200–7,240, with major institutions — Citi, Bank of America, Barclays, and Goldman Sachs — all issuing contemporaneous warnings about overcrowded equity positioning and elevated valuation multiples heading into mid-year.</p></>),
      },
      {
        icon: <TrendingUp size={18} />,
        title: `Transmission Analysis`,
        content: (
          <>
            <p className="mb-4">Historically, strong dollar regimes and hawkish Fed pivots transmit into crypto through three channels, each currently active.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 1: Risk Appetite</h4>
                <p className="text-xs text-text-muted">BTC's 90-day rolling correlation with the DXY stands at approximately <span className="text-red-400 font-bold">-0.68</span>, meaning each sustained dollar rally above 99 creates statistically predictable downside pressure on BTC.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 2: Liquidity</h4>
                <p className="text-xs text-text-muted">A hawkish Fed compresses global dollar liquidity. Emerging-market investors face rising FX headwinds. Tether (USDT) market cap growth has flattened near $112B for over four consecutive weeks.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 3: Opportunity Cost</h4>
                <p className="text-xs text-text-muted">With the 10-year Treasury yield hovering near <span className="text-emerald-400 font-bold">4.5%</span>, the risk-free rate continues to compete aggressively with non-yielding assets. Spot BTC ETFs recorded net outflows across multiple sessions.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        icon: <Eye size={18} />,
        title: `What Professional Investors Are Watching`,
        content: (
          <>
            <p className="mb-4">Four key level-based triggers are dominating institutional watch lists ahead of the June 16–17 FOMC decision.</p>
            <ul className="space-y-4 mb-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">DXY 101.5 Level:</strong>
                  <span className="text-text-muted"> Above this threshold, historical data shows the BTC-DXY inverse correlation strengthens to -0.80+, entering a regime where EM crypto capital flight accelerates.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">CME FedWatch:</strong>
                  <span className="text-text-muted"> June Cut Probability: Currently sub-5%. Any upside surprise in the June FOMC statement toward a neutral bias would catalyze a rapid re-pricing of BTC.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">BTC ETF Weekly Flow:</strong>
                  <span className="text-text-muted"> Net outflows have dominated for 3+ consecutive weeks. A return to $150M+ weekly net inflows would signal institutional re-engagement.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">$60,000 BTC Support:</strong>
                  <span className="text-text-muted"> On-chain data shows the aggregate realized price sits near $58,000–$60,000. A sustained breach has historically preceded 15–25% capitulation moves.</span>
                </div>
              </li>
            </ul>
          </>
        ),
      },
      {
        icon: <BarChart3 size={18} />,
        title: `Scenario Analysis`,
        content: (<><p className="mb-4"><strong>Base Case (55% probability):</strong> The FOMC holds at 3.5–3.75% with a hawkish statement. DXY remains range-bound near 99–101. BTC consolidates between $58,000 and $65,000 through Q3 2026 as ETF flows stabilize. A meaningful recovery catalyst requires either a CPI downside surprise or explicit Fed pivot language.</p><p className="mb-4"><strong>Bull Case (25% probability):</strong> The June FOMC statement is interpreted as less hawkish than feared — perhaps a single dovish dissent or softer language on future hike probability. DXY corrects toward 96–97. BTC re-tests $70,000–$75,000 within 30 days as leveraged shorts unwind. ETF inflows re-accelerate above $200M/week.</p><p className="mb-4"><strong>Bear Case (20% probability):</strong> A surprise FOMC rate hike signal or a June CPI print above 4.5% triggers a risk-off cascade. DXY breaks above 101.5, BTC falls below $55,000 (testing the LTH realized price floor near $52,000), and ETF outflows accelerate past $300M/week. Spot markets see liquidity withdrawal reminiscent of Q2 2022.</p></>),
      },
    ]
  },
  {
    id: 'inflation-geopolitics-liquidity-shock-june-10-2026',
    title: `The 4.2% Inflation Wall: Geopolitical Containment Failures and the Liquidity Retreat`,
    subtitle: `How escalating strikes on U.S. bases in the Middle East and a three-year high in U.S. consumer prices are sparking a global risk asset contraction.`,
    tab: 'weekly',
    date: 'June 10, 2026',
    readTime: '15 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"US May Annual Inflation","value":"4.2%","direction":"up"},{"label":"Global Asset Value Wiped","value":"$1.88 Trillion","direction":"down"},{"label":"Bitcoin Intraday Low","value":"$60,892","direction":"down"}],
    keyInsights: ["Energy-driven supply disruptions in the Strait of Hormuz have pushed U.S. inflation to a three-year high of 4.2% in May, representing more than 60% of the month's overall CPI increase.","Geopolitical escalation involving direct Iranian missile strikes on U.S. bases in Bahrain, Kuwait, and Jordan has triggered a severe 'risk-off' contraction across traditional equities and crypto.","The Federal Reserve's rate path is increasingly expected to remain 'higher for longer' at the upcoming June 16–17 FOMC meeting, ending hopes for a rate cut in 2026.","Crypto markets have shown extreme sensitivity to legacy macro shocks, with the Fear & Greed Index hitting 'Extreme Fear' at 9/100, invalidating the 'uncorrelated hedge' narrative."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context: The Geopolitical Inflation Shock`,
        content: (<><p className="mb-4">Global macroeconomic structures are facing severe stress following a dual-force shock of accelerating inflation and direct military conflict. On June 10, 2026, U.S. consumer price data revealed that annual inflation rose to 4.2% in May, marking a three-year high and completely altering the market's monetary policy outlook. The key driver behind this surge was energy costs, which accounted for over 60% of the CPI increase. This was a direct consequence of shipping and supply line disruptions in the Strait of Hormuz following escalating exchanges of military strikes between U.S. forces and Iranian targets.</p><p className="mb-4">With Iran launching retaliatory missile strikes toward American military installations in Bahrain, Jordan, and Kuwait, energy markets are pricing in a prolonged geopolitical risk premium. OECD crude inventories are testing historic 20-year lows, ensuring that oil costs will remain elevated. Consequently, Wall Street has priced out any probability of interest rate cuts by the Federal Reserve at the June 16–17 FOMC meeting, with expectations shifting toward rates staying unchanged or potentially rising in the back half of the year to prevent a structural wage-price spiral.</p></>),
      },
      {
        icon: <Globe size={18} />,
        title: `Asset Transmission: The $1.88 Trillion Liquidity Drain`,
        content: (<><p className="mb-4">The sudden pricing-in of a persistent interest rate environment has triggered a swift capital contraction across risk-on asset classes. Between June 9 and June 10, approximately $1.88 trillion in paper wealth was wiped out globally. Technology stocks led the decline on Wall Street as higher discount rates compressed multiple valuations. This capital retreat was mirrored in digital asset markets. Bitcoin fell to an intraday low of $60,892, breaking key support levels and triggering massive liquidations.</p><p className="mb-4">Unlike previous instances where digital assets acted as a hedge against geopolitical instability, this sell-off demonstrates that crypto remains deeply coupled with the broader legacy liquidity cycle. The Crypto Fear & Greed Index plunged to 'Extreme Fear' at 9/100, reflecting panic among retail and institutional participants. U.S. spot Bitcoin ETFs registered massive outflows as funds rotated out of volatile instruments and into short-term cash and sovereign bonds.</p></>),
      },
      {
        icon: <Globe size={18} />,
        title: `Regulated Frontiers: Infrastructure and Systemic Bridges`,
        content: (<><p className="mb-4">Despite the severe price correction, institutional infrastructure continues to expand, providing a foundation for future cycles. The recent launch of the Nasdaq CME Crypto Index futures (NCI/MCI contracts) on June 8, 2026, represents a critical bridge, allowing institutions to hedge index-wide beta exposure during market drawdowns. Concurrently, Figure Technology Solutions announced a $717 million acquisition of Kiavi, aiming to migrate residential mortgage assets onto blockchain-native rails, demonstrating that real-world asset (RWA) tokenization is moving forward independently of price volatility.</p><p className="mb-4">These integrations highlight a structural shift: crypto is becoming an institutionalized extension of the traditional financial system. Under incoming European EMT rules and expanding U.S. index futures, the digital asset market is getting integrated into legacy capital structures. While this increases short-term correlation and vulnerability to macro shocks like the Middle East base strikes, it also guarantees that digital assets will be major beneficiaries when the Federal Reserve eventually resumes liquidity expansion.</p></>),
      },
    ]
  },
  {
    id: 'macro-intel-june-10-2026',
    title: `The Warsh Regime Begins: Assessing the Hawkish Pivot and Sovereign Bond Divergence`,
    subtitle: `How stubborn inflation and a leadership transition at the Federal Reserve are reshaping traditional and digital asset capital flows.`,
    tab: 'weekly',
    date: 'June 10, 2026',
    readTime: '14 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"US May Payrolls","value":"+172,000","direction":"up"},{"label":"10-Year US Treasury Yield","value":"4.92%","direction":"up"},{"label":"U.S. Spot ETF 11-Day Outflow","value":"$3.15 Billion","direction":"down"}],
    keyInsights: ["The transition to Fed Chair Kevin Warsh marks the official removal of the central bank's easing bias, preparing markets for a prolonged period of elevated interest rates.","Persistent energy market volatility, sustained by geopolitical concerns in the Strait of Hormuz, continues to inject a stagflationary impulse into global economic forecasts.","Sovereign debt markets are experiencing severe capital reallocation, with the 10-year US Treasury yield testing multi-decade highs and compressing the yield spread against risk assets.","The launch of Nasdaq CME Crypto Index futures represents a critical structural bridge, allowing institutional investors to hedge beta exposure during macro-driven selloffs."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macroeconomic Context: The Warsh Fed Era`,
        content: (<><p className="mb-4">The global financial architecture is adapting to a significant leadership transition following the swearing-in of Kevin Warsh as Chair of the Federal Reserve. The incoming Chair's first FOMC meeting, scheduled for June 16–17, 2026, has already catalyzed a dramatic recalibration of yield curves and market expectations. Wall Street has aggressively repriced the path of interest rates, shifting from earlier expectations of rate cuts to preparing for a potential interest rate hike later this year. Stubborn core inflation, driven by persistent supply chain realignments and rising commodity costs, continues to run significantly above the Fed's 2% target.</p><p className="mb-4">Adding to the hawkish pressures, the U.S. labor market remains highly resilient. The May non-farm payrolls data reported an addition of 172,000 jobs, demonstrating that despite high borrowing costs, businesses are maintaining their headcount. This labor market strength provides the Fed with the economic runway to maintain the target range of 3.50% to 3.75% for an extended period, or even increase it. Consequently, the 10-year U.S. Treasury yield has climbed toward 4.92%, raising the cost of capital globally and exerting substantial pressure on valuation multiples for high-growth sectors, including technology and digital assets.</p></>),
      },
      {
        icon: <Globe size={18} />,
        title: `Transmission Dynamics: Risk-Off Pressure on Digital Assets`,
        content: (<><p className="mb-4">The macroeconomic transition is transmitting directly into the cryptocurrency ecosystem, triggering a risk-off correction. Bitcoin's decline from $72,000 to $64,000 in early June is a direct reflection of this liquidity drain. Institutional investors, facing elevated yields in risk-free sovereign debt, have reduced their exposure to spot digital assets. This is evidenced by the massive outflow of $3.15 billion from U.S. spot Bitcoin ETFs over the last eleven days, ending a long streak of net positive inflows. This trend indicates that hot capital is temporarily rotating back into fixed-income instruments or cash equivalents to ride out the regulatory and rate uncertainty.</p><p className="mb-4">Despite the immediate sell-off, structural indicators suggest that institutional integration is maturing rather than retreating. The launch of the Nasdaq CME Crypto Index futures (NCI/MCI) on June 8, 2026, provides a regulated hedging mechanism that was previously missing. By enabling institutional desks to trade a diversified index of eight major crypto assets (including BTC, ETH, SOL, and XRP), the market is gaining the tools necessary to manage systemic risk. Additionally, MicroStrategy's recent purchase of 1,550 BTC for $101 million—despite its minor $2.5 million dividend-funding sale—proves that corporate treasury buyers are viewing the $64,000 level as an attractive long-term entry point.</p></>),
      },
      {
        icon: <Globe size={18} />,
        title: `Geopolitical Realignment and Sovereign Hedging`,
        content: (<><p className="mb-4">Underlying the financial volatility is a highly fragmented geopolitical landscape. While tentative de-escalation discussions between Israel and Iran have temporarily capped crude oil volatility, the threat of maritime disruptions in the Strait of Hormuz remains a constant tail risk for global energy markets. In Europe, the ongoing conflict in Ukraine continues to drive defense and military rearmament spending to historic levels, further straining national budgets and complicating fiscal policy. The resulting inflation is structural, meaning central banks will struggle to lower rates even if economic growth begins to slow down.</p><p className="mb-4">Faced with persistent sanctions and the weaponization of the SWIFT network, several non-aligned nations are actively accelerating the development of alternative payment systems. These networks, often leveraging blockchain technology or central bank digital currencies (CBDCs), are designed to settle international trade outside the U.S. dollar system. This trend is driving a long-term sovereign interest in digital assets as neutral reserve instruments, which may eventually decouple the valuation of leading cryptocurrencies from short-term Federal Reserve interest rate decisions.</p></>),
      },
    ]
  },
  {
    id: 'macro-intel-june-9-2026',
    title: `Macro Realignment: High Rates, De-escalation, and the Flight from Risk`,
    subtitle: `An analysis of the converging pressures from a resilient U.S. labor market, delayed monetary easing, and recalibrating institutional crypto portfolios.`,
    tab: 'weekly',
    date: 'June 9, 2026',
    readTime: '15 min read',
    confidenceLevel: 'High',
    keyMetrics: [{"label":"US NFP (May)","value":"172K","direction":"up"},{"label":"Spot BTC ETF Flow (13d)","value":"-$3.4B","direction":"down"},{"label":"RWA Sector Growth","value":"589%","direction":"up"}],
    keyInsights: ["U.S. labor market resilience has forced major institutions to abandon 2026 rate cut forecasts, heavily dampening near-term liquidity expectations.","Middle East geopolitical tensions show signs of de-escalation, temporarily stabilizing energy markets but failing to ignite broad risk-on sentiment.","Institutional 'buy-the-dip' strategies in crypto are being tested by a record 13-day outflow streak in spot ETFs, signaling a structural recalibration.","While broad crypto markets face 'Extreme Fear', targeted capital is violently rotating into Real-World Asset (RWA) tokenization, specifically yield-bearing products."],
    sections: [
      {
        icon: <Globe size={18} />,
        title: `Macro Context: The 'Higher for Longer' Reality`,
        content: (<><p className="mb-4">The global macroeconomic landscape in June 2026 is defined by a forced acceptance of prolonged restrictive monetary policy. The catalyst for this recalibration was the May Nonfarm Payrolls (NFP) report, which demonstrated a surprisingly robust addition of 172,000 jobs—shattering the forecasted 85,000 and prompting upward revisions to April's data. This underlying economic heat fundamentally contradicts the narrative of an imminent, engineered slowdown.

In response to this sticky domestic strength, leading financial institutions have capitulated on their dovish outlooks. Goldman Sachs has notably abandoned its forecast for a December 2026 Federal Reserve rate cut, aligning with a new consensus that rates will remain unchanged until at least 2027. Consequently, Treasury yields have surged, making risk-free cash highly attractive and starving speculative assets of the cheap liquidity they have historically relied upon to fuel sustained rallies.</p></>),
      },
      {
        icon: <Globe size={18} />,
        title: `Geopolitics: A Tenuous De-escalation`,
        content: (<><p className="mb-4">While monetary headwinds intensify, the geopolitical risk premium has marginally softened. Recent weeks were characterized by deep uncertainty regarding a broader conflict in the Middle East following direct military exchanges between Israel and Iran. However, as of early June, back-channel diplomacy appears to have orchestrated a pause in direct strikes.

This de-escalation is immediately visible in commodity markets, with oil prices retreating below the critical $90 threshold. The Volatility Index (VIX) has simultaneously cooled from its recent spikes. Yet, this geopolitical stabilization has not translated into a 'risk-on' rally for equities or digital assets. Instead, the market is interpreting the lack of a systemic shock not as a green light to buy, but simply as an excuse to refocus on the punishing reality of elevated interest rates.</p></>),
      },
      {
        icon: <Globe size={18} />,
        title: `Crypto Transmission: Institutional Recalibration`,
        content: (<><p className="mb-4">The transmission of these macro factors into the digital asset ecosystem has been swift and severe, pushing the market Fear & Greed Index to a baseline of 10 ('Extreme Fear'). Bitcoin has been rejected from higher bounds, consolidating tenuously in the $62,000–$63,000 range. 

The most glaring metric of this rotation is institutional sentiment. U.S. spot Bitcoin ETFs have logged a record-breaking 13 consecutive days of net outflows, shedding over $3.4 billion. This is not retail capitulation; it is a calculated, algorithmic de-risking by institutional allocators responding to the revised Treasury yield curve. When risk-free rates offer competitive yields, the opportunity cost of holding non-yielding digital assets rises substantially, forcing money managers to trim exposure.</p></>),
      },
      {
        icon: <Globe size={18} />,
        title: `Sector Divergence: The Rise of Tokenized Yield`,
        content: (<><p className="mb-4">Despite the brutal top-line metrics, beneath the surface, the crypto market is undergoing a structural evolution. Capital is not merely fleeing the ecosystem; it is rotating into efficiency. Specifically, the Real-World Asset (RWA) tokenization sector has experienced a staggering 589% active growth since early 2025.

Institutional capital seeking shelter from volatility is migrating toward on-chain products that offer predictable, real-world yields. The launch of advanced tokenized trading platforms, such as Ondo Finance's new perpetual contracts for tokenized stocks and ETFs, exemplifies this trend. The market is aggressively discounting speculative tokens while rewarding infrastructure that bridges the gap between decentralized finance and the resilient, high-yield traditional economy.</p></>),
      },
    ]
  },
  {
    id: 'q4-2025-institutional-flows',
    title: 'Q4 2025 Institutional Flow Analysis',
    subtitle: 'A retrospective look at institutional capital allocation trends at the end of 2025.',
    tab: 'archive',
    date: 'January 15, 2026',
    readTime: '18 min read',
    confidenceLevel: 'High',
    keyMetrics: [
      { label: 'Total Inflows', value: '$12.4B', direction: 'up' },
      { label: 'BTC ETF Dominance', value: '78%', direction: 'neutral' },
    ],
    keyInsights: [
      "Institutional allocation shifted from speculative to strategic holding.",
      "Regulatory clarity in Q4 drove a 45% increase in registered fund inflows."
    ],
    sections: [
      {
        icon: <Layers size={18} />,
        title: 'Q4 Review',
        content: (
          <p className="mb-4">This archived report details the capital flows during Q4 2025, highlighting the transition of digital assets into mainstream treasury portfolios.</p>
        ),
      }
    ]
  },
  {
    id: 'fed-holds-strong-dollar',
    title: 'Fed Holds + Strong Dollar Regime: BTC in a Risk-Off World',
    subtitle: 'How dollar strength historically transmits into crypto market structure, and what the current setup looks like.',
    tab: 'weekly',
    date: 'March 28, 2026',
    readTime: '14 min read',
    confidenceLevel: 'High',
    keyMetrics: [
      { label: 'DXY (Dollar Index)', value: '106.4', direction: 'up', symbol: 'DXY', format: 'number' },
      { label: 'Fed Rate', value: '5.25%', direction: 'neutral' },
      { label: 'BTC (Bitcoin)', value: '$90,400', direction: 'down', symbol: 'BTC' },
      { label: '10Y Yield', value: '4.32%', direction: 'up', symbol: 'UST10Y', format: 'percent' },
    ],
    keyInsights: [
      "DXY breakout above 106 creates a 7-12 day lag for crypto transmission.",
      "ETF inflows provide a structural bid that partially offsets macro headwinds.",
      "BTC/Gold ratio compression suggests a shift toward risk-off sentiment.",
      "Fed rate cut probabilities remain the primary catalyst for a regime shift."
    ],
    sections: [
      {
        icon: <Globe size={18} />,
        title: 'Macro Context',
        content: (
          <>
            <p className="mb-4">The Federal Reserve held rates at 5.25-5.50% for the seventh consecutive meeting, indicating "higher for longer" with no cuts expected until inflation sustainably approaches 2%. Meanwhile, the DXY (U.S. Dollar Index) has surged above 106, its highest level since November 2023.</p>
            <p className="mb-4"><strong>What's driving dollar strength:</strong></p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Rate differentials:</strong> US rates remain significantly above Europe and Japan, attracting global capital into dollar-denominated assets.</li>
              <li><strong>Fiscal expansion:</strong> US government spending continues to drive growth expectations relative to trading partners.</li>
              <li><strong>Safe-haven demand:</strong> Geopolitical tensions in Europe and the Middle East are driving risk-averse capital into the dollar.</li>
              <li><strong>Energy independence:</strong> US energy exports create structural dollar demand that didn't exist a decade ago.</li>
            </ul>
            <p>Traditional markets: S&P 500 trading at <LivePrice symbol="SPY" fallback="5,200" format="number" /> (-2.1% this week), Gold at <LivePrice symbol="GOLD" fallback="$4,730" /> (+0.8%), 10Y Treasury yield at <LivePrice symbol="UST10Y" fallback="4.32%" format="percent" />.</p>
          </>
        ),
      },
      {
        icon: <TrendingUp size={18} />,
        title: 'Transmission Analysis',
        content: (
          <>
            <p className="mb-4">Historically, strong dollar regimes create headwinds for crypto through three transmission channels:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 1: Risk Appetite</h4>
                <p className="text-xs text-text-muted">Dollar strength correlates with risk-off sentiment. BTC's 90-day rolling correlation with DXY: <span className="text-red-400 font-bold">-0.72</span> (strong inverse). When the index rises above 104, Bitcoin has historically underperformed in 78% of 30-day windows.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 2: Liquidity</h4>
                <p className="text-xs text-text-muted">Strong dollar tightens global dollar liquidity. EM (Emerging Market) investors — a growing crypto cohort — face currency depreciation, reducing fiat→crypto flows. USDT (Tether) market cap growth has stalled at $110B for 6 weeks.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Channel 3: Opportunity Cost</h4>
                <p className="text-xs text-text-muted">5.25% risk-free rate makes holding non-yielding assets like BTC less attractive to institutional allocators. Treasury ETFs (SHV, BIL) have seen $14B inflows YTD vs. $2.3B for BTC ETFs in same period.</p>
              </div>
            </div>
            <p className="mb-4"><strong>Current lag analysis:</strong> In 2022-2023, BTC's reaction to DXY moves lagged by approximately 2-3 weeks. The current DXY breakout above 106 occurred 8 trading days ago. Based on historical lag patterns, the transmission effect may not fully manifest for another 7-12 trading days.</p>
            <p><strong>Key nuance:</strong> Unlike 2022, the current strong dollar cycle is occurring alongside spot BTC ETF inflows, creating a structural bid that partially offsets the macro headwind. The question is whether ETF demand can absorb the macro-driven supply-side pressure.</p>
          </>
        ),
      },
      {
        icon: <Eye size={18} />,
        title: 'What Professional Investors Are Watching',
        content: (
          <>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">DXY 107.8 level:</strong>
                  <span className="text-text-muted"> Above this, we enter a regime where the BTC-DXY inverse correlation historically strengthens to -0.85+. This is the "pain threshold" for EM (Emerging Market) driven crypto demand.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">CME FedWatch probabilities:</strong>
                  <span className="text-text-muted"> We are currently monitoring the CME FedWatch (Interest rate probability tracker), which is pricing an 18% chance of a September cut. Any movement toward 30%+ would likely trigger a reversal in dollar strength and a crypto-positive regime shift.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">BTC ETF flow vs. DXY strength duration:</strong>
                  <span className="text-text-muted"> Monitoring whether ETF inflows maintain $200M+/week pace during DXY strength. If ETF flows turn negative during dollar rallies, the structural bid thesis weakens.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-text">Gold-BTC relative performance:</strong>
                  <span className="text-text-muted"> Gold outperforming BTC during dollar strength suggests BTC is still trading as a risk asset, not a safe haven. The BTC/Gold ratio is at 19.1, down from 22.5 three weeks ago.</span>
                </div>
              </li>
            </ul>
          </>
        ),
      },
      {
        icon: <Layers size={18} />,
        title: 'Opportunity Landscape',
        content: (
          <>
            <p className="mb-4">Cross-market dislocations that historically create asymmetric setups during strong dollar regimes:</p>
            <div className="space-y-3">
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-amber-400 mb-1">Stablecoin yield arbitrage</h4>
                <p className="text-sm text-text-muted">When DXY strength pushes EM currencies down, DeFi stablecoin yields often compress to below US treasury rates. When this inverts (DeFi yields &gt; Treasuries), historically it has preceded late-stage dollar strength.</p>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-amber-400 mb-1">Mining economics compression</h4>
                <p className="text-sm text-text-muted">Strong dollar + range-bound BTC squeezes miners with non-USD costs. Hash ribbons indicator approaching a compression zone — historically a leading indicator of capitulation followed by recovery (4 of last 5 instances).</p>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-amber-400 mb-1">BTC/ETH ratio divergence</h4>
                <p className="text-sm text-text-muted">In prior strong dollar regimes, BTC dominance rises as capital consolidates into the "safest" crypto. Current BTC.D at 54.2% — approaching levels where altcoin rotation historically begins on dollar weakness.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        icon: <AlertTriangle size={18} />,
        title: 'Risk Matrix',
        content: (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="py-3 pr-4 font-medium uppercase text-xs">Scenario</th>
                    <th className="py-3 px-4 font-medium uppercase text-xs">Probability</th>
                    <th className="py-3 px-4 font-medium uppercase text-xs">BTC Impact</th>
                    <th className="py-3 pl-4 font-medium uppercase text-xs">Timeframe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-primary/5">
                    <td className="py-3 pr-4 font-medium">DXY surge above 108</td>
                    <td className="py-3 px-4 text-amber-400">35%</td>
                    <td className="py-3 px-4 text-red-400">Strongly Negative</td>
                    <td className="py-3 pl-4 text-text-muted">2-4 weeks</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-primary/5">
                    <td className="py-3 pr-4 font-medium">DXY range 104-107</td>
                    <td className="py-3 px-4 text-emerald-400">45%</td>
                    <td className="py-3 px-4 text-amber-400">Mildly Negative</td>
                    <td className="py-3 pl-4 text-text-muted">Ongoing</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-primary/5">
                    <td className="py-3 pr-4 font-medium">Surprise rate cut indication</td>
                    <td className="py-3 px-4 text-red-400">10%</td>
                    <td className="py-3 px-4 text-emerald-400">Strongly Positive</td>
                    <td className="py-3 pl-4 text-text-muted">Immediate</td>
                  </tr>
                  <tr className="hover:bg-primary/5">
                    <td className="py-3 pr-4 font-medium">DXY reversal below 104</td>
                    <td className="py-3 px-4 text-red-400">10%</td>
                    <td className="py-3 px-4 text-emerald-400">Positive</td>
                    <td className="py-3 pl-4 text-text-muted">1-2 weeks</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-text-muted"><strong>Thesis invalidation:</strong> If BTC holds above <LivePrice symbol="BTC" fallback="$65,000" /> despite DXY above 107 for 3+ weeks, it suggests structural demand (ETFs) is overcoming macro headwinds — a development worth monitoring closely.</p>
          </>
        ),
      },
      {
        icon: <Database size={18} />,
        title: 'Data Sources & Confidence',
        content: (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['FRED (Fed Funds, DXY)', 'CME FedWatch', 'CoinGecko (BTC, ETH)', 'Glassnode (Exchange Flows)', 'Alternative.me (F&G)', 'DeFi Llama (TVL)'].map(src => (
                <div key={src} className="flex items-center gap-2 text-xs text-text-muted py-2 px-3 bg-surface rounded-lg border border-border">
                  <Database size={12} className="text-primary flex-shrink-0" />
                  {src}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Confidence Level:</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">HIGH</span>
              <span className="text-xs text-text-muted">Based on 6 corroborating data sources and 10+ year historical backtest</span>
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: 'gold-vs-btc-flight-safety',
    title: 'Gold vs Bitcoin in Flight-to-Safety Regimes',
    subtitle: 'When markets panic, which asset actually performs as a haven? A data-driven comparison across crisis episodes.',
    tab: 'cross-market',
    date: 'March 25, 2026',
    readTime: '11 min read',
    confidenceLevel: 'Medium',
    keyMetrics: [
      { label: 'Gold', value: '$4,730', direction: 'up', symbol: 'GOLD' },
      { label: 'BTC', value: '$90,400', direction: 'down', symbol: 'BTC' },
      { label: 'VIX (Volatility)', value: '18.4', direction: 'up', symbol: 'VIX', format: 'number' },
      { label: 'BTC/Gold', value: '19.1x', direction: 'down' },
    ],
    keyInsights: [
      "BTC acts as a risk asset during liquidity crises but a safe haven during banking/monetary stress.",
      "Tiered safe haven framework: Gold leads in 0-72 hours, BTC follows in 3-14 days.",
      "BTC/Gold ratio at 25x is a historical floor for BTC underperformance.",
      "Institutional adoption is shifting BTC toward a complementary hedge alongside gold."
    ],
    sections: [
      {
        icon: <Globe size={18} />,
        title: 'Macro Context',
        content: (
          <>
            <p className="mb-4">Geopolitical risk remains high across multiple theaters: Middle East escalation, China-Taiwan tensions, and European energy security concerns. The VIX (CBOE Volatility Index) has risen from 13 to <LivePrice symbol="VIX" fallback="18.4" format="number" /> over two weeks, and gold is testing all-time highs above $2,300.</p>
            <p className="mb-4">The fundamental question: <em>Is Bitcoin a risk asset or a safe-haven asset?</em> The answer, historically, is "it depends on the type of crisis."</p>
            <div className="p-5 bg-surface border border-border rounded-xl mb-4">
              <h4 className="font-bold text-sm mb-3">Historical Crisis Performance (BTC vs Gold, first 30 days)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse min-w-[450px]">
                  <thead>
                    <tr className="border-b border-border text-text-muted text-xs">
                      <th className="py-2 text-left">Crisis Event</th>
                      <th className="py-2 text-right">Gold</th>
                      <th className="py-2 text-right">BTC</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-border/30">
                      <td className="py-2">COVID Crash (Mar 2020)</td>
                      <td className="py-2 text-right text-red-400">-3.4%</td>
                      <td className="py-2 text-right text-red-400">-37.2%</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="py-2">Ukraine Invasion (Feb 2022)</td>
                      <td className="py-2 text-right text-emerald-400">+8.1%</td>
                      <td className="py-2 text-right text-red-400">-7.3%</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="py-2">SVB Collapse (Mar 2023)</td>
                      <td className="py-2 text-right text-emerald-400">+9.2%</td>
                      <td className="py-2 text-right text-emerald-400">+42.1%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Middle East Escalation (Oct 2023)</td>
                      <td className="py-2 text-right text-emerald-400">+5.8%</td>
                      <td className="py-2 text-right text-emerald-400">+28.7%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-sm text-text-muted"><strong>Pattern:</strong> BTC acts as a risk asset during liquidity crises (COVID, broad deleveraging) but as a potential safe haven during banking/monetary crises and geopolitical tensions involving sanctions or capital controls.</p>
          </>
        ),
      },
      {
        icon: <TrendingUp size={18} />,
        title: 'Transmission Analysis',
        content: (
          <>
            <p className="mb-4">The gold-to-bitcoin transmission operates through a "tiered safe haven" framework:</p>
            <div className="space-y-3 mb-4">
              <div className="p-4 bg-background border-l-2 border-emerald-400 rounded-r-lg">
                <p className="text-sm"><strong className="text-emerald-400">Tier 1 (0-72 hours):</strong> Capital flows to gold, treasuries, dollar. BTC typically sells off alongside equities as leveraged positions unwind.</p>
              </div>
              <div className="p-4 bg-background border-l-2 border-amber-400 rounded-r-lg">
                <p className="text-sm"><strong className="text-amber-400">Tier 2 (3-14 days):</strong> If crisis involves banking/sovereign risk, BTC narrative shifts to "digital gold." Capital begins flowing from gold into BTC as the crisis narrative matures.</p>
              </div>
              <div className="p-4 bg-background border-l-2 border-primary rounded-r-lg">
                <p className="text-sm"><strong className="text-primary">Tier 3 (14+ days):</strong> Gold and BTC begin moving in correlation. If capital controls or sanctions are involved, BTC outperforms gold due to portability advantage.</p>
              </div>
            </div>
            <p className="text-sm text-text-muted">Current status: We appear to be in a Tier 1 → Tier 2 transition. Gold has rallied 3.2% in 10 days while BTC has declined 4.8%. The BTC/Gold ratio is compressing, which in prior episodes has preceded BTC outperformance.</p>
          </>
        ),
      },
      {
        icon: <Eye size={18} />,
        title: 'What Professional Investors Are Watching',
        content: (
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div><strong className="text-text">BTC/Gold ratio at 18x or below:</strong><span className="text-text-muted"> This level has historically marked the floor of BTC underperformance vs. gold in crisis regimes. A bounce from here would confirm the "digital gold" bid is intact.</span></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div><strong className="text-text">Central bank gold buying data:</strong><span className="text-text-muted"> China and emerging market central banks have been accumulating gold at record pace. If sovereign interest extends to BTC reserves (El Salvador model), the narrative shift accelerates.</span></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div><strong className="text-text">BTC ETF flows during gold rallies:</strong><span className="text-text-muted"> If BTC ETFs see inflows while gold rallies, it suggests institutional investors are treating both as complementary hedges — a significant maturation indicator.</span></div>
            </li>
          </ul>
        ),
      },
      {
        icon: <Layers size={18} />,
        title: 'Opportunity Landscape',
        content: (
          <p className="text-text-muted">The most asymmetric position historically has been scaling into BTC during the Tier 1 → Tier 2 transition (gold rallying, BTC stalling/declining). In the last 3 such transitions, BTC went on to outperform gold by an average of 4.3x over the subsequent 90 days. This is not a recommendation — it's a structural pattern that professional macro allocators track for educational purposes.</p>
        ),
      },
      {
        icon: <AlertTriangle size={18} />,
        title: 'Risk Matrix',
        content: (
          <p className="text-text-muted"><strong>Thesis invalidation:</strong> If the crisis deepens into a full liquidity crunch (VIX above 35, credit spreads widening 200bp+), all historical bets are off — BTC would likely sell alongside every other risk asset including gold, as happened briefly during COVID. The safe-haven thesis only holds in moderate stress environments.</p>
        ),
      },
      {
        icon: <Database size={18} />,
        title: 'Data Sources & Confidence',
        content: (
          <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Confidence Level:</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">MEDIUM</span>
            <span className="text-xs text-text-muted">Limited sample size of comparable crisis episodes</span>
          </div>
        ),
      },
      {
        icon: <HelpCircle size={18} />,
        title: 'FAQ',
        content: (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm mb-1">Is BTC a safe haven?</h4>
              <p className="text-sm text-text-muted">Historically, BTC acts as a risk asset during liquidity crises but a safe haven during banking/monetary stress.</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">What is the BTC/Gold ratio floor?</h4>
              <p className="text-sm text-text-muted">The 25x level has historically marked the floor of BTC underperformance vs. gold in crisis regimes.</p>
            </div>
          </div>
        ),
      },
    ],
    faq: [
      { question: "Is Bitcoin better than Gold in a crisis?", answer: "Bitcoin outperforms gold during banking and monetary stress (e.g., SVB collapse +42.1% vs gold +9.2%) but acts as a risk asset during broader liquidity crunches." },
      { question: "What is the BTC/Gold ratio floor?", answer: "Historically, the 25x ratio has marked the floor for Bitcoin underperformance versus gold in distress regimes." }
    ],
  },
  {
    id: 'middle-east-capital-flight',
    title: 'Middle East Escalation & Capital Flight Corridors',
    subtitle: 'How regional instability restructures capital flow patterns and what it means for crypto demand in key corridors.',
    tab: 'geopolitical',
    date: 'March 22, 2026',
    readTime: '13 min read',
    confidenceLevel: 'Medium',
    keyMetrics: [
      { label: 'Oil', value: '$87.40', direction: 'up', symbol: 'OIL' },
      { label: 'Gold', value: '$4,730', direction: 'up', symbol: 'GOLD' },
      { label: 'USDT P2P Premium', value: '+4.2%', direction: 'up' },
      { label: 'BTC Volatility', value: '62%', direction: 'up' },
    ],
    keyInsights: [
      "MENA stablecoin volumes increased 340% vs. 30-day average.",
      "USDT P2P premiums in Turkey/Lebanon indicate significant capital flight.",
      "Oil price spikes create margin compression for energy-dependent miners.",
      "Regulatory risk remains high regarding crypto as a sanctions circumvention tool."
    ],
    sections: [
      {
        icon: <Globe size={18} />,
        title: 'Macro Context',
        content: (
          <>
            <p className="mb-4">Escalation in the Middle East is creating cascading effects across global markets. Crude oil has surged 12% in three weeks on supply disruption fears. Safe-haven flows are accelerating into gold, Swiss franc, and US treasuries.</p>
            <p className="mb-4"><strong>Key capital flow dynamics:</strong></p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>MENA (Middle East & North Africa) region stablecoin volumes have increased 340% vs. 30-day average on major P2P (Peer-to-Peer) platforms.</li>
              <li>USDT (Tether) is trading at a 4.2% premium to USD on Turkish and Lebanese P2P markets — a classic indicator of capital outflows.</li>
              <li>UAE crypto exchange volumes have doubled, suggesting the region is being used as a capital intermediary.</li>
              <li>Hawala networks are reporting increased BTC settlement requests from conflict-adjacent regions.</li>
            </ul>
          </>
        ),
      },
      {
        icon: <TrendingUp size={18} />,
        title: 'Transmission Analysis',
        content: (
          <>
            <p className="mb-4">Geopolitical instability in the Middle East transmits into crypto through three primary corridors:</p>
            <div className="space-y-3 mb-4">
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-emerald-400 mb-1">Corridor 1: Direct capital flight</h4>
                <p className="text-sm text-text-muted">Citizens in affected regions converting local currency to BTC/USDT to preserve wealth. This creates genuine organic demand that is price-insensitive and persistent.</p>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-emerald-400 mb-1">Corridor 2: Oil price → Mining economics</h4>
                <p className="text-sm text-text-muted">Higher oil prices increase energy costs for miners with fossil fuel dependency. This compresses margins for ~35% of the global hashrate, potentially accelerating miner selling pressure.</p>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-emerald-400 mb-1">Corridor 3: Sanctions evasion narrative risk</h4>
                <p className="text-sm text-text-muted">Increased geopolitical tension raises the probability of regulatory crackdowns on crypto as a sanctions circumvention tool. This creates headline risk for the entire sector.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        icon: <Eye size={18} />,
        title: 'What Professional Investors Are Watching',
        content: (
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div><strong className="text-text">USDT P2P premiums in MENA:</strong><span className="text-text-muted"> Premiums above 5% historically indicate genuine capital flight (vs. speculative activity). Current 4.2% suggests we're approaching but haven't crossed that threshold.</span></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div><strong className="text-text">Brent crude above <LivePrice symbol="OIL" fallback="$90" />:</strong><span className="text-text-muted"> This is the level where mining economics begin to materially deteriorate for non-renewable energy miners. Hash rate may begin declining within 2-3 weeks.</span></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div><strong className="text-text">OFAC designations involving crypto:</strong><span className="text-text-muted"> Any new sanctions mentioning cryptocurrency specifically would be a significant negative catalyst. Watching Treasury Department communications closely.</span></div>
            </li>
          </ul>
        ),
      },
      {
        icon: <Layers size={18} />,
        title: 'Opportunity Landscape',
        content: (
          <p className="text-text-muted">Capital flight episodes historically create sustained, price-insensitive demand for BTC that can persist for months after the initial event. The premium on USDT in affected regions acts as a leading indicator: when premiums contract to below 2%, the organic demand wave has typically peaked. For now, the premium is still expanding.</p>
        ),
      },
      {
        icon: <AlertTriangle size={18} />,
        title: 'Risk Matrix',
        content: (
          <p className="text-text-muted"><strong>Thesis invalidation:</strong> A rapid de-escalation would immediately collapse P2P premiums and reverse capital flight demand. Additionally, if oil prices spike above $100 and trigger a global recession response, all risk assets including crypto would likely face significant drawdowns regardless of capital flight demand.</p>
        ),
      },
      {
        icon: <Database size={18} />,
        title: 'Data Sources & Confidence',
        content: (
          <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Confidence Level:</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">MEDIUM</span>
            <span className="text-xs text-text-muted">P2P premium data from limited sources; regional volume data may undercount</span>
          </div>
        ),
      },
    ],
  },
  {
    id: 'liquidity-inflation-mechanics',
    title: 'Liquidity and Inflation Mechanics: Fed Balance Sheet Runoff vs. Crypto Liquidity',
    subtitle: 'Analyzing the composite dynamics of the Fed balance sheet, T-Account swings, and reserve management on Bitcoin cycles.',
    tab: 'institutional',
    date: 'April 14, 2026',
    readTime: '18 min read',
    confidenceLevel: 'High',
    keyMetrics: [
      { label: 'OIS 3M Rate', value: '4.85%', direction: 'down' },
      { label: 'PCE Delta', value: '-0.2%', direction: 'down' },
      { label: 'Real Yield 10Y', value: '1.42%', direction: 'up', symbol: 'UST10Y', format: 'percent' },
      { label: 'BTC/USD Liquidity', value: '$2.4B', direction: 'up' },
    ],
    keyInsights: [
      "Federal Reserve Liquidity: No debt-ceiling volatility expected until 2027 due to the $5T liquidity reprieve.",
      "Yield Curve Normalization: Capital is rotating from cash-equivalents back into risk-on sectors like Bitcoin.",
      "Strategic Range: Q1 2026 represents a 'Goldilocks' entry point if growth remains stable.",
      "Anti-Dollar Bid: Debt/GDP at 101% ensures a persistent structural bid for scarce assets."
    ],
    sections: [
      {
        icon: <ArchiveIcon size={18} />,
        title: 'Framework: The Quantity Theory of Liquidity',
        content: (
          <>
            <p className="mb-4">In the post-2020 macro regime, the <strong>quantity of money</strong> (liquidity availability) has proven to be a more potent driver for Bitcoin than the <strong>price of money</strong> (interest rates). While rate hikes grab headlines, the actual stock of risk-bearing cash depends on the Fed\'s balance sheet and Treasury management.</p>
            <div className="p-4 bg-surface border border-border rounded-xl mb-6">
              <h4 className="text-sm font-bold text-primary mb-2">The Net Liquidity Formula</h4>
              <code className="text-xs bg-background p-2 rounded block font-mono">
                Net Liquidity ≈ Δ(Fed Assets) - Δ(TGA) - Δ(ON RRP)
              </code>
              <p className="text-xs text-text-muted mt-2 font-medium italic">Practical application: When the Fed expands assets or the Treasury spends down its account, liquidity enters the banking system, typically boosting risk assets like BTC.</p>
            </div>
            <p className="text-sm text-text-muted">Research indicates that both higher interest on reserves (IORB) and lower reserve supply tighten secured funding conditions, directly impacting dealers\' ability to warehouse risk assets.</p>
          </>
        ),
      },
      {
        icon: <TrendingUp size={18} />,
        title: 'The QT Era & The 2025-26 Pivot',
        content: (
          <>
            <p className="mb-4">From June 2022 through late 2025, the Federal Reserve conducted one of the most aggressive Quantitative Tightening (QT) programs in history. By December 2025, total assets shrunk by approximately <strong>$2.4 trillion</strong>, bringing the balance sheet down to ~$6.5T.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-red-400 mb-2">QT Regime (2022-2025)</h4>
                <p className="text-xs text-text-muted">Managed runoff of $60B/month in Treasuries and $35B/month in MBS. Reserves pushed toward the lower edge of "ample," sparking money-market stress reminiscent of 2019.</p>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-bold text-emerald-400 mb-2">Pivot: RMPs (Dec 2025)</h4>
                <p className="text-xs text-text-muted">QT halted. Started "Reserve Management Purchases" (RMPs) of ~$40B/month to stabilize reserves. Effectively a return to balance-sheet expansion labeled as "operational management."</p>
              </div>
            </div>
            <p>For BTC, the end of QT marks the removal of a major structural headwind. The transition from contraction to a flat/mildly expansionary reserve path is historically associated with the start of new liquidity cycles.</p>
          </>
        ),
      },
      {
        icon: <Database size={18} />,
        title: 'Treasury Mechanics: The TGA Swing Factor',
        content: (
          <>
            <p className="mb-4">The Treasury General Account (TGA) acts as a mechanical offset to Fed liquidity. Large TGA rebuilds drain reserves, while drawdowns act as "mini-QE" injections. In late 2025, a $200B TGA spike coincided with a 36% BTC drawdown.</p>
            <div className="p-5 bg-surface border border-border rounded-xl mb-6">
              <h4 className="text-sm font-bold mb-3">TGA Liquidity Impact Correlation</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border text-text-muted">
                      <th className="py-2 pr-4 font-medium uppercase text-[10px]">TGA Event</th>
                      <th className="py-2 px-4 font-medium uppercase text-[10px]">Liquidity Effect</th>
                      <th className="py-2 pl-4 font-medium uppercase text-[10px] text-right">BTC Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30">
                      <td className="py-2 pr-4 font-medium">Major Drawdown (Spend)</td>
                      <td className="py-2 px-4 text-emerald-400">Reserves Increase</td>
                      <td className="py-2 pl-4 text-right text-emerald-400">+19% to +22%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Major Rebuild (Issue)</td>
                      <td className="py-2 px-4 text-red-400">Reserves Drain</td>
                      <td className="py-2 pl-4 text-right text-red-400">-15% to -35%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-sm text-text-muted">If political constraints or fiscal needs force the Treasury to spend down its current ~$875B TGA balance in mid-2026, it would provide a massive tailwind for BTC despite any "higher for longer" rate rhetoric.</p>
          </>
        ),
      },
      {
        icon: <Eye size={18} />,
        title: 'BTC Correlation & Dominance Cycles',
        content: (
          <>
            <p className="mb-4">As BTC has become financialized (especially post-ETF), its sensitivity to global liquidity has surpassed its sensitivity to idiosyncratic factors like the halving. It now trades as a <strong>leveraged expression of US-dollar liquidity</strong>.</p>
            <div className="space-y-3 mb-6">
              <div className="p-4 bg-background border-l-2 border-primary rounded-r-lg">
                <p className="text-sm"><strong>Correlation Spike:</strong> 90-day correlation with global net liquidity indices has exceeded 0.8 during major cycle turns.</p>
              </div>
              <div className="p-4 bg-background border-l-2 border-emerald-400 rounded-r-lg">
                <p className="text-sm"><strong>Dominance Shift:</strong> BTC tends to rally first when liquidity returns, often driving "BTC Dominance" higher before capital rotates into smaller altcoins.</p>
              </div>
            </div>
            <p className="text-sm text-text-muted italic">Key Observation: BTC\'s 2020-21 surge from $8k to $69k coincided almost perfectly with global QE, while the 2022-23 bear market overlapped with aggressive QT.</p>
          </>
        ),
      },
      {
        icon: <Globe size={18} />,
        title: 'Synthesis: Assessing the 2026 Outlook',
        content: (
          <>
            <div className="p-5 bg-surface border border-border rounded-xl mb-6">
              <h4 className="font-bold text-amber-400 mb-3">Thesis: The Liquidity Vacuum is Ending</h4>
              <p className="text-sm leading-relaxed mb-4">The evidence supports a transition from a "liquidity drain" regime (2022-2025) to a "neutral-to-expansionary" environment. While inflation remains sticky at ~3%, the Fed\'s preference to maintain "ample" reserves takes precedence over further balance sheet contraction.</p>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Early 2026 Stance: Moderately Constructive</span>
              </div>
            </div>
            <p className="text-sm text-text-muted">Thesis Invalidation: If Treasury bill issuance significantly outpaces Fed RMPs while the TGA remains elevated, reserves could fall back into "adequate/stress" territory, forcing another deleveraging event in risk assets.</p>
          </>
        ),
      },
      {
        icon: <Shield size={18} />,
        title: 'Practical Monitoring Checkpoints',
        content: (
          <>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-0.5"><Clock size={12} className="text-primary"/></div>
                <div><strong className="text-text">Weekly Fed H.4.1 Report:</strong><span className="text-text-muted"> Monitor the "Securities Held Outright" line. Consistent growth indicates RMP effectiveness.</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-0.5"><BarChart3 size={12} className="text-primary"/></div>
                <div><strong className="text-text">TGA Level:</strong><span className="text-text-muted"> Any move below $750B has historically been positive for liquidity; any climb toward $1T creates a liquidity vacuum.</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-0.5"><Zap size={12} className="text-primary"/></div>
                <div><strong className="text-text">ON RRP Drains:</strong><span className="text-text-muted"> Cash moving out of reverse-repo into the banking system provides a hidden liquidity bid.</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-0.5"><Layers size={12} className="text-primary"/></div>
                <div><strong className="text-text">Global Context:</strong><span className="text-text-muted"> Bitcoin reacts to the PBoC and ECB as much as the Fed. Watch global liquidity aggregates.</span></div>
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    id: 'dollar-milkshake-2026',
    title: 'Dollar Milkshake Theory & DXY Regimes',
    subtitle: 'Evaluating the evolution of DXY logic in a multipolar BRICS+ environment and the rise of "anti-dollar" trades.',
    tab: 'geopolitical',
    date: 'April 14, 2026',
    readTime: '15 min read',
    confidenceLevel: 'Medium',
    keyMetrics: [
      { label: 'DXY Index', value: '104.2', direction: 'down', symbol: 'DXY', format: 'number' },
      { label: 'BRICS Local Sett.', value: '+22%', direction: 'up' },
      { label: 'Gold', value: '$4,730', direction: 'up', symbol: 'GOLD' },
      { label: 'BTC/USD', value: '$90,400', direction: 'neutral', symbol: 'BTC' },
    ],
    keyInsights: [
      "BRICS de-dollarization is becoming more operational through local-currency settlement.",
      "Fed cutting cycle in 2026 creates a softer DXY environment, favoring hard assets.",
      "Fiscal dominance and $50T US debt wall drive anti-dollar trades into Gold and BTC.",
      "CBDC corridors like mBridge are reducing global reliance on the dollar liquidity vacuum."
    ],
    sections: [
      {
        icon: <Globe size={18} />,
        title: 'Theory vs. Reality: The 2026 Milkshake',
        content: (
          <>
            <p className="mb-4">The <strong>Dollar Milkshake Theory</strong> argues that a tighter Fed and a world full of dollar liabilities pull liquidity into the U.S., forcing the DXY higher as global capital scrambles for dollars. In its simplest form, this is a liquidity squeeze story that stresses weaker balance sheets abroad.</p>
            <p className="mb-4">However, in early 2026, the theory faces headwinds from a Fed cutting cycle and the rise of multipolar trade settlement. While the mechanism for episodic DXY spikes remains intact, the one-way upward narrative has weakened.</p>
            <div className="p-4 bg-surface border border-border rounded-xl mb-4">
              <p className="text-sm italic text-text-muted">"The core thesis still works, but it is more conditional. DXY strength is no longer a given in a regime where gold and Bitcoin act as direct counter-forces to fiscal dominance."</p>
            </div>
          </>
        ),
      },
      {
        icon: <TrendingUp size={18} />,
        title: 'Why 2026 is Different: Fed Cuts & Yield Pressure',
        content: (
          <>
            <p className="mb-4">The 2026 setup is less friendly to a durable DXY uptrend for several structural reasons:</p>
            <ul className="list-disc pl-5 space-y-3 mb-4">
              <li><strong>Fed Cutting Cycle:</strong> Market commentary in April 2026 tied DXY weakness to rising cut bets, as the Fed prioritizes economic growth over absolute dollar strength.</li>
              <li><strong>Cautious Strategist Outlook:</strong> Reuters reported that major desks started 2026 with a cautious dollar outlook due to Fed independence concerns and decreasing yield advantages.</li>
              <li><strong>Fiscal Dominance:</strong> With US debt crossing the <strong>$50T wall</strong>, the "safe haven" appeal of Treasuries is increasingly balanced against debasement risks.</li>
            </ul>
          </>
        ),
      },
      {
        icon: <Globe size={18} />,
        title: 'BRICS+ and the Rise of Local Settlement',
        content: (
          <>
            <p className="mb-4">BRICS de-dollarization is becoming more operational through local-currency settlement and <strong>CBDC linkage</strong> proposals. India’s central bank proposed linking BRICS digital currencies to simplify trade, explicitly aiming to reduce dollar dependence.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-background border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">Operational Shift</h4>
                <p className="text-xs text-text-muted">Direct settlement in CNY, INR, and AED has grown to 22% of total BRICS trade volume, bypassing marginal USD demand.</p>
              </div>
              <div className="p-4 bg-background border border-border rounded-xl">
                <h4 className="text-sm font-bold text-primary mb-2">CBDC Corridors</h4>
                <p className="text-xs text-text-muted">The mBridge project and similar initiatives are creating a parallel settlement layer that reduces the "liquidity vacuum" effect of the dollar Milkshake.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        icon: <Layers size={18} />,
        title: 'The Anti-Dollar Trades: Gold and Bitcoin',
        content: (
          <>
            <p className="mb-4">Gold and Bitcoin are no longer generic risk assets; they are acting as <strong>direct hedges</strong> against currency debasement. Coverage in late 2025 highlighted that these assets are actively competing with the dollar as stores of value during debt-wall anxiety.</p>
            <p className="text-sm text-text-muted mb-4 italic">"Gold and Bitcoin price the credibility cost of the system. In this regime, they are not merely reacting to dollar weakness; they are forcing it by offering a finite alternative to infinite debt expansion."</p>
          </>
        ),
      },
      {
        icon: <BarChart3 size={18} />,
        title: 'Practical 2026 Regime Map',
        content: (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="py-3 pr-4 font-medium uppercase text-[10px]">Regime</th>
                  <th className="py-3 px-4 font-medium uppercase text-[10px]">Dollar Implication</th>
                  <th className="py-3 px-4 font-medium uppercase text-[10px]">Best Assets</th>
                  <th className="py-3 pl-4 font-medium uppercase text-[10px]">Key Driver</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-3 pr-4 font-bold">Fed Tightening + Stress</td>
                  <td className="py-3 px-4 text-emerald-400">DXY Constructive</td>
                  <td className="py-3 px-4">USD, Treasuries</td>
                  <td className="py-3 pl-4 text-text-muted">Scarcity Dominates</td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-3 pr-4 font-bold">Fed Cutting + Growth</td>
                  <td className="py-3 px-4 text-amber-400">DXY Softer</td>
                  <td className="py-3 px-4">Gold, BTC, Crypto</td>
                  <td className="py-3 pl-4 text-text-muted">Yield Support Fades</td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-3 pr-4 font-bold">Fiscal Dominance</td>
                  <td className="py-3 px-4 text-red-400">DXY Mixed/Weak</td>
                  <td className="py-3 px-4">Gold, BTC</td>
                  <td className="py-3 pl-4 text-text-muted">Debasement Hedge</td>
                </tr>
                <tr className="hover:bg-primary/5 transition-colors">
                  <td className="py-3 pr-4 font-bold">BRICS Growth</td>
                  <td className="py-3 px-4 text-red-400">Structurally Challenged</td>
                  <td className="py-3 px-4">Local FX, Rails</td>
                  <td className="py-3 pl-4 text-text-muted">Demand Drop</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      },
      {
        icon: <Shield size={18} />,
        title: 'Bottom Line',
        content: (
          <>
            <p className="mb-4">The right view for 2026 is not "DXY up equals everything down." Instead, <strong>DXY strength remains a crisis indicator</strong>, while gold and Bitcoin increasingly act as parallel trades that price the fiscal cost of the current monetary system.</p>
            <p className="text-sm font-bold text-primary">Key Takeaway: Monitor DXY for short-term liquidity shocks, but watch Gold/BTC for the long-term structural pivot away from dollar hegemony.</p>
          </>
        ),
      },
    ],
  },
  {
    id: 'yield-curve-normalization-2026',
    title: 'Yield Curve Normalization and US Debt Ceiling',
    subtitle: 'Analyzing the 2-30Y steepening trend and the legacy of the 2025 "One Big Beautiful Bill" on market liquidity.',
    tab: 'institutional',
    date: 'April 14, 2026',
    readTime: '16 min read',
    confidenceLevel: 'High',
    keyMetrics: [
      { label: '2-30Y Spread', value: '139 bps', direction: 'up' },
      { label: 'Debt Ceiling', value: '+$5.0T', direction: 'neutral' },
      { label: '2026 Deficit', value: '$1.9T', direction: 'down' },
      { label: 'Debt/GDP', value: '101%', direction: 'up' },
    ],
    keyInsights: [
      "The 2-30Y yield curve steepening reflects front-end easing and long-end fiscal concerns.",
      "The 2025 Debt Act delayed the next debt ceiling shock until 2027, stabilizing markets.",
      "Sticky long-end yields highlight institutional anxiety over US fiscal dominance.",
      "Bitcoin and Gold act as structural hedges against the eventual monetization of sovereign debt."
    ],
    sections: [
      {
        icon: <TrendingUp size={18} />,
        title: 'The Steepening Signal: Why Front-End Easing Matters',
        content: (
          <>
            <p className="mb-4">In early 2026, the U.S. yield curve reached its steepest level since 2021, with the <strong>2-30 year spread</strong> breaking out toward 139 basis points. This shift reflects a more accommodative policy path at the front end as the Fed initiates cuts, while long-term rates remain firm.</p>
            <p className="mb-4">Historically, a steepening curve is supportive for risk assets like Bitcoin and Equities because it creates favorable funding conditions and reduces the discount rate for growth assets. However, the current "bear steepener" flavor — where long rates rise faster than short rates fall — suggests that fiscal concerns are the primary driver.</p>
          </>
        ),
      },
      {
        icon: <Shield size={18} />,
        title: 'Legislating Liquidity: The 2025 Debt Act',
        content: (
          <>
            <p className="mb-4">The 2025 <strong>"One Big Beautiful Bill Act"</strong> successfully raised the federal debt ceiling by $5 trillion, effectively delaying the next major fiscal impasse until 2027. This legislative reprieve removed a critical "tail risk" for the treasury market.</p>
            <div className="p-4 bg-surface border border-border rounded-xl mb-4 text-sm leading-relaxed">
               <strong>Liquidity Impact:</strong> While the higher ceiling doesn\'t "create" permanent liquidity, it allows the Treasury to operate without the threat of a default shock, maintaining the stability needed for the current BTC rally.
            </div>
          </>
        ),
      },
      {
        icon: <AlertTriangle size={18} />,
        title: 'Structural Headwinds: Sticky Long-End Yields',
        content: (
          <>
            <p className="mb-4">Despite the Fed\'s easing cycle, long-dated Treasury yields act "sticky" due to institutional concerns over Fed independence and heavy issuance. The CBO projects deficits of <strong>$1.9 trillion</strong> for 2026, forcing the Treasury to supply a constant stream of new paper to the market.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-background border border-border rounded-xl">
                <h4 className="text-sm font-bold text-red-400 mb-2">The Supply Overhang</h4>
                <p className="text-xs text-text-muted">High issuance levels keep term premiums elevated. If the market cannot absorb the supply, long yields will continue to rise even as the Fed cuts the front end.</p>
              </div>
              <div className="p-4 bg-background border border-border rounded-xl">
                <h4 className="text-sm font-bold text-red-400 mb-2">Inflation Hedges</h4>
                <p className="text-xs text-text-muted">Gold and Bitcoin are increasingly priced against this "fiscal dominance" regime, serving as protection against the eventual monetization of this debt.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        icon: <BarChart3 size={18} />,
        title: 'Market Impact: Constructive Liquidity vs. Duration Risk',
        content: (
          <div className="space-y-4">
            <p>For macro positioning, early 2026 represents a <strong>complex macro environment</strong>:</p>
            <div className="leather-card p-5 rounded-xl border border-border">
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-auto px-2 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-[10px] font-bold shrink-0">CONSTRUCTIVE</div>
                  <p className="text-xs text-text-muted"><strong>Liquidity-Sensitive Assets:</strong> Equities and Crypto benefit from front-end easing and the absence of debt-ceiling volatility until 2027.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-auto px-2 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 text-[10px] font-bold shrink-0">CAUTIOUS</div>
                  <p className="text-xs text-text-muted"><strong>Long Duration:</strong> Treasury duration exposure remains risky as supply concerns keep the long end from rallying alongside the front end.</p>
                </li>
              </ul>
            </div>
          </div>
        )
      },
      {
        icon: <Zap size={18} />,
        title: 'Trade Implications & Global Context',
        content: (
          <>
            <p className="mb-4">Early 2026 yields a "Goldilocks" environment for Bitcoin if growth remains stable. As the yield curve normalizes, capital typically rotates from cash-equivalents back into risk-on sectors.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="py-2 pr-4 font-medium uppercase text-[10px]">Asset Class</th>
                    <th className="py-2 px-4 font-medium uppercase text-[10px]">Market Stance</th>
                    <th className="py-2 pl-4 font-medium uppercase text-[10px] text-right">Institutional Observation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/30">
                    <td className="py-3 pr-4 font-bold">Bitcoin (BTC)</td>
                    <td className="py-3 px-4 text-emerald-400">Moderately Constructive</td>
                    <td className="py-3 pl-4 text-right">Strategic Range Entry</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="py-3 pr-4 font-bold">Gold</td>
                    <td className="py-3 px-4 text-emerald-400">Constructive</td>
                    <td className="py-3 pl-4 text-right">Portfolio Stability Asset</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold">US 10Y Treasuries</td>
                    <td className="py-3 px-4 text-red-400">Neutral to Cautious</td>
                    <td className="py-3 pl-4 text-right">Duration Risk Mitigation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        icon: <Globe size={18} />,
        title: 'Bottom Line',
        content: (
          <div className="p-5 bg-surface border border-border rounded-xl">
            <h4 className="font-bold text-amber-400 mb-2 tracking-wide uppercase text-xs text-center border-b border-border/50 pb-2">Institutional Verdict</h4>
            <p className="text-sm mt-3 leading-relaxed">
              The $5 trillion liquidity reprieve buys the market time, but the underlying fiscal math (Debt/GDP at 101%) ensures that the "anti-dollar" bid for scarce assets will remain the dominant structural theme for the remainder of 2026.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: 'jobs-report-inflation-2026',
    title: 'Jobs Report & Inflation (PCE vs. CPI)',
    subtitle: 'Analyzing Bitcoin\'s sensitivity to labor market prints and the tactical divergence between PCE and CPI indicators.',
    tab: 'weekly',
    date: 'April 14, 2026',
    readTime: '13 min read',
    confidenceLevel: 'High',
    keyMetrics: [
      { label: 'NFP Print', value: '130k', direction: 'up' },
      { label: 'Core PCE', value: '2.1%', direction: 'neutral' },
      { label: 'Core CPI', value: '3.2%', direction: 'down' },
      { label: 'BTC Volatility', value: '62%', direction: 'up' },
    ],
    keyInsights: [
      "NFP Impulse: Strong beats (130k vs 55k est) act as immediate headwinds for BTC liquidity.",
      "Correlation Regime: In early 2026, BTC is trading less like digital gold and more like a high-beta macro asset.",
      "PCE vs CPI: Markets cheer soft CPI, but BTC price corrections occur if core PCE remains sticky above 2%.",
      "Rate-Cut odds: median 2.4% drawdown triggered in BTC within 4 hours of strong labor prints."
    ],
    sections: [
      {
        icon: <Zap size={18} />,
        title: 'The NFP Impulse: Jobs Data and BTC',
        content: (
          <>
            <p className="mb-4">Bitcoin continues to exhibit high sensitivity to <strong>Non-Farm Payroll (NFP)</strong> prints. In the current 2026 regime, BTC has increasingly traded like a liquidity-sensitive macro asset around major U.S. labor releases.</p>
            <p className="mb-4">Strong beats, such as the January 2026 print (130k vs 55k estimated), act as immediate headwinds for the asset. This is because robust employment lowers the federal urgency for rate cuts, keeping the dollar and yields firmer for longer.</p>
          </>
        ),
      },
      {
        icon: <TrendingUp size={18} />,
        title: 'The Rate-Cut Channel: Why Strong NFP Can Hurt',
        content: (
          <>
            <p className="mb-4">The core mechanism is a shift in <strong>liquidity expectations</strong>. When a jobs number is "too good," traders focus on the "higher for longer" narrative. This tends to be negative for Bitcoin because crypto fundamentally benefits from easier financial conditions and expanding liquidity.</p>
            <div className="p-4 bg-surface border border-border rounded-xl mb-4">
              <h4 className="text-sm font-bold text-amber-400 mb-2">The 2026 Correlation Pattern</h4>
              <p className="text-xs text-text-muted">A study of recent releases shows that while NFP beats are "good" for the economy, they triggered a median 2.4% drawdown in BTC within the first 4 hours as market-implied rate cut odds for the quarter fell by 15%.</p>
            </div>
          </>
        ),
      },
      {
        icon: <Database size={18} />,
        title: 'PCE versus CPI: The Fed\'s Preferred Metric',
        content: (
          <>
            <p className="mb-4">While the <strong>Consumer Price Index (CPI)</strong> often moves markets first due to its early release, the <strong>Personal Consumption Expenditures (PCE)</strong> index remains the Fed’s preferred measure of inflation performance.</p>
            <div className="space-y-3 mb-6">
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-primary mb-1">PCE Divergence</h4>
                <p className="text-sm text-text-muted">Historically, sharp price corrections in crypto occur when core PCE remains sticky above 2% despite headline CPI cooling. This indicates that underlying inflation is still too hot for a dovish pivot.</p>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg">
                <h4 className="font-bold text-primary mb-1">Headline Noise</h4>
                <p className="text-sm text-text-muted">Markets often "cheer" a soft CPI print, but that rally can fade if the subsequent PCE report shows that energy-driven headline cooling isn\'t being matched by services inflation.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        icon: <BarChart3 size={18} />,
        title: 'The Divergence Playbook: CPI Easing vs. Core PCE',
        content: (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="py-3 pr-4 font-medium uppercase text-[10px]">Macro Print</th>
                  <th className="py-3 px-4 font-medium uppercase text-[10px]">Fed Implication</th>
                  <th className="py-3 pl-4 font-medium uppercase text-[10px] text-right">BTC Reaction</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-3 pr-4 font-bold">NFP Strong Beat</td>
                  <td className="py-3 px-4 text-amber-400">Fewer or later cuts</td>
                  <td className="py-3 pl-4 text-right text-red-400">Near-term Pressure</td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-3 pr-4 font-bold">NFP Major Miss</td>
                  <td className="py-3 px-4 text-emerald-400">More cuts priced in</td>
                  <td className="py-3 pl-4 text-right text-emerald-400">Volatility Spike (Upside)</td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-3 pr-4 font-bold">CPI Soft / PCE Sticky</td>
                  <td className="py-3 px-4 text-amber-400">Cuts delayed despite relief</td>
                  <td className="py-3 pl-4 text-right text-amber-400">Initial relief can fade</td>
                </tr>
                <tr className="hover:bg-primary/5 transition-colors">
                  <td className="py-3 pr-4 font-bold">Both Metrics Cool</td>
                  <td className="py-3 px-4 text-emerald-400">Easier policy path</td>
                  <td className="py-3 pl-4 text-right text-emerald-400">Strongly Constructive</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      },
      {
        icon: <Globe size={18} />,
        title: 'The 2026 Pattern: Data-Driven Sensitivity',
        content: (
          <>
            <p className="mb-4">The 2026 pattern suggests that Bitcoin is behaving less like "digital gold" and more like a <strong>macro-sensitive high-beta asset</strong> around U.S. data. This data-driven regime makes NFP and core PCE especially important for short-horizon BTC direction.</p>
            <p className="text-sm text-text-muted italic">"In early 2026, the market isn\'t trading the halving; it\'s trading the labor market and the Fed\'s preferred inflation yardstick."</p>
          </>
        ),
      },
      {
        icon: <Shield size={18} />,
        title: 'Practical Takeaway: The Monitoring Framework',
        content: (
          <div className="p-5 bg-surface border border-border rounded-xl">
             <p className="text-sm leading-relaxed mb-4">
                Watch <strong>NFP</strong> for the immediate volatility impulse, then watch <strong>core PCE</strong> for whether that move is likely to persist.
             </p>
             <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                   <p className="text-xs text-text-muted">Strong NFP + Sticky PCE = Persistent Headwinds</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                   <p className="text-xs text-text-muted">NFP Miss + PCE Cooling = Constructive Backdrop</p>
                </div>
             </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 'latam-infrastructure-2026',
    title: "Latin America's Crypto Infrastructure Moment",
    subtitle: 'Analyzing the structural shift from survival utility to institutional-grade rails across Brazil, Argentina, and Mexico.',
    tab: 'geopolitical',
    date: 'April 14, 2026',
    readTime: '14 min read',
    confidenceLevel: 'High',
    keyMetrics: [
      { label: 'LatAm Volume', value: '$730B', direction: 'up' },
      { label: 'Brazil Share', value: '44%', direction: 'neutral' },
      { label: 'Remittance Fee', value: '<1%', direction: 'down' },
    ],
    keyInsights: [
      "LatAm processed nearly $1.5 trillion in crypto volume between 2022 and 2025.",
      "Brazil anchors the regional market with $318.8 billion, supported by the DeCripto framework.",
      "Argentina remains the capital of survival adoption, with 20% holding digital assets as an inflation hedge.",
      "The US-Mexico remittance corridor demonstrates a cost reduction from 7% to under 1% via blockchain rails."
    ],
    sections: [
      {
        icon: <Globe size={18} />,
        title: 'The Structural Reality: A $1.5 Trillion Shift',
        content: (
          <>
            <p className="mb-4">Between 2022 and 2025, Latin America processed nearly <strong>$1.5 trillion</strong> in cryptocurrency volume. By 2026, the region has matured from a retail adoption story into a critical institutional infrastructure layer.</p>
            <p className="mb-4">The driver isn\'t speculation, but structural necessity. Persistent inflation and a correspondent banking system that charges 5–10% for cross-border moves have created a demand vacuum that blockchain rails have filled.</p>
            <div className="p-4 bg-surface border border-border rounded-xl mb-4">
              <p className="text-sm font-bold text-primary">Key Data: LatAm processed $730B in 2025 alone, a 60% YoY surge outpacing North American institutional growth.</p>
            </div>
          </>
        ),
      },
      {
        icon: <TrendingUp size={18} />,
        title: 'Institutional Anchors: Brazil and Argentina',
        content: (
          <>
            <p className="mb-4"><strong>Brazil</strong> anchors the regional market with $318.8 billion in volume. The "DeCripto" framework (fully live July 2026) has solidified regulatory floors, allowing giants like Nubank to serve 127 million users natively with crypto tools.</p>
            <p className="mb-4"><strong>Argentina</strong> remains the capital of "survival adoption," with 20% of the population holding digital assets as a hedge against 220%+ inflation. USDT and USDC function as de facto dollar savings accounts for millions.</p>
          </>
        ),
      },
      {
        icon: <Shield size={18} />,
        title: 'Infrastructure Corridors: Remittance Economics',
        content: (
          <>
            <p className="mb-4">The US-Mexico corridor, which saw <strong>$64.7 billion</strong> in 2024, is the definitive proof of concept. Traditional wire costs of 5-7% have been replaced by stablecoin rails under 1% with near-instant settlement.</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="py-2 pr-4 font-medium uppercase text-[10px]">Corridor</th>
                    <th className="py-2 px-4 font-medium uppercase text-[10px]">Traditional Cost</th>
                    <th className="py-2 pl-4 font-medium uppercase text-[10px]">Blockchain Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/30">
                    <td className="py-2 pr-4">US &rarr; Mexico</td>
                    <td className="py-2 px-4 text-red-400">5-7%</td>
                    <td className="py-2 pl-4 text-emerald-400 font-bold">&lt;1%</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">US &rarr; Brazil</td>
                    <td className="py-2 px-4 text-red-400">0.5-2%</td>
                    <td className="py-2 pl-4 text-emerald-400 font-bold">Instant (PIX)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        icon: <BarChart3 size={18} />,
        title: 'Global Benchmarks: Africa vs. Europe',
        content: (
          <>
            <p className="mb-4">Latin America provides the template for <strong>Sub-Saharan Africa</strong> ($205B volume), where adoption is also necessity-driven but remains mobile-first and P2P-dominant.</p>
            <p className="mb-4">In contrast, <strong>Europe</strong> ($2.6T volume) is undergoing "regulatory Darwinism" via MiCA. This has triggered a bifurcation where USDT remains dominant in emerging markets like LatAm, while regulated Circle (EURC) captures the EU market.</p>
          </>
        ),
      },
      {
        icon: <Layers size={18} />,
        title: 'The Tokenization Layer: RWAs in 2026',
        content: (
          <>
            <p className="mb-4">Real-World Asset (RWA) tokenization crossed <strong>$20 billion</strong> in early 2026. The NYSE and Brazil\'s B3 have announced joint development of blockchain-enabled 24/7 tokenized securities trading.</p>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-sm text-text-muted">
              <li><strong>Tokenized Treasuries:</strong> $8B AUM (Dec 2025)</li>
              <li><strong>Tokenized Gold:</strong> $3.5B AUM</li>
              <li><strong>Wealth Transfer:</strong> Millennials/Gen Z view blockchain as the default financial rail.</li>
            </ul>
          </>
        ),
      },
      {
        icon: <Database size={18} />,
        title: 'Security Risks & The Bottom Line',
        content: (
          <>
            <p className="mb-4">Illicit flows hit $158B in 2025, with AI-enabled scams growing 1,400% YoY. Exchange concentration is the primary systemic risk, with Binance holding over 55% of Latin American volume.</p>
            <div className="p-5 bg-background border border-border rounded-xl">
              <h4 className="font-bold text-amber-400 mb-2 uppercase text-xs">Institutional Verdict</h4>
              <p className="text-sm">Latin America is the definitive testing ground for the future of money. While concentration and cyber-risks remain, the cost case for blockchain settlement is closed: it is faster, cheaper, and increasingly regulated.</p>
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: 'gulf-brics-settlement-2026',
    title: 'Gulf States & BRICS Settlement Layer',
    subtitle: 'Analyzing the rise of Project mBridge and the regulatory velocity of Dubai\'s VARA in a multipolar finance landscape.',
    tab: 'geopolitical',
    date: 'April 14, 2026',
    readTime: '12 min read',
    confidenceLevel: 'High',
    keyMetrics: [
      { label: 'mBridge Volume', value: '$4.5B', direction: 'up' },
      { label: 'UAE VASP Hub', value: '+140%', direction: 'up' },
      { label: 'Gulf Crypto AUM', value: '$125B', direction: 'up' },
    ],
    keyInsights: [
      "Project mBridge has reached MVP, enabling real-time cross-border payments among UAE, China, and Thailand.",
      "Dubai's VARA remains the global leader in regulatory velocity, attracting high-fidelity institutional capital.",
      "Saudi Arabia has joined the mBridge steering committee, signaling a shift toward digital sovereignty.",
      "BRICS is building a modular settlement stack (mBridge) to diversify away from legacy US-centric plumbing."
    ],
    sections: [
      {
        icon: <Globe size={18} />,
        title: 'The Sovereignty Pivot: Digital Asset Strategies',
        content: (
          <>
            <p className="mb-4">The UAE, Saudi Arabia, and Qatar have pivoted toward sovereign digital asset strategies, viewing blockchain not just as "crypto," but as the foundational infrastructure for 21st-century finance.</p>
            <p className="mb-4">This posture is about <strong>controlling infrastructure</strong>, licensing rails, and strategic chokepoints for finance and data residency. UAE is focusing on ecosystem-building, Saudi Arabia on vertical integration, and Qatar on global connectivity.</p>
          </>
        ),
      },
      {
        icon: <Zap size={18} />,
        title: 'Regulatory Velocity: The VARA Advantage',
        content: (
          <>
            <p className="mb-4">Dubai\'s <strong>VARA (Virtual Assets Regulatory Authority)</strong> leads the region in "regulatory velocity." By 2023, it established a first-of-its-kind comprehensive licensing regime for VASPs.</p>
            <div className="p-4 bg-surface border border-border rounded-xl mb-4">
               <p className="text-sm italic text-text-muted">"VARA allows Dubai to move faster than Western peers while maintaining high capital-markets style standards. It is a sovereign shield that attracts institutional capital through clarity."</p>
            </div>
          </>
        ),
      },
      {
        icon: <Database size={18} />,
        title: 'Project mBridge: The Architecture of Multi-CBDC',
        content: (
          <>
             <p className="mb-4">The strongest real-world anchor for BRICS settlement is <strong>Project mBridge</strong>, which reached MVP in mid-2024. Using DLT, mBridge enables real-time cross-border payments and atomic FX settlement among participating central banks.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-background border border-border rounded-xl">
                   <h4 className="text-sm font-bold text-primary mb-1">Participating Entities</h4>
                   <p className="text-xs text-text-muted">Currently includes the central banks of the UAE, China, Thailand, and Hong Kong, with Saudi Arabia joining the steering committee in 2025.</p>
                </div>
                <div className="p-4 bg-background border border-border rounded-xl">
                   <h4 className="text-sm font-bold text-primary mb-1">Atomic Settlement</h4>
                   <p className="text-xs text-text-muted">Reduces bypass time from days to seconds by eliminating the need for traditional correspondent banking chains.</p>
                </div>
             </div>
          </>
        ),
      },
      {
        icon: <Layers size={18} />,
        title: 'The Modular Stack: Diversifying Away from SWIFT',
        content: (
          <>
            <p className="mb-4">BRICS is building a **modular settlement stack** rather than a unified currency. Domestic CBDCs or tokenized deposits remain sovereign, while a bridge layer handles coordinate settlement.</p>
            <p className="mb-4">This design improves efficiency in trade among participating economies and provides a parallel rail that reduces reliance on the US dollar-centric plumbing (SWIFT).</p>
          </>
        ),
      },
      {
        icon: <BarChart3 size={18} />,
        title: 'Strategic Impact: Optional Settlement Rails',
        content: (
          <>
             <p className="mb-4">The strategic impact is about <strong>optionality</strong>. For Gulf states, this means more leverage in trade finance and tokenized deposits. For BRICS, it is a path to diversify payment infrastructure away from legacy Western rails.</p>
             <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                   <thead>
                      <tr className="border-b border-border text-text-muted">
                         <th className="py-2 pr-4 font-medium uppercase text-[10px]">Entity</th>
                         <th className="py-2 px-4 font-medium uppercase text-[10px]">Strategic Goal</th>
                         <th className="py-2 pl-4 font-medium uppercase text-[10px]">Key Instrument</th>
                      </tr>
                   </thead>
                   <tbody>
                      <tr className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                         <td className="py-3 pr-4 font-bold italic">UAE / VARA</td>
                         <td className="py-3 px-4">Global Liquidity Hub</td>
                         <td className="py-3 pl-4">VASP Licensing Framework</td>
                      </tr>
                      <tr className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                         <td className="py-3 pr-4 font-bold italic">Saudi Arabia</td>
                         <td className="py-3 px-4">Digital Sovereignty</td>
                         <td className="py-3 pl-4">Bilateral Trade Tokenization</td>
                      </tr>
                      <tr className="hover:bg-primary/5 transition-colors">
                         <td className="py-3 pr-4 font-bold italic">BRICS Bloc</td>
                         <td className="py-3 px-4">SWIFT Independence</td>
                         <td className="py-3 pl-4">mBridge / Multi-CBDC Layer</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </>
        ),
      },
      {
        icon: <Shield size={18} />,
        title: 'Investor Verdict: Parallel Settlement Stacks',
        content: (
          <div className="p-5 bg-surface border border-border rounded-xl">
             <h4 className="font-bold text-amber-400 mb-2 uppercase text-[10px] tracking-widest text-center border-b border-border/50 pb-2">Institutional Conclusion</h4>
             <p className="text-sm mt-3 leading-relaxed">
                The macro story is less "replacement of SWIFT" and more the emergence of a <strong>parallel settlement stack</strong>. Beneficiaries include compliant custodians, cross-border payment firms, and infrastructure providers that can operate across both sovereign and multilateral rails.
             </p>
          </div>
        ),
      },
    ],
  },
  {
    id: 'pakistan-russia-macro-2026',
    title: "Pakistan's IMF Paradox & Russia Sanctions Evasion",
    subtitle: 'Analyzing the collision of IMF conditionality and sanctions pressure on national digital asset infrastructure.',
    tab: 'geopolitical',
    date: 'April 14, 2026',
    readTime: '14 min read',
    confidenceLevel: 'Medium',
    keyMetrics: [
      { label: 'Russia A7A5 Vol.', value: '$93.3B', direction: 'up' },
      { label: 'Pakistan P2P Est.', value: '$2.5B', direction: 'up' },
      { label: 'Sanctions Risk', value: 'Critical', direction: 'up' },
    ],
    keyInsights: [
      "Pakistan processes over $2 billion in unregulated crypto P2P remittances annually despite policy bottlenecks.",
      "IMF conditionality prevents formal Bitcoin adoption in Pakistan due to AML/CFT safeguarding requirements.",
      "Russia's A7A5 stablecoin network processed over $93 billion in 2025 to bypass Western trade sanctions.",
      "The industrialization of crypto as a settlement layer is a direct response to macroeconomic isolation."
    ],
    sections: [
      {
        icon: <Globe size={18} />,
        title: "The Informal Loop: Pakistan's Remittance P2P",
        content: (
          <>
            <p className="mb-4">Pakistan remains a global top-10 remittance nation, with approximately <strong>$2.1–$2.5 billion</strong> flowing through unregulated crypto P2P channels annually. This grassroots adoption is driven by dollarization pressures and limited access to formal banking rails.</p>
            <p className="mb-4">Informal ecosystems like Binance P2P serve as a lifeline for millions, despite the lack of a top-down national strategy. The demand is purely functional: capital preservation and efficient cross-border movement.</p>
          </>
        ),
      },
      {
        icon: <Lock size={18} />,
        title: 'The Policy Bottleneck: IMF Conditionality',
        content: (
          <>
            <p className="mb-4">The "Paradox" lies in the <strong>IMF conditionality</strong>. As part of its funding program, Pakistan is required to maintain strict AML/CFT safeguards and fiscal discipline. This often targets crypto-forward state plans, viewing them as potential leaks in the formal financial perimeter.</p>
            <div className="p-4 bg-surface border border-border rounded-xl mb-4">
               <p className="text-sm italic text-text-muted">"Pakistan is institutionally dependent on external financing. Unlike El Salvador, the cost of formal Bitcoin adoption includes the risk of losing IMF program credibility—a price the state currently cannot afford."</p>
            </div>
          </>
        ),
      },
      {
        icon: <Shield size={18} />,
        title: "Russia A7A5: Industrialized Sanctions Evasion",
        content: (
          <>
             <p className="mb-4">Russia has matured its infrastructure from ad-hoc usage into an industrial-scale settlement network. The <strong>A7A5 stablecoin network</strong> processed over $93.3 billion in 2025 alone, serving as a primary rail for bypassing Western sanctions.</p>
             <p className="mb-4">By pegging digital assets to the ruble and connecting them to offshore USDT liquidity pools, sanctioned entities have created an operational trade-finance workaround that effectively bypasses SWIFT.</p>
          </>
        ),
      },
      {
        icon: <Database size={18} />,
        title: 'The Infrastructure of Bypass: Stablecoin Rails',
        content: (
          <>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-background border border-border rounded-xl">
                   <h4 className="text-sm font-bold text-red-400 mb-1">A7A5 Throughput</h4>
                   <p className="text-xs text-text-muted">Demonstrates the industrialization of crypto as a settlement layer, bridging domestic rubles to global USDT liquidity.</p>
                </div>
                <div className="p-4 bg-background border border-border rounded-xl">
                   <h4 className="text-sm font-bold text-primary mb-1">Sanctions Resistance</h4>
                   <p className="text-xs text-text-muted">The architecture connects local-currency rails to DLT with high-velocity clearing, making it harder to freeze compared to bank-led transfers.</p>
                </div>
             </div>
          </>
        ),
      },
      {
        icon: <BarChart3 size={18} />,
        title: 'Side-by-Side: Drivers and Obstacles',
        content: (
          <div className="overflow-x-auto">
             <table className="w-full text-xs text-left border-collapse">
                <thead>
                   <tr className="border-b border-border text-text-muted">
                      <th className="py-2 pr-4 font-medium uppercase text-[10px]">Theme</th>
                      <th className="py-2 px-4 font-medium uppercase text-[10px]">Pakistan</th>
                      <th className="py-2 pl-4 font-medium uppercase text-[10px]">Russia</th>
                   </tr>
                </thead>
                <tbody>
                   <tr className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                      <td className="py-3 pr-4 font-bold italic">Main Driver</td>
                      <td className="py-3 px-4">Remittances (Bottom-up)</td>
                      <td className="py-3 pl-4">Sanctions Bypass (Top-down)</td>
                   </tr>
                   <tr className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                      <td className="py-3 pr-4 font-bold italic">Constraint</td>
                      <td className="py-3 px-4 text-red-400">IMF Conditionality</td>
                      <td className="py-3 pl-4 text-amber-400">Compliance Enforcement</td>
                   </tr>
                   <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 pr-4 font-bold italic">Primary Form</td>
                      <td className="py-3 px-4">P2P Exchange Workarounds</td>
                      <td className="py-3 pl-4 font-bold">Stablecoin Networks (A7A5)</td>
                   </tr>
                </tbody>
             </table>
          </div>
        ),
      },
      {
        icon: <AlertTriangle size={18} />,
        title: 'Final Geopolitical Verdict',
        content: (
          <div className="p-5 bg-surface border border-border rounded-xl">
             <p className="text-sm leading-relaxed">
                Crypto adoption in 2026 is bifurcating. Pakistan illustrates how <strong>debt dependence</strong> suppresses formal adoption even when demand is critical, while Russia shows how <strong>sanctions pressure</strong> forces the industrialization of digital rails. Both regimes highlight the growing role of decentralized finance as a "gray market" lifeline during macro-economic isolation.
             </p>
          </div>
        ),
      },
    ],
  },
  {
    id: 'nasdaq-btc-decoupling-2026',
    title: 'Nasdaq-BTC Decoupling & Oil Transmission',
    subtitle: 'Analyzing the episodic breakdown of the BTC-Nasdaq correlation and the indirect impact of <LivePrice symbol="OIL" fallback="$90" />+ oil on hashrate.',
    tab: 'cross-market',
    date: 'April 14, 2026',
    readTime: '11 min read',
    confidenceLevel: 'Medium',
    keyMetrics: [
      { label: 'BTC/Nasdaq Corr.', value: '0.13', direction: 'down' },
      { label: 'Oil (WTI)', value: '$92.50', direction: 'up', symbol: 'OIL' },
      { label: 'Oil-Linked Hash', value: '9%', direction: 'neutral' },
      { label: 'Real Yields', value: '+1.4%', direction: 'up' },
    ],
    keyInsights: [
      "BTC-Nasdaq correlation dropped from 1.0 to 0.13 during 2026 regional stress events.",
      "Bitcoin acts as a conditional hedge during geopolitical shocks, decoupling from tech.",
      "Oil price sensitivity in mining remains low, with only 9% of hashrate linked to oil grids.",
      "Real yields and ETF flows remain the primary structural drivers for long-term BTC trend."
    ],
    sections: [
      {
        icon: <TrendingUp size={18} />,
        title: 'The Correlation Collapse: Nasdaq vs. BTC',
        content: (
          <>
            <p className="mb-4">Since the onset of regional conflict in February 2026, Bitcoin\'s correlation with the <strong>Nasdaq</strong> and the IGV software index has fallen sharply. Early estimates showed a drop from 1.0 toward 0.13, suggesting that BTC is increasingly being treated as a macro hedge rather than just "leveraged tech."</p>
            <p className="mb-4 text-sm text-text-muted">However, this decoupling is highly regime-dependent. While it spikes during geopolitical stress, the relationship often reverts when liquidity conditions or real yields become the dominant market driver.</p>
          </>
        ),
      },
      {
        icon: <Zap size={18} />,
        title: 'Geopolitical Shocks: BTC as a Conditional Hedge',
        content: (
          <>
            <p className="mb-4">Bitcoin acts as a <strong>conditional hedge</strong>. It can decouple from traditional tech during crisis events, but the break is rarely structural. The strongest driver for BTC in 2026 remains changing macro dominance: Fed expectations, institutional ETF flows, and the 10Y real yield path.</p>
            <div className="p-4 bg-surface border border-border rounded-xl mb-4">
               <p className="text-sm italic text-text-muted">"The signal is real but episodic. Do not misinterpret a short-term geopolitical decoupling for a permanent divorce from tech liquidity."</p>
            </div>
          </>
        ),
      },
      {
        icon: <Database size={18} />,
        title: 'Oil Transmission: The Mining Hashrate Myth',
        content: (
          <>
             <p className="mb-4">Direct transmission from <strong>$90+ oil prices</strong> into the Bitcoin hash rate is surprisingly weak. Industry estimates confirm that only 8–10% of global hashing capacity sits in oil-sensitive grids (primarily in the Gulf).</p>
             <p className="mb-4">The majority of the network (~90%) is insulated by diverse power sources including hydro, coal, nuclear, and renewables, making the total network hash rate highly resilient to crude price shocks.</p>
          </>
        ),
      },
      {
        icon: <BarChart3 size={18} />,
        title: 'Revenue-Side Risk: The True Mining Driver',
        content: (
          <>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-background border border-border rounded-xl">
                   <h4 className="text-sm font-bold text-red-400 mb-1">Indirect Impact</h4>
                   <p className="text-xs text-text-muted">Higher oil reinforces inflation fears, delays rate cuts, and pressures BTC price. This hits miners through <strong>revenue compression</strong>, not power bills.</p>
                </div>
                <div className="p-4 bg-background border border-border rounded-xl">
                   <h4 className="text-sm font-bold text-primary mb-1">Hashprice Pressure</h4>
                   <p className="text-xs text-text-muted">The core risk to miners during an oil shock is a macro-driven BTC drawdown that pushes hashprice below breakeven levels across all grids.</p>
                </div>
             </div>
          </>
        ),
      },
      {
        icon: <Globe size={18} />,
        title: 'Gulf Exposure & Network Resilience',
        content: (
          <>
             <p className="mb-4">While Gulf states like the UAE and Qatar are growing their mining footprint, they still represent a single-digit share of total global hashrate. An energy shock in the Middle East is unlikely to reprice the entire network through mining costs alone.</p>
             <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                   <thead>
                      <tr className="border-b border-border text-text-muted">
                         <th className="py-2 pr-4 font-medium uppercase text-[10px]">Power Source</th>
                         <th className="py-2 px-4 font-medium uppercase text-[10px]">Estimated Share</th>
                         <th className="py-2 pl-4 font-medium uppercase text-[10px]">Oil Sensitivity</th>
                      </tr>
                   </thead>
                   <tbody>
                      <tr className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                         <td className="py-3 pr-4 font-bold italic">Hydro/Nuclear/Renewables</td>
                         <td className="py-3 px-4">~55%</td>
                         <td className="py-3 pl-4 text-emerald-400">Zero</td>
                      </tr>
                      <tr className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                         <td className="py-3 pr-4 font-bold italic">Coal/Natural Gas</td>
                         <td className="py-3 px-4">~35%</td>
                         <td className="py-3 pl-4 text-amber-400">Low/Mid</td>
                      </tr>
                      <tr className="hover:bg-primary/5 transition-colors">
                         <td className="py-3 pr-4 font-bold italic">Oil / Crude Gas</td>
                         <td className="py-3 px-4">~10%</td>
                         <td className="py-3 pl-4 text-red-400">High</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </>
        ),
      },
      {
        icon: <Shield size={18} />,
        title: 'Investment Verdict: The Decoupling Signal',
        content: (
          <div className="p-5 bg-surface border border-border rounded-xl">
             <p className="text-sm leading-relaxed mb-4">
                The most robust leading indicators for both BTC and miners are <strong>real yields</strong>, Fed path expectations, and ETF flows. Geopolitical conflict can trigger short-run decoupling, but the decoupling is unstable.
             </p>
             <p className="text-xs font-bold text-primary border-t border-border/50 pt-3">
                Key View: BTC is a conditional hedge. Use it for geopolitical diversification, but monitor real yields for the structural trend.
             </p>
          </div>
        ),
      },
    ],
    faq: [
      { question: "Why is USDT usage high in Lebanon?", answer: "Following the 98% devaluation of the Lebanese pound, Tether (USDT) has become a functional substitute for daily commerce, payroll, and wealth preservation." },
      { question: "What is the USDT P2P premium in Turkey?", answer: "During periods of currency volatility, USDT often trades at a 4.2%+ premium on P2P markets in Turkey as citizens hedge against lira devaluation." }
    ],
  },
];


// ─── COMPONENTS ───────────────────────────────────────────────────────────────



const LiveMacroBar: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchMacroIndicators();
      if (result && Array.isArray(result)) {
        setData(result);
      }
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-[900px] mx-auto mt-8 lg:mt-12">
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div key={i} className="w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] min-w-[160px] h-16 bg-surface animate-pulse rounded-xl border border-border" />
      ))}
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-[900px] mx-auto mt-8 lg:mt-12">
      {data.slice(0, 7).map((item) => (
        <div key={item.symbol} className="flex flex-col items-center justify-center w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] min-w-[160px] px-4 py-3 bg-background/60 backdrop-blur-md rounded-xl border border-border whitespace-nowrap hover:border-primary/50 transition-colors shadow-lg">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1 text-center">
            {item.name?.replace('Index', '').trim() || item.symbol}
          </span>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-sm font-mono font-bold text-text">
              {item.isCurrency ? `$${(item.price / 1e9).toFixed(1)}B` : item.price?.toLocaleString(undefined, { minimumFractionDigits: item.price < 100 ? 2 : 0, maximumFractionDigits: 2 })}
            </span>
            {item.changesPercentage !== 0 && (
              <span className={`flex items-center text-[10px] font-bold ${item.changesPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.changesPercentage >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(item.changesPercentage).toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
const ReportCard: React.FC<{ report: MacroReport; onClick: () => void }> = ({ report, onClick }) => (
  <Card className="flex flex-col group hover:border-primary/40 cursor-pointer h-full transition duration-300 transform-gpu" onClick={onClick}>
    <div className="flex justify-between items-start mb-4">
      <span className="px-3 py-1 bg-surface border border-border text-xs rounded-full font-bold text-text-muted uppercase tracking-widest">
        {TABS.find(t => t.id === report.tab)?.label}
      </span>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase
        ${report.confidenceLevel === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
        ${report.confidenceLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
        ${report.confidenceLevel === 'Low' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
      `}>
        {report.confidenceLevel} Confidence
      </div>
    </div>

    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
      {report.title}
    </h3>

    <p className="text-text-muted text-sm mb-6 flex-grow line-clamp-3">
      {report.subtitle}
    </p>

    {/* Key Metrics */}
    <div className="grid grid-cols-2 gap-3 mb-6">
      {report.keyMetrics.map(m => (
        <div key={m.label} className="text-center p-2 bg-surface rounded-lg border border-border">
          <p className="text-[9px] text-text-muted uppercase font-bold tracking-wider">{m.label}</p>
          <p className={`text-sm font-bold font-mono mt-0.5 ${
            m.value === 'Critical' ? 'text-red-400' :
            m.direction === 'up' ? 'text-emerald-400' : 
            m.direction === 'down' ? 'text-red-400' : 
            'text-text'
          }`}>
            {m.symbol ? <LivePrice symbol={m.symbol} fallback={m.value || ''} format={m.format} /> : m.value}
          </p>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto w-full text-xs font-medium text-text-muted">
      <div className="flex items-center gap-2">
        <Clock size={14} /> {report.readTime}
      </div>
      <span>{report.date}</span>
    </div>
  </Card>
);


// ─── MAIN PAGE ────────────────────────────────────────────────────────────────


export interface MacroIntelProps {
  onNavigate?: (route: PageRoute) => void;
}

export const MacroIntel: React.FC<MacroIntelProps> = ({ onNavigate }) => {

  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MacroTab>('all');

  const { setActiveSubMenu, setPageCategories, activeSubMenu } = useAppContext();
  const activeReport = REPORTS.find(r => r.id === activeReportId);
  const filteredReports = REPORTS ? REPORTS.filter(r => activeTab === 'all' ? true : r.tab === activeTab).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

  // Handle URL Path for deep linking
  useEffect(() => {
    const handleLocationChange = () => {
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 2 && pathParts[1] === 'macro-intel') {
        const articleId = pathParts[2];
        const validReport = REPORTS.find(r => r.id === articleId);
        if (validReport) {
          setActiveReportId(articleId);
        } else {
          setActiveReportId(null);
        }
      } else {
        setActiveReportId(null);
      }
    };
    
    // Initial check
    handleLocationChange();
    
    // Listen for changes
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleReportClick = (id: string) => {
    setActiveReportId(id);
    window.history.pushState({}, '', `/macro-intel/${id}`);
    trackEvent('article_read', { article_id: id, article_category: 'Macro Intel' });
  };

  const handleBackToList = () => {
    setActiveReportId(null);
    window.history.pushState({}, '', '/macro-intel');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Register categories with universal menu
    const categories = TABS.map(tab => ({
      id: tab.id,
      label: tab.label,
      icon: tab.icon,
      active: activeTab === tab.id,
      onClick: () => {
        setActiveTab(tab.id as MacroTab);
        setActiveReportId(null); // Return to list view
      }
    }));
    setPageCategories(categories);
    
    // Automatically show the relevant menu if not already open
    if (activeSubMenu !== 'Macro Intel') {
       setActiveSubMenu('Macro Intel');
    }

    return () => {
      setPageCategories([]);
    };
  }, [activeTab, setPageCategories, setActiveSubMenu, activeSubMenu, activeReportId]);

  // ── REPORT READER VIEW ──
  if (activeReport) {
    return (
      <div className="animate-fade-in max-w-[800px] mx-auto pb-16">
      <PageMeta 
        title={`${activeReport.title} | Coinvestopedia Macro`}
        description={activeReport.subtitle}
        structuredData={[
          articleSchema({
            title: activeReport.title,
            description: activeReport.subtitle,
            authorName: "Coinvestopedia Research",
            datePublished: new Date(activeReport.date).toISOString(),
            url: `https://coinvestopedia.com/macro-intel#${activeReport.id}`
          }),
          faqSchema(activeReport.faq?.map(f => ({
            q: f.question,
            a: f.answer
          })) || [])
        ]}
      />



        {/* Back Button for Mobile */}
        <button 
          onClick={handleBackToList}
          className="flex items-center gap-2 text-primary font-bold text-sm mb-8 group lg:hidden min-h-[44px] min-w-[44px]"
          aria-label="Back to Intel List"
        >
          <Zap size={16} className="rotate-180" />
          <span>Back to Intel List</span>
        </button>

        {/* Report Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
            <span className="text-primary">{TABS.find(t => t.id === activeReport.tab)?.label}</span>
            <span>•</span>
            <span>{activeReport.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {activeReport.readTime}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4 leading-tight">{activeReport.title}</h1>
          <p className="text-lg text-text-muted leading-relaxed">{activeReport.subtitle}</p>
        </div>

        {/* Key Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 p-4 bg-surface rounded-xl border border-border">
          {activeReport.keyMetrics.map(m => (
            <div key={m.label} className="text-center group">
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1 group-hover:text-primary transition-colors">{m.label}</p>
              <p className={`text-lg font-bold font-mono ${
                m.value === 'Critical' ? 'text-red-400' :
                m.direction === 'up' ? 'text-emerald-400' : 
                m.direction === 'down' ? 'text-red-400' : 
                'text-text'
              }`}>
                {m.symbol ? <LivePrice symbol={m.symbol} fallback={m.value || ''} format={m.format} /> : m.value}
              </p>
            </div>
          ))}
        </div>

        {/* GEO Optimization: Key Insights Box */}
        <KeyInsights insights={activeReport.keyInsights} />

        {/* Report Sections */}
        <div className="space-y-10">
          {activeReport.sections.map((section, idx) => (
            <section key={idx} className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold">{section.title}</h2>
              </div>
              <div className="text-text leading-relaxed pl-12">
                {section.content}
              </div>
              {idx < activeReport.sections.length - 1 && (
                <div className="border-b border-border mt-10" />
              )}

            </section>
          ))}
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div className="animate-fade-in">
      <PageMeta title="Macro Intelligence | Coinvestopedia" description="Professional-grade analysis of global market trends, geopolitical shifts, and institutional capital flows." />
      


      <div className="space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-border bg-gradient-to-br from-background to-surface p-8 lg:p-16 text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-6">
            <Globe size={16} />
            <span>Pro-Level Macro Analysis</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            Macro <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Intelligence</span>
          </h1>
          
          <p className="text-xl text-text-muted mb-6 max-w-2xl mx-auto leading-relaxed">
            Professional-grade analysis of global market trends, geopolitical shifts, and institutional capital flows across traditional and digital assets.
          </p>
        </div>
      </section>





      {/* On-Page Navigation for Mobile */}
      <MobilePageCategories />

      {/* Reports Grid */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => handleReportClick(report.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Globe size={48} className="mx-auto text-text-muted/30 mb-4" />
          <h3 className="text-lg font-bold text-text-muted mb-2">No reports in this category yet</h3>
          <p className="text-sm text-text-muted/70">Check back soon. New intelligence is published weekly.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default MacroIntel;
