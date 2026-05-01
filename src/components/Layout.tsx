import React from 'react';
import { useWallet } from '../context/WalletContext';
import { LayoutDashboard, Hammer, Registry, ListChecks, ShieldPlus, Blocks } from 'lucide-react';

export default function Layout({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (t: string) => void }) {
  const { address, connect, disconnect } = useWallet();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'builder', label: 'Factory Deploy', icon: <Hammer size={20} /> },
    { id: 'registry', label: 'Identity Registry', icon: <ListChecks size={20} /> },
    { id: 'siwa', label: 'Validation (SIWA)', icon: <ShieldPlus size={20} /> },
    { id: 'templates', label: 'Marketplace', icon: <Blocks size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 font-sans overflow-hidden select-none">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800/60 bg-[#020617] flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rotate-45"></div>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">BaseAgents</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                activeTab === item.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className={activeTab !== item.id ? 'opacity-60' : ''}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mb-6">
          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Current Network</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-200 font-medium">Base Mainnet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-20 px-8 border-b border-slate-800/60 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-semibold text-white">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-slate-500">Manage your autonomous agents in the ERC-8004 Identity Protocol</p>
          </div>
          <div className="flex items-center gap-4">
            {address ? (
              <button 
                onClick={disconnect}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm font-medium hover:bg-slate-700 transition-colors"
                title="Disconnect"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                {address.slice(0, 6)}...{address.slice(-4)}
              </button>
            ) : (
              <button 
                onClick={connect}
                className="px-5 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-slate-200 transition-transform active:scale-95"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
           {children}
        </div>
        
        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 border-t-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      </main>
    </div>
  );
}
