import React, { useMemo } from 'react';
import { ArrowUpRight, Zap, Gift, BarChart2, Shield, Bot } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export type AdPartner = 'kucoin' | 'trezor' | '3commas' | 'binance' | 'bybit' | 'okx' | 'ledger' | 'coinledger';

interface AdUnitProps {
  size: 'medium' | 'large' | 'billboard' | 'skyscraper' | 'leaderboard' | 'mobile-sticky';
  className?: string;
  label?: string;
  partner?: AdPartner;
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
    url: 'https://coinledger.io/?ref=COINVEST',
    icon: <BarChart2 size={20} className="text-primary" />
  }
};

export const AdUnit: React.FC<AdUnitProps> = ({ size, className = '', label = 'Advertisement', partner }) => {
  const { isProUser } = useAppContext();

  // Ad rules: Hide if Pro user or if newsletter-mode (where we might not want display ads)
  if (isProUser) return null;

  const dimensions = {
    medium: 'w-[300px] h-[250px]',
    large: 'w-full h-full min-h-[250px]',
    billboard: 'w-full h-[250px]',
    skyscraper: 'w-[300px] h-[600px]',
    leaderboard: 'w-full max-w-[728px] h-[90px] mx-auto',
    'mobile-sticky': 'fixed bottom-[64px] left-0 right-0 h-[50px] bg-background/95 backdrop-blur-sm border-t border-border z-[99] md:hidden'
  };

  const adData = useMemo(() => {
    if (partner && PARTNERS[partner]) return PARTNERS[partner];
    const keys = Object.keys(PARTNERS) as AdPartner[];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return PARTNERS[randomKey];
  }, [partner]);

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
                     rel="noopener sponsored"
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
                      rel="noopener sponsored"
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