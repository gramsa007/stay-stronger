import React, { useState } from 'react';
import { Play, Eye, CheckCircle, Calendar, Target, Info, X, Clock } from 'lucide-react';

interface PlanProps {
  activeWeek: number;
  setActiveWeek: (w: number) => void;
  workouts: any[];
  isWorkoutCompleted: (id: number) => boolean;
  onStartWorkout: (id: number) => void;
  onPreviewWorkout: (w: any) => void;
}

export const PlanScreen: React.FC<PlanProps> = ({
  activeWeek, setActiveWeek, workouts, isWorkoutCompleted, onStartWorkout, onPreviewWorkout
}) => {
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const weeks = [1, 2, 3, 4];

  const typeDescriptions: { [key: string]: string } = {
    "EMOM": "Every Minute on the Minute: Starte die Übung zu Beginn jeder Minute. Erledige die Wiederholungen so schnell wie möglich. Die restliche Zeit der Minute ist deine Pause.",
    "circuit": "Zirkeltraining: Absolviere alle Übungen nacheinander mit minimaler Pause dazwischen.",
    "strength": "Krafttraining: Fokus auf saubere Technik und Progression.",
    "endurance": "Ausdauertraining: Fokus auf konstante Belastung über einen längeren Zeitraum."
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 pb-32">
      
      {/* --- Modernisierter Header --- */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 pt-12 pb-16 px-6 rounded-b-[3rem] shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-blue-500 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-indigo-500 rounded-full blur-[80px]"></div>
        </div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter mb-1 uppercase relative z-10">
          STAY FOCUSED
        </h1>
        <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase relative z-10">Dein Fortschritt zählt</p>
      </div>

      {/* --- Wochen Auswahl --- */}
      <div className="-mt-8 px-4 z-20 flex justify-center sticky top-4">
        <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 inline-flex gap-1">
          {weeks.map(w => (
            <button
              key={w}
              onClick={() => setActiveWeek(w)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeWeek === w 
                ? 'bg-slate-900 text-white shadow-lg scale-105' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
              }`}
            >
              W{w}
            </button>
          ))}
        </div>
      </div>

      {/* --- Workout Liste --- */}
      <div className="px-5 space-y-5 mt-8">
        {workouts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Calendar className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-400 font-medium">Keine Workouts für diese Woche</p>
          </div>
        ) : (
          workouts.map((workout) => {
            const completed = isWorkoutCompleted(workout.id);
            return (
              <div 
                key={workout.id} 
                className={`relative bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md group overflow-hidden ${
                  completed ? 'bg-green-50/20' : ''
                }`}
              >
                {/* Status Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${completed ? 'bg-green-500' : 'bg-blue-500/30'}`} />

                <div className="flex justify-between items-start mb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                        completed ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {workout.type}
                      </span>
                      
                      <button 
                        onClick={() => setShowInfo(workout.title.includes("EMOM") ? "EMOM" : workout.type)}
                        className="text-gray-300 hover:text-blue-500 transition-colors"
                      >
                        <Info size={16} />
                      </button>
                    </div>
                    <h3 className="font-black text-xl text-gray-900 leading-tight group-hover:text-blue-900 transition-colors">
                      {workout.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Target size={14} className="text-gray-300" />
                        <span className="text-xs font-bold">{workout.focus}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-300" />
                        <span className="text-xs font-bold">{workout.duration}</span>
                      </div>
                    </div>
                  </div>

                  {completed && (
                    <div className="bg-green-100 p-2 rounded-full text-green-600 shadow-inner">
                      <CheckCircle size={20} fill="currentColor" className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => onPreviewWorkout(workout)} 
                    className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} /> Details
                  </button>
                  <button 
                    onClick={() => onStartWorkout(workout.id)}
                    className={`flex-[2] py-3.5 text-white rounded-2xl font-black text-xs uppercase tracking-[0.1em] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      completed 
                      ? 'bg-slate-700 hover:bg-slate-800 shadow-slate-200' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200'
                    }`}
                  >
                    <Play size={16} fill="currentColor" />
                    {completed ? 'Nochmal' : 'Training Starten'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- Modernes Info Modal --- */}
      {showInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
            onClick={() => setShowInfo(null)}
          />
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative z-10 animate-in zoom-in-90 duration-300">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Info size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase italic italic tracking-tighter">
                {showInfo}
              </h2>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed font-medium bg-slate-50 p-5 rounded-3xl border border-slate-100 mb-6">
              {typeDescriptions[showInfo] || "Keine Beschreibung verfügbar."}
            </p>
            
            <button 
              onClick={() => setShowInfo(null)} 
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}
    </div>
  );
};