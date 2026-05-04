import React, { useState, useEffect } from 'react';
import { Shield, X, Check, ExternalLink } from 'lucide-react';
import { UserConsent, DEFAULT_CONSENT, saveConsent, getSavedConsent } from '../utils/consent';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const saved = getSavedConsent();
    if (!saved) {
      // Small delay to ensure smooth page load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allGranted: UserConsent = {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    };
    saveConsent(allGranted);
    setIsVisible(false);
  };

  const handleDeclineAll = () => {
    saveConsent(DEFAULT_CONSENT);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-12 lg:max-w-md z-[400] animate-slide-in-up">
      <div className="leather-card p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
        
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 shrink-0">
            <Shield className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-text mb-1 flex items-center gap-2">
              Privacy Preference
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              We use analytics and research tools to improve our institutional intelligence. Your data is protected and never sold.
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-muted hover:text-text transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-text-muted mb-1 px-1">
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-primary" />
              <span>Consent Mode v2 Compliant</span>
            </div>
            <a 
              href="/cookies" 
              className="hover:text-primary underline flex items-center gap-1 transition-colors min-h-[44px] px-2 -mx-2"
            >
              Full Policy <ExternalLink size={12} />
            </a>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDeclineAll}
              className="px-4 py-2.5 min-h-[44px] rounded-xl border border-border bg-surface hover:bg-background text-text text-sm font-medium transition-all"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2.5 min-h-[44px] rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              Accept All
            </button>
          </div>
        </div>

        {/* Legal footprint */}
        <div className="mt-4 pt-4 border-t border-border/50 text-[10px] text-text-muted/60 uppercase tracking-widest text-center">
          Institutional Intel &bull; Coinvestopedia 2026
        </div>
      </div>
    </div>
  );
};
