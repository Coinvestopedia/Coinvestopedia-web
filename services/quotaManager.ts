// services/quotaManager.ts

interface QuotaConfig {
  source: string;
  dailyLimit: number;
  monthlyLimit: number;
  minIntervalMs: number;   // enforced minimum between requests
  priority: 1 | 2 | 3;    // 1 = critical, shed last; 3 = optional
}

interface QuotaState {
  dailyUsed: number;
  monthlyUsed: number;
  lastResetDay: number;
  lastResetMonth: number;
  lastCallTimestamp: number;
}

const QUOTA_CONFIGS: Record<string, QuotaConfig> = {
  whaleAlert: {
    source: 'whale-alert',
    dailyLimit: 333,
    monthlyLimit: 10_000,
    minIntervalMs: 5 * 60 * 1000,    // 5 min minimum
    priority: 1,
  },
  etherscan: {
    source: 'etherscan',
    dailyLimit: 80_000,               // 80% limit padding
    monthlyLimit: Infinity,
    minIntervalMs: 1_000,             // 1 req/s
    priority: 1,
  },
  blockchair: {
    source: 'blockchair',
    dailyLimit: 800,                  // 80% limit padding
    monthlyLimit: Infinity,
    minIntervalMs: 120_000,           // 2 min minimum
    priority: 3,                      // shed first under pressure
  },
  theGraph: {
    source: 'the-graph',
    dailyLimit: 3_000,
    monthlyLimit: 100_000,
    minIntervalMs: 10_000,            // 10s minimum
    priority: 2,
  },
  cryptoQuant: {
    source: 'crypto-quant',
    dailyLimit: 40,                   // 80% of 50 req/day Limit
    monthlyLimit: Infinity,
    minIntervalMs: 3600_000,          // 1 hour minimum interval based on our usage
    priority: 1,
  }
};

const QUOTA_STORAGE_KEY = 'coinvestopedia_quota_manager';

class QuotaManager {
  private state: Record<string, QuotaState> = {};

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const stored = localStorage.getItem(QUOTA_STORAGE_KEY);
      if (stored) {
        this.state = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load QuotaManager state from local storage', e);
    }
  }

  private saveState() {
    try {
      localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save QuotaManager state to local storage', e);
    }
  }

  private getState(source: string): QuotaState {
    const now = new Date();
    const today = now.getDate();
    const month = now.getMonth();

    if (!this.state[source]) {
      this.state[source] = {
        dailyUsed: 0,
        monthlyUsed: 0,
        lastResetDay: today,
        lastResetMonth: month,
        lastCallTimestamp: 0,
      };
    }

    const s = this.state[source];

    // Daily reset
    if (s.lastResetDay !== today) {
      s.dailyUsed = 0;
      s.lastResetDay = today;
      this.saveState(); // Ensure reset is persisted
    }

    // Monthly reset
    if (s.lastResetMonth !== month) {
      s.monthlyUsed = 0;
      s.lastResetMonth = month;
      this.saveState(); // Ensure reset is persisted
    }

    return s;
  }

  canCall(source: string): { allowed: boolean; reason?: string; retryAfterMs?: number } {
    const config = QUOTA_CONFIGS[source];
    if (!config) return { allowed: true }; // Unmanaged source defaults to true

    const state = this.getState(source);
    const now = Date.now();

    if (state.dailyUsed >= config.dailyLimit) {
      return { allowed: false, reason: 'daily_limit', retryAfterMs: msUntilMidnight() };
    }

    if (state.monthlyUsed >= config.monthlyLimit) {
      return { allowed: false, reason: 'monthly_limit', retryAfterMs: msUntilMonthEnd() };
    }

    const timeSinceLast = now - state.lastCallTimestamp;
    if (timeSinceLast < config.minIntervalMs) {
      return {
        allowed: false,
        reason: 'rate_limit',
        retryAfterMs: config.minIntervalMs - timeSinceLast,
      };
    }

    return { allowed: true };
  }

  recordCall(source: string) {
    if (!QUOTA_CONFIGS[source]) return;

    const state = this.getState(source);
    state.dailyUsed++;
    state.monthlyUsed++;
    state.lastCallTimestamp = Date.now();
    this.saveState(); // Immediately save updated usage
  }

  getUsageReport() {
    return Object.entries(QUOTA_CONFIGS).map(([key, config]) => {
      const state = this.getState(key);
      return {
        source: key,
        daily: { used: state.dailyUsed, limit: config.dailyLimit, pct: Math.round(state.dailyUsed / config.dailyLimit * 100) },
        monthly: { used: state.monthlyUsed, limit: config.monthlyLimit },
        priority: config.priority,
      };
    });
  }
}

export const quotaManager = new QuotaManager();

// Utility
function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function msUntilMonthEnd(): number {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.getTime() - now.getTime();
}
