import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Info, ChevronDown } from 'lucide-react';

// ─── Info Tooltip Component (Portal-based to escape leather-card stacking context) ─
const InfoTooltip: React.FC<{ text: React.ReactNode; isOpen?: boolean; onToggle?: (state: boolean) => void }> = ({ text, isOpen, onToggle }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 250 });
  
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = useCallback((v: boolean) => {
    if (onToggle) onToggle(v);
    setInternalOpen(v);
  }, [onToggle]);

  // Position the tooltip below the button, aligned to the input field wrapper
  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const btn = buttonRef.current;
    const wrapper = btn.closest('.input-field-wrapper') as HTMLElement | null;
    const rect = wrapper ? wrapper.getBoundingClientRect() : btn.getBoundingClientRect();
    setPos({
      top: rect.bottom + 6 + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (tooltipRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  // Close on scroll/resize
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open, setOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => { e.preventDefault(); setOpen(!open); }}
        className="focus:outline-none flex items-center justify-center text-text-muted hover:text-primary transition-colors p-1 -m-1"
      >
        <Info size={12} />
      </button>
      {open && ReactDOM.createPortal(
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: pos.width,
            zIndex: 999999,
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 20px 80px rgba(0,0,0,1)',
            fontSize: '12px',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Info size={14} style={{ color: '#10b981' }} />
            <span style={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10b981' }}>Info</span>
          </div>
          <p style={{ color: '#ffffff', fontWeight: 500, fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{text}</p>
        </div>,
        document.body
      )}
    </>
  );
};

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
}> = ({ label, value, onChange, type = 'number', prefix, suffix, helpText, min, max, step, options }) => {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
  <div 
    className={`input-field-wrapper relative flex flex-col gap-1.5 min-w-0 transition-colors transition-shadow ${infoOpen ? 'ring-1 ring-primary/20 bg-primary/5 rounded-lg' : 'hover:z-[90] focus-within:z-[90]'}`}
    style={{ zIndex: infoOpen ? 9999 : undefined }}
  >
    <div className="relative flex items-center justify-center gap-2 z-20">
      <label className="text-xs font-bold text-text-muted/80 uppercase tracking-widest text-center">{label}</label>
      {helpText && <InfoTooltip text={helpText} isOpen={infoOpen} onToggle={setInfoOpen} />}
    </div>
    
    <div className="relative group">
      {options ? (
        <>
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-input-bg dark:bg-[#18181b] border border-border rounded-lg py-2.5 px-4 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer transition-colors transition-shadow hover:border-text-muted/50 text-center"
          >
            {options.map(o => <option key={o.value} value={o.value} className="text-center">{o.label}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
            <ChevronDown size={14} />
          </div>
        </>
      ) : (
        <div className="flex items-center relative">
          {prefix && (
            <div className="absolute left-2.5 text-text-muted text-sm font-medium pointer-events-none">
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
            className={`w-full bg-input-bg/60 dark:bg-[#18181b]/60 backdrop-blur-md border border-border/80 rounded-lg py-2.5 text-sm font-medium text-text focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none transition-colors transition-shadow hover:border-text-muted/60 text-center px-4`}
          />
          {suffix && (
            <div className="absolute right-3.5 text-text-muted text-[10px] font-extrabold uppercase tracking-widest pointer-events-none bg-input-bg dark:bg-[#18181b] pl-1">
               {suffix}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  );
};

// ─── Result Metric ─────────────────────────────────────────────────────────────
export const ResultMetric: React.FC<{ 
  label: string; 
  value: string | number; 
  sub?: string; 
  positive?: boolean; 
  negative?: boolean; 
  large?: boolean; 
  neutral?: boolean;
  centered?: boolean;
}> = ({ label, value, sub, positive, negative, large, centered = true }) => {
  const getStringValue = (): string => {
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return value.toString();
      return '';
  };
  
  const valStr = getStringValue();
  const charLength = valStr.length; // use complete string length as stronger baseline
  
  // Stricter sizing logic based on full string length (including symbols like +$ %)
  const isExtremelyLarge = charLength >= 12;
  const isLargeNumber = charLength >= 9;
  const isMediumNumber = charLength >= 7; 

  return (
    <div className={`p-4 rounded-xl border border-border bg-surface dark:bg-[#18181b] hover:border-primary/40 hover:bg-primary/5 dark:hover:bg-[#1a1a1e] transition-colors group flex flex-col ${centered ? 'items-center text-center' : ''}`}
      title={valStr}
    >
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
      <div className={`flex items-baseline gap-1.5 min-w-0 flex-wrap mt-auto ${centered ? 'justify-center w-full' : ''}`}>
        <p className={`font-bold font-heading transition-colors leading-tight truncate overflow-hidden max-w-full
          ${isExtremelyLarge ? 'text-xs sm:text-sm tracking-tighter' : 
            isLargeNumber ? 'text-sm sm:text-base tracking-tight' : 
            isMediumNumber ? 'text-base sm:text-lg tracking-tight' : 
            (large ? 'text-xl lg:text-2xl tracking-tight' : 'text-lg')}
          ${positive ? 'text-emerald-400 group-hover:text-emerald-300' : negative ? 'text-red-400 group-hover:text-red-300' : 'text-text group-hover:text-primary'}
        `}>
          {value}
        </p>
        {sub && <span className={`text-[10px] font-bold text-text-muted/70 whitespace-normal mt-1 w-full ${centered ? 'text-center' : ''}`}>{sub}</span>}
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
export const ProGate: React.FC<{ children: React.ReactNode; title: string; description: string }> = ({ children }) => {
  return <>{children}</>;
};

