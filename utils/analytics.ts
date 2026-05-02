/**
 * Analytics utility for Google Tag Manager and Microsoft Clarity tracking.
 * This helper ensures dataLayer.push and clarity calls are made safely.
 */

export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    // 1. Google Tag Manager / GA4
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: eventName,
      ...properties,
      timestamp: new Date().toISOString()
    });
    
    // 2. Microsoft Clarity Event Tracking
    if (typeof (window as any).clarity === 'function') {
      (window as any).clarity("event", eventName);
      
      // If properties are provided, set them as custom tags for this session
      Object.entries(properties).forEach(([key, value]) => {
        (window as any).clarity("set", key, String(value));
      });
    }
    
    // Optional: Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Event: ${eventName}`, properties);
    }
  }
};

/**
 * Identifies a user in Microsoft Clarity.
 * @param userId Unique identifier for the user
 * @param friendlyName Human-readable name or email
 */
export const identifyUser = (userId: string, friendlyName?: string) => {
  if (typeof window !== 'undefined' && typeof (window as any).clarity === 'function') {
    // window.clarity("identify", "custom-id", "custom-session-id", "custom-page-id", "friendly-name")
    (window as any).clarity("identify", userId, undefined, undefined, friendlyName);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Clarity] Identified User: ${userId} (${friendlyName || 'No friendly name'})`);
    }
  }
};
