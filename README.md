# StoryVerse | AgentX Observer

## 1. Project Overview
StoryVerse is a high-fidelity 2.5D autonomous agent simulation dashboard. It tracks **AgentX**, a reinforcement learning (RL) entity, as it traverses five distinct conceptual worlds. Unlike traditional games, StoryVerse is an "observer-only" experience where the user configures the agent’s initial parameters (Persona and Genre) and then monitors its learning progress, stability convergence, and emotional state in real-time.

**Core Problem Solved:** Provides a visual and analytical framework for understanding Q-Learning convergence across non-linear narrative environments, mapping abstract reward shaping to concrete visual and auditory feedback.

**Project Maturity:** Advanced MVP / Research Prototype.

---

## 2. Key Features
- **Autonomous Q-Learning Engine:** A custom implementation of the Q-Learning algorithm (Sutton & Barto) with epsilon-greedy exploration and state-space discretization.
- **Dynamic World Transition System:** Sequential progression through 5 worlds, each with unique reward functions, transition logic, and stability metrics.
- **Visual Evolution:** AgentX's appearance evolves through 5 stages (Stealth, Temporal, Regal, Adaptive, Luminous) using CSS-based generative rendering.
- **Multi-Genre Engine:** Full UI/UX skinning and atmospheric modulation for Sci-Fi, Fantasy, Horror, and Mythology themes.
- **Real-time Analytics:** Live charting using Recharts to monitor Cumulative Reward, Epsilon Decay, and World Stability.
- **Procedural Audio Synthesis:** A Web Audio API-driven engine that synthesizes ambient textures and drones based on world state and stability.

---

## 3. System Architecture
The application follows a unidirectional data flow pattern within a React-based frontend.

**Architecture Diagram:**
```text
[ User Config ] -> [ App Controller ]
                          |
                          v
                [ Simulation Dashboard ] <-----> [ Audio Engine ]
                 /        |         \
      [ RL Agent ] <-> [ Environment ] [ Stats Visualizer ]
           |              |                   |
      (Learning)      (State/Step)        (Recharts/Log)
```

**Execution Flow:**
1. **Config Phase:** `BookEntry` sets `AgentPersona` (initial $\epsilon$) and `Genre`.
2. **Simulation Phase:** `SimulationDashboard` initiates an effect-based loop.
3. **Loop Step:**
   - Agent perceives `stateHash` (WorldId + Stability Bucket).
   - Agent chooses `action` via Epsilon-Greedy policy.
   - `Environment` processes action, returns `reward`, `newStability`, and `diamonds`.
   - Agent updates `Q-Table` using the Bellman Equation.
   - UI components (`WorldVisualizer`, `StatsPanel`) re-render based on the new `SimulationStep`.

---

## 4. Tech Stack
- **Runtime:** React 19 (ESM via esm.sh)
- **Styling:** Tailwind CSS (Procedural classes and custom animations)
- **Charts:** Recharts (Area, Line, and Bar charts)
- **Icons:** Lucide-React
- **Audio:** Web Audio API (Oscillators, Gain Nodes, Biquad Filters, Noise Buffers)
- **RL Logic:** Vanilla TypeScript (Custom Q-Learning Implementation)

---

## 5. Project Structure
```text
.
├── components/
│   ├── BookEntry.tsx           # Entry & configuration UI
│   ├── SimulationDashboard.tsx # Main simulation coordinator
│   ├── WorldVisualizer.tsx     # Generative 2.5D environment renderer
│   ├── StatsPanel.tsx          # Real-time metrics sidebar
│   ├── ComparisonAnalysis.tsx  # Academic benchmarking view
│   └── SoundController.tsx     # Audio state management
├── services/
│   ├── rlLogic.ts              # Core RL Agent and Environment classes
│   ├── mockSimulation.ts       # UI-facing simulation orchestrator
│   └── audioEngine.ts          # Web Audio synthesizer
├── types.ts                    # Global enums and interfaces
├── App.tsx                     # Main application entry
└── index.html                  # HTML entry with import maps
```

---

## 6. Setup & Installation
The project is built as a modern ESM-based React application and does not require a complex build step if served via a local server.

1. **Clone the repository.**
2. **Serve the root directory:** Use any static file server (e.g., `npx serve .` or Live Server in VS Code).
3. **Environment Variables:** No external API keys are strictly required for the core simulation logic as it runs locally.

---

## 7. Usage
1. **Initialize:** On the landing screen, select a **Genre** (affects visuals/audio) and a **Persona** (affects learning speed).
2. **Observe:** Watch the "Atlas" on the left to track world progression.
3. **Analyze:** Click the **Analysis** button in the top bar to see how AgentX performs against a stochastic (random) baseline.
4. **Log:** Use the bottom terminal to read AgentX’s thought process ($\epsilon$ value and scoring heuristics).

---

## 8. Configuration
| Parameter | Default | Impact |
| :--- | :--- | :--- |
| `Persona` | Explorer | Sets initial $\epsilon$ (0.3 to 0.8). Determines exploration duration. |
| `Tick Rate` | ~150ms | Controls simulation speed (FPS of the RL loop). |
| `Learning Rate` | 0.2 | Speed at which new rewards overwrite old Q-values. |
| `Discount Factor` | 0.95 | Importance of future rewards (long-term vs short-term). |

---

## 9. Testing
- **Logic Tests:** Core RL logic is decoupled in `rlLogic.ts`. Current testing is performed via the `ComparisonAnalysis.tsx` suite which runs 500 simulated steps against a baseline.
- **Visual Tests:** Tailwind-based animations are stress-tested for 60fps performance on standard hardware.

---

## 10. Performance / Constraints
- **State Space:** The Q-Table is implemented as a plain JS object. For extremely long sessions or massive state-spaces, memory usage may grow.
- **Rendering:** `WorldVisualizer` uses heavily nested CSS filters and transforms. Mobile performance may vary depending on the GPU.

---

## 11. Security Considerations
- **Data Persistence:** Currently, all training data (Q-Table) is stored in memory and resets on page refresh.
- **Input:** No user-generated text is processed; all inputs are derived from predefined enums.

---

## 12. Known Issues & Limitations
- **Q-Table Persistence:** No local storage implementation yet.
- **Convergence Speed:** World 4 (Strategy) has complex reward shaping that may occasionally lead to local optima if the agent exploits a specific "streak" too early.
- **Responsive Design:** Optimized for 1920x1080. Smaller viewports may experience layout shifts in the terminal.

---

## 13. Roadmap
- [ ] **Phase 1:** Add `localStorage` persistence for the Q-Table.
- [ ] **Phase 2:** Implement Gemini API integration for "Narrative Generation" based on simulation events.
- [ ] **Phase 3:** Exportable "Agent DNA" (JSON export of learned weights).

---

## 14. Contribution Guidelines
- **Coding Style:** Strictly follow the provided TypeScript types.
- **Branching:** `main` is production; use `feature/*` for new worlds.
- **Visuals:** All character evolution must be handled via CSS in `WorldVisualizer.tsx`.
