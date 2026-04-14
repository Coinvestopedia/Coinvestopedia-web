import React from 'react';

interface DetailSkeletonProps {
  className?: string;
}

export const DetailSkeleton: React.FC<DetailSkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse space-y-6 ${className}`}>
    {/* Hero / Header area */}
    <div className="rounded-2xl bg-surface/50 border border-border p-8 space-y-4">
      <div className="h-3 bg-border/40 rounded w-24" />
      <div className="h-8 bg-border/50 rounded w-3/4" />
      <div className="h-4 bg-border/30 rounded w-1/2" />
    </div>

    {/* Tab bar */}
    <div className="flex gap-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-10 bg-surface/50 border border-border rounded-xl w-28" />
      ))}
    </div>

    {/* Content blocks */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="rounded-xl bg-surface/50 border border-border p-6 space-y-3">
          <div className="h-5 bg-border/50 rounded w-1/3" />
          <div className="h-12 bg-border/30 rounded w-full" />
          <div className="h-3 bg-border/20 rounded w-2/3" />
        </div>
      ))}
    </div>
  </div>
);
