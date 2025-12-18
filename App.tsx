import React, { useState } from 'react';
import { AppState, AgentConfig } from './types';
import BookEntry from './components/BookEntry';
import SimulationDashboard from './components/SimulationDashboard';
import SoundController from './components/SoundController';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.CONFIGURATION);
  const [config, setConfig] = useState<AgentConfig | null>(null);

  const handleStartSimulation = (newConfig: AgentConfig) => {
    setConfig(newConfig);
    setAppState(AppState.SIMULATION);
  };

  return (
    <>
      <SoundController />
      {appState === AppState.CONFIGURATION && (
        <BookEntry onStart={handleStartSimulation} />
      )}
      {appState === AppState.SIMULATION && config && (
        <SimulationDashboard config={config} />
      )}
    </>
  );
};

export default App;