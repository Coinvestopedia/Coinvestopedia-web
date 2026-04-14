import { AssetData } from "../types";

export const ASSETS_L1: Record<string, AssetData> = {
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

  
};