
export enum AppState {
  CONFIGURATION = 'CONFIGURATION',
  SIMULATION = 'SIMULATION',
}

export enum WorldId {
  WORLD_1_FOREST = 'Forest of Forgotten Fables',
  WORLD_2_TIME = 'Kingdom of Broken Time',
  WORLD_3_CREATURES = 'Realm of Mythic Creatures',
  WORLD_4_IMMUNITY = 'Immunity and Trial World',
  WORLD_5_BLANK = 'The Blank Page',
}

export enum AgentPersona {
  EXPLORER = 'Explorer',    // High Exploration (High Epsilon)
  STRATEGIST = 'Strategist', // High Exploitation (Low Epsilon)
  EMPATH = 'Empath',        // Balanced / Social Rewards
}

export enum Genre {
  FANTASY = 'Dark Fantasy',
  SCIFI = 'Cyberpunk',
  MYTH = 'Mythology',
  HORROR = 'Cosmic Horror'
}

export interface AgentConfig {
  name: string;
  persona: AgentPersona;
  genre: Genre;
}

export interface SimulationStep {
  timestamp: number;
  step: number;
  worldId: WorldId;
  agentPersona: string;
  agentVisualState: string;
  action: string;
  thoughtProcess: string;
  reward: number; // Immediate RL reward (delta)
  cumulativeReward: number; // Total Game Score
  diamonds: number; // Currency
  epsilon: number;
  worldStability: number;
  isConverged: boolean;
  emotionalState: {
    valence: number;
    arousal: number;
  };
  location: { x: number; y: number };
}

export interface RLState {
  worldId: WorldId;
  stabilityBucket: string;
  lastAction: string;
}
