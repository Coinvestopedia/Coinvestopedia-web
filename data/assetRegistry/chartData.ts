
export const generateChartMockData = () => {
  const data = [];
  let startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 3);

  // Expanded symbol list to cover all categories
  const symbols = [
    // L1
    'BTC', 'ETH', 'SOL', 'BNB', 'ADA', 'AVAX', 'DOT', 'NEAR', 'TON', 'TRX', 'LINK',
    // L2 & DeFi
    'ARB', 'OP', 'MATIC', 'UNI', 'AAVE', 'MKR', 'PENDLE', 'JUP', 'LDO', 'IMX', 'MANTLE',
    // AI & RWA
    'TAO', 'RNDR', 'FET', 'ONDO', 'POL', 'PEPE', 'WIF', 'BONK',
    // Equities
    'AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META',
    // Commodities & Macro
    'GOLD', 'SILVER', 'OIL', 'SPY', 'QQQ', 'DXY', 'VIX', 'UST10Y'
  ];

  // Initialize base prices and volatilities
  const assetStates: Record<string, { price: number; vol: number }> = {
    BTC: { price: 35000, vol: 0.15 },
    ETH: { price: 2000, vol: 0.18 },
    SOL: { price: 30, vol: 0.25 },
    GOLD: { price: 1800, vol: 0.03 },
    SPY: { price: 400, vol: 0.05 },
    QQQ: { price: 320, vol: 0.06 },
    DXY: { price: 100, vol: 0.02 },
    OIL: { price: 75, vol: 0.08 },
  };

  // Provide defaults for others
  symbols.forEach(s => {
    if (!assetStates[s]) {
      assetStates[s] = { price: 100, vol: 0.12 }; // Generic default
    }
  });

  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < Math.floor(365 * 3 / 7); i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 7));

    const dataPoint: any = {
      date: date.toISOString().split('T')[0],
    };

    symbols.forEach((symbol, index) => {
      const state = assetStates[symbol];
      // Walk the price
      const change = seededRandom(i * symbols.length + index) * state.vol * 2 - state.vol;
      state.price = state.price * (1 + change);
      dataPoint[symbol] = Math.max(state.price, 0.01);
    });

    data.push(dataPoint);
  }
  return data;
};

export const CHART_MOCK_DATA = generateChartMockData();
