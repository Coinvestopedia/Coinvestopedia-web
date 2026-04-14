import { AssetData } from "../types";

export const ASSETS_MACRO: Record<string, AssetData> = {
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
