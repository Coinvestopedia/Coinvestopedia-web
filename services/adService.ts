import { PageRoute } from '../types';

export type AdPartner = 'kucoin' | 'htx' | 'binance' | 'bybit' | 'bitget' | 'glassnode' | 'nansen' | 'tradingview' | 'coinledger' | 'trezor' | '3commas' | 'okx' | 'ledger';

export interface AdContext {
  page?: PageRoute | string;
  toolId?: string;
  assetSelected?: string;
  articleCategory?: string;
}

export const getContextualAd = (context: AdContext): AdPartner => {
  // Tool-specific routing
  if (context.toolId === 'tax') return 'coinledger';
  if (context.toolId === 'dca') return 'binance';
  if (context.toolId === 'il') return 'bybit';
  if (context.toolId === 'on-chain-valuation' || context.toolId === 'rup') return 'glassnode';
  if (context.toolId === 'macro-regime' || context.toolId === 'fear-greed') return 'tradingview';
  
  // Asset-specific routing
  if (context.assetSelected === 'BTC') return 'binance';
  if (context.assetSelected === 'ETH') return 'bitget';
  if (context.assetSelected === 'USDT' || context.assetSelected === 'USDC') return 'kucoin'; // Stablecoins often used on exchanges

  // Page defaults
  switch (context.page) {
    case PageRoute.WHALE:
      return 'nansen'; // Replaced coinglass with Nansen since Nansen is heavily on-chain
    case PageRoute.MACRO_INTEL:
      return 'tradingview';
    case PageRoute.RESEARCH:
      return 'glassnode';
    case PageRoute.LEARN:
      return 'htx'; // Just ensuring all partners get exposure
    case PageRoute.TOOLS:
      return 'coinledger';
    case PageRoute.COMPARE:
      return 'bitget';
    case PageRoute.AUDIT:
      return 'trezor';
    case PageRoute.INSIGHTS:
      return 'bybit';
  }

  // Articles could have category checking
  if (context.articleCategory === 'Trading') return 'bybit';
  if (context.articleCategory === 'DeFi') return 'bitget';
  
  return 'kucoin';
};
