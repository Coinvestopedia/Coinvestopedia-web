import { AssetData } from "../types";

export const ASSETS_AI: Record<string, AssetData> = {
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

  
};
