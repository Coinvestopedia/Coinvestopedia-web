import React from 'react';
import { Sparkles } from 'lucide-react';

interface KeyInsightsProps {
  insights: string[];
  className?: string;
}

/**
 * Key Insights Box — GEO Optimization Component
 * 
 * AI crawlers (GPTBot, OAI-SearchBot, Perplexity, Gemini) prioritize
 * content with bulleted lists that summarize complex data points.
 * 
 * Place at the top of every /research or /insights article to maximize
 * "citation hook" potential for generative engine responses.
 */
export const KeyInsights: React.FC<KeyInsightsProps> = ({ insights, className = '' }) => {
  return (
    <aside 
      aria-label="Key Insights" 
      className={`mb-10 p-6 bg-primary/5 border border-primary/20 rounded-2xl relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 right-0 p-6 opacity-5">
        <Sparkles size={80} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles size={16} className="text-primary" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Key Insights</h3>
        </div>
        <ul className="space-y-3">
          {insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-text leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
