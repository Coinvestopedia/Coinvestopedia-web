/**
 * Coinvestopedia Base Service Utility
 * Institutional-grade caching and fetch wrappers
 */

/**
 * Advanced Fetch with Cache: 
 * 1. Returns fresh data if within TTL.
 * 2. If fetch fails (Quota, 403, Network), returns STALE data from cache if available.
 * 3. Standardizes default TTL to 6 hours (21600s) as per institutional requirements.
 */
export const fetchWithCache = async (cacheKey: string, url: string, options: RequestInit = {}, ttlSeconds: number = 21600) => {
  const cachedItem = localStorage.getItem(cacheKey);
  let staleData = null;

  if (cachedItem) {
    try {
      const { timestamp, data } = JSON.parse(cachedItem);
      staleData = data;
      // Return fresh cache if not expired
      if (Date.now() - timestamp < ttlSeconds * 1000 && data !== null) {
        return data;
      }
    } catch (e) {
      console.warn(`[Cache] Parse error for ${cacheKey}:`, e);
    }
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.warn(`[API] Fetch failed for ${url} with status ${response.status}. Attempting stale fallback...`);
      
      // If we have stale data, return it instead of throwing
      if (staleData !== null) return staleData;
      
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Safety check for empty or malformed data
    if (!data || (Array.isArray(data) && data.length === 0)) {
       if (staleData !== null) return staleData;
    }

    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
    return data;
  } catch (err) {
    console.error(`[API] Network or Quota error for ${url}:`, err);
    // Final fallback: return stale data if we have it
    if (staleData !== null) {
      console.log(`[API] Serving stale data for ${cacheKey} due to error.`);
      return staleData;
    }
    throw err;
  }
};
