import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Icons loaded as needed
import { useAppContext } from '../context/AppContext';
import { navLinks, discoveryPool } from '../data/navigation';
import { PageRoute } from '../types';

interface DynamicSidebarProps {
  onNavigate: (route: PageRoute) => void;
  currentRoute: PageRoute;
}

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({ onNavigate, currentRoute }) => {
  const { activeSubMenu, pageCategories, setActiveSubMenu } = useAppContext();

  const activeLink = navLinks.find(link => link.label === activeSubMenu);
  const subMenuOptions = activeLink?.options || [];

  const handleLinkClick = (item: any) => {
    if (item.route === currentRoute) {
      // If we're already on the same route, see if a local page category handles this
      const localCategory = pageCategories.find(c => c.label === item.label);
      if (localCategory && localCategory.onClick) {
         localCategory.onClick();
         return;
      }
    }
    onNavigate(item.route);
  };

  const renderSection = (title: string, items: any[], type: 'category' | 'nav') => {
    if (items.length === 0) return null;

    // Use specific title mapping or hide it if it's "Specifics" or "Categories" to make it look cleaner like a main nav
    const displayTitle = title === 'Categories' || title === 'Specifics' ? activeSubMenu || 'Menu' : title;

    return (
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center px-4 mb-2">
          <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-[0.2em] leading-none">
            {displayTitle}
          </h3>
        </div>
        
        <div className="space-y-1">
        {items.map((item, i) => {
            const isActive = type === 'category' ? item.active : (currentRoute === item.route && activeSubMenu === title);
            return (
              <button
                key={item.label || i}
                onClick={() => type === 'category' ? item.onClick?.() : handleLinkClick(item)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-full text-[15px] transition-all duration-200 group relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                  ${isActive 
                    ? 'font-bold text-text bg-white/10 shadow-sm' 
                    : 'font-semibold text-text-muted hover:text-text hover:bg-white/5 active:scale-[0.98]'
                  }`}
              >
                <div className={`flex-shrink-0 flex items-center justify-center transition-colors duration-200
                  ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-text'}
                `}>
                   {item.icon ? (
                      typeof item.icon === 'string' ? <span className="text-xl">{item.icon}</span> : item.icon
                   ) : (
                      item.label === 'Whale Tracker' ? <span className="text-xl leading-none">🐋</span> :
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary' : 'bg-text-muted/40 group-hover:bg-text'}`} />
                   )}
                </div>
                <span className={`truncate flex-1 ${item.comingSoon ? 'opacity-50' : ''}`}>{item.label}</span>
                {item.comingSoon && (
                  <span className="flex-shrink-0 text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // Shuffle discovery pool on mount or when route changes to empty state
  const emptyStateRoutes = [PageRoute.HOME, PageRoute.WHALE, PageRoute.NEWSLETTER];
  const isEmptyState = emptyStateRoutes.includes(currentRoute) && pageCategories.length === 0;
  
  const shuffledDiscovery = useMemo(() => {
    return [...discoveryPool].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [currentRoute]); // reshuffle when route changes

  return (
    <aside className="hidden lg:flex flex-col gap-8 w-full sticky top-[112px] h-[calc(100vh-132px)] overflow-y-auto no-scrollbar pb-10">
      <AnimatePresence mode="wait">
        <div key={activeSubMenu || currentRoute} className="space-y-8">
          
          {/* Render only the most specific section available */}
          {pageCategories.length > 0 ? (
            renderSection(
              currentRoute === PageRoute.INSIGHTS || currentRoute === PageRoute.COMPARE ? 'Specifics' : 'Categories', 
              pageCategories, 
              'category'
            )
          ) : activeSubMenu && subMenuOptions.length > 0 ? (
            renderSection(
              activeSubMenu, 
              subMenuOptions, 
              'nav'
            )
          ) : isEmptyState ? (
             renderSection(
                'Discovery',
                shuffledDiscovery,
                'nav'
             )
          ) : null}



        </div>
      </AnimatePresence>
    </aside>
  );
};
