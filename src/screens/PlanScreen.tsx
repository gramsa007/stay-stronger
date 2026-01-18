import React from 'react';
import { Play, Eye, CheckCircle, Lock } from 'lucide-react';

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
  // Wochen-Selector (Beispiel: 4 Wochen)
  const weeks = [1, 2, 3, 4];

  return (
    <div className="p-4 pb-32 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 px-2">Dein Trainingsplan</h1>

      {/* Week Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 px-2 snap-x">
        {weeks.map(w => (
          <button
            key={w}
            onClick={() => setActiveWeek(w)}
            className={`flex-shrink-0 px-5 py-2 rounded-full font-bold text-sm transition-all snap-start ${
              activeWeek === w 
                ? 'bg-blue-600 text-white shadow-md scale-105' 
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            Woche {w}
          </button>
        ))}
      </div>

      {/* Workouts List */}
      <div className="space-y-4">
        {workouts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>Keine Workouts für Woche {activeWeek} gefunden.</p>
            <p className="text-sm mt-2">Importiere einen Plan im Profil.</p>
          </div>
        ) : (
          workouts.map((workout) => {
            const completed = isWorkoutCompleted(workout.id);
            return (
              <div 
                key={workout.id} 
                className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all ${completed ? 'opacity-75 bg-gray-50' : 'hover:shadow-md'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      {workout.title}
                      {completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{workout.focus} • {workout.duration || 'ca. 60 Min'}</p>
                  </div>
                  <div className="bg-blue-50 text-blue-700 font-mono text-xs font-bold px-2 py-1 rounded">
                    {workout.type || 'Strength'}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => onPreviewWorkout(workout)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-200"
                  >
                    <Eye size={16} /> Vorschau
                  </button>
                  <button 
                    onClick={() => onStartWorkout(workout.id)}
                    className="flex-[2] py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    <Play size={16} fill="currentColor" /> {completed ? 'Nochmal' : 'Starten'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};