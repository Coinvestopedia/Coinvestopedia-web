import { GoogleGenAI } from '@google/genai';

// ─── UTILITY SETTINGS ────────────────────────────────────────────────────────
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API || '';
const CRYPTOPANIC_API_KEY = import.meta.env.VITE_CRYPTOPANIC_API || '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const WHALE_ALERT_API_KEY = import.meta.env.VITE_WHALE_ALERT_API_KEY || '';
const GLASSNODE_API_KEY = import.meta.env.VITE_GLASSNODE_API_KEY || '';
const CRYPTOQUANT_API_KEY = import.meta.env.VITE_CRYPTOQUANT_API_KEY || '';
const BITQUERY_API_KEY = import.meta.env.VITE_BITQUERY_API_KEY || '';
const THEGRAPH_API_KEY = import.meta.env.VITE_STUDIO_API_KEY || '';

const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY || '';
const OPEN_EXCHANGE_APP_ID = import.meta.env.VITE_OPEN_EXCHANGE_APP_ID || '';
const DUNE_API_KEY = import.meta.env.VITE_DUNE_API_KEY || '';
// ─── CLIENT-SIDE CACHE UTILITY ────────────────────────────────────────────────
/**
 * Advanced Fetch with Cache: 
 * 1. Returns fresh data if within TTL.
 * 2. If fetch fails (Quota, 403, Network), returns STALE data from cache if available.
 * 3. Standardizes default TTL to 6 hours (21600s) as per institutional requirements.
 */
const fetchWithCache = async (cacheKey: string, url: string, options: RequestInit = {}, ttlSeconds: number = 21600) => {
  const cachedItem = localStorage.getItem(cacheKey);
  let staleData = null;

  if (cachedItem) {
    try {
      const { timestamp, data } = JSON.parse(cachedItem);
      staleData = data;
      // Return fresh cache if not expired
      if (Date.now() - timestamp < ttlSeconds * 1000 && data !== null) {
        return data;
      }
    } catch (e) {
      console.warn(`[Cache] Parse error for ${cacheKey}:`, e);
    }
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.warn(`[API] Fetch failed for ${url} with status ${response.status}. Attempting stale fallback...`);
      
      // If we have stale data, return it instead of throwing
      if (staleData !== null) return staleData;
      
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Safety check for empty or malformed data
    if (!data || (Array.isArray(data) && data.length === 0)) {
       if (staleData !== null) return staleData;
    }

    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
    return data;
  } catch (err) {
    console.error(`[API] Network or Quota error for ${url}:`, err);
    // Final fallback: return stale data if we have it
    if (staleData !== null) {
      console.log(`[API] Serving stale data for ${cacheKey} due to error.`);
      return staleData;
    }
    throw err;
  }
};

// ─── COINGECKO API ───────────────────────────────────────────────────────────

export const fetchMarketMetrics = async () => {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/global`, {
      headers: {
        'x-cg-demo-api-key': COINGECKO_API_KEY
      }
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching global metrics:', error);
    return null;
  }
};

export const fetchTrendingAssets = async () => {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/search/trending`, {
      headers: {
        'x-cg-demo-api-key': COINGECKO_API_KEY
      }
    });
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
    let url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=24h,7d,30d,1y`;
    
    if (category) {
      if (category === 'defi') url += '&category=decentralized-finance-defi';
      else if (category === 'layer1') url += '&category=layer-1';
      else if (category !== 'all') url += `&category=${category}`;
    }

    // Cache crypto for 6 hours
    const data = await fetchWithCache(`cg_markets_${category || 'all'}_${perPage}`, url, {
      headers: { 'x-cg-demo-api-key': COINGECKO_API_KEY }
    }, 21600);

    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
};

// ─── FEAR & GREED API ────────────────────────────────────────────────────────

export const fetchSectorPerformance = async () => {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/coins/categories?order=market_cap_desc`, {
      headers: {
        'x-cg-demo-api-key': COINGECKO_API_KEY
      }
    });
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
    // Primary: CoinGecko
    const cgUrl = `${COINGECKO_BASE_URL}/simple/price?ids=${assetId}&vs_currencies=usd`;
    const response = await fetch(cgUrl, {
      headers: { 'x-cg-demo-api-key': COINGECKO_API_KEY }
    });
    if (response.ok) {
      const data = await response.json();
      return data[assetId]?.usd || null;
    }
    throw new Error('CoinGecko failed');
  } catch (error) {
    console.warn(`Primary price fetch for ${assetId} failed, trying fallback:`, error);
    try {
      // Fallback: Alternative.me (Bitcoin is ID 1 usually)
      const altUrl = `https://api.alternative.me/v2/ticker/${assetId}/`;
      const response = await fetch(altUrl);
      const data = await response.json();
      // Alternative.me returns a map, we need to find the correct entry
      const tickerData = Object.values(data.data || {})[0] as any;
      return tickerData?.quotes?.USD?.price || null;
    } catch (fallbackError) {
      console.error('Fallback price fetch failed:', fallbackError);
      return null;
    }
  }
};

// ─── CRYPTOPANIC API ─────────────────────────────────────────────────────────

export const fetchNewsFeed = async () => {
  try {
    // Proxied through Vite to handle CORS locally
    const response = await fetch(`/api/cryptopanic/api/v1/posts/?auth_token=${CRYPTOPANIC_API_KEY}&kind=news`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching news feed:', error);
    return [];
  }
};

// ─── GEMINI AI API ───────────────────────────────────────────────────────────

const GEMINI_CACHE_KEY = 'coinvestopedia_gemini_insights';
export const generateMarketPulseInsights = async (marketContext: string) => {
  const CACHE_KEY = 'coinvestopedia_gemini_insights';
  const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

  let staleData = null;
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      staleData = parsed.data;
      if (Date.now() - parsed.timestamp < TTL_MS && staleData !== null) {
        return staleData;
      }
    }
  } catch (e) {
    console.warn("Cache read error:", e);
  }

  if (!GEMINI_API_KEY) {
     return staleData;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const prompt = `
      You are an elite, institutional-grade crypto analyst specifically writing for 'Coinvestopedia Knowledge'.
      Context based on live data (or mock if unavailable): ${marketContext}
      
      Generate exactly 5 distinct market insights.
      Must be returned as valid JSON array ONLY, without markdown wrapping or backticks.
      Format:
      [
        {
          "type": "technical" | "fundamental" | "sentiment" | "onchain",
          "category": "Technical Analysis" | "Fundamental News" | "Market Sentiment" | "On-Chain Data",
          "title": "Short title",
          "content": "Insightful paragraph for a finance professional."
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "[]";
    const insights = JSON.parse(resultText);

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: insights
    }));
    return insights;
  } catch (error) {
    console.error(`Error generating pulse insights:`, error);
    return staleData;
  }
};

// ─── INSTITUTIONAL ON-CHAIN APIS (WHALE ALERT, GLASSNODE, ETC) ──────────────

export const fetchWhaleAlerts = async (min_value = 500000) => {
  try {
    if (!WHALE_ALERT_API_KEY) {
      return [];
    }
    const timestamp = Math.floor(Date.now() / 1000) - 86400; // last 24h
    const response = await fetch(`https://api.whale-alert.io/v1/transactions?api_key=${WHALE_ALERT_API_KEY}&min_value=${min_value}&start=${timestamp}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.transactions || [];
  } catch (error) {
    return [];
  }
};

export const fetchMempoolTxs = async () => {
  try {
    // mempool.space is completely free, no API key required
    const response = await fetch('https://mempool.space/api/mempool/recent');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Mempool txs:', error);
    return [];
  }
};

export const fetchDefiLlamaTVL = async () => {
    try {
      // Cache for 6 hours
      const data = await fetchWithCache('defillama_tvl', 'https://api.llama.fi/charts', {}, 21600);
      if (Array.isArray(data) && data.length > 0) {
        const latest = data[data.length - 1];
        return latest.totalTypoValueLocked || latest.totalValueLocked || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching DefiLlama TVL:', error);
      return 0;
    }
};

export const fetchClankAppWhales = async () => {
  try {
    // ClankApp public API for latest whales - Use cache with stale fallback
    const data = await fetchWithCache('clankapp_whales', 'https://api.clankapp.com/v1/whales', {}, 21600);
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching ClankApp whales:', error);
    return [];
  }
};

export const fetchDefiLlamaProtocols = async () => {
  try {
    const data = await fetchWithCache('defillama_protocols', 'https://api.llama.fi/protocols', {}, 21600);
    return data;
  } catch (error) {
    console.error('Error fetching DefiLlama protocols:', error);
    return [];
  }
};

export interface GlassnodeMetrics {
  sopr?: number;
  netFlow?: number;
  exchangeOutflow?: number;
}

export const fetchGlassnodeMetrics = async (): Promise<GlassnodeMetrics | null> => {
  try {
    if (!GLASSNODE_API_KEY) return null; // silent — key is optional
    const response = await fetch(`https://api.glassnode.com/v1/metrics/indicators/sopr?a=BTC&api_key=${GLASSNODE_API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Glassnode fetch failed (non-critical):', (error as Error).message);
    return null;
  }
};

export const fetchCryptoQuantMacro = async () => {
  const CACHE_KEY = 'cryptoquant_macro_data';
  const TTL = 21600; // 6 hours

  let staleData = null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      staleData = data;
      if (Date.now() - timestamp < TTL * 1000) return data;
    }
  } catch (e) {
    console.warn("Cache parse error:", e);
  }

  try {
    if (!CRYPTOQUANT_API_KEY) return staleData;
    
    const assets = ['btc', 'eth'];
    const results: any = {};

    for (const asset of assets) {
      const inflowUrl = `/api/cryptoquant/v1/${asset}/exchange-flows/inflow?window=hour&limit=24`;
      const outflowUrl = `/api/cryptoquant/v1/${asset}/exchange-flows/outflow?window=hour&limit=24`;
      
      const [inflowRes, outflowRes] = await Promise.all([
        fetch(inflowUrl, { headers: { 'Authorization': `Bearer ${CRYPTOQUANT_API_KEY}` } }).then(r => r.json()),
        fetch(outflowUrl, { headers: { 'Authorization': `Bearer ${CRYPTOQUANT_API_KEY}` } }).then(r => r.json())
      ]);

      results[asset] = {
        inflow: inflowRes.result?.data || [],
        outflow: outflowRes.result?.data || []
      };
    }
    
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: results }));
    return results;
  } catch (error) {
    console.error('Error fetching CryptoQuant flows (using stale data):', error);
    return staleData;
  }
};

export interface CryptoQuantReserves {
  minerOutflow?: number;
}

export const fetchCryptoQuantReserves = async (): Promise<CryptoQuantReserves | null> => {
  return null; // Fallback to widget mock logic
};

export const fetchBitqueryWhales = async () => {
  const CACHE_KEY = 'bitquery_whales_data';
  const TTL = 21600; // 6 hours

  let staleData = null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      staleData = data;
      if (Date.now() - timestamp < TTL * 1000) return data;
    }
  } catch (e) {
    console.warn("Cache parse error:", e);
  }

  try {
    if (!BITQUERY_API_KEY) throw new Error('No Bitquery key');
    // ... REST OF LOGIC ...


    const query = `
      query MyQuery($timeFrom: String!) {
        eth: EVM(dataset: combined, network: eth) {
          Transfers(
            where: {
              Transfer: { AmountInUSD: {gt: 500000} }
              Block: {Time: {after: $timeFrom}}
            }
            limit: {count: 20}
            orderBy: {descending: Block_Time}
          ) {
            Transfer { Amount AmountInUSD Currency { Symbol } Receiver Sender }
            Transaction { Hash }
            Block { Time }
          }
        }
        bsc: EVM(dataset: combined, network: bsc) {
          Transfers(
            where: {
              Transfer: { AmountInUSD: {gt: 500000} }
              Block: {Time: {after: $timeFrom}}
            }
            limit: {count: 15}
            orderBy: {descending: Block_Time}
          ) {
            Transfer { Amount AmountInUSD Currency { Symbol } Receiver Sender }
            Transaction { Hash }
            Block { Time }
          }
        }
        solana: Solana {
          Transfers(
            where: {
              Transfer: { AmountInUSD: {gt: 500000} }
              Block: {Time: {after: $timeFrom}}
            }
            limit: {count: 10}
          ) {
            Transfer { Amount AmountInUSD Currency { Symbol } Receiver Sender }
            Transaction { Signature }
            Block { Time }
          }
        }
      }
    `;

    const yesterday = new Date(Date.now() - 86400000).toISOString();
    
    const response = await fetch('/api/bitquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BITQUERY_API_KEY}`
      },
      body: JSON.stringify({
        query,
        variables: { timeFrom: yesterday }
      })
    });

    const body = await response.json();
    if (!body.data) throw new Error('Bitquery error response');

    const ethTxs = body.data.eth?.Transfers || [];
    const bscTxs = body.data.bsc?.Transfers || [];
    const solTxs = (body.data.solana?.Transfers || []).map((tx: any) => ({
      ...tx,
      Transaction: { Hash: tx.Transaction.Signature }, // Unify ID for table
      _chain: 'SOLANA'
    }));

    const merged = [...ethTxs, ...bscTxs, ...solTxs].sort((a, b) => 
      new Date(b.Block.Time).getTime() - new Date(a.Block.Time).getTime()
    );

    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: merged }));
    return merged;
  } catch (error) {
    console.warn('Bitquery Primary fail. Falling back to Whale Alert.', error);
    
    // Fallback: Whale Alert
    const whaleAlertData = await fetchWhaleAlerts(500000);
    if (whaleAlertData && whaleAlertData.length > 0) {
      // Normalize Whale Alert to match Bitquery structure for UI compatibility
      const normalized = whaleAlertData.map((tx: any) => ({
        Transfer: {
          Amount: tx.amount,
          AmountInUSD: tx.amount_usd,
          Currency: { Symbol: tx.symbol.toUpperCase() },
          Receiver: tx.to?.address || 'Unknown',
          Sender: tx.from?.address || 'Unknown'
        },
        Transaction: { Hash: tx.id },
        Block: { Time: new Date(tx.timestamp * 1000).toISOString() },
        _chain: tx.blockchain.toUpperCase()
      }));
      return normalized;
    }

    // Secondary fallback to cache even if expired
    const expiredCache = localStorage.getItem(CACHE_KEY);
    return expiredCache ? JSON.parse(expiredCache).data : [];
  }
};

export const fetchTheGraphInsights = async () => {
  try {
    if (!THEGRAPH_API_KEY) return null;
    // Example: Fetch Uniswap v3 top transactions (simplified placeholder)
    const url = `/api/thegraph/api/${THEGRAPH_API_KEY}/subgraphs/id/5zvR82QvXY2Cme6H6Cfc3fUv1z8mSnsSpv9U1Yic2YdF`; // Uniswap v3 Arbitrum
    const query = `{
      swaps(first: 5, orderBy: amountUSD, orderDirection: desc) {
        amountUSD
        origin
        sender
      }
    }`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    return data.data?.swaps || [];
  } catch (error) {
    console.error('Error fetching The Graph insights:', error);
    return null;
  }
};

// ─── RSS CRYPTO NEWS FEEDS ──────────────────────────────────────────────────

export interface RSSNewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description: string;
}

const RSS_SOURCES = [
  { url: '/rss/coindesk', name: 'CoinDesk' },
  { url: '/rss/cointelegraph', name: 'Cointelegraph' },
  { url: '/rss/decrypt', name: 'Decrypt' },
];

const parseRSSXml = (xmlText: string, sourceName: string): RSSNewsItem[] => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const items = doc.querySelectorAll('item');
    const results: RSSNewsItem[] = [];

    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent?.trim() || '';
      const link = item.querySelector('link')?.textContent?.trim() || '';
      const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
      const descRaw = item.querySelector('description')?.textContent?.trim() || '';
      // Strip HTML tags from description
      const description = descRaw.replace(/<[^>]*>/g, '').substring(0, 200);

      if (title) {
        results.push({ title, link, pubDate, source: sourceName, description });
      }
    });

    return results;
  } catch (e) {
    console.error(`Failed to parse RSS from ${sourceName}:`, e);
    return [];
  }
};

export const fetchCryptoRSSFeeds = async (): Promise<RSSNewsItem[]> => {
  const CACHE_KEY = 'coinvestopedia_rss_feeds';
  const TTL = 21600 * 1000; // 6 hours in ms

  // Check cache first
  let staleData: RSSNewsItem[] | null = null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      staleData = data;
      if (Date.now() - timestamp < TTL) return data;
    }
  } catch (e) {
    console.warn("RSS cache parse error:", e);
  }

  try {
    const feedPromises = RSS_SOURCES.map(async (src) => {
      try {
        const response = await fetch(src.url);
        if (!response.ok) return [];
        const text = await response.text();
        // Guard: if the response is HTML (SPA fallback), skip it
        if (text.trimStart().startsWith('<!DOCTYPE') || text.trimStart().startsWith('<html')) {
          console.warn(`RSS ${src.name} returned HTML instead of XML, skipping.`);
          return [];
        }
        return parseRSSXml(text, src.name);
      } catch {
        console.warn(`Failed to fetch RSS from ${src.name}`);
        return [];
      }
    });

    const allFeeds = await Promise.all(feedPromises);
    const merged = allFeeds.flat();

    // Sort by publication date (newest first)
    merged.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime() || 0;
      const dateB = new Date(b.pubDate).getTime() || 0;
      return dateB - dateA;
    });

    const result = merged.slice(0, 30); // Top 30 headlines

    // Only cache if we got results
    if (result.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: result }));
      return result;
    }

    // No fresh data — return stale if available
    return staleData || [];
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return staleData || [];
  }
};

// ─── MACRO INTEL APIS (FMP & OPEN EXCHANGE) ───────────────────────────────────

export const fetchMacroIndicators = async () => {
  try {
    try {
      const res = await fetch('/api/market-data');
      if (res.ok) {
        const data = await res.json();
        
        const normalizedMacro: any[] = [];
        
        // 1. Process Yahoo Data (Priority)
        if (data.yahoo && Array.isArray(data.yahoo)) {
          data.yahoo.forEach((y: any) => {
            normalizedMacro.push({
              symbol: y.symbol,
              name: y.name || y.symbol,
              price: y.regularMarketPrice || 0,
              changesPercentage: y.regularMarketChangePercent || 0
            });
          });
        }
        
        // 2. Process FMP Data (Fallback/Supplementary)
        if (data.macro && Array.isArray(data.macro)) {
          data.macro.forEach((m: any) => {
            // Only add if not already present from Yahoo
            if (!normalizedMacro.some(item => item.symbol === m.symbol)) {
              normalizedMacro.push({
                symbol: m.symbol,
                name: m.name,
                price: m.price,
                changesPercentage: m.changesPercentage
              });
            }
          });
        }

        // 3. Add DefiLlama TVL as a macro indicator
        if (data.defi && data.defi.totalTVL) {
          normalizedMacro.push({
            symbol: 'DEFI_TVL',
            name: 'DeFi TVL',
            price: data.defi.totalTVL,
            changesPercentage: 0, // TVL change logic can be added if history is provided
            isCurrency: true
          });
        }

        if (normalizedMacro.length > 0) {
          return normalizedMacro;
        }
      }
    } catch (e) {
      console.warn("Backend /api/market-data unavailable for macro, falling back to direct client fetching...");
    }

    // Direct client fallback
    const normalizedMacro: any[] = [];
    
    // 1. Fetch Yahoo Finance (No Key) - Isolated
    try {
      const yahooResult = await fetchYahooFinanceData(['^TNX', '^VIX', 'GOLD', 'SILVER', 'OIL', 'BTC', 'ETH']);
      if (yahooResult && Array.isArray(yahooResult)) {
        yahooResult.forEach((y: any) => {
          normalizedMacro.push({
            symbol: y.symbol,
            name: y.name || y.symbol,
            price: y.regularMarketPrice || 0,
            changesPercentage: y.regularMarketChangePercent || 0
          });
        });
      }
    } catch (err) {
      console.warn("Yahoo Finance fallback failed:", err);
    }

    // 2. Fetch DefiLlama (Public) - Isolated
    try {
      const defiData = await fetchDefiLlamaTVL();
      if (defiData) {
        normalizedMacro.push({
          symbol: 'DEFI_TVL',
          name: 'DeFi TVL',
          price: defiData,
          changesPercentage: 0,
          isCurrency: true
        });
      }
    } catch (err) {
      console.warn("DefiLlama fallback failed:", err);
    }

    // 3. Fetch FMP if key exists - Isolated
    if (FMP_API_KEY) {
      try {
        const symbols = 'UUP,SPY,QQQ,AAPL,TSLA,NVDA,MSFT,GOOGL';
        const url = `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${FMP_API_KEY}`;
        const fmpData = await fetchWithCache('fmp_macro_quotes', url, {}, 21600);
        if (fmpData && Array.isArray(fmpData)) {
          fmpData.forEach((m: any) => {
            if (!normalizedMacro.some(item => item.symbol === m.symbol)) {
              normalizedMacro.push({
                symbol: m.symbol,
                name: m.name,
                price: m.price,
                changesPercentage: m.changesPercentage
              });
            }
          });
        }
      } catch (err) {
        console.warn("FMP fallback failed:", err);
      }
    }

    if (normalizedMacro.length > 0) return normalizedMacro;
    return null;
  } catch (outerErr) {
    console.error("Critical error in fetchMacroIndicators:", outerErr);
    return null;
  }
};

export const fetchForexRates = async (baseCurrency = 'USD') => {
  try {
    if (!OPEN_EXCHANGE_APP_ID) return null;
    const url = `https://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_APP_ID}&base=${baseCurrency}`;
    // Cache forex rates for 6 hours
    const data = await fetchWithCache(`forex_latest_${baseCurrency}`, url, {}, 21600);
    return data;
  } catch (error) {
    console.error('Error fetching Forex rates:', error);
    return null;
  }
};

export const fetchDuneMetrics = async (queryId: number) => {
  try {
    if (!DUNE_API_KEY) return null;
    const url = `https://api.dune.com/api/v1/query/${queryId}/results`;
    const data = await fetchWithCache(`dune_query_${queryId}`, url, {
      headers: { 'X-Dune-API-Key': DUNE_API_KEY }
    }, 21600); // 6 hour cache
    return data;
  } catch (error) {
    console.error('Error fetching Dune metrics:', error);
    return null;
  }
};

// ─── YAHOO FINANCE & AI ANALYST APIS ─────────────────────────────────────────

export const fetchYahooFinanceData = async (symbols: string[]) => {
  try {
     const symbolsString = symbols.map(s => {
       if (s === 'BTC') return 'BTC-USD';
       if (s === 'ETH') return 'ETH-USD';
       if (s === 'GOLD') return 'GC=F';
       if (s === 'SILVER') return 'SI=F';
       if (s === 'OIL') return 'CL=F';
       if (s === 'DXY') return 'DX-Y.NYB';
       if (s === 'UST10Y') return '^TNX';
       if (s === 'VIX') return '^VIX';
       return s;
    }).join(',');

    const url = `/api/yahoo/v7/finance/spark?symbols=${symbolsString}`;
    const data = await fetchWithCache(`yahoo_quotes_${symbolsString}`, url, {}, 21600);
    
    if (data && data.spark && data.spark.result) {
      return data.spark.result.map((item: any) => {
        const meta = item.response[0]?.meta || {};
        const price = meta.regularMarketPrice || 0;
        const prevClose = meta.chartPreviousClose || 0;
        const changePercent = prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0;
        return {
          symbol: item.symbol,
          regularMarketPrice: price,
          regularMarketChangePercent: changePercent,
          marketCap: 0
        };
      });
    }
    return [];
  } catch (error: any) {
    const sortedSymbols = [...symbols].sort().join(',');
    const cacheKey = `yahoo_quotes_${sortedSymbols}`;
    const stale = localStorage.getItem(cacheKey);
    if (stale) {
      return JSON.parse(stale).data?.quoteResponse?.result || [];
    }
    return [];
  }
};

export const fetchYahooNews = async (symbol: string) => {
  try {
    // Yahoo Finance search endpoint can provide some news links/summaries
    const url = `/api/yahoo/v1/finance/search?q=${symbol}`;
    const data = await fetchWithCache(`yahoo_news_${symbol}`, url, {}, 600); // 10 min cache
    return data.news || [];
  } catch (error) {
    console.error('Error fetching Yahoo News:', error);
    return [];
  }
};

export const generateDynamicAnalystThesis = async (assetSymbol: string, currentPrice: number, change24h: number, newsItems: any[]) => {
  if (!GEMINI_API_KEY) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    // Create a compact news context
    const newsContext = newsItems.length > 0 
      ? newsItems.slice(0, 3).map(n => n.title).join('; ')
      : "No recent news available.";

    const prompt = `
      You are a senior institutional investment analyst at 'Coinvestopedia'.
      Generate a professional, data-driven 2-3 sentence investment thesis for ${assetSymbol}.
      
      Context:
      Price: $${currentPrice}
      24h Change: ${change24h}%
      Recent Headlines: ${newsContext}
      
      Goal: Provide an elite "Desk View" that includes:
      - Short-term sentiment (Constructive/Defensive/Neutral)
      - Key macro or structural catalysts
      - A professional outlook for the next quarter.
      - IMPORTANT: Do NOT use the words "BUY" or "SELL". Use institutional terminology like "OUTPERFORM" or "UNDERWEIGHT".

      Return exactly this JSON format:
      {
        "signal": "OUTPERFORM" | "WATCH" | "NEUTRAL" | "UNDERWEIGHT",
        "thesis": "Thesis text here..."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error(`Error generating thesis for ${assetSymbol}:`, error);
    return null;
  }
};

