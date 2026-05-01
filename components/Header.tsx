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
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 h-16 lg:h-[100px] ${isMobileMenuOpen ? 'bg-background' : 'glass-nav'}`}>
      <div className="max-w-container mx-auto px-6 h-full flex items-center relative md:justify-between xl:justify-start xl:gap-16">
        
        {/* Logo - Centered on Mobile, Left-aligned on Desktop */}
        <div
          className="absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 flex items-center cursor-pointer group flex-shrink-0 py-1 z-10"
          onClick={() => handleNavClick(PageRoute.HOME)}
        >
          {/* ── Desktop Logo ── */}
          <img
            src="/logo-transparent-dark-desktop.png"
            alt="Coinvestopedia"
            width={88}
            height={88}
            decoding="async"
            className="h-16 lg:h-[88px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 hidden md:block"
          />
          {/* ── Mobile Logo ── */}
          <img
            src="/logo-transparent-mobile.png"
            alt="Coinvestopedia"
            width={48}
            height={48}
            decoding="async"
            className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105 block md:hidden"
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
              <span>{link.label}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider animate-pulse border border-primary/30">
                Featured
              </span>
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto relative z-10">
          {/* Hamburger: Hidden on mobile (< md) because bottom nav exists. Visible on tablet (md-xl). Hidden on desktop (> xl). */}
          <button className="hidden md:block xl:hidden text-text p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={() => onToggleMobileMenu(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Side Drawer - Moved outside header tag to prevent clipping/flicker */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            key="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onToggleMobileMenu(false)}
            className="xl:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
        )}
        
        {isMobileMenuOpen && (
          <motion.div 
            key="mobile-menu-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="xl:hidden fixed bottom-[68px] left-0 w-full bg-background border-t border-border/50 z-[70] flex flex-col shadow-[0_-8px_32px_rgba(0,0,0,0.6)] rounded-t-[32px] max-h-[85vh] overflow-hidden"
          >
            <div className="w-full flex justify-center pt-4 pb-2">
               <div className="w-12 h-1.5 bg-border rounded-full" />
            </div>
            <div className="flex items-center justify-between px-6 pb-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <img
                  src="/logo-transparent-mobile.png"
                  alt="Coinvestopedia"
                  width={32}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
                <span className="font-bold text-sm tracking-tight">Intelligence Portal</span>
              </div>
              <button 
                onClick={() => onToggleMobileMenu(false)}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-muted hover:text-text bg-surface/80 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 px-1">Institutional Data</h3>
                  
                  {/* Featured Whale Radar */}
                  {featuredLinks.map((link) => (
                    <div 
                      key={link.label}
                      className={`group relative py-4 px-5 rounded-2xl border transition-all duration-300 flex items-center justify-between overflow-hidden mb-3 ${currentRoute === link.route ? 'border-primary bg-primary/10' : 'border-border/40 bg-surface/30 active:bg-surface/50'}`}
                      onClick={() => handleNavClick(link.route)}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                         <span className="text-xl">{link.icon}</span>
                         <span className={`text-lg font-bold tracking-tight ${currentRoute === link.route ? 'text-primary' : 'text-text'}`}>{link.label}</span>
                      </div>

                      <div className="relative z-10">
                         <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-primary/20">Active</span>
                      </div>
                      
                      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 px-1">Global Research</h3>
                  <div className="grid grid-cols-1 gap-2">
                     {navLinks.map((link) => {
                       const isActive = currentRoute === link.route;
                       return (
                         <div 
                           key={link.label}
                           className={`group py-3.5 px-5 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${isActive ? 'border-primary/40 bg-primary/5' : 'border-border/30 bg-surface/10 active:bg-surface/30'}`}
                           onClick={() => handleNavClick(link.route)}
                         >
                           <span className={`text-base font-semibold tracking-tight transition-colors ${isActive ? 'text-primary' : 'text-text group-hover:text-primary'}`}>
                             {link.label}
                           </span>
                           {isActive && (
                             <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                           )}
                         </div>
                       );
                     })}
                  </div>
                </div>

                <div className="mt-4 p-5 rounded-2xl bg-surface/20 border border-border/40">
                  <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                    Coinvestopedia delivers high-fidelity institutional insights. Professional grade, zero noise.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-border/50 bg-surface/10">
              <p className="text-[10px] text-text-muted text-center font-bold uppercase tracking-widest">
                © 2026 Coinvestopedia Intelligence
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};