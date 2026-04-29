import { AssetData } from '../../data/assetRegistry';
import { AlertCircle, ArrowLeftRight } from 'lucide-react';
import { ProGate } from '../ProGate';

interface CompareTableProps {
  assets: AssetData[];
  isProUser?: boolean;
}

export const CompareTable: React.FC<CompareTableProps> = ({ assets }) => {

  const sortedAssets = assets;


  // Helper to color-code rows based on relative min/max values
  const getCellColor = (field: keyof AssetData, value: number, invert = false) => {
    if (assets.length < 2) return 'text-text';
    
    const values = assets.map(a => a[field] as number);
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    if (max === min) return 'text-text';

    const isHighest = value === max;
    const isLowest = value === min;

    let color = 'text-text';
    if (!invert) {
      if (isHighest) color = 'text-emerald-400 font-bold';
      if (isLowest) color = 'text-red-400 font-bold';
    } else {
      if (isHighest) color = 'text-red-400 font-bold';
      if (isLowest) color = 'text-emerald-400 font-bold';
    }
    
    return color;
  };


  return (
    <div className="animate-fade-in leather-card rounded-xl overflow-hidden flex flex-col">
      {assets.length > 1 && (
        <div className="md:hidden flex items-center justify-center gap-1.5 py-2.5 bg-surface/50 border-b border-border text-xs text-text-muted font-medium w-full">
          <ArrowLeftRight size={14} className="opacity-70" />
          <span>Swipe horizontally to compare</span>
        </div>
      )}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
        <thead className="bg-surface/50 border-b border-border">
          <tr>
            <th className="p-4 text-left font-bold text-text uppercase tracking-wider sticky left-0 bg-surface z-10 w-48">Asset</th>
            {sortedAssets.map(asset => (
              <th key={asset.id} className="p-4 text-center min-w-[120px] whitespace-nowrap bg-surface/50 border-l border-border/50">
                <div className="flex flex-col items-center gap-2">
                  <img src={asset.iconUrl} alt={asset.symbol} className="w-8 h-8 rounded-full border border-border p-0.5 bg-background shadow-sm" />
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-base" style={{ color: asset.color }}>{asset.symbol}</span>
                    <span className="text-[10px] text-text-muted">{asset.name}</span>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="divide-y divide-border/50">
          
          {/* Price & Valuation */}
          <tr className="bg-surface/10">
            <td colSpan={sortedAssets.length + 1} className="py-2 px-4 text-xs font-bold text-primary uppercase tracking-widest bg-primary/5">Valuation</td>
          </tr>
          <tr>
            <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10">Price</td>
            {sortedAssets.map(asset => (
              <td key={asset.id} className="p-4 text-center font-mono border-l border-border/50 bg-surface/30">
                ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.price > 10 ? 2 : 4 })}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10">Market Cap</td>
            {sortedAssets.map(asset => (
              <td key={asset.id} className={`p-4 text-center font-mono border-l border-border/50 bg-surface/30 ${getCellColor('marketCap', asset.marketCap)}`}>
                ${asset.marketCap.toLocaleString()}B
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10">FDV</td>
            {sortedAssets.map(asset => (
              <td key={asset.id} className="p-4 text-center font-mono border-l border-border/50 bg-surface/30 text-text-muted">
                ${asset.fdv.toLocaleString()}B
              </td>
            ))}
          </tr>

          {/* Returns */}
          <tr className="bg-surface/10">
            <td colSpan={sortedAssets.length + 1} className="py-2 px-4 text-xs font-bold text-primary uppercase tracking-widest bg-primary/5">Performance</td>
          </tr>
          <tr>
            <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10">24h Return</td>
            {sortedAssets.map(asset => (
              <td key={asset.id} className={`p-4 text-center font-mono border-l border-border/50 bg-surface/30 ${getCellColor('change24h', asset.change24h)}`}>
                {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10">7d Return</td>
            {sortedAssets.map(asset => (
              <td key={asset.id} className={`p-4 text-center font-mono border-l border-border/50 bg-surface/30 ${getCellColor('change7d', asset.change7d)}`}>
                {asset.change7d > 0 ? '+' : ''}{asset.change7d}%
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10">30d Return</td>
            {sortedAssets.map(asset => (
              <td key={asset.id} className={`p-4 text-center font-mono border-l border-border/50 bg-surface/30 ${getCellColor('change30d', asset.change30d)}`}>
                {asset.change30d > 0 ? '+' : ''}{asset.change30d}%
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10 1yr-row">1Y Return</td>
            {sortedAssets.map(asset => (
              <td key={asset.id} className={`p-4 text-center font-mono border-l border-border/50 bg-surface/30 ${getCellColor('change1y', asset.change1y)}`}>
                {asset.change1y > 0 ? '+' : ''}{asset.change1y}%
              </td>
            ))}
          </tr>
          
          {/* Risk Metrics - PRO GATED ROW */}
          <tr className="bg-surface/10 relative">
            <td colSpan={sortedAssets.length + 1} className="py-2 px-4 text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-500/5 flex items-center gap-2">
               Risk & Volatility (Pro) <AlertCircle size={12} />
            </td>
          </tr>
        </tbody>
      </table>
      
      {/* Pro Gated Section Built outside the main tbody loop to prevent <tr> nesting issues with blur */}
      <div className="relative border-b border-border/50">
         <ProGate>
           <table className="w-full text-sm text-left">
              <tbody className="divide-y divide-border/50">
                 <tr>
                    <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10 w-48 border-r border-border/50">Volatility (30d Ann.)</td>
                    {sortedAssets.map(asset => (
                       <td key={asset.id} className={`p-4 text-center font-mono border-l border-border/50 bg-surface/30 min-w-[120px] ${getCellColor('volatility30d', asset.volatility30d, true)}`}>
                          {asset.volatility30d}%
                       </td>
                    ))}
                 </tr>
                 <tr>
                    <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10 border-r border-border/50">ATH Drawdown</td>
                    {sortedAssets.map(asset => (
                       <td key={asset.id} className={`p-4 text-center font-mono border-l border-border/50 bg-surface/30 min-w-[120px] ${getCellColor('athDrawdown', asset.athDrawdown, true)}`}>
                          {asset.athDrawdown}%
                       </td>
                    ))}
                 </tr>
                 <tr>
                    <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10 border-r border-border/50">Sharpe Ratio (90d)</td>
                    {sortedAssets.map(asset => (
                       <td key={asset.id} className={`p-4 text-center font-mono border-l border-border/50 bg-surface/30 min-w-[120px] ${getCellColor('sharpe90d', asset.sharpe90d)}`}>
                          {asset.sharpe90d.toFixed(2)}
                       </td>
                    ))}
                 </tr>
                 <tr>
                    <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10 border-r border-border/50">Beta vs SPY</td>
                    {sortedAssets.map(asset => (
                       <td key={asset.id} className="p-4 text-center font-mono border-l border-border/50 bg-surface/30 min-w-[120px] text-text-muted">
                          {asset.betaSpy.toFixed(2)}
                       </td>
                    ))}
                 </tr>
              </tbody>
           </table>
         </ProGate>
      </div>

      <table className="w-full text-sm text-left">
         <tbody className="divide-y divide-border/50">
           {/* Liquidity & Health */}
           <tr className="bg-surface/10">
             <td colSpan={sortedAssets.length + 1} className="py-2 px-4 text-xs font-bold text-primary uppercase tracking-widest bg-primary/5">Network Health</td>
           </tr>
           <tr>
             <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10 w-48">Liquidity Score</td>
             {sortedAssets.map(asset => (
               <td key={asset.id} className={`p-4 text-center font-mono border-l border-border/50 bg-surface/30 min-w-[120px] ${getCellColor('liquidityScore', asset.liquidityScore)}`}>
                 {asset.liquidityScore}/100
               </td>
             ))}
           </tr>
           <tr>
             <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10">Social Sentiment</td>
             {sortedAssets.map(asset => (
               <td key={asset.id} className={`p-4 text-center font-mono border-l border-border/50 bg-surface/30 min-w-[120px] ${getCellColor('socialScore', asset.socialScore)}`}>
                 {asset.socialScore}/100
               </td>
             ))}
           </tr>
           <tr>
             <td className="p-4 font-medium text-text-muted sticky left-0 bg-background z-10">Dev Commits (Month)</td>
             {sortedAssets.map(asset => (
               <td key={asset.id} className={`p-4 text-center font-mono border-l border-border/50 bg-surface/30 min-w-[120px] ${getCellColor('devActivity', asset.devActivity)}`}>
                 {asset.devActivity > 0 ? asset.devActivity : '-'}
               </td>
             ))}
           </tr>
         </tbody>
      </table>
      </div>
    </div>
  );
};
