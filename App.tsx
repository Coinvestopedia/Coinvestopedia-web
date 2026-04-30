import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Header } from './components/Header';
import { MobileTabBar } from './components/MobileTabBar';
import { DynamicSidebar } from './components/DynamicSidebar';
import { SidebarRight } from './components/SidebarRight';
import { Background } from './components/Background';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useFocusOnRouteChange } from './hooks/useFocusOnRouteChange';
import { Home } from './pages/Home';


import { VaraDisclaimer } from './components/VaraDisclaimer';

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
const Privacy = React.lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const Terms = React.lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));
const Cookies = React.lazy(() => import('./pages/Cookies').then(module => ({ default: module.Cookies })));
const Disclaimer = React.lazy(() => import('./pages/Disclaimer'));
const AffiliateDisclosure = React.lazy(() => import('./pages/AffiliateDisclosure'));
const ConfirmSubscription = React.lazy(() => import('./pages/ConfirmSubscription').then(module => ({ default: module.ConfirmSubscription })));
const NotFound = React.lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

import { PageRoute } from './types';
import { AppProvider, useAppContext } from './context/AppContext';
import { AssetRegistryProvider } from './context/AssetRegistryContext';
import { ToastContainer } from './components/Toast';
import { initializeConsent } from './utils/consent';
import { CookieBanner } from './components/CookieBanner';


/**
 * Maps a pathname string to a PageRoute enum value.
 * Handles both exact matches and the root fallback.
 */
function pathnameToRoute(pathname: string): PageRoute {
  // Handle parameterized routes
  if (pathname.startsWith('/insights')) return PageRoute.INSIGHTS;
  if (pathname.startsWith('/macro-intel')) return PageRoute.MACRO_INTEL;
  if (pathname.startsWith('/tools')) return PageRoute.TOOLS;
  if (pathname.startsWith('/compare')) return PageRoute.COMPARE;
  if (pathname.startsWith('/exchanges')) return PageRoute.EXCHANGES;

  // Build reverse lookup: '/compare' → PageRoute.COMPARE, etc.
  const routeValues = Object.values(PageRoute) as string[];
  const match = routeValues.find(r => r === pathname);
  if (match) return match as PageRoute;

  // Default to home for unknown paths
  return PageRoute.HOME;
}

const AppContent: React.FC = () => {
  const { theme, setActiveSubMenu, setPageCategories } = useAppContext();
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

  // Initialize Google Consent Mode v2
  useEffect(() => {
    initializeConsent();
  }, []);

  const handleNavigate = useCallback((route: PageRoute) => {
    // Reset sidebar context on navigation
    setActiveSubMenu(null);
    setPageCategories([]);

    setCurrentRoute(route);
    setIsMobileMenuOpen(false);

    // Push new path to browser history
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveSubMenu, setPageCategories]);

  const renderPage = () => {
    let page;
    switch (currentRoute) {
      case PageRoute.HOME:
        // Detect true 404: pathnameToRoute maps unknown paths to HOME,
        // but the actual browser URL won't be '/' in that case.
        if (window.location.pathname !== '/' && window.location.pathname !== '') {
          page = <NotFound onNavigate={handleNavigate} />;
        } else {
          page = <Home onNavigate={handleNavigate} />;
        }
        break;
      case PageRoute.WHALE:
        page = <WhaleTracker onNavigate={handleNavigate} />;
        break;
      case PageRoute.COMPARE:
        page = <Compare onNavigate={handleNavigate} />;
        break;
      case PageRoute.MACRO_INTEL:
        page = <MacroIntel onNavigate={handleNavigate} />;
        break;
      case PageRoute.TOOLS:
        page = <Tools onNavigate={handleNavigate} />;
        break;
      case PageRoute.NEWSLETTER:
        page = <Newsletter onNavigate={handleNavigate} />;
        break;
      case PageRoute.EXCHANGES:
        page = <Exchanges onNavigate={handleNavigate} />;
        break;
      case PageRoute.LEARN:
        page = <Learn onNavigate={handleNavigate} />;
        break;
      case PageRoute.INSIGHTS:
        page = <Insights onNavigate={handleNavigate} />;
        break;
      case PageRoute.RESEARCH:
        page = <Research onNavigate={handleNavigate} />;
        break;
      case PageRoute.GLOSSARY:
        page = <Glossary onNavigate={handleNavigate} />;
        break;
      case PageRoute.PRIVACY:
        page = <Privacy onNavigate={handleNavigate} />;
        break;
      case PageRoute.TERMS:
        page = <Terms onNavigate={handleNavigate} />;
        break;
      case PageRoute.COOKIES:
        page = <Cookies onNavigate={handleNavigate} />;
        break;
      case PageRoute.DISCLAIMER:
        page = <Disclaimer />;
        break;
      case PageRoute.AFFILIATE:
        page = <AffiliateDisclosure />;
        break;
      case PageRoute.CONFIRM_SUBSCRIPTION:
        page = <ConfirmSubscription onNavigate={handleNavigate} />;
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

  return (
    <div className="min-h-screen bg-background text-text font-body selection:bg-primary/30 relative">
      {/* Skip to main content — accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-bold">
        Skip to main content
      </a>
      
      <Background />
      <ToastContainer />
      <CookieBanner />
      
      <div className="relative z-10">
        <Header 
          currentRoute={currentRoute} 
          onNavigate={handleNavigate}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={setIsMobileMenuOpen}
        />
        
        {/* 
          Grid Layout Optimized (Restored 5-column): 
          160px Sidebar | 32px gap | 720px Content | 32px gap | 300px Sidebar 
        */}
        <main id="main-content" tabIndex={-1} className="max-w-container mx-auto pt-16 lg:pt-[100px] px-6 pb-32 md:pb-24 outline-none">
          <div className="lg:grid lg:grid-cols-[160px_32px_1fr_32px_300px] lg:gap-0">
            
            {/* Col 1: Left Dynamic Sidebar */}
            <div className="hidden lg:block">
              <DynamicSidebar onNavigate={handleNavigate} currentRoute={currentRoute} />
            </div>

            {/* Col 2: Gap */}
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
                  ease: [0.23, 1, 0.32, 1] 
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
              <SidebarRight />
            </div>

          </div>
        </main>
        
        {/* Unified Footer: Visible on all devices */}
        <footer className="border-t border-border mt-auto py-12 bg-background/80 backdrop-blur-md relative z-20">
          <div className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-6">
            
            {/* Global VARA Disclaimer: Moved from individual pages to global footer */}
            <VaraDisclaimer variant="inline" className="mt-0 w-full max-w-4xl opacity-80 hover:opacity-100 transition-opacity" />

            <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5 w-full">
              <img 
                src="/logo-transparent-dark-desktop.png" 
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
                onClick={() => handleNavigate(PageRoute.DISCLAIMER)} 
                className={`transition-colors whitespace-nowrap ${currentRoute === PageRoute.DISCLAIMER ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
              >
                Disclaimer
              </button>
              <button 
                onClick={() => handleNavigate(PageRoute.AFFILIATE)} 
                className={`transition-colors whitespace-nowrap ${currentRoute === PageRoute.AFFILIATE ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
              >
                Affiliate Disclosure
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
        <MobileTabBar 
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          isMenuOpen={isMobileMenuOpen}
          onToggleMenu={setIsMobileMenuOpen}
        />

        {/* Global Action Button: Invisible until scroll > 300px */}
        <ScrollToTop />
        

      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AssetRegistryProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AssetRegistryProvider>
    </AppProvider>
  );
};

export default App;