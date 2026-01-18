import React, { useRef } from 'react';
import { 
  Settings, Download, Upload, Trash2, 
  FileText, Zap, Wind, Sparkles, Database, ClipboardCheck, 
  Trophy, Activity, Plus, CalendarOff, Brain
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSafeReset = () => {
    if (window.confirm("Bist du sicher? Damit wird die GESAMTE App zurückgesetzt.")) {
      onReset();
    }
  };

  const handleSafeClearPlan = () => {
    if (window.confirm("Nur den aktuellen Trainingsplan löschen?")) {
      onClearPlan();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-10 pb-12 px-6 rounded-b-[2.5rem] shadow-xl z-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <h1 className="text-3xl font-black text-white italic tracking-tighter mb-1 uppercase relative z-10">STAY STRONGER</h1>
        <div className="h-1 w-12 bg-blue-500 mx-auto rounded-full mt-2 relative z-10 opacity-50" />
      </div>

      {/* Stats */}
      <div className="px-6 -mt-8 grid grid-cols-2 gap-3 z-20">
        <div className="bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3 border border-gray-50">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-full"><Trophy size={20} /></div>
          <div><span className="block text-2xl font-bold text-gray-900">{streak.currentStreak}</span><span className="text-xs text-gray-500 font-medium">Streak</span></div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3 border border-gray-50">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-full"><Activity size={20} /></div>
          <div><span className="block text-2xl font-bold text-gray-900">{stats.total}</span><span className="text-xs text-gray-500 font-medium">Workouts</span></div>
        </div>
      </div>

      {/* Cloud Sync */}
      <div className="px-6 mt-6">
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2"><Database size={18} className="text-blue-400" /><h2 className="text-lg font-bold">Cloud Sync</h2></div>
              <p className="text-xs text-slate-400 font-medium">Backup & Restore</p>
            </div>
            <div className="flex gap-2">
              <button onClick={onExport} className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95"><Download size={18} /></button>
              <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95"><Upload size={18} /></button>
              <input type="file" ref={fileInputRef} onChange={onImport} className="hidden" accept=".json" />
              <button onClick={onPastePlan} className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95"><ClipboardCheck size={18} /></button>
            </div>
          </div>
          <button onClick={onOpenCustomLog} className="w-full py-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm transition-all active:scale-[0.98] group relative z-10">
            <div className="w-6 h-6 rounded-full border-2 border-slate-500 flex items-center justify-center group-hover:border-blue-500 group-hover:text-blue-500 transition-colors"><Plus size={14} /></div> Freies Training
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="px-6 mt-6 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Coach KI Setup</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            <button onClick={onOpenSystemPrompt} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Brain size={18}/></div>
              <span className="flex-1 text-sm font-bold text-gray-700">Coaching Philosophie</span>
            </button>
            <button onClick={onOpenPlanPrompt} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Sparkles size={18}/></div>
              <span className="flex-1 text-sm font-bold text-gray-700">Plan Erstellung</span>
            </button>
            <button onClick={onOpenWarmupPrompt} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Zap size={18}/></div>
              <span className="flex-1 text-sm font-bold text-gray-700">Warmup Prompt</span>
            </button>
            <button onClick={onOpenCooldownPrompt} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Wind size={18}/></div>
              <span className="flex-1 text-sm font-bold text-gray-700">Cooldown Prompt</span>
            </button>
          </div>
        </div>

        <div>
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Verwaltung</h3>
           <div className="grid grid-cols-2 gap-3">
             <button onClick={onOpenEquipment} className="col-span-2 bg-white border border-gray-200 p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-600 hover:bg-gray-50"><Settings size={16} /> Equipment</button>
             <button onClick={handleSafeClearPlan} className="bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-orange-600 hover:bg-orange-100"><CalendarOff size={16} /> Plan löschen</button>
             <button onClick={handleSafeReset} className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-red-600 hover:bg-red-100"><Trash2 size={16} /> App Reset</button>
           </div>
        </div>
      </div>
    </div>
  );
};