import React, { useState } from 'react';
import { ChevronDown, Shield, CheckCircle, XCircle, Info } from 'lucide-react';
import { CoinvestoAIScoreBadge } from './CoinvestoAIScoreBadge';
import { RiskFlags } from './RiskFlags';
import { ExchangeProfile } from '../../data/exchanges';

interface ExchangeCardProps {
  exchange: ExchangeProfile;
  rank: number;
}

export const ExchangeCard: React.FC<ExchangeCardProps> = ({ exchange, rank }) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedPros, setExpandedPros] = useState(false);
  const [expandedCons, setExpandedCons] = useState(false);

  const formatFee = (fee: number): string => {
    if (fee < 0) return `${(fee * 100).toFixed(3)}% (rebate)`;
    if (fee === 0) return '0.00%';
    return `${(fee * 100).toFixed(3)}%`;
  };

  const getFeeStatus = (fee: number, isTaker: boolean, isPerp: boolean) => {
    if (fee < 0) return { color: 'text-emerald-400', indicator: 'bg-emerald-400' };
    if (fee === 0) return { color: 'text-emerald-400', indicator: 'bg-emerald-400' };
    
    // Different standards for Spot vs Perp
    const low = isPerp ? (isTaker ? 0.0004 : 0.0001) : (isTaker ? 0.0008 : 0.0005);
    const high = isPerp ? (isTaker ? 0.0006 : 0.0003) : (isTaker ? 0.0015 : 0.0010);

    if (fee <= low) return { color: 'text-emerald-400', indicator: 'bg-emerald-400' };
    if (fee <= high) return { color: 'text-amber-400', indicator: 'bg-amber-400' };
    return { color: 'text-red-400', indicator: 'bg-red-400' };
  };

  const spotTakerStatus = getFeeStatus(exchange.fees.spotTaker, true, false);

  return (
    <div
      id={exchange.id}
      className={`leather-card rounded-2xl p-5 flex flex-col relative overflow-hidden transition-all duration-500 group scroll-mt-24 cursor-pointer border-t-2 ${
        exchange.grade === 'INSTITUTIONAL' ? 'border-t-primary' 
        : exchange.grade === 'PROFESSIONAL' ? 'border-t-emerald-500/50'
        : 'border-t-yellow-500/50'
      } ${expanded ? 'bg-primary/5 shadow-2xl shadow-primary/5' : 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5'}`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Premium Pulse Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

      {/* Clickable Header Area */}
      <div 
        className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full"
      >
        {/* Left Side: Rank, Name, Grade */}
        <div className="w-full md:w-1/3 flex-shrink-0 flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-background/50 border border-border text-sm font-black text-text-muted shadow-inner flex-shrink-0 group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
            {rank}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-sm block group-hover:text-primary transition-colors">{exchange.name}</span>
            <span className="text-[11px] text-text-muted block truncate">{exchange.bestFor}</span>
            <div className="mt-1 inline-block">
               <CoinvestoAIScoreBadge score={exchange.coinvestoAIScore} grade={exchange.grade} size="sm" />
            </div>
          </div>
        </div>

        {/* Right Side: Stats & Expand */}
        <div className="w-full md:w-2/3 flex items-center justify-between">
           {/* Key Stats Strip */}
           <div className="hidden md:flex items-center gap-6 xl:gap-8 w-full justify-end pr-4">
            <div className="text-center group/stat hover:bg-surface-alt p-1.5 rounded-lg transition-colors border border-transparent hover:border-border">
              <p className="text-[10px] text-text-muted uppercase font-bold">Taker Fee</p>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${spotTakerStatus.indicator} shadow-[0_0_4px_currentColor] opacity-70 group-hover/stat:opacity-100 transition-opacity`}></span>
                <p className={`font-mono font-bold text-xs ${spotTakerStatus.color}`}>{formatFee(exchange.fees.spotTaker)}</p>
              </div>
            </div>
            <div className="text-center group/stat hover:bg-surface-alt p-1.5 rounded-lg transition-colors border border-transparent hover:border-border">
              <p className="text-[10px] text-text-muted uppercase font-bold">US Access</p>
              <p className={`font-bold text-xs mt-0.5 ${
                exchange.usPersonsEligible === true ? 'text-emerald-400'
                : exchange.usPersonsEligible === 'LIMITED' ? 'text-amber-400'
                : 'text-red-400'
              }`}>
                {exchange.usPersonsEligible === true ? 'Yes'
                  : exchange.usPersonsEligible === 'LIMITED' ? 'Limited'
                  : 'No'}
              </p>
            </div>
            <div className="text-center group/stat hover:bg-surface-alt p-1.5 rounded-lg transition-colors border border-transparent hover:border-border">
              <p className="text-[10px] text-text-muted uppercase font-bold">Risk Flags</p>
              <p className={`font-bold text-xs mt-0.5 ${
                exchange.riskFlags.length === 0 ? 'text-emerald-400'
                : exchange.riskFlags.some(f => f.includes('⚠️')) ? 'text-red-400'
                : 'text-amber-400'
              }`}>
                {exchange.riskFlags.length === 0 ? 'None' : `${exchange.riskFlags.length}`}
              </p>
            </div>
          </div>
          
          <div className="text-text-muted group-hover:text-primary transition-colors p-2 shrink-0 ml-auto md:ml-0 flex items-center justify-center min-w-[44px] min-h-[44px]">
            <ChevronDown
              size={24}
              className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="w-full mt-5 pt-5 border-t border-border space-y-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
          {/* Summary */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1">
               <Info size={12} /> Exchange Profile Summary
            </div>
            <p className="text-sm text-text leading-relaxed">
              {exchange.summary}
            </p>
          </div>

          {/* Risk Flags */}
          {exchange.riskFlags.length > 0 && (
            <RiskFlags flags={exchange.riskFlags} />
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Fee Table */}
             <div className="bg-background rounded-xl p-4 border border-border h-fit">
               <h4 className="font-bold text-[10px] uppercase tracking-widest text-text-muted mb-3">
                 Fee Structure
               </h4>
               <div className="grid grid-cols-2 gap-3">
                 {[
                   { label: 'Spot Maker', value: formatFee(exchange.fees.spotMaker), status: getFeeStatus(exchange.fees.spotMaker, false, false) },
                   { label: 'Spot Taker', value: formatFee(exchange.fees.spotTaker), status: getFeeStatus(exchange.fees.spotTaker, true, false) },
                   { label: 'Perp Maker', value: formatFee(exchange.fees.perpMaker), status: getFeeStatus(exchange.fees.perpMaker, false, true) },
                   { label: 'Perp Taker', value: formatFee(exchange.fees.perpTaker), status: getFeeStatus(exchange.fees.perpTaker, true, true) }
                 ].map(item => (
                    <div key={item.label} className="flex flex-col items-center justify-center p-3 bg-surface rounded-lg border border-border hover:border-primary/50 transition-colors cursor-default group/fee relative overflow-hidden min-h-[60px]">
                     {/* subtle background tint based on status */}
                     <div className={`absolute inset-0 opacity-0 group-hover/fee:opacity-5 transition-opacity ${item.status.indicator}`}></div>
                     <p className="text-[9px] text-text-muted font-bold uppercase mb-1 relative z-10">{item.label}</p>
                     <div className="flex items-center gap-1.5 relative z-10">
                       <span className={`w-1.5 h-1.5 rounded-full ${item.status.indicator} shadow-[0_0_4px_currentColor] opacity-70 group-hover/fee:opacity-100 transition-opacity`}></span>
                       <p className={`font-mono font-bold text-xs ${item.status.color}`}>
                         {item.value}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Pros & Cons */}
             <div className="space-y-4">
               <div>
                 <h4 className="font-bold text-[10px] uppercase tracking-widest text-emerald-400 mb-2">
                   Advantages
                 </h4>
                 <ul className="space-y-1.5">
                   {exchange.pros.slice(0, expandedPros ? exchange.pros.length : 3).map((pro, i) => (
                     <li key={i} className="flex items-start gap-1.5 text-xs text-text-muted">
                       <CheckCircle size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                       <span className="leading-tight">{pro}</span>
                     </li>
                   ))}
                    {exchange.pros.length > 3 && !expandedPros && (
                      <li 
                        className="text-xs text-primary font-bold italic ml-4 py-2 cursor-pointer hover:underline"
                        onClick={(e) => { e.stopPropagation(); setExpandedPros(true); }}
                      >
                        + {exchange.pros.length - 3} more
                      </li>
                    )}
                    {exchange.pros.length > 3 && expandedPros && (
                      <li 
                        className="text-xs text-text-muted font-bold italic ml-4 py-2 cursor-pointer hover:underline"
                        onClick={(e) => { e.stopPropagation(); setExpandedPros(false); }}
                      >
                        Show less
                      </li>
                    )}
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold text-[10px] uppercase tracking-widest text-red-400 mb-2">
                   Limitations
                 </h4>
                 <ul className="space-y-1.5">
                   {exchange.cons.slice(0, expandedCons ? exchange.cons.length : 3).map((con, i) => (
                     <li key={i} className="flex items-start gap-1.5 text-xs text-text-muted">
                       <XCircle size={12} className="text-red-400 mt-0.5 shrink-0" />
                       <span className="leading-tight">{con}</span>
                     </li>
                   ))}
                   {exchange.cons.length > 3 && !expandedCons && (
                     <li 
                       className="text-xs text-primary font-bold italic ml-4 py-2 cursor-pointer hover:underline"
                       onClick={(e) => { e.stopPropagation(); setExpandedCons(true); }}
                     >
                       + {exchange.cons.length - 3} more
                     </li>
                   )}
                   {exchange.cons.length > 3 && expandedCons && (
                     <li 
                       className="text-xs text-text-muted font-bold italic ml-4 py-2 cursor-pointer hover:underline"
                       onClick={(e) => { e.stopPropagation(); setExpandedCons(false); }}
                     >
                       Show less
                     </li>
                   )}
                 </ul>
               </div>
             </div>
          </div>
          
          {/* Regulatory Licenses */}
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-text-muted mb-2">
              Regulatory Licenses
            </h4>
            <div className="flex flex-wrap gap-2">
              {exchange.regulatoryLicenses.map((license, i) => (
                <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-background
                  border border-border rounded-md text-[10px] font-bold">
                  <Shield size={10} className="text-primary" />
                  {license}
                </span>
              ))}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};
