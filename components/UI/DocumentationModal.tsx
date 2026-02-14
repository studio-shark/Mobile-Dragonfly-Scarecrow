import React, { useState } from 'react';
import { X, FileText, Cpu, Activity, Settings, ChevronRight } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabID = 'overview' | 'specs' | 'physics' | 'production';

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabID>('overview');

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview & Patent', icon: FileText },
    { id: 'specs', label: 'Technical Specs', icon: Settings },
    { id: 'physics', label: 'Physics & Energy', icon: Activity },
    { id: 'production', label: 'Production Plan', icon: Cpu },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-700 w-full max-w-6xl h-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="bg-bronze-600/20 p-2 rounded text-bronze-500 border border-bronze-600/50">
                <FileText size={24} />
            </div>
            <div>
                <h2 className="text-xl font-serif text-white tracking-wide">TECHNICAL DOCUMENTATION</h2>
                <p className="text-xs text-slate-400 font-mono">MODEL DESIGNATION: MOBILE DRAGONFLY SCARECROW</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-64 bg-slate-900/30 border-r border-slate-800 flex flex-col p-4 space-y-2 hidden md:flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabID)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all text-left ${isActive ? 'bg-bronze-600/20 border border-bronze-600/50 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                >
                  <Icon size={18} className={isActive ? 'text-bronze-400' : 'text-slate-500'} />
                  <span className={`text-sm ${isActive ? 'font-semibold' : ''}`}>{tab.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-bronze-400" />}
                </button>
              );
            })}
          </div>

          {/* Main Scroll Area */}
          <div className="flex-1 overflow-y-auto p-8 text-slate-300 font-light leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            
            {/* Mobile Tabs */}
            <div className="md:hidden flex space-x-2 mb-6 overflow-x-auto pb-2">
                 {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabID)}
                        className={`whitespace-nowrap px-4 py-2 rounded text-sm ${activeTab === tab.id ? 'bg-bronze-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                        {tab.label}
                    </button>
                 ))}
            </div>

            {activeTab === 'overview' && <OverviewContent />}
            {activeTab === 'specs' && <SpecsContent />}
            {activeTab === 'physics' && <PhysicsContent />}
            {activeTab === 'production' && <ProductionContent />}
            
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-600 font-mono">
            <span>CONFIDENTIAL - MANUS AI INTERNAL</span>
            <span>DATE: FEB 14, 2026</span>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-serif text-bronze-400 mt-8 mb-4 border-b border-slate-800 pb-2">{children}</h3>
);

const SubSectionTitle = ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-white font-semibold mt-6 mb-2">{children}</h4>
);

// --- CONTENT COMPONENTS ---

const OverviewContent = () => (
    <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-white mb-6">Executive Summary</h1>
        <p className="mb-4">
            The Mobile Dragonfly Scarecrow represents a revolutionary advancement in autonomous agricultural technology, 
            specifically designed to address the critical global challenge of crop protection by replacing chemical pesticides 
            with a sustainable, non-invasive acoustic deterrent. This system combines advanced biomimetic design principles 
            with sophisticated swarm-based operational control.
        </p>
        <p className="mb-4">
            The system incorporates six primary technological domains: aerodynamic flight with adaptive maneuvering, 
            high-frequency acoustic pest repellent delivery, autonomous navigation and swarm control, modular power distribution, 
            environmental sealing, and comprehensive sensor integration.
        </p>

        <SectionTitle>Patent Claims & Innovation</SectionTitle>
        <div className="bg-slate-900/50 p-6 rounded border border-slate-700 space-y-4">
            <div>
                <strong className="text-white block mb-1">Claim 1: Autonomous Aerial Pest Control Vehicle</strong>
                <p className="text-sm">Comprising an aerodynamic flight system with four articulated wings; a central body housing an acoustic pest repellent system, navigation and swarm control systems, and power distribution systems; wherein the biomimetic dragonfly configuration provides agile and stable mobility for targeted pest control operations.</p>
            </div>
            <div>
                <strong className="text-white block mb-1">Claim 2: Acoustic Pest Repellent System</strong>
                <p className="text-sm">Comprising a high-frequency ultrasonic transducer, a power amplification module, and a directional acoustic projection cone; wherein the system generates a targeted acoustic signal to repel insect pests without chemical application.</p>
            </div>
            <div>
                <strong className="text-white block mb-1">Claim 3: Navigation and Swarm Control</strong>
                <p className="text-sm">Comprising central processing units, LiDAR arrays, stereo camera systems, GPS/RTK positioning, and mesh network communication; enabling fully autonomous and coordinated operation of multiple vehicles as a swarm.</p>
            </div>
        </div>

        <SectionTitle>Technical Drawing Overview</SectionTitle>
        <ul className="list-disc list-inside space-y-2 text-slate-400">
            <li><strong className="text-slate-300">Figure 1: Complete Engineering Scheme</strong> - Orthographic views establishing form factor and subsystem locations.</li>
            <li><strong className="text-slate-300">Figure 2: Aerodynamic Flight System</strong> - Details the quad-wing mobility platform, servo actuators, and internal mechanics.</li>
            <li><strong className="text-slate-300">Figure 3: Acoustic Pest Repellent System</strong> - Illustrates the sonic emitter, amplification module, and projection cone.</li>
            <li><strong className="text-slate-300">Figure 4: Navigation and Swarm Control</strong> - Presents the autonomous architecture including LiDAR, cameras, and mesh networking.</li>
            <li><strong className="text-slate-300">Figure 5: Power Distribution</strong> - Documents battery architecture, BMS, and motor controllers.</li>
            <li><strong className="text-slate-300">Figure 6: Environmental Sealing</strong> - Covers IP65 enclosure design and safety mechanisms.</li>
        </ul>
    </div>
);

const SpecsContent = () => (
    <div className="max-w-4xl">
        <SectionTitle>Vehicle Specifications</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-900 p-4 rounded border border-slate-800">
                <span className="text-slate-500 text-xs uppercase block mb-1">Dimensions</span>
                <span className="text-white font-mono">Length: 700mm | Wingspan: 900mm</span>
            </div>
            <div className="bg-slate-900 p-4 rounded border border-slate-800">
                <span className="text-slate-500 text-xs uppercase block mb-1">Weight</span>
                <span className="text-white font-mono">5.0 - 8.0 kg (Config Dependent)</span>
            </div>
            <div className="bg-slate-900 p-4 rounded border border-slate-800">
                <span className="text-slate-500 text-xs uppercase block mb-1">Flight Speed</span>
                <span className="text-white font-mono">0.5 - 10 m/s (Variable)</span>
            </div>
             <div className="bg-slate-900 p-4 rounded border border-slate-800">
                <span className="text-slate-500 text-xs uppercase block mb-1">Environment</span>
                <span className="text-white font-mono">IP65 Rated | -10°C to +45°C</span>
            </div>
        </div>

        <SectionTitle>Subsystem Details</SectionTitle>
        
        <SubSectionTitle>Aerodynamic Flight System</SubSectionTitle>
        <p className="mb-4">
            Utilizes a quad-wing design mimicking dragonfly mechanics. High-torque servos provide closed-loop control (±0.1° accuracy). 
            Wings are constructed from durable polymer membrane over carbon fiber frames, replicating natural vein structures for optimal aerodynamics and gust rejection.
        </p>

        <SubSectionTitle>Acoustic Pest Repellent System</SubSectionTitle>
        <p className="mb-4">
            Generates targeted ultrasonic signals (25-45 kHz) using a high-efficiency transducer and directional projection cone. 
            Modulates frequency, amplitude, and pulse rate to adapt to specific pests while remaining harmless to crops and beneficial wildlife.
        </p>

        <SubSectionTitle>Navigation & Swarm Control</SubSectionTitle>
        <p className="mb-4">
            <strong>Central Processing:</strong> Real-time sensor fusion and flight control.<br/>
            <strong>Sensors:</strong> LiDAR and Stereo Cameras for 3D mapping; GPS/RTK and IMU for cm-level positioning.<br/>
            <strong>Communication:</strong> Dedicated mesh network for swarm coordination and collision avoidance.
        </p>

        <SubSectionTitle>Power & Safety</SubSectionTitle>
        <p>
            <strong>Battery:</strong> Swappable Li-ion modules (24V, 10Ah).<br/>
            <strong>Endurance:</strong> 45-60 minutes continuous flight.<br/>
            <strong>Safety:</strong> IP65 sealing, emergency termination protocols, and collision avoidance systems.
        </p>
    </div>
);

const PhysicsContent = () => (
     <div className="max-w-4xl">
        <div className="bg-yellow-900/20 border-l-4 border-yellow-600 p-4 mb-8">
            <h4 className="text-yellow-500 font-bold mb-1">Physics Analysis & Energy Requirements</h4>
            <p className="text-sm text-yellow-200/70">Model Designation: Mobile Dragonfly Scarecrow | Date: Feb 14, 2026</p>
        </div>

        <SectionTitle>Lift & Drag Analysis</SectionTitle>
        <div className="space-y-6">
            <div>
                <SubSectionTitle>Lift Force Required (Level Flight)</SubSectionTitle>
                <div className="font-mono bg-slate-950 p-4 rounded text-cyan-400">
                    L = m × g<br/>
                    L = 6.5 kg × 9.81 m/s² = 63.77 N
                </div>
            </div>
            
            <div>
                <SubSectionTitle>Lift Coefficient (C_L)</SubSectionTitle>
                <p className="mb-2 text-sm text-slate-400">Calculated at cruise speed (5 m/s):</p>
                <div className="font-mono bg-slate-950 p-4 rounded text-cyan-400">
                    C_L = L / (0.5 × ρ × v² × S)<br/>
                    C_L = 63.77 / (0.5 × 1.225 × 5² × 0.18) = 23.15
                </div>
                <p className="mt-2 text-sm italic">Note: High C_L is characteristic of insect-inspired flapping flight mechanics.</p>
            </div>

            <div>
                <SubSectionTitle>Drag Force</SubSectionTitle>
                <div className="font-mono bg-slate-950 p-4 rounded text-cyan-400">
                    D = 0.5 × ρ × v² × S × C_D (C_D ≈ 0.8)<br/>
                    Cruise (5 m/s): 2.205 N<br/>
                    Max (10 m/s): 8.82 N
                </div>
            </div>
        </div>

        <SectionTitle>Power Consumption</SectionTitle>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                        <th className="py-2">Subsystem</th>
                        <th className="py-2">Cruise Power</th>
                        <th className="py-2">Max Power</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    <tr>
                        <td className="py-2 font-mono text-bronze-400">Propulsion</td>
                        <td className="py-2">11.03 W</td>
                        <td className="py-2">88.2 W</td>
                    </tr>
                    <tr>
                        <td className="py-2 font-mono text-bronze-400">Wing Actuation</td>
                        <td className="py-2">20 W</td>
                        <td className="py-2">20 W</td>
                    </tr>
                    <tr>
                        <td className="py-2 font-mono text-bronze-400">Acoustic System</td>
                        <td className="py-2">15 W</td>
                        <td className="py-2">15 W</td>
                    </tr>
                    <tr>
                        <td className="py-2 font-mono text-bronze-400">Nav & Control</td>
                        <td className="py-2">10 W</td>
                        <td className="py-2">10 W</td>
                    </tr>
                    <tr className="bg-slate-800/50 font-bold text-white">
                        <td className="py-3">TOTAL</td>
                        <td className="py-3 text-green-400">56 W</td>
                        <td className="py-3 text-red-400">133 W</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <SectionTitle>Endurance & Range</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-4 bg-slate-900 border border-slate-700 rounded">
                <h4 className="text-slate-400 text-xs uppercase mb-2">Flight Endurance (Cruise)</h4>
                <p className="text-2xl text-white font-mono">3.64 Hours</p>
                <p className="text-xs text-slate-500">~218 Minutes @ 85% Efficiency</p>
             </div>
             <div className="p-4 bg-slate-900 border border-slate-700 rounded">
                <h4 className="text-slate-400 text-xs uppercase mb-2">Operational Range</h4>
                <p className="text-2xl text-white font-mono">65.5 km</p>
                <p className="text-xs text-slate-500">At 5 m/s cruise speed</p>
             </div>
        </div>

        <SectionTitle>Swarm Efficiency</SectionTitle>
        <p>
            For a 10-hectare field (100,000 m²):<br/>
            <strong>20 Drones</strong> required (500 m² coverage/drone).<br/>
            Completion time: <strong>30-45 minutes</strong> with coordinated patterns.
        </p>
    </div>
);

const ProductionContent = () => (
    <div className="max-w-4xl">
         <h1 className="text-2xl font-bold text-white mb-6">Production Plan & Manufacturing</h1>
         
         <SectionTitle>Manufacturing Process</SectionTitle>
         <div className="space-y-4">
            <div className="flex">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold mr-4 shrink-0">1</div>
                <div>
                    <h4 className="font-bold text-white">Component Sourcing</h4>
                    <p className="text-sm">Carbon fiber airframes from aerospace specialists. Electronics (LiDAR, GPS, CPU) from tier-1 suppliers. Custom PCBs via certified EMS providers.</p>
                </div>
            </div>
            <div className="flex">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold mr-4 shrink-0">2</div>
                <div>
                    <h4 className="font-bold text-white">In-House Assembly</h4>
                    <p className="text-sm">Precision assembly of fuselage and wings. Integration of acoustic transducers and IP65 sealing. Battery module installation.</p>
                </div>
            </div>
            <div className="flex">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold mr-4 shrink-0">3</div>
                <div>
                    <h4 className="font-bold text-white">Software & Calibration</h4>
                    <p className="text-sm">Firmware flashing for swarm logic. Sensor calibration (IMU/LiDAR). Full diagnostic system-level testing.</p>
                </div>
            </div>
         </div>

         <SectionTitle>Quality Control</SectionTitle>
         <ul className="list-disc list-inside text-slate-400 space-y-1">
            <li><strong>Incoming QC:</strong> Inspection of all sourced components.</li>
            <li><strong>In-Process QC:</strong> Checks at each assembly stage.</li>
            <li><strong>Final QC:</strong> Comprehensive flight test and IP65 seal verification.</li>
         </ul>

         <SectionTitle>Cost Analysis (Per Unit)</SectionTitle>
         <div className="bg-slate-900 rounded border border-slate-700 overflow-hidden mb-4">
             <div className="flex justify-between p-3 border-b border-slate-800 text-sm">
                 <span>Airframe & Mechanical</span>
                 <span className="font-mono text-white">$350 (26%)</span>
             </div>
             <div className="flex justify-between p-3 border-b border-slate-800 text-sm">
                 <span>Electronics & Sensors</span>
                 <span className="font-mono text-white">$500 (37%)</span>
             </div>
             <div className="flex justify-between p-3 border-b border-slate-800 text-sm">
                 <span>Battery & Power System</span>
                 <span className="font-mono text-white">$300 (22%)</span>
             </div>
             <div className="flex justify-between p-3 border-b border-slate-800 text-sm">
                 <span>Assembly & Labor</span>
                 <span className="font-mono text-white">$150 (11%)</span>
             </div>
             <div className="flex justify-between p-3 bg-slate-800 text-white font-bold">
                 <span>TOTAL ESTIMATED COST</span>
                 <span className="font-mono text-green-400">$1,300</span>
             </div>
         </div>
         <p className="text-xs text-slate-500 italic">Based on initial production volume of 1,000 units/year.</p>
    </div>
);