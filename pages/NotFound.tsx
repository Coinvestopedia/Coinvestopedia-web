import React from 'react';
import { PageRoute } from '../types';

interface NotFoundProps {
  onNavigate?: (route: PageRoute) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center text-center py-32 px-6">
      {/* Glitch-styled 404 */}
      <div className="relative mb-8">
        <span className="text-[120px] md:text-[160px] font-heading font-black text-primary/10 leading-none select-none">
          404
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-[120px] md:text-[160px] font-heading font-black text-primary/30 leading-none select-none blur-sm">
          404
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl font-heading font-bold text-text mb-3">
        Page Not Found
      </h1>
      <p className="text-text-muted text-base max-w-md mb-8 leading-relaxed">
        The route you requested doesn't exist on Coinvestopedia. 
        It may have been moved, renamed, or removed entirely.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onNavigate?.(PageRoute.HOME)}
          className="px-6 py-3 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Return to Dashboard
        </button>
        <button
          onClick={() => onNavigate?.(PageRoute.LEARN)}
          className="px-6 py-3 bg-surface border border-border text-text-muted font-bold text-sm rounded-xl hover:text-primary hover:border-primary/50 transition-colors"
        >
          Browse Knowledge
        </button>
      </div>

      {/* Subtle bottom accent */}
      <div className="mt-16 w-24 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  );
};

export default NotFound;
