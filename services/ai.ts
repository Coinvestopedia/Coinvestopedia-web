/**
 * Coinvestopedia AI Service
 * Uses secure Cloudflare Proxies for Gemini integration
 */

export const generateMarketPulseInsights = async (marketContext: string) => {
  const CACHE_KEY = 'coinvestopedia_gemini_insights';
  const TTL_MS = 6 * 60 * 60 * 1000;

  let staleData = null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      staleData = parsed.data;
      if (Date.now() - parsed.timestamp < TTL_MS && staleData !== null) return staleData;
    }
  } catch (e) { console.warn("AI cache read error:", e); }

  try {
    const response = await fetch('/api/ai/pulse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marketContext })
    });

    if (!response.ok) throw new Error('AI Proxy failed');

    const insights = await response.json();
    if (Array.isArray(insights) && insights.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: insights }));
      return insights;
    }
    return staleData || [];
  } catch (error) {
    console.error(`AI generation error:`, error);
    return staleData || [];
  }
};
