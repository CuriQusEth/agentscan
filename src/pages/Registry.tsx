import React, { useState } from 'react';
import { useAgents } from '../context/AgentContext';
import { useWallet } from '../context/WalletContext';
import { Verified, Link, CheckCircle2, FileText, Database } from 'lucide-react';
import { motion } from 'motion/react';

export default function Registry() {
  const { agents, registerAgent, setMetadataUri } = useAgents();
  const { address } = useWallet();
  const [processingId, setProcessingId] = useState<string | null>(null);

  if (!address) {
    return (
       <div className="h-full flex items-center justify-center text-slate-500">
        <p className="font-medium">Please connect your wallet.</p>
      </div>
    );
  }

  const deployedAgents = agents.filter(a => a.isDeployed);

  const handleRegister = async (id: string) => {
    setProcessingId(`reg-${id}`);
    await registerAgent(id);
    setProcessingId(null);
  };

  const handleMetadata = async (id: string) => {
    setProcessingId(`meta-${id}`);
    await setMetadataUri(id);
    setProcessingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Identity Registry (ERC-8004)</h2>
        <p className="text-slate-400 text-lg">Mint an ERC-721 Identity Token for your agent and define its on-chain metadata.</p>
      </div>

      <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-8">
        <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2 text-lg"><Verified size={22} /> True ERC-8004 Architecture</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="font-semibold text-slate-200">1. Identity (NFT)</div>
            <p className="text-sm text-slate-400 leading-relaxed">Agent is not just a contract; it's an ERC-721 token in the IdentityRegistry map.</p>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-slate-200">2. Metadata & APIs</div>
            <p className="text-sm text-slate-400 leading-relaxed">Link IPFS/Arweave JSON defining name, description, and API interactions via <code className="text-blue-300">setAgentURI()</code>.</p>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-slate-200">3. Reputation Hub</div>
            <p className="text-sm text-slate-400 leading-relaxed">Establishes the foundation for the ReputationRegistry to aggregate agent reliability scoring.</p>
          </div>
        </div>
      </div>

      {deployedAgents.length === 0 ? (
        <div className="p-12 text-center text-slate-500 border border-slate-800 border-dashed rounded-3xl bg-slate-900/20">
           <FileText size={40} className="mx-auto mb-4 opacity-50" />
          <p className="font-medium text-lg text-slate-400">No deployed contracts found.</p>
          <p className="text-sm mt-2">Go to the Agent Builder to deploy your code first.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {deployedAgents.map((agent) => (
            <motion.div key={agent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-slate-900/30 border border-slate-800/60 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-800/30 transition-colors">
              <div className="flex-1 space-y-3">
                <h4 className="font-bold text-xl text-white">{agent.name}</h4>
                <div className="flex flex-wrap items-center gap-4 text-sm font-mono">
                  <div className="flex items-center gap-2 bg-[#020617] px-3 py-1.5 rounded-lg border border-slate-800/80">
                    <Link size={14} className="text-slate-500" /> 
                    <span className="text-slate-400">{agent.address}</span>
                  </div>
                  {agent.isRegistered && (
                    <div className="flex items-center gap-2 bg-blue-900/20 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20">
                      <CheckCircle2 size={14} /> 
                      <span className="font-medium">Token ID: #{agent.registryId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                {!agent.isRegistered ? (
                  <button
                    onClick={() => handleRegister(agent.id)}
                    disabled={processingId !== null}
                    className="px-6 py-3 bg-white text-black hover:bg-slate-200 rounded-full font-bold transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {processingId === `reg-${agent.id}` ? 'Tx Pending...' : 'Mint Identity NFT'}
                  </button>
                ) : !agent.hasMetadataUri ? (
                  <div className="flex items-center gap-3">
                     <span className="text-slate-400 text-sm font-medium pr-2">Identity Minted!</span>
                     <button
                        onClick={() => handleMetadata(agent.id)}
                        disabled={processingId !== null}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-50"
                      >
                        {processingId === `meta-${agent.id}` ? 'Uploading JSON...' : <><Database size={16}/> setAgentURI()</>}
                      </button>
                  </div>
                ) : (
                  <div className="px-6 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold flex items-center gap-2">
                    <Verified size={18} /> Identity Ready
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
