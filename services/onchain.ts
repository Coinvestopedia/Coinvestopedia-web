import { fetchWithCache } from './base';

/**
 * Coinvestopedia On-Chain Service
 * Uses secure Cloudflare Proxies for sensitive institutional data
 */

export const fetchWhaleAlerts = async (min_value = 500000) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000) - 86400; // last 24h
    // Use proxy
    const response = await fetch(`/api/whale-alert/v1/transactions?min_value=${min_value}&start=${timestamp}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.transactions || [];
  } catch (error) {
    return [];
  }
};

export const fetchMempoolTxs = async () => {
  try {
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

/** @deprecated ClankApp domain is permanently offline (ERR_NAME_NOT_RESOLVED) */
export const fetchClankAppWhales = async () => {
  return [];
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
    // Use proxy
    const response = await fetch(`/api/glassnode/v1/metrics/indicators/sopr?a=BTC`);
    if (!response.ok) return null;
    
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      if (import.meta.env.DEV) {
        console.debug('[Glassnode] Proxy unavailable locally (returned HTML). Skipping.');
      }
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (!import.meta.env.DEV) {
      console.warn('Glassnode fetch failed:', (error as Error).message);
    }
    return null;
  }
};

export const fetchCryptoQuantMacro = async () => {
  const CACHE_KEY = 'cryptoquant_macro_data';
  const TTL = 21600;

  let staleData = null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      staleData = data;
      if (Date.now() - timestamp < TTL * 1000) return data;
    }
  } catch (e) { console.warn("Cache parse error:", e); }

  try {
    const assets = ['btc', 'eth'];
    const results: any = {};
    for (const asset of assets) {
      // Already uses proxy /api/cryptoquant/*
      const inflowUrl = `/api/cryptoquant/v1/${asset}/exchange-flows/inflow?window=hour&limit=24`;
      const outflowUrl = `/api/cryptoquant/v1/${asset}/exchange-flows/outflow?window=hour&limit=24`;
      const [inflowRes, outflowRes] = await Promise.all([
        fetch(inflowUrl).then(r => r.json()),
        fetch(outflowUrl).then(r => r.json())
      ]);
      results[asset] = { inflow: inflowRes.result?.data || [], outflow: outflowRes.result?.data || [] };
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: results }));
    return results;
  } catch (error) {
    console.error('Error fetching CryptoQuant flows:', error);
    return staleData;
  }
};

/**
 * Fetches CryptoQuant Miner Reserves/Outflow for institutional sentiment
 */
export const fetchCryptoQuantReserves = async () => {
  const CACHE_KEY = 'cryptoquant_reserves_data';
  const TTL = 21600;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < TTL * 1000) return data;
    }
  } catch (e) { /* ignore */ }

  try {
    // Fetch miner outflow as a proxy for reserve pressure
    const response = await fetch(`/api/cryptoquant/v1/btc/miner-flows/outflow?window=hour&limit=24`);
    
    // Validate that we actually got JSON back to prevent parsing errors
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (import.meta.env.DEV) {
        console.warn('CryptoQuant API returned non-JSON response. Likely WAF block or missing API key.');
      }
      return { minerOutflow: 50 }; // Fallback to neutral
    }

    const body = await response.json();
    
    // Calculate a simple average or latest value for minerOutflow
    const dataPoints = body.result?.data || [];
    const latestOutflow = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].value : 50;

    const result = { minerOutflow: latestOutflow };
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: result }));
    return result;
  } catch (error) {
    console.error('Error fetching CryptoQuant reserves:', error);
    return { minerOutflow: 50 }; // Fallback to neutral
  }
};

export const fetchBitqueryWhales = async () => {
  const CACHE_KEY = 'bitquery_whales_data';
  const TTL = 21600;
  let staleData = null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      staleData = data;
      if (Date.now() - timestamp < TTL * 1000) return data;
    }
  } catch (e) { console.warn("Cache parse error:", e); }

  try {
    const query = `
      query MyQuery($timeFrom: String!) {
        eth: EVM(dataset: combined, network: eth) {
          Transfers(where: { Transfer: { AmountInUSD: {gt: 500000} }, Block: {Time: {after: $timeFrom}} }, limit: {count: 20}, orderBy: {descending: Block_Time}) {
            Transfer { Amount AmountInUSD Currency { Symbol } Receiver Sender }
            Transaction { Hash }
            Block { Time }
          }
        }
        bsc: EVM(dataset: combined, network: bsc) {
          Transfers(where: { Transfer: { AmountInUSD: {gt: 500000} }, Block: {Time: {after: $timeFrom}} }, limit: {count: 15}, orderBy: {descending: Block_Time}) {
            Transfer { Amount AmountInUSD Currency { Symbol } Receiver Sender }
            Transaction { Hash }
            Block { Time }
          }
        }
        solana: Solana {
          Transfers(where: { Transfer: { AmountInUSD: {gt: 500000} }, Block: {Time: {after: $timeFrom}} }, limit: {count: 10}) {
            Transfer { Amount AmountInUSD Currency { Symbol } Receiver Sender }
            Transaction { Signature }
            Block { Time }
          }
        }
      }
    `;
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    // Already uses proxy /api/bitquery
    const response = await fetch('/api/bitquery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { timeFrom: yesterday } })
    });
    const body = await response.json();
    if (!body.data) throw new Error('Bitquery error response');
    const ethTxs = body.data.eth?.Transfers || [];
    const bscTxs = body.data.bsc?.Transfers || [];
    const solTxs = (body.data.solana?.Transfers || []).map((tx: any) => ({
      ...tx,
      Transaction: { Hash: tx.Transaction.Signature },
      _chain: 'SOLANA'
    }));
    const merged = [...ethTxs, ...bscTxs, ...solTxs].sort((a, b) => 
      new Date(b.Block.Time).getTime() - new Date(a.Block.Time).getTime()
    );
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: merged }));
    return merged;
  } catch (error) {
    console.warn('Bitquery fail. Falling back to Whale Alert.', error);
    const whaleAlertData = await fetchWhaleAlerts(500000);
    if (whaleAlertData && whaleAlertData.length > 0) {
      return whaleAlertData.map((tx: any) => ({
        Transfer: { Amount: tx.amount, AmountInUSD: tx.amount_usd, Currency: { Symbol: tx.symbol.toUpperCase() }, Receiver: tx.to?.address || 'Unknown', Sender: tx.from?.address || 'Unknown' },
        Transaction: { Hash: tx.id },
        Block: { Time: new Date(tx.timestamp * 1000).toISOString() },
        _chain: tx.blockchain.toUpperCase()
      }));
    }
    return staleData || [];
  }
};

export const fetchTheGraphInsights = async () => {
  try {
    const query = `{ swaps(first: 5, orderBy: amountUSD, orderDirection: desc) { amountUSD origin sender } }`;
    // Already uses proxy /api/thegraph/*
    const res = await fetch(`/api/thegraph/subgraphs/id/5zvR82QvXY2Cme6H6Cfc3fUv1z8mSnsSpv9U1Yic2YdF`, { 
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

export const fetchDuneMetrics = async (queryId: number) => {
  try {
    // Use proxy
    const url = `/api/dune/api/v1/query/${queryId}/results`;
    const data = await fetchWithCache(`dune_query_${queryId}`, url, {}, 21600);
    return data;
  } catch (error) {
    console.error('Error fetching Dune metrics:', error);
    return null;
  }
};
