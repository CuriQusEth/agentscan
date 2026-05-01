import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ScannedAgent = {
  id: string;
  registryId: string;
  name: string;
  address: string;
  securityScore: number;
  vulnerabilities: { critical: number; high: number; medium: number; low: number };
  status: 'Safe' | 'Warning' | 'Critical';
  lastScanned: string;
};

type SecurityContextType = {
  agents: ScannedAgent[];
  scanAgent: (registryId: string, address: string) => Promise<ScannedAgent>;
};

const defaultAgents: ScannedAgent[] = [
  { id: '1', registryId: '1042', name: 'Alpha-Arb Bot', address: '0x8f2c3ae1245b', securityScore: 98, vulnerabilities: { critical: 0, high: 0, medium: 1, low: 2 }, status: 'Safe', lastScanned: '2 mins ago' },
  { id: '2', registryId: '803', name: 'DeFi Yield Ninja', address: '0x1a2d5f4019ea', securityScore: 45, vulnerabilities: { critical: 2, high: 1, medium: 4, low: 0 }, status: 'Critical', lastScanned: '1 hour ago' },
  { id: '3', registryId: '2093', name: 'Tweet Scout', address: '0xcd3e6b2c3109', securityScore: 82, vulnerabilities: { critical: 0, high: 1, medium: 2, low: 5 }, status: 'Warning', lastScanned: '1 day ago' },
  { id: '4', registryId: '45', name: 'Liquidity Sniper', address: '0x992a1b3c4d5e', securityScore: 94, vulnerabilities: { critical: 0, high: 0, medium: 0, low: 3 }, status: 'Safe', lastScanned: '2 days ago' }
];

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<ScannedAgent[]>(defaultAgents);

  const scanAgent = async (registryId: string, address: string) => {
    return new Promise<ScannedAgent>((resolve) => {
      setTimeout(() => {
        const score = Math.floor(Math.random() * 40) + 50; // Random score between 50-90
        const newAgent: ScannedAgent = {
          id: Math.random().toString(36).substring(7),
          registryId: registryId || Math.floor(Math.random() * 5000).toString(),
          name: `Agent #${registryId || 'Unknown'}`,
          address: address || '0x' + Math.random().toString(16).slice(2, 14),
          securityScore: score,
          vulnerabilities: {
            critical: score < 60 ? Math.floor(Math.random() * 2) + 1 : 0,
            high: score < 75 ? Math.floor(Math.random() * 3) : 0,
            medium: Math.floor(Math.random() * 4),
            low: Math.floor(Math.random() * 8),
          },
          status: score >= 85 ? 'Safe' : score >= 70 ? 'Warning' : 'Critical',
          lastScanned: 'Just now',
        };
        setAgents((prev) => [newAgent, ...prev]);
        resolve(newAgent);
      }, 3000); // simulate scan time
    });
  };

  return (
    <SecurityContext.Provider value={{ agents, scanAgent }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}
