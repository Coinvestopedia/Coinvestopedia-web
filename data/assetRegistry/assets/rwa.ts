import { AssetData } from "../types";

export const ASSETS_RWA: Record<string, AssetData> = {
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
    analystSignal: 'OUTPERFORM',
    analystThesis: 'Leading RWA tokenization protocol with $600M+ TVL in tokenized US Treasuries. BlackRock BUIDL fund integration. Key beneficiary of TradFi on-chain trend. High FDV/MCap ratio is the risk.'
  },

  
};
