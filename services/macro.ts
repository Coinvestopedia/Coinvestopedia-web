import { fetchWithCache } from './base';
import { fetchDefiLlamaTVL } from './onchain';

/**
 * Coinvestopedia Macro Service
 * Uses secure Cloudflare Proxies for financial data
 */

// Primary Yahoo Fetcher via Proxy
export const fetchYahooFinanceData = async (symbols: string[]) => {
  try {
    // /api/yahoo/v7/finance/spark?symbols=...
    const response = await fetch(`/api/yahoo/v7/finance/spark?symbols=${symbols.join(',')}`);
    const data = await response.json();
    
    return data.spark?.result?.map((item: any) => {
      const meta = item.response[0]?.meta || {};
      const price = meta.regularMarketPrice || 0;
      const prevClose = meta.chartPreviousClose || 0;
      return {
        symbol: item.symbol,
        regularMarketPrice: price,
        regularMarketChangePercent: prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0,
        name: item.symbol === '^TNX' ? '10Y Treasury' : item.symbol === '^VIX' ? 'VIX' : item.symbol
      };
    }) || [];
  } catch (error) {
    console.warn('Yahoo fetch failed:', error);
    return [];
  }
};

export const fetchMacroIndicators = async () => {
  try {
    // 1. Try Backend Aggregator First (market-data handles multiple sources in one go)
    try {
      const res = await fetch('/api/market-data');
      if (res.ok) {
        const data = await res.json();
        const normalized: any[] = [];
        if (data.yahoo) {
          data.yahoo.forEach((y: any) => normalized.push({ 
            symbol: y.symbol, 
            name: y.name, 
            price: y.regularMarketPrice, 
            changesPercentage: y.regularMarketChangePercent 
          }));
        }
        if (data.macro) {
          data.macro.forEach((m: any) => { 
            if (!normalized.some(i => i.symbol === m.symbol)) {
              normalized.push({ 
                symbol: m.symbol, 
                name: m.name, 
                price: m.price, 
                changesPercentage: m.changesPercentage 
              });
            }
          });
        }
        if (data.defi?.totalTVL) {
          normalized.push({ 
            symbol: 'DEFI_TVL', 
            name: 'DeFi TVL', 
            price: data.defi.totalTVL, 
            changesPercentage: 0, 
            isCurrency: true 
          });
        }
        if (normalized.length > 0) return normalized;
      }
    } catch (e) { 
      console.warn("Backend /api/market-data unavailable, falling back to individual proxies"); 
    }

    // 2. Client-side Fallback via individual Proxies
    const fallback: any[] = [];
    const yahoo = await fetchYahooFinanceData(['^TNX', '^VIX', 'GOLD', 'SILVER', 'OIL', 'BTC', 'ETH']);
    yahoo.forEach((y: any) => fallback.push({ 
      symbol: y.symbol, 
      name: y.name, 
      price: y.regularMarketPrice, 
      changesPercentage: y.regularMarketChangePercent 
    }));
    
    const tvl = await fetchDefiLlamaTVL();
    if (tvl) fallback.push({ 
      symbol: 'DEFI_TVL', 
      name: 'DeFi TVL', 
      price: tvl, 
      changesPercentage: 0, 
      isCurrency: true 
    });

    // FMP Proxy
    try {
      const fmp = await fetchWithCache(
        'fmp_macro', 
        `/api/fmp/v3/quote/UUP,SPY,QQQ,AAPL,TSLA,NVDA`, 
        {}, 
        21600
      );
      if (Array.isArray(fmp)) {
        fmp.forEach((m: any) => { 
          if (!fallback.some(i => i.symbol === m.symbol)) {
            fallback.push({ 
              symbol: m.symbol, 
              name: m.name, 
              price: m.price, 
              changesPercentage: m.changesPercentage 
            });
          }
        });
      }
    } catch (fmpErr) {
      console.warn("FMP Proxy fetch failed:", fmpErr);
    }

    return fallback;
  } catch (err) {
    console.error("Critical macro fetch error:", err);
    return null;
  }
};

export const fetchForexRates = async (baseCurrency = 'USD') => {
  try {
    // /api/openexchangerates/api/latest.json?base=...
    return await fetchWithCache(
      `forex_${baseCurrency}`, 
      `/api/openexchangerates/api/latest.json?base=${baseCurrency}`, 
      {}, 
      21600
    );
  } catch (error) {
    console.error('Forex fetch error:', error);
    return null;
  }
};
