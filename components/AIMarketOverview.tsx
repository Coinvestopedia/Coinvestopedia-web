import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, ThumbsUp, ThumbsDown, Hand } from 'lucide-react';
import { getMarketInsight, InsightResult } from '../services/geminiService';

interface AIMarketOverviewProps {
  className?: string;
}

export const AIMarketOverview: React.FC<AIMarketOverviewProps> = ({ className = "" }) => {
  const [insight, setInsight] = useState<InsightResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchInsight = async () => {
      try {
        setIsLoading(true);
        const result = await getMarketInsight('current crypto market', controller.signal);
        setInsight(result);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('Failed to fetch insight:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsight();
    return () => controller.abort();
  }, []);

  return (
    <div className={`leather-card rounded-xl p-6 relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Sparkles size={64} />
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary" size={20} />
          <h3 className="font-bold text-text">AI Market Overview</h3>
        </div>
        <div className="text-right ai-overview-meta flex flex-col items-end">
          <span className="text-[10px] text-text-muted/70 uppercase tracking-wider font-semibold">
            Last updated: {new Date().toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </span>
          <span className="text-[10px] text-primary/70 uppercase tracking-wider font-semibold">
            Refreshes every 4 hours
          </span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
          <div className="h-4 bg-white/10 rounded w-4/6"></div>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-muted leading-relaxed mb-4">
            {insight?.text}
          </p>
          {insight?.sources && insight.sources.length > 0 && (
            <div className="mb-4 pt-3 border-t border-white/5">
              <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-2">Sources</p>
              <div className="flex flex-col gap-1">
                {insight.sources.slice(0, 3).map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary truncate hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={10} />
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="pt-2 border-t border-white/5 mt-4">
            <p className="text-xs font-bold text-center text-text-muted mb-3">How do you feel about the market?</p>
            <div className="flex justify-center items-center gap-4">
              <button className="w-11 h-11 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 hover:bg-green-500/20 hover:scale-110 transition-all duration-200" aria-label="Bullish">
                <ThumbsUp size={16} />
              </button>
              <button className="w-11 h-11 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 hover:bg-yellow-500/20 hover:scale-110 transition-all duration-200" aria-label="Neutral">
                <Hand size={16} />
              </button>
              <button className="w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/20 hover:scale-110 transition-all duration-200" aria-label="Bearish">
                <ThumbsDown size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIMarketOverview;
