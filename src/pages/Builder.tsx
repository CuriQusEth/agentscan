import React, { useState } from 'react';
import { useAgents } from '../context/AgentContext';
import { useWallet } from '../context/WalletContext';
import { Rocket, Box, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Builder() {
  const { addAgent, deployAgent, agents } = useAgents();
  const { address } = useWallet();
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [deployingId, setDeployingId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !systemPrompt) return;
    addAgent({ name, systemPrompt });
    setName('');
    setSystemPrompt('');
  };

  const handleDeploy = async (id: string) => {
    setDeployingId(id);
    await deployAgent(id);
    setDeployingId(null);
  };

  if (!address) {
    return (
       <div className="h-full flex items-center justify-center text-slate-500">
        <p className="font-medium">Please connect your wallet.</p>
      </div>
    );
  }

  const undeployedAgents = agents.filter(a => !a.isDeployed);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Agent Builder (Factory)</h2>
        <p className="text-slate-400 text-lg">Define core logic and compile it into a smart contract deployed to Base Mainnet.</p>
      </div>

      <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800/60 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Box size={240} />
        </div>
        
        <form onSubmit={handleCreate} className="space-y-6 relative z-10 max-w-2xl">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Agent Project Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#020617] border border-slate-800/80 rounded-xl px-5 py-3 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium placeholder-slate-600 focus:bg-slate-900/50"
              placeholder="e.g. DeFi Yield Optimizer Bot"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">System Instructions / Initial State</label>
            <textarea 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={5}
              className="w-full bg-[#020617] border border-slate-800/80 rounded-xl px-5 py-3 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none font-mono text-sm placeholder-slate-600 leading-relaxed focus:bg-slate-900/50"
              placeholder="Define core logic..."
            />
          </div>
          <button 
            type="submit"
            disabled={!name || !systemPrompt}
            className="px-6 py-3 bg-white text-black hover:bg-slate-200 disabled:opacity-50 rounded-full font-bold transition-transform active:scale-95 flex items-center gap-2"
          >
            Create Draft Target
          </button>
        </form>
      </div>

      {undeployedAgents.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            Ready to Deploy <Zap size={22} className="text-blue-400" />
          </h3>
          <div className="grid gap-4">
            {undeployedAgents.map((agent, i) => (
              <motion.div key={agent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-900/40 border border-slate-800/60 rounded-3xl gap-6 hover:bg-slate-800/30 transition-colors">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-white mb-1">{agent.name}</h4>
                  <p className="text-slate-400 text-sm truncate max-w-lg font-mono bg-[#020617] border border-slate-800/80 p-2 rounded-lg mt-2">{agent.systemPrompt}</p>
                </div>
                <button 
                  onClick={() => handleDeploy(agent.id)}
                  disabled={deployingId === agent.id}
                  className="shrink-0 px-6 py-3 bg-white text-black hover:bg-slate-200 rounded-full font-bold transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 min-w-[200px]"
                >
                  {deployingId === agent.id ? (
                    <>Compiling & Deploying<span className="animate-pulse">...</span></>
                  ) : (
                    <><Rocket size={18} /> call createAgent()</>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
