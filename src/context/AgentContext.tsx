import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Agent = {
  id: string; // Internal id
  name: string;
  systemPrompt: string;
  address: string | null; // Null if not deployed
  isDeployed: boolean;
  registryId: string | null; // Represents tokenId
  isRegistered: boolean; // Minted in Identity Registry
  hasMetadataUri: boolean; // setAgentURI called
  isVerified: boolean;
  hasSigned: boolean; // setAgentWallet called
  metadataURI?: string;
  reputationScore: number;
};

type AgentContextType = {
  agents: Agent[];
  addAgent: (agent: Omit<Agent, 'id' | 'address' | 'isDeployed' | 'registryId' | 'isRegistered' | 'hasMetadataUri' | 'isVerified' | 'hasSigned' | 'reputationScore'>) => void;
  deployAgent: (id: string) => Promise<void>;
  registerAgent: (id: string, metadataURI?: string) => Promise<void>;
  setMetadataUri: (id: string) => Promise<void>;
  verifyAgent: (id: string, signature?: string) => Promise<void>;
  signInWithAgent: (id: string) => Promise<{ signature: string }>;
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);

  const addAgent = (agentData: Omit<Agent, 'id' | 'address' | 'isDeployed' | 'registryId' | 'isRegistered' | 'hasMetadataUri' | 'isVerified' | 'hasSigned' | 'reputationScore'>) => {
    const newAgent: Agent = {
      ...agentData,
      id: Math.random().toString(36).substring(2, 11),
      address: null,
      isDeployed: false,
      registryId: null,
      isRegistered: false,
      hasMetadataUri: false,
      isVerified: false,
      hasSigned: false,
      reputationScore: 0,
    };
    setAgents([...agents, newAgent]);
  };

  const deployAgent = async (id: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) =>
            a.id === id
              ? { ...a, isDeployed: true, address: '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0') }
              : a
          )
        );
        resolve();
      }, 1500);
    });
  };

  const registerAgent = async (id: string, metadataURI?: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, isRegistered: true, registryId: Math.floor(Math.random() * 1000).toString(), metadataURI: metadataURI || 'ipfs://...' } : a
          )
        );
        resolve();
      }, 1500);
    });
  };

  const setMetadataUri = async (id: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, hasMetadataUri: true } : a)));
        resolve();
      }, 1000);
    });
  };

  const verifyAgent = async (id: string, signature?: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, isVerified: true } : a)));
        resolve();
      }, 1000);
    });
  };

  const signInWithAgent = async (id: string): Promise<{ signature: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, hasSigned: true, reputationScore: 98.4 } : a)));
        resolve({ signature: '0x' + Math.random().toString(16).slice(2, 130).padEnd(128, '0') });
      }, 2000);
    });
  };

  return (
    <AgentContext.Provider value={{ agents, addAgent, deployAgent, registerAgent, setMetadataUri, verifyAgent, signInWithAgent }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgents() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
}
