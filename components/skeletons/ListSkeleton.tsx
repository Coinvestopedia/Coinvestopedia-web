import React from 'react';

interface ListSkeletonProps {
  rows?: number;
  showAvatar?: boolean;
  className?: string;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ rows = 5, showAvatar = true, className = '' }) => (
  <div className={`animate-pulse space-y-4 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface/50 border border-border">
        {showAvatar && (
          <div className="w-10 h-10 rounded-full bg-border/50 shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-border/50 rounded w-3/5" />
          <div className="h-3 bg-border/30 rounded w-2/5" />
        </div>
        <div className="h-6 w-16 bg-border/40 rounded-md shrink-0" />
      </div>
    ))}
  </div>
);
