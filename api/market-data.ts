type VercelRequest = any;
type VercelResponse = any;

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const COINGECKO_API_KEY = process.env.VITE_COINGECKO_API || process.env.COINGECKO_API || '';
  const FMP_API_KEY = process.env.VITE_FMP_API_KEY || process.env.FMP_API_KEY || '';
  const DUNE_API_KEY = process.env.VITE_DUNE_API_KEY || process.env.DUNE_API_KEY || '';

  try {
    const results = await Promise.allSettled([
      // 1. Fetch Crypto
      fetch(`${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h,7d,30d,1y`, {
        headers: COINGECKO_API_KEY ? { 'x-cg-demo-api-key': COINGECKO_API_KEY } : {}
      }).then(r => r.json()),
      
      // 2. Fetch Macro (FMP)
      FMP_API_KEY 
        ? fetch(`https://financialmodelingprep.com/api/v3/quote/UUP,SPY,QQQ,GLD,SLV,TLT,AAPL,TSLA,NVDA,MSFT,GOOGL?apikey=${FMP_API_KEY}`).then(r => r.json())
        : Promise.resolve([]),

      // 3. Fetch Yahoo (For ^TNX, ^VIX, GC=F, CL=F, DX-Y.NYB, Equities)
      fetch(`https://query1.finance.yahoo.com/v7/finance/spark?symbols=^TNX,^VIX,GC=F,CL=F,DX-Y.NYB,BTC-USD,ETH-USD,SPY,QQQ,NVDA,AAPL,TSLA`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }).then(r => r.json()),

      // 4. Fetch DefiLlama (Global TVL)
      fetch(`https://api.llama.fi/charts`).then(r => r.json()),

      // 5. Fetch Dune (Bitcoin MVRV or similar if query ID known - placeholder for now)
      DUNE_API_KEY 
        ? fetch(`https://api.dune.com/api/v1/query/3454278/results`, { // Example query ID for MVRV
            headers: { 'X-Dune-API-Key': DUNE_API_KEY }
          }).then(r => r.json())
        : Promise.resolve(null)
    ]);

    const cryptoData = results[0].status === 'fulfilled' && Array.isArray(results[0].value) ? results[0].value : [];
    const macroData = results[1].status === 'fulfilled' && Array.isArray(results[1].value) ? results[1].value : [];
    
    // Transform Yahoo spark API data
    let yahooData = [];
    if (results[2].status === 'fulfilled' && results[2].value?.spark?.result) {
      yahooData = results[2].value.spark.result.map((item: any) => {
        const meta = item.response[0]?.meta || {};
        const price = meta.regularMarketPrice || 0;
        const prevClose = meta.chartPreviousClose || 0;
        const changePercent = prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0;
        return {
          symbol: item.symbol,
          regularMarketPrice: price,
          regularMarketChangePercent: changePercent,
          name: item.symbol === '^VIX' ? 'VIX Volatility' : item.symbol === 'GC=F' ? 'Gold' : item.symbol === 'CL=F' ? 'Crude Oil' : item.symbol === 'DX-Y.NYB' ? 'DXY Index' : item.symbol
        };
      });
    }

    const defiData = results[3].status === 'fulfilled' ? results[3].value : null;
    const latestTVL = defiData && Array.isArray(defiData) ? defiData[defiData.length - 1] : null;

    const duneData = results[4].status === 'fulfilled' ? results[4].value : null;

    const responsePayload = {
      crypto: cryptoData,
      macro: macroData,
      yahoo: yahooData,
      defi: {
        totalTVL: latestTVL?.totalTypoValueLocked || latestTVL?.totalValueLocked || 0,
        timestamp: latestTVL?.date || Date.now()
      },
      dune: duneData,
      timestamp: Date.now()
    };

    // Cache globally at the Edge for 6 hours
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=60');
    return res.status(200).json(responsePayload);

  } catch (error) {
    console.error("[market-data] Aggregation error:", error);
    return res.status(500).json({ error: "Failed to aggregate market data." });
  }
}
