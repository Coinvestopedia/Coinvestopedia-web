Free APIs for Coinvestopedia — Full Data Coverage
Organized by data type, with rate limits, auth requirements, and exactly what each API feeds on your site.

Crypto Market Data
CoinGecko (Free Tier — No Key Required for Basic)
Base URL: https://api.coingecko.com/api/v3
Rate limit: 30 calls/min, no API key needed
EndpointDataYour Page/coins/marketsPrice, 24h%, 7d%, market cap, volume, image URLsComparison table, ticker strip/coins/{id}Full metadata, links, description, categoriesAsset detail pages/coins/{id}/market_chartOHLCV history up to 365 daysOverlay charts/coins/{id}/ohlcCandlestick dataTradingView-style charts/globalTotal crypto market cap, BTC dominance, ETH dominanceMacro strip/coins/{id}/contract/{address}On-chain token dataDeFi section/exchange_ratesBTC vs 32 currenciesCurrency converter
Free tier limit: 10,000 calls/month. Register for a free Demo API key at coingecko.com/en/api to get 30 calls/min guaranteed and unlock /pro-api endpoints.

CoinCap (Fully Free, No Key)
Base URL: https://api.coincap.io/v2
Rate limit: 200 calls/min free, no key
EndpointData/assetsTop 2,000 coins, price, market cap, supply/assets/{id}/historyHistorical prices — unlimited range/ratesReal-time exchange rateswss://ws.coincap.io/prices?assets=bitcoin,ethereumWebSocket — real-time price stream
CoinCap's WebSocket is the best free option for live price updates on your ticker strip without polling.

Binance (Free, No Key for Public Endpoints)
Base URL: https://api.binance.com/api/v3
Rate limit: 1,200 requests/min
EndpointData/ticker/24hr24h price, volume, high/low for all pairs/klinesOHLCV candlestick data, any interval/ticker/priceReal-time spot price, all pairswss://stream.binance.com:9443/wsWebSocket streams — trades, order book, kline
Best source for high-frequency price accuracy and candlestick data. Covers 1,500+ trading pairs.

Traditional Assets — Equities, ETFs, Indices
Yahoo Finance (Unofficial, Free, No Key)
Two reliable wrapper libraries that abstract the unofficial API:
bash# Server-side (Node/Next.js API route)
npm install yahoo-finance2
jsimport yahooFinance from 'yahoo-finance2'

// Single quote
await yahooFinance.quote('SPY')
// Returns: price, 52w high/low, PE ratio, EPS, market cap, beta, dividend yield

// Historical OHLCV
await yahooFinance.historical('AAPL', { period1: '2024-01-01' })

// Batch quotes
await yahooFinance.quote(['SPY', 'QQQ', 'NVDA', 'AAPL', 'GLD', 'TLT'])
```

**Covers:** All US equities, ETFs, indices (^GSPC, ^IXIC, ^DJI, ^VIX), mutual funds, Canadian/EU stocks.
**Limitation:** Unofficial — wrap in try/catch with a fallback. Has been stable for years but not guaranteed.

---

### Alpha Vantage (Free Tier — API Key Required)
**Register:** `alphavantage.co` — instant free key
**Rate limit:** 25 calls/day free, 500 calls/day with free email registration

| Function | Data |
|---|---|
| `TIME_SERIES_DAILY` | Daily OHLCV, 20+ years history |
| `GLOBAL_QUOTE` | Real-time quote, change%, volume |
| `SYMBOL_SEARCH` | Search tickers by keyword |
| `OVERVIEW` | Fundamentals: PE, EPS, market cap, sector |
| `EARNINGS` | Quarterly/annual EPS history |

25 calls/day is tight for a production site — use it as a secondary fallback or for fundamentals data that refreshes once daily.

---

### Polygon.io (Free Tier — API Key Required)
**Register:** `polygon.io` — free tier available
**Rate limit:** 5 calls/min free, unlimited with $29/mo plan

| Endpoint | Data |
|---|---|
| `/v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{from}/{to}` | OHLCV bars, any timeframe |
| `/v2/snapshot/locale/us/markets/stocks/tickers` | Real-time snapshot, all US stocks |
| `/v1/meta/symbols/{ticker}/company` | Company details, SIC, description |
| `/v2/reference/news` | Financial news by ticker |

Free tier has **15-min delayed** data. Real-time requires paid. Good for historical and fundamentals.

---

## Commodities & Forex

### Metals-API (Free Tier)
**Register:** `metals-api.com`
**Free limit:** 50 requests/month on free plan

Covers: XAU (Gold), XAG (Silver), XPT (Platinum), XPD (Palladium), XCU (Copper) — priced in USD and 170 other currencies.

Better free alternative for gold/silver:

### GoldAPI.io (Free Tier)
**Register:** `goldapi.io`
**Free limit:** 100 requests/month
```
GET https://www.goldapi.io/api/XAU/USD
Headers: x-access-token: YOUR_KEY
Returns: price, open, high, low, change, change_pct

ExchangeRate-API (Free, No Key)
Base URL: https://open.er-api.com/v6/latest/USD
Rate limit: 1,500 requests/month free, no key required
Covers 160+ currencies. Use for DXY proxy (USD vs basket) and currency conversion tools.

Open Exchange Rates (Free Tier)
Register: openexchangerates.org
Free limit: 1,000 requests/month
More accurate for forex rates. Hourly updates on free plan.

Macro & Economic Data
FRED API (Federal Reserve — Completely Free)
Register: fred.stlouisfed.org/docs/api — free API key
Rate limit: 120 requests/min, no monthly cap
This is the most important free API for macro data. Every major economic indicator:
Series IDDataFEDFUNDSFederal Funds Rate (daily)DGS1010-Year Treasury YieldDGS22-Year Treasury YieldT10Y2YYield curve spread (10Y–2Y)CPIAUCSLCPI Inflation (monthly)M2SLM2 Money SupplyDTWEXBGSUS Dollar Index (DXY proxy)VIXCLSVIX Volatility Index (daily)UNRATEUnemployment RateGDPUS GDP (quarterly)BAMLH0A0HYM2High Yield Credit SpreadT10YIE10-Year Breakeven Inflation Rate
jsGET https://api.stlouisfed.org/fred/series/observations
  ?series_id=DGS10
  &api_key=YOUR_KEY
  &file_type=json
  &limit=365
  &sort_order=desc
```

FRED should power your entire macro panel — yield curve, M2, inflation, Fed rate.

---

### World Bank API (Free, No Key)
**Base URL:** `https://api.worldbank.org/v2`

Global GDP, inflation, debt-to-GDP for 200+ countries. Use for your global liquidity/macro section.

---

## On-Chain & DeFi Data

### DeFiLlama (Free, No Key)
**Base URL:** `https://api.llama.fi`
**Rate limit:** Generous, no documented cap

| Endpoint | Data |
|---|---|
| `/protocols` | TVL for all DeFi protocols |
| `/tvl/{protocol}` | Historical TVL chart data |
| `/chains` | TVL by blockchain (ETH, SOL, BSC...) |
| `https://yields.llama.fi/pools` | DeFi yield rates, APY |
| `https://stablecoins.llama.fi/stablecoins` | Stablecoin market cap, peg status |
| `https://bridges.llama.fi/bridges` | Cross-chain bridge volume |

Powers: DeFi TVL charts, yield comparison, chain dominance, stablecoin tracker.

---

### Etherscan / BSCScan / Solscan (Free Tier)
**Register:** `etherscan.io/apis` — free key
**Rate limit:** 5 calls/sec, no monthly cap on free tier

| Endpoint | Data |
|---|---|
| `?module=stats&action=ethsupply` | ETH circulating supply |
| `?module=gastracker&action=gasoracle` | Current gas prices (slow/standard/fast) |
| `?module=stats&action=ethprice` | ETH/USD and ETH/BTC price |
| `?module=account&action=txlist` | Wallet transaction history |

Use for gas tracker widget, on-chain activity indicators.

---

### Blockchain.info (Bitcoin — Free, No Key)
**Base URL:** `https://blockchain.info`

| Endpoint | Data |
|---|---|
| `/stats?format=json` | BTC hashrate, difficulty, mempool size, fees |
| `/q/marketcap` | BTC market cap |
| `/q/totalbc` | Total BTC in circulation |
| `/blocks?format=json` | Latest blocks |

Powers: Bitcoin network health panel, hash rate chart, mempool congestion.

---

## News & Sentiment

### CryptoPanic (Free Tier — API Key Required)
**Register:** `cryptopanic.com/developers/api`
**Free limit:** Public feed only
```
GET https://cryptopanic.com/api/v1/posts/
  ?auth_token=YOUR_KEY
  &currencies=BTC,ETH
  &filter=hot
```

Returns: headlines, source, sentiment tag (bullish/bearish), vote counts.

---

### NewsData.io (Free Tier)
**Register:** `newsdata.io`
**Free limit:** 200 requests/day, 10 results per call

Covers crypto and financial news. Use `?category=business&q=bitcoin` for filtered feeds.

---

### Alternative.me Fear & Greed Index (Free, No Key)
```
GET https://api.alternative.me/fng/?limit=30
```
Returns daily Fear & Greed Index (0–100) with historical values. No key, no rate limit documented. Use for your sentiment widget.

---

## Complete API Stack Summary

| Data Category | Primary API | Fallback | Key Required |
|---|---|---|---|
| Crypto prices (real-time) | CoinCap WebSocket | Binance WebSocket | No |
| Crypto prices (REST) | CoinGecko `/markets` | CoinCap REST | No |
| Crypto history/OHLCV | CoinGecko `/market_chart` | Binance `/klines` | No |
| Crypto metadata/icons | CoinGecko `/coins/markets` | CoinCap | No |
| DeFi TVL | DeFiLlama | — | No |
| US Equities/ETFs | Yahoo Finance (yahoo-finance2) | Polygon.io | No / Yes |
| Equity fundamentals | Alpha Vantage `OVERVIEW` | Polygon.io | Yes (free) |
| Gold / Silver | GoldAPI.io | Metals-API | Yes (free) |
| Forex / DXY proxy | ExchangeRate-API | Open Exchange Rates | No |
| Macro (Fed, CPI, M2, VIX) | FRED API | World Bank | Yes (free) |
| Yield curve (10Y, 2Y) | FRED API | — | Yes (free) |
| Bitcoin on-chain | Blockchain.info | Etherscan | No |
| Ethereum on-chain | Etherscan | — | Yes (free) |
| Gas tracker | Etherscan | — | Yes (free) |
| Crypto news/sentiment | CryptoPanic | NewsData.io | Yes (free) |
| Fear & Greed Index | Alternative.me | — | No |

---

## Architecture Recommendation



API keys never exposed to client
Implement caching at edge (stale-while-revalidate): prices at 15s, fundamentals at 1h, macro at 24h
Single retry/fallback logic per data type
Combine multiple API responses into one payload per page

ts// /api/prices.ts — single endpoint, browser calls this
export default async function handler() {
  const [crypto, equities, macro] = await Promise.all([
    fetchCoinGecko(),   // 30s cache
    fetchYahooFinance(), // 60s cache
    fetchFRED(),         // 1h cache
  ])
  return Response.json({ crypto, equities, macro })
}
This keeps your frontend clean, your keys secure, and your rate limits pooled server-side rather than per-user.