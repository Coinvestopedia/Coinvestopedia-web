/**
 * Analytics utility for Google Tag Manager tracking.
 * This helper ensures dataLayer.push is called safely and consistently.
 */

export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    // Initialize dataLayer if it doesn't exist (though GTM snippet usually does this)
    (window as any).dataLayer = (window as any).dataLayer || [];
    
    (window as any).dataLayer.push({
      event: eventName,
      ...properties,
      timestamp: new Date().toISOString()
    });
    
    // Optional: Log for development (could be gated by environment)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Event: ${eventName}`, properties);
    }
  }
};
