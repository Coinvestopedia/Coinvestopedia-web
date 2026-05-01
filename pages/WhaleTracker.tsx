import { PageMeta } from '../components/PageMeta';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Button } from '../components/Button';
import Table, { Column } from '../components/Table';
import {
  Search, Sparkles, ExternalLink, X, Tag, Edit2, Save,
  Copy, TrendingUp, TrendingDown, ArrowUpRight,
  ArrowDownRight, Activity, Globe, Zap, Eye, Clock, BarChart2,
  Info, Target, Shield, PieChart, DollarSign
} from 'lucide-react';
import { Modal } from '../components/Modal';

import { analyzeAssetMovement, InsightResult } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';
import { PulseIcon } from '../components/AnimatedIcons';

import { WhaleOrchestrator, WhaleTransaction } from '../services/whaleOrchestrator';
import { PageRoute } from '../types';


// ─── Types ────────────────────────────────────────────────────────────────────

// Replaced by WhaleTransaction from services/whaleOrchestrator

// ─── Stat Card ────────────────────────────────────────────────────────────────

// Fallback data for Simulator Mode
const FALLBACK_FLOW_DATA = [
  { time: '00:00', inflow: 120, outflow: 80 },
  { time: '03:00', inflow: 95, outflow: 110 },
  { time: '06:00', inflow: 150, outflow: 90 },
  { time: '09:00', inflow: 180, outflow: 120 },
  { time: '12:00', inflow: 140, outflow: 200 },
  { time: '15:00', inflow: 220, outflow: 150 },
  { time: '18:00', inflow: 250, outflow: 180 },
  { time: '21:00', inflow: 300, outflow: 210 },
];

const FALLBACK_ASSET_DATA = [
  { asset: 'BTC', inflow: 450, outflow: 320, color: '#F7931A' },
  { asset: 'ETH', inflow: 280, outflow: 390, color: '#627EEA' },
  { asset: 'SOL', inflow: 190, outflow: 120, color: '#14F195' },
  { asset: 'BSC', inflow: 110, outflow: 140, color: '#F3BA2F' },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: string;
  sub: string;
  direction?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}> = ({ label, value, sub, direction = 'neutral', icon }) => {
  const colorClass = direction === 'up' ? 'text-emerald-400' : direction === 'down' ? 'text-red-400' : 'text-primary';
  return (
    <div className="leather-card rounded-xl p-4 lg:p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">{label}</span>
        <div className={`p-1.5 rounded-lg bg-current/10 ${colorClass}`} style={{ backgroundColor: 'transparent' }}>
          {icon}
        </div>
      </div>
      <div>
        <div className={`text-2xl font-bold font-mono ${colorClass}`}>{value}</div>
        <div className="text-xs text-text-muted mt-0.5">{sub}</div>
      </div>
    </div>
  );
};

// ─── Address Cell ─────────────────────────────────────────────────────────────

const AddressCell: React.FC<{ address: string; labels?: Record<string, string> }> = ({ address, labels = {} }) => {
  const label = labels[address];
  const isRaw = address.startsWith('0x');
  const short = isRaw ? `${address.slice(0, 6)}…${address.slice(-4)}` : address;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    if (typeof window !== 'undefined') {
       // Simple fallback if addToast isn't easily accessible here
    }
  };

  return (
    <div className="flex flex-col">
      {label && (
        <span className="font-bold text-primary text-xs flex items-center gap-1">
          <Tag size={9} /> {label}
        </span>
      )}
      <div className="flex items-center gap-1 group/addr">
        <span className={`text-xs ${label ? 'text-text-muted' : 'font-mono text-text-muted'}`}>{short}</span>
        {isRaw && (
          <button onClick={handleCopy}
            className="opacity-0 group-hover/addr:opacity-100 text-text-muted hover:text-primary transition duration-200 p-3 -m-2.5 transform-gpu"
            aria-label="Copy address">
            <Copy size={10} />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Exchange Flow Breakdown ──────────────────────────────────────────────────

// ─── Exchange Flow Breakdown ──────────────────────────────────────────────────

const ExchangeFlowChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="leather-card rounded-xl p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-sm">Macro Asset Flows (USDm)</h3>
      <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">24h</span>
    </div>
    <div className="h-[200px] w-full relative">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 9, fill: '#71717a' }} stroke="#3f3f46" tickFormatter={v => `$${v}M`} />
          <YAxis dataKey="asset" type="category" tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 700 }} stroke="none" width={35} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#171717', 
              borderColor: '#2a2a2a', 
              color: '#f4f4f5', 
              borderRadius: '10px', 
              border: '1px solid #2a2a2a',
              padding: '10px 14px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              fontSize: '13px',
              fontWeight: 600,
            }}
            cursor={{ fill: '#3f3f46', fillOpacity: 0.15 }}
            formatter={(v: any, name: any) => [`$${v}M`, name === 'inflow' ? 'To Exchange' : 'From Exchange']}
            labelStyle={{ color: '#a1a1aa', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
            itemStyle={{ color: '#f4f4f5', fontWeight: 700 }}
          />
          <Bar dataKey="inflow" fill="#ef4444" fillOpacity={0.7} radius={[0, 3, 3, 0]} barSize={10} name="inflow" />
          <Bar dataKey="outflow" fill="#10b981" fillOpacity={0.7} radius={[0, 3, 3, 0]} barSize={10} name="outflow" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="flex items-center gap-6 mt-2 text-[10px] font-bold text-text-muted">
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400/70 inline-block" /> Inflow (Sell Pressure)</div>
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400/70 inline-block" /> Outflow (Accumulation)</div>
    </div>
  </div>
);

// ─── Alert Feed ───────────────────────────────────────────────────────────────

const AlertFeed: React.FC<{ data: WhaleTransaction[] }> = ({ data }) => {
  const alerts = data.slice(0, 5).map(tx => {
    const isBig = tx.valueNumeric > 10000000;
    const icon = tx.type === 'inflow' ? <ArrowDownRight size={15} /> : tx.type === 'outflow' ? <ArrowUpRight size={15} /> : <Target size={15} />;
    const color = tx.type === 'inflow' ? 'text-red-400' : tx.type === 'outflow' ? 'text-emerald-400' : 'text-primary';
    const bg = tx.type === 'inflow' ? 'bg-red-500/5 border-red-500/10' : tx.type === 'outflow' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-primary/5 border-primary/10';
    
    let text = `${tx.amount} moved from ${tx.from.slice(0, 8)}... to ${tx.to.slice(0, 8)}...`;
    if (isBig) text = `🚨 INSTITUTIONAL MOVE: ${tx.amount} (${tx.value}) detected in transit.`;
    
    return { icon, color, bg, text, time: tx.time };
  });

  return (
    <div className="leather-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Activity size={16} className="text-primary" /> Activity Feed
        </h3>
        <div className="flex items-center gap-1.5">
          <PulseIcon />
          <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Live Monitor</span>
        </div>
      </div>
      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((a, i) => (
            <div key={i} className="group flex items-start gap-4 p-4 rounded-xl bg-surface/30 border border-border/40 hover:border-primary/30 hover:bg-surface/50 transition duration-300 transform-gpu">
              <div className={`p-2.5 rounded-lg border flex-shrink-0 transition-transform group-hover:scale-110 ${a.color} ${a.bg}`}>
                {a.icon}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs font-medium text-text leading-relaxed group-hover:text-primary-light transition-colors">{a.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock size={10} className="text-text-muted" />
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{a.time}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-text-muted text-xs">No whale alerts in the last 24h</div>
        )}
      </div>

    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────


export interface WhaleTrackerProps {
  onNavigate?: (route: PageRoute) => void;
}

export const WhaleTracker: React.FC<WhaleTrackerProps> = ({ onNavigate }) => {
  const { addToast, setActiveSubMenu, activeSubMenu, setPageCategories } = useAppContext();
  const [tableData, setTableData] = useState<WhaleTransaction[]>([]);
  const [fullDataset, setFullDataset] = useState<WhaleTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 15 });
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'inflow' | 'outflow' | 'transfer'>('all');

  const [macroStats, setMacroStats] = useState<any>(null);
  const [activeView, setActiveView] = useState<'table' | 'alerts'>('table');

  // Sidebar Registration
  useEffect(() => {
    window.scrollTo(0, 0);
    if (activeSubMenu !== 'Discovery') {
       setActiveSubMenu('Discovery');
    }

    const discoveryItems = [
      { label: 'Asset Simulation', route: PageRoute.TOOLS, icon: <PieChart size={18} /> },
      { label: 'DCA Strategy', route: PageRoute.TOOLS, icon: <DollarSign size={18} /> },
      { label: 'Risk Analysis', route: PageRoute.MACRO_INTEL, icon: <Shield size={18} /> },
      { label: 'Market Pulse', route: PageRoute.HOME, icon: <Activity size={18} /> }
    ].sort(() => 0.5 - Math.random());

    setPageCategories(discoveryItems.map(item => ({
      label: item.label,
      icon: item.icon,
      active: false,
      onClick: () => {}
    })));

    return () => setPageCategories([]);
  }, [setActiveSubMenu, activeSubMenu, setPageCategories]);

  // Load data & Initialize Orchestrator
  useEffect(() => {
    const orchestrator = new WhaleOrchestrator(
      {
        whaleAlertKey: import.meta.env.VITE_WHALE_ALERT_API_KEY || '',
        etherscanKey: import.meta.env.VITE_ETHERSCAN_API || '',
      },
      (data) => {
        setFullDataset(data.txs);
        setMacroStats(data.macroStats);
        setIsLoading(false);
        
        // Log quota health for administrative visibility
        console.log('[Whale Tracker] Quota Health:', orchestrator.getQuotaStatus());
      }
    );
    
    orchestrator.start();
    
    return () => {
      orchestrator.stop();
    };
  }, []);

  // Filter
  const filteredData = useMemo(() => {
    let data = fullDataset;
    if (typeFilter !== 'all') data = data.filter(tx => tx.type === typeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(tx =>
        tx.from.toLowerCase().includes(q) ||
        tx.to.toLowerCase().includes(q) ||
        tx.assetSymbol.toLowerCase().includes(q) ||
        (walletLabels[tx.from] || '').toLowerCase().includes(q) ||
        (walletLabels[tx.to] || '').toLowerCase().includes(q)
      );
    }
    return data;
  }, [fullDataset, typeFilter, searchQuery]);

  // Paginate
  useEffect(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    setTableData(filteredData.slice(start, start + pagination.pageSize));
  }, [pagination, filteredData]);





  // Metrics
  const { liveFlowData, liveAssetData, liveTotalInflow, liveTotalOutflow } = useMemo(() => {
    if (!macroStats) return { liveFlowData: FALLBACK_FLOW_DATA, liveAssetData: FALLBACK_ASSET_DATA, liveTotalInflow: 1200000000, liveTotalOutflow: 850000000 };

    // Aggregate BTC and ETH for stats
    const btcIn = macroStats.btc?.inflow?.reduce((acc: number, item: any) => acc + (parseFloat(item.inflow) || 0), 0) || 0;
    const btcOut = macroStats.btc?.outflow?.reduce((acc: number, item: any) => acc + (parseFloat(item.outflow) || 0), 0) || 0;
    const ethIn = macroStats.eth?.inflow?.reduce((acc: number, item: any) => acc + (parseFloat(item.inflow) || 0), 0) || 0;
    const ethOut = macroStats.eth?.outflow?.reduce((acc: number, item: any) => acc + (parseFloat(item.outflow) || 0), 0) || 0;

    // Estimate total USD (hardcoded price fallback for simplicity/performance in this view)
    const btcPrice = 64000;
    const ethPrice = 3400;
    const totalInUSD = (btcIn * btcPrice) + (ethIn * ethPrice);
    const totalOutUSD = (btcOut * btcPrice) + (ethOut * ethPrice);

    // Prepare time series for AreaChart
    const series = macroStats.btc?.inflow?.map((item: any, idx: number) => {
      const ethItemIn = macroStats.eth?.inflow[idx]?.inflow || 0;
      const ethItemOut = macroStats.eth?.outflow[idx]?.outflow || 0;
      return {
        time: new Date(item.datetime).getHours() + ':00',
        inflow: (parseFloat(item.inflow) * btcPrice / 1e6) + (parseFloat(ethItemIn) * ethPrice / 1e6),
        outflow: (parseFloat(macroStats.btc.outflow[idx]?.outflow || 0) * btcPrice / 1e6) + (parseFloat(ethItemOut) * ethPrice / 1e6)
      };
    }).reverse() || FALLBACK_FLOW_DATA;

    // Prepare asset breakdown for BarChart
    const assetData = [
      { asset: 'BTC', inflow: btcIn * btcPrice / 1e6, outflow: btcOut * btcPrice / 1e6, color: '#F7931A' },
      { asset: 'ETH', inflow: ethIn * ethPrice / 1e6, outflow: ethOut * ethPrice / 1e6, color: '#627EEA' },
      { asset: 'SOL', inflow: 190, outflow: 120, color: '#14F195' }, // Fallback for alt stats
      { asset: 'BSC', inflow: 110, outflow: 140, color: '#F3BA2F' },
    ];

    return { 
      liveFlowData: series, 
      liveAssetData: assetData, 
      liveTotalInflow: totalInUSD, 
      liveTotalOutflow: totalOutUSD 
    };
  }, [macroStats]);

  const columns: Column<WhaleTransaction>[] = [
    { key: 'time', label: 'Time', width: '8%', render: (v) => <span className="text-xs text-text-muted font-mono">{v}</span> },
    { key: 'amount', label: 'Asset / Amount', width: '20%', render: (_, item) => (
      <div>
        <span className="font-bold text-sm">{item.assetSymbol}</span>
        <span className="text-xs text-text-muted ml-1.5">{item.amount.split(' ')[0]}</span>
      </div>
    )},
    { key: 'valueNumeric', label: 'USD Value', width: '15%', sortable: true, align: 'right', render: (_, item) => (
      <span className="font-mono font-bold text-sm">{item.value}</span>
    )},
    { key: 'from', label: 'From', width: '19%', render: (v) => <AddressCell address={v} /> },
    { key: 'to', label: 'To', width: '19%', render: (v) => <AddressCell address={v} /> },
    { key: 'chain', label: 'Network', width: '9%', render: (v) => (
      <span className="px-2 py-0.5 rounded bg-surface border border-border text-[9px] font-bold text-text-muted uppercase">
        {v}
      </span>
    )},
    { key: 'type', label: 'Flow Type', width: '10%', render: (v: string) => (
      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${
        v === 'inflow' ? 'bg-red-500/10 text-red-400' :
        v === 'outflow' ? 'bg-emerald-500/10 text-emerald-400' :
        'bg-text-muted/10 text-text-muted'
      }`}>
        {v === 'inflow' ? <ArrowDownRight size={10} /> : v === 'outflow' ? <ArrowUpRight size={10} /> : null}
        {v}
      </span>
    )},
  ];

  return (
    <div className="animate-fade-in">
      <PageMeta title="Whale Tracker" description="Real-time large cryptocurrency transaction alerts and analytics." />

      <div className="space-y-8">
        {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 lg:p-10 mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <PulseIcon /> Live Monitoring
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">Whale Radar 🐋</h1>
          <p className="text-text-muted text-lg max-w-2xl leading-relaxed mb-6">
            Real-time tracking of large-scale institutional wallet movements across Bitcoin, Ethereum, and major alt networks.
            Exchange inflows indicate tokens moving onto exchanges. Outflows indicate tokens moving to external wallets.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border rounded-lg text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-text-muted text-xs font-bold">6,000+ wallets tracked</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border rounded-lg text-xs font-bold text-text-muted">
              <Globe size={13} className="text-primary" /> 15 blockchains
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 border border-border rounded-lg text-xs font-bold text-text-muted">
              <Clock size={13} className="text-primary" /> Multi-chain Data (1h Cache)
            </div>
          </div>
        </div>
      </div>




      {/* ── Stat Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="24h Exchange Inflows" 
          value={`$${(liveTotalInflow / 1e9).toFixed(1)}B`} 
          sub="Institutional deposits" 
          direction="down" 
          icon={<ArrowDownRight size={16} />} 
        />
        <StatCard 
          label="24h Exchange Outflows" 
          value={`$${(liveTotalOutflow / 1e9).toFixed(1)}B`} 
          sub="Institutional withdrawals" 
          direction="up" 
          icon={<ArrowUpRight size={16} />} 
        />
        <StatCard 
          label="Net Flow" 
          value={`${liveTotalInflow - liveTotalOutflow >= 0 ? '+' : ''}$${((liveTotalInflow - liveTotalOutflow) / 1e6).toFixed(1)}M`} 
          sub={liveTotalInflow > liveTotalOutflow ? "Inflow Neutral" : "Accumulation Signal"} 
          direction={liveTotalInflow > liveTotalOutflow ? "down" : "up"} 
          icon={liveTotalInflow > liveTotalOutflow ? <TrendingDown size={16} /> : <TrendingUp size={16} />} 
        />
        <StatCard 
          label="Whale Alerts (10M+)" 
          value={fullDataset.filter(tx => tx.valueNumeric > 10000000).length.toString()} 
          sub="Filtered: Inst. Grade" 
          direction="neutral" 
          icon={<Activity size={16} />} 
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Flow Velocity */}
        <div className="lg:col-span-2 leather-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Institutional Flow Velocity (24h)</h3>
            <div className="flex items-center gap-4 text-[10px] font-bold text-text-muted">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Inflow (USDm)</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Outflow (USDm)</div>
            </div>
          </div>
          <div className="h-[180px] w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
              <AreaChart data={liveFlowData}>
                <defs>
                  <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#71717a' }} stroke="#3f3f46" />
                <YAxis tick={{ fontSize: 10, fill: '#71717a' }} stroke="#3f3f46" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#171717', 
                    borderColor: '#2a2a2a', 
                    color: '#f4f4f5', 
                    borderRadius: '10px', 
                    border: '1px solid #2a2a2a',
                    padding: '10px 14px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                  cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
                  formatter={(v: any, name: any) => [`$${v}M`, name === 'inflow' ? 'To Exchange' : 'From Exchange']}
                  labelStyle={{ color: '#a1a1aa', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
                  itemStyle={{ color: '#f4f4f5', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="inflow" stroke="#EF4444" fill="url(#inflowGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="outflow" stroke="#10B981" fill="url(#outflowGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Breakdown */}
        <ExchangeFlowChart data={liveAssetData} />
      </div>

      {/* ── What This Data Means ── */}
      <div className="leather-card rounded-xl p-5 border-l-4 border-l-primary/50">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm mb-1">How to read whale flows</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              <strong className="text-text">Exchange inflows</strong> (wallet → exchange) represent tokens being deposited onto exchanges, which historically has been associated with increased available supply.
              <strong className="text-text"> Exchange outflows</strong> (exchange → wallet) represent tokens being withdrawn to external wallets, often associated with longer-term holding behavior.
              <strong className="text-text"> Transfers</strong> between exchanges or wallets may reflect OTC deals, arbitrage, or portfolio restructuring.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Data View (Toggled) ── */}
      <div className="space-y-4">
        <div className="flex bg-surface border border-border rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveView('table')}
            className={`px-6 py-2 min-h-[44px] rounded-lg text-sm font-bold transition duration-200 transform-gpu flex items-center gap-1.5 ${activeView === 'table' ? 'bg-primary text-background' : 'text-text-muted hover:text-text'}`}
          >
            <BarChart2 size={16} /> Transactions
          </button>
          <button
            onClick={() => setActiveView('alerts')}
            className={`px-6 py-2 min-h-[44px] rounded-lg text-sm font-bold transition duration-200 transform-gpu flex items-center gap-1.5 ${activeView === 'alerts' ? 'bg-primary text-background' : 'text-text-muted hover:text-text'}`}
          >
            <Activity size={16} /> Activity Feed
          </button>
        </div>

        {activeView === 'table' ? (
          <div className="leather-card rounded-xl overflow-hidden animate-fade-in">
            {/* Table header */}
            <div className="p-4 border-b border-border bg-background/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-sm">Recent Large Transactions</h3>
                <div className="flex items-center gap-1.5">
                  <PulseIcon />
                  <span className="text-[10px] text-primary font-bold uppercase">Live</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {/* Search */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search address, asset..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="w-full sm:w-52 bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                {/* Type filter */}
                <div className="flex bg-surface border border-border rounded-lg p-0.5">
                  {(['all', 'inflow', 'outflow', 'transfer'] as const).map(f => (
                    <button key={f} onClick={() => { setTypeFilter(f); setPagination(p => ({ ...p, page: 1 })); }}
                      className={`px-3 py-1.5 min-h-[44px] rounded-md text-[10px] font-bold uppercase transition duration-200 transform-gpu ${typeFilter === f ? 'bg-primary text-background' : 'text-text-muted hover:text-text'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Table
              data={tableData}
              loading={isLoading}
              columns={columns}
              ariaLabel="Whale transactions table"
              pagination={{
                defaultPageSize: 15,
                pageSizeOptions: [15, 30, 50],
                totalItems: filteredData.length,
                onPageChange: (page, pageSize) => setPagination({ page, pageSize }),
              }}
              striped
              hoverable
              emptyState={{ title: 'No transactions match', description: 'Try adjusting your search or filter criteria.' }}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <AlertFeed data={fullDataset} />
          </div>
        )}
      </div>



      {/* ── Educational Section ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            icon: <BarChart2 size={20} className="text-primary" />,
            title: 'Exchange Net Position',
            body: 'When cumulative outflows exceed inflows over a sustained period, it has historically been correlated with reduced available supply on exchanges. Bitcoin\'s exchange reserves are currently at a 5-year low.',
          },
          {
            icon: <Eye size={20} className="text-primary" />,
            title: 'Dormant Wallet Activity',
            body: 'Wallets inactive for 1+ years suddenly moving coins may indicate a change in long-term holder behavior. These movements are tracked separately for educational analysis.',
          },
          {
            icon: <Zap size={20} className="text-primary" />,
            title: 'Miner Outflows',
            body: 'Miners depositing to exchanges may reflect operational cost management or treasury rebalancing. Sustained miner withdrawal patterns have historically been observed during periods of network growth.',
          },
        ].map((card, i) => (
          <div key={i} className="leather-card rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="p-2.5 bg-primary/10 rounded-lg w-fit mb-4">{card.icon}</div>
            <h4 className="font-bold text-sm mb-2">{card.title}</h4>
            <p className="text-xs text-text-muted leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>


    </div>
    </div>
  );
};