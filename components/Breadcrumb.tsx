import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { PageRoute } from '../types';

export interface BreadcrumbItem {
  label: string;
  route?: PageRoute;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (route: PageRoute) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-[11px] font-bold uppercase tracking-widest text-text-muted mb-6 overflow-x-auto hide-scrollbar">
      <button 
        onClick={() => onNavigate?.(PageRoute.HOME)}
        className="flex items-center justify-center p-1.5 rounded-md hover:bg-surface border border-transparent hover:border-border hover:text-primary transition-all flex-shrink-0 group"
        title="Home"
      >
        <Home size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
      </button>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isInteractive = (!isLast && (item.route || item.onClick));
        
        return (
          <React.Fragment key={index}>
            <ChevronRight size={12} className="text-text-muted/40 flex-shrink-0" />
            
            {isInteractive ? (
              <button
                onClick={() => {
                  if (item.onClick) item.onClick();
                  else if (item.route) onNavigate?.(item.route);
                }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-surface border border-transparent hover:border-border hover:text-primary transition-all flex-shrink-0 group"
              >
                {item.icon && <span className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>}
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            ) : (
              <div className={`flex items-center gap-1.5 flex-shrink-0 px-2 py-1 rounded-md ${isLast ? 'text-primary bg-primary/10 border border-primary/20 shadow-sm shadow-primary/5' : ''}`}>
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span className="whitespace-nowrap">{item.label}</span>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
