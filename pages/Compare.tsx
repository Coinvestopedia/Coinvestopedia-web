import { PageMeta } from '../components/PageMeta';
import React, { useState, useEffect } from 'react';
import { DEFAULT_ASSETS, AssetData } from '../data/assetRegistry';
import { useLiveAssetRegistry } from '../hooks/useLiveAssetRegistry';
import { useAppContext } from '../context/AppContext';
import { trackEvent } from '../utils/analytics';

// Components
import { AssetSelector } from '../components/compare/AssetSelector';
import { OverviewPanel } from '../components/compare/OverviewPanel';
import { PerformancePanel } from '../components/compare/PerformancePanel';
import { RiskPanel } from '../components/compare/RiskPanel';
import { AllocationPanel } from '../components/compare/AllocationPanel';
import { CorrelationHeatmap } from '../components/compare/CorrelationHeatmap';
import { AnalystPanel } from '../components/compare/AnalystPanel';
import { CompareChart } from '../components/compare/CompareChart';
import { MobilePageCategories } from '../components/MobilePageCategories';


// Icons
import { LayoutDashboard, TrendingUp, ShieldAlert, PieChart, GitMerge, Lightbulb, Activity } from 'lucide-react';



type TabId = 'overview' | 'performance' | 'risk' | 'allocation' | 'correlation' | 'analyst';

export interface CompareProps {
  onNavigate?: (route: PageRoute) => void;
}

export const Compare: React.FC<CompareProps> = ({ onNavigate }) => {
  const isProUser = true; // Set to true for institutional dashboard view
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>(DEFAULT_ASSETS);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [chartTimeframe, setChartTimeframe] = useState<string>('1Y');

  const { registry } = useLiveAssetRegistry();
  const { setPageCategories, setActiveSubMenu, activeSubMenu } = useAppContext();

  useEffect(() => {
    const handleLocationChange = () => {
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 2 && pathParts[1] === 'compare') {
        const validTabs: TabId[] = ['overview', 'performance', 'risk', 'allocation', 'correlation', 'analyst'];
        
        // Check if pathParts[2] is a tab (e.g. /compare/risk)
        if (validTabs.includes(pathParts[2] as TabId)) {
          setActiveTab(pathParts[2] as TabId);
        } else {
          // pathParts[2] must be assets
          const assetsFromUrl = pathParts[2].split(',').filter(id => registry[id]);
          if (assetsFromUrl.length > 0) {
            setSelectedAssetIds(prev => {
              if (prev.join(',') !== assetsFromUrl.join(',')) {
                return assetsFromUrl;
              }
              return prev;
            });
          }
          // pathParts[3] is the tab
          if (pathParts.length > 3 && validTabs.includes(pathParts[3] as TabId)) {
             setActiveTab(pathParts[3] as TabId);
          }
        }
      }
    };
    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [registry]);

  const handleAssetsChange = (newAssets: string[]) => {
    setSelectedAssetIds(newAssets);
    const path = newAssets.length > 0 ? `/compare/${newAssets.join(',')}` : '/compare';
    window.history.pushState({}, '', `${path}/${activeTab}`);
    trackEvent('asset_comparison', { assets_compared: newAssets.join(',') });
  };

  const handleTabChange = React.useCallback((tabId: TabId) => {
    setActiveTab(tabId);
    const basePath = selectedAssetIds.length > 0 ? `/compare/${selectedAssetIds.join(',')}` : '/compare';
    window.history.pushState({}, '', `${basePath}/${tabId}`);
    trackEvent('comparison_tab_viewed', { tab_name: tabId, assets_compared: selectedAssetIds.join(',') });
  }, [selectedAssetIds]);

  const selectedAssets = selectedAssetIds
    .map(id => registry[id])
    .filter((a): a is AssetData => Boolean(a));

  const tabs = [
    { id: 'overview' as TabId, label: 'Overview', icon: LayoutDashboard },
    { id: 'performance' as TabId, label: 'Performance', icon: TrendingUp },
    { id: 'risk' as TabId, label: 'Risk & Volatility', icon: ShieldAlert },
    { id: 'allocation' as TabId, label: 'Allocation', icon: PieChart },
    { id: 'correlation' as TabId, label: 'Correlation', icon: GitMerge },
    { id: 'analyst' as TabId, label: 'Analyst Views', icon: Lightbulb },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const categories = tabs.map(tab => {
      const Icon = tab.icon;
      return {
        label: tab.label,
        icon: <Icon size={18} />,
        active: activeTab === tab.id,
        onClick: () => handleTabChange(tab.id)
      };
    });
    setPageCategories(categories);

    if (activeSubMenu !== 'Asset Comparison') {
       setActiveSubMenu('Asset Comparison');
    }

    return () => {
      setPageCategories([]);
    };
  }, [activeTab, setPageCategories, setActiveSubMenu, activeSubMenu, handleTabChange]);

  return (
    <div className="animate-fade-in relative">
      <PageMeta title="Asset Comparison" description="Advanced cross-asset analysis and correlation matrices." />
      


      <div className="space-y-6">

      
      {/* ─── HERO SECTION (Standardized Design) ─────────────── */}
      <div className="relative z-30 rounded-2xl lg:rounded-3xl border border-border bg-gradient-to-br from-background to-surface p-8 lg:p-16">
        <div className="absolute inset-0 overflow-hidden rounded-2xl lg:rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          {/* Title area */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-5">
            <span className="w-2 h-2 rounded-full bg-primary animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            Wall Street Grade
          </div>
          <h1 className="text-3xl lg:text-5xl font-heading font-extrabold tracking-tight mb-4 leading-tight">
            Cross-Asset <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-dark to-primary">Dashboard</span>
          </h1>
          <p className="text-text-muted text-base lg:text-xl max-w-2xl mb-8 leading-relaxed">
            Multi-asset intelligence for standard crypto, macro, and traditional markets. Q1 2026 data.
          </p>
          
          {/* Target Universe — integrated in the card */}
          <div className="border-t border-border/30 pt-8 mt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="w-full min-w-0">
                <AssetSelector 
                  selectedIds={selectedAssetIds} 
                  onChange={handleAssetsChange} 
                  registry={registry}
                />
              </div>

            </div>
          </div>
        </div>
      </div>






      {/* ─── TABS & NAVIGATION (Mobile) ─────────────────────────────────────────────── */}
      <MobilePageCategories />

      {/* ─── TAB CONTENT PANELS ────────────────────────────────────────────── */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && <OverviewPanel assets={selectedAssets} />}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <CompareChart
              assets={selectedAssets}
              timeframe={chartTimeframe}
              onTimeframeChange={setChartTimeframe}
              isProUser={true}
            />
            <PerformancePanel assets={selectedAssets} />
          </div>
        )}
        {activeTab === 'risk' && <RiskPanel assets={selectedAssets} />}
        {activeTab === 'allocation' && <AllocationPanel />}
        {activeTab === 'correlation' && <CorrelationHeatmap assets={selectedAssets} />}
        {activeTab === 'analyst' && <AnalystPanel assets={selectedAssets} />}
      </div>
    </div>
    </div>
  );
};
