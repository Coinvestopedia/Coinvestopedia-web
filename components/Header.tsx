import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { PageRoute } from '../types';
import { Button } from './Button';

import { useAppContext } from '../context/AppContext';


interface HeaderProps {
  onNavigate: (route: PageRoute) => void;
  currentRoute: PageRoute;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNavigate, 
  currentRoute,
  isMobileMenuOpen,
  onToggleMobileMenu
}) => {
  const { addToast } = useAppContext();
  
  const navLinks = [
    { label: 'Home', route: PageRoute.HOME },
    { label: 'Asset Comparison', route: PageRoute.COMPARE },
    { label: 'Macro Intel', route: PageRoute.MACRO_INTEL },
    { label: 'Tools & Calculators', route: PageRoute.TOOLS },
    { label: 'Knowledge', route: PageRoute.LEARN },
    { label: 'The Briefing', route: PageRoute.NEWSLETTER },
  ];
  
  const featuredLinks = [
    { label: 'Whale Tracker', route: PageRoute.WHALE, icon: '🐋', featured: true },
  ];

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    onToggleMobileMenu(false);
  };



  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 h-[80px] lg:h-[100px] ${isMobileMenuOpen ? 'bg-background' : 'glass-nav'}`}>
      <div className="max-w-container mx-auto px-6 h-full flex items-center justify-between xl:justify-start xl:gap-16">
        
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer group flex-shrink-0 py-1"
          onClick={() => handleNavClick(PageRoute.HOME)}
        >
          {/* ── Desktop Logo ── */}
          <img
            src="/logo-transparent-dark-desktop.png"
            alt="Coinvestopedia"
            className="h-16 lg:h-[88px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 hidden md:block"
          />
          {/* ── Mobile Logo ── */}
          <img
            src="/logo-transparent-mobile.png"
            alt="Coinvestopedia"
            className="h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105 block md:hidden"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-4 xl:gap-8 h-full">
          {navLinks.map((link) => (
            <div 
              key={link.label}
              className="relative h-full flex items-center group"
            >
              <div 
                className={`flex items-center gap-1 cursor-pointer transition-colors font-medium text-sm py-2 whitespace-nowrap relative ${currentRoute === link.route ? 'text-primary' : 'text-text-muted hover:text-text'}`}
                onClick={() => link.route && handleNavClick(link.route)}
                aria-label={link.label}
              >
                {link.label}
                
                {/* Active Indicator Line */}
                <span className={`absolute -bottom-1 left-0 h-[2px] w-full bg-primary transition-transform duration-300 origin-left ${currentRoute === link.route ? 'scale-x-100 opacity-100' : 'scale-x-0 group-hover:scale-x-100 opacity-50'}`} aria-hidden="true" />
              </div>
            </div>
          ))}
          
          {/* Featured Whale Radar */}
          {featuredLinks.map((link) => (
            <div 
              key={link.label}
              className={`flex items-center gap-1 cursor-pointer transition-colors font-medium text-sm whitespace-nowrap ${currentRoute === link.route ? 'text-primary' : 'text-text-muted hover:text-text'}`}
              onClick={() => link.route && handleNavClick(link.route)}
            >
              <span className="mr-1">{link.icon}</span>
              {link.label}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">

          
          {/* Area kept empty for future social icons */}


          {/* Hamburger: Hidden on mobile (< md) because bottom nav exists. Visible on tablet (md-xl). Hidden on desktop (> xl). */}
          <button className="hidden md:block xl:hidden text-text p-1" onClick={() => onToggleMobileMenu(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden fixed inset-0 top-[80px] lg:top-[100px] bg-background/95 backdrop-blur-md z-40 overflow-y-auto pb-32 border-t border-border"
          >
            <div className="p-6 flex flex-col gap-6">


              <div className="flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 px-1">Institutional Navigation</h3>
                 
                 {/* Featured Whale Radar in mobile */}
                 {featuredLinks.map((link) => (
                   <div 
                     key={link.label}
                     className={`group relative py-4 px-5 rounded-xl border transition-all duration-200 flex items-center justify-between overflow-hidden ${currentRoute === link.route ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-border/40 bg-surface/30 active:bg-surface/50'}`}
                     onClick={() => handleNavClick(link.route)}
                   >
                     <div className="flex items-center gap-4 relative z-10">
                        <span className={`text-lg font-bold tracking-tight ${currentRoute === link.route ? 'text-primary' : 'text-text'}`}>{link.label}</span>
                     </div>

                     <div className="relative z-10">
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-primary/20">Featured</span>
                     </div>
                     
                     {/* Decorative background element */}
                     <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
                   </div>
                 ))}
                 
                 <div className="grid grid-cols-1 gap-2 mt-2">
                    {navLinks.map((link) => {
                      const isActive = currentRoute === link.route;
                      return (
                        <div 
                          key={link.label}
                          className={`group py-4 px-5 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${isActive ? 'border-primary/40 bg-primary/5' : 'border-border/30 bg-surface/10 active:bg-surface/30'}`}
                          onClick={() => handleNavClick(link.route)}
                        >
                          <span className={`text-base font-semibold tracking-tight transition-colors ${isActive ? 'text-primary' : 'text-text group-hover:text-primary'}`}>
                            {link.label}
                          </span>
                          {isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          )}
                        </div>
                      );
                    })}
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};