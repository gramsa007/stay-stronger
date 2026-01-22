import React, { useRef } from 'react';
import { 
  Trophy, Flame, Dumbbell, Settings, 
  Download, Upload, FileJson, PlusCircle, Trash2 
} from 'lucide-react';

interface DashboardScreenProps {
  stats: any;
  streak: any;
  onPastePlan: () => void;
  onOpenCustomLog: () => void;
  onOpenLibrary: () => void; // Prop kann bleiben, wird aber nicht genutzt
  onOpenPlanPrompt: () => void;
  onOpenEquipment: () => void;
  onOpenSystemPrompt: () => void;
  onOpenWarmupPrompt: () => void;
  onOpenCooldownPrompt: () => void;
  onClearPlan: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (json: any) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  stats, streak, onPastePlan, onOpenCustomLog, 
  onOpenPlanPrompt, onOpenEquipment, onOpenSystemPrompt, onOpenWarmupPrompt,
  onOpenCooldownPrompt, onClearPlan, onReset, onExport, onImport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const json = JSON.parse(content);
        if (onImport) onImport(json);
      } catch (err) {
        alert("Fehler beim Lesen der Backup-Datei.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const safeWorkouts = stats?.totalWorkouts || 0;
  const safeStreakCurrent = streak?.current || streak?.currentStreak || 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".json"
      />

      {/* Header Section */}
      <div className="bg-slate-900 pt-12 pb-24 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-1">STAY STRONGER</h1>
              <p className="text-blue-400 text-xs font-black uppercase tracking-widest">Hyrox Performance AI</p>
            </div>
            <div className="flex gap-2">
              <button onClick={onOpenSystemPrompt} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"><Settings size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-2 text-blue-400">
                <Trophy size={20} />
                <span className="text-[10px] font-black uppercase tracking-wider">Workouts</span>
              </div>
              <div className="text-4xl font-black text-white font-mono">{safeWorkouts}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-2 text-orange-400">
                <Flame size={20} />
                <span className="text-[10px] font-black uppercase tracking-wider">Streak</span>
              </div>
              <div className="text-4xl font-black text-white font-mono">{safeStreakCurrent}<span className="text-lg text-white/50 ml-1">Tage</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="px-5 -mt-12 relative z-20 space-y-6">
        
        {/* Quick Start (BUTTON ENTFERNT) */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
          <h2 className="text-slate-900 font-black italic uppercase text-lg mb-4">Aktionen</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onPastePlan} className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 p-6 rounded-[2rem] transition-all group">
              <FileJson size={28} className="text-slate-400 group-hover:text-blue-600 mb-1" />
              <span className="text-xs font-black uppercase text-slate-900">Plan Laden</span>
            </button>
            <button onClick={onOpenCustomLog} className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-green-50 hover:text-green-600 p-6 rounded-[2rem] transition-all group">
              <PlusCircle size={28} className="text-slate-400 group-hover:text-green-600 mb-1" />
              <span className="text-xs font-black uppercase text-slate-900">Freies Training</span>
            </button>
          </div>
        </div>

        {/* AI Config */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
          <h2 className="text-slate-900 font-black italic uppercase text-lg mb-4">KI Konfiguration</h2>
          <div className="space-y-3">
            <button onClick={onOpenPlanPrompt} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
              <span className="text-xs font-bold text-slate-600 uppercase">Trainingsplan Prompt</span>
              <Settings size={16} className="text-slate-400" />
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onOpenWarmupPrompt} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <span className="text-xs font-bold text-slate-600 uppercase">Warmup</span>
                <Settings size={16} className="text-slate-400" />
              </button>
              <button onClick={onOpenCooldownPrompt} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <span className="text-xs font-bold text-slate-600 uppercase">Cooldown</span>
                <Settings size={16} className="text-slate-400" />
              </button>
            </div>
            <button onClick={onOpenEquipment} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
              <span className="text-xs font-bold text-slate-600 uppercase">Mein Equipment</span>
              <Dumbbell size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
          <h2 className="text-slate-900 font-black italic uppercase text-lg mb-4">Daten & Backup</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button onClick={onExport} className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-2xl font-bold text-xs uppercase hover:bg-blue-100 transition-colors">
              <Download size={16} /> Backup Sichern
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 p-4 bg-slate-50 text-slate-700 rounded-2xl font-bold text-xs uppercase hover:bg-slate-100 transition-colors">
              <Upload size={16} /> Backup Laden
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onClearPlan} className="flex items-center justify-center gap-2 p-4 bg-orange-50 text-orange-600 rounded-2xl font-bold text-xs uppercase hover:bg-orange-100 transition-colors">
              <Trash2 size={16} /> Plan Löschen
            </button>
            <button onClick={onReset} className="flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-xs uppercase hover:bg-red-100 transition-colors">
              <Trash2 size={16} /> App Reset
            </button>
          </div>
        </div>

        <div className="text-center pb-8">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Stay Stronger v1.3 • Hyrox Ready</p>
        </div>
      </div>
    </div>
  );
};