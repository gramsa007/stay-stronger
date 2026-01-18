import React from 'react';
import { Clock, Trophy, Trash2 } from 'lucide-react';

interface HistoryScreenProps {
  history: any[];
  onDeleteEntry: (id: number) => void;
  onSelectEntry: (entry: any) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ 
  history, 
  onDeleteEntry, 
  onSelectEntry 
}) => {
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: '2-digit'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      <div className="bg-slate-900 pt-12 pb-12 px-6 rounded-b-[3rem] shadow-xl">
        <h1 className="text-white text-2xl font-black italic uppercase tracking-tighter mb-2">Verlauf</h1>
        <div className="text-white font-mono text-sm opacity-80">{history.length} Workouts</div>
      </div>

      <div className="px-5 -mt-6 space-y-3">
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200 mt-4">
            <Trophy className="mx-auto text-gray-300 mb-3" size={30} />
            <p className="text-slate-500 font-bold text-sm">Noch keine Trainings absolviert.</p>
          </div>
        ) : (
          history.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              
              <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-500 font-bold">{formatDate(entry.date).split('.')[0]}</span>
                <span className="text-xs text-slate-900 font-black">{formatDate(entry.date).split('.')[1]}</span>
              </div>

              <div className="flex-1 min-w-0" onClick={() => onSelectEntry(entry)}>
                {/* HIER WURDE GEÄNDERT: text-slate-900 statt text-white */}
                <h3 className="text-sm font-black text-slate-900 truncate uppercase italic">
                  {entry.workoutTitle || "Freies Training"}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <Clock size={10} /> {entry.totalDuration || "0:00"}
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    {entry.type || "Training"}
                  </span>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if(window.confirm("Löschen?")) onDeleteEntry(entry.id);
                }}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};