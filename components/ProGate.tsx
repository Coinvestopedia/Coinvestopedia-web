import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from './Button';
import { AD_MONETIZATION_ENABLED } from '../services/launchConfig';

interface ProGateProps {
  children: React.ReactNode;
  isUnlocked?: boolean;
  featureName?: string;
}

export const ProGate: React.FC<ProGateProps> = ({ children }) => {
  return <>{children}</>;
};
