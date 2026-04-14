import React from 'react';

interface FormSkeletonProps {
  fields?: number;
  className?: string;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({ fields = 3, className = '' }) => (
  <div className={`animate-pulse space-y-6 max-w-xl mx-auto ${className}`}>
    {/* Header */}
    <div className="text-center space-y-3">
      <div className="h-7 bg-border/50 rounded w-48 mx-auto" />
      <div className="h-4 bg-border/30 rounded w-64 mx-auto" />
    </div>

    {/* Form fields */}
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-border/40 rounded w-20" />
          <div className="h-12 bg-surface/50 border border-border rounded-xl w-full" />
        </div>
      ))}
    </div>

    {/* Submit button */}
    <div className="h-12 bg-border/50 rounded-xl w-full" />
  </div>
);
