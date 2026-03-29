import React from 'react';
import { Lock, Info, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

// ─── Shared Input Component ───────────────────────────────────────────────────
export const InputField: React.FC<{
  label: string; 
  value: string | number; 
  onChange: (v: string) => void;
  type?: string; 
  prefix?: React.ReactNode; 
  suffix?: string; 
  helpText?: React.ReactNode;
  min?: number; 
  max?: number; 
  step?: number; 
  options?: { value: string; label: string }[];
}> = ({ label, value, onChange, type = 'number', prefix, suffix, helpText, min, max, step, options }) => (
  <div className="flex flex-col gap-1.5 min-w-0">
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs font-bold text-text-muted/80 uppercase tracking-widest">{label}</label>
      {helpText && (
        <div className="group relative">
          <Info size={12} className="text-text-muted hover:text-primary cursor-help transition-colors" />
          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#27272a] border border-border rounded-lg text-[10px] text-text leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
            {helpText}
          </div>
        </div>
      )}
    </div>
    
    <div className="relative group">
      {options ? (
        <>
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-[#18181b] border border-border rounded-lg py-2.5 px-4 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer transition-all hover:border-text-muted/50"
          >
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
            <ChevronDown size={14} />
          </div>
        </>
      ) : (
        <div className="flex items-center relative">
          {prefix && (
            <div className="absolute left-3 text-text-muted text-sm font-medium pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            min={min} 
            max={max} 
            step={step}
            className={`w-full bg-[#18181b] border border-border rounded-lg py-2.5 text-sm font-medium text-text focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all hover:border-text-muted/50 ${prefix ? 'pl-9' : 'pl-4'} ${suffix ? 'pr-12' : 'pr-4'}`}
          />
          {suffix && (
            <div className="absolute right-3.5 text-text-muted text-[10px] font-extrabold uppercase tracking-widest pointer-events-none bg-[#18181b] pl-1">
               {suffix}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

// ─── Result Metric ─────────────────────────────────────────────────────────────
export const ResultMetric: React.FC<{
  label: string; 
  value: React.ReactNode; 
  sub?: string;
  positive?: boolean; 
  negative?: boolean; 
  large?: boolean; 
  neutral?: boolean;
}> = ({ label, value, sub, positive, negative, large, neutral }) => {
  const getStringValue = (): string => {
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return value.toString();
      return '';
  };
  
  const valStr = getStringValue();
  const numericOnly = valStr.replace(/[^0-9]/g, '');
  const isLargeNumber = numericOnly.length >= 7; // Millions+
  const isExtremelyLarge = numericOnly.length >= 9; // 100m+

  return (
    <div className="flex flex-col gap-2 px-4 py-5 bg-[#18181b] hover:bg-[#1a1a1e] border border-border rounded-xl transition-colors group min-w-[140px] shadow-sm relative h-auto min-h-fit">
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap mt-auto">
        <p className={`font-bold font-heading transition-colors group-hover:text-primary leading-tight break-words overflow-visible
          ${isExtremelyLarge ? 'text-base sm:text-lg tracking-tighter' : isLargeNumber ? 'text-lg sm:text-xl tracking-tight' : (large ? 'text-2xl lg:text-3xl tracking-tight' : 'text-xl tracking-tight')}
          ${positive ? 'text-emerald-400' : negative ? 'text-red-400' : (neutral || (!positive && !negative)) ? 'text-text' : 'text-text'}
        `}>
          {value}
        </p>
        {sub && <span className="text-[10px] font-bold text-text-muted/70 whitespace-normal">{sub}</span>}
      </div>
    </div>
  );
};

// ─── Utility Formatters ────────────────────────────────────────────────────────
export const fmt = (n: number, decimals = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
export const fmtUSD = (n: number) =>
  '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtPct = (n: number) => (n >= 0 ? '+' : '') + fmt(n) + '%';


// ─── Pro Gate Wrapper ──────────────────────────────────────────────────────────
export const ProGate: React.FC<{ children: React.ReactNode; title: string; description: string }> = ({ children, title, description }) => {
  const { isProUser } = useAppContext();

  if (isProUser) {
    return <>{children}</>;
  }

  return (
    <div className="relative group">
      <div className="blur-xl opacity-30 pointer-events-none select-none overflow-hidden h-[500px] transition-all duration-700">
         {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-20">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center mb-8 shadow-2xl backdrop-blur-md animate-float">
           <Lock size={40} className="text-amber-400" />
        </div>
        <h3 className="text-3xl font-bold font-heading mb-4 text-text drop-shadow-lg">{title}</h3>
        <p className="text-text-muted max-w-md mb-10 leading-relaxed text-sm lg:text-base">
           {description}
        </p>
        <button className="relative px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] active:scale-95 group overflow-hidden">
           <span className="relative z-10 flex items-center gap-2">
             UPGRADE TO PRO <Sparkles size={18} />
           </span>
           <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80 pointer-events-none" />
    </div>
  );
};

const Sparkles: React.FC<{size?: number}> = ({size = 16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
