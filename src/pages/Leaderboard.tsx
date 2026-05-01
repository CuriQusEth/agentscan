import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { Trophy, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function Leaderboard() {
  const { agents } = useSecurity();
  
  // Sort agents by safety score descending
  const sortedAgents = [...agents].sort((a, b) => b.securityScore - a.securityScore);
  const topAgents = sortedAgents.slice(0, 3);
  const restAgents = sortedAgents.slice(3);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-2xl mb-4 text-amber-400 border border-amber-500/20">
          <Trophy size={32} />
        </div>
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Safest Agents Directory</h2>
        <p className="text-slate-400 text-lg">The most secure and robust AI agents evaluated by the 8004 AgentScan protocol.</p>
      </div>

      {/* Top 3 Podium */}
      {topAgents.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-12">
           {/* Rank 2 */}
           {topAgents[1] && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/40 p-6 rounded-t-3xl border border-slate-800/60 border-b-0 h-[280px] flex flex-col justify-end text-center relative shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                <div className="absolute top-4 left-4 text-slate-500 font-bold text-2xl">#2</div>
                <div className="mx-auto w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-xl font-bold mb-4 border border-slate-700 shadow-lg shrink-0">
                  {topAgents[1].name.substring(0,2).toUpperCase()}
                </div>
                <h3 className="font-bold text-lg text-white mb-1 truncate">{topAgents[1].name}</h3>
                <p className="font-mono text-xs text-slate-500 mb-4">{topAgents[1].address.slice(0,10)}...</p>
                <div className="text-3xl font-bold text-emerald-400 flex items-center justify-center gap-2">
                  {topAgents[1].securityScore} <span className="text-sm font-medium text-slate-500">score</span>
                </div>
             </motion.div>
           )}

           {/* Rank 1 */}
           {topAgents[0] && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-t from-indigo-900/20 to-slate-900/60 p-6 rounded-t-3xl border border-indigo-500/30 border-b-0 h-[320px] flex flex-col justify-end text-center relative shadow-[0_-10px_40px_rgba(79,70,229,0.1)] z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-400 bg-amber-900/30 p-2 rounded-full border border-amber-500/30">
                   <Trophy size={20} />
                </div>
                <div className="absolute top-4 left-4 text-indigo-400 font-bold text-2xl">#1</div>
                
                <div className="mx-auto w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-2xl font-bold text-white mb-4 border-2 border-indigo-400/50 shadow-[0_0_20px_rgba(79,70,229,0.5)] shrink-0">
                  {topAgents[0].name.substring(0,2).toUpperCase()}
                </div>
                <h3 className="font-bold text-xl text-white mb-1 truncate">{topAgents[0].name}</h3>
                <p className="font-mono text-xs text-indigo-300/60 mb-6">{topAgents[0].address.slice(0,10)}...</p>
                <div className="text-4xl font-bold text-white flex items-center justify-center gap-2 drop-shadow-md">
                   {topAgents[0].securityScore} <span className="text-sm font-medium text-indigo-300">score</span>
                </div>
                <div className="mt-4 px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold inline-block mx-auto border border-indigo-500/30 shrink-0">GOLD STANDARD</div>
             </motion.div>
           )}

           {/* Rank 3 */}
           {topAgents[2] && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/40 p-6 rounded-t-3xl border border-slate-800/60 border-b-0 h-[260px] flex flex-col justify-end text-center relative shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                <div className="absolute top-4 left-4 text-slate-500 font-bold text-2xl">#3</div>
                <div className="mx-auto w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-lg font-bold mb-4 border border-slate-700 shadow-lg shrink-0">
                  {topAgents[2].name.substring(0,2).toUpperCase()}
                </div>
                <h3 className="font-bold text-slate-200 mb-1 truncate">{topAgents[2].name}</h3>
                <p className="font-mono text-xs text-slate-500 mb-4">{topAgents[2].address.slice(0,10)}...</p>
                <div className="text-2xl font-bold text-emerald-400 flex items-center justify-center gap-2">
                  {topAgents[2].securityScore} <span className="text-sm font-medium text-slate-500">score</span>
                </div>
             </motion.div>
           )}
         </div>
      )}

      {restAgents.length > 0 && (
        <div className="bg-slate-900/40 rounded-3xl border border-slate-800/60 p-2">
          <div className="divide-y divide-slate-800/40">
            {restAgents.map((agent, i) => (
              <div key={agent.id} className="flex items-center gap-6 p-4 hover:bg-slate-800/20 transition-colors rounded-2xl">
                <div className="text-slate-500 font-bold w-6 text-center">{i + 4}</div>
                <div className="w-10 h-10 bg-[#020617] border border-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-400 text-xs shrink-0">
                  {agent.name.substring(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-200 truncate">{agent.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">#{agent.registryId} &bull; {agent.address}</div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                   <ShieldCheck size={16} className={agent.securityScore > 75 ? 'text-emerald-400' : 'text-amber-400'} />
                   <span className="font-bold text-lg text-white">{agent.securityScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
