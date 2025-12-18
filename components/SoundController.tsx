import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioService } from '../services/audioEngine';

const SoundController: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Attempt to init on mount, but might be suspended
    audioService.init();
  }, []);

  const toggleSound = async () => {
    if (!hasInteracted) {
        await audioService.init();
        await audioService.resume();
        setHasInteracted(true);
    }
    
    const newState = !isMuted;
    setIsMuted(newState);
    audioService.toggleMute(newState);
  };

  return (
    <button 
      onClick={toggleSound}
      className="fixed top-6 right-6 z-50 p-2 bg-black/40 backdrop-blur border border-white/10 rounded-full hover:bg-white/10 transition-colors text-story-gold"
      title={isMuted ? "Unmute Ambient Sound" : "Mute Ambient Sound"}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
};

export default SoundController;
