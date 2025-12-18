
import React from 'react';
import { WorldId, SimulationStep, Genre } from '../types';

interface WorldVisualizerProps {
  worldId: WorldId;
  stepData: SimulationStep | null;
  genre: Genre;
}

const WorldVisualizer: React.FC<WorldVisualizerProps> = ({ worldId, stepData, genre }) => {
  const stability = stepData?.worldStability || 0;
  const x = stepData?.location.x || 50;
  const y = stepData?.location.y || 50;
  const valence = stepData?.emotionalState.valence || 0;

  // --- RENDER AGENT (EVOLUTION ACROSS WORLDS) ---
  const renderAgent = () => {
    // Smooth transition for position
    const posStyle = { left: `${x}%`, top: `${y}%`, transition: 'all 0.3s ease-out' };

    switch (worldId) {
        // WORLD 1: Fast Learning Phase (Cyber-Hero / Stealth)
        case WorldId.WORLD_1_FOREST:
            return (
                <div className="absolute w-8 h-12 -ml-4 -mt-6 z-20" style={posStyle}>
                    {/* Short Energy Cape */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-8 bg-cyan-900/40 blur-[1px] rounded-b-lg origin-top animate-float opacity-80" />
                    
                    {/* Body: Sleek Stealth Suit */}
                    <div className="relative w-full h-full bg-slate-900 rounded-sm overflow-hidden border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        {/* Neon Lines (Chest/Arms) */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-cyan-400 opacity-60 shadow-[0_0_5px_cyan]"></div>
                        <div className="absolute top-4 left-0 w-full h-[1px] bg-cyan-500 opacity-40"></div>
                    </div>
                    
                    {/* Head: Cowl-like */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-slate-800 rounded-md border border-cyan-400/50">
                        {/* Eyes: Soft Blue Glow */}
                        <div className="flex justify-center gap-1 mt-2">
                             <div className="w-1 h-0.5 bg-cyan-300 shadow-[0_0_8px_cyan]"></div>
                             <div className="w-1 h-0.5 bg-cyan-300 shadow-[0_0_8px_cyan]"></div>
                        </div>
                    </div>
                </div>
            );

        // WORLD 2: Time World (Time Guardian / Holographic)
        case WorldId.WORLD_2_TIME:
            return (
                 <div className="absolute w-8 h-12 -ml-4 -mt-6 z-20" style={posStyle}>
                    {/* Temporal Blur / After-image */}
                    <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-[2px] translate-x-2 opacity-40 animate-pulse"></div>
                    
                    {/* Floating Holographic Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-[1px] border-violet-400/40 rounded-full animate-spin-slow"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-[1px] border-cyan-400/30 rounded-full" style={{ animation: 'spin 4s linear infinite reverse' }}></div>

                    {/* Body: Silver/Violet Palette */}
                    <div className="relative w-full h-full bg-slate-800 rounded-full border border-violet-400/60 shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-violet-900 via-slate-800 to-cyan-900 opacity-90"></div>
                        {/* Core Symbol */}
                        <div className="w-3 h-3 border border-white/60 rotate-45 shadow-[0_0_5px_white]"></div>
                    </div>
                 </div>
            );
        
        // WORLD 3: Emotional / Creature World (Regal / Organic)
        case WorldId.WORLD_3_CREATURES:
             // Eye Color Logic: Calm (Valence > 0) -> Green/Blue, Aggressive -> Red
             const isAggressive = valence < -0.1;
             const eyeColorClass = isAggressive ? 'bg-red-500 shadow-red-500' : 'bg-emerald-400 shadow-emerald-400';
             const cloakColor = isAggressive ? 'from-red-950' : 'from-slate-900';

             return (
                 <div className="absolute w-10 h-14 -ml-5 -mt-7 z-20" style={posStyle}>
                    {/* Long Cloak */}
                    <div className={`absolute top-2 -left-2 w-[140%] h-[110%] bg-gradient-to-b ${cloakColor} to-black rounded-b-xl opacity-95 shadow-xl transition-colors duration-1000`}></div>
                    
                    {/* Body: Dark Organic Armor */}
                    <div className="relative w-full h-full bg-[#150505] rounded-t-xl rounded-b-md border-x border-gray-700/30 shadow-2xl">
                        {/* Glowing Runes */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-serif opacity-60 animate-pulse">ᛟ</div>
                    </div>

                    {/* Head: Intimidating */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-7 bg-[#0a0000] rounded-t-lg border-t border-gray-700">
                         <div className="flex justify-center gap-1.5 mt-2.5 transition-colors duration-500">
                             <div className={`w-1.5 h-1.5 rounded-full ${eyeColorClass} shadow-[0_0_10px_currentColor]`}></div>
                             <div className={`w-1.5 h-1.5 rounded-full ${eyeColorClass} shadow-[0_0_10px_currentColor]`}></div>
                         </div>
                    </div>
                 </div>
             );

        // WORLD 4: Strategy / Trial (Adaptive Energy Armor / Iron Man)
        case WorldId.WORLD_4_IMMUNITY:
            const isDamaged = stepData && stepData.reward < 0; // Visual feedback for damage

            return (
                 <div className="absolute w-12 h-14 -ml-6 -mt-7 z-20" style={posStyle}>
                    {/* Adaptive Shield Field */}
                    <div className="absolute -inset-1 border border-orange-500/30 rounded-lg animate-pulse opacity-50"></div>

                    {/* Tech Armor Body */}
                    <div className={`relative w-full h-full bg-amber-950/80 backdrop-blur-sm border-2 border-amber-500/50 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-100`}>
                         {/* Energy Core */}
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_orange]"></div>
                         
                         {/* Tech Plate Details */}
                         <div className="absolute top-0 left-0 w-full h-[1px] bg-orange-500/40"></div>
                         <div className="absolute bottom-0 left-0 w-full h-[1px] bg-orange-500/40"></div>

                         {/* Damage Cracks (Overlay) */}
                         {isDamaged && (
                             <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-80">
                                 <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-white fill-none stroke-2">
                                     <path d="M12 2L2 12L12 22L22 12Z" />
                                 </svg>
                             </div>
                         )}
                    </div>
                    
                    {/* Helmet */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-6 bg-amber-900 border border-amber-400/60 rounded-sm">
                        <div className="w-full h-1 bg-amber-400 mt-2 shadow-[0_0_5px_orange]"></div>
                    </div>
                 </div>
             );

        // WORLD 5: Final World (Cosmic Architect / Luminous)
        case WorldId.WORLD_5_BLANK:
            return (
                 <div className="absolute w-8 h-16 -ml-4 -mt-8 z-20" style={posStyle}>
                     {/* Divine Aura */}
                     <div className="absolute inset-0 bg-white/40 blur-xl rounded-full animate-pulse-slow"></div>
                     <div className="absolute -inset-4 bg-yellow-100/20 blur-2xl rounded-full"></div>

                     {/* Body: Pure Light Form */}
                     <div className="relative w-full h-full bg-white shadow-[0_0_40px_white] rounded-full opacity-95 animate-float flex flex-col items-center">
                         {/* Subtle gradient to imply form without detail */}
                         <div className="w-full h-full bg-gradient-to-b from-white via-amber-50 to-transparent rounded-full opacity-80"></div>
                     </div>
                 </div>
            );
            
        default: return null;
    }
  };

  // --- CYBERPUNK RENDERER ---
  const renderCyberpunk = () => {
      switch(worldId) {
          case WorldId.WORLD_1_FOREST: // Neon Data District
            return (
                <div className="relative w-full h-full bg-black overflow-hidden border border-cyan-900/30">
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, .1) 25%, rgba(0, 255, 255, .1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .1) 75%, rgba(0, 255, 255, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, .1) 25%, rgba(0, 255, 255, .1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .1) 75%, rgba(0, 255, 255, .1) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}></div>
                    {/* Central Data Pillar */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-64 border-x border-cyan-500 bg-cyan-900/10 backdrop-blur animate-pulse flex items-center justify-center">
                        <div className="text-xs text-cyan-400 font-mono rotate-90 tracking-widest">DATA CORE</div>
                    </div>
                    {/* Walls */}
                    <div className="absolute top-0 left-0 w-full h-8 bg-black border-b border-cyan-500/50"></div>
                    <div className="absolute bottom-0 left-0 w-full h-8 bg-black border-t border-cyan-500/50"></div>
                </div>
            );
          case WorldId.WORLD_2_TIME: // Glitched Time Grid
            return (
                <div className="relative w-full h-full bg-black overflow-hidden">
                    {/* Platforms */}
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="absolute w-40 h-40 border border-white/20 bg-gray-900/50 backdrop-blur transform" style={{ left: `${20 + i*25}%`, top: `${30 + (i%2)*20}%` }}>
                             {/* Clock Tower Hologram */}
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-t from-cyan-500 to-transparent"></div>
                             <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-800 font-mono animate-pulse">{88 + i}</div>
                        </div>
                    ))}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 animate-glitch"></div>
                </div>
            );
          case WorldId.WORLD_3_CREATURES: // AI Syndicate Zone (Hexagonal)
             return (
                 <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                     <div className="w-[80%] h-[80%] border-2 border-indigo-500/30 rounded-full flex items-center justify-center relative">
                         <div className="absolute w-[120%] h-[1px] bg-indigo-500/20 rotate-45"></div>
                         <div className="absolute w-[120%] h-[1px] bg-indigo-500/20 -rotate-45"></div>
                         {/* Nodes */}
                         {[0, 90, 180, 270].map(deg => (
                             <div key={deg} className="absolute w-4 h-4 bg-indigo-500 shadow-[0_0_10px_indigo]" style={{ transform: `rotate(${deg}deg) translate(150px)` }}></div>
                         ))}
                         <div className="w-20 h-20 bg-slate-900 border border-indigo-400 flex items-center justify-center text-indigo-300 font-mono text-xs">NEXUS</div>
                     </div>
                 </div>
             );
          case WorldId.WORLD_4_IMMUNITY: // Corp War Zone
             return (
                 <div className="relative w-full h-full bg-zinc-950 overflow-hidden">
                     {/* Levels */}
                     <div className="absolute bottom-0 w-full h-1/3 border-t border-orange-500/30 bg-orange-900/5"></div>
                     <div className="absolute bottom-1/3 w-full h-1/3 border-t border-orange-500/30 bg-orange-900/5"></div>
                     {/* Hazards */}
                     <div className="absolute top-10 left-20 w-1 h-full bg-red-500/20 animate-pulse"></div>
                     <div className="absolute top-10 right-20 w-1 h-full bg-red-500/20 animate-pulse delay-75"></div>
                 </div>
             );
          case WorldId.WORLD_5_BLANK: // Digital Genesis
             return (
                 <div className="relative w-full h-full bg-white overflow-hidden transition-all duration-1000">
                     {stability < 20 ? (
                         <div className="absolute inset-0 flex items-center justify-center text-gray-200 font-mono text-xs">INITIALIZING VOID PROTOCOL...</div>
                     ) : (
                         <>
                           <div className="absolute inset-0 grid grid-cols-12 gap-1 opacity-20">
                               {[...Array(144)].map((_,i) => <div key={i} className="bg-gray-100 transition-all duration-500" style={{ opacity: Math.random() > 0.8 ? 1 : 0}}></div>)}
                           </div>
                           <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-64 h-64 border border-gray-200 rounded-full flex items-center justify-center">
                                   <div className="w-1 h-full bg-gray-100"></div>
                                   <div className="h-1 w-full bg-gray-100 absolute"></div>
                               </div>
                           </div>
                         </>
                     )}
                 </div>
             );
      }
  };

  // --- DARK FANTASY RENDERER ---
  const renderFantasy = () => {
    switch(worldId) {
        case WorldId.WORLD_1_FOREST: // Cursed Forest
          return (
              <div className="relative w-full h-full bg-[#0a0505] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/10"></div>
                  {/* Trees */}
                  {[...Array(10)].map((_, i) => (
                      <div key={i} className="absolute bottom-0 w-8 bg-[#1a0f0f] rounded-t-lg" style={{ height: `${Math.random()*60 + 20}%`, left: `${i*10}%` }}></div>
                  ))}
                  {/* Ritual Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-red-900/50 rounded-full flex items-center justify-center">
                      <div className="w-32 h-32 border border-red-900/30 rotate-45"></div>
                  </div>
                  {/* Fog */}
                  <div className="absolute inset-0 bg-white/5 blur-xl animate-pulse-slow"></div>
              </div>
          );
        case WorldId.WORLD_2_TIME: // Ruins of Frozen Time
           return (
               <div className="relative w-full h-full bg-[#1c1917] overflow-hidden">
                   {/* Throne Hall */}
                   <div className="absolute inset-0 flex flex-col items-center">
                       <div className="w-1/2 h-full border-x border-stone-800 bg-black/20"></div>
                   </div>
                   {/* Floating Debris */}
                   {[...Array(8)].map((_, i) => (
                       <div key={i} className="absolute w-4 h-4 bg-stone-700 rotate-45 animate-float" style={{ left: `${Math.random()*80 + 10}%`, top: `${Math.random()*80}%`, animationDuration: '10s' }}></div>
                   ))}
                   <div className="absolute top-10 w-32 h-32 border-4 border-stone-800 rounded-full opacity-20"></div>
               </div>
           );
        case WorldId.WORLD_3_CREATURES: // Red Valley
           return (
               <div className="relative w-full h-full bg-gradient-to-b from-[#2a0a0a] to-black overflow-hidden">
                   {/* Cliffs */}
                   <div className="absolute left-0 top-0 w-20 h-full bg-black skew-x-12 opacity-50"></div>
                   <div className="absolute right-0 top-0 w-20 h-full bg-black -skew-x-12 opacity-50"></div>
                   {/* Creature Dens */}
                   {[0, 1, 2, 3].map(i => (
                       <div key={i} className="absolute w-12 h-8 bg-black rounded-t-full bottom-20" style={{ left: `${20 + i*20}%` }}>
                           <div className="w-2 h-2 bg-red-900 rounded-full absolute top-4 left-3 animate-ping"></div>
                       </div>
                   ))}
               </div>
           );
        case WorldId.WORLD_4_IMMUNITY: // Battlefield
            return (
                <div className="relative w-full h-full bg-[#1a1412] overflow-hidden">
                     <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-red-900/20 to-transparent"></div>
                     {/* Spikes */}
                     {[...Array(15)].map((_, i) => (
                         <div key={i} className="absolute bottom-0 w-2 bg-black h-12" style={{ left: `${Math.random()*100}%`, transform: `rotate(${Math.random()*40 - 20}deg)` }}></div>
                     ))}
                     {/* Rain of ash */}
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 animate-mist-drift"></div>
                </div>
            );
        case WorldId.WORLD_5_BLANK: // Ashen Void
            return (
                <div className="relative w-full h-full bg-[#101010] transition-all duration-1000">
                    {stability > 30 && (
                        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent opacity-50"></div>
                    )}
                    {stability > 60 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-gray-800 rounded-full animate-spin-slow"></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                       {stability < 90 && <div className="text-gray-800 font-serif italic">From ash, order.</div>}
                    </div>
                </div>
            );
    }
  };

  // --- COSMIC HORROR RENDERER ---
  const renderHorror = () => {
      switch(worldId) {
          case WorldId.WORLD_1_FOREST: // Alien Grove
             return (
                 <div className="relative w-full h-full bg-[#050010] overflow-hidden">
                     {/* Warped Trees */}
                     {[...Array(6)].map((_, i) => (
                         <div key={i} className="absolute bottom-0 w-12 bg-purple-900/20 rounded-t-full blur-md" style={{ height: '80%', left: `${i*20}%`, transform: `skewX(${Math.sin(i)*20}deg)` }}></div>
                     ))}
                     {/* Monolith */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-40 bg-black shadow-[0_0_30px_#4c1d95] rounded-full animate-breathe"></div>
                 </div>
             );
          case WorldId.WORLD_2_TIME: // Fractured Spiral
             return (
                 <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>
                     {/* Spirals */}
                     <div className="w-64 h-64 border border-purple-800/30 rounded-full animate-spin-slow"></div>
                     <div className="w-40 h-40 border border-purple-800/30 rounded-full animate-spin-reverse-slow"></div>
                     <div className="w-20 h-20 border border-purple-800/30 rounded-full animate-spin-slow"></div>
                 </div>
             );
          case WorldId.WORLD_3_CREATURES: // Void Entities
             return (
                 <div className="relative w-full h-full bg-[#020005]">
                     {/* Eyes in dark */}
                     {[...Array(5)].map((_,i) => (
                         <div key={i} className="absolute w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_purple] animate-pulse" style={{ left: `${Math.random()*90}%`, top: `${Math.random()*90}%`, animationDelay: `${i}s` }}></div>
                     ))}
                     <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/5 to-transparent"></div>
                 </div>
             );
          case WorldId.WORLD_4_IMMUNITY: // Reality Collapse
             return (
                 <div className="relative w-full h-full bg-black overflow-hidden">
                     {/* Shards */}
                     <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                     {[...Array(6)].map((_, i) => (
                         <div key={i} className="absolute bg-gray-900 border border-gray-700 w-20 h-20 opacity-50" style={{ left: `${Math.random()*80}%`, top: `${Math.random()*80}%`, transform: `rotate(${Math.random()*360}deg)` }}></div>
                     ))}
                 </div>
             );
          case WorldId.WORLD_5_BLANK: // Infinite Void
             return (
                 <div className="relative w-full h-full bg-black transition-colors duration-2000">
                     {/* Stars forming */}
                     {stability > 20 && [...Array(30)].map((_, i) => (
                         <div key={i} className="absolute w-[1px] h-[1px] bg-white rounded-full animate-pulse" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }}></div>
                     ))}
                     {/* Constellation Lines */}
                     {stability > 60 && (
                         <svg className="absolute inset-0 w-full h-full">
                             <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="white" strokeWidth="0.5" opacity="0.2" />
                             <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="white" strokeWidth="0.5" opacity="0.2" />
                         </svg>
                     )}
                 </div>
             );
      }
  };

  // --- MYTHOLOGY RENDERER ---
  const renderMyth = () => {
    switch(worldId) {
        case WorldId.WORLD_1_FOREST: // Sacred Grove
           return (
               <div className="relative w-full h-full bg-sky-50 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-white opacity-50"></div>
                   {/* Pillars */}
                   {[...Array(6)].map((_, i) => (
                       <div key={i} className="absolute bottom-10 w-6 h-32 bg-gradient-to-r from-gray-100 to-white border-x border-gray-200" style={{ left: `${15 + i*14}%` }}></div>
                   ))}
                   {/* Golden Pedestal */}
                   <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-16 h-8 bg-yellow-400/20 border-t border-yellow-400"></div>
               </div>
           );
        case WorldId.WORLD_2_TIME: // Hall of Fate
           return (
               <div className="relative w-full h-full bg-slate-50 overflow-hidden perspective-3d">
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-full bg-yellow-100 border-x border-yellow-300 transform perspective-3d rotateX(20deg)"></div>
                   {/* Statues */}
                   <div className="absolute top-10 left-10 w-10 h-32 bg-gray-200 rounded-t-full"></div>
                   <div className="absolute top-10 right-10 w-10 h-32 bg-gray-200 rounded-t-full"></div>
               </div>
           );
        case WorldId.WORLD_3_CREATURES: // Divine Plateau
           return (
               <div className="relative w-full h-full bg-blue-50">
                   <div className="absolute bottom-0 w-full h-20 bg-gray-200 rounded-t-[50%] scale-150 border-t-4 border-gray-300"></div>
                   {/* Shrines */}
                   <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-500 rounded-full blur-xl opacity-40"></div>
                   <div className="absolute top-10 right-10 w-8 h-8 bg-yellow-500 rounded-full blur-xl opacity-40"></div>
               </div>
           );
        case WorldId.WORLD_4_IMMUNITY: // War of Immortals
           return (
               <div className="relative w-full h-full bg-gray-100 overflow-hidden">
                   <div className="absolute bottom-0 w-full h-full bg-[linear-gradient(transparent_90%,#000_100%)]"></div>
                   {/* Tiers */}
                   <div className="absolute bottom-0 w-full h-12 bg-gray-300"></div>
                   <div className="absolute bottom-12 w-[80%] left-[10%] h-12 bg-gray-200"></div>
                   <div className="absolute bottom-24 w-[60%] left-[20%] h-12 bg-gray-100"></div>
                   {/* Lightning */}
                   <div className="absolute top-0 left-1/2 w-1 h-20 bg-yellow-400 animate-pulse"></div>
               </div>
           );
        case WorldId.WORLD_5_BLANK: // Creation Plane
           return (
               <div className="relative w-full h-full bg-white transition-all duration-1000">
                   {stability > 20 && (
                       <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-yellow-50 to-transparent"></div>
                   )}
                   {stability > 80 && (
                       <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-40 h-40 border-4 border-yellow-400/20 rounded-full"></div>
                       </div>
                   )}
               </div>
           );
    }
  };


  const renderWorldEnvironment = () => {
      switch(genre) {
          case Genre.SCIFI: return renderCyberpunk();
          case Genre.FANTASY: return renderFantasy();
          case Genre.HORROR: return renderHorror();
          case Genre.MYTH: return renderMyth();
          default: return renderCyberpunk();
      }
  };

  return (
    <div className={`w-full h-full rounded-lg overflow-hidden shadow-2xl relative transition-colors duration-1000 ${genre === Genre.SCIFI ? 'border-cyan-500/30' : genre === Genre.FANTASY ? 'border-red-900/30' : genre === Genre.HORROR ? 'border-purple-900/30' : 'border-yellow-500/30'}`}>
      {renderWorldEnvironment()}
      {renderAgent()}
      
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10"></div>

      {/* Info Overlay */}
      <div className="absolute top-6 left-6 max-w-sm z-30">
         <h1 className="text-3xl font-serif font-bold text-white tracking-widest drop-shadow-lg">{worldId.split(' ').slice(1).join(' ')}</h1>
         <div className="mt-2 flex items-center gap-2">
            <span className={`text-[10px] font-mono uppercase tracking-widest border px-2 py-1 bg-black/40 backdrop-blur-md rounded ${genre === Genre.SCIFI ? 'text-cyan-400 border-cyan-400/30' : 'text-story-gold border-story-gold/30'}`}>
               Stability: {stability.toFixed(1)}%
            </span>
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest px-2">
               {genre}
            </span>
         </div>
      </div>
    </div>
  );
};

export default WorldVisualizer;
