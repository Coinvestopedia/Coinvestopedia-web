import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Modal } from './Modal';
import { TrendingUp, TrendingDown, Loader2, AlertCircle } from 'lucide-react';

type MetricKey = 'defiTvl' | 'stablecoinMktCap' | 'ethStakingRatio' | 'dexVolume24h';

interface TrendChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricKey: MetricKey | null;
  currentValue?: string;
  currentChange?: string;
}

interface DataPoint {
  date: string;
  timestamp: number;
  value: number;
}

const METRIC_CONFIG: Record<MetricKey, {
  title: string;
  color: string;
  gradientId: string;
  unit: string;
  formatValue: (v: number) => string;
  formatAxis: (v: number) => string;
}> = {
  defiTvl: {
    title: 'Total Value Locked (DeFi)',
    color: '#10B981',
    gradientId: 'tvlGradient',
    unit: 'USD',
    formatValue: (v) => `$${(v / 1e9).toFixed(2)}B`,
    formatAxis: (v) => `$${(v / 1e9).toFixed(0)}B`,
  },
  stablecoinMktCap: {
    title: 'Stablecoin Market Cap',
    color: '#3B82F6',
    gradientId: 'stableGradient',
    unit: 'USD',
    formatValue: (v) => `$${(v / 1e9).toFixed(2)}B`,
    formatAxis: (v) => `$${(v / 1e9).toFixed(0)}B`,
  },
  ethStakingRatio: {
    title: 'ETH Staking Ratio',
    color: '#8B5CF6',
    gradientId: 'stakingGradient',
    unit: '%',
    formatValue: (v) => `${v.toFixed(2)}%`,
    formatAxis: (v) => `${v.toFixed(0)}%`,
  },
  dexVolume24h: {
    title: 'DEX Volume (24h)',
    color: '#F59E0B',
    gradientId: 'dexGradient',
    unit: 'USD',
    formatValue: (v) => `$${(v / 1e9).toFixed(2)}B`,
    formatAxis: (v) => `$${(v / 1e9).toFixed(0)}B`,
  },
};

const RANGE_OPTIONS = [
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '180D', days: 180 },
  { label: '1Y', days: 365 },
] as const;

async function fetchDefiTvl(): Promise<DataPoint[]> {
  const res = await fetch('https://api.llama.fi/v2/historicalChainTvl');
  const data = await res.json();
  return data.map((d: { date: number; tvl: number }) => ({
    date: new Date(d.date * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
    timestamp: d.date,
    value: d.tvl,
  }));
}

async function fetchStablecoinMktCap(): Promise<DataPoint[]> {
  const res = await fetch('https://stablecoins.llama.fi/stablecoincharts/all');
  const data = await res.json();
  return data.map((d: { date: string; totalCirculatingUSD: { peggedUSD?: number } }) => ({
    date: new Date(Number(d.date) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
    timestamp: Number(d.date),
    value: d.totalCirculatingUSD?.peggedUSD || 0,
  }));
}

async function fetchEthStakingRatio(): Promise<DataPoint[]> {
  const res = await fetch('https://api.llama.fi/protocol/lido');
  const data = await res.json();
  const ethPriceRes = await fetch('https://coins.llama.fi/prices/current/coingecko:ethereum');
  const ethPriceData = await ethPriceRes.json();
  const ethPrice = ethPriceData.coins['coingecko:ethereum']?.price || 3000;
  const totalCirculating = 120_400_000;

  return (data.tvl || []).map((d: { date: number; totalLiquidityUSD: number }) => {
    const lidoStakedEth = d.totalLiquidityUSD / ethPrice;
    const totalStakedEth = lidoStakedEth / 0.285;
    const ratio = (totalStakedEth / totalCirculating) * 100;
    return {
      date: new Date(d.date * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
      timestamp: d.date,
      value: ratio,
    };
  });
}

async function fetchDexVolume(): Promise<DataPoint[]> {
  const res = await fetch('https://api.llama.fi/overview/dexs');
  const data = await res.json();

  if (data.totalDataChart && Array.isArray(data.totalDataChart)) {
    return data.totalDataChart.map((d: [number, number]) => ({
      date: new Date(d[0] * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
      timestamp: d[0],
      value: d[1],
    }));
  }
  return [];
}

const FETCHERS: Record<MetricKey, () => Promise<DataPoint[]>> = {
  defiTvl: fetchDefiTvl,
  stablecoinMktCap: fetchStablecoinMktCap,
  ethStakingRatio: fetchEthStakingRatio,
  dexVolume24h: fetchDexVolume,
};

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  formatValue: (v: number) => string;
  color: string;
}> = ({ active, payload, label, formatValue, color }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface/95 backdrop-blur-md border border-border rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-text-muted text-xs mb-1 font-medium">{label}</p>
      <p className="text-base font-bold font-mono" style={{ color }}>
        {formatValue(payload[0].value)}
      </p>
    </div>
  );
};

const TrendChartModalComponent: React.FC<TrendChartModalProps> = ({
  isOpen,
  onClose,
  metricKey,
  currentValue,
  currentChange,
}) => {
  const [allData, setAllData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState(90);

  const config = metricKey ? METRIC_CONFIG[metricKey] : null;

  useEffect(() => {
    if (!isOpen || !metricKey) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    FETCHERS[metricKey]()
      .then((data) => {
        if (!cancelled) setAllData(data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load historical data. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isOpen, metricKey]);

  const filteredData = useMemo(() => {
    if (!allData.length) return [];
    const cutoff = Date.now() / 1000 - range * 86400;
    return allData.filter((d) => d.timestamp >= cutoff);
  }, [allData, range]);

  const trendStats = useMemo(() => {
    if (filteredData.length < 2) return null;
    const first = filteredData[0].value;
    const last = filteredData[filteredData.length - 1].value;
    const change = ((last - first) / first) * 100;
    const min = Math.min(...filteredData.map((d) => d.value));
    const max = Math.max(...filteredData.map((d) => d.value));
    return { change, min, max, first, last };
  }, [filteredData]);

  const handleClose = useCallback(() => {
    onClose();
    setAllData([]);
    setError(null);
    setRange(90);
  }, [onClose]);

  if (!config) return null;

  const isPositive = trendStats ? trendStats.change >= 0 : currentChange?.startsWith('+');

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={config.title} size="lg">
      <div className="space-y-5">
        {/* Header stats row */}
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Current</p>
            <p className="text-2xl font-bold font-mono text-text">{currentValue || '—'}</p>
          </div>
          {currentChange && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
              isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {currentChange} (24h)
            </div>
          )}
          {trendStats && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ml-auto ${
              trendStats.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {trendStats.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trendStats.change >= 0 ? '+' : ''}{trendStats.change.toFixed(1)}% ({RANGE_OPTIONS.find(r => r.days === range)?.label})
            </div>
          )}
        </div>

        {/* Range selector */}
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              onClick={() => setRange(opt.days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                range === opt.days
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-surface hover:bg-surface-hover border border-border text-text-muted hover:text-text'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Chart area */}
        <div className="h-[280px] sm:h-[320px] w-full rounded-xl bg-background/50 border border-border p-3 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/60 backdrop-blur-sm rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="animate-spin text-primary" />
                <p className="text-sm text-text-muted font-medium">Loading historical data...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <AlertCircle size={28} className="text-red-400" />
                <p className="text-sm text-text-muted">{error}</p>
                <button
                  onClick={() => {
                    if (metricKey) {
                      setLoading(true);
                      setError(null);
                      FETCHERS[metricKey]()
                        .then(setAllData)
                        .catch(() => setError('Failed to load historical data.'))
                        .finally(() => setLoading(false));
                    }
                  }}
                  className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filteredData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={config.color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #27272a)" strokeOpacity={0.5} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={50}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={config.formatAxis}
                  domain={['auto', 'auto']}
                  width={60}
                />
                <Tooltip
                  content={<CustomTooltip formatValue={config.formatValue} color={config.color} />}
                  cursor={{ stroke: config.color, strokeWidth: 1, strokeDasharray: '4 4', strokeOpacity: 0.5 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={config.color}
                  strokeWidth={2}
                  fill={`url(#${config.gradientId})`}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Summary stats */}
        {trendStats && config && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface rounded-lg p-3 border border-border text-center">
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-1">Period Low</p>
              <p className="text-sm font-bold font-mono text-text">{config.formatValue(trendStats.min)}</p>
            </div>
            <div className="bg-surface rounded-lg p-3 border border-border text-center">
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-1">Period High</p>
              <p className="text-sm font-bold font-mono text-text">{config.formatValue(trendStats.max)}</p>
            </div>
            <div className="bg-surface rounded-lg p-3 border border-border text-center">
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-1">Period Change</p>
              <p className={`text-sm font-bold font-mono ${trendStats.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {trendStats.change >= 0 ? '+' : ''}{trendStats.change.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        <p className="text-[10px] text-text-muted/60 text-center">
          Data sourced from DefiLlama • Updated in real-time
        </p>
      </div>
    </Modal>
  );
};

export const TrendChartModal = React.memo(TrendChartModalComponent);
TrendChartModal.displayName = 'TrendChartModal';
