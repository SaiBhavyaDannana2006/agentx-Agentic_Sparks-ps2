
import { WorldId, AgentConfig, AgentPersona } from '../types';

// --- 1. CONFIGURATION ---
const BASE_LEARNING_RATE = 0.2; // Higher learning rate for faster adaptation
const DISCOUNT_FACTOR = 0.95;

// --- 2. ENVIRONMENT DEFINITIONS & STATE MACHINE ---

export class StoryEnvironment {
  private stability: number = 20; // Start lower to allow more climb time
  public currentWorld: WorldId;
  private diamonds: number = 0;
  private totalScore: number = 0;

  // World 1 State (Riddles)
  private w1_riddleLevel: number = 1; // 1 to 5

  // World 3 State (Creatures)
  private w3_aggressionCounter: number = 0;

  // World 4 State (Collapse)
  private w4_lastStrategy: string = '';
  private w4_survivalStreak: number = 0; // Tracks consecutive non-damage steps

  constructor(startWorld: WorldId) {
    this.currentWorld = startWorld;
  }

  public reset(world: WorldId) {
    // Determine Diamond Reward for completing previous world
    // If stability was high enough upon exit, grant World Completion Reward
    if (this.currentWorld !== world) {
        if (this.stability >= 90) { // Threshold for "Completion"
            this.diamonds += 1; 
        }
    }

    this.currentWorld = world;
    this.stability = 20; // Reset to low stability for the new world
    
    // Reset World Specifics
    this.w1_riddleLevel = 1;
    this.w3_aggressionCounter = 0;
    this.w4_lastStrategy = '';
    this.w4_survivalStreak = 0;
  }

  public getDiamonds() {
      return this.diamonds;
  }

  public getTotalScore() {
      return this.totalScore;
  }

  public getStability() {
    return this.stability;
  }

  public step(action: string): { reward: number; done: boolean; stability: number; diamonds: number } {
    let points = 0;
    let done = false;
    
    // Stability Increment Factors - FAST-MEDIUM SPEED (~5 MINS TOTAL)
    // Target: ~200 steps per world.
    // Gain needed: 80 points.
    // Avg gain per step: ~0.4
    const STABILITY_GAIN_HIGH = 0.6; 
    const STABILITY_GAIN_MED = 0.4;  
    const STABILITY_GAIN_LOW = 0.15;  
    const STABILITY_LOSS_SMALL = 0.2;
    const STABILITY_LOSS_BIG = 0.8;

    // --- WORLD 1: WHISPERING ALIEN GROVE ---
    // Mechanic: 5 Sequential Riddles
    if (this.currentWorld === WorldId.WORLD_1_FOREST) {
        if (action.includes('Riddle') || action.includes('Pattern') || action.includes('Text')) {
            // Reward scales with Level
            points = 10 * this.w1_riddleLevel; // 10, 20, 30, 40, 50
            if (this.w1_riddleLevel < 5) this.w1_riddleLevel++;
            
            this.stability += STABILITY_GAIN_MED; 
        } else if (action.includes('Wrong') || action.includes('Rush')) {
            points = -20;
            this.stability -= STABILITY_LOSS_SMALL;
        }
        
        if (this.stability >= 99) done = true;
    }

    // --- WORLD 2: FRACTURED TIME SPIRAL ---
    // Mechanic: Stability-based movement
    else if (this.currentWorld === WorldId.WORLD_2_TIME) {
        if (action.includes('Forward') || action.includes('Adapt')) {
            points = 50; // Maintain Forward Stability
            this.stability += STABILITY_GAIN_MED;
        } else if (action.includes('Same Speed')) {
            points = 20; // Maintain Same Speed
            this.stability += STABILITY_GAIN_LOW;
        } else if (action.includes('Collapse')) {
            points = -20; // Cause Time Collapse
            this.stability -= STABILITY_LOSS_BIG;
        } else if (action.includes('Stabilization')) {
            points = 0; // Attempt Stabilization
            // No stability change
        }

        if (this.stability >= 99) done = true;
    }

    // --- WORLD 3: DOMAIN OF ELDRITCH ENTITIES ---
    // Mechanic: Emotional State
    else if (this.currentWorld === WorldId.WORLD_3_CREATURES) {
        if (action.includes('Calm') || action.includes('Serenity')) {
            points = 100; // Calm State
            this.stability += STABILITY_GAIN_HIGH;
            this.w3_aggressionCounter = 0;
        } else if (action.includes('Fear')) {
            points = 0; // Fear State
            this.stability -= STABILITY_LOSS_SMALL;
        } else if (action.includes('Engage') || action.includes('Outburst')) {
            points = 20; // Combat
            this.w3_aggressionCounter++;
            if (this.w3_aggressionCounter > 2 || action.includes('Outburst')) {
                points = -50; // Prolonged aggression penalty
                this.stability -= STABILITY_LOSS_BIG;
            }
        }
        
        if (this.stability >= 99) done = true;
    }

    // --- WORLD 4: REALITY COLLAPSE ZONE ---
    // Mechanic: Adaptive Strategy & Diamonds (UPDATED: GRANULAR REWARDS)
    else if (this.currentWorld === WorldId.WORLD_4_IMMUNITY) {
        
        // Actions: 'Analyze Weakness', 'Perfect Dodge', 'Counter Strike', 'Static Defense', 'Reckless Charge'

        // 1. Failure / Damage (Heavy Penalty)
        if (action === 'Reckless Charge') {
            points = -25;
            this.w4_survivalStreak = 0; // Reset streak on damage
            if (this.diamonds > 0) this.diamonds -= 1;
            this.stability -= STABILITY_LOSS_BIG;
        } 
        
        // 2. Stagnation (Small Penalty)
        else if (action === 'Static Defense') {
            points = -10;
            // No streak reset, but no bonus
            this.stability -= STABILITY_LOSS_SMALL;
        }

        // 3. Success / Partial Success (Reward)
        else {
             this.w4_survivalStreak++;
             
             // Base Intermediate Reward (Survival)
             points = 5; 
             
             // Streak Bonus (Reward for consistency/surviving longer)
             // Caps at +20 to ensure final goal is still dominant
             points += Math.min(20, this.w4_survivalStreak * 2);

             if (action === 'Analyze Weakness') {
                 points += 10; // Partial Success: Good prep
                 this.stability += STABILITY_GAIN_LOW;
             } else if (action === 'Perfect Dodge') {
                 points += 15; // Partial Success: Great defense
                 this.stability += STABILITY_GAIN_MED;
             } else if (action === 'Counter Strike') {
                 // COMBO LOGIC: Analyze/Dodge -> Counter is better than Counter -> Counter
                 if (this.w4_lastStrategy === 'Analyze Weakness' || this.w4_lastStrategy === 'Perfect Dodge') {
                     points += 40; // High Reward for Strategy Switch
                     this.stability += STABILITY_GAIN_HIGH;
                 } else {
                     points += 10; // Standard Hit
                     this.stability += STABILITY_GAIN_LOW;
                 }
             }
        }
        
        this.w4_lastStrategy = action;

        if (this.stability >= 99) done = true;
    }

    // --- WORLD 5: INFINITE VOID ---
    // Mechanic: Final Calculation
    else if (this.currentWorld === WorldId.WORLD_5_BLANK) {
        if (action.includes('Stabilize') || action.includes('Manifest')) {
            this.stability += STABILITY_GAIN_MED;
        }
        
        // Final Convergence Check
        if (this.stability >= 99) {
            done = true;
            // Condition: Total Points >= 0 AND Diamonds > 1
            if (this.totalScore >= 0 && this.diamonds > 1) {
                points = 100; // Success Reward (reduced from 500 to match doc scale of +100)
            } else {
                points = -50; // Failure/Penalty
            }
        }
    }

    // Update Totals
    this.totalScore += points;
    this.stability = Math.max(0, Math.min(100, this.stability));

    return { reward: points, done, stability: this.stability, diamonds: this.diamonds };
  }
}

// --- 3. AGENT DEFINITION (Q-LEARNING) ---

export class RLAgent {
  private qTable: Record<string, Record<string, number>> = {};
  private epsilon: number = 1.0;
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    
    switch (config.persona) {
        case AgentPersona.EXPLORER: this.epsilon = 0.8; break;
        case AgentPersona.STRATEGIST: this.epsilon = 0.3; break;
        case AgentPersona.EMPATH: this.epsilon = 0.5; break;
    }
  }

  public getStateHash(worldId: string, stability: number): string {
    const stabilityBucket = Math.floor(stability / 20) * 20;
    return `${worldId}_${stabilityBucket}`;
  }

  public chooseAction(stateHash: string, availableActions: string[]): string {
    if (!this.qTable[stateHash]) {
      this.qTable[stateHash] = {};
      availableActions.forEach(a => this.qTable[stateHash][a] = 0.0);
    }

    // Epsilon-Greedy
    if (Math.random() < this.epsilon) {
      return availableActions[Math.floor(Math.random() * availableActions.length)];
    }

    let bestAction = availableActions[0];
    let maxVal = -Infinity;
    
    for (const action of availableActions) {
      const val = this.qTable[stateHash][action] || 0;
      if (val > maxVal) {
        maxVal = val;
        bestAction = action;
      }
    }
    return bestAction;
  }

  public learn(state: string, action: string, reward: number, nextState: string, availableActionsNext: string[]) {
    const currentQ = this.qTable[state]?.[action] || 0;

    let maxNextQ = 0;
    if (this.qTable[nextState]) {
        maxNextQ = Math.max(...Object.values(this.qTable[nextState]));
    }

    const newQ = currentQ + BASE_LEARNING_RATE * (reward + (DISCOUNT_FACTOR * maxNextQ) - currentQ);
    
    if (!this.qTable[state]) this.qTable[state] = {};
    this.qTable[state][action] = newQ;

    // Decay Epsilon - FAST DECAY
    // 0.98 ^ 200 approx 0.017.
    if (this.epsilon > 0.05) {
        this.epsilon *= 0.98; 
    }
  }

  public getEpsilon() {
    return this.epsilon;
  }
}
