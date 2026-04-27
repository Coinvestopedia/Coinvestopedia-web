import React, { useState, useEffect } from 'react';
import { useAssetRegistryContext } from '../context/AssetRegistryContext';

interface LiveChangeProps {
  symbol: string;
  fallback?: string;
  className?: string;
}

export const LiveChange: React.FC<LiveChangeProps> = ({ symbol, fallback, className = '' }) => {
  const { registry } = useAssetRegistryContext();
  const [displayValue, setDisplayValue] = useState(fallback || '---');
  const [colorClass, setColorClass] = useState('text-text-muted');

  useEffect(() => {
    const asset = registry[symbol];
    if (asset && asset.change24h !== undefined) {
      const isUp = asset.change24h >= 0;
      setColorClass(isUp ? 'text-emerald-400' : 'text-red-400');
      setDisplayValue(`${isUp ? '+' : ''}${asset.change24h.toFixed(1)}%`);
    } else if (fallback) {
      if (fallback.startsWith('+')) setColorClass('text-emerald-400');
      else if (fallback.startsWith('-')) setColorClass('text-red-400');
    }
  }, [registry, symbol, fallback]);

  return (
    <span className={`live-change transition-colors duration-500 ${colorClass} ${className}`}>
      {displayValue}
    </span>
  );
};
