import React, { useMemo, useState } from 'react';
import { AssetData, CHART_MOCK_DATA } from '../../data/assetRegistry';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';



interface CompareChartProps {
  assets: AssetData[];
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
  isProUser?: boolean;
}

const TIMEFRAMES = [
  { label: '1M', days: 30, isPro: false },
  { label: '3M', days: 90, isPro: false },
  { label: '6M', days: 180, isPro: false },
  { label: '1Y', days: 365, isPro: false },
  { label: '3Y', days: 365 * 3, isPro: true },
];

export const CompareChart: React.FC<CompareChartProps> = ({ assets, timeframe, onTimeframeChange, isProUser = false }) => {
  const [scale, setScale] = useState<'linear' | 'log'>('linear');

  // Math logic for Rebasing to 100
  const chartData = useMemo(() => {
    if (assets.length === 0) return [];

    const tfObj = TIMEFRAMES.find(t => t.label === timeframe) || TIMEFRAMES[3];
    const days = tfObj.days;

    // Filter data by days (mock data is weekly, so days / 7)
    const weeksToInclude = Math.floor(days / 7);
    const slicedData = CHART_MOCK_DATA.slice(-weeksToInclude);

    if (slicedData.length === 0) return [];

    // Rebasing: (current_value / start_value) * 100
    const startValues: Record<string, number> = {};
    assets.forEach(asset => {
      startValues[asset.symbol] = slicedData[0][asset.symbol as keyof typeof slicedData[0]] as number || 1;
    });

    return slicedData.map(dataPoint => {
      const normalizedPoint: any = { date: dataPoint.date };
      assets.forEach(asset => {
        const rawVal = dataPoint[asset.symbol as keyof typeof dataPoint] as number;
        if (rawVal !== undefined && startValues[asset.symbol]) {
          normalizedPoint[asset.symbol] = (rawVal / startValues[asset.symbol]) * 100;
        }
      });
      return normalizedPoint;
    });
  }, [assets, timeframe]);

  // Determine if current TF requires Pro

  return (
    <div className="leather-card rounded-xl p-4 lg:p-6 animate-fade-in flex flex-col min-h-[500px]">
      {/* Chart Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
           <h3 className="font-bold text-lg">Normalized Returns (Base 100)</h3>
           <p className="text-sm text-text-muted">Compare relative performance across different asset classes over time.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
           <div className="flex bg-surface border border-border rounded-lg p-1">
             <button 
                onClick={() => setScale('linear')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${scale === 'linear' ? 'bg-primary/20 text-primary' : 'text-text-muted hover:text-text'}`}
             >
                Linear
             </button>
             <button 
                onClick={() => setScale('log')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${scale === 'log' ? 'bg-primary/20 text-primary' : 'text-text-muted hover:text-text'}`}
             >
                Log
             </button>
           </div>
           
           <div className="flex bg-surface border border-border rounded-lg p-1">
             {TIMEFRAMES.map(tf => (
                <button
                  key={tf.label}
                  onClick={() => onTimeframeChange(tf.label)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors flex items-center gap-1
                    ${timeframe === tf.label ? 'bg-primary text-black' : 'text-text-muted hover:text-text'}
                  `}
                >
                  {tf.label}
                  {tf.isPro && !isProUser && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </button>
             ))}
           </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-grow w-full relative">
         <div className="w-full h-[400px]">
           <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                 <XAxis 
                   dataKey="date" 
                   stroke="#52525B" 
                   tick={{fill: '#71717A', fontSize: 11}} 
                   tickMargin={10}
                   tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.toLocaleString('default', { month: 'short' })} '${d.getFullYear().toString().substring(2)}`;
                   }}
                 />
                 <YAxis 
                   scale={scale === 'log' ? 'log' : 'linear'} 
                   domain={['auto', 'auto']}
                   stroke="#52525B" 
                   tick={{fill: '#71717A', fontSize: 11}}
                   tickFormatter={(val) => val.toFixed(0)}
                   width={40}
                   allowDataOverflow
                 />
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', color: '#F4F4F5', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#A1A1AA', fontSize: '11px', marginBottom: '4px' }}
                    formatter={(value: any) => [`${value.toFixed(2)}`, undefined]}
                 />
                 <Legend 
                   iconType="circle" 
                   wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} 
                 />
                 
                 {assets.map((asset) => (
                   <Line 
                     key={asset.id}
                     type="monotone" 
                     dataKey={asset.symbol} 
                     name={asset.symbol}
                     stroke={asset.color} 
                     strokeWidth={2.5}
                     dot={false}
                     activeDot={{ r: 6, strokeWidth: 0 }}
                   />
                 ))}
              </LineChart>
           </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};
