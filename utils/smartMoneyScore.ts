export interface ProprietaryMetrics {
  fearAndGreed: number; // 0-100
  sopr: number; // e.g., 0.95 to 1.05
  netFlow: number; // USD value, negative is net outflow (accumulation)
  exchangeOutflow: number; // Gross USD outflow volume
  minerOutflow: number; // 0-100 normalized index
}

/**
 * Calculates a proprietary "Smart Money Confidence" score from 0-100.
 */
export const calculateSmartMoneyConfidence = (metrics: ProprietaryMetrics): number => {
  let score = 50; // Neutral baseline

  // 1. Fear & Greed (Contrarian Indicator) - High Impact
  if (metrics.fearAndGreed < 20) score += 20; // Extreme Fear
  else if (metrics.fearAndGreed < 40) score += 10;
  else if (metrics.fearAndGreed > 80) score -= 20; // Extreme Greed
  else if (metrics.fearAndGreed > 60) score -= 10;

  // 2. SOPR (Spent Output Profit Ratio) - Momentum Indicator
  if (metrics.sopr < 0.95) score += 20; // Mass capitulation
  else if (metrics.sopr < 1.0) score += 10;
  else if (metrics.sopr > 1.05) score -= 15;
  else if (metrics.sopr > 1.1) score -= 25;

  // 3. Exchange Flows (Whale Movements) - Critical Live Signal
  // Net Flow: Negative is Outflow (Cold Storage) = Bullish
  if (metrics.netFlow < -250000000) score += 25; // >$250M Net Outflow
  else if (metrics.netFlow < -50000000) score += 15;
  else if (metrics.netFlow > 250000000) score -= 30; // >$250M Net Inflow
  else if (metrics.netFlow > 50000000) score -= 15;

  // Gross Outflow: High gross volume moving off exchanges is strong signal
  if (metrics.exchangeOutflow > 500000000) score += 15;
  else if (metrics.exchangeOutflow > 100000000) score += 5;

  // 4. Miner Reserves Index
  if (metrics.minerOutflow < 20) score += 10;
  else if (metrics.minerOutflow > 80) score -= 15;

  // Final Clamp
  return Math.min(Math.max(score, 5), 98); // Avoid literal 0/100 for institutional look
};

/**
 * Fallback static score if all live data fails.
 */
export const getFallbackSmartMoneyConfidence = () => {
  return 52; // Slightly bullish neutral baseline
};
