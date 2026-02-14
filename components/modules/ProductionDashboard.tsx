import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export const ProductionDashboard = () => {
  const [volume, setVolume] = useState(1000);

  // Cost Model
  const baseCost = 1300; // at 1000 units
  const scalingFactor = 0.9; // 10% reduction per 10x volume increase approx
  
  // Simple cost scaling logic
  const costPerUnit = Math.round(baseCost * Math.pow(scalingFactor, Math.log10(volume / 1000)));
  const totalProjectCost = costPerUnit * volume;

  const costBreakdown = [
      { name: 'Airframe', value: Math.round(costPerUnit * 0.26), color: '#3b82f6' },
      { name: 'Electronics', value: Math.round(costPerUnit * 0.37), color: '#8b5cf6' },
      { name: 'Battery', value: Math.round(costPerUnit * 0.22), color: '#10b981' },
      { name: 'Assembly', value: Math.round(costPerUnit * 0.15), color: '#f59e0b' },
  ];

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
        <h2 className="text-2xl text-bronze-400 font-serif mb-6">PRODUCTION DASHBOARD</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Interactive Scalability */}
            <div className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-white font-bold mb-4">Scalability Calculator</h3>
                    
                    <div className="mb-6">
                        <div className="flex justify-between mb-2">
                            <label className="text-slate-400 text-sm">Annual Production Volume</label>
                            <span className="text-white font-mono">{volume.toLocaleString()} units</span>
                        </div>
                        <input 
                            type="range" min="100" max="100000" step="100" 
                            value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full accent-green-500"
                        />
                         <div className="flex justify-between text-xs text-slate-600 mt-1">
                            <span>100</span>
                            <span>100k</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-slate-800 p-4 rounded border border-slate-700">
                            <p className="text-slate-500 text-xs">ESTIMATED COST PER UNIT</p>
                            <p className="text-3xl text-green-400 font-mono font-bold mt-1">${costPerUnit}</p>
                        </div>
                         <div className="bg-slate-800 p-4 rounded border border-slate-700">
                            <p className="text-slate-500 text-xs">TOTAL CAPITAL REQUIRED</p>
                            <p className="text-xl text-white font-mono font-bold mt-2">${(totalProjectCost / 1000000).toFixed(2)}M</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-white font-bold mb-2">Supply Chain Notes</h3>
                    <ul className="list-disc list-inside text-sm text-slate-400 space-y-2">
                        <li>Cost efficiency improves significantly above 5,000 units due to automated assembly.</li>
                        <li>Battery cells are the most volatile cost component based on market lithium prices.</li>
                        <li>In-house assembly required for IP65 sealing validation.</li>
                    </ul>
                </div>
            </div>

            {/* Right: Cost Breakdown */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                 <h3 className="text-white font-bold mb-4 w-full text-left">Unit Cost Breakdown</h3>
                 <div className="w-full h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={costBreakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {costBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip 
                                formatter={(value: number) => `$${value}`}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-white">${costPerUnit}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 w-full mt-6">
                     {costBreakdown.map((item) => (
                         <div key={item.name} className="flex items-center space-x-2">
                             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                             <div className="flex flex-col">
                                 <span className="text-xs text-slate-400">{item.name}</span>
                                 <span className="text-sm font-mono text-white">${item.value}</span>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    </div>
  );
};