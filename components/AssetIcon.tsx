import React, { useState } from 'react';
import { ASSET_REGISTRY } from '../data/assetRegistry';

interface AssetIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

export const AssetIcon: React.FC<AssetIconProps> = ({ symbol, size = 28, className = '' }) => {
  const asset = ASSET_REGISTRY[symbol];
  const [imgError, setImgError] = useState(false);

  if (asset?.iconUrl && !imgError) {
    return (
      <img
        src={asset.iconUrl}
        alt={symbol}
        style={{ width: size, height: size }}
        className={`rounded-full border border-border bg-background p-0.5 object-contain ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback: colored initial badge
  return (
    <div
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: asset?.color || '#3f3f46',
        borderRadius: '50%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: size * 0.4, 
        fontWeight: 700, 
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
      className={className}
    >
      {symbol.slice(0, 2).toUpperCase()}
    </div>
  );
};
