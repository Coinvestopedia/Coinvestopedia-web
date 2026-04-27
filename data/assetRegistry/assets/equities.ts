import { AssetData } from "../types";

export const ASSETS_EQUITIES: Record<string, AssetData> = {
// ══════════ EQUITIES ══════════

  SPY: {
    id: 'SPY', symbol: 'SPY', name: 'S&P 500 ETF', category: 'Equity', color: '#00A859',
    iconUrl: 'https://logo.clearbit.com/ssga.com',
    price: 694.10, marketCap: 65000, fdv: 65000, vol24h: 42.5,
    change24h: 0.1, change7d: 1.2, change30d: 4.5, changeYtd: 12.8, change1y: 22.5,
    ath: 695, athDrawdown: -0.1, volatility30d: 18.5, volatility90d: 16.2, sharpe90d: 1.15,
    cagr3y: 8.2, maxDrawdown: -34.0, var95: -1.8,
    betaBtc: 0.4, betaSpy: 1.0, correlationBtc: 0.42,
    liquidityScore: 100, socialScore: 65, devActivity: 0, inflationRate: 0,
    analystSignal: 'NEUTRAL',
    analystThesis: 'Down 6.1% YTD on tariff concerns and recession fears. Earnings growth still positive but decelerating. Fed cut expectations pushed to H2 2026. Defensive positioning warranted — favor quality over growth.'
  },
  QQQ: {
    id: 'QQQ', symbol: 'QQQ', name: 'Nasdaq 100 ETF', category: 'Equity', color: '#0072C6',
    iconUrl: 'https://logo.clearbit.com/invesco.com',
    price: 624.77, marketCap: 35000, fdv: 35000, vol24h: 35.2,
    change24h: 0.2, change7d: 0.8, change30d: 5.2, changeYtd: 15.5, change1y: 28.2,
    ath: 625, athDrawdown: -0.05, volatility30d: 24.5, volatility90d: 22.0, sharpe90d: 0.98,
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
    analystSignal: 'OUTPERFORM',
    analystThesis: 'Best-in-class AI infrastructure. Blackwell ramp driving record datacenter revenue. Down 18% YTD on broader tech selloff — secular AI trend intact. Potential structural accumulation zone for long-term horizon.'
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

  
};
