/**
 * Google Consent Mode v2 Utility
 * This module manages the state of user consent and communicates it to GTM/GA4.
 */

export type ConsentState = 'granted' | 'denied';

export interface UserConsent {
  analytics_storage: ConsentState;
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
}

const CONSENT_STORAGE_KEY = 'coinvest_consent_v2';

/**
 * Default consent state for high-compliance environments.
 */
export const DEFAULT_CONSENT: UserConsent = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

/**
 * Communicates consent to GTM/gtag.
 */
export const updateGtmConsent = (consent: UserConsent) => {
  if (typeof window !== 'undefined') {
    const dataLayer = (window as any).dataLayer || [];
    
    // Helper to safely call gtag or push to dataLayer
    const gtag = (...args: any[]) => {
      dataLayer.push(args);
    };

    gtag('consent', 'update', {
      'analytics_storage': consent.analytics_storage,
      'ad_storage': consent.ad_storage,
      'ad_user_data': consent.ad_user_data,
      'ad_personalization': consent.ad_personalization,
    });

    // Fire an event to trigger tag re-evaluation in GTM
    dataLayer.push({
      'event': 'consent_updated',
      'consent_state': consent
    });

    if (process.env.NODE_ENV === 'development') {
      // Use a slightly different approach to avoid console warning or just accept it
      // if it's explicitly gated.
      // eslint-disable-next-line no-console
      console.log('[Consent] GTM Updated:', consent);
    }
  }
};

/**
 * Saves consent to localStorage and updates GTM.
 */
export const saveConsent = (consent: UserConsent) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    updateGtmConsent(consent);
  }
};

/**
 * Retrieves saved consent or returns null if not set.
 */
export const getSavedConsent = (): UserConsent | null => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as UserConsent;
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

/**
 * Initializes consent state on page load.
 */
export const initializeConsent = () => {
  if (typeof window !== 'undefined') {
    const saved = getSavedConsent();
    if (saved) {
      updateGtmConsent(saved);
    } else {
      // If no saved preference, set defaults in GTM (if not already handled in index.html)
      // Note: Best practice is to set defaults in index.html, but we handle it here too.
      updateGtmConsent(DEFAULT_CONSENT);
    }
  }
};
