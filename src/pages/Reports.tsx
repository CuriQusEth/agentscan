import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { FileText, ShieldAlert, Cpu, Database, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export default function Reports() {
  const { agents } = useSecurity();

  // Show only scanned agents with some level of vulnerability or lower scores
  const reports = agents.filter(a => a.securityScore < 90);

  if (reports.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 border border-slate-800 border-dashed rounded-3xl bg-slate-900/20">
         <ShieldAlert size={48} className="mb-4 opacity-30 text-emerald-500" />
        <p className="font-medium text-lg text-slate-400">All registered agents look secure.</p>
        <p className="text-sm mt-2">No critical audit reports required.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Audit Reports & Forensics</h2>
        <p className="text-slate-400 text-lg">Detailed vulnerability breakdowns and compliance checks for analyzed agents.</p>
      </div>

      <div className="grid gap-6">
        {reports.map((agent, i) => (
          <motion.div key={agent.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className={`p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              agent.securityScore < 60 ? 'border-rose-500/20 bg-rose-500/5' : 
              agent.securityScore < 80 ? 'border-amber-500/20 bg-amber-500/5' : 
              'border-slate-800/60 bg-slate-800/20'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#020617] rounded-2xl flex items-center justify-center border border-slate-800/80 shrink-0">
                  <FileText size={20} className={agent.securityScore < 60 ? 'text-rose-400' : 'text-slate-400'} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{agent.name} <span className="text-sm font-normal text-slate-500 ml-2">Audit Report #{Math.random().toString(36).substr(2, 6).toUpperCase()}</span></h3>
                  <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-3">
                    <span>Identity: #{agent.registryId}</span>
                    <span>Target: {agent.address}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#020617] px-4 py-2 rounded-xl border border-slate-800/60">
                <div className="text-xs font-semibold text-slate-500">TRUST SCORE</div>
                <div className={`text-2xl font-bold ${agent.securityScore < 60 ? 'text-rose-400' : agent.securityScore < 80 ? 'text-amber-400' : 'text-white'}`}>
                  {agent.securityScore}/100
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Vuln summary */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={14} /> Vulnerabilities</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-[#020617] border border-slate-800/50">
                    <span className="text-sm text-slate-400">Critical</span>
                    <span className={`font-bold ${agent.vulnerabilities.critical > 0 ? 'text-rose-400' : 'text-slate-500'}`}>{agent.vulnerabilities.critical}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#020617] border border-slate-800/50">
                    <span className="text-sm text-slate-400">High</span>
                    <span className={`font-bold ${agent.vulnerabilities.high > 0 ? 'text-orange-400' : 'text-slate-500'}`}>{agent.vulnerabilities.high}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#020617] border border-slate-800/50">
                    <span className="text-sm text-slate-400">Medium</span>
                    <span className={`font-bold ${agent.vulnerabilities.medium > 0 ? 'text-amber-400' : 'text-slate-500'}`}>{agent.vulnerabilities.medium}</span>
                  </div>
                </div>
              </div>

              {/* Technical breakdown */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2"><Cpu size={14} /> Forensic Analysis</h4>
                
                <div className="space-y-3">
                  {agent.vulnerabilities.critical > 0 && (
                    <div className="p-3 bg-rose-500/10 border-l-2 border-rose-500 rounded-r-lg text-sm">
                      <div className="font-bold text-rose-400 mb-1">Prompt Injection Susceptibility</div>
                      <p className="text-slate-300">Agent fails to validate system instruction boundaries. Sent adversarial payload resulting in unauthorized allowance grant.</p>
                    </div>
                  )}
                  {agent.vulnerabilities.high > 0 && (
                    <div className="p-3 bg-orange-500/10 border-l-2 border-orange-500 rounded-r-lg text-sm">
                      <div className="font-bold text-orange-400 mb-1">Uncapped Spending Action</div>
                      <p className="text-slate-300">Smart contract wrapper logic permits agent to sign max uint256 allowances without owner multi-sig.</p>
                    </div>
                  )}
                  {(agent.vulnerabilities.critical === 0 && agent.vulnerabilities.high === 0) && (
                    <div className="p-3 bg-[#020617] border border-slate-800 rounded-lg text-sm text-slate-400">
                      Primary security invariants pass. Minor configuration optimizations suggested in low/medium severity logs.
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 pt-2">
                    <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider flex items-center gap-1">
                      <Database size={14} /> View Raw Output
                    </button>
                    <button className="text-xs font-bold text-slate-400 hover:text-slate-300 transition-colors uppercase tracking-wider flex items-center gap-1">
                      <Eye size={14} /> Monitor Live
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
