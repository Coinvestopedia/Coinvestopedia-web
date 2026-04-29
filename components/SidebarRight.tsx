import React from 'react';
import { AIMarketOverview } from './AIMarketOverview';

export const SidebarRight: React.FC = () => {
  return (
    <aside className="hidden lg:flex flex-col gap-8 w-[300px] sticky top-[108px] self-start h-fit">
      {/* AI Insight Widget */}
      <AIMarketOverview />
    </aside>
  );
};

export default SidebarRight;

