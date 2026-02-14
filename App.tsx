import React, { useState } from 'react';
import { Sidebar } from './components/UI/Sidebar';
import { Scene } from './components/3d/Scene';
import { MainOverlay } from './components/modules/MainOverlay';
import { AppState, LayerType, SimulationStats, DroneData } from './types';
import { MOCK_INIT_STATS } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    isPlaying: true,
    playbackSpeed: 1,
    activeLayer: LayerType.NONE,
    selectedDroneId: null,
    cameraMode: 'orbit',
    viewMode: 'simulation',
    activeModule: 'none',
    inspector: {
        exploded: false,
        selectedPart: null,
    },
    // deprecated
    isDocsOpen: false,
  });

  const [stats, setStats] = useState<SimulationStats>({ ...MOCK_INIT_STATS, pestDensityMap: [] });
  const [currentDrones, setCurrentDrones] = useState<DroneData[]>([]);

  // Throttle updates to UI to avoid lag
  const handleStatsUpdate = (newStats: SimulationStats) => {
    setStats(prev => ({...prev, ...newStats}));
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      <Sidebar 
        appState={appState} 
        setAppState={setAppState} 
        stats={stats}
        selectedDrone={currentDrones.find(d => d.id === appState.selectedDroneId) || null}
      />
      
      <MainOverlay 
        activeModule={appState.activeModule}
        onClose={() => setAppState(prev => ({ ...prev, activeModule: 'none' }))}
      />
      
      <div className="absolute inset-0 z-0">
        <Scene 
            appState={appState} 
            setStats={(s) => {
                if (s.stats) handleStatsUpdate(s.stats);
                if (s.drones) setCurrentDrones(s.drones);
            }}
            onDroneClick={(id) => setAppState(prev => ({...prev, selectedDroneId: id, cameraMode: 'follow'}))}
            onPartSelect={(part) => setAppState(prev => ({...prev, inspector: { ...prev.inspector, selectedPart: part }}))}
        />
      </div>
    </div>
  );
};

export default App;