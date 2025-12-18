
import { WorldId, SimulationStep, AgentConfig } from '../types';
import { RLAgent, StoryEnvironment } from './rlLogic';

// --- Static Data for UI Text ---
const AGENT_PERSONAS = {
  [WorldId.WORLD_1_FOREST]: 'The Shadow Scholar',
  [WorldId.WORLD_2_TIME]: 'The Time Warden',
  [WorldId.WORLD_3_CREATURES]: 'The Mythic Sovereign',
  [WorldId.WORLD_4_IMMUNITY]: 'The Warforged Champion',
  [WorldId.WORLD_5_BLANK]: 'The Cosmic Architect',
};

const VISUAL_STATES = {
  [WorldId.WORLD_1_FOREST]: 'Cloaked in Shadows',
  [WorldId.WORLD_2_TIME]: 'Temporal Flux',
  [WorldId.WORLD_3_CREATURES]: 'Emotional Aura',
  [WorldId.WORLD_4_IMMUNITY]: 'Reactive Armor',
  [WorldId.WORLD_5_BLANK]: 'Luminous Core',
};

// ACTIONS MAPPED TO SPECIFIC MECHANICS FROM REWARD DOC
const ACTIONS_BY_WORLD = {
  [WorldId.WORLD_1_FOREST]: [
    'Attempt Riddle Solution',
    'Analyze Pattern (Correct)',
    'Consult Ancient Text',
    'Guess Answer (Wrong)',
    'Rush Puzzle (Wrong)'
  ],
  [WorldId.WORLD_2_TIME]: [
    'Maintain Forward Stability',
    'Adapt Pace (Stable)',
    'Maintain Same Speed',
    'Cause Time Collapse',
    'Attempt Stabilization'
  ],
  [WorldId.WORLD_3_CREATURES]: [
    'Maintain Calm State',
    'Project Serenity',
    'Succumb to Fear',
    'Engage Combat (Aggression)',
    'Aggressive Outburst'
  ],
  [WorldId.WORLD_4_IMMUNITY]: [
    'Analyze Weakness',       // Info gathering (Partial Success)
    'Perfect Dodge',          // Damage Avoidance (Partial Success)
    'Counter Strike',         // Effective Attack (Success)
    'Static Defense',         // Stagnation (Penalty)
    'Reckless Charge'         // Taking Damage (Failure)
  ],
  [WorldId.WORLD_5_BLANK]: [
    'Stabilize Void',
    'Manifest Reality',
    'Calculated Drift',
    'Drift in Nothingness',
    'Chaotic Pulse'
  ],
};

const THOUGHT_TEMPLATES = {
  POSITIVE: [
    "Reward logic verified. Points secured.",
    "Optimal strategy for this world mechanic.",
    "Stability increasing. Diamond probability high.",
    "Scoring heuristic matched.",
    "Diamond acquisition likely."
  ],
  NEGATIVE: [
    "Penalty received. Adjusting behavior.",
    "Score deduction detected. Avoiding action.",
    "Resource loss imminent. Recalculating.",
    "Suboptimal outcome. Strategy failed.",
    "Diamond reserve threatened."
  ],
  EXPLORATION: [
    "Testing scoring boundary.",
    "Searching for hidden mechanics.",
    "Evaluating risk/reward ratio.",
    "Querying environment rules.",
    "Analyzing Diamond economy."
  ]
};

// --- SINGLETON INSTANCES ---
let agent: RLAgent | null = null;
let environment: StoryEnvironment | null = null;
let currentStepCount = 0;

export const resetSimulation = () => {
  currentStepCount = 0;
  agent = null;
  environment = null;
};

export const generateSimulationStep = (
  config: AgentConfig,
  currentWorld: WorldId,
  prevStability: number
): SimulationStep => {
  
  // 1. Initialize RL System if first step
  if (!agent) agent = new RLAgent(config);
  if (!environment) environment = new StoryEnvironment(currentWorld);

  if (environment['currentWorld'] !== currentWorld) {
      environment.reset(currentWorld);
  }

  currentStepCount++;

  const currentStability = environment.getStability();
  const stateHash = agent.getStateHash(currentWorld, currentStability);
  const possibleActions = ACTIONS_BY_WORLD[currentWorld];

  const action = agent.chooseAction(stateHash, possibleActions);
  const { reward, done, stability, diamonds } = environment.step(action);
  const totalScore = environment.getTotalScore();

  const nextStateHash = agent.getStateHash(currentWorld, stability);
  agent.learn(stateHash, action, reward, nextStateHash, possibleActions);

  let thoughtType = "EXPLORATION";
  if (agent.getEpsilon() < 0.4) {
      thoughtType = reward > 0 ? "POSITIVE" : "NEGATIVE";
  }
  const thoughts = THOUGHT_TEMPLATES[thoughtType as keyof typeof THOUGHT_TEMPLATES];
  const thought = thoughts[Math.floor(Math.random() * thoughts.length)];

  // Inject Genre flavor
  let flavoredThought = thought;
  if (config.genre === 'Cosmic Horror' && Math.random() > 0.8) {
      flavoredThought = "The score... it demands sacrifice.";
  }

  return {
    timestamp: Date.now(),
    step: currentStepCount,
    worldId: currentWorld,
    agentPersona: AGENT_PERSONAS[currentWorld],
    agentVisualState: VISUAL_STATES[currentWorld],
    action: action,
    thoughtProcess: `[ε:${agent.getEpsilon().toFixed(2)}] ${flavoredThought}`,
    reward: reward,
    cumulativeReward: totalScore,
    diamonds: diamonds,
    epsilon: parseFloat(agent.getEpsilon().toFixed(3)),
    worldStability: parseFloat(stability.toFixed(1)),
    isConverged: done,
    emotionalState: {
      valence: Math.min(1, Math.max(-1, (stability - 50) / 50)), 
      arousal: Math.max(0, agent.getEpsilon()),
    },
    location: {
      x: 50 + (stability - 50) + (Math.random() * 10 - 5),
      y: 50 + Math.sin(currentStepCount / 10) * 10,
    }
  };
};
