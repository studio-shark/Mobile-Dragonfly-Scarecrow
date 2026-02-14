import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';
import { BLUEPRINTS } from '../../constants';

export const BlueprintExplorer = () => {
  const [activeBlueprint, setActiveBlueprint] = useState(BLUEPRINTS[0]);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex h-full flex-col md:flex-row">
      {/* Sidebar Gallery */}
      <div className="w-full md:w-64 bg-slate-900 border-r border-slate-700 p-4 overflow-y-auto">
        <h3 className="text-bronze-400 font-serif text-lg mb-4">BLUEPRINT SET</h3>
        <div className="space-y-3">
          {BLUEPRINTS.map((bp) => (
            <button
              key={bp.id}
              onClick={() => { setActiveBlueprint(bp); setZoom(1); }}
              className={`w-full text-left p-3 rounded border transition-all ${activeBlueprint.id === bp.id ? 'bg-bronze-900/40 border-bronze-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
            >
              <div className="text-sm font-bold truncate">{bp.title}</div>
              <div className="text-xs text-slate-500 mt-1 truncate">{bp.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewer */}
      <div className="flex-1 bg-[#003366] relative overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2 bg-slate-900/80 p-2 rounded-lg backdrop-blur">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="p-2 text-white hover:bg-slate-700 rounded"><ZoomOut size={20} /></button>
          <span className="p-2 text-slate-300 font-mono text-sm flex items-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="p-2 text-white hover:bg-slate-700 rounded"><ZoomIn size={20} /></button>
        </div>

        {/* Blueprint Canvas Area (Simulated) */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-10 cursor-move">
           <div 
             className="relative bg-[#004080] border-4 border-white shadow-2xl transition-transform duration-200 ease-out"
             style={{ 
                 width: '800px', 
                 height: '600px', 
                 transform: `scale(${zoom})`,
                 backgroundImage: 'linear-gradient(#ffffff0d 1px, transparent 1px), linear-gradient(90deg, #ffffff0d 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
             }}
           >
              {/* Simulated Content based on activeBlueprint */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 border-2 border-white m-4">
                  <h2 className="text-white/90 text-2xl font-mono border-b-2 border-white/50 pb-2 mb-8 uppercase text-center">{activeBlueprint.title}</h2>
                  
                  {/* Mock Diagram Lines */}
                  <div className="w-full h-full relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/70 rounded-full flex items-center justify-center">
                          <div className="w-48 h-2 border-2 border-white/70"></div>
                          <div className="absolute w-2 h-48 border-2 border-white/70"></div>
                          <div className="absolute w-40 h-40 border border-white/30 rotate-45"></div>
                      </div>
                      
                      {/* Callouts */}
                      <div className="absolute top-10 left-10 text-white/80 font-mono text-xs">
                          FIG 2.4 - A<br/>Scale: 1:10
                      </div>
                      <div className="absolute bottom-10 right-10 text-white/80 font-mono text-xs text-right">
                          PATENT PENDING<br/>REF: {activeBlueprint.id.toUpperCase()}
                      </div>
                  </div>
              </div>
           </div>
        </div>

        {/* Footer Info */}
        <div className="bg-slate-900 border-t border-slate-700 p-4 text-slate-400 text-sm font-mono flex justify-between">
           <span>DOC: PATENT-DRAWING-{activeBlueprint.id.toUpperCase()}</span>
           <span>STATUS: APPROVED</span>
        </div>
      </div>
    </div>
  );
};