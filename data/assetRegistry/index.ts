export * from './types';
import { ASSETS_L1 } from './assets/cryptoL1';
import { ASSETS_L2 } from './assets/cryptoL2';
import { ASSETS_DEFI } from './assets/cryptoDeFi';
import { ASSETS_AI } from './assets/aiAndData';
import { ASSETS_RWA } from './assets/rwa';
import { ASSETS_EQUITIES } from './assets/equities';
import { ASSETS_COMMODITIES } from './assets/commodities';
import { ASSETS_MACRO } from './assets/macro';
import { AssetData } from './types';

export const ASSET_REGISTRY: Record<string, AssetData> = {
  ...ASSETS_L1,
  ...ASSETS_L2,
  ...ASSETS_DEFI,
  ...ASSETS_AI,
  ...ASSETS_RWA,
  ...ASSETS_EQUITIES,
  ...ASSETS_COMMODITIES,
  ...ASSETS_MACRO,
};

export const DEFAULT_ASSETS = ['BTC', 'ETH', 'GOLD', 'SPY', 'QQQ', 'DXY'];

export * from './chartData';
export * from './correlationMatrix';
export * from './modelPortfolios';
