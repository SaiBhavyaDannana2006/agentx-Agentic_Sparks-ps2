import React, { useEffect, useState, useRef } from 'react';
import { AgentConfig, WorldId, SimulationStep } from '../types';
import WorldVisualizer from './WorldVisualizer';
import StatsPanel from './StatsPanel';
import ComparisonAnalysis from './ComparisonAnalysis';
import { generateSimulationStep, resetSimulation } from '../services/mockSimulation';
import { audioService } from '../services/audioEngine';
import { Terminal, Brain, Zap, Shield, Clock, Eye, CheckCircle, Gem, BarChart3 } from 'lucide-react';

interface SimulationDashboardProps {
  config: AgentConfig;
}

const WORLDS_ORDER = [
  WorldId.WORLD_1_FOREST,
  WorldId.WORLD_2_TIME,
  WorldId.WORLD_3_CREATURES,
  WorldId.WORLD_4_IMMUNITY,
  WorldId.WORLD_5_BLANK
];

const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ config }) => {
  const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
  const [history, setHistory] = useState<SimulationStep[]>([]);
  const [currentStep, setCurrentStep] = useState<SimulationStep | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnalysisMode, setIsAnalysisMode] = useState(false); // NEW STATE
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize simulation
  useEffect(() => {
    resetSimulation();
  }, []);

  // Update Audio on World Transition or Stability Change
  useEffect(() => {
      if (isFinished) return;
      
      const currentWorld = WORLDS_ORDER[currentWorldIndex];
      // 1. Play Theme for current World
      audioService.playWorldTheme(currentWorld);

      // 2. Modulate audio based on stability (specifically for World 5 fade out)
      if (currentStep) {
          audioService.updateAmbience(currentStep.worldStability);
      }
  }, [currentWorldIndex, currentStep, isFinished]);

  // Determine Pacing based on World Rules - FAST-MEDIUM SPEED (~5 Mins Total)
  // Target: ~1 min per world. ~200-250 steps.
  // Tick Rate ~150-200ms.
  const getTickRate = (worldId: WorldId, stability: number) => {
    switch(worldId) {
        case WorldId.WORLD_1_FOREST: 
            return 150; // Brisk pace
        case WorldId.WORLD_2_TIME: 
            return 180; // Slightly slower
        case WorldId.WORLD_3_CREATURES: 
            return 140; // Fast action
        case WorldId.WORLD_4_IMMUNITY: 
            return 120; // Very fast tactics
        case WorldId.WORLD_5_BLANK: 
            return 200; // Contemplative but quick
        default: 
            return 150;
    }
  };

  // Main Simulation Loop with Dynamic Pacing
  useEffect(() => {
    if (isFinished || isAnalysisMode) return; // Pause sim in analysis mode

    const runSimulationStep = () => {
        const currentWorld = WORLDS_ORDER[currentWorldIndex];
        const prevStability = currentStep ? currentStep.worldStability : 0;
        
        const newStep = generateSimulationStep(config, currentWorld, prevStability);
        
        setCurrentStep(newStep);
        setHistory(prev => [...prev.slice(-49), newStep]);

        // Logic for next step
        let nextTickDelay = getTickRate(currentWorld, newStep.worldStability);

        // Check for World Transition or Completion
        if (newStep.isConverged) {
            if (currentWorldIndex === WORLDS_ORDER.length - 1) {
                setIsFinished(true);
                return;
            } else {
                // Transition to next world
                setTimeout(() => {
                    setCurrentWorldIndex(prev => prev + 1);
                }, 1500); // 1.5 Second pause between worlds
                return; // Stop this loop instance, effect will re-trigger
            }
        }

        // Schedule next step
        timeoutRef.current = setTimeout(runSimulationStep, nextTickDelay);
    };

    // Start the loop
    runSimulationStep();

    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentWorldIndex, config, isFinished, isAnalysisMode]); // Added isAnalysisMode dependency

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const getWorldIcon = (id: WorldId) => {
      switch(id) {
          case WorldId.WORLD_1_FOREST: return <Eye size={16} />;
          case WorldId.WORLD_2_TIME: return <Clock size={16} />;
          case WorldId.WORLD_3_CREATURES: return <Brain size={16} />;
          case WorldId.WORLD_4_IMMUNITY: return <Shield size={16} />;
          default: return <Zap size={16} />;
      }
  };

  return (
    <div className="flex h-screen bg-story-dark text-white overflow-hidden font-sans animate-in fade-in duration-1000">
      
      {/* Left Sidebar: World Atlas */}
      <div className="w-72 bg-[#0a0a0f] border-r border-white/10 flex flex-col p-6 z-20 shadow-2xl shrink-0">
        <h2 className="text-xl font-serif font-bold text-story-gold mb-8 text-center tracking-widest">ATLAS</h2>
        <div className="space-y-4 relative pl-4">
             <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-gray-800 z-0"></div>
             
             {WORLDS_ORDER.map((world, index) => {
                 const isActive = index === currentWorldIndex;
                 const isPast = index < currentWorldIndex;
                 return (
                    <div key={world} className={`relative z-10 flex items-center gap-4 transition-all duration-500 ${isActive ? 'translate-x-2' : ''}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-500 ${isActive ? 'bg-story-gold border-story-gold text-black scale-110' : isPast ? 'bg-green-900 border-green-700 text-green-300' : 'bg-[#0a0a0f] border-gray-700 text-gray-700'}`}>
                            {getWorldIcon(world)}
                        </div>
                        <div className={`flex flex-col transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                            <span className="text-[10px] font-serif uppercase tracking-wider">{index + 1}. {world.split(' ').pop()}</span> 
                            {isActive && <span className="text-[9px] text-story-gold animate-pulse font-mono">Agent Active</span>}
                        </div>
                    </div>
                 );
             })}
        </div>
        
        <div className="mt-auto pt-6 border-t border-white/10">
           <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest">Observer Console</div>
           <div className="text-xs font-mono text-gray-400">ID: {config.name}</div>
           <div className="text-xs font-mono text-gray-500 mt-1">Mode: {config.genre}</div>
           <div className="text-xs font-mono text-gray-500 mt-1">Algorithm: Q-Learning</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#050505] relative min-w-0">
         
         {/* Top Bar */}
         <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#0a0a0f]/80 backdrop-blur z-10 shrink-0">
            <div className="flex flex-col">
               <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Current Persona</span>
               <div className="flex items-center gap-3">
                  <h1 className="text-xl font-serif font-bold text-white tracking-wider truncate">
                    {currentStep?.agentPersona || 'Initializing...'}
                  </h1>
                  {isFinished && <span className="text-green-400 text-xs font-mono border border-green-500 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle size={10} /> CONVERGED</span>}
               </div>
            </div>
            
            <div className="flex items-center gap-8">
                 {/* ANALYSIS TOGGLE BUTTON */}
                 <button 
                    onClick={() => setIsAnalysisMode(!isAnalysisMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded border transition-all ${isAnalysisMode ? 'bg-story-gold text-black border-story-gold' : 'bg-transparent text-gray-300 border-white/20 hover:bg-white/5'}`}
                 >
                     <BarChart3 size={16} />
                     <span className="text-xs font-bold uppercase tracking-wider">Analysis</span>
                 </button>

                {/* Diamond Counter */}
                <div className="text-right flex flex-col items-end">
                     <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Diamonds</span>
                     <div className="flex items-center gap-2 text-cyan-400 font-mono text-lg font-bold">
                        <Gem size={18} fill="currentColor" className="text-cyan-500/50" />
                        {currentStep?.diamonds || 0}
                     </div>
                </div>

                {/* Score Counter */}
                <div className="text-right">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Total Score</span>
                    <span className={`text-2xl font-mono font-bold ${currentStep?.cumulativeReward && currentStep.cumulativeReward > 0 ? 'text-story-gold' : 'text-red-400'}`}>
                        {currentStep?.cumulativeReward || 0}
                    </span>
                </div>
            </div>
         </div>

         {/* Visualizer Area OR Analysis Area */}
         <div className="flex-1 p-4 overflow-hidden relative">
            {isAnalysisMode ? (
                <div className="w-full h-full bg-[#0a0a0f] border border-white/10 rounded-lg overflow-hidden relative z-50">
                     <ComparisonAnalysis />
                </div>
            ) : (
                <>
                    <WorldVisualizer worldId={WORLDS_ORDER[currentWorldIndex]} stepData={currentStep} genre={config.genre} />
                    {isFinished && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-50 animate-in zoom-in duration-500">
                            <div className="text-center p-12 border border-story-gold/30 rounded-lg bg-[#0a0a0f]">
                                <h2 className="text-4xl font-serif text-white mb-6 tracking-widest">SIMULATION COMPLETE</h2>
                                <div className="grid grid-cols-2 gap-8 mb-8 text-left">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">Final Score</p>
                                        <p className="text-3xl text-story-gold font-mono">{currentStep?.cumulativeReward}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">Diamonds Collected</p>
                                        <p className="text-3xl text-cyan-400 font-mono">{currentStep?.diamonds}</p>
                                    </div>
                                </div>
                                <p className="text-gray-500 font-serif italic text-sm">"The Agent has traversed the StoryVerse."</p>
                            </div>
                        </div>
                    )}
                </>
            )}
         </div>

         {/* Bottom Log Panel */}
         <div className="h-56 bg-[#08080c] border-t border-white/10 flex flex-col font-mono text-xs shrink-0">
            <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2 text-story-gold">
                    <Terminal size={14} />
                    <span className="uppercase tracking-widest font-bold">System Log</span>
                </div>
                <div className="flex gap-4 text-gray-500">
                    <span>STEP</span>
                    <span>ACTION</span>
                    <span>THOUGHT</span>
                </div>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
                {history.length === 0 && <div className="text-gray-600 italic p-2">Waiting for agent initialization...</div>}
                {history.map((step, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 border-l-2 border-gray-800 pl-2 hover:bg-white/5 transition-colors py-1">
                        <div className="col-span-1 text-gray-500">#{step.step}</div>
                        <div className="col-span-2 text-cyan-400 truncate" title={step.action}>{step.action}</div>
                        <div className="col-span-7 text-gray-300 truncate font-serif italic opacity-80" title={step.thoughtProcess}>
                            "{step.thoughtProcess}"
                        </div>
                        <div className="col-span-2 text-right">
                           <span className={step.reward >= 0 ? 'text-green-500' : 'text-red-500'}>
                               {step.reward >= 0 ? '+' : ''}{step.reward} PTS
                           </span>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* Right Sidebar: Stats - Hide in Analysis Mode? No, keep it for context, or show nothing */}
      <StatsPanel history={history} currentStep={currentStep} />

    </div>
  );
};

export default SimulationDashboard;