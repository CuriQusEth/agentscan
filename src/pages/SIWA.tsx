import React, { useState } from 'react';
import { useAgents } from '../context/AgentContext';
import { useWallet } from '../context/WalletContext';
import { ShieldAlert, Fingerprint, Lock, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function SIWA() {
  const { agents, signInWithAgent } = useAgents();
  const { address } = useWallet();
  const [signingId, setSigningId] = useState<string | null>(null);

  if (!address) {
    return (
       <div className="h-full flex items-center justify-center text-slate-500">
        <p className="font-medium">Please connect your wallet.</p>
      </div>
    );
  }

  // Only agents that have their identity minted and metadata linked can bind wallets
  const verifiedAgents = agents.filter(a => a.isRegistered && a.hasMetadataUri);

  const handleSignIn = async (id: string) => {
    setSigningId(id);
    const res = await signInWithAgent(id);
    
    // Slight delay to allow state update to reflect before alert blocks UI
    setTimeout(() => {
        alert(`Wallet mapping verified. Reputation layer now active.\nSig: ${res.signature.slice(0,25)}...`);
    }, 100);
    setSigningId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
       <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3 tracking-tight"><Lock className="text-blue-500" size={32} /> Wallet Binding & Validation</h2>
        <p className="text-slate-400 text-lg">Use <code className="text-blue-300">setAgentWallet()</code> to securely bind your externally owned account or smart wallet to the agent identity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-amber-600/5 border border-amber-500/20 rounded-3xl">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-amber-500"><ShieldAlert size={20} /> Identity Trust Layer</h3>
            <p className="text-sm text-amber-200/70 leading-relaxed mb-6 font-medium">
              ERC-8004 is fundamentally a trust layer. To enable reputation scoring, you must prove you control the underlying deployment. By executing <code className="bg-amber-900/50 px-1 py-0.5 rounded">setAgentWallet()</code> via SIWA, you bind the reputation registry to this identity.
            </p>
            <div className="p-4 bg-amber-900/30 rounded-xl text-xs text-amber-400/80 font-mono space-y-1">
              <div>Network: Base Mainnet</div>
              <div>Signatures: EIP-712 / ERC-1271</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-5">
           {verifiedAgents.length === 0 ? (
             <div className="p-12 border border-slate-800/60 border-dashed rounded-3xl text-center text-slate-500 bg-slate-900/20 flex-1 flex flex-col items-center justify-center">
               <Fingerprint size={48} className="mb-4 opacity-30" />
               <p className="font-medium text-lg text-slate-400">No identity-ready agents available.</p>
               <p className="text-sm mt-2">Deploy your contract, Mint the Identity NFT, and Set Metadata first.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               {verifiedAgents.map(agent => (
                 <motion.div key={agent.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={`p-6 rounded-3xl border transition-all ${agent.hasSigned ? 'bg-emerald-900/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'bg-[#020617] border-slate-800/80 hover:bg-slate-900/30'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-lg text-white leading-tight pr-4">{agent.name}</h4>
                      {agent.hasSigned && <Check className="text-emerald-500 shrink-0" size={24} />}
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-lg text-xs font-mono text-slate-500 mb-6 border border-slate-800/60 flex flex-col gap-1">
                      <span className="truncate flex items-center gap-2"><span className="text-slate-600">ID:</span> #{agent.registryId}</span>
                      <span className="truncate flex items-center gap-2"><span className="text-slate-600">Contract:</span> {agent.address?.slice(0,8)}...{agent.address?.slice(-6)}</span>
                    </div>
                    
                    <button
                      onClick={() => handleSignIn(agent.id)}
                      disabled={agent.hasSigned || signingId !== null}
                      className={`w-full py-3.5 rounded-full text-sm font-bold transition-transform active:scale-95 flex items-center justify-center gap-2 ${
                        agent.hasSigned 
                          ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50 scale-100' 
                          : 'bg-white text-black hover:bg-slate-200 shadow-md disabled:opacity-50'
                      }`}
                    >
                      {signingId === agent.id ? (
                        'Generating EIP-712...'
                      ) : agent.hasSigned ? (
                        'Wallet Bound & Verified'
                      ) : (
                        <><Fingerprint size={18} /> Execute setAgentWallet()</>
                      )}
                    </button>
                 </motion.div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
