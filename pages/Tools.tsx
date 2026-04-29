import { PageMeta, toolsPageSchema } from '../components/PageMeta';
import React, { useState, useEffect } from 'react';

import {
  Calculator, DollarSign, TrendingUp, TrendingDown, AlertTriangle,
  BarChart3, PieChart, Activity, Search, Shield,
  LineChart, Sparkles, Globe, Target, Calendar
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MobilePageCategories } from '../components/MobilePageCategories';


// Existing Tools
import { DCACalculator } from '../components/tools/Tier3/DCACalculator';
import { ROICalculator } from '../components/tools/Tier3/ROICalculator';
import { ILCalculator } from '../components/tools/Tier3/ILCalculator';

import { AssetSimulator } from '../components/tools/Tier1/AssetSimulator';
import { RebalancingCalculator } from '../components/tools/Tier1/RebalancingCalculator';
import { DrawdownAnalyzer } from '../components/tools/Tier2/DrawdownAnalyzer';
import { BetaAlphaCalculator } from '../components/tools/Tier2/BetaAlphaCalculator';
import { OnChainValuation } from '../components/tools/Tier3/OnChainValuation';
import { FixedIncomeCalculator } from '../components/tools/Tier4/FixedIncomeCalculator';
import { DividendScreener } from '../components/tools/Tier4/DividendScreener';
import { InflationAdjusted } from '../components/tools/Tier4/InflationAdjusted';
import { ForexHeatMap } from '../components/tools/Tier4/ForexHeatMap';
import { MonteCarloSimulator } from '../components/tools/Tier5/MonteCarloSimulator';
import { RiskAdjustedReturns } from '../components/tools/Tier5/RiskAdjustedReturns';
import { MacroRegimeIndicator } from '../components/tools/Tier5/MacroRegimeIndicator';

import RelativeUnrealizedProfit from '../components/tools/onchain/RelativeUnrealizedProfit';

// Tool Registry
export type ToolTier = 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4' | 'Tier 5';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tier: ToolTier;
  category: string;
  isPro: boolean;
  component: React.FC | null; // null means under construction
}

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // Tier 1
  { id: 'allocation-sim', name: 'Asset Allocation Simulator', description: 'Backtest portfolio allocations across crypto and traditional assets.', icon: <PieChart size={18} />, tier: 'Tier 1', category: 'Portfolio Construction', isPro: false, component: AssetSimulator },
  { id: 'rebalancer', name: 'Rebalancing Simulator', description: 'Simulate adjustments needed to restore target portfolio weights.', icon: <Target size={18} />, tier: 'Tier 1', category: 'Portfolio Construction', isPro: false, component: RebalancingCalculator },
  
  // Tier 2
  { id: 'drawdown', name: 'Drawdown Analyzer', description: 'Analyze historical underwater equity curves and recovery durations.', icon: <TrendingDown size={18} />, tier: 'Tier 2', category: 'Risk Analytics', isPro: false, component: DrawdownAnalyzer },
  { id: 'beta-alpha', name: 'Beta & Alpha Calculator', description: 'Measure systematic risk and excess returns relative to benchmarks.', icon: <BarChart3 size={18} />, tier: 'Tier 2', category: 'Risk Analytics', isPro: false, component: BetaAlphaCalculator },
  { id: 'dca', name: 'DCA Strategy Simulator', description: 'Project portfolio value over time using dollar-cost averaging.', icon: <DollarSign size={18} />, tier: 'Tier 2', category: 'Risk Analytics', isPro: false, component: DCACalculator },
  
  // Tier 3
  { id: 'on-chain-valuation', name: 'Bitcoin On-Chain Valuation', description: 'Fidelity/ARK style models: S2F, MVRV Z-Score, Realized Price.', icon: <Globe size={18} />, tier: 'Tier 3', category: 'Crypto Analytics', isPro: false, component: OnChainValuation },
  { id: 'roi', name: 'ROI & Trade Simulator', description: 'Model hypothetical returns, break-even points, and annualized performance with fees.', icon: <TrendingUp size={18} />, tier: 'Tier 3', category: 'Crypto Analytics', isPro: false, component: ROICalculator },
  { id: 'il', name: 'Impermanent Loss Simulator', description: 'Simulate LP impermanent loss and break-even thresholds.', icon: <AlertTriangle size={18} />, tier: 'Tier 3', category: 'Crypto Analytics', isPro: false, component: ILCalculator },
  
  // Tier 4
  { id: 'fixed-income', name: 'Fixed Income Yield Simulator', description: 'Simulate YTM, Macaulay duration, and convexity for bonds.', icon: <LineChart size={18} />, tier: 'Tier 4', category: 'Traditional Assets', isPro: false, component: FixedIncomeCalculator },
  { id: 'dividend-screen', name: 'Yield & Income Screener', description: 'Rank TradFi dividend yields alongside DeFi stablecoin APYs.', icon: <Search size={18} />, tier: 'Tier 4', category: 'Traditional Assets', isPro: false, component: DividendScreener },
  { id: 'inflation-adj', name: 'Inflation-Adjusted Returns', description: 'Calculate real purchasing power by offsetting nominal CPI inflation.', icon: <Activity size={18} />, tier: 'Tier 4', category: 'Traditional Assets', isPro: false, component: InflationAdjusted },

  { id: 'forex-heatmap', name: 'Forex Heat Map', description: 'Cross-currency strength matrix across 28 major pairs. Real-time visualization for DXY and macro analysis.', icon: <Globe size={18} />, tier: 'Tier 4', category: 'Traditional Assets', isPro: false, component: ForexHeatMap },
  
  // Tier 5
  { id: 'monte-carlo', name: 'Monte Carlo Simulator', description: '10,000 geometric Brownian motion paths forecasting target probability.', icon: <Sparkles size={18} />, tier: 'Tier 5', category: 'Advanced Pro Tools', isPro: false, component: MonteCarloSimulator },
  { id: 'risk-adjusted', name: 'Sharpe & Sortino Simulator', description: 'Comprehensive risk-adjusted return suite evaluating portfolio efficiency.', icon: <Shield size={18} />, tier: 'Tier 5', category: 'Advanced Pro Tools', isPro: false, component: RiskAdjustedReturns },
  { id: 'macro-regime', name: 'Macro Regime Indicator', description: '4-quadrant Growth/Inflation matrix illustrating economic environment shifts.', icon: <Globe size={18} />, tier: 'Tier 5', category: 'Advanced Pro Tools', isPro: false, component: MacroRegimeIndicator },

  
  // On-Chain Analytics
  { id: 'rup', name: 'Relative Unrealized Profit', description: 'Measure total unrealized profit held by all BTC market participants relative to market cap.', icon: <TrendingUp size={18} />, tier: 'Tier 3', category: 'Crypto Analytics', isPro: false, component: RelativeUnrealizedProfit },
];

const PlaceholderTool: React.FC<{ tool: ToolDefinition }> = ({ tool }) => (
  <div className="flex flex-col items-center justify-center p-16 bg-surface border border-border rounded-xl border-dashed">
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
      <Calculator size={32} />
    </div>
    <h3 className="text-2xl font-bold mb-2">Building {tool.name}...</h3>
    <p className="text-text-muted text-center max-w-md">
      This quantitative tool is currently being developed and will be deployed shortly. It is part of the '{tool.category}' suite.
    </p>
  </div>
);


import { PageRoute } from '../types';

export interface ToolsProps {
  onNavigate?: (route: PageRoute) => void;
}

export const Tools: React.FC<ToolsProps> = ({ onNavigate }) => {
  const { setActiveSubMenu, activeSubMenu, setPageCategories } = useAppContext();
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  // Scroll top on navigate
  useEffect(() => {
    window.scrollTo(0, 0);
    // Automatically show the relevant menu if not already open
    if (activeSubMenu !== 'Tools & Calculators') {
       setActiveSubMenu('Tools & Calculators');
    }

    const categories = TOOLS_REGISTRY.map(tool => ({
      label: tool.name,
      icon: tool.icon,
      active: activeToolId === tool.id,
      onClick: () => {
         setActiveToolId(tool.id);
         window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }));

    setPageCategories([
      {
         label: 'Tools Dashboard',
         icon: <Calculator size={18} />,
         active: activeToolId === null,
         onClick: () => {
           setActiveToolId(null);
           window.scrollTo({ top: 0, behavior: 'smooth' });
         }
      },
      ...categories
    ]);

    return () => setPageCategories([]);
  }, [setActiveSubMenu, activeSubMenu, activeToolId, setPageCategories]);

  const activeTool = TOOLS_REGISTRY.find(t => t.id === activeToolId);
  const ActiveComponent = activeTool?.component || null;

  const handleBackToDashboard = () => {
    setActiveToolId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View: Single Tool
  if (activeTool) {
    return (
      <div className="animate-fade-in pb-12">
      <PageMeta title={`${activeTool.name} | Coinvestopedia Simulators`} description={activeTool.description} structuredData={toolsPageSchema} />



        <div className="mb-8 border-b border-border pb-6">
          <button 
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-bold uppercase tracking-wider mb-6 group"
          >
            <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
              <span className="text-[10px]">←</span>
            </div>
            Back to Tools Dashboard
          </button>

          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
             <span className="text-primary">{activeTool.category}</span>
             <span>•</span>
             <span>{activeTool.tier}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-3 flex items-center gap-3">
             <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">{activeTool.icon}</div>
             {activeTool.name}

          </h1>
          <p className="text-text-muted text-lg">{activeTool.description}</p>
        </div>

        <MobilePageCategories />

        {ActiveComponent ? <ActiveComponent /> : <PlaceholderTool tool={activeTool} />}
      </div>
    );
  }

  // View: Dashboard Grid
  const categories = Array.from(new Set(TOOLS_REGISTRY.map(t => t.category)));

  return (
    <div className="animate-fade-in pb-16">
      <PageMeta 
        title="Crypto & Investment Simulators" 
        description="Institutional-grade financial simulators: ROI, DCA, Sharpe ratio, and position sizing. Professional quantitative support for digital assets." 
        structuredData={toolsPageSchema} 
      />



      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-border bg-gradient-to-br from-background to-surface p-8 lg:p-16 mb-12 lg:mb-20 text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-6">
            <Calculator size={16} />
            <span>Data Intelligence Engine</span>
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            Quantitative <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Decision Support</span>
          </h1>
          
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Professional-grade modelling tools and risk analytics. 
            All models execute locally in real-time for maximum privacy and performance.
          </p>
        </div>
      </section>

      <MobilePageCategories />





      <div className="space-y-16">
        {categories.map(category => {
          const catTools = TOOLS_REGISTRY.filter(t => t.category === category);
          return (
            <div key={category} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-bold font-heading uppercase tracking-[0.25em] text-text-muted whitespace-nowrap">
                   {category}
                </h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-border/50 to-transparent" />
                <span className="text-[10px] font-bold text-text-muted/50 border border-border/50 px-2 py-0.5 rounded uppercase tracking-widest">
                   {catTools.length} Models
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {catTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveToolId(tool.id)}
                    className="flex flex-col text-left p-6 rounded-2xl border border-border bg-surface dark:bg-[#111114] hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-[#16161a] transition-colors transition-transform duration-300 group h-full relative overflow-hidden shadow-lg hover:shadow-primary/5 active:scale-[0.98] transform-gpu"
                  >
                    {/* Top row: Icon + Tier/Status */}
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 rounded-xl bg-background dark:bg-[#18181b] border border-border flex items-center justify-center text-text-muted group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/30 transition-colors duration-300 shadow-inner">
                         {tool.icon}
                       </div>
                       <div className="flex flex-col items-end gap-1.5">
                         <span className="text-[9px] font-extrabold text-text-muted/40 uppercase tracking-widest">{tool.tier}</span>

                         {tool.component === null && (
                           <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                             Draft
                           </span>
                         )}
                       </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 flex-grow">
                      <h3 className="font-bold text-lg text-text group-hover:text-primary transition-colors leading-tight flex items-center gap-1.5">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed whitespace-normal">
                        {tool.description}
                      </p>
                    </div>
                    
                    {/* Bottom action bar */}
                    <div className="mt-8 flex items-center justify-between pointer-events-none">
                       <span className="text-[10px] font-bold text-text-muted/40 group-hover:text-primary/70 transition-colors uppercase tracking-[0.1em]">Open Simulator</span>
                       <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors duration-300">
                          <Calculator size={12} className="text-text-muted/40 group-hover:text-primary transition-colors" />
                       </div>
                    </div>

                    {/* Animated hover border glow */}
                    <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 rounded-2xl pointer-events-none transition-colors duration-500" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          Economic Calendar — TradingView Widget
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-6 mt-16">
        {/* Section Header — matches existing section header pattern */}
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold font-heading uppercase tracking-[0.25em] text-text-muted whitespace-nowrap">
            Economic Calendar
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-border/50 to-transparent" />
          <span className="text-[10px] font-bold text-text-muted/50 border border-border/50 px-2 py-0.5 rounded uppercase tracking-widest">
            Powered by TradingView
          </span>
        </div>
        <p className="text-sm text-text-muted font-body -mt-2">
          Live macro event tracking powered by TradingView · Fed · ECB · CPI · NFP · GDP
        </p>

        {/* Economic Calendar Widget — full-width */}
        <div className="leather-card rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Calendar size={16} />
                </div>
                <h3 className="font-sans font-semibold text-sm text-text tracking-tight">
                  Economic Calendar
                </h3>
              </div>
              <p className="text-[11px] text-text-muted mt-1 font-body">
                Global macro events · Fed, ECB, CPI, NFP, GDP releases
              </p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded bg-amber-500/10 text-amber-500 font-medium border border-amber-500/20 uppercase tracking-widest">
              Macro
            </span>
          </div>
          {/* Description */}
          <div className="px-5 py-3 border-b border-border">
            <p className="text-sm text-text-muted font-body leading-relaxed">
              Institutional-grade macro event calendar. Tracks all high-impact economic releases — Fed rate decisions, CPI prints, NFP, GDP, PMI. Color-coded by impact level: high / medium / low.
            </p>
          </div>
          {/* iframe */}
          <div className="w-full bg-white overflow-x-auto">
            <iframe
              src={`https://www.tradingview.com/embed-widget/events/?locale=en#${encodeURIComponent(JSON.stringify({"colorTheme":"dark","isTransparent":false,"width":"100%","height":"500","importanceFilter":"-1,0,1","currencyFilter":"USD,EUR,GBP,JPY,CNY"}))}`}
              title="TradingView Economic Calendar"
              style={{ minWidth: '600px', width: '100%', display: 'block', border: 'none' }}
              height={500}
              scrolling="no"
              loading="lazy"
              frameBorder={0}
            />
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-border flex-wrap gap-2 bg-surface/40">
            <span className="text-[10px] text-text-muted font-body">
              Calendar by TradingView · USD · EUR · GBP · JPY · CNY
            </span>
            <a
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-text-muted hover:text-primary transition-colors font-body"
            >
              tradingview.com ↗
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};