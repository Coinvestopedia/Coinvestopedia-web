export const GLOBAL_MARKET_CAP_DATA = [
  { name: 'Global Equities', value: 109, color: '#00A859', percent: '29.1%' },
  { name: 'Fixed Income', value: 130, color: '#3B82F6', percent: '34.7%' },
  { name: 'Real Estate', value: 45, color: '#8B5CF6', percent: '12.0%' },
  { name: 'Gold', value: 16, color: '#FFD700', percent: '4.3%' },
  { name: 'Other Commodities', value: 6, color: '#92400E', percent: '1.6%' },
  { name: 'Private Equity', value: 12, color: '#EC4899', percent: '3.2%' },
  { name: 'Cash & Deposits', value: 50, color: '#6B7280', percent: '13.3%' },
  { name: 'Crypto', value: 2.5, color: '#F7931A', percent: '0.7%' },
  { name: 'Other', value: 4.5, color: '#374151', percent: '1.2%' },
];

export const MODEL_PORTFOLIOS = [
  {
    name: 'Conservative',
    description: 'Capital preservation with modest growth',
    allocations: [
      { asset: 'Bonds', pct: 60, color: '#3B82F6' },
      { asset: 'Equities', pct: 30, color: '#00A859' },
      { asset: 'Gold', pct: 5, color: '#FFD700' },
      { asset: 'BTC', pct: 5, color: '#F7931A' },
    ],
    expectedReturn: '5-7%',
    riskLevel: 'LOW',
  },
  {
    name: 'Balanced',
    description: 'Growth with moderate risk management',
    allocations: [
      { asset: 'Bonds', pct: 40, color: '#3B82F6' },
      { asset: 'Equities', pct: 40, color: '#00A859' },
      { asset: 'Gold', pct: 10, color: '#FFD700' },
      { asset: 'BTC', pct: 10, color: '#F7931A' },
    ],
    expectedReturn: '8-12%',
    riskLevel: 'MED',
  },
  {
    name: 'Growth',
    description: 'Aggressive growth with higher crypto allocation',
    allocations: [
      { asset: 'Bonds', pct: 20, color: '#3B82F6' },
      { asset: 'Equities', pct: 50, color: '#00A859' },
      { asset: 'Gold', pct: 15, color: '#FFD700' },
      { asset: 'BTC', pct: 15, color: '#F7931A' },
    ],
    expectedReturn: '12-18%',
    riskLevel: 'MED',
  },
  {
    name: 'Crypto-Native',
    description: 'Maximum digital asset exposure',
    allocations: [
      { asset: 'Equities', pct: 10, color: '#00A859' },
      { asset: 'Gold', pct: 10, color: '#FFD700' },
      { asset: 'BTC', pct: 50, color: '#F7931A' },
      { asset: 'ETH + Alts', pct: 30, color: '#627EEA' },
    ],
    expectedReturn: '20-40%',
    riskLevel: 'HIGH',
  },
];

// ─── MACRO THEME CARDS ────────────────────────────────────────────────────────

export const MACRO_THEMES = [
  {
    title: 'Tariff Uncertainty',
    subtitle: 'Trade war escalation weighing on global equities',
    impact: 'NEGATIVE',
    detail: 'New tariff announcements driving SPY −6.1% and QQQ −9.3% YTD. Supply chain disruption risks elevating VIX to 31. Risk-off positioning dominating institutional flows.',
  },
  {
    title: "Gold's Safe Haven Rally",
    subtitle: 'Best-performing asset class Q1 2026',
    impact: 'POSITIVE',
    detail: 'Gold +12.6% YTD driven by central bank buying and de-dollarization. Polymarket gives 47% probability for full-year outperformance. Silver following at +10.2%.',
  },
  {
    title: 'Crypto Correlation Regime',
    subtitle: 'BTC trading as risk asset, not safe haven',
    impact: 'NEUTRAL',
    detail: 'BTC 0.68 correlation with Nasdaq suggests crypto hasn\'t decoupled from risk assets. ETH/BTC ratio declining as capital consolidates into BTC. Layer 2 tokens worst-performing crypto subsector.',
  },
  {
    title: 'VIX Elevated Fear',
    subtitle: 'Sustained volatility above 25 = risk-off regime',
    impact: 'NEGATIVE',
    detail: 'VIX at 31, +82% YTD. Historically, sustained VIX >25 correlates with 15-25% drawdowns in risk assets. Mean reversion below 20 needed before adding risk exposure.',
  },
];
