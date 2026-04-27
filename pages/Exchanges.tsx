import { PageMeta } from '../components/PageMeta';

import { PageRoute } from '../types';
import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppContext } from '../context/AppContext';
import {
  Shield, ChevronDown, ChevronUp, Check, X as XIcon,
  DollarSign, Globe, Server, Clock, Info, ArrowRight, Layers, Scale,
  Trophy, Building, Droplets, TrendingDown, Repeat, Lock, Coins,
  Briefcase, Users, Landmark, Wallet, Zap, Percent,
  CircleDollarSign, Copy, Smartphone, Activity, ShieldCheck
} from 'lucide-react';
import {
  EXCHANGES, BEST_FOR_CARDS, FAQ_DATA, REGIONS,
  ExchangeProfile, Grade
} from '../data/exchanges';
import { ExchangeCard } from '../components/exchanges/ExchangeCard';

import { AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis } from 'recharts';
import { PulseIcon } from '../components/AnimatedIcons';



// Custom dimension colors for charts matching default Coinvestopedia palette
// ─── Utility helpers ──────────────────────────────────────────────

const getScoreColorHex = (score: number) => {
  if (score >= 85) return '#10b981'; // emerald-500
  if (score >= 70) return '#94a3b8'; // slate-400
  if (score >= 50) return '#f87171'; // red-400
  return '#ef4444'; // red-500
};

const getRankColorHex = (index: number, total: number) => {
  if (total <= 1) return '#10b981';
  const pct = index / (total - 1);
  if (pct <= 0.33) return '#10b981'; // Green for top 3rd
  if (pct <= 0.66) return '#94a3b8'; // Grey for middle 3rd
  return '#ef4444'; // Red for bottom 3rd
};

const gradeColor = (g: Grade) => {
  switch (g) {
    case 'INSTITUTIONAL': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'PROFESSIONAL': return 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20';
    case 'ACTIVE_TRADER': return 'bg-slate-400/10 text-slate-400 border border-slate-400/20';
  }
};

const gradeLabel = (g: Grade) => g.replace('_', ' ');

const scoreColor = (s: number) => {
  if (s >= 85) return 'text-emerald-400';
  if (s >= 70) return 'text-slate-400';
  return 'text-red-400';
};



const regStatusIcon = (s: string) => {
  switch (s) {
    case 'LICENSED': return <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold">🟢 Licensed</span>;
    case 'REGISTERED': return <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-bold">⚪ Registered</span>;
    case 'RESTRICTED': return <span className="inline-flex items-center gap-1 text-red-400 text-xs font-bold">🔴 Restricted</span>;
    default: return <span className="inline-flex items-center gap-1 text-text-muted text-xs font-bold">⚫ N/A</span>;
  }
};

const formatCurrency = (n: number) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

// ─── Section: Header ──────────────────────────────────────────────

const PageHeader: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="leather-card relative overflow-hidden rounded-2xl p-8 lg:p-12 group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-6">
          <PulseIcon /> ClearRate™
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
          Exchange Intelligence
        </h1>
        
        <p className="text-lg text-text-muted max-w-3xl mb-4 leading-relaxed">
          20 exchanges. 7 scoring dimensions. Zero editorial bias.
        </p>
        <p className="text-sm text-text-muted max-w-3xl mb-10 leading-relaxed opacity-80">
          Every exchange rating you've read was written to drive clicks. ClearRate™ is different — a quantitative
          scoring model built on the same due diligence framework institutional allocators use before onboarding
          a new prime broker.
        </p>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: '20', label: 'Exchanges Scored' },
            { value: '7', label: 'Weighted Dimensions' },
            { value: '$2.3T+', label: 'Combined 30D Volume' },
            { value: 'Monthly', label: 'Updated' },
          ].map((m, i) => (
            <div key={i} className="p-4 bg-background/40 border border-border rounded-xl text-center backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 transition-colors transition-shadow transition-transform duration-300 transform-gpu">
              <div className="text-xl md:text-2xl font-bold text-primary mb-1">{m.value}</div>
              <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{m.label}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => scrollTo('compare-tool')}>
            Compare Exchanges
          </Button>
          <Button variant="secondary" onClick={() => scrollTo('exchange-profiles')}>
            View Top Ranked
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Section: Methodology ─────────────────────────────────────────

const MethodologySection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dimensions = [
    { name: 'Regulatory Compliance', short: 'Regulatory', weight: '25%', icon: <Scale size={16} />, sources: 'NYDFS, FCA, MAS, VARA, SEC filings, VASP registrations' },
    { name: 'Liquidity Depth', short: 'Liquidity', weight: '20%', icon: <Layers size={16} />, sources: 'Order book depth at 1%, 2%, 5% slippage; 30D spot + derivatives volume' },
    { name: 'Fee Structure', short: 'Fees', weight: '20%', icon: <DollarSign size={16} />, sources: 'Maker/taker at 5 volume tiers; withdrawal fees; spread analysis' },
    { name: 'Custody & Security', short: 'Custody', weight: '15%', icon: <Shield size={16} />, sources: 'Cold storage %, insurance coverage, audit history, PoR publication' },
    { name: 'Asset Coverage', short: 'Assets', weight: '10%', icon: <Layers size={16} />, sources: 'Spot pairs, perpetuals, options, margin, tokenized assets' },
    { name: 'Institutional Infrastructure', short: 'Infrastructure', weight: '5%', icon: <Server size={16} />, sources: 'FIX API, sub-accounts, OTC desk, prime brokerage, custody separation' },
    { name: 'Operational Track Record', short: 'Track Record', weight: '5%', icon: <Clock size={16} />, sources: 'Years operational, downtime incidents, hack history, litigation' },
  ];

  const methodologyRadarData = React.useMemo(() => dimensions.map(d => ({
    subject: d.short,
    weight: parseInt(d.weight),
    fullMark: 25
  })), []);

  const tiers = [
    { range: '90–100', label: 'Institutional Grade', desc: 'Suitable for compliance-constrained mandates.', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    { range: '80–89', label: 'Professional Grade', desc: 'Suitable for sophisticated investors with custody controls.', color: 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20' },
    { range: '70–79', label: 'Active Trader Grade', desc: 'Acceptable for discretionary crypto-native strategies.', color: 'bg-slate-400/10 text-slate-400 border border-slate-400/20' },
    { range: '<70', label: 'Heightened Risk', desc: 'Appropriate only with full due diligence and position limits.', color: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  ];

  return (
    <section id="methodology">
      <Card
        variant="interactive"
        className="w-full border-t-2 border-t-primary/30"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Info size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">How We Score — ClearRate™ Methodology</h2>
              <p className="text-sm text-text-muted">7 weighted dimensions, 100-point institutional scoring model</p>
            </div>
          </div>
          {isOpen ? <ChevronUp size={20} className="text-text-muted transition-transform" /> : <ChevronDown size={20} className="text-text-muted transition-transform" />}
        </div>
      </Card>

      {isOpen && (
        <Card className="mt-3 space-y-8 animate-fade-in p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Scoring dimensions */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Scale size={18} className="text-primary" /> Scoring Model (100-pt Scale)</h3>
              <div className="space-y-3">
                {dimensions.map((d, i) => (
                  <div key={i} className="flex flex-col gap-2.5 p-4 bg-surface rounded-xl border border-border group hover:border-primary/30 transition-colors duration-200 transform-gpu">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-primary">{d.icon}</span>
                        <span className="font-bold text-sm" style={{ color: getScoreColorHex(parseInt(d.weight) * 4) }}>{d.name}</span>
                      </div>
                      <span className="px-2 py-1 text-xs font-bold rounded flex-shrink-0" style={{ backgroundColor: `${getScoreColorHex(parseInt(d.weight) * 4)}20`, color: getScoreColorHex(parseInt(d.weight) * 4) }}>
                        {d.weight}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted text-left leading-relaxed">{d.sources}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Chart side */}
            <div className="flex flex-col h-full bg-surface/50 rounded-2xl border border-border overflow-hidden">
               <div className="p-4 border-b border-border bg-background/50 flex justify-between items-center z-10">
                  <h3 className="font-bold text-sm">Dimension Weights Breakdown</h3>
                  <PulseIcon />
               </div>
               <div className="h-[300px] lg:h-full min-h-[300px] w-full relative pl-2 pt-4 flex-1">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none"></div>
                  <ResponsiveContainer width="100%" height="100%" debounce={50}>
                     <RadarChart cx="50%" cy="50%" outerRadius="70%" data={methodologyRadarData}>
                        <PolarGrid stroke="#3A3F4B" strokeDasharray="3 3"/>
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} />
                        <RechartsTooltip 
                           contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#333842', borderRadius: '8px' }}
                           itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                        />
                        <Radar name="Weight (%)" dataKey="weight" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                     </RadarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>

          <div className="h-[1px] w-full bg-border" />

          {/* Score interpretation */}
          <div>
            <h3 className="text-lg font-bold mb-4">Score Interpretation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tiers.map((t, i) => (
                <div key={i} className={`p-4 rounded-xl leather-card ${t.color}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-black">{t.range}</span>
                    <span className="text-sm font-bold">{t.label}</span>
                  </div>
                  <p className="text-xs opacity-80">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-text-muted italic border-t border-border pt-4">
            ClearRate™ scores reflect publicly available data and editorial analysis. Scores do not constitute investment advice.
            Coinvestopedia may receive referral compensation; commercial relationships do not influence scores.
          </p>
        </Card>
      )}
    </section>
  );
};

// ─── Section: Best For Grid ───────────────────────────────────────

const BestForGrid: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sortedExchanges = useMemo(() => [...EXCHANGES].sort((a, b) => b.clearRateScore - a.clearRateScore), []);

  const sortedBestFor = useMemo(() => {
    return [...BEST_FOR_CARDS].sort((a, b) => {
      const scoreA = EXCHANGES.find(e => e.id === a.exchangeId)?.clearRateScore || 0;
      const scoreB = EXCHANGES.find(e => e.id === b.exchangeId)?.clearRateScore || 0;
      return scoreB - scoreA;
    });
  }, []);

  return (
    <section id="best-for" className="scroll-mt-32">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-sm inline-block"></span>
        Quick Pick — Best Exchange For…
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedBestFor.slice(0, visibleCount).map((card) => {
          const exchange = EXCHANGES.find(e => e.id === card.exchangeId)!;
          const rank = sortedExchanges.findIndex(e => e.id === exchange.id) + 1;
          
          return (
            <Card
              key={card.exchangeId}
              variant="interactive"
              className={`h-full flex flex-col w-full p-6 group relative overflow-hidden border-t-2 ${exchange.grade === 'INSTITUTIONAL' ? 'border-t-primary' : 'border-t-yellow-500'}`}
              onClick={() => scrollTo(card.exchangeId)}
            >
              {/* Background Pulse Effect */}
              <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none ${exchange.grade === 'INSTITUTIONAL' ? 'bg-primary' : 'bg-yellow-500'}`} />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Header */}
              <div className="mb-5 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${
                    exchange.grade === 'INSTITUTIONAL' 
                    ? 'text-primary bg-primary/5 border-primary/20 group-hover:bg-primary/10' 
                    : 'text-yellow-500 bg-yellow-500/5 border-yellow-500/20 group-hover:bg-yellow-500/10'
                  }`}>
                    {exchange.name}
                  </span>
                  <Activity size={14} className="text-text-muted opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all" />
                </div>
                <h3 className="font-bold text-xl leading-snug group-hover:text-primary transition-colors min-h-[3.5rem] flex items-center">
                  {card.label}
                </h3>
              </div>

              {/* Main Score Box */}
              <div className="mb-6 bg-black backdrop-blur-sm p-4 rounded-xl border border-border w-full overflow-hidden flex items-center justify-between group-hover:border-primary/30 transition-all relative z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">ClearRate™ Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold font-mono tracking-tight ${scoreColor(exchange.clearRateScore)} group-hover:brightness-110 transition-all`}>
                      {exchange.clearRateScore}
                    </span>
                    <span className="text-xs text-text-muted font-mono">/100</span>
                  </div>
                </div>
                <div className={`flex flex-col items-end gap-1 font-bold px-3 py-1.5 rounded-lg text-[10px] border shadow-sm ${gradeColor(exchange.grade)}`}>
                   <span className="uppercase opacity-70 flex items-center gap-1">
                     <ShieldCheck size={10} />
                     Tier Status
                   </span>
                   <span className="tracking-wide">{gradeLabel(exchange.grade)}</span>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10 px-1">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Spot Taker Fee</span>
                  <div className="flex items-center gap-1.5">
                    <Zap size={10} className="text-primary opacity-50" />
                    <span className="font-mono text-xs font-bold text-text">{(exchange.fees.spotTaker * 100).toFixed(2)}%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 items-end text-right">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Global Rank</span>
                  <span className="font-mono text-xs font-bold text-primary">{rank} <span className="text-[10px] text-text-muted">/ 20</span></span>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="flex items-center justify-center w-full px-4 py-3.5 mt-auto bg-surface-alt group-hover:bg-primary group-hover:text-white text-text-muted group-hover:shadow-lg group-hover:shadow-primary/20 text-[11px] font-black rounded-xl transition-all duration-300 border border-border group-hover:border-transparent relative z-10 uppercase tracking-widest">
                {card.cta}
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        {visibleCount < sortedBestFor.length && (
          <Button 
            variant="secondary"
            size="lg"
            onClick={() => setVisibleCount(prev => prev === 8 ? 14 : sortedBestFor.length)}
            className="w-full sm:w-auto min-w-[200px] group gap-3 py-7 rounded-2xl border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-all duration-500 shadow-lg shadow-primary/5 hover:shadow-primary/20"
            icon={<ChevronDown size={20} className="group-hover:translate-y-1 transition-all duration-300 text-primary" />}
            iconPosition="right"
          >
            <span className="text-sm font-bold tracking-tight uppercase">Show More</span>
          </Button>
        )}
        {visibleCount > 8 && (
          <Button 
            variant="secondary"
            size="lg"
            onClick={() => setVisibleCount(8)}
            className="w-full sm:w-auto min-w-[160px] group gap-3 py-7 rounded-2xl border-border/50 bg-surface/30 hover:bg-surface hover:border-primary/20 transition-all duration-500 text-text-muted hover:text-primary"
            icon={<ChevronUp size={20} className="group-hover:-translate-y-1 transition-all duration-300" />}
            iconPosition="right"
          >
            <span className="text-sm font-bold tracking-tight uppercase">Show Less</span>
          </Button>
        )}
      </div>
    </section>
  );
};

// ─── Exchange Profiles Section ────────────────────────────────────

const ExchangeProfilesSection: React.FC = () => {
  const sortedExchanges = useMemo(() => [...EXCHANGES].sort((a, b) => b.clearRateScore - a.clearRateScore), []);

  return (
    <section id="exchange-profiles" className="scroll-mt-32">
      <div className="leather-card rounded-2xl p-6 lg:p-8 relative overflow-hidden group border-t-2 border-t-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
        {/* Pulse Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                Top 20 Liquidity Venues
              </h2>
              <p className="text-sm text-text-muted">Ranked by ClearRate™ Institutional Scoring Model</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Feed Verified
            </div>
          </div>

          <div className="space-y-4">
            {sortedExchanges.map((exchange, index) => (
              <React.Fragment key={exchange.id}>
                <ExchangeCard exchange={exchange} rank={index + 1} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Affiliate Banner ─────────────────────────────────────────────



// ─── Section: Comparison Tool ─────────────────────────────────────

const ComparisonTool: React.FC = () => {
  const [selected, setSelected] = useState<string[]>(['coinbase', 'kraken', 'binance']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedExchanges = useMemo(() =>
    selected.map(id => EXCHANGES.find(e => e.id === id)!).filter(Boolean),
    [selected]
  );

  const toggleExchange = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const comparisonRows = [
    { label: 'ClearRate™ Score', key: 'clearRateScore', render: (e: ExchangeProfile) => <span className={`font-black text-lg ${scoreColor(e.clearRateScore)}`}>{e.clearRateScore}/100</span> },
    { label: 'Grade', key: 'grade', render: (e: ExchangeProfile) => <span className={`text-xs font-bold px-2 py-1 rounded ${gradeColor(e.grade)}`}>{gradeLabel(e.grade)}</span> },
    { label: 'Licenses', key: 'regulatoryLicenses', render: (e: ExchangeProfile) => <div className="flex flex-wrap gap-1 justify-center">{e.regulatoryLicenses.slice(0, 3).map((l, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 bg-surface border border-border rounded">{l}</span>)}</div> },
    { label: 'Spot Maker', key: 'makerFee', render: (e: ExchangeProfile) => <span className="font-bold">{e.fees.spotMaker < 0 ? `${(e.fees.spotMaker * 100).toFixed(3)}% (rebate)` : `${(e.fees.spotMaker * 100).toFixed(3)}%`}</span> },
    { label: 'Spot Taker', key: 'takerFee', render: (e: ExchangeProfile) => <span className="font-bold">{e.fees.spotTaker < 0 ? `${(e.fees.spotTaker * 100).toFixed(3)}% (rebate)` : `${(e.fees.spotTaker * 100).toFixed(3)}%`}</span> },
    { label: 'Derivatives', key: 'derivatives', render: (e: ExchangeProfile) => <span className="text-sm">{e.derivatives.length > 0 ? e.derivatives.join(', ') : 'None'}</span> },
    { label: 'Custody', key: 'custodyModel', render: (e: ExchangeProfile) => <span className="text-sm font-medium">{e.custodyModel.replace('_', '-')}</span> },
    { label: 'Insurance', key: 'insuranceCoverage', render: (e: ExchangeProfile) => <span className="text-sm font-medium">{e.insuranceCoverage || 'N/A'}</span> },
    { label: 'Proof of Reserves', key: 'proofOfReserves', render: (e: ExchangeProfile) => <span className="text-sm">{e.proofOfReserves === 'FULL_AUDIT' ? '✅ Full' : e.proofOfReserves === 'MERKLE_ATTESTATION' ? '🟡 Partial' : '❌ None'}</span> },
    { label: 'US Eligible', key: 'usPersonsEligible', render: (e: ExchangeProfile) => {
      if (e.usPersonsEligible === true) return <Check size={16} className="text-emerald-400" />;
      if (e.usPersonsEligible === false) return <XIcon size={16} className="text-red-400" />;
      return <span className="text-amber-400 text-xs font-bold">Limited</span>;
    }},
    { label: 'OTC Desk', key: 'otcDesk', render: (e: ExchangeProfile) => e.otcDeskMinimum !== null ? <Check size={16} className="text-emerald-400" /> : <XIcon size={16} className="text-red-400" /> },
    { label: 'FIX API', key: 'fixApi', render: (e: ExchangeProfile) => e.fixApi ? <Check size={16} className="text-emerald-400" /> : <XIcon size={16} className="text-red-400" /> },
    { label: 'Years Operational', key: 'yearsOperational', render: (e: ExchangeProfile) => <span className="font-bold">{e.founded ? new Date().getFullYear() - e.founded : '-'}</span> },
    { label: 'Risk Flags', key: 'riskFlags', render: (e: ExchangeProfile) => (
      <span className={`text-sm font-bold ${e.riskFlags.length === 0 ? 'text-emerald-400' : e.riskFlags.some(f => f.includes('⚠️')) ? 'text-red-400' : 'text-amber-400'}`}>
        {e.riskFlags.length === 0 ? 'None' : `${e.riskFlags.length} active`}
      </span>
    )},
  ];

  const getBestId = (key: string): string | null => {
    if (!selectedExchanges.length) return null;
    switch (key) {
      case 'clearRateScore': return selectedExchanges.reduce((a, b) => a.clearRateScore > b.clearRateScore ? a : b).id;
      case 'takerFee': return selectedExchanges.reduce((a, b) => a.fees.spotTaker < b.fees.spotTaker ? a : b).id;
      case 'makerFee': return selectedExchanges.reduce((a, b) => a.fees.spotMaker < b.fees.spotMaker ? a : b).id;
      case 'yearsOperational': return selectedExchanges.reduce((a, b) => a.founded < b.founded ? a : b).id;
      default: return null;
    }
  };

  return (
    <section id="compare-tool" className="scroll-mt-32">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-sm inline-block"></span>
        Side-by-Side Comparison Tool
      </h2>

      {/* Exchange selector */}
      <div className="mb-6 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full leather-card rounded-xl p-4 flex items-center justify-between transition duration-300 transform-gpu ${isDropdownOpen ? 'border-primary/40 bg-primary/5 shadow-md shadow-primary/5' : 'hover:border-primary/30 hover:bg-primary/5 hover:shadow-md'}`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-text-muted mr-2">Comparing:</span>
            {selectedExchanges.map(e => (
              <span key={e.id} className="px-3 py-1 bg-surface border border-border text-text font-medium text-xs rounded-lg shadow-sm">
                {e.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-bold">{selected.length}/4</span>
            <ChevronDown size={18} className={`text-text-muted transition-transform transform-gpu duration-300 ${isDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-2xl shadow-black/20 z-30 p-2 max-h-64 overflow-y-auto">
            {EXCHANGES.map(e => (
              <button
                key={e.id}
                onClick={() => toggleExchange(e.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-sm hover:bg-background transition-colors ${
                  selected.includes(e.id) ? 'text-primary' : 'text-text-muted'
                }`}
                disabled={!selected.includes(e.id) && selected.length >= 4}
              >
                <span className="font-medium">{e.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${scoreColor(e.clearRateScore)}`}>{e.clearRateScore}</span>
                  {selected.includes(e.id) && <Check size={16} className="text-primary" />}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comparison table */}
      <Card className="p-0 overflow-hidden leather-card group relative border-t-2 border-t-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
        {/* Pulse Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-background/30">
                <th className="p-5 text-left text-xs font-bold uppercase tracking-wider text-text-muted w-44">Dimension</th>
                {selectedExchanges.map(e => (
                  <th key={e.id} className="p-5 text-center">
                    <div className="inline-flex px-2 py-0.5 rounded-md bg-surface border border-border text-[10px] font-black text-primary mb-1">
                      {e.grade === 'INSTITUTIONAL' ? 'INSTITUTIONAL' : 'RETAIL+'}
                    </div>
                    <div className="text-base font-bold group-hover:text-primary transition-colors">{e.name}</div>
                    <div className={`text-[11px] font-black mt-1 ${scoreColor(e.clearRateScore)}`}>{e.clearRateScore}/100</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {comparisonRows.map((row, i) => {
                const bestId = getBestId(row.key);
                return (
                  <tr key={i} className="hover:bg-primary/5 transition-colors">
                    <td className="p-5 text-xs font-bold text-text-muted border-r border-border/20">{row.label}</td>
                    {selectedExchanges.map(e => (
                      <td key={e.id} className={`p-5 text-center transition-colors duration-300 ${bestId === e.id ? 'bg-primary/5' : ''}`}>
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="font-medium text-sm">{row.render(e)}</div>
                          {bestId === e.id && (
                            <span className="flex items-center gap-1 text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-tighter mt-1">
                              <ShieldCheck size={8} /> Best-in-Class
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};

// ─── Section: Fee Calculator ──────────────────────────────────────

const FeeCalculator: React.FC = () => {
  const [volume, setVolume] = useState(1000000);
  const [tradeType, setTradeType] = useState<'spot' | 'perpetuals'>('spot');
  const [selectedIds, setSelectedIds] = useState<string[]>(['coinbase', 'kraken', 'binance', 'okx', 'hyperliquid']);

  const volumeSteps = [10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000];

  const results = useMemo(() => {
    return selectedIds.map(id => {
      const ex = EXCHANGES.find(e => e.id === id);
      if (!ex) return null;
      const monthlyVolume = volume;
      const annualVolume = monthlyVolume * 12;
      const feeRate = tradeType === 'spot' ? ex.fees.spotTaker : ex.fees.perpTaker;
      const annualCost = annualVolume * feeRate;
      return { exchange: ex, annualCost, feeRate };
    }).filter(Boolean) as { exchange: ExchangeProfile; annualCost: number; feeRate: number }[];
  }, [volume, tradeType, selectedIds]);

  const chartData = useMemo(() => {
    return volumeSteps.map(vol => {
      const point: any = { volume: vol, name: formatCurrency(vol) };
      selectedIds.forEach(id => {
        const ex = EXCHANGES.find(e => e.id === id);
        if (ex) {
           point[ex.name] = vol * 12 * (tradeType === 'spot' ? ex.fees.spotTaker : ex.fees.perpTaker);
        }
      });
      return point;
    });
  }, [selectedIds, volumeSteps, tradeType]);

  const sortedResults = useMemo(() => [...results].sort((a, b) => a.annualCost - b.annualCost), [results]);
  const cheapest = sortedResults[0];
  const mostExpensive = sortedResults[sortedResults.length - 1];

  const toggleCalcExchange = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  return (
    <section id="fee-calculator" className="scroll-mt-32">
      <div className="leather-card rounded-2xl p-8 lg:p-10 relative overflow-hidden group border-t-2 border-t-yellow-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
        {/* Pulse Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-yellow-500 rounded-sm inline-block"></span>
                Cost of Capital Calculator
              </h2>
              <p className="text-text-muted">Simulate annual trading slippage and fee overhead across multiple venues.</p>
            </div>
            <div className="flex bg-background/50 p-1.5 rounded-xl border border-border backdrop-blur-md">
              {(['spot', 'perpetuals'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTradeType(t)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${tradeType === t ? 'bg-primary text-background shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text'}`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            {/* Volume slider */}
            <div className="bg-background/40 p-6 rounded-2xl border border-border/50">
              <div className="flex justify-between items-end mb-4">
                <label className="text-xs font-black uppercase tracking-widest text-text-muted">Monthly Trading Volume</label>
                <span className="text-2xl font-black text-primary tabular-nums">{formatCurrency(volume)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={volumeSteps.length - 1}
                value={volumeSteps.indexOf(volumeSteps.reduce((prev, curr) => Math.abs(curr - volume) < Math.abs(prev - volume) ? curr : prev))}
                onChange={(e) => setVolume(volumeSteps[parseInt(e.target.value)])}
                className="w-full h-1.5 bg-surface rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary-hover transition-all"
              />
              <div className="flex justify-between mt-3 px-1">
                <span className="text-[10px] text-text-muted font-bold">$10K</span>
                <span className="text-[10px] text-text-muted font-bold">$100M</span>
              </div>
            </div>

            {/* Exchange chips */}
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 block px-1">Select Venues to compare (max 5)</label>
              <div className="flex flex-wrap gap-2">
                {EXCHANGES.map(e => (
                  <button
                    key={e.id}
                    onClick={() => toggleCalcExchange(e.id)}
                    disabled={!selectedIds.includes(e.id) && selectedIds.length >= 5}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      selectedIds.includes(e.id) ? 'bg-primary text-background shadow-lg shadow-primary/10' : 'bg-surface/50 border border-border text-text-muted hover:border-primary/30 hover:bg-surface'
                    } disabled:opacity-20 disabled:cursor-not-allowed`}
                  >
                    {e.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            {sortedResults.length > 0 && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 px-1 flex items-center gap-2">
                    <Activity size={14} className="text-primary" /> Efficiency Rankings
                  </h3>
                  {sortedResults.map((r, i) => {
                    const savings = mostExpensive ? mostExpensive.annualCost - r.annualCost : 0;
                    return (
                      <div key={r.exchange.id} className={`p-5 rounded-2xl transition-all duration-300 border ${i === 0 ? 'bg-primary/5 border-primary/30 shadow-xl shadow-primary/5' : 'bg-surface/40 border-border/50 hover:border-border hover:bg-surface/60'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-primary text-background' : 'bg-background text-text-muted'}`}>
                              {i + 1}
                            </div>
                            <div>
                              <div className="font-bold text-sm flex items-center gap-2">
                                {r.exchange.name}
                                {i === 0 && <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">Leader</span>}
                              </div>
                              <div className="text-[10px] text-text-muted font-medium uppercase tracking-tight">{tradeType} Fee: {(r.feeRate * 100).toFixed(3)}%</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-xl tabular-nums">{formatCurrency(r.annualCost)}<span className="text-[10px] text-text-muted font-normal ml-1">/yr</span></div>
                            {savings > 0 && <div className="text-[10px] text-emerald-400 font-bold mt-0.5">-{formatCurrency(savings)} vs worst</div>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Visual Chart */}
                <div className="bg-background/60 rounded-2xl border border-border/50 p-6 flex flex-col backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-black text-text-muted uppercase tracking-widest">Fee Scaling Projection</h4>
                    <div className="flex items-center gap-4">
                       {selectedIds.slice(0, 3).map(id => {
                         const ex = EXCHANGES.find(e => e.id === id);
                         const rankIndex = sortedResults.findIndex(r => r.exchange.id === id);
                         const color = getRankColorHex(rankIndex, selectedIds.length);
                         return (
                           <div key={id} className="flex items-center gap-1.5">
                             <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                             <span className="text-[10px] font-bold text-text-muted">{ex?.name}</span>
                           </div>
                         );
                       })}
                    </div>
                  </div>
                  <div className="flex-1 min-h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%" debounce={50}>
                      <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                           {selectedIds.map((id) => {
                              const rankIndex = sortedResults.findIndex(r => r.exchange.id === id);
                              const color = getRankColorHex(rankIndex, selectedIds.length);
                              return (
                                <linearGradient key={`color-${id}`} id={`color-${id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                                </linearGradient>
                              );
                           })}
                        </defs>
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 700 }} 
                          axisLine={false} 
                          tickLine={false} 
                          interval="preserveStartEnd"
                        />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#333842', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                          itemStyle={{ fontSize: 11, fontWeight: 'black' }}
                          labelStyle={{ fontSize: 10, color: '#94A3B8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 800 }}
                          formatter={(value: any, name: any) => [formatCurrency(Number(value)), name]}
                        />
                        {selectedIds.map((id) => {
                           const ex = EXCHANGES.find(e => e.id === id);
                           if (!ex) return null;
                           const rankIndex = sortedResults.findIndex(r => r.exchange.id === id);
                           const color = getRankColorHex(rankIndex, selectedIds.length);
                           return (
                              <Area 
                                key={id} 
                                type="monotone" 
                                dataKey={ex.name} 
                                stroke={color} 
                                fillOpacity={1} 
                                fill={`url(#color-${id})`} 
                                strokeWidth={2.5}
                                animationDuration={1500}
                              />
                           );
                        })}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Smart CTA */}
            {cheapest && mostExpensive && cheapest.exchange.id !== mostExpensive.exchange.id && (
              <div className="p-5 bg-primary/10 border border-primary/30 rounded-xl mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm font-medium">
                  At this volume, <strong className="text-primary font-black">{cheapest.exchange.name}</strong> saves you{' '}
                  <strong className="text-primary font-black">{formatCurrency(mostExpensive.annualCost - cheapest.annualCost)}</strong> annually
                  vs. {mostExpensive.exchange.name}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Section: Regulatory Matrix ───────────────────────────────────

const RegulatoryMatrix: React.FC = () => {
  return (
    <section id="regulatory-matrix" className="scroll-mt-32">
      <div className="leather-card rounded-2xl p-8 lg:p-10 relative overflow-hidden group border-t-2 border-t-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5">
        {/* Pulse Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck size={18} className="text-emerald-400" />
                 <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-500/20">Global Trust Verified</span>
              </div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-sm inline-block"></span>
                Regulatory Status Matrix
              </h2>
              <p className="text-text-muted">Live tracking of exchange operational licenses and regional restrictions.</p>
            </div>
            
            <div className="flex gap-4 p-4 bg-background/50 rounded-xl border border-border backdrop-blur-md">
               <div className="text-center">
                 <div className="text-lg font-black text-emerald-400 tabular-nums">100%</div>
                 <div className="text-[8px] text-text-muted font-bold uppercase tracking-widest">Compliance Latency</div>
               </div>
               <div className="w-px h-10 bg-border"></div>
               <div className="text-center">
                 <div className="text-lg font-black text-text tabular-nums">48h</div>
                 <div className="text-[8px] text-text-muted font-bold uppercase tracking-widest">Data Freshness</div>
               </div>
            </div>
          </div>

          <div className="bg-background/40 rounded-2xl border border-border/50 overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-border/50 bg-surface/30">
                    <th className="p-5 text-left text-[10px] font-black uppercase tracking-widest text-text-muted">Venue Infrastructure</th>
                    {REGIONS.map(r => (
                      <th key={r} className="p-5 text-center text-[10px] font-black uppercase tracking-widest text-text-muted">{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {EXCHANGES.map(e => (
                    <tr key={e.id} className="hover:bg-emerald-500/5 transition-colors group/row">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                           <div className="w-1 h-4 bg-transparent group-hover/row:bg-emerald-500 transition-colors rounded-full"></div>
                           <span className="font-bold text-sm text-text transition-colors group-hover/row:text-emerald-400">{e.name}</span>
                        </div>
                      </td>
                      {REGIONS.map(r => (
                        <td key={r} className="p-5 text-center">
                          <div className="flex justify-center scale-110 transition-transform hover:scale-125">
                            {regStatusIcon(e.regulatoryMap[r])}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Legend as premium status badges */}
            <div className="p-6 bg-surface/30 border-t border-border/50">
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mr-2">Key:</span>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                   <span className="text-xs font-bold text-text-muted">Licensed Operational</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                   <span className="text-xs font-bold text-text-muted">Registered / Pending</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-400"></div>
                   <span className="text-xs font-bold text-text-muted">Restricted / Prohibited</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                   <Activity size={12} className="text-emerald-400" />
                   <span className="text-[10px] italic text-text-muted opacity-60">Verified via official regulatory APIs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Section: FAQ Accordion ───────────────────────────────────────

const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-32">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted shadow-sm">
           <Info size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <p className="text-text-muted text-sm font-medium">Expert insights on exchange selection and risk management.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {FAQ_DATA.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className={`leather-card rounded-2xl transition-all duration-500 overflow-hidden group ${
                isOpen ? 'border-t-2 border-t-primary shadow-2xl shadow-primary/5 bg-surface/30' : 'hover:border-primary/20 hover:bg-surface/50'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left group/btn"
              >
                <div className="flex items-center gap-4">
                   <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-colors ${
                     isOpen ? 'bg-primary text-background' : 'bg-background text-text-muted group-hover/btn:text-primary border border-border'
                   }`}>
                     {String(i + 1).padStart(2, '0')}
                   </div>
                   <span className={`font-bold transition-colors ${isOpen ? 'text-primary' : 'text-text group-hover/btn:text-primary'}`}>{faq.q}</span>
                </div>
                <div className={`transition-all duration-500 transform ${isOpen ? 'rotate-180 text-primary' : 'text-text-muted group-hover/btn:translate-y-0.5'}`}>
                   <ChevronDown size={20} />
                </div>
              </button>
              
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <div className="px-16 pb-8">
                  <div className="h-px bg-border/30 mb-6 w-full"></div>
                  <p className="text-text-muted leading-relaxed text-base font-medium">
                    {faq.a}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60">
                     <Activity size={12} />
                     <span>Verified by ClearRate™ Editorial Team</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ─── Section: Disclaimer ──────────────────────────────────────────

const DisclaimerSection: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <section className="pb-10">
      <div className="leather-card rounded-2xl p-10 border-t border-border/30 bg-surface/20 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-primary mb-6 shadow-xl shadow-primary/5">
             <ShieldCheck size={24} />
          </div>
          
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted mb-4">ClearRate™ Editorial Disclosure</h3>
          
          <div className="space-y-4 text-sm text-text-muted leading-relaxed">
            <p>
              Coinvestopedia operates the <strong className="text-text font-bold">ClearRate™ Exchange Intelligence</strong> product independently.
              Our proprietary scoring algorithms are applied uniformly across all venues based on quarterly 
              institutional-grade audits and real-time API monitoring.
            </p>
            <p className="opacity-80">
              The information provided on this portal is for institutional and professional educational purposes 
              only. It does not constitute financial, investment, or legal advice. Digital asset markets are 
              characterized by extreme volatility and structural risk.
            </p>
            
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
               <div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-full border border-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">System Status: Active</span>
               </div>
               <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Last Model Update: <span className="text-text">{currentDate}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export interface ExchangesProps {
  onNavigate?: (route: PageRoute) => void;
}

export const Exchanges: React.FC<ExchangesProps> = ({ onNavigate }) => {
  const { setPageCategories, setActiveSubMenu, activeSubMenu } = useAppContext();
  const [activeSection, setActiveSection] = useState('methodology');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Accounts for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const categories = [
      { id: 'methodology', label: 'Methodology', icon: <Scale size={18} /> },
      { id: 'best-for', label: 'Quick Picks', icon: <Zap size={18} /> },
      { id: 'exchange-profiles', label: 'Top Ranked', icon: <Landmark size={18} /> },
      { id: 'compare-tool', label: 'Compare Tool', icon: <Repeat size={18} /> },
      { id: 'fee-calculator', label: 'Fee Calculator', icon: <DollarSign size={18} /> },
      { id: 'regulatory-matrix', label: 'Regulatory Matrix', icon: <Globe size={18} /> },
      { id: 'faq', label: 'FAQ', icon: <Info size={18} /> },
    ];

    setPageCategories(categories.map(cat => ({
      ...cat,
      active: activeSection === cat.id,
      onClick: () => scrollToSection(cat.id)
    })));

    if (activeSubMenu !== 'Knowledge') {
      setActiveSubMenu('Knowledge');
    }

    // Scroll Spy Logic
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const cat of categories) {
        const section = document.getElementById(cat.id);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      setPageCategories([]);
    };
  }, [activeSection, setPageCategories, setActiveSubMenu, activeSubMenu]);

  return (
    <div className="animate-fade-in space-y-10 lg:space-y-14 pb-12">
      <PageMeta title="Exchange Directory" description="Compare leading cryptocurrency exchanges by fees, volume, and features." />

      <PageHeader />

      <MethodologySection />
      <BestForGrid />
      <ExchangeProfilesSection />

      <ComparisonTool />
      <FeeCalculator />
      <RegulatoryMatrix />
      <FAQAccordion />
      <DisclaimerSection />
    </div>
  );
};

export default Exchanges;
