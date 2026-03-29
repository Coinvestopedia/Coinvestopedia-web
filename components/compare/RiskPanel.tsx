import React from 'react';
import { AssetData } from '../../data/assetRegistry';
import { ProGate } from '../../components/ProGate';
import { AlertCircle, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import { AssetIcon } from '../AssetIcon';

interface RiskPanelProps {
  assets: AssetData[];
  isProUser: boolean;
}

const getRiskTag = (vol: number) => {
  if (vol > 70) return { label: 'HIGH', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: ShieldAlert };
  if (vol > 30) return { label: 'MED', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: Shield };
  return { label: 'LOW', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: ShieldCheck };
};

export const RiskPanel: React.FC<RiskPanelProps> = ({ assets, isProUser }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="leather-card rounded-xl p-4 lg:p-6">
        <h3 className="font-bold text-lg mb-1">Risk & Volatility Analysis</h3>
        <p className="text-sm text-text-muted mb-6">Annualized volatility, beta, and extreme tail risk (VaR 95%) metrics.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map(asset => {
            const risk = getRiskTag(asset.volatility90d);
            const RiskIcon = risk.icon;
            
            return (
              <div key={asset.id} className="bg-surface border border-border rounded-xl p-5 hover:border-primary/50 hover:bg-surface-alt hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group min-w-0">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <AssetIcon symbol={asset.symbol} size={32} />
                    <div className="min-w-0">
                      <span className="font-bold text-sm truncate block group-hover:text-primary transition-colors">{asset.symbol}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold ${risk.border} ${risk.bg} ${risk.color}`}>
                    <RiskIcon size={12} />
                    {risk.label} RISK
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">30D Volatility</span>
                    <span className="font-mono font-bold text-sm">{asset.volatility30d.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">90D Volatility</span>
                    <span className="font-mono font-bold text-sm text-text-muted">{asset.volatility90d.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Beta (vs S&P)</span>
                    <span className="font-mono font-bold text-sm">{asset.betaSpy.toFixed(2)}</span>
                  </div>
                  
                  {/* Pro Gated Metric */}
                  <div className="pt-3 border-t border-border/50 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-primary">
                        <AlertCircle size={10} /> Value at Risk (95%)
                      </span>
                      {isProUser ? (
                        <span className="font-mono font-bold text-sm text-red-400">{asset.var95.toFixed(1)}%</span>
                      ) : (
                        <span className="font-mono font-bold text-sm text-text-muted blur-sm select-none">-4.5%</span>
                      )}
                    </div>
                    {!isProUser && (
                      <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center rounded">
                        <span className="text-[10px] font-bold bg-primary text-background px-2 py-0.5 rounded uppercase">Pro</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
