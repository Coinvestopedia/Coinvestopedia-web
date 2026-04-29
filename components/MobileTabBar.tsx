import React from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart3, Activity, Menu, Calculator } from 'lucide-react';
import { PageRoute } from '../types';

interface MobileTabBarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  isMenuOpen: boolean;
  onToggleMenu: (isOpen: boolean) => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentRoute,
  onNavigate,
  isMenuOpen,
  onToggleMenu
}) => {
  const items = [
    { 
      label: 'Home', 
      icon: Home, 
      route: PageRoute.HOME 
    },
    { 
      label: 'Whales', 
      icon: Activity, 
      route: PageRoute.WHALE 
    },
    { 
      label: 'Asset Desk', 
      icon: BarChart3, 
      route: PageRoute.COMPARE 
    },
    {
      label: 'Tools',
      icon: Calculator,
      route: PageRoute.TOOLS
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-[68px] px-2 relative">
        {items.map((item) => {
          const isActive = currentRoute === item.route && !isMenuOpen;
          return (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.route);
                onToggleMenu(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative
                ${isActive ? 'text-primary' : 'text-text-muted active:text-text'}
              `}
            >
              <item.icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2}
                className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`} 
              />
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -top-[1px] w-12 h-[2px] bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}

        {/* Menu Toggle */}
        <button
          onClick={() => onToggleMenu(!isMenuOpen)}
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all
            ${isMenuOpen ? 'text-primary' : 'text-text-muted active:text-text'}
          `}
        >
          <div className={`relative transition-transform duration-200 ${isMenuOpen ? 'scale-110' : 'scale-100'}`}>
            <Menu size={22} strokeWidth={isMenuOpen ? 2.5 : 2} />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-60'}`}>
            Menu
          </span>
          
          {isMenuOpen && (
            <motion.div 
              layoutId="activeTab"
              className="absolute -top-[1px] w-12 h-[2px] bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      </div>
    </div>
  );
};
