import { useState, useEffect } from 'react';
import { ASSET_REGISTRY, AssetData } from '../data/assetRegistry';
import { fetchMarketData, fetchMacroIndicators } from '../services/api';

interface CoinGeckoMarketItem {
  symbol: string;
  current_price: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  price_change_percentage_1y_in_currency?: number;
  market_cap?: number;
  total_volume?: number;
  fully_diluted_valuation?: number;
  ath?: number;
  ath_change_percentage?: number;
}

interface FMPQuote {
  symbol: string;
  price: number;
  changesPercentage: number;
  marketCap?: number;
  volume?: number;
  yearHigh?: number;
}

export const useLiveAssetRegistry = () => {
  const [registry, setRegistry] = useState<Record<string, AssetData>>(ASSET_REGISTRY);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const hydrateData = async () => {
      setIsHydrating(true);
      
      try {
        // 1. Fetch Crypto Data
        const cryptoData = await fetchMarketData({ perPage: 100 });
        
        // 2. Fetch Macro/Equities/Commodities Data
        const macroData = await fetchMacroIndicators();

        if (!isMounted) return;

        const updatedRegistry = { ...ASSET_REGISTRY };

        // Process Crypto
        if (Array.isArray(cryptoData)) {
          (cryptoData as CoinGeckoMarketItem[]).forEach((coin) => {
            const sym = coin.symbol.toUpperCase();
            if (updatedRegistry[sym]) {
              updatedRegistry[sym] = {
                ...updatedRegistry[sym],
                price: coin.current_price,
                change24h: coin.price_change_percentage_24h_in_currency || coin.price_change_percentage_24h || updatedRegistry[sym].change24h,
                change7d: coin.price_change_percentage_7d_in_currency || updatedRegistry[sym].change7d,
                change30d: coin.price_change_percentage_30d_in_currency || updatedRegistry[sym].change30d,
                change1y: coin.price_change_percentage_1y_in_currency || updatedRegistry[sym].change1y,
                marketCap: coin.market_cap ? coin.market_cap / 1_000_000_000 : updatedRegistry[sym].marketCap, // in billions
                vol24h: coin.total_volume ? coin.total_volume / 1_000_000_000 : updatedRegistry[sym].vol24h,
                fdv: coin.fully_diluted_valuation ? coin.fully_diluted_valuation / 1_000_000_000 : updatedRegistry[sym].fdv,
                ath: coin.ath || updatedRegistry[sym].ath,
                athDrawdown: coin.ath_change_percentage || updatedRegistry[sym].athDrawdown,
              };
            }
          });
        }

        // Process Macro (FMP returns an array of quotes)
        if (Array.isArray(macroData)) {
          (macroData as FMPQuote[]).forEach((quote) => {
            let internalSym = quote.symbol;
            if (quote.symbol === 'DX-Y.NYB') internalSym = 'DXY';
            if (quote.symbol === '^GSPC') internalSym = 'SPY'; // approx
            if (quote.symbol === '^IXIC') internalSym = 'QQQ'; // approx
            if (quote.symbol === '^TNX') internalSym = 'UST10Y';
            if (quote.symbol === 'GCUSD') internalSym = 'GOLD';
            if (quote.symbol === 'SIUSD') internalSym = 'SILVER';

            if (updatedRegistry[internalSym]) {
              updatedRegistry[internalSym] = {
                ...updatedRegistry[internalSym],
                price: quote.price,
                change24h: quote.changesPercentage,
                marketCap: quote.marketCap ? quote.marketCap / 1_000_000_000 : updatedRegistry[internalSym].marketCap,
                vol24h: quote.volume ? (quote.volume * quote.price) / 1_000_000_000 : updatedRegistry[internalSym].vol24h,
                ath: quote.yearHigh || updatedRegistry[internalSym].ath,
              };
            }
          });
        }

        setRegistry(updatedRegistry);
      } catch (err) {
        console.error('Failed to hydrate Asset Registry:', err);
      } finally {
        if (isMounted) setIsHydrating(false);
      }
    };

    hydrateData();
    // Rehydrate every 60 seconds
    const intervalId = setInterval(hydrateData, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { registry, isHydrating };
};

