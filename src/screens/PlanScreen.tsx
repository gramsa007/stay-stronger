import React from 'react';
import { Play, Eye, CheckCircle, Calendar, Target, ChevronRight } from 'lucide-react';

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
  const weeks = [1, 2, 3, 4];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      
      {/* --- HEADER (Dark Blue) --- */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-10 pb-12 px-6 rounded-b-[2.5rem] shadow-xl z-10 relative overflow-hidden text-center">
        {/* Glow */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <h1 className="text-3xl font-black text-white italic tracking-tighter mb-1 uppercase relative z-10">
          STAY FOCUSED
        </h1>
        <div className="inline-block mt-1 px-3 py-1 rounded-full border border-blue-800 bg-blue-900/50 backdrop-blur-sm">
          <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">
            Season 2026
          </span>
        </div>
      </div>

      {/* --- WEEK SELECTOR --- */}
      <div className="-mt-7 px-4 z-20 overflow-x-auto pb-4 scrollbar-hide flex justify-center">
        <div className="bg-white p-1.5 rounded-full shadow-lg border border-gray-100 inline-flex">
          {weeks.map(w => (
            <button
              key={w}
              onClick={() => setActiveWeek(w)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeWeek === w 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Woche {w}
            </button>
          ))}
        </div>
      </div>

      {/* --- WORKOUT LIST --- */}
      <div className="px-5 space-y-4 mt-4">
        {workouts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-3xl border border-gray-100 border-dashed mx-2">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Keine Workouts für Woche {activeWeek}.</p>
            <p className="text-xs mt-2 opacity-60">Importiere einen Plan im Profil.</p>
          </div>
        ) : (
          workouts.map((workout) => {
            const completed = isWorkoutCompleted(workout.id);
            return (
              <div 
                key={workout.id} 
                className={`relative overflow-hidden rounded-3xl p-1 transition-all group ${completed ? 'opacity-70 grayscale-[0.3]' : 'hover:scale-[1.01]'}`}
              >
                {/* Border / Background Accent */}
                <div className={`absolute inset-0 rounded-3xl ${completed ? 'bg-gray-200' : 'bg-gradient-to-br from-slate-100 to-blue-50 group-hover:from-slate-200 group-hover:to-blue-100'}`} />
                
                <div className="relative bg-white rounded-[1.3rem] p-5 h-full">
                   {/* Card Header */}
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${completed ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'}`}>
                             {completed ? 'Erledigt' : workout.type || 'Training'}
                          </span>
                        </div>
                        <h3 className="font-black text-xl text-gray-900 leading-tight">
                          {workout.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 font-medium flex items-center gap-2">
                          <Target size={14} />
                          {workout.focus}
                        </p>
                      </div>
                      
                      {/* Duration */}
                      <div className="text-center bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                        <span className="block text-xs font-bold text-gray-900">{parseInt(workout.duration) || 60}</span>
                        <span className="text-[9px] text-gray-400 uppercase font-bold">Min</span>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="flex gap-3 mt-4">
                      <button 
                        onClick={() => onPreviewWorkout(workout)}
                        className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 border border-gray-100"
                      >
                        <Eye size={16} /> Check
                      </button>
                      <button 
                        onClick={() => onStartWorkout(workout.id)}
                        className={`flex-[2] py-3 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
                            completed ? 'bg-green-600 shadow-green-200' : 'bg-slate-900 hover:bg-blue-900 shadow-slate-300'
                        }`}
                      >
                        {completed ? <CheckCircle size={18} /> : <Play size={18} fill="currentColor" />} 
                        {completed ? 'Wiederholen' : 'Starten'}
                      </button>
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};