import React, { useState, useMemo } from 'react';
import { Card } from '../../Card';
import { ProGate, InputField, ResultMetric, fmtPct } from '../shared/SharedComponents';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceArea } from 'recharts';
import { Globe, TrendingUp, TrendingDown, Sun, CloudRain } from 'lucide-react';

export const MacroRegimeIndicator: React.FC = () => {
  const [growthTrend, setGrowthTrend] = useState('2.5'); // GDP Growth Acceleration
  const [inflationTrend, setInflationTrend] = useState('3.8'); // CPI trend

  const currentRegime = useMemo(() => {
    const g = parseFloat(growthTrend) || 0;
    const i = parseFloat(inflationTrend) || 0;

    // Classification based on 2x2 matrix
    // Deflationary Boom: High Growth, Low Inflation
    // Inflationary Boom: High Growth, High Inflation
    // Stagflation: Low Growth, High Inflation
    // Deflationary Bust: Low Growth, Low Inflation
    
    // Thresholds: Growth > 2%, Inflation > 3%
    if (g >= 2 && i < 3) return { name: 'Goldilocks / Deflationary Boom', color: 'text-emerald-400', icon: <Sun />, quadrant: 1 };
    if (g >= 2 && i >= 3) return { name: 'Inflationary Expansion', color: 'text-blue-400', icon: <TrendingUp />, quadrant: 2 };
    if (g < 2 && i >= 3) return { name: 'Stagflation / Overheating', color: 'text-red-400', icon: <CloudRain />, quadrant: 3 };
    return { name: 'Deflationary Bust / Recession', color: 'text-amber-400', icon: <TrendingDown />, quadrant: 4 };
  }, [growthTrend, inflationTrend]);

  const scatterPoint = [{ x: parseFloat(growthTrend) || 0, y: parseFloat(inflationTrend) || 0 }];

  return (
    <div className="animate-fade-in">
      <ProGate 
        title="Macroeconomic Regime Engine" 
        description="Classify the global economic environment using growth and inflation inputs. Optimize asset allocation based on historical performance per regime."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                 <Globe size={18} className="text-primary"/> Macro Inputs
              </h3>
              <div className="space-y-4">
                <InputField label="Real GDP Growth (Δ)" value={growthTrend} onChange={setGrowthTrend} suffix="%" min={-10} max={10} step={0.1} />
                <InputField label="CPI Inflation (Δ)" value={inflationTrend} onChange={setInflationTrend} suffix="%" min={-5} max={15} step={0.1} />
              </div>
            </Card>

            <div className="p-6 rounded-2xl border border-border bg-background shadow-xl flex flex-col items-center text-center">
               <div className={`w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-4 ${currentRegime.color}`}>
                  {React.cloneElement(currentRegime.icon as React.ReactElement<any>, { size: 24 })}
               </div>
               <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-1">Detected Regime</p>
               <h4 className={`text-lg lg:text-xl font-bold font-heading ${currentRegime.color}`}>{currentRegime.name}</h4>
            </div>
            
            <Card className="p-4 border-primary/20 bg-primary/5">
                <h5 className="font-bold text-xs text-primary uppercase tracking-widest mb-2">Optimal Allocation Guide</h5>
                <ul className="text-xs text-text-muted space-y-2 list-disc pl-4 leading-relaxed">
                   {currentRegime.quadrant === 1 && <li>Overweight: Growth Equities, Tech, Crypto</li>}
                   {currentRegime.quadrant === 2 && <li>Overweight: Commodities, Real Estate, Value Stocks</li>}
                   {currentRegime.quadrant === 3 && <li>Overweight: Gold, Cash, Defensives</li>}
                   {currentRegime.quadrant === 4 && <li>Overweight: Long-term Treasuries, Cash</li>}
                </ul>
            </Card>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
             <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <ResultMetric label="Growth Rate" value={fmtPct(parseFloat(growthTrend))} neutral />
                <ResultMetric label="Inflation Rate" value={fmtPct(parseFloat(inflationTrend))} negative={parseFloat(inflationTrend) > 4} positive={parseFloat(inflationTrend) < 2} />
             </div>

             <Card className="flex-1 min-h-[450px] flex flex-col">
                <h4 className="font-bold text-sm text-text-muted uppercase tracking-widest mb-6 px-1">Ray Dalio / Bridgewater Style 4-Quadrant Matrix</h4>
                <div className="flex-1 w-full bg-background border border-border/50 rounded-2xl overflow-hidden relative p-4">
                   <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.5} />
                         <XAxis 
                            type="number" dataKey="x" domain={[-2, 6]} hide 
                         />
                         <YAxis 
                            type="number" dataKey="y" domain={[0, 8]} hide
                         />
                         
                         {/* Quadrant Labels */}
                         <ReferenceArea x1={2} x2={6} y1={0} y2={3} fill="#10b981" fillOpacity={0.05} label={{ position: 'top', value: 'GOLDILOCKS (I)', fill: '#10b981', fontSize: 10, fontWeight: 'bold' }} />
                         <ReferenceArea x1={2} x2={6} y1={3} y2={8} fill="#3b82f6" fillOpacity={0.05} label={{ position: 'top', value: 'EXPANSION (II)', fill: '#3b82f6', fontSize: 10, fontWeight: 'bold' }} />
                         <ReferenceArea x1={-2} x2={2} y1={3} y2={8} fill="#ef4444" fillOpacity={0.05} label={{ position: 'top', value: 'STAGFLATION (III)', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                         <ReferenceArea x1={-2} x2={2} y1={0} y2={3} fill="#f59e0b" fillOpacity={0.05} label={{ position: 'top', value: 'BUST (IV)', fill: '#f59e0b', fontSize: 10, fontWeight: 'bold' }} />

                         {/* No Tooltip needed for matrix visual */}
                         
                         <Scatter name="Current Position" data={scatterPoint} fill="#10b981" shape="circle" />
                      </ScatterChart>
                   </ResponsiveContainer>
                   
                   {/* Axis Labels (Manual because hide is true for standard axes) */}
                   <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between items-center text-xs font-bold text-text-muted/40 uppercase tracking-widest">
                      <div className="w-full flex justify-between px-24">
                         <span>Low Growth</span>
                         <span>High Growth</span>
                      </div>
                      <div className="absolute top-1/2 left-0 -translate-x-12 -translate-y-1/2 -rotate-90">Low Inflation</div>
                      <div className="absolute top-1/2 right-0 translate-x-12 -translate-y-1/2 rotate-90 text-red-500/50">High Inflation</div>
                   </div>
                </div>
                
                <div className="mt-4 text-[10px] text-text-muted italic flex items-center gap-2">
                   <CloudRain size={12} /> The 4-quadrant system classifies regimes by comparing growth/inflation trends to their multi-year structural averages.
                </div>
             </Card>
          </div>
        </div>
      </ProGate>
    </div>
  );
};
