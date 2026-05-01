import React from 'react';
import { useAgents } from '../context/AgentContext';
import { useWallet } from '../context/WalletContext';
import { Activity, Brain, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { agents } = useAgents();
  const { address } = useWallet();

  if (!address) {
    return (
      <div className="h-full flex items-center justify-center flex-col text-slate-500 animate-pulse">
        <ShieldCheck size={48} className="mb-4 opacity-50" />
        <p className="font-medium text-slate-400">Please connect your wallet to view your dashboard.</p>
      </div>
    );
  }

  const deployedCount = agents.filter(a => a.isDeployed).length;
  const verifiedCount = agents.filter(a => a.isVerified).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800/60">
          <p className="text-slate-500 text-sm mb-1">Total Agents</p>
          <p className="text-2xl font-bold text-white">{agents.length}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800/60">
          <p className="text-slate-500 text-sm mb-1">Live Contracts</p>
          <p className="text-2xl font-bold text-white">{deployedCount}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800/60">
          <p className="text-slate-500 text-sm mb-1">Total Validated</p>
          <p className="text-2xl font-bold text-blue-400">{verifiedCount}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800/60">
          <p className="text-slate-500 text-sm mb-1">Reputation Score</p>
          <p className="text-2xl font-bold text-green-400">{verifiedCount === 0 ? 'N/A' : '98.4%'}</p>
        </motion.div>
      </div>

      <div className="bg-slate-900/40 rounded-3xl border border-slate-800/60 flex flex-col p-6">
        <div className="pb-4 mb-4 border-b border-slate-800/60 flex items-center justify-between">
          <h3 className="text-white font-semibold">Registered NFT Identities</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] uppercase font-bold text-slate-400">Filter: All</span>
            <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] uppercase font-bold text-slate-400">Sort: Recent</span>
          </div>
        </div>
        
        {agents.length === 0 ? (
          <div className="p-12 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-800/20">
            <Brain size={40} className="mb-4 opacity-50" />
            <p className="font-medium text-lg text-slate-300">No agents built yet.</p>
            <p className="text-sm mt-1 mb-4">Head over to the Agent Builder to deploy your first smart contract wrapper.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {agents.map((agent, i) => (
              <motion.div key={agent.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="p-5 bg-[#020617] border border-slate-800/60 rounded-2xl hover:bg-slate-800/20 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">{agent.name.substring(0, 2).toUpperCase()}</div>
                    <div>
                      <div className="text-slate-100 font-medium">{agent.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{agent.address ? `${agent.address.slice(0,12)}...${agent.address.slice(-4)}` : 'Draft'}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                      {agent.isDeployed ? <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[11px] rounded-md font-medium border border-green-500/20 uppercase tracking-wider">ACTIVE</span> : <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-[11px] rounded-md font-medium uppercase tracking-wider">DRAFT</span>}
                  </div>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-6 mt-3">{agent.systemPrompt}</p>
                
                <div className="space-y-3 pt-4 border-t border-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                    <div className="flex justify-between items-center px-2 py-1">
                      <span>Identity Registry</span>
                      <span className={agent.isRegistered ? "text-purple-400 font-bold" : "font-bold"}>{agent.isRegistered ? `NFT #${agent.registryId}` : 'Unminted'}</span>
                    </div>
                    <div className="flex justify-between items-center px-2 py-1">
                      <span>Reputation Layer</span>
                      {agent.hasSigned ? (
                        <div className="flex items-center gap-1 text-slate-400 lowercase normal-case tracking-normal text-sm">
                          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.25.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                          Wallet Bound: {agent.reputationScore} Rep
                        </div>
                      ) : <span className="text-slate-500 italic lowercase normal-case tracking-normal text-sm">Validating...</span>}
                    </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
