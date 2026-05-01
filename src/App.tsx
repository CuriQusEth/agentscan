/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config';
import { WalletProvider } from './context/WalletContext';
import { SecurityProvider } from './context/SecurityContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Leaderboard from './pages/Leaderboard';
import Reports from './pages/Reports';
import AgentProfile from './pages/AgentProfile';

const queryClient = new QueryClient();

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const navigateToProfile = (agentId: string) => {
    setSelectedAgentId(agentId);
    setActiveTab('profile');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'scanner': return <Scanner onNavigateToProfile={navigateToProfile} />;
      case 'leaderboard': return <Leaderboard onAgentClick={navigateToProfile} />;
      case 'reports': return <Reports />;
      case 'profile': return selectedAgentId ? <AgentProfile agentId={selectedAgentId} /> : <div className="text-center p-12 text-slate-400 font-mono">No Agent Selected</div>;
      default: return <Dashboard />;
    }
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <SecurityProvider>
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              {renderContent()}
            </Layout>
          </SecurityProvider>
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
