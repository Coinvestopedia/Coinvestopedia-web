import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ASSET_REGISTRY, AssetData } from '../data/assetRegistry';
import { fetchMarketData, fetchMacroIndicators, fetchYahooFinanceData } from '../services/api';

interface AssetRegistryContextType {
  registry: Record<string, AssetData>;
  isHydrating: boolean;
}

const AssetRegistryContext = createContext<AssetRegistryContextType | undefined>(undefined);

export const AssetRegistryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registry, setRegistry] = useState<Record<string, AssetData>>(ASSET_REGISTRY);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const hydrateData = async () => {
      if (!isMounted) return;
      setIsHydrating(true);
      
      try {
        const updatedRegistry = { ...ASSET_REGISTRY };
        let cryptoResultValue = null;
        let macroResultValue = null;
        let yahooResultValue = null;

        try {
          const res = await fetch('/api/market-data');
          if (res.ok) {
            const data = await res.json();
            cryptoResultValue = data.crypto || [];
            macroResultValue = data.macro || [];
            yahooResultValue = data.yahoo || [];
          } else {
            throw new Error('Edge fetch failed');
          }
        } catch (e) {
            if (import.meta.env.DEV) {
              console.debug("[AssetRegistryContext] /api/market-data unavailable locally, falling back to direct fetching.");
            } else {
              console.warn("Backend /api/market-data unavailable, falling back to direct client fetching...");
            }
        }

        if (cryptoResultValue === null || macroResultValue === null) {
          const yahooSymbols = ['BTC-USD', 'ETH-USD', 'GC=F', 'CL=F', 'DX-Y.NYB', '^TNX', 'SPY', 'QQQ', 'NVDA', 'AAPL', 'TSLA', '^VIX'];
          const [cryptoRes, macroRes, yahooRes] = await Promise.allSettled([
            fetchMarketData({ perPage: 100 }),
            fetchMacroIndicators(),
            fetchYahooFinanceData(yahooSymbols)
          ]);
          
          cryptoResultValue = cryptoRes.status === 'fulfilled' ? cryptoRes.value : [];
          macroResultValue = macroRes.status === 'fulfilled' ? macroRes.value : [];
          yahooResultValue = yahooRes.status === 'fulfilled' ? yahooRes.value : [];
        }

        if (!isMounted) return;

        // 1. Process Crypto (CoinGecko)
        if (Array.isArray(cryptoResultValue)) {
          cryptoResultValue.forEach((coin: any) => {
            const sym = coin.symbol.toUpperCase();
            if (updatedRegistry[sym]) {
              updatedRegistry[sym] = {
                ...updatedRegistry[sym],
                price: coin.current_price,
                change24h: coin.price_change_percentage_24h || updatedRegistry[sym].change24h,
                marketCap: coin.market_cap ? coin.market_cap / 1_000_000_000 : updatedRegistry[sym].marketCap,
              };
            }
          });
        }

        // 2. Process Macro (FMP)
        if (Array.isArray(macroResultValue)) {
          macroResultValue.forEach((quote: any) => {
            let internalSym = quote.symbol;
            if (quote.symbol === 'DX-Y.NYB') internalSym = 'DXY';
            if (quote.symbol === 'GCUSD') internalSym = 'GOLD';
            if (quote.symbol === '^GSPC') internalSym = 'SPY';
            if (quote.symbol === '^IXIC') internalSym = 'QQQ';

            if (updatedRegistry[internalSym]) {
              updatedRegistry[internalSym] = {
                ...updatedRegistry[internalSym],
                price: quote.price,
                change24h: quote.changesPercentage || updatedRegistry[internalSym].change24h,
              };
            }
          });
        }

        // 3. Process Yahoo Finance (High Priority Override)
        if (Array.isArray(yahooResultValue)) {
          yahooResultValue.forEach((quote: any) => {
            let sym = quote.symbol;
            if (sym === 'BTC-USD') sym = 'BTC';
            if (sym === 'ETH-USD') sym = 'ETH';
            if (sym === 'GC=F') sym = 'GOLD';
            if (sym === 'CL=F') sym = 'OIL';
            if (sym === 'DX-Y.NYB') sym = 'DXY';
            if (sym === '^TNX') sym = 'UST10Y';
            if (sym === '^VIX') sym = 'VIX';
            if (sym === '^GSPC') sym = 'SPY';
            if (sym === '^IXIC') sym = 'QQQ';

            if (updatedRegistry[sym]) {
              updatedRegistry[sym] = {
                ...updatedRegistry[sym],
                price: quote.regularMarketPrice || updatedRegistry[sym].price,
                change24h: quote.regularMarketChangePercent || updatedRegistry[sym].change24h,
                marketCap: quote.marketCap ? quote.marketCap / 1_000_000_000 : updatedRegistry[sym].marketCap,
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
    // Rehydrate every 2 hours globally
    const intervalId = setInterval(hydrateData, 7200000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <AssetRegistryContext.Provider value={{ registry, isHydrating }}>
      {children}
    </AssetRegistryContext.Provider>
  );
};

export const useAssetRegistryContext = () => {
  const context = useContext(AssetRegistryContext);
  if (!context) {
    throw new Error('useAssetRegistryContext must be used within an AssetRegistryProvider');
  }
  return context;
};
