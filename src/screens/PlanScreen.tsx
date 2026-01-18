import React, { useState } from 'react';
import { Play, Eye, CheckCircle, Calendar, Target, Info, X } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      
      {/* --- Altes Header Design --- */}
      <div className="bg-slate-900 pt-10 pb-12 px-6 rounded-b-[2.5rem] shadow-xl text-center">
        <h1 className="text-3xl font-black text-white italic tracking-tighter mb-1 uppercase">
          STAY FOCUSED
        </h1>
      </div>

      {/* --- Wochen Auswahl --- */}
      <div className="-mt-7 px-4 z-20 flex justify-center overflow-x-auto pb-4">
        <div className="bg-white p-1.5 rounded-full shadow-lg border border-gray-100 inline-flex">
          {weeks.map(w => (
            <button
              key={w}
              onClick={() => setActiveWeek(w)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeWeek === w ? 'bg-slate-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Woche {w}
            </button>
          ))}
        </div>
      </div>

      {/* --- Workout Liste im gewohnten Stil --- */}
      <div className="px-5 space-y-4 mt-4">
        {workouts.map((workout) => {
          const completed = isWorkoutCompleted(workout.id);
          return (
            <div key={workout.id} className="relative bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {workout.type}
                    </span>
                    
                    {/* Besser sichtbares Info Icon */}
                    <button 
                      onClick={() => setShowInfo(workout.title.includes("EMOM") ? "EMOM" : workout.type)}
                      className="bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-all shadow-sm"
                    >
                      <Info size={12} strokeWidth={3} />
                    </button>
                  </div>
                  <h3 className="font-black text-xl text-gray-900">{workout.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <Target size={14} /> {workout.focus}
                  </p>
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 text-center min-w-[50px]">
                  <span className="block text-xs font-bold text-gray-900">{workout.duration}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => onPreviewWorkout(workout)} className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100">
                  Check
                </button>
                <button 
                  onClick={() => onStartWorkout(workout.id)}
                  className={`flex-[2] py-3 text-white rounded-xl font-bold text-sm shadow-lg transition-transform active:scale-95 ${
                    completed ? 'bg-green-600' : 'bg-slate-900'
                  }`}
                >
                  {completed ? 'Wiederholen' : 'Starten'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Info Modal --- */}
      {showInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 text-blue-600">
              <div className="flex items-center gap-2">
                <Info size={20} />
                <h2 className="text-xl font-black">{showInfo}</h2>
              </div>
              <button onClick={() => setShowInfo(null)} className="p-1 bg-gray-100 rounded-full text-gray-400"><X size={20}/></button>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed font-medium bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              {typeDescriptions[showInfo] || "Keine Beschreibung verfügbar."}
            </p>
            <button onClick={() => setShowInfo(null)} className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl">Alles klar!</button>
          </div>
        </div>
      )}
    </div>
  );
};