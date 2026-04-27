export type Grade = 'INSTITUTIONAL' | 'PROFESSIONAL' | 'ACTIVE_TRADER';
export type CustodyModel = 'EXCHANGE' | 'THIRD_PARTY_QUALIFIED' | 'SELF_CUSTODY';
export type PoRStatus = 'FULL_AUDIT' | 'MERKLE_ATTESTATION' | 'NONE';

export interface ExchangeFees {
  spotMaker: number;      // As decimal: 0.001 = 0.1%
  spotTaker: number;
  perpMaker: number;      // Negative = rebate e.g. -0.0001
  perpTaker: number;
  withdrawalBTC: number;  // In BTC
}

export interface ExchangeProfile {
  id: string;
  name: string;
  clearRateScore: number;           // 0–100
  grade: Grade;
  brandColor: string;               // Hex
  founded: number;
  headquarters: string;
  fees: ExchangeFees;
  regulatoryLicenses: string[];
  custodyModel: CustodyModel;
  insuranceCoverage: string | null; // e.g. "$250M" or null
  proofOfReserves: PoRStatus;
  usPersonsEligible: boolean | 'LIMITED';
  derivatives: ('PERPETUALS' | 'OPTIONS' | 'FUTURES' | 'MARGIN')[];
  fixApi: boolean;
  otcDeskMinimum: number | null;    // USD minimum
  assetsListed: number;             // Approximate spot pairs
  riskFlags: string[];
  pros: string[];
  cons: string[];
  summary: string;
  regulatoryNote: string | null;
  bestFor: string;
  affiliateUrl: string;
  affiliateUrlSecondary?: string;
  ctaLabel: string;
  ctaLabelSecondary?: string;
  websiteUrl: string;
  keyMetrics: { label: string; value: string }[];
  regulatoryMap: Record<string, string>;
}

export const EXCHANGES: ExchangeProfile[] = [
  {
    id: 'coinbase',
    name: 'Coinbase Advanced',
    clearRateScore: 91,
    grade: 'INSTITUTIONAL',
    brandColor: '#0052FF',
    founded: 2012,
    headquarters: 'San Francisco, USA',
    fees: { spotMaker: 0.000, spotTaker: 0.0005, perpMaker: 0.000, perpTaker: 0.0003, withdrawalBTC: 0.0000 },
    regulatoryLicenses: ['NYDFS BitLicense', 'SEC Registered', 'FinCEN MSB', 'FCA (UK)', 'MAS (Singapore)', 'NASDAQ Listed: COIN'],
    custodyModel: 'THIRD_PARTY_QUALIFIED',
    insuranceCoverage: '$250M',
    proofOfReserves: 'FULL_AUDIT',
    usPersonsEligible: true,
    derivatives: ['FUTURES'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 240,
    riskFlags: [],
    pros: [
      'Only exchange with SEC-filed audited financials (10-K, 10-Q)',
      'Coinbase Custody Trust: New York State chartered qualified custodian',
      'FDIC pass-through insurance on USD balances up to $250,000',
      'Coinbase Prime: institutional lending, staking, and agency execution',
      'SOC 2 Type 2 certified infrastructure',
      'Publicly traded — full corporate governance accountability'
    ],
    cons: [
      'Retail interface fees up to 1.99% — use Advanced Trade interface',
      'Derivatives suite limited compared to OKX, Bybit, Binance',
      'Asset selection restricted vs. offshore competitors',
      'Geographic restrictions on numerous tokens'
    ],
    summary: 'The most regulated US crypto exchange. Publicly listed (NASDAQ: COIN), providing audited financials unavailable from any competitor.',
    regulatoryNote: null,
    bestFor: 'US Institutional Compliance',
    affiliateUrl: 'https://coinbase.com/join/COINVESTOPEDIA',
    affiliateUrlSecondary: 'https://prime.coinbase.com/COINVESTOPEDIA',
    ctaLabel: 'Open Institutional Account',
    ctaLabelSecondary: 'Explore Coinbase Prime',
    websiteUrl: 'https://advanced.coinbase.com',
    keyMetrics: [
      { label: 'Cold Storage', value: '97%+ of assets' },
      { label: 'USD Balances', value: 'FDIC-insured' }
    ],
    regulatoryMap: { US: 'LICENSED', EU: 'LICENSED', UK: 'LICENSED', UAE: 'REGISTERED', Singapore: 'LICENSED', Australia: 'LICENSED', Canada: 'LICENSED' }
  },
  {
    id: 'kraken',
    name: 'Kraken Pro',
    clearRateScore: 89,
    grade: 'INSTITUTIONAL',
    brandColor: '#5741D9',
    founded: 2011,
    headquarters: 'San Francisco, USA',
    fees: { spotMaker: 0.000, spotTaker: 0.0010, perpMaker: 0.000, perpTaker: 0.0005, withdrawalBTC: 0.00002 },
    regulatoryLicenses: ['FinCEN MSB', 'Wyoming SPDI (Kraken Bank)', 'FCA (UK)', 'VASP (Ireland, EU)', 'AUSTRAC (Australia)', 'FINTRAC (Canada)'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'FULL_AUDIT',
    usPersonsEligible: true,
    derivatives: ['FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 250,
    riskFlags: [],
    pros: [
      'Wyoming SPDI bank charter — only crypto exchange with US bank-equivalent status',
      '13+ year operational track record, zero major security incidents',
      'PoR audited by Armanino LLP quarterly',
      'Kraken OTC desk for institutional block execution',
      'Multi-jurisdictional licensing across US, EU, UK, Canada, Australia',
      'FIX API and institutional sub-account structure'
    ],
    cons: [
      'US derivatives product restricted vs. offshore competitors',
      'Fewer altcoins than Binance or KuCoin',
      'No crime insurance figure publicly disclosed',
      'Customer support response criticized during peak volatility periods'
    ],
    summary: 'Kraken delivers an unparalleled security track record backed by a Wyoming SPDI bank charter.',
    regulatoryNote: null,
    bestFor: 'Best Security Record + Bank Charter',
    affiliateUrl: 'https://kraken.com/COINVESTOPEDIA',
    affiliateUrlSecondary: 'https://kraken.com/otc/COINVESTOPEDIA',
    ctaLabel: 'Open Kraken Pro Account',
    ctaLabelSecondary: 'Contact OTC Desk',
    websiteUrl: 'https://pro.kraken.com',
    keyMetrics: [
      { label: 'Custody', value: 'Geographically distributed' }
    ],
    regulatoryMap: { US: 'LICENSED', EU: 'LICENSED', UK: 'LICENSED', UAE: 'LICENSED', Singapore: 'RESTRICTED', Australia: 'LICENSED', Canada: 'LICENSED' }
  },
  {
    id: 'gemini',
    name: 'Gemini',
    clearRateScore: 86,
    grade: 'INSTITUTIONAL',
    brandColor: '#00DCFA',
    founded: 2014,
    headquarters: 'New York, USA',
    fees: { spotMaker: 0.000, spotTaker: 0.0003, perpMaker: 0.000, perpTaker: 0.0002, withdrawalBTC: 0.00000 },
    regulatoryLicenses: ['NYDFS BitLicense', 'NYDFS Trust Company Charter', 'SOC 2 Type 2 Certified', 'FinCEN MSB'],
    custodyModel: 'THIRD_PARTY_QUALIFIED',
    insuranceCoverage: '$200M',
    proofOfReserves: 'FULL_AUDIT',
    usPersonsEligible: true,
    derivatives: ['FUTURES'],
    fixApi: true,
    otcDeskMinimum: 250000,
    assetsListed: 110,
    riskFlags: ['Genesis/Gemini Earn bankruptcy (2022-2023) — resolved. Reputational damage remains.'],
    pros: [
      'Strongest custody structure: NYDFS Trust Company Charter + SOC 2 Type 2',
      'Lloyd\'s of London underwritten insurance on digital assets',
      '100% of customer assets in cold storage',
      'Monthly PoR attestation by BPM LLP',
      'Gemini Clearing: institutional-grade settlement infrastructure',
      'CCPA and SOX-adjacent compliance standards'
    ],
    cons: [
      'Genesis/Earn episode (resolved 2023) remains a reputational consideration',
      'Smallest asset selection of major US exchanges (~110 pairs)',
      'US-centric — limited international regulatory footprint',
      'Lower mid-cap and altcoin liquidity'
    ],
    summary: 'The tightest custody and compliance controls via NYDFS Trust Charter.',
    regulatoryNote: 'US derivatives only via specialized sub-accounts.',
    bestFor: 'Regulated US Custody + Institutional Infrastructure',
    affiliateUrl: 'https://gemini.com/COINVESTOPEDIA',
    ctaLabel: 'Open Gemini Institutional Account',
    ctaLabelSecondary: 'Explore Gemini Custody',
    websiteUrl: 'https://gemini.com',
    keyMetrics: [
      { label: 'Insurance', value: '$200M Lloyd\'s Syndicate' }
    ],
    regulatoryMap: { US: 'LICENSED', EU: 'LICENSED', UK: 'LICENSED', UAE: 'REGISTERED', Singapore: 'LICENSED', Australia: 'LICENSED', Canada: 'LICENSED' }
  },
  {
    id: 'binance',
    name: 'Binance',
    clearRateScore: 84,
    grade: 'PROFESSIONAL',
    brandColor: '#F0B90B',
    founded: 2017,
    headquarters: 'Dubai, UAE',
    fees: { spotMaker: 0.0010, spotTaker: 0.0010, perpMaker: -0.0001, perpTaker: 0.0005, withdrawalBTC: 0.00002 },
    regulatoryLicenses: ['Dubai VARA', 'Bahrain CBB', 'Abu Dhabi FSRA', 'Binance.US (limited US states only)'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: 'SAFU Fund $1B+',
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: 'LIMITED',
    derivatives: ['PERPETUALS', 'OPTIONS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 400,
    riskFlags: [
      '⚠️ DOJ settlement $4.3B (November 2023) for AML violations',
      '⚠️ Founder CZ served federal sentence — completed 2024',
      '⚠️ US institutional compliance teams: require legal sign-off before onboarding',
      '⚠️ PoR uses Merkle attestation only — not Big 4 audited'
    ],
    pros: [
      '40%+ of global spot crypto volume — deepest liquidity of any exchange',
      'Lowest effective fees with BNB discount (up to 25% reduction)',
      'Most comprehensive derivatives suite globally',
      'SAFU Fund: $1B+ self-insured emergency reserve',
      'FIX API, sub-accounts, portfolio margin for institutional traders',
      '400+ spot pairs — broadest regulated exchange selection'
    ],
    cons: [
      '$4.3B DOJ settlement (2023) — material compliance risk for regulated institutions',
      'US persons must use Binance.US — reduced assets, lower liquidity',
      'Not suitable for RIAs or investment advisers with fiduciary duty without compliance clearance',
      'PoR not third-party audited to Big 4 standard'
    ],
    summary: 'The deepest liquidity pool in cryptocurrency.',
    regulatoryNote: 'Regulatory history poses compliance hurdle for US fiduciaries.',
    bestFor: 'Deepest Global Liquidity + Derivatives',
    affiliateUrl: 'https://binance.com/COINVESTOPEDIA',
    ctaLabel: 'Trade with Best Global Liquidity',
    ctaLabelSecondary: 'Get 20% Fee Discount via BNB',
    websiteUrl: 'https://binance.com',
    keyMetrics: [
      { label: 'Daily Volume', value: '$10B+' }
    ],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'LICENSED', Singapore: 'RESTRICTED', Australia: 'REGISTERED', Canada: 'RESTRICTED' }
  },
  {
    id: 'okx',
    name: 'OKX',
    clearRateScore: 82,
    grade: 'PROFESSIONAL',
    brandColor: '#000000',
    founded: 2017,
    headquarters: 'Seychelles / Dubai',
    fees: { spotMaker: 0.0008, spotTaker: 0.0010, perpMaker: -0.0001, perpTaker: 0.0005, withdrawalBTC: 0.00002 },
    regulatoryLicenses: ['Dubai VARA', 'Bahamas SCB', 'Malta MGA', 'EU MiCA application in progress'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS', 'OPTIONS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: 500000,
    assetsListed: 350,
    riskFlags: ['US persons excluded from all OKX products'],
    pros: [
      'Maker rebates at $100M+ monthly volume (exchange pays you)',
      'OKX Wallet: non-custodial Web3 integration natively linked to exchange',
      'Best cross-margin multi-asset perpetuals product after Binance',
      'DeFi aggregation routing built into exchange interface',
      'Expanding MiCA-compliant EU regulatory footprint'
    ],
    cons: [
      'Not available to US persons — zero workaround',
      'Brand trust lower than Coinbase/Kraken/Gemini for compliance-first institutions',
      'PoR: Merkle attestation only, not third-party audited to Big 4 standard',
      'OTC desk minimum ($500K) higher than competitors'
    ],
    summary: 'A fast-growing venue for offshore derivatives and maker rebates.',
    regulatoryNote: 'Geo-blocked entirely in US.',
    bestFor: 'Derivatives Professionals + Maker Rebates',
    affiliateUrl: 'https://okx.com/COINVESTOPEDIA',
    ctaLabel: 'Claim $10,000 Welcome Offer',
    ctaLabelSecondary: 'Open OKX Institutional',
    websiteUrl: 'https://okx.com',
    keyMetrics: [],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'LICENSED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED' }
  },
  {
    id: 'bybit',
    name: 'Bybit',
    clearRateScore: 79,
    grade: 'PROFESSIONAL',
    brandColor: '#F7A600',
    founded: 2018,
    headquarters: 'Dubai, UAE',
    fees: { spotMaker: 0.0010, spotTaker: 0.0010, perpMaker: -0.0001, perpTaker: 0.0006, withdrawalBTC: 0.00005 },
    regulatoryLicenses: ['Dubai VARA', 'Cyprus CySEC'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS', 'OPTIONS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 300,
    riskFlags: [
      'US persons excluded',
      'Newer regulatory track record — Dubai VARA license only since 2023'
    ],
    pros: [
      'Fastest-growing derivatives exchange — $200B+ monthly derivatives volume',
      'Competitive funding rates on perpetuals vs. Binance/OKX',
      'USDC settlement option reduces USDT counterparty exposure',
      'Institutional API: FIX protocol, sub-accounts, algorithmic order types',
      'Copy trading infrastructure for strategy replication'
    ],
    cons: [
      'Not available to US persons',
      'Regulatory track record shorter than Tier 1 exchanges',
      'Spot liquidity materially lower than Binance and OKX',
      'PoR methodology less rigorous than Kraken or Coinbase'
    ],
    summary: 'Massive perpetuals liquidity for international traders.',
    regulatoryNote: null,
    bestFor: 'Derivatives-Focused Professionals (ex-US)',
    affiliateUrl: 'https://bybit.com/COINVESTOPEDIA',
    ctaLabel: 'Get Up to $30,000 Welcome Bonus',
    ctaLabelSecondary: 'Open Institutional Account',
    websiteUrl: 'https://bybit.com',
    keyMetrics: [],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'LICENSED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED' }
  },
  {
    id: 'bitstamp',
    name: 'Bitstamp',
    clearRateScore: 83,
    grade: 'INSTITUTIONAL',
    brandColor: '#00922E',
    founded: 2011,
    headquarters: 'Luxembourg',
    fees: { spotMaker: 0.000, spotTaker: 0.0003, perpMaker: 0.000, perpTaker: 0.000, withdrawalBTC: 0.00005 },
    regulatoryLicenses: ['Luxembourg CSSF (MiCA passportable)', 'FCA (UK)', 'NYDFS BitLicense', 'FinCEN MSB', 'FINTRAC', 'AUSTRAC'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'FULL_AUDIT',
    usPersonsEligible: true,
    derivatives: ['MARGIN'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 85,
    riskFlags: ['2015 security incident ($5M lost) — recovered and remediated. Zero incidents since.'],
    pros: [
      '13+ year operational track record — longest of any ranked exchange',
      'CSSF Luxembourg license provides EU-wide MiCA-ready passportable access',
      'Acquired by Robinhood Markets (NASDAQ: HOOD) in 2024',
      'ISO 27001 certified security management system',
      'Multi-jurisdictional licensing: US, EU, UK, Canada, Australia',
      'FIX API institutional access'
    ],
    cons: [
      'Only 85 spot pairs — focused on major assets only',
      'Limited liquidity on anything outside BTC, ETH, major stablecoins',
      'Minimal derivatives offering — primarily a spot exchange',
      'UI/UX dated compared to modern institutional platforms'
    ],
    summary: 'Europe\'s oldest and most legally compliant exchange.',
    regulatoryNote: null,
    bestFor: 'European Institutional Clients + Longest Track Record',
    affiliateUrl: 'https://bitstamp.net/COINVESTOPEDIA',
    ctaLabel: "Trade on Europe's Most Regulated Exchange",
    websiteUrl: 'https://bitstamp.net',
    keyMetrics: [],
    regulatoryMap: { US: 'LICENSED', EU: 'LICENSED', UK: 'LICENSED', UAE: 'N/A', Singapore: 'N/A', Australia: 'LICENSED', Canada: 'LICENSED' }
  },
  {
    id: 'dydx',
    name: 'dYdX',
    clearRateScore: 76,
    grade: 'PROFESSIONAL',
    brandColor: '#6966FF',
    founded: 2017,
    headquarters: 'Decentralized Protocol',
    fees: { spotMaker: 0.000, spotTaker: 0.000, perpMaker: -0.0001, perpTaker: 0.0003, withdrawalBTC: 0.000 },
    regulatoryLicenses: ['Decentralized protocol', 'dYdX Foundation: Swiss non-profit'],
    custodyModel: 'SELF_CUSTODY',
    insuranceCoverage: null,
    proofOfReserves: 'FULL_AUDIT',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS'],
    fixApi: false,
    otcDeskMinimum: null,
    assetsListed: 65,
    riskFlags: [
      'Smart contract risk replaces counterparty risk',
      'US persons geofenced per dYdX protocol terms',
      'Perpetuals only — no spot market, no fiat on-ramp'
    ],
    pros: [
      'Zero exchange counterparty risk — FTX-style collapse structurally impossible',
      'Lowest perpetual fees of any major venue (0.03% taker)',
      'All positions publicly verifiable on-chain',
      'dYdX Chain: Cosmos-based sovereign order book',
      'DYDX token staking provides additional fee reduction',
      'No KYC requirement'
    ],
    cons: [
      'Perpetuals only — no spot trading, no fiat on-ramp',
      'Smart contract vulnerabilities represent the primary risk vector',
      'Lower liquidity than Binance/OKX on illiquid pairs',
      'Crypto-native onboarding required — not beginner friendly',
      'No institutional reporting or compliance tooling'
    ],
    summary: 'The bleeding edge of non-custodial persistent trading infrastructure.',
    regulatoryNote: 'US IP addresses blocked entirely.',
    bestFor: 'Non-Custodial Perpetuals + Zero Counterparty Risk',
    affiliateUrl: 'https://dydx.exchange/COINVESTOPEDIA',
    ctaLabel: 'Trade Perpetuals Without Custody Risk',
    websiteUrl: 'https://dydx.exchange',
    keyMetrics: [],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'RESTRICTED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED' }
  },
  {
    id: 'kucoin',
    name: 'KuCoin',
    clearRateScore: 67,
    grade: 'ACTIVE_TRADER',
    brandColor: '#23AF91',
    founded: 2017,
    headquarters: 'Seychelles',
    fees: { spotMaker: 0.000, spotTaker: 0.0008, perpMaker: -0.0001, perpTaker: 0.0006, withdrawalBTC: 0.00005 },
    regulatoryLicenses: ['Seychelles FSA', 'Various VASP registrations'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: null,
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: null,
    assetsListed: 700,
    riskFlags: [
      '⚠️ HIGH RISK: DOJ indictment of founders for AML violations (March 2024)',
      '⚠️ Operating under new management following founder indictment',
      '⚠️ NOT recommended for regulated institutional mandates',
      '⚠️ US persons prohibited'
    ],
    pros: [
      'Widest altcoin selection of any major exchange (700+ pairs)',
      'KuCoin Earn: flexible and fixed-term yield products',
      'Built-in trading bot infrastructure',
      'Competitive futures and margin rates',
      'Active listing of new projects'
    ],
    cons: [
      'DOJ indictment of founders (2024) — highest regulatory risk',
      'US persons prohibited',
      'Weakest regulatory standing of any exchange',
      'PoR auditor quality below institutional standard',
      'Not suitable for compliance-constrained mandates'
    ],
    summary: 'Vast altcoin selection but carries significant regulatory baggage.',
    regulatoryNote: 'Founders under US federal indictment as of 2024.',
    bestFor: 'Altcoin Access',
    affiliateUrl: 'https://kucoin.com/COINVESTOPEDIA',
    ctaLabel: 'Access 700+ Altcoin Markets',
    websiteUrl: 'https://kucoin.com',
    keyMetrics: [],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'RESTRICTED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED' }
  },
  {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    clearRateScore: 71,
    grade: 'ACTIVE_TRADER',
    brandColor: '#00FF94',
    founded: 2023,
    headquarters: 'Decentralized Protocol',
    fees: { spotMaker: 0.00010, spotTaker: 0.00025, perpMaker: -0.0001, perpTaker: 0.00025, withdrawalBTC: 0.000 },
    regulatoryLicenses: ['Decentralized protocol'],
    custodyModel: 'SELF_CUSTODY',
    insuranceCoverage: null,
    proofOfReserves: 'FULL_AUDIT',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS'],
    fixApi: false,
    otcDeskMinimum: null,
    assetsListed: 120,
    riskFlags: [
      'Operational since 2023 — limited track record',
      'Smart contract and infrastructure risk elevated vs. battle-tested protocols',
      'No fiat on-ramp — crypto-native onboarding only',
      'No institutional reporting or compliance tooling',
      'US persons geofenced'
    ],
    pros: [
      'Lowest perpetual fees of any venue globally (0.025% taker)',
      'Fully on-chain with real-time settlement',
      'Self-custody throughout trading lifecycle',
      '$100B+ monthly volume milestone crossed',
      'HYPE token provides additional fee reduction',
      'HyperBFT consensus: purpose-built for order book throughput'
    ],
    cons: [
      'Launched 2023 — limited operational track record',
      'Smart contract audit history limited relative to mature protocols',
      'Asset selection narrower than Binance/OKX',
      'No fiat on-ramp — must bring crypto from another venue',
      'No institutional compliance infrastructure'
    ],
    summary: 'The fastest growing orderbook-based perpetual DEX.',
    regulatoryNote: 'Geo-blocked in the US.',
    bestFor: 'Lowest Fees in Market',
    affiliateUrl: 'https://app.hyperliquid.xyz/COINVESTOPEDIA',
    ctaLabel: 'Trade at 0.025% — Lowest Fees in Market',
    websiteUrl: 'https://hyperliquid.xyz',
    keyMetrics: [],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'RESTRICTED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED' }
  },
  {
    id: 'ibkr',
    name: 'Interactive Brokers',
    clearRateScore: 78,
    grade: 'ACTIVE_TRADER',
    brandColor: '#D81B30',
    founded: 1978,
    headquarters: 'Greenwich, CT, USA',
    fees: { spotMaker: 0.0018, spotTaker: 0.0018, perpMaker: 0, perpTaker: 0, withdrawalBTC: 0.0000 },
    regulatoryLicenses: ['SEC / FINRA / SIPC', 'NFA ID: 0258600', 'FCA: 208159', 'CBI: C423427', 'NYSE Member'],
    custodyModel: 'THIRD_PARTY_QUALIFIED',
    insuranceCoverage: '$30M SIPC + Lloyd\'s (excludes crypto)',
    proofOfReserves: 'NONE',
    usPersonsEligible: true,
    derivatives: ['FUTURES'],
    fixApi: true,
    otcDeskMinimum: null,
    assetsListed: 50,
    riskFlags: ['Crypto outside SIPC coverage'],
    pros: [
      'SEC/FINRA/SIPC member with excess Lloyd\'s of London coverage ($30M per account, $150M aggregate) — highest traditional coverage of any entry on this list',
      'Crypto integrated directly into multi-asset portfolio alongside equities, options, and forex',
      'Eliminates hidden spreads; all-in commission model with no markup',
      'Degressive fee structure rewards volume without requiring native token holdings',
      'Access to CFTC-regulated CME Bitcoin and Ethereum futures and options on futures'
    ],
    cons: [
      'SIPC and Lloyd\'s excess policy explicitly exclude digital assets; crypto protection depends entirely on Paxos/Zero Hash',
      'No perpetual swaps, no high-leverage crypto derivatives',
      'Base 0.18% taker undercuts eToro/Swissquote retail but exceeds all native exchange VIP tiers',
      'Minimum $1.75/order penalizes small trades disproportionately'
    ],
    summary: 'Multi-asset broker offering crypto execution via Paxos Trust and Zero Hash. Digital assets are held off-balance-sheet with regulated custodians — not covered by IBKR\'s SIPC membership or Lloyd\'s excess policy.',
    regulatoryNote: 'Crypto assets not covered by SIPC or Lloyd\'s insurance.',
    bestFor: 'Traditional Broker, Crypto via Partnership',
    affiliateUrl: 'https://ibkr.com',
    ctaLabel: 'Open Multi-Asset Account',
    websiteUrl: 'https://ibkr.com',
    keyMetrics: [
      { label: 'Coverage', value: '$30M SIPC (non-crypto)' }
    ],
    regulatoryMap: { US: 'LICENSED', EU: 'LICENSED', UK: 'LICENSED', UAE: 'N/A', Singapore: 'LICENSED', Australia: 'LICENSED', Canada: 'LICENSED' }
  },
  {
    id: 'etoro',
    name: 'eToro',
    clearRateScore: 65,
    grade: 'ACTIVE_TRADER',
    brandColor: '#6CBF47',
    founded: 2007,
    headquarters: 'Tel Aviv, Israel',
    fees: { spotMaker: 0.01, spotTaker: 0.01, perpMaker: 0.01, perpTaker: 0.01, withdrawalBTC: 0.0005 },
    regulatoryLicenses: ['FCA: FRN 583263', 'CySEC: 109/10', 'FSRA ADGM (Custody/Dealing)', 'FinCEN MSB'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: '€1M Lloyd\'s (excludes crypto)',
    proofOfReserves: 'NONE',
    usPersonsEligible: 'LIMITED',
    derivatives: ['MARGIN'],
    fixApi: false,
    otcDeskMinimum: null,
    assetsListed: 80,
    riskFlags: ['Highest spread cost; crypto excluded from insurance'],
    pros: [
      'Private Lloyd\'s of London insolvency policy: up to 1M EUR/GBP/AUD per eligible claimant (UK, EU, Australia)',
      'Regulated across four jurisdictions simultaneously — FCA, CySEC, FSRA (ADGM), FinCEN',
      'Copy-trading and Smart Portfolios provide diversified crypto exposure without active management',
      'Transparent all-in spread model — no hidden custody or withdrawal fees embedded in price'
    ],
    cons: [
      '1% spread applied at open and close — effective round-trip cost 2%; among the highest on this list',
      'Lloyd\'s policy explicitly excludes real cryptocurrency losses; covers only cash, securities, and CFD positions',
      'Club discounts require substantial equity thresholds; most retail users pay full 1%',
      'Derivatives (CFDs) restricted by jurisdiction; leverage access varies by regulatory regime',
      'No Proof of Reserves; solvency transparency depends on regulated audit only'
    ],
    summary: 'Copy-trading platform with standardized 1% spread on all crypto assets. Club tier discounts reduce effective cost to 0.6% at Diamond level. Lloyd\'s insurance covers insolvency losses but explicitly excludes real cryptocurrency positions.',
    regulatoryNote: 'US users trade real crypto; EU/UK users may access CFDs.',
    bestFor: 'Social Trading Platform, Retail-First',
    affiliateUrl: 'https://etoro.com',
    ctaLabel: 'Start Copy Trading',
    websiteUrl: 'https://etoro.com',
    keyMetrics: [
      { label: 'Insurance', value: '€1M Lloyd\'s (non-crypto)' }
    ],
    regulatoryMap: { US: 'LICENSED', EU: 'LICENSED', UK: 'LICENSED', UAE: 'LICENSED', Singapore: 'N/A', Australia: 'LICENSED', Canada: 'N/A' }
  },
  {
    id: 'swissquote',
    name: 'Swissquote',
    clearRateScore: 82,
    grade: 'PROFESSIONAL',
    brandColor: '#00A1DE',
    founded: 1996,
    headquarters: 'Gland, Switzerland',
    fees: { spotMaker: 0.0008, spotTaker: 0.0018, perpMaker: 0, perpTaker: 0, withdrawalBTC: 0.0001 },
    regulatoryLicenses: ['FINMA (Licensed Swiss Bank)', 'DFSA: F001438 (Category 3A)', 'Central Bank UAE (Rep. Office)'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: 'CHF 100K esisuisse (cash only)',
    proofOfReserves: 'NONE',
    usPersonsEligible: false,
    derivatives: ['FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: null,
    assetsListed: 56,
    riskFlags: ['Standard tier costs exceed most native exchanges'],
    pros: [
      'Only licensed commercial bank on this list — balance-sheet security backed by FINMA supervision and Basel III capital requirements',
      'esisuisse deposit protection: CHF 100,000 on cash balances (banking scheme, not crypto-specific)',
      'Broadest regulated product range: spot, CFDs on 56 crypto assets, CME Standard and Micro futures, ETPs',
      'Automatic tier recalculation — no manual application for volume discounts',
      'DFSA-regulated Dubai presence (Category 3A, F001438) for institutional MENA clients'
    ],
    cons: [
      'Standard I entry fee (1.00%) is among the highest base rates on this list',
      'Quarterly custody fees add total cost of ownership beyond execution commissions',
      'No US access',
      'PRO II 0.08% maker, while competitive for a bank, still exceeds Bitget VIP7 (0.00%) and HTX Prime 11 (0.013%)',
      'esisuisse covers cash only — crypto assets not protected under banking deposit guarantee'
    ],
    summary: 'Fully licensed Swiss bank operating a 10-tier dynamic maker-taker fee system based on 30-day trailing volume. Offers the broadest regulated product suite: spot, CFDs, CME futures, tracker certificates, and thematic ETPs — all under FINMA oversight and Basel III reserve requirements.',
    regulatoryNote: 'Standard I entry tier: 1.00% maker / 1.00% taker. PRO II ($60M+/month): 0.08% / 0.18%.',
    bestFor: 'Licensed Swiss Bank, Dynamic Maker-Taker',
    affiliateUrl: 'https://swissquote.com',
    ctaLabel: 'Trade via Swiss Bank',
    websiteUrl: 'https://swissquote.com',
    keyMetrics: [
      { label: 'Deposit Protection', value: 'CHF 100K esisuisse' }
    ],
    regulatoryMap: { US: 'RESTRICTED', EU: 'LICENSED', UK: 'REGISTERED', UAE: 'LICENSED', Singapore: 'N/A', Australia: 'N/A', Canada: 'N/A' }
  },
  {
    id: 'fidelity',
    name: 'Fidelity Digital Assets',
    clearRateScore: 85,
    grade: 'INSTITUTIONAL',
    brandColor: '#4B8B3B',
    founded: 2018,
    headquarters: 'Boston, USA',
    fees: { spotMaker: 0.01, spotTaker: 0.01, perpMaker: 0, perpTaker: 0, withdrawalBTC: 0.0000 },
    regulatoryLicenses: ['OCC National Trust Bank Charter (2025)', 'FCA: 928554', 'SEC Registered Investment Adviser'],
    custodyModel: 'THIRD_PARTY_QUALIFIED',
    insuranceCoverage: null,
    proofOfReserves: 'NONE',
    usPersonsEligible: true,
    derivatives: [],
    fixApi: true,
    otcDeskMinimum: 1000000,
    assetsListed: 30,
    riskFlags: ['Retail fee uncompetitive; institutional pricing opaque'],
    pros: [
      'OCC National Trust Bank charter (2025) — highest US regulatory standing of any crypto custodian on this list',
      'Trade directly from cold storage — eliminates the 2% pre-movement fees charged by competing institutional custodians',
      'SEC-regulated investment funds: FBTC (Bitcoin), FETH (Ethereum), FSOL (Solana) — accessible via standard brokerage accounts',
      'Smart order routing across multiple liquidity venues for institutional execution',
      'Fidelity Digital Dollar (FIDD) stablecoin purchases/redemptions currently fee-free at $1.00/unit'
    ],
    cons: [
      'Retail flat fee of 1.00% is among the highest execution costs on this list',
      'Institutional fee schedule entirely opaque; no public basis for comparison',
      'FCA registration (928554) does not carry FSCS protection for crypto activities',
      'No derivatives offering — perpetual swaps, options, or leveraged products absent',
      'Asset selection narrower than native exchanges'
    ],
    summary: 'OCC-chartered national trust bank (2025) offering institutional custody and smart order routing. Trade-from-cold-storage architecture eliminates pre-funding and movement risk. Retail access via Fidelity Crypto at flat 1%; institutional fees negotiated based on AUC and strategy complexity.',
    regulatoryNote: 'Institutional pricing bespoke. No public maker-taker schedule.',
    bestFor: 'Institutional Custodian, National Trust Bank',
    affiliateUrl: 'https://fidelitydigitalassets.com',
    ctaLabel: 'Explore Fidelity Custody',
    websiteUrl: 'https://fidelitydigitalassets.com',
    keyMetrics: [
      { label: 'Charter', value: 'OCC National Trust Bank' }
    ],
    regulatoryMap: { US: 'LICENSED', EU: 'N/A', UK: 'REGISTERED', UAE: 'N/A', Singapore: 'N/A', Australia: 'N/A', Canada: 'N/A' }
  },
  {
    id: 'htx',
    name: 'HTX',
    clearRateScore: 70,
    grade: 'ACTIVE_TRADER',
    brandColor: '#2B6DEF',
    founded: 2013,
    headquarters: 'Seychelles / Singapore',
    fees: { spotMaker: 0.0016, spotTaker: 0.0017, perpMaker: 0.0002, perpTaker: 0.00055, withdrawalBTC: 0.00002 },
    regulatoryLicenses: ['VARA: VL/23/08/003 (Broker-Dealer/Management)'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: '20,000 BTC Protection Fund',
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS', 'OPTIONS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 600,
    riskFlags: ['Prime 11 volume hurdle ($1.8B/month) unreachable for most; offshore primary jurisdiction'],
    pros: [
      '38 consecutive months of Merkle Tree Proof of Reserves — longest verifiable PoR streak on this list',
      '20,000 BTC user protection fund (self-funded, on-chain verifiable)',
      '153 perpetual contracts + 29 delivery futures; up to 200x leverage on select pairs',
      'USDT-margined, coin-margined swaps, and European/American-style options in one venue',
      'Fireblocks technology + multi-signature cold wallets for reserve custody',
      'USDT user deposits grew 150%+ in 2025 — strong liquidity depth signal'
    ],
    cons: [
      'Prime 11 requires $1.8B monthly spot volume — accessible only to the largest market-making firms',
      'Base Prime 1 fees (0.16%/0.17%) are higher than Bitget\'s standard 0.01% flat rate',
      'VARA license covers Dubai mainland only — limited geographic regulatory footprint vs. multi-jurisdiction peers',
      'No US access; restricted in several major Western markets',
      'Protection fund denominated in BTC — valuation volatile'
    ],
    summary: 'High-throughput Asian exchange with the most granular VIP structure on this list — 11 Prime tiers spanning base (0.17%) to near-zero (0.022%) taker fees. Maintains a 38-month consecutive Proof of Reserves streak. Dominates Asian spot and derivatives liquidity with a 20,000 BTC user protection fund.',
    regulatoryNote: 'Prime 4 ($3M spot/$20M futures monthly): 0.08% maker / 0.10% taker.',
    bestFor: 'Asian Liquidity Hub, 11-Tier Prime VIP',
    affiliateUrl: 'https://htx.com',
    ctaLabel: 'Access Asian Liquidity',
    websiteUrl: 'https://htx.com',
    keyMetrics: [
      { label: 'PoR Streak', value: '38 months' },
      { label: 'Protection Fund', value: '20,000 BTC' }
    ],
    regulatoryMap: { US: 'RESTRICTED', EU: 'RESTRICTED', UK: 'RESTRICTED', UAE: 'LICENSED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED' }
  },
  {
    id: 'bitget',
    name: 'Bitget',
    clearRateScore: 72,
    grade: 'ACTIVE_TRADER',
    brandColor: '#00C8B5',
    founded: 2018,
    headquarters: 'Seychelles / Singapore',
    fees: { spotMaker: 0.0001, spotTaker: 0.0001, perpMaker: 0.0002, perpTaker: 0.0006, withdrawalBTC: 0.00002 },
    regulatoryLicenses: ['AUSTRAC (Digital Currency Exchange)', 'MoF Poland (VASP)', 'OAM Italy (VASP)', 'NRA Bulgaria (VASP)', 'CoR Lithuania (Virtual Currency Provider)'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: '$451M Protection Fund',
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 800,
    riskFlags: ['Offshore primary jurisdiction; EU licenses are VASP registrations, not full authorizations'],
    pros: [
      'Lowest base fee structure on this list — 0.01% flat, with BGB discount path to VIP tiers',
      '$451M Protection Fund (March 2026), fully self-funded in BTC and USDT — largest dedicated reserve of any native exchange here',
      'BTC reserve ratio 307%–365% — highest verified reserve ratio on this list',
      'Broadest derivatives universe: 1,300+ perpetual tokens + stock perpetual futures (NVDA, TSLA, GOOGL, 24/7) at up to 100x leverage',
      'Four active EU VASP registrations (Poland, Italy, Bulgaria, Lithuania) — most comprehensive European compliance footprint of any offshore exchange',
      'Monthly Merkle Tree PoR with full public verification'
    ],
    cons: [
      'No US access; restricted in additional major markets',
      'Primary domicile offshore — EU VASP registrations provide compliance standing but not full banking-grade authorization',
      'Protection Fund BTC holdings create circular risk — fund value declines in same market conditions that may trigger payouts',
      'VIP 7 requires $10M balance or $100M monthly volume — institutional tier inaccessible to most traders',
      'Stock perpetual futures carry counterparty risk absent in regulated CME equivalents'
    ],
    summary: 'Lowest base spot fee (0.01%) of any major exchange on this list. "Universal Exchange" model covers 1,300+ perpetual futures tokens and stock perps (NVDA, TSLA, GOOGL) with up to 100x leverage. BTC reserve ratio sustained at 307%–365%; Protection Fund peaked at $725M (Bitcoin >$110K). Fastest-expanding European VASP footprint of any offshore exchange.',
    regulatoryNote: 'VIP 1 ($30K balance / $500K volume): 0.08% maker / 0.08% taker spot. VIP 7 ($10M balance / $100M volume): 0.00% maker.',
    bestFor: 'Universal Exchange, Lowest Base Fee',
    affiliateUrl: 'https://bitget.com',
    ctaLabel: 'Trade at 0.01% — Lowest Spot Fee',
    websiteUrl: 'https://bitget.com',
    keyMetrics: [
      { label: 'Protection Fund', value: '$451M' },
      { label: 'Reserve Ratio', value: '307%–365% BTC' }
    ],
    regulatoryMap: { US: 'RESTRICTED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'RESTRICTED', Singapore: 'RESTRICTED', Australia: 'LICENSED', Canada: 'RESTRICTED' }
  },
  {
    id: 'cryptocom',
    name: 'Crypto.com',
    clearRateScore: 88,
    grade: 'INSTITUTIONAL',
    brandColor: '#103F68',
    founded: 2016,
    headquarters: 'Singapore',
    fees: { spotMaker: 0.00075, spotTaker: 0.00075, perpMaker: 0, perpTaker: 0.00015, withdrawalBTC: 0.0002 },
    regulatoryLicenses: ['Singapore MAS (MPI)', 'UK FCA (EMI)', 'Dubai VARA (VASP)', 'EU Malta MFSA'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: '$870M',
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: true,
    derivatives: ['PERPETUALS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: 100000,
    assetsListed: 350,
    riskFlags: [],
    pros: [
      'Comprehensively regulated across tier-1 jurisdictions (MAS, FCA, VARA, MFSA)',
      '$870M total insurance coverage for cold-storage assets and crime/theft',
      'Monthly Merkle Tree PoR audited by Mazars Group with 1:1 reserves'
    ],
    cons: [
      'Optimal fee rates require high spot volume ($1M+) or heavy native token (CRO) utility',
      'Complex VIP structure (Tiers 1\u20137) compared to flat-fee competitors'
    ],
    summary: 'A comprehensively regulated entity utilizing a tiered VIP structure that rewards both volume and native token utility.',
    regulatoryNote: null,
    bestFor: 'Regulated VIP Structure + CRO Utility',
    affiliateUrl: 'https://crypto.com',
    ctaLabel: 'Open Crypto.com Account',
    websiteUrl: 'https://crypto.com',
    keyMetrics: [
      { label: 'Insurance', value: '$870M coverage' },
      { label: 'PoR', value: 'Mazars audited' }
    ],
    regulatoryMap: { US: 'LICENSED', EU: 'LICENSED', UK: 'LICENSED', UAE: 'LICENSED', Singapore: 'LICENSED', Australia: 'REGISTERED', Canada: 'REGISTERED' }
  },
  {
    id: 'bingx',
    name: 'BingX',
    clearRateScore: 72,
    grade: 'ACTIVE_TRADER',
    brandColor: '#2354E6',
    founded: 2018,
    headquarters: 'Singapore',
    fees: { spotMaker: 0.001, spotTaker: 0.001, perpMaker: 0.0002, perpTaker: 0.0005, withdrawalBTC: 0.0002 },
    regulatoryLicenses: ['Australia AUSTRAC', 'Lithuania FCIS', 'USA FinCEN (MSB)'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: '$150M Shield Fund',
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: 'LIMITED',
    derivatives: ['PERPETUALS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: null,
    assetsListed: 900,
    riskFlags: ['Claims US FinCEN MSB registration but is not licensed for retail securities trading'],
    pros: [
      'Strong focus on social and copy trading features',
      '$150M "Shield Fund" and monthly Merkle Tree PoR snapshots (120%+ ratios)',
      'Offers tokenized traditional assets (stocks, gold, oil) alongside 900+ crypto derivatives'
    ],
    cons: [
      'Lower regulatory density compared to traditional brokers',
      'Not licensed for US retail securities trading despite MSB claims'
    ],
    summary: 'A universal exchange focusing on social and copy trading, offering tokenized traditional assets with lower regulatory density.',
    regulatoryNote: 'FinCEN MSB registration does not constitute securities licensing.',
    bestFor: 'Social & Copy Trading + Universal Exchange',
    affiliateUrl: 'https://bingx.com',
    ctaLabel: 'Start Copy Trading on BingX',
    websiteUrl: 'https://bingx.com',
    keyMetrics: [
      { label: 'Shield Fund', value: '$150M' }
    ],
    regulatoryMap: { US: 'REGISTERED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'RESTRICTED', Singapore: 'REGISTERED', Australia: 'LICENSED', Canada: 'RESTRICTED' }
  },
  {
    id: 'mexc',
    name: 'MEXC',
    clearRateScore: 55,
    grade: 'ACTIVE_TRADER',
    brandColor: '#00B897',
    founded: 2018,
    headquarters: 'Seychelles',
    fees: { spotMaker: 0, spotTaker: 0, perpMaker: 0, perpTaker: 0.0002, withdrawalBTC: 0.0002 },
    regulatoryLicenses: ['Seychelles (Registered Entity)'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: '$100M Guardian Fund',
    proofOfReserves: 'MERKLE_ATTESTATION',
    usPersonsEligible: false,
    derivatives: ['PERPETUALS', 'FUTURES', 'MARGIN'],
    fixApi: true,
    otcDeskMinimum: null,
    assetsListed: 2000,
    riskFlags: [
      '\u26A0\uFE0F Dubai VARA alert for operating without a license',
      '\u26A0\uFE0F UK FCA warning for operating without authorization'
    ],
    pros: [
      'Zero-fee model on all spot trades (both maker and taker)',
      'Extensive asset support with over 2,000 trading pairs and up to 200x leverage',
      '$100M "Guardian Fund" and bimonthly Merkle Tree PoR (BTC reserve at 266%)'
    ],
    cons: [
      'Significant regulatory headwinds and formal warnings in major jurisdictions (UK, Dubai)',
      'Operates primarily as a Seychelles-registered entity lacking tier-1 licenses'
    ],
    summary: 'An offshore exchange known for its aggressive altcoin listing strategy and ultra-low fees, facing significant regulatory headwinds.',
    regulatoryNote: 'Active warnings from VARA (Dubai) and FCA (UK).',
    bestFor: 'Aggressive Altcoins + Zero-Fee Model',
    affiliateUrl: 'https://mexc.com',
    ctaLabel: 'Trade Zero-Fee on MEXC',
    websiteUrl: 'https://mexc.com',
    keyMetrics: [
      { label: 'Spot Fee', value: '0% (zero)' },
      { label: 'Trading Pairs', value: '2,000+' }
    ],
    regulatoryMap: { US: 'RESTRICTED', EU: 'RESTRICTED', UK: 'RESTRICTED', UAE: 'RESTRICTED', Singapore: 'RESTRICTED', Australia: 'RESTRICTED', Canada: 'RESTRICTED' }
  },
  {
    id: 'robinhood',
    name: 'Robinhood Crypto',
    clearRateScore: 85,
    grade: 'INSTITUTIONAL',
    brandColor: '#00C805',
    founded: 2013,
    headquarters: 'Menlo Park, CA, USA',
    fees: { spotMaker: 0.001, spotTaker: 0.001, perpMaker: 0, perpTaker: 0.001, withdrawalBTC: 0.0000 },
    regulatoryLicenses: ['USA FinCEN (MSB)', 'USA NYDFS (BitLicense)', 'USA State Money Transmitter Licenses (50 States)'],
    custodyModel: 'EXCHANGE',
    insuranceCoverage: "Lloyd's syndicates (crime)",
    proofOfReserves: 'NONE',
    usPersonsEligible: true,
    derivatives: ['PERPETUALS'],
    fixApi: false,
    otcDeskMinimum: null,
    assetsListed: 40,
    riskFlags: ['Does not provide Merkle Tree Proof of Reserves (relies on standard corporate audits)'],
    pros: [
      'High regulatory density with FinCEN, NYDFS BitLicense, and 50 state licenses',
      "Crime insurance underwritten by Lloyd's syndicates",
      'Seamless integration with traditional equity trading and $51B in assets under custody'
    ],
    cons: [
      'Implicit spread costs (0.1% - 1.0%) can be more opaque than explicit commission structures',
      'SIPC protection covers only securities and cash, explicitly excluding digital assets',
      'Limited leverage (7x) and perpetual futures restricted primarily to EU users'
    ],
    summary: 'Integrates digital assets into a broader brokerage ecosystem, targeting retail users with a spread-based cost model and strict US oversight.',
    regulatoryNote: 'Spread-based cost model. No public maker-taker schedule.',
    bestFor: 'Retail Brokerage Integration + Spread Cost Model',
    affiliateUrl: 'https://robinhood.com/crypto',
    ctaLabel: 'Trade Crypto on Robinhood',
    websiteUrl: 'https://robinhood.com/crypto',
    keyMetrics: [
      { label: 'AUC', value: '$51B' },
      { label: 'State Licenses', value: '50 states' }
    ],
    regulatoryMap: { US: 'LICENSED', EU: 'REGISTERED', UK: 'RESTRICTED', UAE: 'N/A', Singapore: 'N/A', Australia: 'N/A', Canada: 'N/A' }
  }
];

export const BEST_FOR_CARDS = [
  { label: 'Best Overall', iconName: 'Trophy', exchangeId: 'coinbase', cta: 'Open Account' },
  { label: 'Best Regulated (US)', iconName: 'Building', exchangeId: 'gemini', cta: 'Open Institutional Account' },
  { label: 'Deepest Liquidity', iconName: 'Droplets', exchangeId: 'binance', cta: 'Trade with Best Execution' },
  { label: 'Lowest Perp Fees', iconName: 'TrendingDown', exchangeId: 'hyperliquid', cta: 'Access 0.025% Taker Rate' },
  { label: 'Best Security Record', iconName: 'Shield', exchangeId: 'kraken', cta: 'Open Kraken Pro' },
  { label: 'Best for Europeans', iconName: 'Globe', exchangeId: 'bitstamp', cta: 'Open EU Regulated Account' },
  { label: 'Best Derivatives', iconName: 'Repeat', exchangeId: 'okx', cta: 'Trade Perpetuals' },
  { label: 'Best Self-Custody', iconName: 'Lock', exchangeId: 'dydx', cta: 'Trade Without Counterparty Risk' },
  { label: 'Most Altcoins', iconName: 'Coins', exchangeId: 'kucoin', cta: 'Access 700+ Markets' },
  { label: 'Best TradFi Bridge', iconName: 'Briefcase', exchangeId: 'ibkr', cta: 'Open Multi-Asset Account' },
  { label: 'Best Social Trading', iconName: 'Users', exchangeId: 'etoro', cta: 'Start Copy Trading' },
  { label: 'Best Swiss Regulated', iconName: 'Landmark', exchangeId: 'swissquote', cta: 'Trade via Swiss Bank' },
  { label: 'Best Institutional Custody', iconName: 'Wallet', exchangeId: 'fidelity', cta: 'Explore Fidelity Custody' },
  { label: 'Best Asian Liquidity', iconName: 'Zap', exchangeId: 'htx', cta: 'Access Asian Markets' },
  { label: 'Lowest Spot Fee', iconName: 'Percent', exchangeId: 'bitget', cta: 'Trade at 0.01%' },
  { label: 'Best CRO Utility', iconName: 'CircleDollarSign', exchangeId: 'cryptocom', cta: 'Open Crypto.com Account' },
  { label: 'Best Copy Trading Alt', iconName: 'Copy', exchangeId: 'bingx', cta: 'Start Copy Trading' },
  { label: 'Most Trading Pairs', iconName: 'Layers', exchangeId: 'mexc', cta: 'Access 2,000+ Pairs' },
  { label: 'Best US Retail', iconName: 'Smartphone', exchangeId: 'robinhood', cta: 'Trade on Robinhood' },
  { label: 'Best for Futures', iconName: 'Activity', exchangeId: 'bybit', cta: 'Access 100x Leverage' },
];

export const FAQ_DATA = [
  {
    q: 'What is the most regulated crypto exchange in the US?',
    a: 'Coinbase Advanced, Gemini, and Fidelity Digital Assets are the most heavily regulated US exchanges. Coinbase holds a NYDFS BitLicense, is SEC-registered, and is the only major exchange with publicly audited financials as a NASDAQ-listed company (COIN). Gemini holds a NYDFS Trust Company Charter and is SOC 2 Type 2 certified. Fidelity Digital Assets received an OCC National Trust Bank charter in 2025 — the highest US regulatory standing of any crypto custodian. Kraken holds a Wyoming SPDI bank charter. Interactive Brokers (SEC/FINRA/SIPC) also offers crypto via Paxos Trust, though crypto assets are excluded from SIPC coverage.',
  },
  {
    q: 'Which crypto exchanges accept institutional investors?',
    a: 'Coinbase (via Coinbase Prime), Gemini (via Gemini Custody), Fidelity Digital Assets (OCC National Trust Bank), Kraken (via Kraken OTC), Binance, OKX, Bitstamp, Bybit, Interactive Brokers, and Swissquote all offer institutional account tiers with features including FIX API access, sub-accounts, OTC desk services, and dedicated account management. Fidelity offers trade-from-cold-storage architecture that eliminates pre-funding risk.',
  },
  {
    q: 'How are crypto exchange fees calculated at institutional volume?',
    a: 'Most exchanges use a tiered maker/taker fee model where rates decrease as 30-day trading volume increases. At institutional volumes ($1M+/month), maker fees can drop to 0% or even negative (maker rebates). MEXC offers 0% base spot fees for all users, while Bitget offers 0.01% flat. Taker fees at institutional tiers range from 0.022% (HTX Prime 11) to 0.10% (Kraken). HTX and Crypto.com operate VIP tier structures; Swissquote uses a 10-tier dynamic model. Native tokens (BNB, BGB, DYDX, HYPE, CRO) provide additional fee reductions.',
  },
  {
    q: 'What is Proof of Reserves and which exchanges publish it?',
    a: 'Proof of Reserves (PoR) is a cryptographic verification method that allows exchanges to prove they hold customer assets 1:1. Coinbase publishes quarterly via SEC filings. Kraken uses Armanino-audited quarterly attestations. Gemini publishes monthly via BPM LLP. HTX maintains a 38-month consecutive Merkle Tree PoR streak — the longest on this list. Crypto.com, Bitget, BingX, MEXC, and OKX also publish monthly/bimonthly Merkle Tree PoR. Binance publishes PoR but its methodology has been questioned. Swissquote, Fidelity, and Robinhood operate under banking/trust/brokerage supervision instead of PoR.',
  },
  {
    q: 'Can US persons trade on Binance?',
    a: 'US residents cannot use the global Binance platform. They must use Binance.US, which offers significantly reduced asset selection, lower liquidity, and limited features compared to the global platform. Following the 2023 DOJ settlement, US regulatory scrutiny of Binance-related entities remains elevated.',
  },
  {
    q: 'What happened to FTX and how do I avoid exchange counterparty risk?',
    a: 'FTX collapsed in November 2022 after it was revealed that customer deposits were used to fund Alameda Research, resulting in approximately $8B in customer losses. To mitigate exchange counterparty risk: (1) use exchanges with published PoR, (2) consider non-custodial platforms like dYdX or Hyperliquid, (3) limit exchange balances to active trading capital only, (4) use hardware wallets for long-term storage, (5) prefer publicly audited exchanges like Coinbase.',
  },
  {
    q: 'What is a NYDFS BitLicense and why does it matter?',
    a: 'The New York Department of Financial Services (NYDFS) BitLicense is the most stringent state-level crypto license in the US. It requires comprehensive capital reserves, cybersecurity standards, AML/KYC compliance, and regular audits. Only a handful of exchanges hold it, including Coinbase, Gemini, Bitstamp, Robinhood Crypto, and Kraken (via its banking charter). It is a strong signal of regulatory seriousness.',
  },
  {
    q: 'Which crypto exchange has the deepest order book for large orders?',
    a: 'Binance has the deepest global order book with approximately 40%+ of total crypto spot volume and the deepest perpetual futures liquidity. For US-only execution, Coinbase Advanced offers the deepest domestic order book. For institutional block trades, Kraken OTC and Coinbase Prime provide agency-style execution to minimize market impact.',
  },
  {
    q: 'What is the difference between a custodial and non-custodial exchange?',
    a: 'A custodial exchange (Coinbase, Binance, Kraken, etc.) holds your assets on your behalf — you trust the exchange to safeguard them. A non-custodial exchange (dYdX, Hyperliquid) allows you to trade directly from your own wallet — assets remain in your self-custody throughout the trading lifecycle. Non-custodial exchanges eliminate counterparty risk but introduce smart contract risk.',
  },
  {
    q: 'How do perpetual futures differ from traditional futures?',
    a: 'Traditional futures have an expiration date and settle at a fixed price. Perpetual futures (perps) have no expiration — they trade continuously with a funding rate mechanism that keeps the perpetual price anchored to the spot price. Positive funding means longs pay shorts; negative funding means shorts pay longs. Perpetuals are the dominant derivative instrument in crypto, with daily volume exceeding spot markets.',
  },
  {
    q: 'What does ClearRate™ score mean and how is it calculated?',
    a: 'ClearRate™ is Coinvestopedia\'s proprietary 100-point institutional exchange scoring model. It evaluates exchanges across 7 weighted dimensions: Regulatory Compliance (25%), Liquidity Depth (20%), Fee Structure (20%), Custody & Security (15%), Asset Coverage (10%), Institutional Infrastructure (5%), and Operational Track Record (5%). Scores of 90+ indicate institutional grade; 80-89 professional grade; 70-79 active trader grade; below 70 indicates elevated risk.',
  },
  {
    q: 'Which crypto exchange is best for a family office or RIA?',
    a: 'For US family offices and RIAs with fiduciary obligations, Fidelity Digital Assets (OCC National Trust Bank charter), Coinbase Prime, and Gemini Custody are the top recommended platforms. Fidelity offers the highest US regulatory standing with trade-from-cold-storage capability. Coinbase is the only option with publicly audited financials. Gemini offers SOC 2 Type 2 certification. Kraken\'s Wyoming bank charter and Interactive Brokers\' SEC/FINRA/SIPC membership also provide strong institutional credibility, though IBKR\'s SIPC coverage excludes crypto assets. Swissquote offers FINMA-supervised Swiss bank custody for European mandates.',
  },
];

export const AFFILIATE_BANNERS = [
  {
    id: 'compliance',
    title: 'Trading crypto under a fiduciary mandate?',
    body: 'Coinbase Prime offers institutional custody, agency execution, and the only audited financials in crypto.',
    cta: 'Schedule a Coinbase Prime Demo →',
    ctaUrl: 'https://prime.coinbase.com/COINVESTOPEDIA',
    placement: 'after-profile-3',
  },
  {
    id: 'fee-optimization',
    title: 'Most institutional traders overpay by $40K–$200K annually on exchange fees.',
    body: 'The ClearRate™ Fee Calculator shows exactly where the savings are.',
    cta: 'Run Your Fee Analysis →',
    ctaUrl: '#fee-calculator',
    placement: 'after-calculator',
  },
  {
    id: 'self-custody',
    title: 'FTX lost $8B in customer assets.',
    body: 'dYdX and Hyperliquid make that structurally impossible. Non-custodial perpetuals — same execution, zero counterparty risk.',
    cta: 'Trade Without Custody Risk →',
    ctaUrl: 'https://dydx.exchange/COINVESTOPEDIA',
    placement: 'after-profile-8',
  },
];

export const REGIONS = ['US', 'EU', 'UK', 'UAE', 'Singapore', 'Australia', 'Canada'];
