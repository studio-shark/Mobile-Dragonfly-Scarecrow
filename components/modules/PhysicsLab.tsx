import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PHYSICS } from '../../constants';

export const PhysicsLab = () => {
  const [mass, setMass] = useState(6.5); // kg
  const [speed, setSpeed] = useState(5); // m/s
  const [battery, setBattery] = useState(240); // Wh

  // Derived Calculations
  const weight = mass * PHYSICS.GRAVITY;
  // Lift must equal weight in level flight
  const liftRequired = weight; 
  // Drag = 0.5 * rho * v^2 * S * Cd
  const drag = 0.5 * PHYSICS.AIR_DENSITY * Math.pow(speed, 2) * PHYSICS.WING_AREA * PHYSICS.DRAG_COEFF;
  
  const powerPropulsion = drag * speed;
  const powerActuation = 20; // Constant approximation from docs
  const powerAcoustic = 15;
  const powerNav = 10;
  const powerTotal = powerPropulsion + powerActuation + powerAcoustic + powerNav;

  // Endurance (Hours) = (Battery Wh * Efficiency) / Power W
  const endurance = (battery * PHYSICS.LIFT_EFFICIENCY) / powerTotal;

  // Chart Data: Power Curve vs Speed
  const chartData = [];
  for(let v = 1; v <= 15; v++) {
      const d = 0.5 * PHYSICS.AIR_DENSITY * Math.pow(v, 2) * PHYSICS.WING_AREA * PHYSICS.DRAG_COEFF;
      const p = (d * v) + powerActuation + powerAcoustic + powerNav;
      chartData.push({ speed: v, power: Math.round(p) });
  }

  return (
    <div className="h-full flex flex-col md:flex-row p-6 gap-6 overflow-y-auto">
        {/* Controls */}
        <div className="w-full md:w-1/3 space-y-8">
            <div>
                <h2 className="text-2xl text-bronze-400 font-serif mb-6">PHYSICS SANDBOX</h2>
                <p className="text-slate-400 text-sm mb-6">
                    Adjust the parameters below to analyze flight performance in real-time. 
                    Calculations based on standard atmospheric conditions (ISA).
                </p>
            </div>

            <div className="space-y-6 bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-white text-sm font-bold">Total Mass</label>
                        <span className="text-cyan-400 font-mono">{mass} kg</span>
                    </div>
                    <input 
                        type="range" min="4" max="10" step="0.1" 
                        value={mass} onChange={(e) => setMass(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-white text-sm font-bold">Cruise Speed</label>
                        <span className="text-cyan-400 font-mono">{speed} m/s</span>
                    </div>
                    <input 
                        type="range" min="1" max="15" step="0.5" 
                        value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-white text-sm font-bold">Battery Capacity</label>
                        <span className="text-cyan-400 font-mono">{battery} Wh</span>
                    </div>
                    <input 
                        type="range" min="100" max="500" step="10" 
                        value={battery} onChange={(e) => setBattery(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500"
                    />
                </div>
            </div>
        </div>

        {/* Results & Visuals */}
        <div className="flex-1 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ResultCard label="Lift Required" value={`${liftRequired.toFixed(1)} N`} />
                <ResultCard label="Drag Force" value={`${drag.toFixed(2)} N`} />
                <ResultCard label="Total Power" value={`${powerTotal.toFixed(1)} W`} highlight />
                <ResultCard label="Endurance" value={`${endurance.toFixed(2)} hrs`} highlight />
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex-1 min-h-[300px]">
                <h4 className="text-white text-sm font-bold mb-4 ml-2">Power Consumption vs. Speed</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="speed" stroke="#94a3b8" label={{ value: 'Speed (m/s)', position: 'insideBottom', offset: -5 }} />
                        <YAxis stroke="#94a3b8" label={{ value: 'Power (W)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                            itemStyle={{ color: '#facc15' }}
                        />
                        <Area type="monotone" dataKey="power" stroke="#facc15" fillOpacity={1} fill="url(#colorPower)" />
                        {/* Reference Line for Current Speed */}
                        <line x1={speed} y1={0} x2={speed} y2={powerTotal + 50} stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

const ResultCard = ({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) => (
    <div className={`p-4 rounded-lg border ${highlight ? 'bg-cyan-900/20 border-cyan-500' : 'bg-slate-800 border-slate-700'}`}>
        <p className="text-slate-400 text-xs uppercase">{label}</p>
        <p className={`text-2xl font-mono font-bold mt-1 ${highlight ? 'text-white' : 'text-slate-200'}`}>{value}</p>
    </div>
);