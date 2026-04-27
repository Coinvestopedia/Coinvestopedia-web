import { PageRoute } from '../types';
import React from 'react';
import { 
  Zap, Globe, BarChart3, Eye, Archive as ArchiveIcon,
  PieChart, DollarSign, Target, TrendingUp, TrendingDown,
  AlertTriangle, Sparkles, Shield,
  FileText, BookOpen
} from 'lucide-react';
import { TargetIcon } from '../components/AnimatedIcons';

export interface NavOption {
  label: string;
  route: PageRoute;
  icon?: React.ReactNode | string;
}

export interface NavLink {
  label: string;
  route: PageRoute;
  options: NavOption[];
}

export const navLinks: NavLink[] = [
  { label: 'Overview', route: PageRoute.HOME, options: [] },
  { label: 'Asset Comparison', route: PageRoute.COMPARE, options: [] },
  { 
    label: 'Macro Intel', 
    route: PageRoute.MACRO_INTEL, 
    options: [
      { label: 'Weekly Briefing', route: PageRoute.MACRO_INTEL, icon: <Zap size={18} /> },
      { label: 'Geopolitical Decoder', route: PageRoute.MACRO_INTEL, icon: <Globe size={18} /> },
      { label: 'Cross-Market', route: PageRoute.MACRO_INTEL, icon: <BarChart3 size={18} /> },
      { label: 'Institutional Lens', route: PageRoute.MACRO_INTEL, icon: <Eye size={18} /> },
      { label: 'Archive', route: PageRoute.MACRO_INTEL, icon: <ArchiveIcon size={18} /> }
    ]
  },
  { 
    label: 'Tools & Calculators', 
    route: PageRoute.TOOLS, 
    options: [
      { label: 'Asset Allocation Simulator', route: PageRoute.TOOLS, icon: <PieChart size={18} /> },
      { label: 'DCA Strategy Simulator', route: PageRoute.TOOLS, icon: <DollarSign size={18} /> },
      { label: 'ROI & Trade Simulator', route: PageRoute.TOOLS, icon: <TrendingUp size={18} /> },
      { label: 'Monte Carlo Simulator', route: PageRoute.TOOLS, icon: <Sparkles size={18} /> },
      { label: 'Bitcoin On-Chain Valuation', route: PageRoute.TOOLS, icon: <Globe size={18} /> },
      { label: 'Risk-Adjusted Returns', route: PageRoute.TOOLS, icon: <Shield size={18} /> },
      { label: 'Forex Heat Map', route: PageRoute.TOOLS, icon: <Globe size={18} /> },
      { label: 'Relative Unrealized Profit', route: PageRoute.TOOLS, icon: <TrendingUp size={18} /> },
      { label: 'Drawdown Analyzer', route: PageRoute.TOOLS, icon: <TrendingDown size={18} /> },
      { label: 'Macro Regime Indicator', route: PageRoute.TOOLS, icon: <Globe size={18} /> },
      { label: 'Impermanent Loss', route: PageRoute.TOOLS, icon: <AlertTriangle size={18} /> }
    ]
  },
  { 
    label: 'Knowledge', 
    route: PageRoute.LEARN, 
    options: [
      { label: 'Research & Reports', route: PageRoute.RESEARCH, icon: <FileText size={18} /> },
      { label: 'Institutional Insights', route: PageRoute.INSIGHTS, icon: <TargetIcon className="w-[18px] h-[18px]" /> },
      { label: 'Exchange Intelligence', route: PageRoute.EXCHANGES, icon: <BarChart3 size={18} /> },
      { label: 'Crypto Glossary', route: PageRoute.GLOSSARY, icon: <BookOpen size={18} /> },
      { label: 'DeFi Strategies', route: PageRoute.LEARN, icon: <TrendingUp size={18} /> },
      { label: 'Technical Analysis', route: PageRoute.LEARN, icon: <Target size={18} /> },
      { label: 'Security & Custody', route: PageRoute.LEARN, icon: <Shield size={18} /> },
      { label: 'Market Psychology', route: PageRoute.LEARN, icon: <BookOpen size={18} /> }
    ] 
  },
  { label: 'The Briefing', route: PageRoute.NEWSLETTER, options: [] },
];

export const featuredLinks = [
  { label: 'Whale Tracker', route: PageRoute.WHALE, icon: '🐋', featured: true },
];

// Replaces exploreLinks to act as a discovery pool for empty states
export const discoveryPool = [
  { label: 'Macro Intelligence', route: PageRoute.MACRO_INTEL },
  { label: 'Asset Comparison', route: PageRoute.COMPARE },
  { label: 'DCA Strategy Simulator', route: PageRoute.TOOLS },
  { label: 'Whale Tracker', route: PageRoute.WHALE },
  { label: 'Bitcoin On-Chain Valuation', route: PageRoute.TOOLS },
  { label: 'Research & Insights', route: PageRoute.INSIGHTS },
  { label: 'Crypto Glossary', route: PageRoute.GLOSSARY },
  { label: 'Monte Carlo Simulator', route: PageRoute.TOOLS }
];
