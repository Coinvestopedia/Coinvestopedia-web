import React from 'react';
import { Layers, Cuboid, TrendingUp, BarChart3, Fingerprint, Image, Database, Zap, Activity } from 'lucide-react';

export type AssetCategory = 'L1' | 'L2' | 'DeFi' | 'AI' | 'RWA' | 'Equity' | 'Commodity' | 'Macro' | 'NFT';

export type AnalystSignal = 'OUTPERFORM' | 'NEUTRAL' | 'WATCH' | 'UNDERWEIGHT';

export interface AssetData {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  color: string;
  iconUrl: string;
  price: number;
  marketCap: number; // in billions
  fdv: number; // in billions
  vol24h: number; // in billions
  change24h: number;
  change7d: number;
  change30d: number;
  changeYtd: number;
  change1y: number;
  ath: number;
  athDrawdown: number;
  volatility30d: number; // Annualized %
  volatility90d: number; // Annualized %
  sharpe90d: number;
  cagr3y: number; // 3-year CAGR %
  maxDrawdown: number; // max drawdown %
  var95: number; // Value at Risk 95% (daily, %)
  betaBtc: number;
  betaSpy: number;
  correlationBtc: number;
  liquidityScore: number; // 0-100
  socialScore: number; // 0-100
  devActivity: number; // commits/month (crypto only)
  inflationRate: number; // %
  analystSignal: AnalystSignal;
  analystThesis: string;
}

export const getCategoryIcon = (category: AssetCategory): React.ReactNode => {
  switch (category) {
    case 'L1': return <Layers size={14} />;
    case 'L2': return <Cuboid size={14} />;
    case 'DeFi': return <Activity size={14} />;
    case 'AI': return <Zap size={14} />;
    case 'RWA': return <Fingerprint size={14} />;
    case 'Equity': return <TrendingUp size={14} />;
    case 'Commodity': return <Database size={14} />;
    case 'Macro': return <BarChart3 size={14} />;
    case 'NFT': return <Image size={14} />;
    default: return <Database size={14} />;
  }
};
