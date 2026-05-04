import React, { useEffect } from 'react';


import { PageMeta } from '../components/PageMeta';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { Card } from '../components/Card';
import { 
  Sparkles, Globe, BarChart3, Shield, Clock, 
  FileText, Layers, ArrowRight, BookOpen,
  Calculator, PieChart, Target, Activity
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PageRoute } from '../types';


export interface NewsletterProps {
  onNavigate?: (route: PageRoute) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onNavigate }) => {


  const { setActiveSubMenu, activeSubMenu, setPageCategories } = useAppContext();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (activeSubMenu !== 'Discovery') {
       setActiveSubMenu('Discovery');
    }

    const discoveryItems = [
      { label: 'DCA Calculator', route: PageRoute.TOOLS, icon: <Calculator size={18} /> },
      { label: 'Monte Carlo', route: PageRoute.TOOLS, icon: <PieChart size={18} /> },
      { label: 'Whale Tracker', route: PageRoute.WHALE, icon: <Target size={18} /> },
      { label: 'Market Archive', route: PageRoute.MACRO_INTEL, icon: <Activity size={18} /> },
      { label: 'Research Reports', route: PageRoute.RESEARCH, icon: <BookOpen size={18} /> }
    ].sort(() => 0.5 - Math.random());

    setPageCategories(discoveryItems.map(item => ({
      label: item.label,
      icon: item.icon,
      active: false,
      onClick: () => {} 
    })));

    return () => setPageCategories([]);
  }, [setActiveSubMenu, activeSubMenu, setPageCategories]);

  const contentPillars = [
    {
      icon: <Globe size={22} />,
      title: 'Macro Context',
      description: 'Central bank movements, rate decisions, and liquidity shifts that shape digital asset markets — distilled from institutional sources.'
    },
    {
      icon: <BarChart3 size={22} />,
      title: 'Cross-Asset Lens',
      description: 'How digital assets sit within the broader capital markets landscape — equities, commodities, forex, and fixed income context.'
    },
    {
      icon: <Layers size={22} />,
      title: 'On-Chain Data',
      description: 'Whale movements, exchange flows, and network metrics presented in traditional finance language — no jargon.'
    },
    {
      icon: <Shield size={22} />,
      title: 'Regulatory Landscape',
      description: 'Global regulatory developments from the SEC, MiCA, VARA, and beyond — curated for relevance.'
    }
  ];

  return (
    <div className="animate-fade-in pb-12">
      <PageMeta
        title="The Briefing — Weekly Research Digest | Coinvestopedia"
        description="A curated weekly digest of macro, digital asset, and cross-market context for finance professionals. No jargon. No hype. Just information."
        canonical="/newsletter"
        keywords="crypto research digest, institutional briefing, digital asset research, macro crypto context"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-border bg-gradient-to-br from-background to-surface mb-12 lg:mb-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/3 rounded-full translate-y-32 -translate-x-32 blur-3xl"></div>
        
        <div className="relative z-10 p-8 lg:p-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>Curated Research Digest</span>
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight">
            The Briefing
          </h1>
          
          <p className="text-lg lg:text-xl text-text-muted mb-4 max-w-2xl mx-auto leading-relaxed">
            A weekly digest of macro, digital asset, and cross-market context — curated for finance professionals who want information, not noise.
          </p>

          <p className="text-sm text-text-muted/70 mb-10 max-w-lg mx-auto">
            Every Monday. Under 5 minutes. No advice, no hype, no ads.
          </p>
          
          <div className="w-full max-w-lg mx-auto">
            <NewsletterSignup variant="compact" />
          </div>
        </div>
      </section>

      {/* Mock Issue Preview — The highest-converting element */}
      <section className="mb-16 lg:mb-24">
        <div className="flex items-center gap-3 mb-8">
          <FileText size={20} className="text-primary" />
          <h2 className="text-2xl lg:text-3xl font-bold">What You Receive</h2>
        </div>
        
        <Card className="overflow-hidden">
          {/* Mock issue header */}
          <div className="border-b border-border pb-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles size={16} className="text-primary" />
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">The Briefing</div>
                  <div className="text-xs text-text-muted/60">Issue #47 · April 21, 2026</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Clock size={12} />
                <span>4 min read</span>
              </div>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold mb-2">Fed Holds Steady, ETF Flows Reverse, MiCA Phase 2 Goes Live</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Three developments that shaped digital asset markets this week — and the broader capital market context around each.
            </p>
          </div>

          {/* Mock issue content blocks */}
          <div className="space-y-6">
            {/* Story 1 */}
            <div className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base mb-1.5">Fed Holds at 4.25% — Dot Plot Signals September</h4>
                  <p className="text-text-muted text-sm leading-relaxed mb-2">
                    The FOMC held rates unchanged for the third consecutive meeting. Updated dot plot projections now indicate a September cut as the base case, shifting from the previously projected June timeline. Real yields remain elevated at 2.1%, maintaining pressure on non-yielding assets...
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary/70">
                    <span className="px-2 py-0.5 bg-primary/5 rounded-full">Macro</span>
                    <span className="px-2 py-0.5 bg-primary/5 rounded-full">Rates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="border-t border-border/50 pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base mb-1.5">Bitcoin ETF Flows Flip Negative After 12-Week Streak</h4>
                  <p className="text-text-muted text-sm leading-relaxed mb-2">
                    U.S. spot Bitcoin ETFs recorded $340M in net outflows this week, breaking a 12-week inflow streak. GBTC led redemptions while IBIT saw modest inflows. On-chain data shows long-term holder supply reaching a new ATH, suggesting retail distribution while institutional positioning...
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary/70">
                    <span className="px-2 py-0.5 bg-primary/5 rounded-full">ETFs</span>
                    <span className="px-2 py-0.5 bg-primary/5 rounded-full">On-Chain</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Story 3 - Faded/truncated to create desire */}
            <div className="border-t border-border/50 pt-6 relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base mb-1.5">MiCA Phase 2 Implementation Begins Across EU</h4>
                  <p className="text-text-muted text-sm leading-relaxed">
                    The second phase of MiCA regulation is now in effect across all 27 EU member states. Key requirements include mandatory reserve audits for stablecoin issuers, licensing frameworks for CASPs...
                  </p>
                </div>
              </div>
              {/* Fade overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* Issue footer */}
          <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
            <p className="text-xs text-text-muted/60 italic">
              Sample content for illustration purposes. Actual issues reflect current market conditions.
            </p>
            <button 
              onClick={() => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-primary text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity min-h-[44px]"
            >
              <span>Subscribe to read full issues</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </Card>
      </section>

      {/* Content Pillars */}
      <section className="mb-16 lg:mb-24">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-3">What We Cover</h2>
        <p className="text-text-muted text-center mb-12 max-w-xl mx-auto">
          Four areas of context, curated from institutional-grade sources and presented without jargon.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contentPillars.map((pillar, i) => (
            <Card key={i} className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                  {pillar.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* What This Is / What This Is Not — Legal clarity + positioning */}
      <section className="mb-16 lg:mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/20">
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-sm">✓</span>
              </div>
              What This Is
            </h3>
            <ul className="space-y-3">
              {[
                'Curated information from institutional sources',
                'Market context translated into finance language',
                'On-chain data presented without speculation',
                'Regulatory updates from global jurisdictions',
                'Free — no ads, no upsells, no paywalls'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                  <span className="text-primary mt-0.5 flex-shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          
          <Card className="border-border/50 opacity-80">
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-text-muted/10 flex items-center justify-center">
                <span className="text-text-muted text-sm">✗</span>
              </div>
              What This Is Not
            </h3>
            <ul className="space-y-3">
              {[
                'Not financial advice or investment recommendations',
                'Not trading signals or price predictions',
                'Not a paid course or educational program',
                'Not sponsored content or promotional material',
                'Not affiliated with any exchange or protocol'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                  <span className="text-text-muted/50 mt-0.5 flex-shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section id="final-cta" className="scroll-mt-24">
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Stay Informed. Nothing More.
          </h2>
          
          <p className="text-text-muted text-base mb-10 max-w-lg mx-auto">
            One email per week. Under 5 minutes. Unsubscribe with one click.
          </p>
          
          <div className="max-w-md mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </div>
  );
};