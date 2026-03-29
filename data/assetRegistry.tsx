import React from 'react';
import { Layers, Cuboid, TrendingUp, BarChart3, Fingerprint, Image, Database, Zap, Activity } from 'lucide-react';

export type AssetCategory = 'L1' | 'L2' | 'DeFi' | 'AI' | 'RWA' | 'Equity' | 'Commodity' | 'Macro' | 'NFT';

export type AnalystSignal = 'BUY' | 'NEUTRAL' | 'WATCH' | 'UNDERWEIGHT';

export interface AssetData {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  color: string;
  iconUrl: string;
  price: number;
  marketCap: number; // in billions
  fdv: number; // in billions
  vol24h: number; // in billions
  change24h: number;
  change7d: number;
  change30d: number;
  changeYtd: number;
  change1y: number;
  ath: number;
  athDrawdown: number;
  volatility30d: number; // Annualized %
  volatility90d: number; // Annualized %
  sharpe90d: number;
  cagr3y: number; // 3-year CAGR %
  maxDrawdown: number; // max drawdown %
  var95: number; // Value at Risk 95% (daily, %)
  betaBtc: number;
  betaSpy: number;
  correlationBtc: number;
  liquidityScore: number; // 0-100
  socialScore: number; // 0-100
  devActivity: number; // commits/month (crypto only)
  inflationRate: number; // %
  analystSignal: AnalystSignal;
  analystThesis: string;
}

// Helper to return Lucide icon for category
export const getCategoryIcon = (category: AssetCategory): React.ReactNode => {
  switch (category) {
    case 'L1': return <Layers size={14} />;
    case 'L2': return <Cuboid size={14} />;
    case 'DeFi': return <Activity size={14} />;
    case 'AI': return <Zap size={14} />;
    case 'RWA': return <Fingerprint size={14} />;
    case 'Equity': return <TrendingUp size={14} />;
    case 'Commodity': return <Database size={14} />;
    case 'Macro': return <BarChart3 size={14} />;
    case 'NFT': return <Image size={14} />;
    default: return <Database size={14} />;
  }
};

// ─── FULL ASSET REGISTRY — Q1 2026 DATA ───────────────────────────────────────

export const ASSET_REGISTRY: Record<string, AssetData> = {

  // ══════════ LAYER 1 ══════════

  BTC: {
    id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', category: 'L1', color: '#F7931A',
    iconUrl: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    price: 84200, marketCap: 1670, fdv: 1770, vol24h: 38.5,
    change24h: 0.8, change7d: 2.1, change30d: -3.4, changeYtd: 0.3, change1y: 32.5,
    ath: 109000, athDrawdown: -22.7, volatility30d: 52.8, volatility90d: 48.5, sharpe90d: 0.12,
    cagr3y: 28.4, maxDrawdown: -77.0, var95: -4.8,
    betaBtc: 1.0, betaSpy: 1.4, correlationBtc: 1.0,
    liquidityScore: 98, socialScore: 88, devActivity: 450, inflationRate: 1.7,
    analystSignal: 'NEUTRAL',
    analystThesis: 'BTC flat YTD (+0.3%), trading as a risk asset with 0.68 Nasdaq correlation. Post-halving supply reduction constructive for H2 2026, but macro headwinds (tariffs, strong dollar) keep near-term range-bound. Watch ETF flow direction for trend signal.'
  },
  ETH: {
    id: 'ethereum', symbol: 'ETH', name: 'Ethereum', category: 'L1', color: '#627EEA',
    iconUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    price: 1880, marketCap: 226, fdv: 226, vol24h: 12.4,
    change24h: -1.2, change7d: -3.5, change30d: -18.2, changeYtd: -38.0, change1y: -42.8,
    ath: 4891, athDrawdown: -61.5, volatility30d: 68.4, volatility90d: 62.1, sharpe90d: -0.14,
    cagr3y: -8.2, maxDrawdown: -82.0, var95: -6.2,
    betaBtc: 1.15, betaSpy: 1.6, correlationBtc: 0.85,
    liquidityScore: 95, socialScore: 72, devActivity: 850, inflationRate: -0.2,
    analystSignal: 'UNDERWEIGHT',
    analystThesis: 'Worst major asset at −38% YTD. Negative Sharpe (−0.14) signals poor risk-adjusted returns. L2 cannibalization of fee revenue + declining NFT activity. Structural thesis intact long-term but near-term underperformance likely continues vs BTC.'
  },
  SOL: {
    id: 'solana', symbol: 'SOL', name: 'Solana', category: 'L1', color: '#14F195',
    iconUrl: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    price: 128.5, marketCap: 62, fdv: 78, vol24h: 3.8,
    change24h: 2.1, change7d: -1.8, change30d: -12.5, changeYtd: -15.2, change1y: 85.4,
    ath: 295, athDrawdown: -56.4, volatility30d: 82.5, volatility90d: 75.2, sharpe90d: 0.42,
    cagr3y: 145.0, maxDrawdown: -96.0, var95: -7.5,
    betaBtc: 1.4, betaSpy: 1.9, correlationBtc: 0.72,
    liquidityScore: 88, socialScore: 91, devActivity: 620, inflationRate: 5.4,
    analystSignal: 'WATCH',
    analystThesis: 'Down 15% YTD but outperforming ETH. Memecoin volume cools but DePIN and DeFi TVL growing. High beta play on crypto recovery. Wait for macro clarity before adding.'
  },
  BNB: {
    id: 'binancecoin', symbol: 'BNB', name: 'BNB', category: 'L1', color: '#F3BA2F',
    iconUrl: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    price: 598, marketCap: 88, fdv: 88, vol24h: 1.8,
    change24h: 0.5, change7d: 1.2, change30d: -4.8, changeYtd: -5.1, change1y: 18.5,
    ath: 793, athDrawdown: -24.5, volatility30d: 38.5, volatility90d: 35.2, sharpe90d: 0.28,
    cagr3y: 12.4, maxDrawdown: -69.0, var95: -3.8,
    betaBtc: 0.85, betaSpy: 1.2, correlationBtc: 0.78,
    liquidityScore: 92, socialScore: 70, devActivity: 280, inflationRate: 0,
    analystSignal: 'NEUTRAL',
    analystThesis: 'Defensive large-cap crypto with strong exchange utility. Lower volatility than peers. Binance ecosystem provides structural demand floor. Regulatory overhang largely priced in post-settlement.'
  },
  ADA: {
    id: 'cardano', symbol: 'ADA', name: 'Cardano', category: 'L1', color: '#0033AD',
    iconUrl: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    price: 0.62, marketCap: 22, fdv: 28, vol24h: 0.6,
    change24h: -0.8, change7d: -4.2, change30d: -22.5, changeYtd: -28.4, change1y: -15.2,
    ath: 3.09, athDrawdown: -79.9, volatility30d: 72.5, volatility90d: 65.8, sharpe90d: -0.22,
    cagr3y: -18.5, maxDrawdown: -89.0, var95: -6.8,
    betaBtc: 1.1, betaSpy: 1.5, correlationBtc: 0.68,
    liquidityScore: 82, socialScore: 65, devActivity: 380, inflationRate: 3.2,
    analystSignal: 'UNDERWEIGHT',
    analystThesis: 'Down 28% YTD with negative 3Y CAGR. Ecosystem growth has stalled relative to Solana and Ethereum L2s. Governance improvements ongoing but not yet reflected in on-chain metrics.'
  },
  AVAX: {
    id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', category: 'L1', color: '#E84142',
    iconUrl: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
    price: 18.5, marketCap: 7.5, fdv: 13.2, vol24h: 0.4,
    change24h: 1.5, change7d: -2.8, change30d: -19.8, changeYtd: -32.1, change1y: -48.5,
    ath: 146, athDrawdown: -87.3, volatility30d: 85.2, volatility90d: 78.5, sharpe90d: -0.18,
    cagr3y: -22.0, maxDrawdown: -93.0, var95: -7.8,
    betaBtc: 1.3, betaSpy: 1.8, correlationBtc: 0.70,
    liquidityScore: 78, socialScore: 62, devActivity: 340, inflationRate: 8.2,
    analystSignal: 'UNDERWEIGHT',
    analystThesis: 'Subnet thesis hasn\'t materialized at scale. High inflation rate diluting holders. Institutional RWA tokenization on subnets is interesting but early. Avoid until trend reversal confirmed.'
  },
  DOT: {
    id: 'polkadot', symbol: 'DOT', name: 'Polkadot', category: 'L1', color: '#E6007A',
    iconUrl: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
    price: 4.15, marketCap: 6.2, fdv: 6.2, vol24h: 0.2,
    change24h: -0.5, change7d: -5.8, change30d: -24.5, changeYtd: -35.2, change1y: -52.0,
    ath: 55, athDrawdown: -92.4, volatility30d: 78.5, volatility90d: 72.0, sharpe90d: -0.25,
    cagr3y: -32.0, maxDrawdown: -93.0, var95: -7.2,
    betaBtc: 1.2, betaSpy: 1.7, correlationBtc: 0.65,
    liquidityScore: 75, socialScore: 58, devActivity: 520, inflationRate: 7.5,
    analystSignal: 'UNDERWEIGHT',
    analystThesis: 'Parachain model losing mindshare to modular blockchain stacks. Strong dev activity but not translating to ecosystem growth. JAM upgrade is the last major catalyst — watch for Q3 2026 delivery.'
  },

  // ══════════ LAYER 2 ══════════

  ARB: {
    id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', category: 'L2', color: '#28A0F0',
    iconUrl: 'https://assets.coingecko.com/coins/images/16547/small/arbitrum.png',
    price: 0.35, marketCap: 1.4, fdv: 3.5, vol24h: 0.3,
    change24h: -1.8, change7d: -6.2, change30d: -28.5, changeYtd: -42.5, change1y: -68.2,
    ath: 2.4, athDrawdown: -85.4, volatility30d: 92.0, volatility90d: 85.0, sharpe90d: -0.35,
    cagr3y: 0, maxDrawdown: -88.0, var95: -8.5,
    betaBtc: 1.5, betaSpy: 2.1, correlationBtc: 0.65,
    liquidityScore: 80, socialScore: 68, devActivity: 410, inflationRate: 8.5,
    analystSignal: 'WATCH',
    analystThesis: 'Significant token unlock pressure through 2026. However, Arbitrum leads L2 TVL and sequencer revenue. Buy on capitulation if token unlock selling exhausts.'
  },
  MATIC: {
    id: 'matic-network', symbol: 'POL', name: 'Polygon', category: 'L2', color: '#8247E5',
    iconUrl: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png',
    price: 0.22, marketCap: 2.2, fdv: 2.2, vol24h: 0.2,
    change24h: -0.5, change7d: -8.5, change30d: -32.0, changeYtd: -45.8, change1y: -72.5,
    ath: 2.92, athDrawdown: -92.4, volatility30d: 88.0, volatility90d: 82.5, sharpe90d: -0.42,
    cagr3y: -35.0, maxDrawdown: -93.0, var95: -8.2,
    betaBtc: 1.3, betaSpy: 1.8, correlationBtc: 0.62,
    liquidityScore: 78, socialScore: 60, devActivity: 380, inflationRate: 2.0,
    analystSignal: 'UNDERWEIGHT',
    analystThesis: 'POL token migration hasn\'t improved sentiment. zkEVM adoption slower than expected. Enterprise partnerships (Starbucks, Nike) provide mindshare but limited token value accrual.'
  },
  OP: {
    id: 'optimism', symbol: 'OP', name: 'Optimism', category: 'L2', color: '#FF0420',
    iconUrl: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
    price: 0.85, marketCap: 1.1, fdv: 3.6, vol24h: 0.15,
    change24h: 0.2, change7d: -4.5, change30d: -22.8, changeYtd: -38.5, change1y: -62.0,
    ath: 4.85, athDrawdown: -82.4, volatility30d: 90.0, volatility90d: 84.0, sharpe90d: -0.32,
    cagr3y: 0, maxDrawdown: -86.0, var95: -8.0,
    betaBtc: 1.4, betaSpy: 2.0, correlationBtc: 0.68,
    liquidityScore: 76, socialScore: 72, devActivity: 520, inflationRate: 10.0,
    analystSignal: 'WATCH',
    analystThesis: 'Superchain thesis is compelling — Base (Coinbase L2) driving ecosystem growth. High inflation from token unlocks is the key risk. Governance fund generating real protocol revenue.'
  },

  // ══════════ DeFi ══════════

  UNI: {
    id: 'uniswap', symbol: 'UNI', name: 'Uniswap', category: 'DeFi', color: '#FF007A',
    iconUrl: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
    price: 6.20, marketCap: 3.7, fdv: 6.2, vol24h: 0.25,
    change24h: 0.8, change7d: -2.5, change30d: -18.5, changeYtd: -25.2, change1y: -35.0,
    ath: 44.97, athDrawdown: -86.2, volatility30d: 78.5, volatility90d: 72.0, sharpe90d: -0.08,
    cagr3y: -12.0, maxDrawdown: -90.0, var95: -7.0,
    betaBtc: 1.3, betaSpy: 1.8, correlationBtc: 0.68,
    liquidityScore: 85, socialScore: 68, devActivity: 320, inflationRate: 2.0,
    analystSignal: 'WATCH',
    analystThesis: 'Fee switch activation remains the key catalyst. Uniswap v4 hooks expanding protocol utility. Front-end fee revenue growing but not yet accruing to UNI token holders.'
  },
  LINK: {
    id: 'chainlink', symbol: 'LINK', name: 'Chainlink', category: 'DeFi', color: '#2A5ADA',
    iconUrl: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
    price: 13.20, marketCap: 8.4, fdv: 13.2, vol24h: 0.5,
    change24h: 1.2, change7d: 3.5, change30d: -8.2, changeYtd: -12.5, change1y: 15.8,
    ath: 52.88, athDrawdown: -75.0, volatility30d: 62.5, volatility90d: 58.0, sharpe90d: 0.18,
    cagr3y: 5.2, maxDrawdown: -88.0, var95: -5.8,
    betaBtc: 1.1, betaSpy: 1.5, correlationBtc: 0.72,
    liquidityScore: 88, socialScore: 75, devActivity: 450, inflationRate: 4.5,
    analystSignal: 'BUY',
    analystThesis: 'CCIP (cross-chain protocol) adoption accelerating with SWIFT partnership. RWA tokenization thesis makes LINK infrastructure-critical. Best-positioned DeFi token for institutional adoption. Staking revenue growing.'
  },
  AAVE: {
    id: 'aave', symbol: 'AAVE', name: 'Aave', category: 'DeFi', color: '#B6509E',
    iconUrl: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
    price: 165, marketCap: 2.5, fdv: 2.6, vol24h: 0.18,
    change24h: 0.5, change7d: -1.8, change30d: -15.2, changeYtd: -18.5, change1y: 52.0,
    ath: 666, athDrawdown: -75.2, volatility30d: 72.0, volatility90d: 65.5, sharpe90d: 0.25,
    cagr3y: 8.5, maxDrawdown: -92.0, var95: -6.5,
    betaBtc: 1.2, betaSpy: 1.6, correlationBtc: 0.70,
    liquidityScore: 85, socialScore: 72, devActivity: 280, inflationRate: 0,
    analystSignal: 'BUY',
    analystThesis: 'Dominant lending protocol with $12B+ TVL across 8 chains. GHO stablecoin generating protocol revenue. Fee switch activated — real yield accruing to AAVE stakers. Best DeFi blue-chip.'
  },

  // ══════════ AI & DATA ══════════

  FET: {
    id: 'fetch-ai', symbol: 'FET', name: 'Fetch.ai (ASI)', category: 'AI', color: '#2B395B',
    iconUrl: 'https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg',
    price: 0.52, marketCap: 1.3, fdv: 1.4, vol24h: 0.15,
    change24h: 3.2, change7d: 8.5, change30d: -22.5, changeYtd: -68.2, change1y: -72.5,
    ath: 3.47, athDrawdown: -85.0, volatility30d: 105.0, volatility90d: 98.0, sharpe90d: -0.45,
    cagr3y: 42.0, maxDrawdown: -92.0, var95: -9.5,
    betaBtc: 1.8, betaSpy: 2.5, correlationBtc: 0.45,
    liquidityScore: 72, socialScore: 85, devActivity: 210, inflationRate: 4.5,
    analystSignal: 'WATCH',
    analystThesis: 'ASI Alliance merger (FET + AGIX + OCEAN) creates largest decentralized AI network. Extremely high beta — AI narrative exposure. Wait for broader AI sector pullback to add. Speculative.'
  },
  RENDER: {
    id: 'render-token', symbol: 'RENDER', name: 'Render', category: 'AI', color: '#00E3A0',
    iconUrl: 'https://assets.coingecko.com/coins/images/11636/small/rndr.png',
    price: 3.20, marketCap: 1.7, fdv: 1.7, vol24h: 0.12,
    change24h: 2.5, change7d: 5.2, change30d: -18.5, changeYtd: -55.0, change1y: -45.0,
    ath: 13.53, athDrawdown: -76.3, volatility30d: 95.0, volatility90d: 88.0, sharpe90d: -0.35,
    cagr3y: 35.0, maxDrawdown: -90.0, var95: -8.8,
    betaBtc: 1.6, betaSpy: 2.2, correlationBtc: 0.48,
    liquidityScore: 75, socialScore: 82, devActivity: 180, inflationRate: 0,
    analystSignal: 'WATCH',
    analystThesis: 'Decentralized GPU compute for AI/3D rendering. Real utility + Apple/OTOY partnerships. Zero inflation (no new emissions). Compelling long-term but priced for AI narrative premium.'
  },

  // ══════════ RWA ══════════

  ONDO: {
    id: 'ondo-finance', symbol: 'ONDO', name: 'Ondo Finance', category: 'RWA', color: '#0028FF',
    iconUrl: 'https://assets.coingecko.com/coins/images/34484/small/ondo_logo.png',
    price: 0.82, marketCap: 1.1, fdv: 8.2, vol24h: 0.18,
    change24h: 1.5, change7d: -3.2, change30d: -12.5, changeYtd: -22.0, change1y: 0,
    ath: 2.14, athDrawdown: -61.6, volatility30d: 85.0, volatility90d: 78.5, sharpe90d: 0.15,
    cagr3y: 0, maxDrawdown: -65.0, var95: -7.8,
    betaBtc: 1.2, betaSpy: 1.4, correlationBtc: 0.52,
    liquidityScore: 72, socialScore: 85, devActivity: 120, inflationRate: 0,
    analystSignal: 'BUY',
    analystThesis: 'Leading RWA tokenization protocol with $600M+ TVL in tokenized US Treasuries. BlackRock BUIDL fund integration. Key beneficiary of TradFi on-chain trend. High FDV/MCap ratio is the risk.'
  },

  // ══════════ EQUITIES ══════════

  SPY: {
    id: 'SPY', symbol: 'SPY', name: 'S&P 500 ETF', category: 'Equity', color: '#00A859',
    iconUrl: 'https://logo.clearbit.com/ssga.com',
    price: 556.2, marketCap: 53000, fdv: 53000, vol24h: 42.5,
    change24h: -0.8, change7d: -2.5, change30d: -4.2, changeYtd: -6.1, change1y: 8.5,
    ath: 610, athDrawdown: -8.8, volatility30d: 18.5, volatility90d: 16.2, sharpe90d: 0.85,
    cagr3y: 8.2, maxDrawdown: -34.0, var95: -1.8,
    betaBtc: 0.4, betaSpy: 1.0, correlationBtc: 0.42,
    liquidityScore: 100, socialScore: 65, devActivity: 0, inflationRate: 0,
    analystSignal: 'NEUTRAL',
    analystThesis: 'Down 6.1% YTD on tariff concerns and recession fears. Earnings growth still positive but decelerating. Fed cut expectations pushed to H2 2026. Defensive positioning warranted — favor quality over growth.'
  },
  QQQ: {
    id: 'QQQ', symbol: 'QQQ', name: 'Nasdaq 100 ETF', category: 'Equity', color: '#0072C6',
    iconUrl: 'https://logo.clearbit.com/invesco.com',
    price: 458.5, marketCap: 25000, fdv: 25000, vol24h: 35.2,
    change24h: -1.2, change7d: -3.8, change30d: -6.5, changeYtd: -9.3, change1y: 4.2,
    ath: 540, athDrawdown: -15.0, volatility30d: 24.5, volatility90d: 22.0, sharpe90d: 0.62,
    cagr3y: 10.5, maxDrawdown: -35.0, var95: -2.4,
    betaBtc: 0.55, betaSpy: 1.2, correlationBtc: 0.48,
    liquidityScore: 100, socialScore: 72, devActivity: 0, inflationRate: 0,
    analystSignal: 'WATCH',
    analystThesis: 'Nasdaq down 9.3% YTD — hardest hit major index. AI capex cycle facing scrutiny. Magnificent 7 multiple compression ongoing. Potential opportunity but wait for VIX normalization below 25.'
  },
  NVDA: {
    id: 'NVDA', symbol: 'NVDA', name: 'Nvidia Corp', category: 'Equity', color: '#76B900',
    iconUrl: 'https://logo.clearbit.com/nvidia.com',
    price: 108.5, marketCap: 2650, fdv: 2650, vol24h: 55.4,
    change24h: -2.5, change7d: -5.2, change30d: -12.5, changeYtd: -18.2, change1y: 45.8,
    ath: 153, athDrawdown: -29.0, volatility30d: 48.5, volatility90d: 42.0, sharpe90d: 0.95,
    cagr3y: 85.0, maxDrawdown: -66.0, var95: -4.5,
    betaBtc: 0.8, betaSpy: 1.6, correlationBtc: 0.38,
    liquidityScore: 99, socialScore: 95, devActivity: 0, inflationRate: 0,
    analystSignal: 'BUY',
    analystThesis: 'Best-in-class AI infrastructure. Blackwell ramp driving record datacenter revenue. Down 18% YTD on broader tech selloff — secular AI trend intact. Dip buying opportunity for long-term holders.'
  },
  AAPL: {
    id: 'AAPL', symbol: 'AAPL', name: 'Apple Inc', category: 'Equity', color: '#A2AAAD',
    iconUrl: 'https://logo.clearbit.com/apple.com',
    price: 218.5, marketCap: 3350, fdv: 3350, vol24h: 12.5,
    change24h: -0.4, change7d: -1.8, change30d: -5.5, changeYtd: -8.2, change1y: 12.5,
    ath: 260, athDrawdown: -15.9, volatility30d: 22.0, volatility90d: 18.5, sharpe90d: 0.78,
    cagr3y: 15.2, maxDrawdown: -32.0, var95: -2.0,
    betaBtc: 0.3, betaSpy: 0.95, correlationBtc: 0.28,
    liquidityScore: 100, socialScore: 90, devActivity: 0, inflationRate: 0,
    analystSignal: 'NEUTRAL',
    analystThesis: 'China tariff exposure creates near-term headwind. Services revenue growth strong but hardware margins under pressure. Apple Intelligence AI features rolling out — potential catalyst for upgrade cycle.'
  },
  TSLA: {
    id: 'TSLA', symbol: 'TSLA', name: 'Tesla Inc', category: 'Equity', color: '#CC0000',
    iconUrl: 'https://logo.clearbit.com/tesla.com',
    price: 268.5, marketCap: 855, fdv: 855, vol24h: 28.5,
    change24h: 3.5, change7d: -4.2, change30d: -18.5, changeYtd: -32.5, change1y: -8.5,
    ath: 488, athDrawdown: -45.0, volatility30d: 65.0, volatility90d: 58.5, sharpe90d: -0.12,
    cagr3y: 2.5, maxDrawdown: -75.0, var95: -5.8,
    betaBtc: 0.65, betaSpy: 1.8, correlationBtc: 0.35,
    liquidityScore: 98, socialScore: 98, devActivity: 0, inflationRate: 0,
    analystSignal: 'WATCH',
    analystThesis: 'Down 32.5% YTD. Brand sentiment declining in key markets. Robotaxi and Optimus timelines remain speculative. Energy storage business growing rapidly but not enough to offset auto margin compression.'
  },

  // ══════════ COMMODITIES ══════════

  GOLD: {
    id: 'GOLD', symbol: 'GOLD', name: 'Gold (Oz)', category: 'Commodity', color: '#FFD700',
    iconUrl: 'https://s3-symbol-logo.tradingview.com/gold--big.svg',
    price: 3085, marketCap: 20500, fdv: 20500, vol24h: 145.0,
    change24h: 0.5, change7d: 2.8, change30d: 5.2, changeYtd: 12.6, change1y: 32.5,
    ath: 3120, athDrawdown: -1.1, volatility30d: 14.5, volatility90d: 12.8, sharpe90d: 2.45,
    cagr3y: 14.2, maxDrawdown: -18.0, var95: -1.2,
    betaBtc: 0.15, betaSpy: 0.1, correlationBtc: 0.15,
    liquidityScore: 99, socialScore: 50, devActivity: 0, inflationRate: 1.5,
    analystSignal: 'BUY',
    analystThesis: 'Best performer Q1 2026 at +12.6% YTD. Polymarket gives 47% probability for full-year 2026 gold outperformance. Central bank buying at record pace. De-dollarization narrative driving structural demand.'
  },
  SILVER: {
    id: 'SILVER', symbol: 'SILVER', name: 'Silver (Oz)', category: 'Commodity', color: '#C0C0C0',
    iconUrl: 'https://s3-symbol-logo.tradingview.com/silver--big.svg',
    price: 33.85, marketCap: 1400, fdv: 1400, vol24h: 8.5,
    change24h: 0.8, change7d: 3.2, change30d: 8.5, changeYtd: 10.2, change1y: 28.5,
    ath: 50, athDrawdown: -32.3, volatility30d: 22.5, volatility90d: 20.0, sharpe90d: 1.85,
    cagr3y: 10.5, maxDrawdown: -35.0, var95: -2.0,
    betaBtc: 0.2, betaSpy: 0.15, correlationBtc: 0.18,
    liquidityScore: 95, socialScore: 35, devActivity: 0, inflationRate: 1.0,
    analystSignal: 'BUY',
    analystThesis: 'Riding gold tailwind + industrial demand from solar panels and EVs. Gold/silver ratio at 91x suggests silver is undervalued relative to gold historically (long-term average ~65x).'
  },
  OIL: {
    id: 'OIL', symbol: 'OIL', name: 'Crude Oil (WTI)', category: 'Commodity', color: '#4A2C0A',
    iconUrl: 'https://s3-symbol-logo.tradingview.com/crude-oil--big.svg',
    price: 69.5, marketCap: 0, fdv: 0, vol24h: 85.0,
    change24h: -1.2, change7d: -2.5, change30d: -5.8, changeYtd: -3.2, change1y: -12.5,
    ath: 147, athDrawdown: -52.7, volatility30d: 28.5, volatility90d: 25.0, sharpe90d: 0.15,
    cagr3y: -2.5, maxDrawdown: -75.0, var95: -2.8,
    betaBtc: 0.1, betaSpy: 0.3, correlationBtc: 0.08,
    liquidityScore: 98, socialScore: 42, devActivity: 0, inflationRate: 0,
    analystSignal: 'NEUTRAL',
    analystThesis: 'OPEC+ production cuts vs weakening demand. Tariff-induced recession fears weighing on price. Key variable for mining economics — lower oil benefits BTC miners with fossil-fuel energy.'
  },

  // ══════════ MACRO INDICATORS ══════════

  DXY: {
    id: 'DXY', symbol: 'DXY', name: 'US Dollar Index', category: 'Macro', color: '#10B981',
    iconUrl: 'https://s3-symbol-logo.tradingview.com/indices/us-dollar-index.svg',
    price: 104.2, marketCap: 0, fdv: 0, vol24h: 0,
    change24h: -0.3, change7d: -0.8, change30d: -1.5, changeYtd: -2.8, change1y: -4.5,
    ath: 114.7, athDrawdown: -9.1, volatility30d: 6.5, volatility90d: 5.8, sharpe90d: 0.35,
    cagr3y: -1.2, maxDrawdown: -15.0, var95: -0.6,
    betaBtc: -0.4, betaSpy: -0.3, correlationBtc: -0.65,
    liquidityScore: 100, socialScore: 40, devActivity: 0, inflationRate: 0,
    analystSignal: 'WATCH',
    analystThesis: 'Dollar weakening from 2025 highs as rate cut expectations build. DXY below 103 would be structurally bullish for risk assets and crypto. Inversely correlated with BTC at -0.65.'
  },
  VIX: {
    id: 'VIX', symbol: 'VIX', name: 'CBOE Volatility', category: 'Macro', color: '#EF4444',
    iconUrl: 'https://s3-symbol-logo.tradingview.com/indices/cboe-vix.svg',
    price: 31.0, marketCap: 0, fdv: 0, vol24h: 0,
    change24h: 5.2, change7d: 12.5, change30d: 45.0, changeYtd: 82.4, change1y: 95.0,
    ath: 82.69, athDrawdown: -62.5, volatility30d: 45.0, volatility90d: 38.5, sharpe90d: 0,
    cagr3y: 5.0, maxDrawdown: -70.0, var95: -8.0,
    betaBtc: -0.5, betaSpy: -0.8, correlationBtc: -0.52,
    liquidityScore: 95, socialScore: 55, devActivity: 0, inflationRate: 0,
    analystSignal: 'WATCH',
    analystThesis: 'VIX at 31 = elevated fear regime. Historically, sustained VIX above 25 correlates with risk-off positioning across all asset classes including crypto. Wait for VIX mean reversion below 20 to add risk.'
  },
  UST10Y: {
    id: 'UST10Y', symbol: 'UST10Y', name: '10Y US Treasury', category: 'Macro', color: '#3B82F6',
    iconUrl: 'https://s3-symbol-logo.tradingview.com/indices/us-10y-treasury.svg',
    price: 4.25, marketCap: 0, fdv: 0, vol24h: 0,
    change24h: -0.02, change7d: -0.08, change30d: -0.15, changeYtd: -0.12, change1y: -0.35,
    ath: 5.0, athDrawdown: -15.0, volatility30d: 8.5, volatility90d: 7.2, sharpe90d: 0.55,
    cagr3y: 0, maxDrawdown: -20.0, var95: -0.8,
    betaBtc: -0.25, betaSpy: -0.2, correlationBtc: -0.28,
    liquidityScore: 100, socialScore: 30, devActivity: 0, inflationRate: 0,
    analystSignal: 'NEUTRAL',
    analystThesis: '10Y yield at 4.25% — elevated opportunity cost for non-yielding assets. Yield curve normalizing from inversion. Rate cuts expected H2 2026 would compress yields and be crypto-positive.'
  },
};

export const DEFAULT_ASSETS = ['BTC', 'ETH', 'GOLD', 'SPY', 'QQQ', 'DXY'];

// ─── CHART MOCK DATA ──────────────────────────────────────────────────────────

export const generateChartMockData = () => {
  const data = [];
  let startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 3);

  let btc = 35000, eth = 2000, sol = 30, gold = 1800, spy = 400, qqq = 320;

  for (let i = 0; i < Math.floor(365 * 3 / 7); i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 7));

    btc = btc * (1 + (Math.random() * 0.15 - 0.07));
    eth = eth * (1 + (Math.random() * 0.18 - 0.08));
    sol = sol * (1 + (Math.random() * 0.25 - 0.11));
    gold = gold * (1 + (Math.random() * 0.03 - 0.012));
    spy = spy * (1 + (Math.random() * 0.05 - 0.02));
    qqq = qqq * (1 + (Math.random() * 0.06 - 0.025));

    data.push({
      date: date.toISOString().split('T')[0],
      BTC: Math.max(1000, btc),
      ETH: Math.max(100, eth),
      SOL: Math.max(5, sol),
      GOLD: Math.max(1500, gold),
      SPY: Math.max(250, spy),
      QQQ: Math.max(200, qqq),
    });
  }
  return data;
};

export const CHART_MOCK_DATA = generateChartMockData();

// ─── CORRELATION MATRIX ───────────────────────────────────────────────────────

export const CORRELATION_MATRIX: Record<string, Record<string, number>> = {
  BTC:    { BTC: 1,     ETH: 0.85,  SOL: 0.72,  BNB: 0.78,  ADA: 0.68,  AVAX: 0.70,  DOT: 0.65,  ARB: 0.65,  LINK: 0.72,  AAVE: 0.70,  FET: 0.45,  ONDO: 0.52,  SPY: 0.42,  QQQ: 0.48,  NVDA: 0.38,  AAPL: 0.28,  TSLA: 0.35,  GOLD: 0.15,  SILVER: 0.18,  OIL: 0.08,  DXY: -0.65, VIX: -0.52, UST10Y: -0.28 },
  ETH:    { BTC: 0.85,  ETH: 1,     SOL: 0.82,  BNB: 0.80,  ADA: 0.75,  AVAX: 0.78,  DOT: 0.72,  ARB: 0.88,  LINK: 0.78,  AAVE: 0.82,  FET: 0.55,  ONDO: 0.58,  SPY: 0.45,  QQQ: 0.52,  NVDA: 0.41,  AAPL: 0.30,  TSLA: 0.38,  GOLD: 0.12,  SILVER: 0.15,  OIL: 0.05,  DXY: -0.60, VIX: -0.48, UST10Y: -0.25 },
  SOL:    { BTC: 0.72,  ETH: 0.82,  SOL: 1,     BNB: 0.68,  ADA: 0.65,  AVAX: 0.72,  DOT: 0.62,  ARB: 0.62,  LINK: 0.65,  AAVE: 0.68,  FET: 0.65,  ONDO: 0.48,  SPY: 0.35,  QQQ: 0.42,  NVDA: 0.38,  AAPL: 0.22,  TSLA: 0.32,  GOLD: 0.05,  SILVER: 0.08,  OIL: 0.02,  DXY: -0.55, VIX: -0.42, UST10Y: -0.20 },
  GOLD:   { BTC: 0.15,  ETH: 0.12,  SOL: 0.05,  BNB: 0.10,  ADA: 0.08,  AVAX: 0.05,  DOT: 0.02,  ARB: 0.02,  LINK: 0.08,  AAVE: 0.05,  FET: -0.05, ONDO: 0.11,  SPY: -0.05, QQQ: -0.08, NVDA: -0.12, AAPL: -0.05, TSLA: -0.10, GOLD: 1,    SILVER: 0.88,  OIL: 0.25,  DXY: -0.75, VIX: 0.35,  UST10Y: -0.15 },
  SPY:    { BTC: 0.42,  ETH: 0.45,  SOL: 0.35,  BNB: 0.38,  ADA: 0.32,  AVAX: 0.35,  DOT: 0.30,  ARB: 0.38,  LINK: 0.40,  AAVE: 0.38,  FET: 0.25,  ONDO: 0.28,  SPY: 1,     QQQ: 0.95,  NVDA: 0.85,  AAPL: 0.90,  TSLA: 0.72,  GOLD: -0.05, SILVER: 0.02,  OIL: 0.15,  DXY: -0.35, VIX: -0.82, UST10Y: -0.18 },
  QQQ:    { BTC: 0.48,  ETH: 0.52,  SOL: 0.42,  BNB: 0.42,  ADA: 0.38,  AVAX: 0.40,  DOT: 0.35,  ARB: 0.42,  LINK: 0.45,  AAVE: 0.42,  FET: 0.32,  ONDO: 0.32,  SPY: 0.95,  QQQ: 1,     NVDA: 0.92,  AAPL: 0.88,  TSLA: 0.78,  GOLD: -0.08, SILVER: -0.02, OIL: 0.12,  DXY: -0.38, VIX: -0.85, UST10Y: -0.22 },
  DXY:    { BTC: -0.65, ETH: -0.60, SOL: -0.55, BNB: -0.52, ADA: -0.48, AVAX: -0.52, DOT: -0.48, ARB: -0.52, LINK: -0.50, AAVE: -0.48, FET: -0.35, ONDO: -0.42, SPY: -0.35, QQQ: -0.38, NVDA: -0.28, AAPL: -0.22, TSLA: -0.30, GOLD: -0.75, SILVER: -0.72, OIL: -0.15, DXY: 1,    VIX: 0.42,  UST10Y: 0.55 },
  VIX:    { BTC: -0.52, ETH: -0.48, SOL: -0.42, BNB: -0.45, ADA: -0.40, AVAX: -0.42, DOT: -0.38, ARB: -0.45, LINK: -0.42, AAVE: -0.40, FET: -0.28, ONDO: -0.35, SPY: -0.82, QQQ: -0.85, NVDA: -0.72, AAPL: -0.68, TSLA: -0.55, GOLD: 0.35,  SILVER: 0.28,  OIL: -0.10, DXY: 0.42,  VIX: 1,     UST10Y: 0.15 },
  NVDA:   { BTC: 0.38,  ETH: 0.41,  SOL: 0.38,  BNB: 0.35,  ADA: 0.30,  AVAX: 0.32,  DOT: 0.28,  ARB: 0.35,  LINK: 0.38,  AAVE: 0.35,  FET: 0.42,  ONDO: 0.25,  SPY: 0.85,  QQQ: 0.92,  NVDA: 1,     AAPL: 0.78,  TSLA: 0.68,  GOLD: -0.12, SILVER: -0.08, OIL: 0.10,  DXY: -0.28, VIX: -0.72, UST10Y: -0.15 },
  UST10Y: { BTC: -0.28, ETH: -0.25, SOL: -0.20, BNB: -0.22, ADA: -0.18, AVAX: -0.20, DOT: -0.18, ARB: -0.22, LINK: -0.20, AAVE: -0.18, FET: -0.12, ONDO: -0.15, SPY: -0.18, QQQ: -0.22, NVDA: -0.15, AAPL: -0.12, TSLA: -0.18, GOLD: -0.15, SILVER: -0.12, OIL: 0.08,  DXY: 0.55,  VIX: 0.15,  UST10Y: 1 },
};

// ─── GLOBAL ASSET CLASS DATA (for Allocation Panel) ───────────────────────────

export const GLOBAL_MARKET_CAP_DATA = [
  { name: 'Global Equities', value: 109, color: '#00A859', percent: '29.1%' },
  { name: 'Fixed Income', value: 130, color: '#3B82F6', percent: '34.7%' },
  { name: 'Real Estate', value: 45, color: '#8B5CF6', percent: '12.0%' },
  { name: 'Gold', value: 16, color: '#FFD700', percent: '4.3%' },
  { name: 'Other Commodities', value: 6, color: '#92400E', percent: '1.6%' },
  { name: 'Private Equity', value: 12, color: '#EC4899', percent: '3.2%' },
  { name: 'Cash & Deposits', value: 50, color: '#6B7280', percent: '13.3%' },
  { name: 'Crypto', value: 2.5, color: '#F7931A', percent: '0.7%' },
  { name: 'Other', value: 4.5, color: '#374151', percent: '1.2%' },
];

export const MODEL_PORTFOLIOS = [
  {
    name: 'Conservative',
    description: 'Capital preservation with modest growth',
    allocations: [
      { asset: 'Bonds', pct: 60, color: '#3B82F6' },
      { asset: 'Equities', pct: 30, color: '#00A859' },
      { asset: 'Gold', pct: 5, color: '#FFD700' },
      { asset: 'BTC', pct: 5, color: '#F7931A' },
    ],
    expectedReturn: '5-7%',
    riskLevel: 'LOW',
  },
  {
    name: 'Balanced',
    description: 'Growth with moderate risk management',
    allocations: [
      { asset: 'Bonds', pct: 40, color: '#3B82F6' },
      { asset: 'Equities', pct: 40, color: '#00A859' },
      { asset: 'Gold', pct: 10, color: '#FFD700' },
      { asset: 'BTC', pct: 10, color: '#F7931A' },
    ],
    expectedReturn: '8-12%',
    riskLevel: 'MED',
  },
  {
    name: 'Growth',
    description: 'Aggressive growth with higher crypto allocation',
    allocations: [
      { asset: 'Bonds', pct: 20, color: '#3B82F6' },
      { asset: 'Equities', pct: 50, color: '#00A859' },
      { asset: 'Gold', pct: 15, color: '#FFD700' },
      { asset: 'BTC', pct: 15, color: '#F7931A' },
    ],
    expectedReturn: '12-18%',
    riskLevel: 'MED',
  },
  {
    name: 'Crypto-Native',
    description: 'Maximum digital asset exposure',
    allocations: [
      { asset: 'Equities', pct: 10, color: '#00A859' },
      { asset: 'Gold', pct: 10, color: '#FFD700' },
      { asset: 'BTC', pct: 50, color: '#F7931A' },
      { asset: 'ETH + Alts', pct: 30, color: '#627EEA' },
    ],
    expectedReturn: '20-40%',
    riskLevel: 'HIGH',
  },
];

// ─── MACRO THEME CARDS ────────────────────────────────────────────────────────

export const MACRO_THEMES = [
  {
    title: 'Tariff Uncertainty',
    subtitle: 'Trade war escalation weighing on global equities',
    impact: 'NEGATIVE',
    detail: 'New tariff announcements driving SPY −6.1% and QQQ −9.3% YTD. Supply chain disruption risks elevating VIX to 31. Risk-off positioning dominating institutional flows.',
  },
  {
    title: "Gold's Safe Haven Rally",
    subtitle: 'Best-performing asset class Q1 2026',
    impact: 'POSITIVE',
    detail: 'Gold +12.6% YTD driven by central bank buying and de-dollarization. Polymarket gives 47% probability for full-year outperformance. Silver following at +10.2%.',
  },
  {
    title: 'Crypto Correlation Regime',
    subtitle: 'BTC trading as risk asset, not safe haven',
    impact: 'NEUTRAL',
    detail: 'BTC 0.68 correlation with Nasdaq suggests crypto hasn\'t decoupled from risk assets. ETH/BTC ratio declining as capital consolidates into BTC. Layer 2 tokens worst-performing crypto subsector.',
  },
  {
    title: 'VIX Elevated Fear',
    subtitle: 'Sustained volatility above 25 = risk-off regime',
    impact: 'NEGATIVE',
    detail: 'VIX at 31, +82% YTD. Historically, sustained VIX >25 correlates with 15-25% drawdowns in risk assets. Mean reversion below 20 needed before adding risk exposure.',
  },
];
