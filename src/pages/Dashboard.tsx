import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { useWallet } from '../context/WalletContext';
import { Activity, ShieldCheck, Bug, TriangleAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { agents } = useSecurity();
  const { address } = useWallet();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Safe': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Critical': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const avgScore = agents.length > 0 
    ? Math.round(agents.reduce((acc, a) => acc + a.securityScore, 0) / agents.length)
    : 0;
    
  const criticalVulns = agents.reduce((acc, a) => acc + a.vulnerabilities.critical, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800/60">
          <p className="text-slate-500 text-sm mb-1 flex items-center gap-2"><Activity size={14} /> Total Scans</p>
          <p className="text-3xl font-bold text-white">{agents.length}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800/60 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/10 blur-2xl rounded-full"></div>
          <p className="text-rose-400 text-sm mb-1 font-medium flex items-center gap-2 relative z-10"><TriangleAlert size={14} /> Critical Risks</p>
          <p className="text-3xl font-bold text-white relative z-10">{criticalVulns}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800/60 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full"></div>
          <p className="text-slate-500 text-sm mb-1 flex items-center gap-2 relative z-10"><ShieldCheck size={14} /> Global Avg Score</p>
          <p className="text-3xl font-bold text-indigo-400 relative z-10">{avgScore}/100</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800/60">
          <p className="text-slate-500 text-sm mb-1 flex items-center gap-2"><Bug size={14} /> Rules Detected</p>
          <p className="text-3xl font-bold text-slate-300">42</p>
        </motion.div>
      </div>

      <div className="bg-slate-900/40 rounded-3xl border border-slate-800/60 flex flex-col p-6 shadow-xl">
        <div className="pb-4 mb-4 border-b border-slate-800/60 flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">Recent Scanned Operations</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-slate-800/50 rounded-full text-[10px] uppercase font-bold text-slate-400 border border-slate-700/50">Filter: All</span>
          </div>
        </div>
        
        {agents.length === 0 ? (
          <div className="p-12 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-800/20">
            <ShieldCheck size={40} className="mb-4 opacity-50 text-indigo-400" />
            <p className="font-medium text-lg text-slate-300">No agents scanned yet.</p>
            <p className="text-sm mt-1 mb-4">Go to the Scanner to audit your first ERC-8004 agent.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800/40">
                  <th className="px-4 py-4 font-bold">Registry ID</th>
                  <th className="px-4 py-4 font-bold">Agent Name</th>
                  <th className="px-4 py-4 font-bold">Trust Score</th>
                  <th className="px-4 py-4 font-bold text-center">Status</th>
                  <th className="px-4 py-4 font-bold">Last Scanned</th>
                  <th className="px-4 py-4 font-bold text-right">Vulns</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-800/40">
                {agents.map((agent, i) => (
                  <motion.tr 
                    key={agent.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-800/20 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-4">
                      <span className="font-mono text-slate-400 text-xs">#{agent.registryId}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-200 group-hover:text-indigo-400 transition-colors">{agent.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{agent.address}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${agent.securityScore >= 85 ? 'bg-emerald-500' : agent.securityScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${agent.securityScore}%` }}
                          ></div>
                        </div>
                        <span className={`font-bold ${agent.securityScore >= 85 ? 'text-emerald-400' : agent.securityScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{agent.securityScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2.5 py-1 text-[10px] rounded-md font-bold uppercase tracking-wider border ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs">{agent.lastScanned}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {agent.vulnerabilities.critical > 0 && <span className="w-5 h-5 flex items-center justify-center bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-md" title="Critical">{agent.vulnerabilities.critical}</span>}
                        {agent.vulnerabilities.high > 0 && <span className="w-5 h-5 flex items-center justify-center bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded-md" title="High">{agent.vulnerabilities.high}</span>}
                        {agent.vulnerabilities.medium > 0 && <span className="w-5 h-5 flex items-center justify-center bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-md" title="Medium">{agent.vulnerabilities.medium}</span>}
                        {agent.vulnerabilities.low > 0 && <span className="w-5 h-5 flex items-center justify-center bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-md" title="Low">{agent.vulnerabilities.low}</span>}
                        {Object.values(agent.vulnerabilities).reduce((a,b)=>a+b,0) === 0 && <span className="w-5 h-5 flex items-center justify-center bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md"><ShieldCheck size={12}/></span>}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
