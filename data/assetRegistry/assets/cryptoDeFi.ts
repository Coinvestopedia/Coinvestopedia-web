import { AssetData } from "../types";

export const ASSETS_DEFI: Record<string, AssetData> = {
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
    analystSignal: 'OUTPERFORM',
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
    analystSignal: 'OUTPERFORM',
    analystThesis: 'Dominant lending protocol with $12B+ TVL across 8 chains. GHO stablecoin generating protocol revenue. Fee switch activated — real yield accruing to AAVE stakers. Best DeFi blue-chip.'
  },

  
};
