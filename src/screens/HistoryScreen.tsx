import React from 'react';
import { Calendar, Trash2, ChevronRight, BarChart3, Share2 } from 'lucide-react';
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

  // Detail View (wenn ein Eintrag angeklickt wurde)
  if (selectedEntry) {
    return (
      <div className="p-4 pb-32 min-h-screen bg-gray-50">
        <button onClick={onClearSelection} className="mb-4 text-sm font-bold text-gray-500 hover:text-gray-800">
          ← Zurück zur Übersicht
        </button>
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedEntry.workoutTitle}</h2>
          <p className="text-gray-400 text-sm mb-4">{formatDate(selectedEntry.date)} • {selectedEntry.totalDuration}</p>
          
          <div className="space-y-6">
            {selectedEntry.snapshot?.exercises?.map((ex: any, idx: number) => (
              <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <h4 className="font-bold text-gray-800 mb-2">{ex.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {ex.logs.map((log: any, lIdx: number) => (
                    <div key={lIdx} className={`px-3 py-1 rounded text-xs font-mono ${log.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                      {log.weight}kg x {log.reps}
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

  // List View
  return (
    <div className="p-4 pb-32 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Verlauf</h1>
        <button onClick={onExportCSV} className="text-blue-600 p-2 bg-blue-50 rounded-lg">
          <Share2 size={20} />
        </button>
      </div>

      {/* Mini Chart */}
      {chartData.length > 0 && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs font-bold uppercase tracking-wider">
            <BarChart3 size={14} /> Volumen Trend (Last 5)
          </div>
          <div className="h-24 flex items-end gap-2 justify-between px-2">
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1 w-full">
                <div 
                  className="w-full bg-blue-500 rounded-t-sm opacity-80 hover:opacity-100 transition-all"
                  style={{ height: `${d.height}%`, minHeight: '4px' }} 
                />
                <span className="text-[10px] text-gray-400 font-mono">{d.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-3">
        {history.length === 0 ? (
          <p className="text-center text-gray-400 py-10">Noch keine Workouts absolviert.</p>
        ) : (
          history.map((entry) => (
            <div 
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Calendar size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{entry.workoutTitle}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(entry.date)} • {entry.totalDuration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => onDeleteEntry(e, entry.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};