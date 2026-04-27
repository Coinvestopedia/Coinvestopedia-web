import React, { useState, useEffect } from 'react';
import { useAssetRegistryContext } from '../context/AssetRegistryContext';

interface LivePriceProps {
  symbol: string;
  fallback?: string;
  format?: 'currency' | 'number' | 'percent';
  className?: string;
}

export const LivePrice: React.FC<LivePriceProps> = ({ symbol, fallback, format = 'currency', className = '' }) => {
  const { registry } = useAssetRegistryContext();
  const [displayValue, setDisplayValue] = useState(fallback || '---');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const asset = registry[symbol];
    if (asset && asset.price) {
      let newValue = '';
      if (format === 'percent') {
        newValue = asset.price + '%';
      } else if (format === 'number') {
        newValue = new Intl.NumberFormat('en-US').format(asset.price);
      } else {
        newValue = new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD', 
            maximumFractionDigits: asset.price < 1 ? 4 : 0 
        }).format(asset.price);
      }

      if (newValue !== displayValue && displayValue !== fallback && displayValue !== '---') {
        setIsUpdating(true);
        setTimeout(() => setIsUpdating(false), 1000);
      }
      setDisplayValue(newValue);
    }
  }, [registry, symbol, format, fallback]);

  return (
    <span className={`live-price transition-all duration-500 ${isUpdating ? 'text-primary' : ''} ${className}`}>
      {displayValue}
    </span>
  );
};
