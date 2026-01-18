import React, { useState } from 'react';
import { X, ArrowRight, Wind, BarChart2, Coffee, FastForward, CheckCircle } from 'lucide-react';

export const ActiveWorkoutScreen = ({ activeWorkoutData, totalSeconds, onFinishWorkout, onBackRequest, handleInputChange, toggleSetComplete, onAnalysisRequest, isRestActive, restSeconds, activeRestContext, onSkipRest }: any) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      {isRestActive && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in">
          <div className="mb-4 text-blue-500 animate-pulse"><Coffee size={40} /></div>
          <h2 className="text-blue-500 text-2xl font-black italic tracking-widest uppercase mb-2">Pause</h2>
          <div className="text-[120px] font-mono font-black text-white leading-none mb-8">{restSeconds}<span className="text-4xl ml-2">s</span></div>
          <div className="text-center mb-12">
            <p className="text-slate-500 text-xs font-black uppercase mb-1">Nächster Satz</p>
            <p className="text-white text-xl font-bold italic">{activeRestContext?.exerciseName}</p>
          </div>
          <button onClick={onSkipRest} className="flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-white font-black uppercase tracking-widest text-sm hover:bg-white/10">
            <FastForward size={20} className="text-blue-400" /> Pause überspringen
          </button>
        </div>
      )}

      <div className="bg-slate-900 pt-12 pb-14 rounded-b-[3rem] shadow-2xl text-center text-white relative">
        <button onClick={onBackRequest} className="absolute top-12 left-6 p-2 bg-white/10 rounded-full"><X size={20} /></button>
        <h2 className="text-sm font-black italic tracking-widest uppercase text-blue-400/60 mb-2">{activeWorkoutData.title}</h2>
        <div className="text-6xl font-mono font-black text-white">{formatTime(totalSeconds)}</div>
      </div>

      <div className="px-5 mt-8 space-y-6">
        {activeWorkoutData.exercises.map((exercise: any, exIdx: number) => (
          <div key={exIdx} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-black text-xl text-slate-900 italic uppercase">{exercise.name}</h3>
                <p className="text-[10px] text-blue-600 mt-1 font-black uppercase tracking-widest">{exercise.sets} Sätze • {exercise.reps} Reps</p>
              </div>
              <button onClick={() => onAnalysisRequest(exercise.name)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><BarChart2 size={20} /></button>
            </div>
            <div className="space-y-3">
              {exercise.logs.map((log: any, setIdx: number) => (
                <div key={setIdx} className={`flex items-center gap-3 p-2 rounded-[1.5rem] border ${log.completed ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${log.completed ? 'bg-green-500 text-white' : 'bg-white text-slate-400'}`}>{setIdx + 1}</div>
                  <div className="flex-1 flex gap-2">
                    <input type="number" placeholder="kg" value={log.weight} onChange={(e) => handleInputChange(exIdx, setIdx, 'weight', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-black text-slate-900 outline-none" />
                    <input type="number" placeholder="reps" value={log.reps} onChange={(e) => handleInputChange(exIdx, setIdx, 'reps', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-black text-slate-900 outline-none" />
                  </div>
                  <button onClick={() => toggleSetComplete(exIdx, setIdx)} className={`w-14 h-12 rounded-xl flex items-center justify-center shadow-md ${log.completed ? 'bg-green-500 text-white' : 'bg-white text-slate-200 border border-slate-200'}`}><CheckCircle size={24} fill={log.completed ? "white" : "transparent"} /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-28 left-0 right-0 px-8 flex justify-center z-40">
        <button onClick={() => setShowConfirm(true)} className="w-full max-w-md py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl uppercase tracking-widest italic">Workout Beenden</button>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-xs rounded-[3rem] shadow-2xl border border-slate-800 text-white p-8 text-center">
            <h3 className="text-2xl font-black mb-2 italic uppercase">Fertig?</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium">Willst du dein Training abschließen?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-4 text-slate-500 font-bold text-xs uppercase">Abbrechen</button>
              <button onClick={() => { setShowConfirm(false); onFinishWorkout(); }} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase">Beenden</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};