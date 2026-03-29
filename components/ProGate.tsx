import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from './Button';

interface ProGateProps {
  children: React.ReactNode;
  isUnlocked?: boolean;
  featureName?: string;
}

export const ProGate: React.FC<ProGateProps> = ({ children, isUnlocked = false, featureName = 'this feature' }) => {
  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative group rounded-xl overflow-hidden">
      <div className="blur-[3px] opacity-40 pointer-events-none select-none transition-all duration-300">
        {children}
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 z-10 p-4">
        <div className="bg-surface/90 backdrop-blur-md border border-border p-4 rounded-xl flex flex-col items-center shadow-2xl max-w-sm text-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mb-3">
            <Lock size={18} className="text-amber-400" />
          </div>
          <h4 className="font-bold text-sm mb-1">Unlock {featureName}</h4>
          <p className="text-xs text-text-muted mb-4">Upgrade to Pro to access institutional-grade analytics, 3Y+ datasets, and actionable alerts.</p>
          <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-black border-none font-bold">
            Upgrade for $19/mo
          </Button>
        </div>
      </div>
    </div>
  );
};
