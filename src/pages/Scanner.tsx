import React, { useState, useMemo } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { useAgent, fetchMetadata } from '../lib/erc8004';
import { ScanSearch, Fingerprint, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Scanner({ onNavigateToProfile }: { onNavigateToProfile?: (id: string) => void }) {
  const { scanAgent } = useSecurity();
  const [registryIdInput, setRegistryIdInput] = useState('');
  const [address, setAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const parsedTokenId = useMemo(() => {
    try { return registryIdInput ? BigInt(registryIdInput) : undefined; } 
    catch { return undefined; }
  }, [registryIdInput]);

  const { owner, uri, isLoading: isContractLoading } = useAgent(parsedTokenId);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registryIdInput && !address) return;
    
    setIsScanning(true);
    setScanStep(1);

    // If registryId is provided, simulate fetching metadata
    if (parsedTokenId !== undefined && uri) {
      setTimeout(() => setScanStep(2), 1000);
      try {
        const metadata = await fetchMetadata(uri);
        console.log("Metadata fetched:", metadata);
      } catch (err) {
        console.error(err);
      }
    } else {
      setTimeout(() => setScanStep(2), 1000);
    }
    
    setTimeout(() => setScanStep(3), 2000);
    
    await scanAgent(registryIdInput, address);
    
    if (registryIdInput && onNavigateToProfile) {
       onNavigateToProfile(registryIdInput);
    }

    setIsScanning(false);
    setScanStep(0);
    setRegistryIdInput('');
    setAddress('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Agent Vulnerability Scanner</h2>
        <p className="text-slate-400 text-lg">Input an ERC-8004 Registry ID or Contract Address to execute an automated security audit.</p>
      </div>

      <div className="bg-slate-900/40 p-8 rounded-3xl border border-indigo-500/20 relative overflow-hidden shadow-[0_0_40px_rgba(79,70,229,0.05)]">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Cpu size={240} />
        </div>
        
        <form onSubmit={handleScan} className="space-y-6 relative z-10 max-w-2xl">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">ERC-8004 Registry ID</label>
              <input 
                type="text" 
                value={registryIdInput}
                onChange={(e) => setRegistryIdInput(e.target.value)}
                disabled={isScanning}
                className="w-full bg-[#020617] border border-slate-800/80 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono placeholder-slate-700 focus:bg-slate-900/50 disabled:opacity-50"
                placeholder="e.g. 1042"
              />
              {parsedTokenId !== undefined && (
                <div className="text-xs mt-2 pl-1 font-mono text-slate-400 opacity-80">
                  {isContractLoading ? 'Reading mainnet...' : owner ? `Owner: ${owner.slice(0,6)}...${owner.slice(-4)}` : 'On-chain lookup ready'}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Contract / Wallet Address</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isScanning}
                className="w-full bg-[#020617] border border-slate-800/80 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono placeholder-slate-700 focus:bg-slate-900/50 disabled:opacity-50"
                placeholder="0x..."
              />
            </div>
          </div>

          <div className="p-5 bg-[#020617]/50 rounded-xl border border-slate-800/50 flex gap-4">
            <div className="text-indigo-400"><ShieldAlert size={20} /></div>
            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-1">Testing Vectors Enabled:</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-mono">
                [x] Prompt Injection (jailbreak)<br/>
                [x] Unbounded Contract Allowances<br/>
                [x] Identity Spoofing (ERC-8004 Metadata)<br/>
                [x] On-chain PII Leakage
              </p>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={(!registryIdInput && !address) || isScanning}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_30px_rgba(79,70,229,0.5)] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {isScanning ? (
              <span className="flex items-center gap-2"><ScanSearch size={20} className="animate-spin" /> EXECUTING SCAN...</span>
            ) : (
              <><ScanSearch size={20} /> INITIATE AUDIT</>
            )}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#020617] border border-slate-800 rounded-2xl p-6 font-mono text-sm overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-4 text-indigo-400 font-bold border-b border-slate-800 pb-3">
               <Fingerprint size={16} /> AUDIT LOGS
            </div>
            <div className="space-y-2 text-slate-400 text-xs">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span> Resolving metadata for target...
              </motion.div>
              {scanStep >= 1 && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span> Connected. Probing behavior constraints.
                </motion.div>
              )}
              {scanStep >= 2 && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span> Analyzing transaction history for anomalous allowance patterns.
                </motion.div>
              )}
              {scanStep >= 3 && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span> Executing adversarial prompt payload array...
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
