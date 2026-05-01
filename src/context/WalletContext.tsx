import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

type WalletContextType = {
  address: string | null;
  connect: () => void;
  disconnect: () => void;
  connectors: ReturnType<typeof useConnect>['connectors'];
  connectWith: (connector: any) => void;
  isConnecting: boolean;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    const injectedConnector = connectors.find(c => c.id === 'injected' || c.id === 'metaMaskSDK' || c.name.toLowerCase().includes('metamask') || c.id === 'coinbaseWalletSDK');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    } else if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  const connectWith = (connector: any) => {
    connect({ connector });
  };

  return (
    <WalletContext.Provider value={{ 
      address: isConnected ? address || null : null, 
      connect: handleConnect, 
      disconnect, 
      connectors, 
      connectWith,
      isConnecting: isPending
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
