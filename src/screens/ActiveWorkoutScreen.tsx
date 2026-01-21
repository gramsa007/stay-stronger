import React, { useEffect } from 'react';
import { Clock, ChevronLeft, CheckCircle, BarChart2, Zap, Trophy, FastForward } from 'lucide-react';
import { formatTime } from '../utils/helpers'; 

interface ActiveWorkoutProps {
  activeWorkoutData: any;
  totalSeconds: number;
  setTotalSeconds: (s: number) => void;
  history: any[];
  onBackRequest: () => void;
  onFinishWorkout: () => void;
  onAnalysisRequest: (name: string) => void;
  handleInputChange: (exIdx: number, setIdx: number, field: string, val: string) => void;
  toggleSetComplete: (exIdx: number, setIdx: number) => void;
  isRestActive: boolean;
  restSeconds: number;
  onSkipRest: () => void;
  activeRestContext: any;
  ExitDialogComponent?: React.ReactNode;
  AnalysisModalComponent?: React.ReactNode;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutProps> = ({
  activeWorkoutData,
  totalSeconds,
  onBackRequest,
  onFinishWorkout,
  onAnalysisRequest,
  handleInputChange,
  toggleSetComplete,
  isRestActive,
  restSeconds,
  onSkipRest,
  ExitDialogComponent,
  AnalysisModalComponent
}) => {

  // --- AUTO-CLEAN EFFECT ---
  // Dieser Effekt läuft genau EINMAL beim Starten des Screens.
  // Er "putzt" die Felder: Wenn der eingetragene Wert (z.B. "40") exakt dem Zielwert entspricht,
  // wird das Feld geleert, damit der Placeholder sichtbar wird und man direkt tippen kann.
  useEffect(() => {
    if (!activeWorkoutData || !activeWorkoutData.exercises) return;

    activeWorkoutData.exercises.forEach((exercise: any, exIdx: number) => {
      if (!exercise.logs) return;

      exercise.logs.forEach((set: any, setIdx: number) => {
        // 1. Bereinige REPS
        const currentReps = String(set.reps || "").trim();
        const targetReps = String(set.targetReps || "").trim();
        
        // Wenn der aktuelle Wert dem Zielwert entspricht ODER "Max Zeit" enthält -> Löschen
        if (currentReps && (currentReps === targetReps || currentReps.includes('Max Zeit'))) {
           handleInputChange(exIdx, setIdx, 'reps', '');
        }

        // 2. Bereinige GEWICHT / ZEIT
        const currentWeight = String(set.weight || "").trim();
        const targetWeight = String(set.targetWeight || "").trim();

        // Wenn der aktuelle Wert dem Zielwert entspricht ODER "5km" enthält -> Löschen
        if (currentWeight && (currentWeight === targetWeight || currentWeight.includes('5km'))) {
           handleInputChange(exIdx, setIdx, 'weight', '');
        }
      });
    });
    // Leeres Dependency Array [] garantiert, dass dies nur einmal beim Mounten passiert
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Helfer: Prüft ob es eine Cardio/Zeit-basierte Übung ist
  const isCardioExercise = (name: string) => {
    const n = name.toLowerCase();
    return n.includes('run') || n.includes('lauf') || n.includes('endurance') || n.includes('cardio') || n.includes('amrap') || n.includes('emom');
  };

  const renderExercise = (exercise: any, exIndex: number) => {
    const isCardio = isCardioExercise(exercise.name);

    return (
      <div key={exIndex} className="mb-6 bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">
              {exIndex + 1}
            </div>
            <h3 className="font-black text-xl text-slate-900 leading-tight uppercase italic">{exercise.name}</h3>
          </div>
          <button 
            onClick={() => onAnalysisRequest(exercise.name)}
            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <BarChart2 size={20} />
          </button>
        </div>
        
        {/* Intelligente Labels */}
        <div className="flex gap-3 mb-2 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span className="w-8 text-center">Set</span>
          <span className="w-20 text-center">{isCardio ? "Zeit/Dist" : "Gewicht"}</span>
          <span className="w-20 text-center">Reps</span>
          <span className="ml-auto pr-4">Status</span>
        </div>

        <div className="space-y-2">
          {exercise.logs.map((set: any, setIndex: number) => {
            const isDone = set.completed;
            
            // CLEAN INPUT LOGIC:
            // Der Value ist das, was der User wirklich getippt hat.
            // Der Target-Wert dient nur als Placeholder.
            
            const weightPlaceholder = set.targetWeight ? String(set.targetWeight) : (isCardio ? "min" : "kg");
            const repsPlaceholder = set.targetReps ? String(set.targetReps) : "Reps";

            return (
              <div 
                key={setIndex} 
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  isDone ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-transparent'
                } border`}
              >
                <span className={`w-8 text-center font-black italic ${isDone ? 'text-green-600' : 'text-slate-300'}`}>
                  {setIndex + 1}
                </span>
                
                {/* Input 1: Gewicht oder Zeit */}
                <div className="relative w-20">
                  <input 
                    type="text" 
                    inputMode={isCardio ? "text" : "decimal"} 
                    placeholder={weightPlaceholder}
                    value={set.weight || ""} // Leerer String wenn undefined/null
                    onChange={(e) => handleInputChange(exIndex, setIndex, 'weight', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-center font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-300 ${
                      isDone ? 'bg-white/50 border-green-200' : 'bg-white border-slate-200'
                    } border`}
                  />
                </div>

                <span className="text-slate-300 font-bold">×</span>
                
                {/* Input 2: Reps */}
                <div className="relative w-20">
                  <input 
                    type="text" 
                    inputMode="numeric"
                    placeholder={repsPlaceholder}
                    value={set.reps || ""} // Leerer String wenn undefined/null
                    onChange={(e) => handleInputChange(exIndex, setIndex, 'reps', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-center font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-300 ${
                      isDone ? 'bg-white/50 border-green-200' : 'bg-white border-slate-200'
                    } border`}
                  />
                </div>
                
                <button 
                  onClick={() => toggleSetComplete(exIndex, setIndex)}
                  className={`ml-auto w-12 h-12 flex items-center justify-center rounded-2xl transition-all active:scale-90 ${
                    isDone 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
                    : 'bg-white border border-slate-200 text-slate-200'
                  }`}
                >
                  <CheckCircle size={24} strokeWidth={isDone ? 3 : 2} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {ExitDialogComponent}
      {AnalysisModalComponent}

      <div className="bg-slate-900 pt-12 pb-6 px-6 shadow-xl sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <button onClick={onBackRequest} className="p-3 bg-white/10 rounded-2xl text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="font-black text-white italic uppercase tracking-tighter text-lg leading-tight">
              {activeWorkoutData.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 bg-blue-500 px-4 py-1.5 rounded-full shadow-lg shadow-blue-900/40">
              <Clock size={16} className="text-white animate-pulse" />
              <span className="font-black text-white font-mono text-sm tracking-widest leading-none">
                {formatTime(totalSeconds)}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
            <Zap size={20} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* --- Pausen-Overlay mit Skip-Button --- */}
      {isRestActive && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-[116px] z-20 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Pause läuft</p>
              <p className="font-black font-mono text-2xl leading-none">{formatTime(restSeconds)}</p>
            </div>
          </div>
          <button 
            onClick={onSkipRest}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all active:scale-95 border border-white/10"
          >
            <span className="text-xs font-black uppercase tracking-widest">Skip</span>
            <FastForward size={16} fill="currentColor" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5 pb-32">
        {activeWorkoutData.exercises.map((ex: any, idx: number) => renderExercise(ex, idx))}
        
        <button 
          onClick={onFinishWorkout}
          className="w-full mt-10 bg-slate-900 text-white font-black italic uppercase tracking-widest py-5 rounded-[2rem] shadow-2xl shadow-slate-300 hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Trophy size={20} className="text-blue-400" />
          Session abschließen
        </button>
      </div>
    </div>
  );
};