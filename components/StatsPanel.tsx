
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { SimulationStep } from '../types';

interface StatsPanelProps {
  history: SimulationStep[];
  currentStep: SimulationStep | null;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ history, currentStep }) => {
  // Take last 20 steps for realtime feel
  const data = history.slice(-30);

  if (!currentStep) return <div className="w-80 h-full bg-story-dark border-l border-white/10 p-4">Loading...</div>;

  return (
    <div className="w-96 h-full bg-[#0f0f13] border-l border-white/10 flex flex-col overflow-y-auto">
       <div className="p-4 border-b border-white/10">
          <h3 className="text-story-gold font-serif text-sm uppercase tracking-widest mb-4">RL Metrics</h3>
          
          {/* Cumulative Reward Chart */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-1">Cumulative Reward</p>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={data}>
                    <defs>
                    <linearGradient id="colorReward" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1f1f2e', border: 'none', fontSize: '12px' }} 
                        itemStyle={{ color: '#10b981' }}
                    />
                    <Area type="monotone" dataKey="cumulativeReward" stroke="#10b981" fillOpacity={1} fill="url(#colorReward)" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>

          {/* Epsilon / Exploration Chart */}
           <div className="mb-6">
            <p className="text-xs text-gray-500 mb-1">Policy Epsilon (Exploration)</p>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <YAxis hide domain={[0, 1]} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1f1f2e', border: 'none', fontSize: '12px' }} 
                    />
                    <Line type="step" dataKey="epsilon" stroke="#8b5cf6" dot={false} strokeWidth={2} />
                </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
       </div>

       <div className="p-4 flex-1">
          <h3 className="text-story-gold font-serif text-sm uppercase tracking-widest mb-4">Agent State Vector</h3>
          <div className="space-y-3 font-mono text-xs">
             <div className="flex justify-between p-2 bg-white/5 rounded">
                <span className="text-gray-400">Emotional Valence</span>
                <span className={currentStep.emotionalState.valence > 0 ? 'text-green-400' : 'text-red-400'}>
                   {currentStep.emotionalState.valence.toFixed(3)}
                </span>
             </div>
             <div className="flex justify-between p-2 bg-white/5 rounded">
                <span className="text-gray-400">Emotional Arousal</span>
                <span className="text-blue-400">
                   {currentStep.emotionalState.arousal.toFixed(3)}
                </span>
             </div>
             <div className="flex justify-between p-2 bg-white/5 rounded">
                <span className="text-gray-400">World Stability</span>
                <span className="text-yellow-400">
                   {currentStep.worldStability.toFixed(1)}%
                </span>
             </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4">
             <h4 className="text-xs text-gray-500 uppercase mb-2">Last Action</h4>
             <div className="p-3 border border-white/20 rounded bg-black/20 text-sm text-white">
                {currentStep.action}
             </div>
          </div>
       </div>
    </div>
  );
};

export default StatsPanel;
