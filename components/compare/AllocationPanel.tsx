import React from 'react';
import { GLOBAL_MARKET_CAP_DATA, MODEL_PORTFOLIOS } from '../../data/assetRegistry';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export const AllocationPanel: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ─── GLOBAL MARKET CAP PIE ────────────────────────────────────────────── */}
      <div className="leather-card rounded-xl p-4 lg:p-6 grid lg:grid-cols-2 gap-8 items-center cursor-default">
        <div>
          <h3 className="font-bold text-lg mb-1">Global Market Capitalization</h3>
          <p className="text-sm text-text-muted mb-6">The total $375 Trillion investable universe breakdown.</p>
          
          <div className="space-y-3">
            {GLOBAL_MARKET_CAP_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-semibold group-hover:text-primary transition-colors">{item.name}</span>
                </div>
                <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
                  <span className="text-xs font-mono text-text-muted">{item.percent}</span>
                  <span className="text-sm font-mono font-bold w-16 text-right">${item.value}T</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="h-[300px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={GLOBAL_MARKET_CAP_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {GLOBAL_MARKET_CAP_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value: any) => [`$${value}T`, 'Market Cap']}
                contentStyle={{ backgroundColor: '#171717', borderColor: '#2a2a2a', color: '#f4f4f5', borderRadius: '10px', border: '1px solid #2a2a2a', padding: '10px 14px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#f4f4f5', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#a1a1aa' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── MODEL PORTFOLIOS ─────────────────────────────────────────────────── */}
      <div className="leather-card rounded-xl p-4 lg:p-6">
        <h3 className="font-bold text-lg mb-1">Institutional Model Portfolios</h3>
        <p className="text-sm text-text-muted mb-6">Standard structural allocations across 4 risk mandates.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODEL_PORTFOLIOS.map((portfolio, idx) => (
            <div key={idx} className="bg-surface border border-border rounded-xl p-5 hover:border-primary/50 hover:bg-surface-alt transition-colors duration-300 group flex flex-col">
              {/* Header */}
              <div className="mb-3 flex-grow">
                <h4 className="font-bold text-base text-primary mb-1">{portfolio.name}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{portfolio.description}</p>
              </div>
              {/* Target Return */}
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-background rounded-lg border border-border/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Target Return</span>
                <span className="font-mono font-bold text-sm text-emerald-400 ml-auto">{portfolio.expectedReturn}</span>
              </div>
              
              {/* Stacked Bar */}
              <div className="mt-5 mb-3 flex h-3 rounded-full overflow-hidden w-full">
                {portfolio.allocations.map((alloc, i) => (
                  <div 
                    key={i} 
                    style={{ width: `${alloc.pct}%`, backgroundColor: alloc.color }} 
                    className="h-full hover:brightness-110 transition-[filter] cursor-crosshair"
                    title={`${alloc.asset}: ${alloc.pct}%`}
                  />
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                {portfolio.allocations.map((alloc, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: alloc.color }} />
                    <span className="text-[11px] font-bold text-text-muted">{alloc.asset} <span className="font-mono text-text">{alloc.pct}%</span></span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

