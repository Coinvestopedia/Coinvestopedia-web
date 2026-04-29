import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export const MobilePageCategories: React.FC = () => {
  const { pageCategories } = useAppContext();

  if (!pageCategories || pageCategories.length === 0) return null;

  return (
    <div className="lg:hidden mb-6 -mx-6 px-6 overflow-x-auto no-scrollbar flex gap-3 pb-2 pt-1">
      {pageCategories.map((cat, i) => (
        <button
          key={cat.id || i}
          onClick={cat.onClick}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap
            ${cat.active 
              ? 'bg-primary text-background border-primary shadow-lg shadow-primary/20' 
              : 'bg-surface/50 text-text-muted border-border hover:border-primary/50'
            }
            ${cat.comingSoon ? 'opacity-50 grayscale' : ''}
          `}
        >
          {cat.icon && (
            <span className={`transition-colors ${cat.active ? 'text-background' : 'text-primary'}`}>
              {typeof cat.icon === 'string' ? cat.icon : React.cloneElement(cat.icon as React.ReactElement, { size: 14 })}
            </span>
          )}
          <span>{cat.label}</span>
          {cat.comingSoon && (
            <span className="text-[8px] px-1 bg-primary/20 text-primary rounded leading-none ml-1">Soon</span>
          )}
        </button>
      ))}
    </div>
  );
};
