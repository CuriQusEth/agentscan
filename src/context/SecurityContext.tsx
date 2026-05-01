import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ScannedAgent = {
  id: string;
  registryId: string;
  name: string;
  address: string;
  trustScore: number;
  metrics: {
    scanScore: number;
    feedbackAvg: number;
    feedbackCount: number;
    validationScore: number;
  };
  vulnerabilities: { critical: number; high: number; medium: number; low: number };
  status: 'Safe' | 'Warning' | 'Critical';
  lastScanned: string;
};

type SecurityContextType = {
  agents: ScannedAgent[];
  scanAgent: (registryId: string, address: string) => Promise<ScannedAgent>;
  addFeedback: (registryId: string, rating: number) => Promise<void>;
};

const calculateTrustScore = (scan: number, feedback: number, validation: number) => {
  // Formula: (Feedback avg * 40%) + (Validation pass rate * 40%) + (Scan safety score * 20%)
  return Math.round((feedback * 0.4) + (validation * 0.4) + (scan * 0.2));
};

const defaultAgents: ScannedAgent[] = [
  { 
    id: '1', registryId: '1042', name: 'Alpha-Arb Bot', address: '0x8f2c3ae1245b', 
    metrics: { scanScore: 92, feedbackAvg: 95, feedbackCount: 12, validationScore: 100 },
    get trustScore() { return calculateTrustScore(this.metrics.scanScore, this.metrics.feedbackAvg, this.metrics.validationScore); },
    vulnerabilities: { critical: 0, high: 0, medium: 1, low: 2 }, status: 'Safe', lastScanned: '2 mins ago' 
  },
  { 
    id: '2', registryId: '803', name: 'DeFi Yield Ninja', address: '0x1a2d5f4019ea', 
    metrics: { scanScore: 40, feedbackAvg: 60, feedbackCount: 5, validationScore: 50 },
    get trustScore() { return calculateTrustScore(this.metrics.scanScore, this.metrics.feedbackAvg, this.metrics.validationScore); },
    vulnerabilities: { critical: 2, high: 1, medium: 4, low: 0 }, status: 'Critical', lastScanned: '1 hour ago' 
  },
  { 
    id: '3', registryId: '2093', name: 'Tweet Scout', address: '0xcd3e6b2c3109', 
    metrics: { scanScore: 88, feedbackAvg: 80, feedbackCount: 8, validationScore: 90 },
    get trustScore() { return calculateTrustScore(this.metrics.scanScore, this.metrics.feedbackAvg, this.metrics.validationScore); },
    vulnerabilities: { critical: 0, high: 1, medium: 2, low: 5 }, status: 'Warning', lastScanned: '1 day ago' 
  }
];

// Re-map defaultAgents to resolve getters statically
const initialAgents = defaultAgents.map(a => ({ ...a, trustScore: calculateTrustScore(a.metrics.scanScore, a.metrics.feedbackAvg, a.metrics.validationScore) }));

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<ScannedAgent[]>(initialAgents);

  const scanAgent = async (registryId: string, address: string) => {
    return new Promise<ScannedAgent>((resolve) => {
      setTimeout(() => {
        const scanScore = Math.floor(Math.random() * 40) + 50; 
        const validationScore = Math.floor(Math.random() * 20) + 80;
        const feedbackAvg = 50; // Neutral start
        const trustScore = calculateTrustScore(scanScore, feedbackAvg, validationScore);

        const newAgent: ScannedAgent = {
          id: Math.random().toString(36).substring(7),
          registryId: registryId || Math.floor(Math.random() * 5000).toString(),
          name: `Agent #${registryId || 'Unknown'}`,
          address: address || '0x' + Math.random().toString(16).slice(2, 14),
          metrics: { scanScore, validationScore, feedbackAvg, feedbackCount: 0 },
          trustScore,
          vulnerabilities: {
            critical: scanScore < 60 ? Math.floor(Math.random() * 2) + 1 : 0,
            high: scanScore < 75 ? Math.floor(Math.random() * 3) : 0,
            medium: Math.floor(Math.random() * 4),
            low: Math.floor(Math.random() * 8),
          },
          status: trustScore >= 85 ? 'Safe' : trustScore >= 70 ? 'Warning' : 'Critical',
          lastScanned: 'Just now',
        };
        setAgents((prev) => [newAgent, ...prev]);
        resolve(newAgent);
      }, 3000); 
    });
  };

  const addFeedback = async (registryId: string, ratingOutOf5: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAgents((prev) => prev.map(agent => {
          if (agent.registryId === registryId) {
            const currentTotal = agent.metrics.feedbackAvg * agent.metrics.feedbackCount;
            const newCount = agent.metrics.feedbackCount + 1;
            const ratingOutOf100 = ratingOutOf5 * 20;
            const newAvg = (currentTotal + ratingOutOf100) / newCount;
            
            const newTrustScore = calculateTrustScore(agent.metrics.scanScore, newAvg, agent.metrics.validationScore);
            
            return {
              ...agent,
              metrics: {
                ...agent.metrics,
                feedbackAvg: newAvg,
                feedbackCount: newCount
              },
              trustScore: newTrustScore,
              status: newTrustScore >= 85 ? 'Safe' : newTrustScore >= 70 ? 'Warning' : 'Critical'
            };
          }
          return agent;
        }));
        resolve();
      }, 1000);
    });
  };

  return (
    <SecurityContext.Provider value={{ agents, scanAgent, addFeedback }}>
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
