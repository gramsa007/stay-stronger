import React, { useEffect } from 'react';
import { Clock, ChevronLeft, CheckCircle, BarChart2, Zap, Trophy, FastForward, Youtube } from 'lucide-react';
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
  history, // WICHTIG: History wird jetzt aktiv genutzt
  ExitDialogComponent,
  AnalysisModalComponent
}) => {

  // --- AUTO-CLEAN EFFECT ---
  // Putzt die Felder beim Start, damit man direkt tippen kann.
  useEffect(() => {
    if (!activeWorkoutData || !activeWorkoutData.exercises) return;

    activeWorkoutData.exercises.forEach((exercise: any, exIdx: number) => {
      if (!exercise.logs) return;

      exercise.logs.forEach((set: any, setIdx: number) => {
        const currentReps = String(set.reps || "").trim();
        const targetReps = String(set.targetReps || "").trim();
        
        if (currentReps && (currentReps === targetReps || currentReps.includes('Max Zeit'))) {
           handleInputChange(exIdx, setIdx, 'reps', '');
        }

        const currentWeight = String(set.weight || "").trim();
        const targetWeight = String(set.targetWeight || "").trim();

        if (currentWeight && (currentWeight === targetWeight || currentWeight.includes('5km'))) {
           handleInputChange(exIdx, setIdx, 'weight', '');
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  //HELPER: Holt die Werte vom letzten Mal aus der History
  const getLastPerformance = (exerciseName: string) => {
    if (!history || history.length === 0) return null;
    
    // Wir suchen RÜCKWÄRTS (neueste zuerst)
    for (let i = history.length - 1; i >= 0; i--) {
      const entry = history[i];
      if (entry.snapshot && entry.snapshot.exercises) {
        const match = entry.snapshot.exercises.find((e: any) => e.name === exerciseName);
        if (match && match.logs) {
          return match.logs; // Gibt die Sets vom letzten Mal zurück
        }
      }
    }
    return null;
  };

  const isCardioExercise = (name: string) => {
    const n = name.toLowerCase();
    return n.includes('run') || n.includes('lauf') || n.includes('endurance') || n.includes('cardio') || n.includes('amrap') || n.includes('emom');
  };

  const renderExercise = (exercise: any, exIndex: number) => {
    const isCardio = isCardioExercise(exercise.name);
    
    // Holen der historischen Daten für diese Übung
    const lastLogs = getLastPerformance(exercise.name);

    return (
      <div key={exIndex} className="mb-6 bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">
              {exIndex + 1}
            </div>
            <h3 className="font-black text-xl text-slate-900 leading-tight uppercase italic">{exercise.name}</h3>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(exercise.name + " execution"), '_blank')}
              className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
            >
              <Youtube size={20} />
            </button>

            <button 
              onClick={() => onAnalysisRequest(exercise.name)}
              className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <BarChart2 size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex gap-3 mb-2 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span className="w-8 text-center">Set</span>
          <span className="w-20 text-center">{isCardio ? "Zeit/Dist" : "Gewicht"}</span>
          <span className="w-20 text-center">Reps</span>
          <span className="ml-auto pr-4">Status</span>
        </div>

        <div className="space-y-2">
          {exercise.logs.map((set: any, setIndex: number) => {
            const isDone = set.completed;
            
            // --- ELEPHANT MEMORY LOGIC ---
            // Wir suchen den passenden Satz vom letzten Mal (gleicher Index)
            const lastSet = lastLogs ? lastLogs[setIndex] : null;

            // Placeholder Gewicht:
            // 1. Priorität: Was habe ich letztes Mal geschafft? ("Last: 80")
            // 2. Priorität: Was ist das Ziel heute? ("40")
            // 3. Priorität: Standard Text ("kg")
            let weightPlaceholder = isCardio ? "min" : "kg";
            if (lastSet && lastSet.weight) {
                weightPlaceholder = `Last: ${lastSet.weight}`;
            } else if (set.targetWeight) {
                weightPlaceholder = String(set.targetWeight);
            }

            // Placeholder Reps:
            let repsPlaceholder = "Reps";
            if (lastSet && lastSet.reps) {
                repsPlaceholder = `Last: ${lastSet.reps}`;
            } else if (set.targetReps) {
                repsPlaceholder = String(set.targetReps);
            }

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
                    value={set.weight || ""}
                    onChange={(e) => handleInputChange(exIndex, setIndex, 'weight', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-center font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-400 placeholder:text-[10px] placeholder:font-medium ${
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
                    value={set.reps || ""}
                    onChange={(e) => handleInputChange(exIndex, setIndex, 'reps', e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-center font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-400 placeholder:text-[10px] placeholder:font-medium ${
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