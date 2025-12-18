import { WorldId } from '../types';

/**
 * StoryVerse Audio Engine
 * Purely presentational. Does not feed into RL Agent logic.
 * Uses Web Audio API to synthesize ambient textures.
 */

class AmbientAudioEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private currentWorld: string = 'NONE';
  private isMuted: boolean = false;
  
  // Track specific volume nodes for dynamic modulation
  private worldGain: GainNode | null = null;

  constructor() {
    // Lazy init handled in init() to respect browser autoplay policy
  }

  public async init() {
    if (this.context) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.context = new AudioContextClass();
    
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 0.4; // Default safe volume
    this.masterGain.connect(this.context.destination);
  }

  public async resume() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  public toggleMute(mute: boolean) {
    this.isMuted = mute;
    if (this.masterGain) {
      // Ramp to prevent clicking
      const currentTime = this.context?.currentTime || 0;
      this.masterGain.gain.cancelScheduledValues(currentTime);
      this.masterGain.gain.linearRampToValueAtTime(mute ? 0 : 0.4, currentTime + 0.5);
    }
  }

  private stopCurrentSounds(fadeDuration = 2) {
    if (!this.context || !this.worldGain) return;
    
    const currentTime = this.context.currentTime;
    
    // Fade out current world gain
    this.worldGain.gain.cancelScheduledValues(currentTime);
    this.worldGain.gain.setValueAtTime(this.worldGain.gain.value, currentTime);
    this.worldGain.gain.linearRampToValueAtTime(0, currentTime + fadeDuration);

    // Disconnect nodes after fade
    const nodesToStop = [...this.activeNodes];
    this.activeNodes = []; // Clear current list
    
    setTimeout(() => {
      nodesToStop.forEach(node => {
        try {
          if (node instanceof OscillatorNode) node.stop();
          node.disconnect();
        } catch (e) { /* ignore already stopped */ }
      });
    }, fadeDuration * 1000);
  }

  // --- GENERATORS ---

  private createNoiseBuffer(): AudioBuffer {
    const bufferSize = this.context!.sampleRate * 2; // 2 seconds
    const buffer = this.context!.createBuffer(1, bufferSize, this.context!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // --- SOUNDSCAPES ---

  public playEntryTheme() {
    if (this.currentWorld === 'ENTRY') return;
    this.stopCurrentSounds();
    this.currentWorld = 'ENTRY';
    if (!this.context || !this.masterGain) return;

    // Create a new gain group for this scene
    const sceneGain = this.context.createGain();
    sceneGain.gain.value = 0;
    sceneGain.connect(this.masterGain);
    sceneGain.gain.linearRampToValueAtTime(0.5, this.context.currentTime + 2);
    this.worldGain = sceneGain;

    // Drone: Low Sine
    const osc = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 55; // A1
    osc.connect(sceneGain);
    osc.start();
    this.activeNodes.push(osc, sceneGain);

    // Subtle detuned pair
    const osc2 = this.context.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 55.5; 
    osc2.connect(sceneGain);
    osc2.start();
    this.activeNodes.push(osc2);
  }

  public playWorldTheme(worldId: WorldId) {
    if (this.currentWorld === worldId) return;
    this.stopCurrentSounds(2); // Crossfade
    this.currentWorld = worldId;
    if (!this.context || !this.masterGain) return;

    const t = this.context.currentTime;
    const sceneGain = this.context.createGain();
    sceneGain.gain.value = 0;
    sceneGain.connect(this.masterGain);
    sceneGain.gain.linearRampToValueAtTime(0.6, t + 2);
    this.worldGain = sceneGain;

    switch (worldId) {
      case WorldId.WORLD_1_FOREST:
        this.generateForestAmbience(sceneGain);
        break;
      case WorldId.WORLD_2_TIME:
        this.generateTimeAmbience(sceneGain);
        break;
      case WorldId.WORLD_3_CREATURES:
        this.generateCreatureAmbience(sceneGain);
        break;
      case WorldId.WORLD_4_IMMUNITY:
        this.generateWarAmbience(sceneGain);
        break;
      case WorldId.WORLD_5_BLANK:
        this.generateVoidAmbience(sceneGain);
        break;
    }
  }

  // World 1: Curious, Digital/Organic Wind
  private generateForestAmbience(output: AudioNode) {
    // 1. Filtered Noise (Wind/Rustle)
    const noise = this.context!.createBufferSource();
    noise.buffer = this.createNoiseBuffer();
    noise.loop = true;
    const noiseFilter = this.context!.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 400;
    noise.connect(noiseFilter).connect(output);
    noise.start();

    // 2. High Glimmer (Curiosity)
    const osc = this.context!.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 800;
    const lfo = this.context!.createOscillator();
    lfo.frequency.value = 0.2; // Slow modulation
    const lfoGain = this.context!.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain).connect(osc.frequency);
    
    const oscGain = this.context!.createGain();
    oscGain.gain.value = 0.05; // Very quiet
    osc.connect(oscGain).connect(output);
    
    osc.start();
    lfo.start();
    
    this.activeNodes.push(noise, noiseFilter, osc, lfo, lfoGain, oscGain, output);
  }

  // World 2: Time, Deep Drone, Ticking
  private generateTimeAmbience(output: AudioNode) {
    // 1. Deep Drone (Time stretching)
    const osc = this.context!.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 40;
    const filter = this.context!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 120;
    osc.connect(filter).connect(output);
    osc.start();

    // 2. Ticking Texture (Simulated by LFO on noise gain)
    const noise = this.context!.createBufferSource();
    noise.buffer = this.createNoiseBuffer();
    noise.loop = true;
    
    const tickGain = this.context!.createGain();
    tickGain.gain.value = 0;
    
    const lfo = this.context!.createOscillator();
    lfo.type = 'square';
    lfo.frequency.value = 1; // 1 tick per second
    
    // Use a constant node to offset the square wave if needed, 
    // but connecting square LFO to gain creates on/off pulsing
    lfo.connect(tickGain.gain);
    
    const noiseFilter = this.context!.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 2000;
    
    // Reduce tick volume significantly
    const mixGain = this.context!.createGain();
    mixGain.gain.value = 0.05;

    noise.connect(tickGain).connect(noiseFilter).connect(mixGain).connect(output);
    noise.start();
    lfo.start();

    this.activeNodes.push(osc, filter, noise, tickGain, lfo, noiseFilter, mixGain, output);
  }

  // World 3: Emotional, Breathing, Ethereal
  private generateCreatureAmbience(output: AudioNode) {
    // 1. The "Breath" (Modulated Pink Noise)
    const noise = this.context!.createBufferSource();
    noise.buffer = this.createNoiseBuffer();
    noise.loop = true;
    
    const filter = this.context!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 5;
    
    const lfo = this.context!.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15; // Breathe rate
    const lfoGain = this.context!.createGain();
    lfoGain.gain.value = 300; // Filter sweep range
    
    lfo.connect(lfoGain).connect(filter.frequency);
    filter.frequency.value = 500; // Base freq

    noise.connect(filter).connect(output);
    noise.start();
    lfo.start();

    // 2. Unsettling tone
    const osc = this.context!.createOscillator();
    osc.frequency.value = 150;
    osc.type = 'sine';
    const oscGain = this.context!.createGain();
    oscGain.gain.value = 0.1;
    osc.connect(oscGain).connect(output);
    osc.start();

    this.activeNodes.push(noise, filter, lfo, lfoGain, osc, oscGain, output);
  }

  // World 4: Tension, Rumble, Electric
  private generateWarAmbience(output: AudioNode) {
    // 1. Rumble (Brownian-ish noise via heavy filtering)
    const noise = this.context!.createBufferSource();
    noise.buffer = this.createNoiseBuffer();
    noise.loop = true;
    
    const filter = this.context!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 80; // Very low
    
    const rumbleGain = this.context!.createGain();
    rumbleGain.gain.value = 0.8;
    
    noise.connect(filter).connect(rumbleGain).connect(output);
    noise.start();

    // 2. Electric Crackle
    const osc = this.context!.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 4; // Low freq rattle
    const oscGain = this.context!.createGain();
    oscGain.gain.value = 0.05;
    osc.connect(oscGain).connect(output);
    osc.start();

    this.activeNodes.push(noise, filter, rumbleGain, osc, oscGain, output);
  }

  // World 5: Void, White Noise fading to Silence
  private generateVoidAmbience(output: AudioNode) {
    // Start with a mid-freq hum that we will dampen manually via updateStability
    const osc = this.context!.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 200;
    
    // Add some noise
    const noise = this.context!.createBufferSource();
    noise.buffer = this.createNoiseBuffer();
    noise.loop = true;
    
    const noiseGain = this.context!.createGain();
    noiseGain.gain.value = 0.1;

    osc.connect(output);
    noise.connect(noiseGain).connect(output);
    
    osc.start();
    noise.start();

    this.activeNodes.push(osc, noise, noiseGain, output);
  }

  // --- DYNAMIC MODULATION ---

  /**
   * Modulates sound based on stability.
   * Specifically for World 5: Fade out as stability increases (Convergence).
   */
  public updateAmbience(stability: number) {
    if (this.currentWorld === WorldId.WORLD_5_BLANK && this.worldGain && this.context) {
       // As stability goes 0 -> 100, volume goes 0.6 -> 0
       const normalizedStability = Math.min(100, Math.max(0, stability));
       const targetGain = 0.6 * (1 - (normalizedStability / 100));
       
       // Smooth adjustment
       this.worldGain.gain.setTargetAtTime(targetGain, this.context.currentTime, 0.5);
    }
  }
}

export const audioService = new AmbientAudioEngine();
