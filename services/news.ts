import { fetchWithCache } from './base';

/**
 * Coinvestopedia News Service
 * Uses secure Cloudflare Proxies for news aggregation
 */

export interface RSSNewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description: string;
}

const RSS_SOURCES = [
  { url: '/rss/coindesk', name: 'CoinDesk' },
  { url: '/rss/cointelegraph', name: 'Cointelegraph' },
  { url: '/rss/decrypt', name: 'Decrypt' },
];

export const fetchNewsFeed = async () => {
  try {
    // Calls secure proxy /api/cryptopanic which injects the key
    const response = await fetch(`/api/cryptopanic/api/v1/posts/?kind=news`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching news feed:', error);
    return [];
  }
};

const parseRSSXml = (xmlText: string, sourceName: string): RSSNewsItem[] => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const items = doc.querySelectorAll('item');
    const results: RSSNewsItem[] = [];
    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent?.trim() || '';
      const link = item.querySelector('link')?.textContent?.trim() || '';
      const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
      const descRaw = item.querySelector('description')?.textContent?.trim() || '';
      const description = descRaw.replace(/<[^>]*>/g, '').substring(0, 200);
      if (title) results.push({ title, link, pubDate, source: sourceName, description });
    });
    return results;
  } catch (e) {
    console.error(`Failed to parse RSS from ${sourceName}:`, e);
    return [];
  }
};

export const fetchCryptoRSSFeeds = async (): Promise<RSSNewsItem[]> => {
  const CACHE_KEY = 'coinvestopedia_rss_feeds';
  const TTL = 21600 * 1000;
  let staleData: RSSNewsItem[] | null = null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      staleData = data;
      if (Date.now() - timestamp < TTL) return data;
    }
  } catch (e) { console.warn("RSS cache parse error:", e); }

  try {
    const feedPromises = RSS_SOURCES.map(async (src) => {
      try {
        const response = await fetch(src.url);
        if (!response.ok) return [];
        const text = await response.text();
        if (text.trimStart().startsWith('<!DOCTYPE') || text.trimStart().startsWith('<html')) return [];
        return parseRSSXml(text, src.name);
      } catch { return []; }
    });
    const allFeeds = await Promise.all(feedPromises);
    const merged = allFeeds.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    const result = merged.slice(0, 30);
    if (result.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: result }));
      return result;
    }
    return staleData || [];
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return staleData || [];
  }
};

export const fetchYahooNews = async (symbol: string) => {
  try {
    const url = `/api/yahoo/v1/finance/search?q=${symbol}`;
    const data = await fetchWithCache(`yahoo_news_${symbol}`, url, {}, 600);
    return data.news || [];
  } catch (error) {
    console.error('Error fetching Yahoo News:', error);
    return [];
  }
};
