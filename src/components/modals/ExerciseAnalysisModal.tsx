import React from 'react';
import { X, TrendingUp } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

interface AnalysisProps {
  onClose: () => void;
  exerciseName: string;
  history: any[];
}

export const ExerciseAnalysisModal: React.FC<AnalysisProps> = ({ onClose, exerciseName, history }) => {
  // Extrahiere Daten für diese Übung
  const dataPoints = history
    .map(h => {
      if (!h.snapshot || !h.snapshot.exercises) return null;
      const ex = h.snapshot.exercises.find((e: any) => e.name === exerciseName);
      if (!ex) return null;
      
      // Berechne "Max Weight" für diesen Tag
      const maxWeight = Math.max(...ex.logs.map((l: any) => parseFloat(l.weight) || 0));
      return { date: h.date, weight: maxWeight };
    })
    .filter(d => d && d.weight > 0)
    .reverse(); // Älteste zuerst

  // Max-Wert für Chart-Skalierung
  const overallMax = Math.max(...dataPoints.map((d: any) => d.weight), 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[80vh]">
        <div className="bg-white p-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg text-gray-900">{exerciseName}</h2>
            <p className="text-xs text-gray-500">Fortschrittsanalyse (Max. Gewicht)</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20} /></button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {dataPoints.length < 2 ? (
            <div className="text-center py-10 text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Noch nicht genügend Daten für eine Analyse.</p>
              <p className="text-xs mt-1">Trainiere öfter, um Charts zu sehen!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Simple Chart Visualization */}
              <div className="h-48 flex items-end justify-between gap-2 px-2 border-b border-gray-100 pb-2">
                {dataPoints.map((pt: any, i: number) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1 group relative">
                     {/* Tooltip */}
                     <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {formatDate(pt.date)}: {pt.weight}kg
                     </div>
                    <div 
                      className="w-full bg-blue-500 rounded-t-md opacity-80 hover:opacity-100 transition-all min-h-[4px]"
                      style={{ height: `${(pt.weight / overallMax) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 px-2">
                <span>Start</span>
                <span>Aktuell</span>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <span className="block text-xs text-gray-500 uppercase">Bestwert</span>
                  <span className="text-xl font-bold text-blue-600">{overallMax} kg</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <span className="block text-xs text-gray-500 uppercase">Trainings</span>
                  <span className="text-xl font-bold text-gray-800">{dataPoints.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};