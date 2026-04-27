import React from 'react';

interface ProGateProps {
  children: React.ReactNode;
}

export const ProGate: React.FC<ProGateProps> = ({ children }) => {
  return <>{children}</>;
};
