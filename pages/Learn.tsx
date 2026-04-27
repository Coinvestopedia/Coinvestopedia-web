import { PageMeta } from '../components/PageMeta';


import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BookOpen, Video, FileText, PlayCircle, Star, TrendingUp, Shield, Clock, BarChart2 } from 'lucide-react';
import { TargetIcon } from '../components/AnimatedIcons';
import { PageRoute } from '../types';

import { useAppContext } from '../context/AppContext';


// --- Types & Data ---

type ResourceType = 'Video' | 'Article' | 'Guide' | 'Deep Dive' | 'Video Series';
type Level = 'Beginner' | 'Intermediate' | 'Advanced';

interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  time: string;
  level: Level;
  locked: boolean;
  desc?: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
  resources: Resource[];
  comingSoon?: boolean;
}

const KNOWLEDGE_CATEGORIES: Category[] = [
  {
    id: 'defi',
    name: 'DeFi Strategies',
    comingSoon: true,
    icon: <TrendingUp size={24} />,
    desc: 'Master decentralized finance, liquidity provision, lending protocols, and yield generation strategies.',
    resources: [
      { id: 'df-1', title: 'Yield Farming 101: Understanding Liquidity Pools', type: 'Video Series', time: '1h 20m', level: 'Beginner', locked: false, desc: 'A fundamental overview of how AMMs work and how to earn trading fees.' },
      { id: 'df-2', title: 'Flash Loans & Arbitrage Mechanics', type: 'Deep Dive', time: '45m read', level: 'Advanced', locked: true, desc: 'Technical breakdown of 0-block risk-free arbitrage opportunities.' },
      { id: 'df-3', title: 'Navigating Impermanent Loss in AMMs', type: 'Guide', time: '20m read', level: 'Intermediate', locked: false, desc: 'Mathematical modeling and hedging strategies against AMM price divergence.' },
      { id: 'df-4', title: 'Evaluating Protocol TVL & Tokenomics', type: 'Article', time: '15m read', level: 'Intermediate', locked: false, desc: 'Frameworks to analyze actual usage vs purely inflationary utility metrics.' },
    ]
  },
  {
    id: 'ta',
    name: 'Technical Analysis',
    comingSoon: true,
    icon: <TargetIcon className="w-6 h-6" />,
    desc: 'Read charts like an institutional trader using advanced indicators, order flow, and market profiling.',
    resources: [
      { id: 'ta-1', title: 'Reading Institutional Order Flow', type: 'Video', time: '40m', level: 'Advanced', locked: true, desc: 'How to use order book heatmaps to spot smart money positioning.' },
      { id: 'ta-2', title: 'Advanced Fibonacci Extensions & Retracements', type: 'Guide', time: '25m read', level: 'Intermediate', locked: false, desc: 'Proper anchor placement for structural price expansion targets.' },
      { id: 'ta-3', title: 'Volume Profile & VPVR Trading', type: 'Video Series', time: '2h 15m', level: 'Advanced', locked: true, desc: 'Finding hidden support/resistance using volume nodes.' },
      { id: 'ta-4', title: 'Spotting Wyckoff Accumulation Patterns', type: 'Article', time: '18m read', level: 'Beginner', locked: false, desc: 'Identifying composite operator footprints during sideways markets.' },
    ]
  },
  {
    id: 'sec',
    name: 'Security & Custody',
    comingSoon: true,
    icon: <Shield size={24} />,
    desc: 'Protect your digital assets with enterprise-grade operational security and custody solutions.',
    resources: [
      { id: 'sec-1', title: 'Hardware Wallet Cold Storage Best Practices', type: 'Video', time: '30m', level: 'Beginner', locked: false, desc: 'Setting up and securing physical seed phrase backups.' },
      { id: 'sec-2', title: 'Multi-Sig Wallets vs MPC Technology', type: 'Deep Dive', time: '22m read', level: 'Advanced', locked: false, desc: 'Comparing multisig contracts against Multi-Party Computation architectures.' },
      { id: 'sec-3', title: 'How to Read Smart Contract Audit Reports', type: 'Guide', time: '35m read', level: 'Intermediate', locked: true, desc: 'What red flags to look for when evaluating new DeFi protocol deposits.' },
      { id: 'sec-4', title: 'Phishing Defense & OpSec for Crypto Investors', type: 'Article', time: '12m read', level: 'Beginner', locked: false, desc: 'Common attack vectors and how to harden your personal operational security.' },
    ]
  },
  {
    id: 'psy',
    name: 'Market Psychology',
    comingSoon: true,
    icon: <BookOpen size={24} />,
    desc: 'Master the mental game of trading by recognizing cognitive biases and managing emotions.',
    resources: [
      { id: 'psy-1', title: 'Managing Fear & Greed in High Volatility', type: 'Video', time: '45m', level: 'Beginner', locked: false, desc: 'Techniques to prevent emotional decision making during 20%+ daily moves.' },
      { id: 'psy-2', title: 'Probabilistic Thinking vs Certainty Bias', type: 'Guide', time: '15m read', level: 'Intermediate', locked: false, desc: 'Why traders must think in EV (Expected Value) rather than absolute predictions.' },
      { id: 'psy-3', title: 'Building a Rule-Based Trading System', type: 'Video Series', time: '1h 30m', level: 'Advanced', locked: true, desc: 'Constructing systematic entry, invalidation, and profit taking frameworks.' },
      { id: 'psy-4', title: 'The Sunk Cost Fallacy in Altcoin Bags', type: 'Article', time: '10m read', level: 'Beginner', locked: false, desc: 'How to know when a thesis is objectively broken and a position must be cut.' },
    ]
  }
];

export interface LearnProps {
  onNavigate?: (route: PageRoute) => void;
}

export const Learn: React.FC<LearnProps> = ({ onNavigate }) => {
  const { addToast, setPageCategories, setActiveSubMenu, activeSubMenu } = useAppContext();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);





  // --- Sidebar Registration ---
  React.useEffect(() => {
    if (activeSubMenu !== 'Knowledge') {
      setActiveSubMenu('Knowledge');
    }

    const categories = [
      { id: 'research', label: 'Research & Reports', icon: <FileText size={18} />, active: false, onClick: () => onNavigate?.(PageRoute.RESEARCH) },
      { id: 'insights', label: 'Institutional Insights', icon: <TargetIcon className="w-[18px] h-[18px]" />, active: false, onClick: () => onNavigate?.(PageRoute.INSIGHTS) },
      { id: 'exchanges', label: 'Exchange Intelligence', icon: <BarChart2 size={18} />, active: false, onClick: () => onNavigate?.(PageRoute.EXCHANGES) },
      { id: 'glossary', label: 'Crypto Glossary', icon: <BookOpen size={18} />, active: false, onClick: () => onNavigate?.(PageRoute.GLOSSARY) },
      ...KNOWLEDGE_CATEGORIES.map(cat => ({
        id: cat.id,
        label: cat.name,
        icon: cat.icon,
        active: activeCategoryId === cat.id,
        comingSoon: cat.comingSoon,
        onClick: () => {
          if (cat.comingSoon) {
            addToast(`${cat.name} is coming soon to the Coinvestopedia Academy!`, 'info');
            return;
          }
          setActiveCategoryId(cat.id);
        }
      }))
    ];
    setPageCategories(categories);

    return () => {
      setPageCategories([]);
    };
  }, [activeCategoryId, setActiveSubMenu, setPageCategories, activeSubMenu]);

  // --- Scroll to Top on View Change ---
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCategoryId]);

  // --- Views ---

  if (activeCategoryId) {
    const category = KNOWLEDGE_CATEGORIES.find(c => c.id === activeCategoryId);
    if (!category || category.comingSoon) {
      if (category?.comingSoon) setActiveCategoryId(null);
      return null;
    }

    return (
      <div className="animate-fade-in space-y-8 pb-12">
      <PageMeta title="Learn Crypto" description="Educational resources and tutorials for modern cryptocurrency investing." />



        <div>
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-2xl mb-6">
            {category.icon}
          </div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">{category.name}</h1>
          <p className="text-text-muted text-lg max-w-3xl">{category.desc}</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Course Material ({category.resources.length})</h2>
          {category.resources.map(resource => (
            <Card key={resource.id} className="p-0 overflow-hidden hover:border-primary/40 transition-colors group cursor-pointer group">
              <div className="flex flex-col md:flex-row">
                {/* Visual Indicator */}
                <div className="w-full md:w-48 bg-surface border-b md:border-b-0 md:border-r border-border p-6 flex flex-col items-center justify-center gap-3 text-text-muted group-hover:text-primary transition-colors">
                  {resource.type.includes('Video') ? <PlayCircle size={32} /> : <FileText size={32} />}
                  <span className="text-xs font-bold uppercase tracking-wider">{resource.type}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-center relative">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{resource.title}</h3>
                    {resource.locked && (
                      <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-xs font-bold text-amber-500">
                        <Star size={14} /> EXCLUSIVE
                      </div>
                    )}
                  </div>
                  
                  <p className="text-text-muted text-sm mb-6 max-w-2xl">{resource.desc}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-muted">
                    <div className="flex items-center gap-1.5"><Clock size={14} /> {resource.time}</div>
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className={resource.level === 'Advanced' ? 'text-amber-500' : resource.level === 'Intermediate' ? 'text-blue-400' : 'text-green-400'} /> 
                      {resource.level}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>


      </div>
    );
  }

  // --- Main Dashboard View ---

  return (
    <div className="animate-fade-in space-y-12 lg:space-y-16 pb-12">
      <PageMeta title="Crypto Academy" description="Curated education from industry professionals." />



      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-border bg-gradient-to-br from-background to-surface p-8 lg:p-16 mb-12 lg:mb-20 text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-6">
            <BookOpen size={16} />
            <span>Digital Asset Academy</span>
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Crypto Markets</span>
          </h1>
          
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Curated education from industry professionals. Advance your understanding of digital assets, from foundational concepts to advanced institutional mechanics.
          </p>
        </div>
      </section>


      {/* Research & Reports CTA */}
      <section className="space-y-6">
         {/* Research & Reports Card */}
         <div 
           className="leather-card rounded-2xl p-8 lg:p-12 bg-gradient-to-br from-surface to-background relative overflow-hidden group cursor-pointer border border-border hover:border-primary/50 transition-colors flex flex-col md:flex-row items-center gap-8 shadow-xl"
           onClick={() => onNavigate?.(PageRoute.RESEARCH)}
         >
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>
            
            <div className="flex-shrink-0 relative z-10 w-20 h-20 bg-surface border border-border rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/5 transition-colors transition-transform transform-gpu duration-500 shadow-inner">
               <BookOpen size={40} className="group-hover:animate-pulse" />
            </div>
            
            <div className="relative z-10 flex-1 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                 Free Update
               </div>
               <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">Research & Reports</h2>
               <p className="text-text-muted md:text-lg max-w-2xl leading-relaxed">
                  Weekly on-chain market analysis and reports to guide your investment decisions. Explore deep dives from Glassnode directly here.
               </p>
            </div>
            
            <div className="relative z-10 flex-shrink-0">
               <Button variant="secondary" className="group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-colors">
                 Explore Research
               </Button>
            </div>
         </div>

         {/* Institutional Insights Card */}
         <div 
           className="leather-card rounded-2xl p-8 lg:p-12 bg-gradient-to-br from-surface to-background relative overflow-hidden group cursor-pointer border border-border hover:border-primary/50 transition-colors flex flex-col md:flex-row items-center gap-8 shadow-xl"
           onClick={() => onNavigate?.(PageRoute.INSIGHTS)}
         >
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>
            
            <div className="flex-shrink-0 relative z-10 w-20 h-20 bg-surface border border-border rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/5 transition-colors transition-transform transform-gpu duration-500 shadow-inner">
               <TargetIcon className="w-10 h-10 group-hover:animate-pulse" />
            </div>
            
            <div className="relative z-10 flex-1 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                 Deep Dives
               </div>
               <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">Institutional Insights</h2>
               <p className="text-text-muted md:text-lg max-w-2xl leading-relaxed">
                  In-depth analysis of market structure, geopolitical impacts, and regulatory frameworks reshaping digital finance.
               </p>
            </div>
            
            <div className="relative z-10 flex-shrink-0">
               <Button variant="secondary" className="group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-colors">
                 Read Insights
               </Button>
            </div>
         </div>

          {/* Coinvesto AI Score™ Exchange Intelligence Card */}
          <div 
             className="leather-card rounded-2xl p-8 lg:p-12 bg-gradient-to-br from-surface to-background relative overflow-hidden group cursor-pointer border border-border hover:border-primary/50 transition-colors flex flex-col md:flex-row items-center gap-8 shadow-xl"
             onClick={() => onNavigate?.(PageRoute.EXCHANGES)}
           >
              <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>
              
              <div className="flex-shrink-0 relative z-10 w-20 h-20 bg-surface border border-border rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/5 transition-colors transition-transform transform-gpu duration-500 shadow-inner">
                 <BarChart2 size={40} className="group-hover:animate-pulse" />
              </div>
              
              <div className="relative z-10 flex-1 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                   Coinvesto AI Score™
                 </div>
                 <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">Exchange Intelligence</h2>
                 <p className="text-text-muted md:text-lg max-w-2xl leading-relaxed">
                    Institutional-grade exchange analysis. 10+ exchanges scored across 7 proprietary AI dimensions — regulatory standing, custody architecture, and counterparty risk.
                 </p>
              </div>
              
              <div className="relative z-10 flex-shrink-0">
                 <Button variant="secondary" className="group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-colors">
                   Compare Exchanges
                 </Button>
              </div>
           </div>

          {/* Crypto Glossary Card */}
          <div 
             className="leather-card rounded-2xl p-8 lg:p-12 bg-gradient-to-br from-surface to-background relative overflow-hidden group cursor-pointer border border-border hover:border-primary/50 transition-colors flex flex-col md:flex-row items-center gap-8 shadow-xl"
             onClick={() => onNavigate?.(PageRoute.GLOSSARY)}
           >
              <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>
              
              <div className="flex-shrink-0 relative z-10 w-20 h-20 bg-surface border border-border rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/5 transition-colors transition-transform transform-gpu duration-500 shadow-inner">
                 <FileText size={40} className="group-hover:animate-pulse" />
              </div>
              
              <div className="relative z-10 flex-1 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                   Reference
                 </div>
                 <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">Crypto Glossary</h2>
                 <p className="text-text-muted md:text-lg max-w-2xl leading-relaxed">
                    Wall Street Edition — 100+ institutional-grade crypto terms with traditional finance analogies. Your complete reference guide.
                 </p>
              </div>
              
              <div className="relative z-10 flex-shrink-0">
                 <Button variant="secondary" className="group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-colors">
                   Browse Glossary
                 </Button>
              </div>
           </div>
      </section>

      {/* Categories Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="flex flex-col gap-4">
          {KNOWLEDGE_CATEGORIES.map((cat) => (
             <div 
               key={cat.id} 
               onClick={() => {
                 if (cat.comingSoon) {
                    addToast(`${cat.name} is coming soon to the Coinvestopedia Academy!`, 'info');
                    return;
                 }
                 setActiveCategoryId(cat.id);
               }}
               className={`leather-card rounded-xl p-6 flex items-center gap-6 transition-all duration-300 relative group overflow-hidden
                 ${cat.comingSoon ? 'opacity-75 cursor-not-allowed border-dashed grayscale-[0.5]' : 'cursor-pointer hover:border-primary/50'}
               `}
             >
                {cat.comingSoon && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-2 py-1 bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-tighter rounded">
                      Coming Soon
                    </span>
                  </div>
                )}
                
                <div className={`p-4 bg-surface rounded-xl text-primary transition-colors flex-shrink-0
                   ${cat.comingSoon ? '' : 'group-hover:bg-primary/20'}
                `}>
                   {cat.icon}
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-2">
                     <h3 className={`text-xl font-bold transition-colors ${cat.comingSoon ? 'text-text-muted' : 'group-hover:text-primary'}`}>
                       {cat.name}
                     </h3>
                     {cat.comingSoon && <Shield size={14} className="text-primary/50" />}
                   </div>
                   <p className="text-sm text-text-muted mt-1">{cat.resources.length} Modules & Resources</p>
                </div>
             </div>
          ))}
        </div>
      </section>




      
      <section>
         <div className="leather-card rounded-2xl p-8 lg:p-12 text-center bg-gradient-to-b from-surface to-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
               <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 rotate-12">
                  <BookOpen size={32} />
               </div>
               <h2 className="text-3xl font-bold mb-4">Test Your Knowledge</h2>
               <p className="text-text-muted mb-8">
                  Take our comprehensive 50-question assessment to identify gaps in your crypto knowledge and get personalized course recommendations.
               </p>
               <div className="relative">
                 <Button 
                   size="lg" 
                   variant="primary"
                   onClick={() => addToast('The Coinvestopedia Knowledge Assessment is launching next month! Subscribe to The Briefing for updates.', 'info')}
                   className="shadow-xl opacity-80"
                 >
                   Join Assessment Waitlist
                 </Button>
                 <div className="absolute -top-3 -right-3 z-20">
                   <span className="px-2 py-1 bg-primary text-background text-[10px] font-black uppercase tracking-tighter rounded shadow-lg">
                     Coming Soon
                   </span>
                 </div>
               </div>
            </div>
         </div>
      </section>


    </div>
  );
};

export default Learn;
