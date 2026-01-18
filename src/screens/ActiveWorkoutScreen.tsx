import React, { useState } from 'react';
import { Timer, CheckCircle, X, ArrowRight, Wind, BarChart2 } from 'lucide-react';

export const ActiveWorkoutScreen = ({ 
  activeWorkoutData, 
  totalSeconds, 
  setTotalSeconds, 
  onFinishWorkout, 
  onBackRequest,
  handleInputChange,
  toggleSetComplete,
  onAnalysisRequest 
}: any) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      {/* --- Header mit Timer (Original Look) --- */}
      <div className="bg-slate-900 pt-10 pb-12 px-6 rounded-b-[2.5rem] shadow-xl text-center text-white relative">
        <button 
          onClick={onBackRequest}
          className="absolute top-10 left-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-black italic tracking-tighter uppercase opacity-70 mb-1">
          {activeWorkoutData.title}
        </h2>
        <div className="text-5xl font-mono font-black text-blue-400">
          {formatTime(totalSeconds)}
        </div>
      </div>

      {/* --- Die originale Trainingsübersicht --- */}
      <div className="px-5 mt-6 space-y-6">
        {activeWorkoutData.exercises.map((exercise: any, exIdx: number) => (
          <div key={exIdx} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-lg text-gray-900 leading-tight">{exercise.name}</h3>
                <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-wider">
                  {exercise.sets} Sätze à {exercise.reps} Reps • RPE {exercise.rpe}
                </p>
              </div>
              <button 
                onClick={() => onAnalysisRequest(exercise.name)}
                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <BarChart2 size={18} />
              </button>
            </div>

            {/* Log-Bereich (Gewicht & Reps) */}
            <div className="space-y-2">
              {exercise.logs.map((log: any, setIdx: number) => (
                <div key={setIdx} className={`flex items-center gap-2 p-2 rounded-2xl transition-all ${log.completed ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'} border`}>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black text-gray-400 border border-gray-100">
                    {setIdx + 1}
                  </div>
                  <input
                    type="number"
                    placeholder="kg"
                    value={log.weight}
                    onChange={(e) => handleInputChange(exIdx, setIdx, 'weight', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                  />
                  <input
                    type="number"
                    placeholder="reps"
                    value={log.reps}
                    onChange={(e) => handleInputChange(exIdx, setIdx, 'reps', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                  />
                  <button
                    onClick={() => toggleSetComplete(exIdx, setIdx)}
                    className={`w-12 h-10 rounded-xl flex items-center justify-center transition-all ${
                      log.completed ? 'bg-green-500 text-white' : 'bg-white text-gray-300 border border-gray-200'
                    }`}
                  >
                    <CheckCircle size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- Fester Button unten --- */}
      <div className="fixed bottom-24 left-0 right-0 px-6 flex justify-center z-40">
        <button 
          onClick={() => setShowConfirm(true)}
          className="w-full max-w-md py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 transition-transform active:scale-95"
        >
          <CheckCircle size={20} /> WORKOUT BEENDEN
        </button>
      </div>

      {/* --- Schickes Confirm Modal --- */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-xs rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden animate-in zoom-in-95">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind size={32} />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Cooldown starten?</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Hervorragende Arbeit! Möchtest du das Training abschließen und die Regeneration einleiten?
              </p>
            </div>
            <div className="flex border-t border-slate-800">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-5 text-slate-500 font-bold text-sm hover:bg-slate-850"
              >
                Weiter trainieren
              </button>
              <button 
                onClick={() => { setShowConfirm(false); onFinishWorkout(); }}
                className="flex-1 py-5 bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 flex items-center justify-center gap-2"
              >
                Ab zum Cooldown <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};