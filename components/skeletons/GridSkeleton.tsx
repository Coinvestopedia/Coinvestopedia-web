import React from 'react';

interface GridSkeletonProps {
  cards?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({ cards = 6, columns = 3, className = '' }) => {
  const colClass = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';
  
  return (
    <div className={`animate-pulse grid grid-cols-1 ${colClass} gap-4 ${className}`}>
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="rounded-xl bg-surface/50 border border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-border/50" />
            <div className="h-4 bg-border/50 rounded w-24" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-border/30 rounded w-full" />
            <div className="h-3 bg-border/30 rounded w-4/5" />
            <div className="h-3 bg-border/30 rounded w-3/5" />
          </div>
          <div className="h-8 bg-border/40 rounded-lg w-24 mt-2" />
        </div>
      ))}
    </div>
  );
};
