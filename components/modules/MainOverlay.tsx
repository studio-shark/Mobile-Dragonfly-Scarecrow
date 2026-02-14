import React from 'react';
import { X } from 'lucide-react';
import { ActiveModule } from '../../types';
import { BlueprintExplorer } from './BlueprintExplorer';
import { PhysicsLab } from './PhysicsLab';
import { ProductionDashboard } from './ProductionDashboard';
import { DocumentationModal } from '../UI/DocumentationModal'; // We'll reuse logic or component

interface MainOverlayProps {
    activeModule: ActiveModule;
    onClose: () => void;
}

export const MainOverlay: React.FC<MainOverlayProps> = ({ activeModule, onClose }) => {
    if (activeModule === 'none') return null;

    // Reuse existing docs modal for library, or map directly
    if (activeModule === 'library') {
        return <DocumentationModal isOpen={true} onClose={onClose} />;
    }

    let Content = null;
    let title = "";

    switch(activeModule) {
        case 'blueprints':
            Content = BlueprintExplorer;
            title = "BLUEPRINT EXPLORER";
            break;
        case 'physics':
            Content = PhysicsLab;
            title = "INTERACTIVE PHYSICS LAB";
            break;
        case 'production':
            Content = ProductionDashboard;
            title = "PRODUCTION & COST ANALYSIS";
            break;
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-950 border border-slate-700 w-full max-w-7xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                {/* Overlay Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
                    <h2 className="text-xl font-serif text-white tracking-wide ml-2">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-hidden bg-slate-900/50">
                    {Content && <Content />}
                </div>
            </div>
        </div>
    );
};