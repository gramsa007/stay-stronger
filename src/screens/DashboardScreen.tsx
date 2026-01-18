import React from 'react';
import { 
  UserCircle, 
  Settings, 
  Download, 
  Upload, 
  ClipboardList, 
  PlusCircle, 
  Sparkles, 
  Zap, 
  Wind, 
  Coffee, 
  ChevronRight, 
  Dumbbell,
  Trash2,
  RefreshCcw
} from 'lucide-react';

interface DashboardProps {
  stats: any;
  streak: any;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  stats,
  streak,
  onExport,
  onImport,
  onPastePlan,
  onOpenCustomLog,
  onOpenPlanPrompt,
  onOpenEquipment,
  onOpenSystemPrompt,
  onOpenWarmupPrompt,
  onOpenCooldownPrompt,
  onClearPlan,
  onReset
}) => {
  
  const handleSafeReset = () => {
    if (window.confirm("Bist du sicher? Alle Daten, dein Verlauf und deine Einstellungen werden gelöscht!")) {
      onReset();
    }
  };

  const handleSafeClearPlan = () => {
    if (window.confirm("Möchtest du wirklich den aktuellen Trainingsplan löschen? Dein Verlauf bleibt erhalten.")) {
      onClearPlan();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      
      {/* Header Bereich */}
      <div className="bg-slate-900 pt-12 pb-20 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
            <UserCircle size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase italic">Coach Andy</h1>
            <p className="text-blue-300 text-sm font-bold tracking-widest uppercase">Athlete Profile</p>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 space-y-6 relative z-20">
        
        {/* Backup & Sync Karte */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl border border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
                <Settings size={20} />
              </div>
              <div>
                <h2 className="text-white font-black text-lg">Cloud Sync</h2>
                <p className="text-slate-500 text-xs font-medium">Backup & Restore</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onExport} className="p-3 bg-slate-800 text-blue-400 rounded-2xl hover:bg-slate-700 transition-colors">
                <Download size={20} />
              </button>
              <label className="p-3 bg-slate-800 text-green-400 rounded-2xl hover:bg-slate-700 transition-colors cursor-pointer">
                <Upload size={20} />
                <input type="file" className="hidden" onChange={onImport} accept=".json" />
              </label>
              <button onClick={onPastePlan} className="p-3 bg-slate-800 text-teal-400 rounded-2xl hover:bg-slate-700 transition-colors">
                <ClipboardList size={20} />
              </button>
            </div>
          </div>
          
          <button 
            onClick={onOpenCustomLog}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-slate-700/50 transition-all active:scale-95"
          >
            <PlusCircle size={18} className="text-blue-400" /> Freies Training loggen
          </button>
        </div>

        {/* Coach KI Setup Sektion */}
        <div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2">Coach KI Setup</h3>
          <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-gray-100">
            <button onClick={onOpenSystemPrompt} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <span className="flex-1 text-left font-bold text-slate-700">Coaching Philosophie</span>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
            <div className="h-px bg-gray-50 mx-4" />
            <button onClick={onOpenPlanPrompt} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap size={20} />
              </div>
              <span className="flex-1 text-left font-bold text-slate-700">Plan Erstellung</span>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
            <div className="h-px bg-gray-50 mx-4" />
            <button onClick={onOpenWarmupPrompt} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wind size={20} />
              </div>
              <span className="flex-1 text-left font-bold text-slate-700">Warmup Prompt</span>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
            <div className="h-px bg-gray-50 mx-4" />
            <button onClick={onOpenCooldownPrompt} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
              <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Coffee size={20} />
              </div>
              <span className="flex-1 text-left font-bold text-slate-700">Cooldown Prompt</span>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* Verwaltung Sektion */}
        <div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2">Verwaltung</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onOpenEquipment}
              className="col-span-2 bg-white border border-gray-200 p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Dumbbell size={20} className="text-blue-600" /> Equipment verwalten
            </button>
            <button 
              onClick={handleSafeClearPlan}
              className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-orange-600 hover:bg-orange-100 transition-colors"
            >
              <Trash2 size={18} /> Plan löschen
            </button>
            <button 
              onClick={handleSafeReset}
              className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-red-600 hover:bg-red-100 transition-colors"
            >
              <RefreshCcw size={18} /> App Reset
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};