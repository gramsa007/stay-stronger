import React, { useState } from 'react';
import { History, Trash2, Calendar, Clock, AlertTriangle, X } from 'lucide-react';

export const HistoryScreen = ({ history, onDeleteEntry }: any) => {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      <div className="bg-slate-900 pt-10 pb-12 px-6 rounded-b-[2.5rem] shadow-xl text-center text-white">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Dein Verlauf</h1>
      </div>

      <div className="px-5 mt-6 space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">Noch keine Workouts absolviert. 💪</div>
        ) : (
          history.map((entry: any) => (
            <div key={entry.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-black text-gray-900">{entry.workoutTitle}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 font-bold">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(entry.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {entry.totalDuration}</span>
                </div>
              </div>
              <button 
                onClick={() => setDeleteId(entry.id)}
                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Coach-Andy Style Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-xs rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden animate-in zoom-in-95">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Eintrag löschen?</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Diese Aktion kann nicht rückgängig gemacht werden. Dein Fortschritt für dieses Training geht verloren.
              </p>
            </div>
            <div className="flex border-t border-slate-800">
              <button 
                onClick={() => setDeleteId(null)}
                className="flex-1 py-5 text-slate-500 font-bold text-sm hover:bg-slate-850"
              >
                Behalten
              </button>
              <button 
                onClick={() => { onDeleteEntry(deleteId); setDeleteId(null); }}
                className="flex-1 py-5 bg-red-600 text-white font-bold text-sm hover:bg-red-500"
              >
                Endgültig löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};