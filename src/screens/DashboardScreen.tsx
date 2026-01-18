import React from 'react';
import { 
  Settings, Download, Upload, Trash2, 
  FileText, Zap, Wind, Sparkles, Database, Clipboard 
} from 'lucide-react';

interface DashboardProps {
  stats: { name: string; weight: number; height: number; total: number; thisWeek: number };
  streak: { currentStreak: number; bestStreak: number };
  onExport: () => void;
  onImport: (e: any) => void;
  onPastePlan: () => void;
  onOpenCustomLog: () => void;
  onOpenPlanPrompt: () => void;
  onOpenEquipment: () => void;
  onOpenSystemPrompt: () => void;
  onOpenWarmupPrompt: () => void;
  onOpenCooldownPrompt: () => void;
  onClearPlan: () => void;
  onReset: () => void;
}

export const DashboardScreen: React.FC<DashboardProps> = ({
  stats, streak, onExport, onImport, onPastePlan, onOpenCustomLog,
  onOpenPlanPrompt, onOpenEquipment, onOpenSystemPrompt,
  onOpenWarmupPrompt, onOpenCooldownPrompt, onClearPlan, onReset
}) => {

  const StatCard = ({ label, value, sub }: any) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
      <span className="text-3xl font-bold text-gray-800">{value}</span>
      <span className="text-xs text-gray-500 uppercase tracking-wide mt-1">{label}</span>
      {sub && <span className="text-xs text-green-600 font-medium mt-1">{sub}</span>}
    </div>
  );

  const ActionButton = ({ icon: Icon, label, onClick, color = "text-gray-700", bg = "bg-white" }: any) => (
    <button 
      onClick={onClick}
      className={`${bg} p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 transition-transform active:scale-95`}
    >
      <Icon className={`w-6 h-6 ${color}`} />
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </button>
  );

  return (
    <div className="p-6 space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {stats.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hey, {stats.name} 👋</h1>
          <p className="text-gray-500 text-sm">Bereit für das nächste Level?</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Workouts" value={stats.total} sub="Total" />
        <StatCard label="Streak" value={streak.currentStreak} sub={`Best: ${streak.bestStreak}`} />
        <StatCard label="Gewicht" value={stats.weight + " kg"} />
        <StatCard label="Größe" value={stats.height + " cm"} />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 ml-1">Aktionen</h3>
        <div className="grid grid-cols-3 gap-3">
          <ActionButton icon={Clipboard} label="Plan Import" onClick={onPastePlan} color="text-blue-600" />
          <ActionButton icon={FileText} label="Loggen" onClick={onOpenCustomLog} color="text-green-600" />
          <ActionButton icon={Settings} label="Equipment" onClick={onOpenEquipment} color="text-gray-600" />
        </div>
      </div>

      {/* AI Settings */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 ml-1">Coach KI Konfiguration</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <button onClick={onOpenSystemPrompt} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left">
            <Database className="w-5 h-5 text-indigo-500" /> <span className="flex-1 text-sm font-medium">System Prompt</span>
          </button>
          <button onClick={onOpenPlanPrompt} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left">
            <Sparkles className="w-5 h-5 text-blue-500" /> <span className="flex-1 text-sm font-medium">Plan Erstellung</span>
          </button>
          <button onClick={onOpenWarmupPrompt} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left">
            <Zap className="w-5 h-5 text-orange-500" /> <span className="flex-1 text-sm font-medium">Warmup</span>
          </button>
          <button onClick={onOpenCooldownPrompt} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left">
            <Wind className="w-5 h-5 text-teal-500" /> <span className="flex-1 text-sm font-medium">Cooldown</span>
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 ml-1">Daten</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <button onClick={onExport} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left">
            <Download className="w-5 h-5 text-gray-500" /> <span className="flex-1 text-sm font-medium">Backup speichern (JSON)</span>
          </button>
          <button onClick={onClearPlan} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left text-red-600">
            <Trash2 className="w-5 h-5" /> <span className="flex-1 text-sm font-medium">Aktuellen Plan löschen</span>
          </button>
          <button onClick={onReset} className="w-full p-4 flex items-center gap-3 hover:bg-red-50 text-left text-red-600 bg-red-50/50">
            <Trash2 className="w-5 h-5" /> <span className="flex-1 text-sm font-medium">App komplett zurücksetzen</span>
          </button>
        </div>
      </div>
    </div>
  );
};