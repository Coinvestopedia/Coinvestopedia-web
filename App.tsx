import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home as HomeIcon, Calculator, Menu } from 'lucide-react';
import { Header } from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { Background } from './components/Background';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useFocusOnRouteChange } from './hooks/useFocusOnRouteChange';
import { Home } from './pages/Home';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Cookies } from './pages/Cookies';


// Lazy-loaded pages for performance
const WhaleTracker = React.lazy(() => import('./pages/WhaleTracker').then(module => ({ default: module.WhaleTracker })));
const Compare = React.lazy(() => import('./pages/Compare').then(module => ({ default: module.Compare })));
const Tools = React.lazy(() => import('./pages/Tools').then(module => ({ default: module.Tools })));
const MacroIntel = React.lazy(() => import('./pages/MacroIntel').then(module => ({ default: module.MacroIntel })));
const Exchanges = React.lazy(() => import('./pages/Exchanges').then(module => ({ default: module.Exchanges })));
const Learn = React.lazy(() => import('./pages/Learn').then(module => ({ default: module.Learn })));
const Insights = React.lazy(() => import('./pages/Insights').then(module => ({ default: module.Insights })));
const Research = React.lazy(() => import('./pages/Research').then(module => ({ default: module.Research })));
const Glossary = React.lazy(() => import('./pages/Glossary').then(module => ({ default: module.Glossary })));
const Newsletter = React.lazy(() => import('./pages/Newsletter').then(module => ({ default: module.Newsletter })));

import { PageRoute } from './types';
import { AppProvider, useAppContext } from './context/AppContext';
import { ToastContainer } from './components/Toast';
import { TargetIcon } from './components/AnimatedIcons';

/**
 * Maps a pathname string to a PageRoute enum value.
 * Handles both exact matches and the root fallback.
 */
function pathnameToRoute(pathname: string): PageRoute {
  // Build reverse lookup: '/compare' → PageRoute.COMPARE, etc.
  const routeValues = Object.values(PageRoute) as string[];
  const match = routeValues.find(r => r === pathname);
  if (match) return match as PageRoute;

  // Default to home for unknown paths
  return PageRoute.HOME;
}

const AppContent: React.FC = () => {
  const { theme } = useAppContext();
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() => pathnameToRoute(window.location.pathname));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Accessibility: move focus to main content on route change
  useFocusOnRouteChange(currentRoute);

  // Sync route state with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(pathnameToRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = useCallback((route: PageRoute) => {
    setCurrentRoute(route);
    setIsMobileMenuOpen(false);

    // Push new path to browser history
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
    let page;
    switch (currentRoute) {
      case PageRoute.HOME:
        page = <Home onNavigate={handleNavigate} />;
        break;
      case PageRoute.WHALE:
        page = <WhaleTracker />;
        break;
      case PageRoute.COMPARE:
        page = <Compare />;
        break;
      case PageRoute.MACRO_INTEL:
        page = <MacroIntel />;
        break;
      case PageRoute.TOOLS:
        page = <Tools />;
        break;
      case PageRoute.NEWSLETTER:
        page = <Newsletter />;
        break;
      case PageRoute.LEARN:
        page = <Learn onNavigate={handleNavigate} />;
        break;
      case PageRoute.RESEARCH:
        page = <Research />;
        break;
      case PageRoute.INSIGHTS:
        page = <Insights />;
        break;
      case PageRoute.GLOSSARY:
        page = <Glossary />;
        break;
      case PageRoute.EXCHANGES:
        page = <Exchanges />;
        break;
      case PageRoute.PRIVACY:
        page = <Privacy />;
        break;
      case PageRoute.TERMS:
        page = <Terms />;
        break;
      case PageRoute.COOKIES:
        page = <Cookies />;
        break;
      default:
        page = <Home onNavigate={handleNavigate} />;
        break;
    }
    
    return (
      <React.Suspense fallback={<div className="animate-pulse h-96 w-full rounded-2xl bg-surface/50 border border-border"></div>}>
        {page}
      </React.Suspense>
    );
  };

  const mobileNavItems = [
    { label: 'Dashboard', icon: <HomeIcon size={20} />, route: PageRoute.HOME },
    { label: 'Whales', icon: <TargetIcon className="w-5 h-5" />, route: PageRoute.WHALE },
    { label: 'Tools', icon: <Calculator size={20} />, route: PageRoute.TOOLS },
  ];



  return (
    <div className="min-h-screen bg-background text-text font-body selection:bg-primary/30 relative">
      {/* Skip to main content — accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-bold">
        Skip to main content
      </a>
      
      <Background />
      <ToastContainer />
      
      <div className="relative z-10">
        <Header 
          currentRoute={currentRoute} 
          onNavigate={handleNavigate}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={setIsMobileMenuOpen}
        />
        
        {/* 
          Grid Layout from Design System: 
          160px Sidebar | 32px gap | 720px Content | 32px gap | 300px Sidebar 
          Total: 1244px fit in 1280px container
        */}
        <main id="main-content" tabIndex={-1} className="max-w-container mx-auto pt-[72px] lg:pt-[100px] px-6 pb-32 md:pb-24 outline-none">
          <div className="lg:grid lg:grid-cols-[160px_32px_1fr_32px_300px] lg:gap-0">
            
            {/* Col 1: Left Sidebar */}
            <div className="hidden lg:block">
              <SidebarLeft onNavigate={handleNavigate} currentRoute={currentRoute} />
            </div>

            {/* Col 2: Gap (Handled by grid-cols) */}
            <div className="hidden lg:block"></div>

            {/* Col 3: Main Content */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentRoute}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1] // Custom easeOutQuint for premium feel
                }}
                className="w-full min-w-0 transform-gpu"
              >
                <ErrorBoundary>
                  {renderPage()}
                </ErrorBoundary>
              </motion.div>
            </AnimatePresence>

            {/* Col 4: Gap */}
            <div className="hidden lg:block"></div>

            {/* Col 5: Right Sidebar */}
            <div className="mt-12 lg:mt-0 hidden xl:block">
              <SidebarRight onNavigate={handleNavigate} />
            </div>

          </div>
        </main>
        
        {/* Unified Footer: Visible on all devices */}
        <footer className="border-t border-border mt-auto py-12 bg-background/80 backdrop-blur-md relative z-20">
          <div className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <img 
                src={theme === 'dark' ? '/logo-transparent-dark-desktop.png' : '/logo-transparent-light-desktop.png'} 
                alt="Coinvestopedia" 
                className="h-16 md:h-24 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <p className="text-text-muted text-sm px-4">
                © {new Date().getFullYear()} Coinvestopedia Knowledge. World-class institutional crypto data and research.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium">
              <button 
                onClick={() => handleNavigate(PageRoute.PRIVACY)} 
                className={`transition-colors whitespace-nowrap ${currentRoute === PageRoute.PRIVACY ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => handleNavigate(PageRoute.TERMS)} 
                className={`transition-colors whitespace-nowrap ${currentRoute === PageRoute.TERMS ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
              >
                Terms of Service
              </button>
              <button 
                onClick={() => handleNavigate(PageRoute.COOKIES)} 
                className={`transition-colors whitespace-nowrap ${currentRoute === PageRoute.COOKIES ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
              >
                Cookie Policy
              </button>
            </div>
            
            {/* Mobile Bottom Padding to account for navigation bar */}
            <div className="h-20 md:hidden" aria-hidden="true" />
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border">
          <div className="flex items-center justify-around h-[64px] px-2">
            {mobileNavItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.route)}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  currentRoute === item.route 
                    ? 'text-primary' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </button>
            ))}
            {/* Menu Toggle Item */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isMobileMenuOpen ? 'text-primary' : 'text-text-muted hover:text-text'
              }`}
            >
              <Menu size={20} />
              <span className="text-[10px] font-medium tracking-wide">Menu</span>
            </button>
          </div>
          {/* Safe area spacer for iOS Home Indicator */}
          <div className="h-[env(safe-area-inset-bottom)] bg-surface"></div>
        </div>

        {/* Global Action Button: Invisible until scroll > 300px */}
        <ScrollToTop />
        

      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  );
};

export default App;