import React, { useEffect, useState } from 'react';
import { AgentConfig, AgentPersona, Genre } from '../types';
import { Book, Compass, Clock, Zap, Shield, Eye, Lock, Cpu, Skull, Scroll, Flame, Activity } from 'lucide-react';
import { audioService } from '../services/audioEngine';

interface BookEntryProps {
  onStart: (config: AgentConfig) => void;
}

type Phase = 'INITIALIZING' | 'CONFIGURATION' | 'LOCKED';

const BookEntry: React.FC<BookEntryProps> = ({ onStart }) => {
  const [phase, setPhase] = useState<Phase>('INITIALIZING');
  const [progress, setProgress] = useState(0);
  const [activeIcon, setActiveIcon] = useState(0);
  
  // Config State
  const [persona, setPersona] = useState<AgentPersona>(AgentPersona.EXPLORER);
  const [genre, setGenre] = useState<Genre>(Genre.SCIFI);

  // 1. Initialization Sequence - FAST BOOT (2 seconds)
  useEffect(() => {
    if (phase !== 'INITIALIZING') return;
    
    // Start Audio Engine lazily
    audioService.init().then(() => {
        audioService.playEntryTheme();
    }).catch(() => {
        // Handle autoplay policy restriction silently (waits for click)
    });

    const duration = 2000; 
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, (currentStep / steps) * 100);
      setProgress(newProgress);

      if (currentStep % 15 === 0) { 
        setActiveIcon(prev => (prev + 1) % 5);
      }

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setPhase('CONFIGURATION'), 200); 
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [phase]);

  const handleActivate = async () => {
    // Ensure audio is running on user interaction
    await audioService.resume();
    
    setPhase('LOCKED');
    // Simulate "Activation" sequence - FAST (1 second)
    setProgress(0);
    const duration = 1000;
    const intervalTime = 10;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
        currentStep++;
        const newProgress = Math.min(100, (currentStep / steps) * 100);
        setProgress(newProgress);

        if (currentStep >= steps) {
            clearInterval(timer);
            onStart({ name: 'AgentX', persona, genre });
        }
    }, intervalTime);
  };

  const icons = [Eye, Clock, Zap, Shield, Compass];
  const CurrentIcon = icons[activeIcon];

  // --- GENRE STYLING HELPERS ---
  const getBackgroundStyle = () => {
      switch(genre) {
          case Genre.SCIFI: 
             return "bg-black bg-[radial-gradient(circle_at_center,#050a14_0%,#000000_100%)]";
          case Genre.FANTASY:
             return "bg-[#050101] bg-[radial-gradient(circle_at_bottom,#2a0505_0%,#000000_100%)]";
          case Genre.HORROR:
             return "bg-[#020005] bg-[radial-gradient(ellipse_at_top,#1a0525_0%,#000000_100%)]";
          case Genre.MYTH:
             return "bg-[#f8fafc] bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f1f5f9_100%)]";
      }
  };

  const getBookContainerStyle = () => {
       switch(genre) {
          case Genre.SCIFI: 
             return "shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:shadow-[0_0_80px_rgba(6,182,212,0.3)] transition-shadow duration-500";
          case Genre.FANTASY: 
             return "shadow-[0_0_60px_rgba(220,38,38,0.2)] hover:shadow-[0_0_100px_rgba(220,38,38,0.4)] transition-shadow duration-500";
          case Genre.HORROR: 
             return "shadow-[0_0_60px_rgba(147,51,234,0.2)] animate-breathe";
          case Genre.MYTH: 
             return "shadow-[0_0_60px_rgba(234,179,8,0.3)] animate-float";
      }
  };

  const getBookStyle = () => {
      switch(genre) {
          case Genre.SCIFI: 
             // Metallic / Circuit - Slight digital noise
             return "bg-zinc-900 border-l-4 border-cyan-800 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-90";
          case Genre.FANTASY: 
             // Cracked Leather - Heavy texture
             return "bg-[#1a0505] border-l-4 border-[#3f0a0a] bg-[url('https://www.transparenttextures.com/patterns/leather.png')]";
          case Genre.HORROR: 
             // Organic Void - Subtle movement
             return "bg-[#0f0518] border-l-4 border-[#2e1065] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-blend-soft-light";
          case Genre.MYTH: 
             // Marble/Gold - Clean
             return "bg-slate-50 border-l-4 border-yellow-500 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')]";
      }
  };

  const getAccentColor = () => {
      switch(genre) {
          case Genre.SCIFI: return "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]";
          case Genre.FANTASY: return "text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]";
          case Genre.HORROR: return "text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]";
          case Genre.MYTH: return "text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]";
      }
  };

  const getFont = () => {
      switch(genre) {
          case Genre.SCIFI: return "font-mono tracking-widest";
          case Genre.FANTASY: return "font-serif tracking-[0.2em] font-bold";
          case Genre.HORROR: return "font-sans tracking-[0.3em] font-light";
          case Genre.MYTH: return "font-serif tracking-[0.15em] font-semibold";
      }
  };

  const getEntryText = () => {
      switch(genre) {
          case Genre.SCIFI: return "Initializing AgentX...";
          case Genre.FANTASY: return "SUMMONING AGENTX...";
          case Genre.HORROR: return "AWAKENING AGENTX...";
          case Genre.MYTH: return "Summoning AgentX...";
      }
  };

  // --- RENDER ATMOSPHERE (The "Alive" part) ---
  const renderAtmosphere = () => {
      switch(genre) {
          case Genre.SCIFI:
              // Digital Rain / Scanlines
              return (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.1)_50%,transparent_100%)] h-[200%] animate-scanline pointer-events-none"></div>
                  </>
              );
          case Genre.FANTASY:
              // Rising Ash / Embers
              return (
                  <>
                     <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 via-transparent to-transparent z-0"></div>
                     {[...Array(15)].map((_, i) => (
                        <div key={i} 
                             className="absolute w-1 h-1 bg-red-500/60 rounded-full blur-[1px] animate-ember"
                             style={{
                                 left: `${Math.random() * 100}%`,
                                 animationDelay: `${Math.random() * 5}s`,
                                 animationDuration: `${5 + Math.random() * 5}s`
                             }}
                        ></div>
                     ))}
                  </>
              );
          case Genre.MYTH:
              // Rotating Sunbeams / God Rays
              return (
                  <>
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(250,204,21,0.1)_20deg,transparent_40deg,rgba(250,204,21,0.1)_60deg,transparent_80deg,rgba(250,204,21,0.1)_100deg,transparent_120deg)] animate-spin-slower pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                  </>
              );
          case Genre.HORROR:
              // Spatial Warping / Void Pulse
              return (
                  <>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 animate-warp pointer-events-none mix-blend-overlay scale-150"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 via-transparent to-purple-900/5 animate-pulse-slow"></div>
                  </>
              );
      }
  };

  // --- CUSTOM PROGRESS RENDERERS ---

  const renderProgressIndicator = () => {
      if (genre === Genre.SCIFI) {
          // Cyberpunk: Thin Neon Bar
          return (
              <div className="w-64 h-1 bg-gray-900 mt-8 relative overflow-hidden rounded-full border border-cyan-900/50">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-[2px]"></div>
                  <div className="h-full bg-cyan-400 shadow-[0_0_15px_cyan]" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
              </div>
          );
      } 
      
      if (genre === Genre.FANTASY) {
          // Dark Fantasy: Red Circular Seal
          const radius = 40;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (progress / 100) * circumference;
          return (
              <div className="relative mt-8 w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full rotate-[-90deg]">
                      <circle cx="50%" cy="50%" r={radius} stroke="#2a0a0a" strokeWidth="2" fill="none" />
                      <circle cx="50%" cy="50%" r={radius} stroke="#dc2626" strokeWidth="2" fill="none" 
                          strokeDasharray={circumference} strokeDashoffset={offset} 
                          className="drop-shadow-[0_0_8px_red]"
                          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                      />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-16 h-16 border border-red-900/50 rounded-full animate-spin-slow opacity-50"></div>
                  </div>
              </div>
          );
      }

      if (genre === Genre.MYTH) {
          // Mythology: Expanding Halo
          return (
             <div className="relative mt-8 h-20 w-64 flex items-center justify-center">
                 <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30"></div>
                 <div className="w-16 h-16 rounded-full border-2 border-yellow-400/80 shadow-[0_0_20px_gold] flex items-center justify-center transition-all duration-300"
                      style={{ transform: `scale(${0.5 + (progress / 100) * 0.5})`, opacity: 0.5 + (progress/200) }}
                 >
                     <div className="w-full h-full rounded-full bg-yellow-100/10 animate-pulse"></div>
                 </div>
             </div>
          );
      }

      // Horror: Ripple Distortion
      return (
          <div className="relative mt-8 w-24 h-24 flex items-center justify-center">
              <div className="absolute w-full h-full border border-purple-800 rounded-full animate-ripple opacity-50"></div>
              <div className="absolute w-2/3 h-2/3 border border-purple-600 rounded-full animate-ripple delay-75 opacity-40"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_purple] animate-pulse"></div>
          </div>
      );
  };

  const renderFloatingParticles = () => {
    // Standard floating particles on top
    return [...Array(20)].map((_, i) => (
        <div key={i} className={`absolute rounded-full blur-[1px] animate-float opacity-30 
            ${genre === Genre.SCIFI ? 'bg-cyan-200' : 
              genre === Genre.FANTASY ? 'bg-orange-200 mix-blend-overlay' : 
              genre === Genre.MYTH ? 'bg-yellow-100' : 'bg-purple-300'}`}
            style={{
               width: Math.random() * 3 + 'px', height: Math.random() * 3 + 'px',
               left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
               animationDuration: (Math.random() * 10 + 5) + 's',
               animationDelay: (Math.random() * 5) + 's'
            }}
        ></div>
    ));
  };

  const renderSymbols = () => {
    return (
        <div className="absolute top-[-60px] w-full flex justify-center gap-6 opacity-80">
            {/* 5 Static Symbols representing the 5 worlds, cycling opacity */}
            {[...Array(5)].map((_, i) => {
                 const isActive = activeIcon === i;
                 let Icon = icons[i];
                 if (genre === Genre.FANTASY) {
                     const fantasyIcons = [Eye, Skull, Flame, Activity, Scroll];
                     Icon = fantasyIcons[i] || Icon;
                 }
                 return (
                    <div key={i} className={`transition-all duration-500 ${isActive ? 'opacity-100 scale-110 ' + getAccentColor() : 'opacity-20 scale-90 text-gray-500'}`}>
                        <Icon size={20} />
                    </div>
                 );
            })}
        </div>
    );
  };

  return (
    <div className={`relative w-full h-screen flex flex-col items-center justify-center overflow-hidden perspective-3d transition-colors duration-1000 ${getBackgroundStyle()}`}>
       
       {renderAtmosphere()}
       {renderFloatingParticles()}

       {/* --- PHASE 1 & 3: CLOSED BOOK (ENTRY) --- */}
       {(phase === 'INITIALIZING' || phase === 'LOCKED') && (
           <div className={`relative transition-all duration-1000 ease-in-out transform preserve-3d scale-100 opacity-100 flex flex-col items-center z-10`}>
              
              <div className={`w-64 h-80 rounded-r-md flex flex-col items-center justify-center relative z-10 animate-float ${getBookStyle()} ${getBookContainerStyle()}`}>
                  
                  {/* Spine Highlight */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/20 border-r border-white/10"></div>
                  
                  {/* Decorative Cover Borders */}
                  <div className={`absolute inset-4 border opacity-40 rounded-sm ${genre === Genre.MYTH ? 'border-yellow-600' : genre === Genre.SCIFI ? 'border-cyan-500/30' : 'border-white/20'}`}></div>

                  <div className="relative z-20">
                     {/* Central Emblem */}
                     {genre === Genre.SCIFI && <Cpu size={56} strokeWidth={1} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" />}
                     {genre === Genre.FANTASY && <Skull size={56} strokeWidth={1} className="text-red-700 drop-shadow-[0_0_15px_rgba(185,28,28,0.6)]" />}
                     {genre === Genre.HORROR && <Eye size={56} strokeWidth={1} className="text-purple-600 drop-shadow-[0_0_15px_rgba(147,51,234,0.6)]" />}
                     {genre === Genre.MYTH && <div className="rounded-full border-2 border-yellow-500 p-2"><Scroll size={40} strokeWidth={1} className="text-yellow-600" /></div>}
                  </div>

                  {/* Title on Book */}
                  <h1 className={`mt-8 text-xs font-serif font-bold tracking-[0.3em] opacity-60 text-center ${genre === Genre.SCIFI ? 'text-cyan-100' : genre === Genre.MYTH ? 'text-slate-600' : 'text-stone-400'}`}>
                      STORYVERSE
                  </h1>
                  
                  {/* Floating Symbols Above Book */}
                  {renderSymbols()}
              </div>

              {/* Progress UI Below Book */}
              <div className="mt-12 flex flex-col items-center z-20 h-32">
                  <h2 className={`${getAccentColor()} ${getFont()} text-sm animate-pulse`}>
                      {phase === 'LOCKED' && genre === Genre.SCIFI ? 'AGENTX ACTIVATED' : 
                       phase === 'LOCKED' ? 'SEAL BROKEN' :
                       getEntryText()}
                  </h2>
                  {renderProgressIndicator()}
              </div>
           </div>
       )}

       {/* --- PHASE 2: CONFIGURATION (OPEN BOOK) --- */}
       {phase === 'CONFIGURATION' && (
           <div className="relative z-10 w-[800px] h-[500px] flex perspective-1000 animate-in zoom-in duration-700">
                {/* Book Shadow */}
                <div className="absolute top-4 left-4 right-4 bottom-[-20px] bg-black/50 blur-xl rounded-xl z-0"></div>

                {/* Left Page (Intro) */}
                <div className={`w-1/2 h-full rounded-l-sm border-r border-[#d4af37]/30 p-8 flex flex-col justify-center items-center text-[#3e2c22] shadow-2xl relative z-10
                    ${genre === Genre.SCIFI ? 'bg-zinc-900 border-cyan-800 text-cyan-100' : 
                      genre === Genre.HORROR ? 'bg-[#1a1025] border-purple-900 text-purple-100' :
                      'bg-[#f4e4bc]'}`}
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-20"></div>
                    <Cpu size={48} className={`mb-4 opacity-80 ${genre === Genre.SCIFI ? 'text-cyan-400' : genre === Genre.HORROR ? 'text-purple-400' : 'text-[#8b5cf6]'}`} />
                    <h2 className={`text-2xl font-serif font-bold mb-2 ${genre === Genre.SCIFI ? 'text-cyan-400' : ''}`}>System Config</h2>
                    <p className="text-sm font-serif italic opacity-70 text-center mb-6">"Select the initial narrative bias parameters. The environment will restructure based on your choice."</p>
                    <div className="w-full border-t border-current opacity-20 my-4"></div>
                    <div className="text-[10px] font-mono uppercase tracking-widest opacity-50">Awaiting Input...</div>
                </div>

                {/* Right Page (Controls) */}
                <div className={`w-1/2 h-full rounded-r-xl p-8 flex flex-col shadow-2xl relative z-10
                     ${genre === Genre.SCIFI ? 'bg-zinc-900 text-cyan-50' : 
                       genre === Genre.HORROR ? 'bg-[#1a1025] text-purple-50' :
                       'bg-[#f4e4bc] text-[#3e2c22]'}`}
                >
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-20"></div>
                   <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent z-10"></div>
                   
                   <h2 className="text-xl font-serif font-bold mb-6 border-b border-current opacity-80 pb-2 relative z-20">Parameters</h2>
                   
                   <div className="space-y-6 relative z-20">
                      <div>
                         <label className="block text-xs font-bold uppercase tracking-wide mb-2 opacity-70">Narrative Genre (Theme)</label>
                         <div className="grid grid-cols-2 gap-2">
                            {Object.values(Genre).map(g => (
                                <button key={g} onClick={() => setGenre(g)}
                                    className={`p-2 text-[10px] font-bold uppercase border transition-all ${genre === g ? 'bg-black/20 border-current opacity-100' : 'border-transparent bg-black/5 hover:bg-black/10 opacity-60'}`}
                                >
                                    {g}
                                </button>
                            ))}
                         </div>
                      </div>

                      <div>
                         <label className="block text-xs font-bold uppercase tracking-wide mb-2 opacity-70">Agent Persona (Bias)</label>
                         <div className="flex flex-col gap-2">
                            {Object.values(AgentPersona).map((p) => (
                                <button key={p} 
                                    onClick={() => setPersona(p)}
                                    className={`text-left px-3 py-2 text-xs border transition-all ${persona === p ? 'bg-black/20 border-current opacity-100' : 'border-transparent bg-black/5 hover:bg-black/10 opacity-60'}`}
                                >
                                    <span className="font-bold">{p}</span>
                                    <span className="block text-[9px] opacity-70 font-normal">
                                        {p === AgentPersona.EXPLORER ? 'High Entropy / Curiosity' : p === AgentPersona.STRATEGIST ? 'Low Entropy / Logic' : 'Balanced / Social'}
                                    </span>
                                </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   <button onClick={handleActivate} className={`mt-auto group relative w-full font-bold font-serif py-3 overflow-hidden rounded-sm transition-all z-20
                        ${genre === Genre.SCIFI ? 'bg-cyan-900 hover:bg-cyan-800 text-cyan-100' : 
                          genre === Genre.HORROR ? 'bg-purple-900 hover:bg-purple-800 text-purple-100' : 
                          'bg-[#3e2c22] hover:bg-[#2a1d17] text-[#d4af37]'}`}
                   >
                      <span className="relative z-10 flex items-center justify-center gap-2">ACTIVATE AGENTX <Zap size={14}/></span>
                   </button>
                </div>
           </div>
       )}
    </div>
  );
};

export default BookEntry;