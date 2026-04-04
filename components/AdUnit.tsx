import React, { useMemo } from 'react';
import { ArrowUpRight, Zap, Gift, BarChart2, Shield, Bot, Globe, Target, LineChart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AdPartner, AdContext, getContextualAd } from '../services/adService';

interface AdUnitProps {
  size: 'medium' | 'large' | 'billboard' | 'skyscraper' | 'leaderboard' | 'mobile-sticky' | 'native';
  className?: string;
  label?: string;
  partner?: AdPartner;
  context?: AdContext;
}

const PARTNERS: Record<AdPartner, {
  name: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  offer: string;
  subOffer: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
  url: string;
}> = {
  kucoin: {
    name: 'KuCoin',
    bgGradient: 'from-[#051813] to-[#24AE8F]',
    textColor: 'text-white',
    accentColor: 'bg-[#24AE8F] text-white hover:bg-[#1C967A]',
    offer: '700 USDT',
    subOffer: 'Welcome Gift',
    description: 'Find the next crypto gem on the people\'s exchange.',
    cta: 'Claim Bonus',
    url: 'https://www.kucoin.com/r/af/COINVEST',
    icon: <Zap size={20} className="text-[#24AE8F]" />
  },
  trezor: {
    name: 'Trezor',
    bgGradient: 'from-[#121212] to-[#0f3a2a]',
    textColor: 'text-white',
    accentColor: 'bg-[#00854D] text-white hover:bg-[#006e40]',
    offer: 'Model T',
    subOffer: 'Total Security',
    description: 'Protect your crypto assets with the original hardware wallet.',
    cta: 'Get Safe',
    url: 'https://trezor.io/?offer=coinvest',
    icon: <Shield size={20} className="text-[#00854D]" />
  },
  '3commas': {
    name: '3Commas',
    bgGradient: 'from-[#0D1117] to-[#1A1F2C]',
    textColor: 'text-white',
    accentColor: 'bg-[#00D09C] text-black hover:bg-[#00B084]',
    offer: 'Smart Bots',
    subOffer: 'Automate 24/7',
    description: 'The world\'s best crypto trading bots and terminal.',
    cta: 'Try For Free',
    url: 'https://3commas.io/?c=tc-coinvest',
    icon: <Bot size={20} className="text-[#00D09C]" />
  },
  binance: {
    name: 'Binance',
    bgGradient: 'from-[#0B0E11] to-[#F3BA2F]',
    textColor: 'text-white',
    accentColor: 'bg-[#F3BA2F] text-black hover:bg-[#D9A52A]',
    offer: '100 USDT',
    subOffer: 'Trading Rebate',
    description: 'Trade crypto on the world\'s largest exchange.',
    cta: 'Register Now',
    url: 'https://www.binance.com/en/register?ref=COINVEST',
    icon: <Zap size={20} className="text-[#F3BA2F]" />
  },
  bybit: {
    name: 'Bybit',
    bgGradient: 'from-[#17181E] to-[#FBAB24]',
    textColor: 'text-white',
    accentColor: 'bg-[#FBAB24] text-black hover:bg-[#E0981F]',
    offer: '30,000 USDT',
    subOffer: 'Deposit Bonus',
    description: 'Next level trading with professional tools.',
    cta: 'Claim Now',
    url: 'https://www.bybit.com/register?affiliate_id=COINVEST',
    icon: <BarChart2 size={20} className="text-[#FBAB24]" />
  },
  okx: {
    name: 'OKX',
    bgGradient: 'from-[#000000] to-[#FFFFFF]',
    textColor: 'text-white',
    accentColor: 'bg-white text-black hover:bg-gray-200',
    offer: 'Mystery Box',
    subOffer: 'Up to $10,000',
    description: 'One app for everything crypto.',
    cta: 'Get App',
    url: 'https://www.okx.com/join/COINVEST',
    icon: <Gift size={20} className="text-black" />
  },
  ledger: {
    name: 'Ledger',
    bgGradient: 'from-[#1A1A1A] to-[#6E3BB6]',
    textColor: 'text-white',
    accentColor: 'bg-[#6E3BB6] text-white hover:bg-[#5A3095]',
    offer: 'Nano X',
    subOffer: 'Self-Custody',
    description: 'Your crypto, your keys. Secure your future.',
    cta: 'Shop Now',
    url: 'https://shop.ledger.com/?offer=coinvest',
    icon: <Shield size={20} className="text-[#6E3BB6]" />
  },
  coinledger: {
    name: 'CoinLedger',
    bgGradient: 'from-[#141E30] to-[#243B55]',
    textColor: 'text-white',
    accentColor: 'bg-primary text-white hover:bg-primary-dark',
    offer: 'Free Tax Report',
    subOffer: 'Crypto Taxes',
    description: 'Simplify your crypto taxes in minutes.',
    cta: 'Start Free',
    url: 'https://coinledger.io/?utm_source=coinvestopedia&utm_medium=banner',
    icon: <BarChart2 size={20} className="text-primary" />
  },
  htx: {
    name: 'HTX',
    bgGradient: 'from-[#000000] to-[#122A4F]',
    textColor: 'text-white',
    accentColor: 'bg-[#2152D9] text-white hover:bg-[#183EA3]',
    offer: '5,672 USDT',
    subOffer: 'Welcome Bonus',
    description: 'Global crypto exchange and Web3 ecosystem.',
    cta: 'Register',
    url: 'https://www.htx.com/invite?utm_source=coinvestopedia&utm_medium=banner',
    icon: <Globe size={20} className="text-[#2152D9]" />
  },
  bitget: {
    name: 'Bitget',
    bgGradient: 'from-[#111] to-[#0A8787]',
    textColor: 'text-white',
    accentColor: 'bg-[#00E5C9] text-black hover:bg-[#00BFA8]',
    offer: 'Copy Trading',
    subOffer: 'Follow the Pros',
    description: 'World\'s leading crypto copy trading platform.',
    cta: 'Copy Trade',
    url: 'https://www.bitget.com/expressly?utm_source=coinvestopedia&utm_medium=banner',
    icon: <Target size={20} className="text-[#00E5C9]" />
  },
  glassnode: {
    name: 'Glassnode',
    bgGradient: 'from-[#111111] to-[#333333]',
    textColor: 'text-white',
    accentColor: 'bg-white text-black hover:bg-gray-200',
    offer: 'Pro Data',
    subOffer: 'On-Chain Intel',
    description: 'Institutional grade on-chain analytics and insights.',
    cta: 'Get Pro',
    url: 'https://glassnode.com/?utm_source=coinvestopedia&utm_medium=banner',
    icon: <LineChart size={20} className="text-white" />
  },
  nansen: {
    name: 'Nansen',
    bgGradient: 'from-[#0F172A] to-[#1E3A8A]',
    textColor: 'text-white',
    accentColor: 'bg-[#3B82F6] text-white hover:bg-[#2563EB]',
    offer: 'Smart Money',
    subOffer: 'Wallet Labels',
    description: 'Surface the signal in blockchain data.',
    cta: 'Track Wallets',
    url: 'https://nansen.ai/?utm_source=coinvestopedia&utm_medium=banner',
    icon: <Zap size={20} className="text-[#3B82F6]" />
  },
  tradingview: {
    name: 'TradingView',
    bgGradient: 'from-[#131722] to-[#2A2E39]',
    textColor: 'text-white',
    accentColor: 'bg-[#2962FF] text-white hover:bg-[#1E4EB8]',
    offer: 'Pro Charts',
    subOffer: 'Advanced Tools',
    description: 'Look first / then leap. Premium charting software.',
    cta: 'Upgrade',
    url: 'https://www.tradingview.com/?utm_source=coinvestopedia&utm_medium=banner',
    icon: <BarChart2 size={20} className="text-[#2962FF]" />
  }
};

export const AdUnit: React.FC<AdUnitProps> = ({ size, className = '', label = 'Advertisement', partner, context }) => {
  const { isProUser } = useAppContext();

  // Ad rules: Hide if Pro user or if newsletter-mode (where we might not want display ads)
  if (isProUser) return null;

  const dimensions = {
    medium: 'w-[300px] h-[250px]',
    large: 'w-full h-full min-h-[250px]',
    billboard: 'w-full h-[250px]',
    skyscraper: 'w-[300px] h-[600px]',
    leaderboard: 'w-full max-w-[728px] h-[90px] mx-auto',
    'mobile-sticky': 'fixed bottom-[64px] left-0 right-0 h-[50px] bg-background/95 backdrop-blur-sm border-t border-border z-[99] md:hidden',
    native: 'w-full max-w-sm h-auto mx-auto'
  };

  const resolvedPartner = useMemo(() => {
    if (context) return getContextualAd(context);
    if (partner && PARTNERS[partner]) return partner;
    const keys = Object.keys(PARTNERS) as AdPartner[];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return randomKey;
  }, [partner, context]);

  const adData = PARTNERS[resolvedPartner];

  if (size === 'native') {
    return (
      <div className={`leather-card rounded-xl p-5 border border-primary/20 relative shadow-lg hover:border-primary/50 transition-colors ${dimensions[size]} ${className}`}>
        <span className="absolute top-2 right-2 text-[9px] text-text-muted uppercase tracking-widest font-bold px-2 py-1 bg-surface rounded">
          {label}
        </span>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded bg-surface border border-border flex flex-shrink-0 items-center justify-center shadow-inner">
            {adData.icon}
          </div>
          <span className="font-bold text-sm text-text">{adData.name}</span>
        </div>
        <p className="text-sm font-bold mb-1 drop-shadow-sm text-primary">{adData.offer}</p>
        <p className="text-xs text-text-muted mb-4 line-clamp-2">{adData.description}</p>
        <a 
           href={adData.url} 
           target="_blank" 
           rel="nofollow sponsored"
           className={`w-full py-2 flex items-center justify-center gap-1 rounded font-bold text-xs shadow-md transition-transform hover:-translate-y-0.5 ${adData.accentColor}`}
        >
          {adData.cta} <ArrowUpRight size={12} strokeWidth={3} />
        </a>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-[1.01] ${dimensions[size]} ${className}`}>
        {/* Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${adData.bgGradient} opacity-95`}></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        {/* Label */}
        <span className="absolute top-2 right-2 text-[9px] uppercase tracking-widest opacity-60 font-bold z-10 px-2 py-1 bg-black/20 rounded backdrop-blur-sm text-white border border-white/10">
            {label}
        </span>

        {/* Content */}
        <div className={size === 'mobile-sticky' 
            ? `relative z-10 flex items-center justify-between h-full px-4 ${adData.textColor}`
            : `relative z-10 flex flex-col h-full p-6 justify-between ${adData.textColor}`
        }>
            {size === 'mobile-sticky' ? (
                <>
                   <div className="flex items-center gap-3">
                      <div className="p-1 bg-white/10 rounded border border-white/10">{adData.icon}</div>
                      <div>
                         <div className="text-xs font-black leading-none">{adData.offer}</div>
                         <div className="text-[10px] opacity-70 font-bold uppercase">{adData.name}</div>
                      </div>
                   </div>
                   <a 
                     href={adData.url} 
                     target="_blank" 
                     rel="nofollow sponsored"
                     className={`px-4 py-1.5 rounded-lg text-[10px] font-bold shadow-lg ${adData.accentColor}`}
                   >
                     {adData.cta}
                   </a>
                </>
            ) : (
                <>
                    <div>
                        <div className="flex items-center gap-2 mb-3 font-bold text-lg tracking-wide">
                            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md border border-white/10">
                                {adData.icon}
                            </div>
                            {adData.name}
                        </div>
                        
                        <div className="font-black text-4xl leading-none mb-1 tracking-tight drop-shadow-lg">
                            {adData.offer}
                        </div>
                        <div className="text-sm font-bold opacity-90 uppercase tracking-wider mb-4 text-white/80">
                            {adData.subOffer}
                        </div>
                        
                        {size !== 'medium' && size !== 'leaderboard' && (
                            <p className="text-sm opacity-85 leading-relaxed max-w-[90%] font-medium">
                                {adData.description}
                            </p>
                        )}
                    </div>

                    <a 
                      href={adData.url}
                      target="_blank"
                      rel="nofollow sponsored"
                      className={`mt-4 w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 ${adData.accentColor}`}
                    >
                        {adData.cta} <ArrowUpRight size={16} strokeWidth={3} />
                    </a>
                </>
            )}
        </div>
    </div>
  );
};