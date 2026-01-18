import React from 'react';
import { Calendar, Trash2, ChevronRight, BarChart3, Share2, History as HistoryIcon } from 'lucide-react';
import { formatDate } from '../utils/helpers';

interface HistoryProps {
  history: any[];
  selectedEntry: any;
  chartData: any[];
  onSelectEntry: (entry: any) => void;
  onClearSelection: () => void;
  onDeleteEntry: (e: any, id: number) => void;
  onExportCSV: () => void;
  onAnalysisRequest: (name: string) => void;
}

export const HistoryScreen: React.FC<HistoryProps> = ({
  history, selectedEntry, chartData, onSelectEntry, onClearSelection, onDeleteEntry, onExportCSV
}) => {

  // Detail View (Same as before but with minor polish)
  if (selectedEntry) {
    return (
      <div className="p-4 pb-32 min-h-screen bg-gray-50">
        <button onClick={onClearSelection} className="mb-4 text-sm font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1">
           ← Zurück
        </button>
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
             <h2 className="text-2xl font-black text-gray-900 leading-tight">{selectedEntry.workoutTitle}</h2>
             <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">{selectedEntry.type}</span>
          </div>
          <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">
            <Calendar size={14}/> {formatDate(selectedEntry.date)} • {selectedEntry.totalDuration}
          </p>
          
          <div className="space-y-6">
            {selectedEntry.snapshot?.exercises?.map((ex: any, idx: number) => (
              <div key={idx} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                <h4 className="font-bold text-gray-800 mb-3">{ex.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {ex.logs.map((log: any, lIdx: number) => (
                    <div key={lIdx} className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${log.completed ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-50 text-gray-400'}`}>
                      {log.weight}kg <span className="text-gray-400 font-light">x</span> {log.reps}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main List View
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      
      {/* --- HEADER (Dark Blue) --- */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-8 pb-8 px-6 rounded-b-[2.5rem] shadow-xl z-10 text-center relative overflow-hidden">
         {/* Glow */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
         
         <div className="flex items-center justify-center gap-2 mb-1">
            <HistoryIcon className="text-white/80" size={24} />
            <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">
              HISTORY
            </h1>
         </div>
         <p className="text-white/60 text-sm font-medium">Dein Fortschritt</p>
         
         <button onClick={onExportCSV} className="absolute right-6 top-8 text-white/50 hover:text-white transition-colors">
            <Share2 size={20} />
         </button>
      </div>

      {/* --- CONTENT --- */}
      <div className="px-6 mt-6 space-y-6">

        {/* Mini Chart */}
        {chartData.length > 0 && (
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              <BarChart3 size={14} /> Volumen Trend (Last 5)
            </div>
            <div className="h-24 flex items-end gap-2 justify-between px-2">
              {chartData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1 w-full group">
                  <div 
                    className="w-full bg-slate-800 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all group-hover:bg-blue-600"
                    style={{ height: `${d.height}%`, minHeight: '4px' }} 
                  />
                  <span className="text-[9px] text-gray-300 font-mono">{d.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
                <p>Noch keine Workouts absolviert.</p>
            </div>
          ) : (
            history.map((entry) => (
              <div 
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-blue-100 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 font-bold text-xs flex-col leading-none border border-slate-100">
                     <span className="text-[10px] text-slate-400 uppercase">{new Date(entry.date).toLocaleString('default', { month: 'short' })}</span>
                     <span className="text-lg">{new Date(entry.date).getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{entry.workoutTitle}</h4>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{entry.totalDuration} • {entry.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteEntry(e, entry.id); }}
                    className="p-2 text-gray-300 hover:text-red-500 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};