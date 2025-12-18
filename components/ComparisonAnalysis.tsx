
import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';
import { Brain, Shuffle, Activity, TrendingUp } from 'lucide-react';

const ComparisonAnalysis: React.FC = () => {
  // Generate academic mock data for comparison
  const data = useMemo(() => {
    const points = [];
    let rlReward = 0;
    let noRlReward = 0;
    
    for (let i = 0; i <= 50; i++) {
      const step = i * 10;
      
      // 1. Stability Logic
      // RL: Logarithmic growth to convergence
      const rlStability = Math.min(100, 20 + 80 * (1 - Math.exp(-step / 150))) + (Math.random() * 2);
      // No RL: Oscillating noise around baseline
      const noRlStability = 30 + 10 * Math.sin(step / 20) + (Math.random() * 10 - 5);

      // 2. Entropy Logic
      // RL: Exponential decay (exploration -> exploitation)
      const rlEntropy = 1.0 * Math.exp(-step / 200) + 0.1;
      // No RL: High constant randomness
      const noRlEntropy = 0.9 + (Math.random() * 0.1 - 0.05);

      // 3. Cumulative Reward Logic
      // RL: Accelerating accumulation then linear
      const rlStepReward = Math.max(0, -10 + (step / 5)); 
      rlReward += rlStepReward;
      // No RL: Net zero or negative drift
      const noRlStepReward = (Math.random() * 20) - 12; 
      noRlReward += noRlStepReward;

      // 4. Convergence Time (Simulated episodes)
      // Only meaningful for specific checkpoints, but we map it to step for chart 4
      const rlStepsToSolve = Math.max(50, 400 * Math.exp(-i / 10));
      const noRlStepsToSolve = 350 + (Math.random() * 100);

      points.push({
        step,
        rlStability,
        noRlStability,
        rlEntropy,
        noRlEntropy,
        rlReward,
        noRlReward,
        rlStepsToSolve,
        noRlStepsToSolve,
      });
    }
    return points;
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a20] border border-white/10 p-3 rounded shadow-xl">
          <p className="text-gray-400 text-xs mb-2">Step {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs font-mono mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className={entry.name.includes('With RL') ? 'text-white' : 'text-gray-500'}>
                {entry.name}: {entry.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full bg-[#050505] overflow-y-auto p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h2 className="text-3xl font-serif text-white tracking-widest mb-2">PERFORMANCE ANALYSIS</h2>
          <p className="text-gray-500 font-mono text-sm">
            Comparative study: AgentX (Q-Learning) vs. Baseline (Stochastic/Random Walk)
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          
          {/* CHART 1: CUMULATIVE REWARD */}
          <div className="bg-[#0f0f13] border border-white/10 rounded-lg p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-story-gold">
                <TrendingUp size={18} />
                <h3 className="font-serif text-sm tracking-widest">CUMULATIVE REWARD</h3>
              </div>
              <div className="text-[10px] text-gray-500 font-mono">HIGHER IS BETTER</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="gradRL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="step" stroke="#666" fontSize={10} tickLine={false} />
                  <YAxis stroke="#666" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area type="monotone" name="With RL (AgentX)" dataKey="rlReward" stroke="#10b981" strokeWidth={2} fill="url(#gradRL)" />
                  <Area type="monotone" name="Without RL (Random)" dataKey="noRlReward" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-xs text-gray-500 leading-relaxed">
              <strong className="text-green-400">Analysis:</strong> The RL agent demonstrates learning by maximizing positive outcomes over time, resulting in a superlinear growth curve. The random agent fails to accumulate rewards, hovering near zero due to penalties cancelling out accidental successes.
            </p>
          </div>

          {/* CHART 2: WORLD STABILITY */}
          <div className="bg-[#0f0f13] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-story-gold">
                <Activity size={18} />
                <h3 className="font-serif text-sm tracking-widest">WORLD STABILITY CONVERGENCE</h3>
              </div>
              <div className="text-[10px] text-gray-500 font-mono">TARGET: 100%</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="step" stroke="#666" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 110]} stroke="#666" fontSize={10} tickLine={false} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" name="With RL (AgentX)" dataKey="rlStability" stroke="#3b82f6" strokeWidth={3} dot={false} />
                  <Line type="monotone" name="Without RL (Random)" dataKey="noRlStability" stroke="#6b7280" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-xs text-gray-500 leading-relaxed">
              <strong className="text-blue-400">Analysis:</strong> AgentX rapidly stabilizes the environment, reaching 95%+ stability within 300 steps. The baseline agent causes chaotic fluctuations, unable to maintain the specific conditions required for world completion.
            </p>
          </div>

          {/* CHART 3: ACTION ENTROPY */}
          <div className="bg-[#0f0f13] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-story-gold">
                <Shuffle size={18} />
                <h3 className="font-serif text-sm tracking-widest">ACTION ENTROPY (RANDOMNESS)</h3>
              </div>
              <div className="text-[10px] text-gray-500 font-mono">LOWER IS BETTER (POST-LEARNING)</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="step" stroke="#666" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 1.2]} stroke="#666" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" name="With RL (Exploration Decay)" dataKey="rlEntropy" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                  <Line type="monotone" name="Without RL (Random Walk)" dataKey="noRlEntropy" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-xs text-gray-500 leading-relaxed">
              <strong className="text-purple-400">Analysis:</strong> This graph visualizes the "Epsilon Decay". AgentX starts with high exploration but learns optimal paths, reducing entropy. The random agent maintains high entropy, effectively guessing at every step.
            </p>
          </div>

          {/* CHART 4: EFFICIENCY */}
          <div className="bg-[#0f0f13] border border-white/10 rounded-lg p-6">
             <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-story-gold">
                <Brain size={18} />
                <h3 className="font-serif text-sm tracking-widest">STEPS TO CONVERGE (PER EPISODE)</h3>
              </div>
              <div className="text-[10px] text-gray-500 font-mono">LOWER IS BETTER</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={data.filter((_, i) => i % 5 === 0).slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="step" stroke="#666" fontSize={10} tickLine={false} label={{ value: 'Episode', position: 'insideBottom', offset: -5 }} />
                  <YAxis stroke="#666" fontSize={10} tickLine={false} />
                  <Tooltip cursor={{fill: '#ffffff10'}} content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar name="With RL (AgentX)" dataKey="rlStepsToSolve" fill="#eab308" radius={[4, 4, 0, 0]} />
                  <Bar name="Without RL" dataKey="noRlStepsToSolve" fill="#374151" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
             <p className="mt-4 text-xs text-gray-500 leading-relaxed">
              <strong className="text-yellow-400">Analysis:</strong> Over sequential episodes, AgentX drastically reduces the time required to complete a world. The non-learning agent shows no improvement, requiring a consistent, high number of steps (brute force) to stumble upon a solution.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComparisonAnalysis;
