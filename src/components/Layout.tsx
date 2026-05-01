import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { LayoutDashboard, ScanSearch, Trophy, ShieldAlert, Info } from 'lucide-react';

export default function Layout({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (t: string) => void }) {
  const { address, connect, disconnect, isConnecting } = useWallet();
  const [showWalletWarning, setShowWalletWarning] = useState(false);

  const handleConnectClick = () => {
    connect();
    if (window !== window.top) {
      setShowWalletWarning(true);
      setTimeout(() => setShowWalletWarning(false), 5000);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'scanner', label: 'Agent Scanner', icon: <ScanSearch size={20} /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={20} /> },
    { id: 'reports', label: 'Audit Reports', icon: <ShieldAlert size={20} /> },
    { id: 'profile', label: 'Agent Profile', icon: <ScanSearch size={20} />, hidden: true },
  ];

  const currentTab = navItems.find(i => i.id === activeTab);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 font-sans overflow-hidden select-none">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800/60 bg-[#020617] flex flex-col z-20 relative">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rotate-45"></div>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">8004 AgentScan</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.filter(item => !item.hidden).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                activeTab === item.id 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className={activeTab !== item.id ? 'opacity-60' : ''}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mb-6">
          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/60 shadow-inner">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Registry Env</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-sm text-slate-300 font-medium tracking-tight">Base Mainnet</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-20 px-8 border-b border-slate-800/60 flex items-center justify-between shrink-0 bg-[#020617]/80 backdrop-blur-md z-10">
          <div>
            <h1 className="text-xl font-semibold text-white">
              {currentTab ? currentTab.label : 'AgentScan'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 tracking-tight">Security Layer & Trust Scoring for ERC-8004 AI Agents</p>
          </div>
          <div className="flex items-center gap-4 relative">
            {address ? (
              <button 
                onClick={disconnect}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-full text-sm font-medium transition-colors"
                title="Disconnect"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border border-slate-700"></div>
                {address.slice(0, 6)}...{address.slice(-4)}
              </button>
            ) : (
              <button 
                onClick={handleConnectClick}
                disabled={isConnecting}
                className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-slate-200 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2 disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
            
            {showWalletWarning && !address && (
              <div className="absolute top-14 right-0 w-64 bg-slate-900 border border-indigo-500/30 p-3 rounded-xl shadow-xl z-50 text-xs text-slate-300 animate-in fade-in slide-in-from-top-2">
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <p>In the preview environment, wallet popups might be blocked. Click the open-in-new-tab icon near the top right of AI Studio if it doesn't appear.</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
           {children}
        </div>
        
        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 border-t-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent z-10"></div>
      </main>
    </div>
  );
}
