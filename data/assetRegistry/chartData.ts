
export const generateChartMockData = () => {
  const data = [];
  let startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 3);

  let btc = 35000, eth = 2000, sol = 30, gold = 1800, spy = 400, qqq = 320;

  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < Math.floor(365 * 3 / 7); i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 7));

    btc = btc * (1 + (seededRandom(i + 1) * 0.15 - 0.07));
    eth = eth * (1 + (seededRandom(i + 2) * 0.18 - 0.08));
    sol = sol * (1 + (seededRandom(i + 3) * 0.25 - 0.11));
    gold = gold * (1 + (seededRandom(i + 4) * 0.03 - 0.012));
    spy = spy * (1 + (seededRandom(i + 5) * 0.05 - 0.02));
    qqq = qqq * (1 + (seededRandom(i + 6) * 0.06 - 0.025));

    data.push({
      date: date.toISOString().split('T')[0],
      BTC: Math.max(1000, btc),
      ETH: Math.max(100, eth),
      SOL: Math.max(5, sol),
      GOLD: Math.max(1500, gold),
      SPY: Math.max(250, spy),
      QQQ: Math.max(200, qqq),
    });
  }
  return data;
};

export const CHART_MOCK_DATA = generateChartMockData();
