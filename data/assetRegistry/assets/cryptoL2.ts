import { AssetData } from "../types";

export const ASSETS_L2: Record<string, AssetData> = {
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

  
};
