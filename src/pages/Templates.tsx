import React from 'react';
import { Bot, LineChart, MessageCircle, Code2, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { useAgents } from '../context/AgentContext';

const templates = [
  { id: '1', name: 'DeFi Trading Agent', description: 'Monitor token pairs on Uniswap and execute trades when conditions hit.', icon: <LineChart className="text-emerald-400" size={28} />, prompt: 'You are a DeFi trading bot. Monitor the provided pair addresses and execute trades when the RSI is below 30. Use 0.1 ETH per trade max.' },
  { id: '2', name: 'Base Social Influencer', description: 'Replies to threads related to Base network and AI.', icon: <MessageCircle className="text-blue-400" size={28} />, prompt: 'You manage a Twitter account. Reply to top tweets about Base, AI agents, and Ethereum with insightful, slightly witty comments. Never give financial advice.' },
  { id: '3', name: 'Smart Contract Auditor', description: 'Analyzes Solidity code provided in prompts for vulnerabilities.', icon: <Code2 className="text-purple-400" size={28} />, prompt: 'You are an expert Solidity auditor. Analyze the provided smart contracts for reentrancy, overflow, and logic vulnerabilities. Output findings in Markdown.' },
];

export default function Templates() {
  const { addAgent } = useAgents();
  const [added, setAdded] = React.useState<string | null>(null);

  const handleUseTemplate = (t: typeof templates[0]) => {
    addAgent({
      name: t.name,
      systemPrompt: t.prompt,
    });
    setAdded(t.id);
    setTimeout(() => setAdded(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3 tracking-tight"><Bot className="text-blue-500" size={32} /> Template Marketplace</h2>
        <p className="text-slate-400 text-lg">Jumpstart your agent creation with pre-configured, production-ready templates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {templates.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex flex-col p-8 bg-slate-900/40 border border-slate-800/60 rounded-3xl hover:bg-slate-800/30 transition-all group shadow-lg">
            <div className="p-4 bg-[#020617] rounded-2xl w-fit mb-6 border border-slate-800/80 group-hover:scale-110 transition-transform">
              {t.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{t.name}</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 flex-1">{t.description}</p>
            
            <button
              onClick={() => handleUseTemplate(t)}
              disabled={added === t.id}
              className={`w-full py-3.5 rounded-full text-sm font-bold transition-transform active:scale-95 flex items-center justify-center gap-2 ${added === t.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 scale-100 cursor-default' : 'bg-white text-black hover:bg-slate-200 shadow-md disabled:opacity-50'}`}
            >
              {added === t.id ? 'Added to Builder!' : <><Download size={18} /> Use Template</>}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
