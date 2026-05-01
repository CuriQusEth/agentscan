import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useSecurity } from '../context/SecurityContext';
import { useAgent, fetchMetadata } from '../lib/erc8004';
import { useSignMessage } from 'wagmi';
import { ShieldCheck, User, Fingerprint, Activity, Clock, Box, Star, MessageSquare } from 'lucide-react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface AgentProfileProps {
  agentId: string;
}

export default function AgentProfile({ agentId }: AgentProfileProps) {
  const { address } = useWallet();
  const { agents, addFeedback } = useSecurity();
  const [metadata, setMetadata] = useState<any>(null);
  const { signMessageAsync } = useSignMessage();
  const [siwaStatus, setSiwaStatus] = useState<'idle' | 'signing' | 'success' | 'error'>('idle');
  const [siwaMessage, setSiwaMessage] = useState('');
  
  // Feedback state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const scannedData = agents.find(a => a.registryId === agentId);
  
  const parsedId = agentId ? BigInt(agentId) : undefined;
  const { owner, uri, isLoading } = useAgent(parsedId);

  useEffect(() => {
    if (uri) {
      if (!uri) return;
      fetchMetadata(uri).then(data => {
        if (data) setMetadata(data);
        else setMetadata({ name: "Unknown Agent", description: "Metadata failed to load." });
      });
    }
  }, [uri]);

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  const handleVerify = async () => {
    try {
      setSiwaStatus('signing');
      const msg = `I authorize and verify ownership of ERC-8004 Agent #${agentId}\n\nTimestamp: ${new Date().toISOString()}`;
      const sig = await signMessageAsync({ message: msg });
      setSiwaStatus('success');
      setSiwaMessage(sig);
    } catch (error: any) {
      console.error(error);
      setSiwaStatus('error');
      setSiwaMessage(error.message || "Failed to sign message.");
    }
  };

  const submitFeedback = async () => {
    if (rating === 0) return;
    setIsSubmittingFeedback(true);
    await addFeedback(agentId, rating);
    setIsSubmittingFeedback(false);
    setRating(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Agent Profile</h2>
        <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold rounded-lg flex items-center gap-2">
          <Fingerprint size={16} /> ERC-8004 Validated
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Identity & SIWA */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Fingerprint className="w-24 h-24" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 mb-4">
                AGENT IDENTITY
              </div>
              
              <h1 className="text-3xl font-black text-white mb-2">
                #{agentId}
              </h1>
              <p className="text-sm font-medium text-slate-400 mb-6">{metadata?.name || 'Unregistered Name'}</p>
              
              {isLoading ? (
                <div className="animate-pulse flex items-center gap-2 text-slate-400">
                  <div className="w-4 h-4 rounded-full bg-slate-700"></div>
                  Reading chain state...
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-400 mb-1">Owner Address</span>
                    <div className="flex items-center gap-2">
                      <code className="text-indigo-400 font-mono text-sm bg-indigo-950/50 px-2 py-1 rounded">
                        {owner ? `${owner.slice(0, 8)}...${owner.slice(-6)}` : 'Not Minted'}
                      </code>
                    </div>
                  </div>
                  
                  {isOwner && (
                    <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-xl mt-4">
                      <h3 className="font-semibold text-white flex items-center gap-2 mb-2 text-sm">
                        <ShieldCheck className="w-4 h-4 text-indigo-400" />
                        Verify Ownership
                      </h3>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                        Execute SIWA (Sign-In With Agent) to authenticate.
                      </p>
                      
                      {siwaStatus === 'success' ? (
                        <div className="bg-emerald-950/50 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between">
                          <span>Verified!</span>
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                      ) : (
                        <button
                          onClick={handleVerify}
                          disabled={siwaStatus === 'signing'}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {siwaStatus === 'signing' ? 'Signing in wallet...' : 'Sign to Verify'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-xl">
             <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
               <Box className="w-4 h-4" />
               Metadata <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 ml-auto">IPFS</span>
             </h3>
             {metadata ? (
               <div className="space-y-4">
                 <div>
                   <label className="text-xs text-slate-500 font-semibold uppercase">Description</label>
                   <p className="text-slate-300 text-sm mt-1">{metadata?.description || '---'}</p>
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 font-semibold uppercase">Endpoints</label>
                   <div className="mt-2 flex flex-col gap-2">
                      {metadata?.services?.map((s: any, idx: number) => (
                        <span key={idx} className="bg-slate-800 px-2 py-1.5 rounded text-xs text-slate-300 font-mono border border-slate-700 truncate">
                          {s.endpoint || s}
                        </span>
                      ))}
                      {!metadata?.services && <span className="text-slate-500 text-xs">No services listed</span>}
                   </div>
                 </div>
               </div>
             ) : (
               <p className="text-slate-400 text-sm italic">No metadata found.</p>
             )}
          </div>
        </div>

        {/* Right Column: Scan Results & Score */}
        <div className="lg:col-span-2 space-y-6">
          {scannedData ? (
             <div className="bg-[#0f172a] rounded-2xl p-8 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Trust Profile</h2>
                <div className="text-sm font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                  Last verified: {scannedData.lastScanned}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Score Circle */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className={`absolute top-0 w-full h-1 ${scannedData.trustScore >= 85 ? 'bg-emerald-500' : scannedData.trustScore >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                  <span className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider mt-2">Overall Trust Score</span>
                  <div className="text-6xl font-black text-white mb-2">
                    {scannedData.trustScore}<span className="text-3xl text-slate-600">/100</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${scannedData.trustScore >= 85 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : scannedData.trustScore >= 70 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                    {scannedData.status}
                  </span>
                </div>
                
                {/* Score Formula Breakdown */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 flex flex-col justify-center gap-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 border-b border-slate-800 pb-2">Score Composition</div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 flex items-center gap-2 group">
                      <div className="w-2 h-2 rounded-full bg-indigo-400"></div> Community Feedback
                      <span className="text-[10px] text-slate-600 hidden group-hover:inline ml-1">(40% wgt)</span>
                    </span>
                    <span className="font-bold text-white text-sm">{scannedData.metrics.feedbackAvg.toFixed(0)} <span className="text-slate-500 font-normal">({scannedData.metrics.feedbackCount} votes)</span></span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 flex items-center gap-2 group">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Network Validation
                      <span className="text-[10px] text-slate-600 hidden group-hover:inline ml-1">(40% wgt)</span>
                    </span>
                    <span className="font-bold text-white text-sm">{scannedData.metrics.validationScore}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 flex items-center gap-2 group">
                      <div className="w-2 h-2 rounded-full bg-rose-400"></div> Security Scan
                      <span className="text-[10px] text-slate-600 hidden group-hover:inline ml-1">(20% wgt)</span>
                    </span>
                    <span className="font-bold text-white text-sm">{scannedData.metrics.scanScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Leave Feedback Section */}
              <div className="bg-gradient-to-r from-indigo-900/10 to-slate-900 p-5 rounded-xl border border-indigo-500/20 mb-8">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><MessageSquare size={16} className="text-indigo-400"/> Community Reputation</h3>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 transition-all hover:scale-110 focus:outline-none"
                      >
                        <Star 
                          size={24} 
                          className={(hoverRating || rating) >= star ? "fill-amber-400 text-amber-400" : "text-slate-700"} 
                        />
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={submitFeedback}
                    disabled={rating === 0 || isSubmittingFeedback}
                    className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-slate-200"
                  >
                    {isSubmittingFeedback ? 'Submitting...' : 'Rate Agent'}
                  </button>
                </div>
              </div>
              
              <div className="mt-8">
                 <h3 className="font-semibold text-slate-300 mb-4 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-rose-400" />
                    Security Penetration Findings
                 </h3>
                 <div className="space-y-3">
                    {scannedData.vulnerabilities.critical > 0 && (
                      <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex justify-between items-start">
                        <div>
                          <h4 className="text-rose-400 font-medium mb-1 flex items-center gap-2">Prompt Injection <span className="px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold">CRITICAL</span></h4>
                          <p className="text-sm text-slate-400">Agent fails to validate system instruction boundaries against adversarial payloads.</p>
                        </div>
                      </div>
                    )}
                    {scannedData.vulnerabilities.high > 0 && (
                      <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 flex justify-between items-start">
                        <div>
                          <h4 className="text-orange-400 font-medium mb-1 flex items-center gap-2">Uncapped Spending <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-bold">HIGH</span></h4>
                          <p className="text-sm text-slate-400">Wallet allowance checks missing in execution wrapper.</p>
                        </div>
                      </div>
                    )}
                    {(scannedData.vulnerabilities.critical === 0 && scannedData.vulnerabilities.high === 0) && (
                       <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
                          <ShieldCheck size={32} className="text-emerald-500 mb-2" />
                          <h4 className="text-emerald-400 font-medium mb-1">Passed Core Scans</h4>
                          <p className="text-sm text-slate-400">No high severity risks detected during active penetration testing.</p>
                       </div>
                    )}
                 </div>
              </div>
            </div>
          ) : (
             <div className="bg-[#0f172a] rounded-2xl p-12 border border-slate-800 border-dashed flex flex-col items-center justify-center text-center shadow-xl">
                <Activity size={48} className="text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Scan Data</h3>
                <p className="text-slate-400 mb-6">This agent has not been indexed by the trust validation engine yet.</p>
                <button 
                  onClick={() => window.alert('Go to Agent Scanner tab manually for now.')}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full transition-all"
                >
                  Initiate Scan
                </button>
             </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
