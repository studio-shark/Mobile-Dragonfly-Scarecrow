import React from 'react';
import { 
  Play, Pause, Layers, Target, Wind, 
  Activity, DollarSign, Bug, Leaf, Eye, FileText, 
  Settings, Cpu, BookOpen, ZoomIn 
} from 'lucide-react';
import { StatCard } from './StatCard';
import { AppState, LayerType, SimulationStats, DroneData, ActiveModule } from '../../types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface SidebarProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  stats: SimulationStats;
  selectedDrone: DroneData | null;
}

const generateChartData = (time: number) => {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      time: i,
      efficiency: Math.min(100, Math.max(20, 50 + Math.sin((time + i) * 0.5) * 30 + (i * 2)))
    });
  }
  return data;
};

export const Sidebar: React.FC<SidebarProps> = ({ appState, setAppState, stats, selectedDrone }) => {
  
  const togglePlay = () => setAppState(s => ({ ...s, isPlaying: !s.isPlaying }));
  const setSpeed = (speed: number) => setAppState(s => ({ ...s, playbackSpeed: speed }));
  const setLayer = (layer: LayerType) => setAppState(s => ({ ...s, activeLayer: layer === s.activeLayer ? LayerType.NONE : layer }));
  const openModule = (module: ActiveModule) => setAppState(s => ({ ...s, activeModule: module }));
  const toggleInspector = () => setAppState(s => ({ ...s, viewMode: s.viewMode === 'simulation' ? 'inspector' : 'simulation', selectedDroneId: null }));

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
      
      {/* Top Header & Navigation */}
      <div className="pointer-events-auto flex justify-between items-start">
        <div className="flex flex-col gap-4">
            
            {/* Branding Card */}
            <div className="bg-slate-950/90 p-6 rounded-xl border border-bronze-600/30 shadow-2xl backdrop-blur-md max-w-md relative">
            <h1 className="text-3xl font-serif text-bronze-500 mb-1 tracking-widest">E-POLLINATOR</h1>
            <p className="text-slate-400 text-sm mb-4">Autonomous Biomimetic Pest Control System</p>
            
            {appState.viewMode === 'simulation' && (
                <div className="flex space-x-2 mb-6">
                    <span className="px-2 py-1 bg-green-900/40 text-green-400 text-xs rounded border border-green-800">SYSTEM ONLINE</span>
                    <span className="px-2 py-1 bg-blue-900/40 text-blue-400 text-xs rounded border border-blue-800">SWARM SYNCED</span>
                </div>
            )}

            {/* Main Stats (only in simulation) */}
            {appState.viewMode === 'simulation' && (
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Pest Reduction" value={`${stats.pestReduction.toFixed(1)}%`} icon={Bug} color="text-red-400" />
                    <StatCard label="Active Drones" value={stats.activeDrones} icon={Wind} color="text-bronze-500" />
                </div>
            )}
            
            {/* Inspector Controls */}
            {appState.viewMode === 'inspector' && (
                <div className="space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
                        <p className="text-white font-bold mb-2">3D INSPECTOR MODE</p>
                        <p className="text-xs text-slate-400 mb-4">Click component hotspots to view details.</p>
                        <button 
                            onClick={() => setAppState(s => ({...s, inspector: { ...s.inspector, exploded: !s.inspector.exploded }}))}
                            className={`w-full py-2 rounded text-sm font-bold transition-all ${appState.inspector.exploded ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                        >
                            {appState.inspector.exploded ? 'COLLAPSE VIEW' : 'EXPLODED VIEW'}
                        </button>
                    </div>
                    {appState.inspector.selectedPart && (
                        <div className="bg-bronze-900/30 border border-bronze-600/50 p-4 rounded animate-in slide-in-from-left-4">
                            <h4 className="text-bronze-400 font-serif text-lg capitalize">{appState.inspector.selectedPart} Module</h4>
                            <p className="text-slate-300 text-sm mt-1">
                                {appState.inspector.selectedPart === 'wings' && "Carbon-polymer composite wings with 4-DOF articulation."}
                                {appState.inspector.selectedPart === 'fuselage' && "Lightweight carbon fiber frame housing CPU and swappable battery."}
                                {appState.inspector.selectedPart === 'emitter' && "High-frequency ultrasonic array (25-45kHz) for targeted deterrence."}
                                {appState.inspector.selectedPart === 'sensor' && "LiDAR and stereo camera array for autonomous navigation."}
                                {appState.inspector.selectedPart === 'battery' && "24V 10Ah Li-Ion module providing 45-60min endurance."}
                            </p>
                        </div>
                    )}
                </div>
            )}
            </div>

            {/* Module Navigation Bar */}
            <div className="bg-slate-950/90 p-2 rounded-xl border border-slate-700 backdrop-blur-md flex flex-col gap-2">
                <NavButton active={appState.viewMode === 'inspector'} onClick={toggleInspector} icon={ZoomIn} label="3D Inspector" />
                <NavButton active={appState.activeModule === 'blueprints'} onClick={() => openModule('blueprints')} icon={Settings} label="Blueprints" />
                <NavButton active={appState.activeModule === 'physics'} onClick={() => openModule('physics')} icon={Activity} label="Physics Lab" />
                <NavButton active={appState.activeModule === 'production'} onClick={() => openModule('production')} icon={DollarSign} label="Cost Analysis" />
                <NavButton active={appState.activeModule === 'library'} onClick={() => openModule('library')} icon={BookOpen} label="Docs Library" />
            </div>

        </div>

        {/* Selected Drone Stats (Simulation Only) */}
        {selectedDrone && appState.viewMode === 'simulation' && (
          <div className="bg-slate-950/90 p-5 rounded-xl border border-cyan-500/30 shadow-2xl backdrop-blur-md w-72 animate-in fade-in slide-in-from-right-10 duration-300">
             <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                <h3 className="font-serif text-cyan-400 text-lg">UNIT {selectedDrone.id.toString().padStart(3, '0')}</h3>
                <Activity size={16} className="text-cyan-400 animate-pulse" />
             </div>
             
             <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>BATTERY</span>
                    <span>{Math.round(selectedDrone.battery)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${selectedDrone.battery < 20 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${selectedDrone.battery}%` }} />
                  </div>
                </div>
                
                <div className="h-24 w-full mt-2">
                   <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateChartData(stats.totalAreaCovered)}>
                      <defs>
                        <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="efficiency" stroke="#06b6d4" fillOpacity={1} fill="url(#colorEff)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <button 
                  onClick={() => setAppState(s => ({ ...s, selectedDroneId: null, cameraMode: 'orbit' }))}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded transition-colors"
                >
                  DESELECT UNIT
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Footer Controls (Simulation Only) */}
      {appState.viewMode === 'simulation' && (
      <div className="pointer-events-auto flex flex-col md:flex-row justify-between items-end md:items-center space-y-4 md:space-y-0">
        
        {/* Layer Controls */}
        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-700 backdrop-blur-md flex space-x-2">
          <button onClick={() => setLayer(LayerType.PEST_DENSITY)} className={`p-3 rounded transition-all flex items-center space-x-2 ${appState.activeLayer === LayerType.PEST_DENSITY ? 'bg-red-900/50 text-red-400 border border-red-800' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Bug size={20} />
            <span className="text-sm font-semibold hidden md:inline">PEST DENSITY</span>
          </button>
          <button onClick={() => setLayer(LayerType.CROP_HEALTH)} className={`p-3 rounded transition-all flex items-center space-x-2 ${appState.activeLayer === LayerType.CROP_HEALTH ? 'bg-green-900/50 text-green-400 border border-green-800' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Leaf size={20} />
            <span className="text-sm font-semibold hidden md:inline">CROP HEALTH</span>
          </button>
           <button onClick={() => setAppState(s => ({...s, cameraMode: s.cameraMode === 'orbit' ? 'follow' : 'orbit'}))} className={`p-3 rounded transition-all flex items-center space-x-2 ${appState.cameraMode === 'follow' ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-800' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Eye size={20} />
            <span className="text-sm font-semibold hidden md:inline">FOLLOW MODE</span>
          </button>
        </div>

        {/* Timeline Controls */}
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-700 backdrop-blur-md flex items-center space-x-4">
          <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center rounded-full bg-bronze-600 hover:bg-bronze-500 text-white shadow-lg transition-transform active:scale-95">
            {appState.isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>
          <div className="h-8 w-px bg-slate-700 mx-2"></div>
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
            {[1, 2, 4].map((speed) => (
              <button key={speed} onClick={() => setSpeed(speed)} className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${appState.playbackSpeed === speed ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex items-center space-x-3 p-3 rounded-lg transition-all w-full text-left ${active ? 'bg-bronze-600/20 border border-bronze-600/50 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
    >
        <Icon size={18} className={active ? 'text-bronze-400' : 'text-slate-500'} />
        <span className={`text-sm ${active ? 'font-semibold' : ''}`}>{label}</span>
    </button>
);