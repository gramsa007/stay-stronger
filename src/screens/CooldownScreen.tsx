import React, { useEffect } from 'react';
import { CheckCircle, Wind } from 'lucide-react';
import { triggerWorkoutFinishConfetti } from '../utils/confetti';

interface CooldownProps {
  prompt: string;
  onComplete: () => void;
  initialTime: number;
  onTick: (s: number) => void;
}

export const CooldownScreen: React.FC<CooldownProps> = ({ prompt, onComplete, initialTime, onTick }) => {
  
  // Timer weiterlaufen lassen für korrekte Gesamtdauer
  useEffect(() => {
    const timer = setInterval(() => {
      onTick(initialTime + 1); // Mutiert den State in App.tsx
    }, 1000);
    return () => clearInterval(timer);
  });

  return (
    <div className="flex flex-col h-screen bg-teal-50 relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
        <div className="w-20 h-20 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 -rotate-3">
          <Wind className="text-white w-10 h-10" />
        </div>
        
        <h2 className="text-3xl font-black text-teal-900 mb-2 text-center">Cool Down</h2>
        <p className="text-teal-700/80 text-center max-w-xs mb-8">
          Tief durchatmen. Senke deine Herzfrequenz.
        </p>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl w-full max-w-sm shadow-sm border border-teal-100 mb-8">
           <ul className="space-y-3 text-teal-900 font-medium">
              <li className="flex items-center gap-3"><span className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center text-xs">1</span> Kindhaltung (60s)</li>
              <li className="flex items-center gap-3"><span className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center text-xs">2</span> Dehnung Brust (30s)</li>
              <li className="flex items-center gap-3"><span className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center text-xs">3</span> Tiefes Atmen</li>
            </ul>
        </div>

        <button 
          onClick={onComplete}
          className="w-full max-w-xs bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <CheckCircle size={20} /> Workout Abschließen
        </button>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};