/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import { AgentProvider } from './context/AgentContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import Registry from './pages/Registry';
import SIWA from './pages/SIWA';
import Templates from './pages/Templates';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'builder': return <Builder />;
      case 'registry': return <Registry />;
      case 'siwa': return <SIWA />;
      case 'templates': return <Templates />;
      default: return <Dashboard />;
    }
  };

  return (
    <WalletProvider>
      <AgentProvider>
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
        </Layout>
      </AgentProvider>
    </WalletProvider>
  );
}
