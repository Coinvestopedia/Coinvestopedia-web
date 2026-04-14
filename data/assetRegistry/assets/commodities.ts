import { AssetData } from "../types";

export const ASSETS_COMMODITIES: Record<string, AssetData> = {
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

  
};
