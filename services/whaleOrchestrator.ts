// services/whaleOrchestrator.ts
// Orchestrates multi-chain whale transaction ingestion with quota fallback management
// Hardened to use secure Cloudflare proxies

import { quotaManager } from './quotaManager';
import { fetchCryptoQuantMacro } from './onchain';

export interface WhaleTransaction {
  id: string;
  chain: 'BTC' | 'ETH' | 'SOL' | 'BSC' | string;
  from: string;
  to: string;
  amountUSD: number;
  assetSymbol: string;
  amount: string;
  value: string;
  valueNumeric: number;
  amountNumeric: number;
  type: 'inflow' | 'outflow' | 'transfer';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  timestamp: number;
  time: string;
  sourceAPI: string;
}

const SEVERITY_THRESHOLDS = {
  low:     500_000,      // $500K
  medium:  5_000_000,    // $5M
  high:    50_000_000,   // $50M
  extreme: 100_000_000,  // $100M
};

function classifySeverity(usd: number): WhaleTransaction['severity'] {
  if (usd >= SEVERITY_THRESHOLDS.extreme) return 'extreme';
  if (usd >= SEVERITY_THRESHOLDS.high)    return 'high';
  if (usd >= SEVERITY_THRESHOLDS.medium)  return 'medium';
  return 'low';
}

const EXCHANGE_LABELS: Record<string, string> = {
  '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be': 'Binance',
  '0xd551234ae421e3bcba99a0da6d736074f22192ff': 'Binance',
  '0xa910f92acdaf488fa6ef02174fb86208ad7722ba': 'Binance',
  '0x71660c4005ba85c37ccec55d0c4493e66fe775d3': 'Coinbase',
  '0x503828976d22510aad0201ac7ec88293211d23da': 'Coinbase',
};

function classifyFlow(from: string, to: string): WhaleTransaction['type'] {
  const fromIsExchange = !!EXCHANGE_LABELS[from.toLowerCase()];
  const toIsExchange = !!EXCHANGE_LABELS[to.toLowerCase()];
  if (toIsExchange && !fromIsExchange) return 'inflow';
  if (fromIsExchange && !toIsExchange) return 'outflow';
  return 'transfer';
}

function formatUSD(amount: number): string {
  return `$${(amount / 1e6).toFixed(1)}M`;
}

// ── Whale Alert Poller via Proxy ──────────────────────────────────

async function pollWhaleAlert(): Promise<WhaleTransaction[]> {
  const check = quotaManager.canCall('whaleAlert');
  if (!check.allowed) return [];

  const since = Math.floor(Date.now() / 1000) - 300;
  // Proxy handles the key
  const url = `/api/whale-alert/v1/transactions?min_value=500000&start=${since}`;

  try {
    const r = await fetch(url);
    quotaManager.recordCall('whaleAlert');

    if (!r.ok) throw new Error(`${r.status}`);
    const { transactions } = await r.json();

    return (transactions || []).map((tx: any) => {
      const usdValue = tx.amount_usd;
      const symbol = tx.symbol.toUpperCase();
      const amountNum = tx.amount;
      return {
        id: tx.id,
        chain: tx.blockchain.toUpperCase(),
        from: tx.from?.owner || tx.from?.address || 'Unknown',
        to: tx.to?.owner || tx.to?.address || 'Unknown',
        amountUSD: usdValue,
        assetSymbol: symbol,
        amount: `${amountNum.toLocaleString()} ${symbol}`,
        value: formatUSD(usdValue),
        valueNumeric: usdValue,
        amountNumeric: amountNum,
        type: classifyFlow(tx.from?.address ?? '', tx.to?.address ?? ''),
        severity: classifySeverity(usdValue),
        timestamp: tx.timestamp * 1000,
        time: new Date(tx.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceAPI: 'whale-alert',
      };
    });
  } catch (err) {
    console.error('[WhaleAlert] Proxy Error:', err);
    return [];
  }
}

// ── Etherscan Poller via Proxy ──────────────────────────────────

async function pollEtherscanLargeTransfers(): Promise<WhaleTransaction[]> {
  const check = quotaManager.canCall('etherscan');
  if (!check.allowed) return [];

  const minValue = '450000000000000000000'; // 450 ETH
  
  try {
    // Proxy handles the key
    const r = await fetch(
      `/api/etherscan?module=proxy&action=eth_getBlockByNumber&tag=latest&boolean=true`
    );
    quotaManager.recordCall('etherscan');

    const { result } = await r.json();
    const txs = result?.transactions ?? [];

    return txs
      .filter((tx: any) => tx.value && BigInt(tx.value) > BigInt(minValue))
      .slice(0, 10)
      .map((tx: any) => {
        const ethValue = Number(BigInt(tx.value)) / 1e18;
        const usdValue = ethValue * 3400;
        const timestamp = Date.now();
        return {
          id: tx.hash,
          chain: 'ETH',
          from: tx.from,
          to: tx.to || 'Unknown',
          amountUSD: usdValue,
          assetSymbol: 'ETH',
          amount: `${ethValue.toFixed(2)} ETH`,
          value: formatUSD(usdValue),
          valueNumeric: usdValue,
          amountNumeric: ethValue,
          type: classifyFlow(tx.from, tx.to || ''),
          severity: classifySeverity(usdValue),
          timestamp: timestamp,
          time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sourceAPI: 'etherscan',
        };
      });
  } catch (err) {
    console.error('[Etherscan] Proxy Error:', err);
    return [];
  }
}

// ── Mempool BTC (Public API) ─────────────────────────────────────

async function pollMempoolLargeTx(): Promise<WhaleTransaction[]> {
  try {
    const r = await fetch('https://mempool.space/api/mempool/recent');
    const txs: any[] = await r.json();
    const BTC_PRICE = 64_000;

    return txs
      .filter(tx => (tx.value / 1e8) * BTC_PRICE > 100_000)
      .slice(0, 15)
      .map(tx => {
        const btcValue = tx.value / 1e8;
        const usdValue = btcValue * BTC_PRICE;
        const timestamp = Date.now();
        return {
          id: tx.txid,
          chain: 'BTC',
          from: 'Unknown (BTC)',
          to: 'Unknown (BTC)',
          amountUSD: usdValue,
          assetSymbol: 'BTC',
          amount: `${btcValue.toFixed(2)} BTC`,
          value: formatUSD(usdValue),
          valueNumeric: usdValue,
          amountNumeric: btcValue,
          type: 'transfer' as const,
          severity: classifySeverity(usdValue),
          timestamp: timestamp,
          time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sourceAPI: 'mempool.space',
        };
      });
  } catch (err) {
    console.error('[Mempool] Error:', err);
    return [];
  }
}

// pollClankApp removed — api.clankapp.com is permanently offline (ERR_NAME_NOT_RESOLVED)

// ── Main Orchestrator ─────────────────────────────────────────────

export interface OrchestratorUpdate {
  txs: WhaleTransaction[];
  macroStats: any;
}

export class WhaleOrchestrator {
  private buffer: WhaleTransaction[] = [];
  private macroStats: any = null;
  private timers: ReturnType<typeof setInterval>[] = [];
  private onUpdate: (data: OrchestratorUpdate) => void;

  constructor(
    _unused_config: any, // Kept for signature compatibility
    onUpdate: (data: OrchestratorUpdate) => void
  ) {
    this.onUpdate = onUpdate;
  }

  start() {
    this.stop();

    // Ingest loops
    this.timers.push(setInterval(() => this.ingest(pollMempoolLargeTx), 30_000));
    this.timers.push(setInterval(() => this.ingest(pollWhaleAlert), 5 * 60 * 1000));
    // ClankApp removed — domain is permanently offline (ERR_NAME_NOT_RESOLVED)
    this.timers.push(setInterval(() => this.ingest(pollEtherscanLargeTransfers), 60_000));
    this.timers.push(setInterval(() => this.ingestMacroData(), 6 * 3600 * 1000));

    // Initial fetches
    const initialFetches = [
      this.ingest(pollMempoolLargeTx),
      this.ingest(pollWhaleAlert),
      this.ingest(pollEtherscanLargeTransfers),
      // ClankApp removed — domain is permanently offline
      this.ingestMacroData()
    ];

    Promise.allSettled(initialFetches).then(() => {
      if (this.buffer.length === 0) {
        // Fallback mock data if all else fails
        const now = Date.now();
        this.buffer = [
          {
            id: 'mock-1', chain: 'BTC', from: 'Unknown (BTC)', to: 'Binance',
            amountUSD: 145000000, assetSymbol: 'BTC', amount: '2,265 BTC', value: '$145.0M', valueNumeric: 145000000, amountNumeric: 2265,
            type: 'inflow', severity: 'extreme', timestamp: now - 180000, time: new Date(now - 180000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sourceAPI: 'fallback'
          }
        ];
      }
      this.emitUpdate();
    });
  }

  stop() {
    this.timers.forEach(clearInterval);
    this.timers = [];
  }

  private async ingest(fetchFn: () => Promise<WhaleTransaction[]>) {
    const newTxs = await fetchFn();
    if (!newTxs.length) return;

    const existingIds = new Set(this.buffer.map(t => t.id));
    const novel = newTxs.filter(t => !existingIds.has(t.id));
    
    if (!novel.length) return;

    this.buffer = [...novel, ...this.buffer]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 200);

    this.emitUpdate();
  }

  private async ingestMacroData() {
    const check = quotaManager.canCall('cryptoQuant');
    if (!check.allowed) {
      this.emitUpdate();
      return;
    }

    try {
      quotaManager.recordCall('cryptoQuant');
      const stats = await fetchCryptoQuantMacro();
      if (stats) this.macroStats = stats;
    } catch (e) {
      console.error('Failed to ingest macro data:', e);
    }
    
    this.emitUpdate();
  }

  private emitUpdate() {
    this.onUpdate({
      txs: [...this.buffer],
      macroStats: this.macroStats
    });
  }

  getQuotaStatus() {
    return quotaManager.getUsageReport();
  }
}
