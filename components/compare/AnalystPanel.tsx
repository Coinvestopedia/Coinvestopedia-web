import React from 'react';
import { AssetData, MACRO_THEMES } from '../../data/assetRegistry';
import { ProGate } from '../../components/ProGate';
import { Lightbulb, Info } from 'lucide-react';
import { AssetIcon } from '../AssetIcon';

interface AnalystPanelProps {
  assets: AssetData[];
  isProUser: boolean;
}

const getSignalBadge = (signal: string) => {
  switch (signal) {
    case 'BUY': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    case 'WATCH': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    case 'UNDERWEIGHT': return 'bg-red-500/10 border-red-500/30 text-red-400';
    default: return 'bg-surface border-border text-text-muted'; // NEUTRAL
  }
};

export const AnalystPanel: React.FC<AnalystPanelProps> = ({ assets, isProUser }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ─── MACRO THEME CARDS ────────────────────────────────────────────────── */}
      <div className="leather-card rounded-xl p-4 lg:p-6 pb-2">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
          <Lightbulb size={20} className="text-primary" /> Q1 2026 Macro Themes
        </h3>
        <p className="text-sm text-text-muted mb-6">Current top-down structural drivers affecting all asset classes.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MACRO_THEMES.map((theme, idx) => (
            <div key={idx} className="bg-surface border border-border p-4 rounded-xl hover:border-primary/50 hover:bg-surface-alt transition-colors duration-300 group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-md">{theme.title}</h4>
                  <p className="text-[11px] text-text-muted leading-tight">{theme.subtitle}</p>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  theme.impact === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                  theme.impact === 'NEGATIVE' ? 'bg-red-500/10 text-red-400' :
                  'bg-surface-alt border border-border text-text-muted'
                }`}>
                  {theme.impact}
                </div>
              </div>
              <p className="text-sm text-text-muted mt-3">{theme.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── PER-ASSET THESIS CARDS ────────────────────────────────────────────── */}
      <div className="leather-card rounded-xl p-4 lg:p-6">
        <h3 className="font-bold text-lg mb-1">Asset Desk Views</h3>
        <p className="text-sm text-text-muted mb-6">Fundamental positioning and investment thesis per asset.</p>
        
        <div className="space-y-4">
          {assets.map(asset => (
            <div key={asset.id} className="bg-surface border border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start relative hover:border-primary/50 hover:bg-surface-alt transition-colors duration-300 group">
              
              {/* Asset Header Info */}
              <div className="w-full md:w-1/4 flex-shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <AssetIcon symbol={asset.symbol} size={32} />
                  <div className="min-w-0">
                    <span className="font-bold text-sm block group-hover:text-primary transition-colors">{asset.symbol}</span>
                    <span className="text-[11px] text-text-muted block truncate">{asset.name}</span>
                  </div>
                </div>
                <div className={`inline-block mt-1 px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${getSignalBadge(asset.analystSignal)}`}>
                  {asset.analystSignal}
                </div>
              </div>
              
              {/* Thesis Body */}
              <div className="w-full md:w-3/4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 flex items-center gap-1">
                  <Info size={12} /> Investment Thesis
                </div>
                
                  <p className="text-sm text-text leading-relaxed">
                    {asset.analystThesis}
                  </p>
            </div>
          </div>
        ))}
        </div>
      </div>

    </div>
  );
};
