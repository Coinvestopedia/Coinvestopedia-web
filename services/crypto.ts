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

export const DEFAULT_FALLBACK_SECTORS = [
  { id: 'layer-1', name: 'Layer 1', market_cap: 1450000000000, market_cap_change_24h: 1.4 },
  { id: 'decentralized-finance-defi', name: 'DeFi', market_cap: 115000000000, market_cap_change_24h: 3.2 },
  { id: 'layer-2', name: 'Layer 2', market_cap: 38000000000, market_cap_change_24h: 2.1 },
  { id: 'artificial-intelligence', name: 'AI & Big Data', market_cap: 32000000000, market_cap_change_24h: 4.8 },
  { id: 'real-world-assets-rwa', name: 'RWA', market_cap: 14500000000, market_cap_change_24h: 0.9 },
  { id: 'depin', name: 'DePIN', market_cap: 22000000000, market_cap_change_24h: -1.2 },
  { id: 'meme-token', name: 'Meme Coins', market_cap: 54000000000, market_cap_change_24h: -2.4 },
  { id: 'liquid-staking', name: 'Liquid Staking', market_cap: 48000000000, market_cap_change_24h: 1.7 }
];

export const fetchSectorPerformance = async () => {
  // 1. Try static sectorPerformance.json first (fast, reliable, immune to rate limits)
  try {
    const staticRes = await fetch('/sectorPerformance.json');
    if (staticRes.ok) {
      const staticData = await staticRes.json();
      if (Array.isArray(staticData) && staticData.length > 0) {
        return staticData;
      }
    }
  } catch (staticErr) {
    // Ignore and proceed to proxy
  }

  // 2. Try CoinGecko proxy if static JSON is unavailable
  try {
    const response = await fetch(`${COINGECKO_PROXY_URL}/coins/categories?order=market_cap_desc`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (error) {
    console.warn('Proxy sector performance fetch failed, using fallback:', error);
  }

  // 3. Guaranteed fallback to prevent blank card or infinite skeleton pulse
  return DEFAULT_FALLBACK_SECTORS;
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
