import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon: Icon, color = "text-cyan-400" }) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-lg flex items-center space-x-4 shadow-lg">
      <div className={`p-3 rounded-full bg-slate-800 ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-xl font-bold text-white font-mono">{value}</p>
        {subValue && <p className="text-xs text-slate-500">{subValue}</p>}
      </div>
    </div>
  );
};