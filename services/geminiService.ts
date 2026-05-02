/**
 * Institutional AI Proxy Service
 * Routes all requests through Cloudflare Functions to ensure API Key isolation.
 */

export interface AnalysisSource {
  title: string;
  uri: string;
}

export interface AnalysisResponse {
  text: string;
  sources?: AnalysisSource[];
}

// Keep the same interface as the old file for compatibility
export interface InsightResult {
  text: string;
  sources?: { title: string; uri: string }[];
}

export class GeminiService {
  /**
   * Fetches market insights via the Pulse proxy
   */
  async getMarketInsight(topic: string): Promise<InsightResult> {
    try {
      const response = await fetch(`/api/market-insight?topic=${encodeURIComponent(topic)}`);
      if (!response.ok) throw new Error('Insight proxy error');
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) throw new Error('Non-JSON response (likely local dev)');
      return await response.json();
    } catch (error) {
      // /api/market-insight is a Cloudflare Pages Function — expected to fail locally
      if (import.meta.env.DEV) {
        console.debug('[GeminiService] AI proxy unavailable locally, using fallback.');
      } else {
        console.error('GeminiService Error:', error);
      }
      return { 
        text: "The global financial landscape is currently navigating a period of structural re-alignment. Institutional participants are closely monitoring cross-market correlations between traditional equity indices and digital asset flows." 
      };
    }
  }

  /**
   * Analyzes specific asset movements for Whale Tracker
   */
  async analyzeAssetMovement(
    asset: string,
    movementType: string,
    amount: string,
    fromAddress?: string,
    toAddress?: string,
    _signal?: AbortSignal
  ): Promise<InsightResult> {
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset, movementType, amount, fromAddress, toAddress })
      });

      if (!response.ok) throw new Error('Asset analysis proxy error');
      return await response.json();
    } catch (error) {
      console.error('GeminiService Asset Analysis Error:', error);
      return { text: `Operational Observation: Transfer of ${amount} ${asset} detected. Institutional liquidity flow patterns suggested. Analysis node recalibrating.` };
    }
  }
}

export const geminiService = new GeminiService();

// Re-export functions for backward compatibility if needed
export const getMarketInsight = (topic: string) => geminiService.getMarketInsight(topic);
export const analyzeAssetMovement = (
  asset: string, 
  movementType: string, 
  amount: string, 
  fromAddress?: string, 
  toAddress?: string
) => geminiService.analyzeAssetMovement(asset, movementType, amount, fromAddress, toAddress);