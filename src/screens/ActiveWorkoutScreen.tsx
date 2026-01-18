import React from 'react';
import { Clock, ChevronLeft, CheckCircle, Circle, BarChart2 } from 'lucide-react';
import { formatTime } from '../utils/helpers';

// WICHTIG: Dieses Interface löst den "IntrinsicAttributes" Fehler in App.tsx
interface ActiveWorkoutProps {
  activeWorkoutData: any;
  totalSeconds: number;
  setTotalSeconds: (s: number) => void;
  history: any[];
  onBackRequest: () => void;
  onFinishWorkout: () => void;
  onAnalysisRequest: (name: string) => void;
  handleInputChange: (exIdx: number, setIdx: number, field: string, val: string) => void;
  toggleSetComplete: (exIdx: number, setIdx: number) => void;
  isRestActive: boolean;
  restSeconds: number;
  activeRestContext: any;
  ExitDialogComponent: React.ReactNode;
  AnalysisModalComponent: React.ReactNode;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutProps> = ({
  activeWorkoutData,
  totalSeconds,
  onBackRequest,
  onFinishWorkout,
  onAnalysisRequest,
  handleInputChange,
  toggleSetComplete,
  isRestActive,
  restSeconds,
  ExitDialogComponent,
  AnalysisModalComponent
}) => {
  
  const renderExercise = (exercise: any, exIndex: number) => (
    <div key={exIndex} className="mb-6 bg-white p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg text-gray-800">{exercise.name}</h3>
        <button 
          onClick={() => onAnalysisRequest(exercise.name)}
          className="text-gray-400 hover:text-blue-600"
        >
          <BarChart2 size={20} />
        </button>
      </div>
      
      <div className="space-y-3">
        {exercise.logs.map((set: any, setIndex: number) => (
          <div key={setIndex} className={`flex items-center gap-3 p-2 rounded-lg ${set.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
            <span className="w-6 text-center text-gray-400 font-mono text-sm">{setIndex + 1}</span>
            
            <input 
              type="text" 
              placeholder="kg"
              value={set.weight}
              onChange={(e) => handleInputChange(exIndex, setIndex, 'weight', e.target.value)}
              className="w-20 p-2 border rounded text-center"
            />
            <span className="text-gray-400">x</span>
            <input 
              type="text" 
              placeholder="Reps"
              value={set.reps}
              onChange={(e) => handleInputChange(exIndex, setIndex, 'reps', e.target.value)}
              className="w-20 p-2 border rounded text-center"
            />
            
            <button 
              onClick={() => toggleSetComplete(exIndex, setIndex)}
              className={`ml-auto p-2 rounded-full ${set.completed ? 'text-green-600 bg-green-200' : 'text-gray-300 hover:bg-gray-200'}`}
            >
              {set.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {ExitDialogComponent}
      {AnalysisModalComponent}

      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBackRequest} className="p-2 -ml-2 text-gray-600">
          <ChevronLeft />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-gray-900">{activeWorkoutData.title}</h1>
          <div className="flex items-center gap-1 text-sm font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            <Clock size={14} />
            <span>{formatTime(totalSeconds)}</span>
          </div>
        </div>
        <div className="w-8" />
      </div>

      {isRestActive && (
        <div className="bg-blue-600 text-white p-2 text-center font-bold animate-pulse sticky top-[70px] z-20 shadow-md">
          Pause: {formatTime(restSeconds)}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {activeWorkoutData.exercises.map((ex: any, idx: number) => renderExercise(ex, idx))}
        
        <button 
          onClick={onFinishWorkout}
          className="w-full mt-8 bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition-all"
        >
          Workout Beenden
        </button>
      </div>
    </div>
  );
};