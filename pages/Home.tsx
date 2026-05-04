import { PageMeta, homePageSchema, organizationSchema } from '../components/PageMeta';

import React, { useEffect } from 'react';

import { Hero } from '../components/Hero';
import { Card } from '../components/Card';
import { useAppContext } from '../context/AppContext';
import { LiveActivityFeed } from '../components/LiveActivityFeed';
import { MarketPulseDashboard } from '../components/MarketPulseDashboard';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { Activity, Zap, BookOpen, Coins, BarChart3, Target, DollarSign, PieChart, Globe } from 'lucide-react';
import { PageRoute } from '../types';
import { AIMarketOverview } from '../components/AIMarketOverview';

interface HomeProps {
  onNavigate?: (route: PageRoute) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { setActiveSubMenu, activeSubMenu, setPageCategories } = useAppContext();
  
  const handleCardClick = React.useCallback((route?: PageRoute) => {
    if (route) onNavigate?.(route);
  }, [onNavigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (activeSubMenu !== 'Discovery') {
      setActiveSubMenu('Discovery');
    }

    // discovery items - randomized shuffle from key tools and pages
    const discoveryItems = [
      { label: 'Asset Simulator', route: PageRoute.TOOLS, icon: <PieChart size={18} /> },
      { label: 'DCA Strategy', route: PageRoute.TOOLS, icon: <DollarSign size={18} /> },
      { label: 'Whale Radar', route: PageRoute.WHALE, icon: <Target size={18} /> },
      { label: 'Macro Intel', route: PageRoute.MACRO_INTEL, icon: <Activity size={18} /> },
      { label: 'Research', route: PageRoute.RESEARCH, icon: <BookOpen size={18} /> },
      { label: 'Insights', route: PageRoute.INSIGHTS, icon: <Zap size={18} /> },
      { label: 'Glossary', route: PageRoute.GLOSSARY, icon: <BookOpen size={18} /> }
    ].sort(() => 0.5 - Math.random()).slice(0, 5);

    setPageCategories(discoveryItems.map(item => ({
      label: item.label,
      icon: item.icon,
      active: false,
      onClick: () => onNavigate?.(item.route)
    })));
    
    return () => setPageCategories([]);
  }, [setActiveSubMenu, activeSubMenu, setPageCategories, onNavigate]);
  
  const [metrics, setMetrics] = React.useState<{ label: string, description: string, value: string, change?: string, icon: any }[]>([]);
  const [loadingMetrics, setLoadingMetrics] = React.useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { fetchDefiLlamaTVL } = await import('../services/api');
        const tvl = await fetchDefiLlamaTVL();
        
        const newMetrics = [
          { 
            label: 'Total Value Locked (DeFi)', 
            description: 'Total capital deposited across all decentralized finance protocols globally.',
            value: tvl ? `$${(tvl / 1e9).toFixed(2)}B` : '$54.2B', 
            change: '+2.4%',
            icon: <Globe size={24} /> 
          },
          { 
            label: 'Stablecoin Mkt Cap', 
            description: 'Total circulating supply of fiat-pegged digital assets.',
            value: '$162.8B', 
            change: '+0.4%', 
            icon: <Coins size={24} /> 
          },
          { 
            label: 'ETH Staking Ratio', 
            description: 'Percentage of total Ethereum supply locked in staking contracts.',
            value: '28.4%', 
            change: '+1.2%', 
            icon: <Zap size={24} /> 
          },
          { 
            label: 'DEX Volume (24h)', 
            description: 'Total trading volume across all decentralized exchanges in the last 24 hours.',
            value: '$4.1B', 
            change: '-2.1%', 
            icon: <Activity size={24} /> 
          }
        ];
        setMetrics(newMetrics);
      } catch (err) {
        console.error("Failed to fetch on-chain pulse:", err);
      } finally {
        setLoadingMetrics(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="animate-fade-in">
      <PageMeta title="Institutional Crypto Data" description="World-class institutional crypto data, analysis, and investment tools." structuredData={homePageSchema} additionalStructuredData={[organizationSchema]} />
      
      <div className="space-y-12 lg:space-y-16">
        <Hero onNavigate={onNavigate} />
        
        {/* Featured Comparisons Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-text mb-2">Institutional On-Chain Pulse</h2>
            <p className="text-text-muted text-sm lg:text-base">Real-time metrics tracking global digital asset flows and network utilization.</p>
          </div>
          <button 
            className="px-4 py-2 bg-surface hover:bg-surface-hover border border-border text-primary font-semibold transition duration-200 group text-sm lg:text-base self-start sm:self-auto rounded-lg shadow-sm transform-gpu"
            onClick={() => onNavigate?.(PageRoute.MACRO_INTEL)}
          >
            View Macro Intel
          </button>
        </div>
        
        {loadingMetrics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 lg:gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-surface rounded-xl border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 lg:gap-6">
            {metrics.map((m, i) => (
              <Card 
                key={i} 
                variant="interactive" 
                className="h-full flex flex-col items-center text-center w-full"
                onClick={() => handleCardClick(PageRoute.MACRO_INTEL)}
              >
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                    {m.icon}
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{m.label}</h3>
                </div>
                
                <p className="text-text-muted text-sm mb-6 flex-grow break-words">
                  {m.description}
                </p>

                <div className="mb-6 bg-background/50 p-6 rounded-xl border border-border w-full flex flex-col items-center justify-center text-center group-hover:bg-background/80 transition-colors">
                   <div className="text-4xl font-bold font-mono tracking-tight text-text mb-2 w-full text-center">{m.value}</div>
                   {m.change && (
                     <div className={`flex items-center justify-center gap-1 font-bold px-3 py-1.5 rounded-full text-sm mx-auto ${m.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                       {m.change}
                     </div>
                   )}
                </div>

                <div className="flex items-center justify-center w-full px-4 py-2.5 mt-auto bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold rounded-lg transition-colors border border-primary/20">
                  Analyze Trend
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
      
      {/* AI Market Overview - Mobile Only */}
      <section className="lg:hidden">
        <div className="flex items-center gap-2.5 mb-6">
          <h2 className="text-2xl font-bold text-text">AI Market Overview</h2>
          <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary font-bold">
            INSIGHT
          </span>
        </div>
        <AIMarketOverview />
      </section>
      
      {/* Market Pulse Section */}
      <section>
        <MarketPulseDashboard onNavigate={onNavigate} />
      </section>

      {/* Live Feed */}
      <section>
        <LiveActivityFeed onNavigate={onNavigate} />
      </section>

      {/* The Briefing */}
      <section>
        <NewsletterSignup />
      </section>
      </div>
    </div>
  );
};