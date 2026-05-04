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
