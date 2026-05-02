import { fetchWithCache } from './base';

/**
 * Coinvestopedia Crypto Service
 * Uses secure Cloudflare Proxies to prevent API key exposure
 */
const COINGECKO_PROXY_URL = '/api/coingecko';

export const fetchMarketMetrics = async () => {
  try {
    const response = await fetch(`${COINGECKO_PROXY_URL}/global`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching global metrics:', error);
    return null;
  }
};

export const fetchTrendingAssets = async () => {
  try {
    const response = await fetch(`${COINGECKO_PROXY_URL}/search/trending`);
    const data = await response.json();
    return data.coins;
  } catch (error) {
    console.error('Error fetching trending assets:', error);
    return [];
  }
};

export interface FetchMarketDataOptions {
  category?: string;
  perPage?: number;
}

export const fetchMarketData = async (options: FetchMarketDataOptions = {}) => {
  try {
    const { category, perPage = 100 } = options;
    let url = `${COINGECKO_PROXY_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=24h,7d,30d,1y`;
    
    if (category) {
      if (category === 'defi') url += '&category=decentralized-finance-defi';
      else if (category === 'layer1') url += '&category=layer-1';
      else if (category !== 'all') url += `&category=${category}`;
    }

    // Cache crypto for 6 hours
    const data = await fetchWithCache(`cg_markets_${category || 'all'}_${perPage}`, url, {}, 21600);

    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
};

export const fetchSectorPerformance = async () => {
  try {
    const response = await fetch(`${COINGECKO_PROXY_URL}/coins/categories?order=market_cap_desc`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sector performance:', error);
    return [];
  }
};

export const fetchFearAndGreed = async () => {
  try {
    const response = await fetch('https://api.alternative.me/fng/?limit=31');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching fear and greed:', error);
    return null;
  }
};

export const fetchLivePrice = async (assetId: string = 'bitcoin'): Promise<number | null> => {
  try {
    const cgUrl = `${COINGECKO_PROXY_URL}/simple/price?ids=${assetId}&vs_currencies=usd`;
    const response = await fetch(cgUrl);
    if (response.ok) {
      const data = await response.json();
      return data[assetId]?.usd || null;
    }
    throw new Error('CoinGecko proxy failed');
  } catch (error) {
    console.warn(`Primary price fetch for ${assetId} failed, trying fallback:`, error);
    try {
      const altUrl = `https://api.alternative.me/v2/ticker/${assetId}/`;
      const response = await fetch(altUrl);
      const data = await response.json();
      const tickerData = Object.values(data.data || {})[0] as any;
      return tickerData?.quotes?.USD?.price || null;
    } catch (fallbackError) {
      console.error('Fallback price fetch failed:', fallbackError);
      return null;
    }
  }
};
