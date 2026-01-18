import React, { useState, useEffect } from 'react';
import { ChevronLeft, Zap, Play } from 'lucide-react';

interface WarmupProps {
  prompt: string;
  onComplete: (elapsed: number) => void;
  onBack: () => void;
}

export const WarmupScreen: React.FC<WarmupProps> = ({ prompt, onComplete, onBack }) => {
  const [seconds, setSeconds] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false); // Simuliert KI-Generierung

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    // Simuliere Ladezeit für den "KI"-Plan (kosmetisch)
    const timeout = setTimeout(() => setIsGenerated(true), 1500);
    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="flex flex-col h-screen bg-orange-50 relative overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between z-10">
        <button onClick={onBack} className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors">
          <ChevronLeft className="text-orange-900" />
        </button>
        <div className="font-mono text-orange-800 font-bold bg-orange-100 px-3 py-1 rounded-full">
          {formatTime(seconds)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
        <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 rotate-3">
          <Zap className="text-white w-10 h-10" />
        </div>
        
        <h2 className="text-3xl font-black text-orange-900 mb-2 text-center">Let's get warm!</h2>
        <p className="text-orange-700/80 text-center max-w-xs mb-8">
          {isGenerated 
            ? "Dein Warmup ist bereit. Fokus auf Mobilität und Herzfrequenz." 
            : "Analysiere Muskelgruppen..."}
        </p>

        {isGenerated ? (
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl w-full max-w-sm shadow-sm border border-orange-100 mb-8 animate-in slide-in-from-bottom-5">
            <ul className="space-y-3 text-orange-900 font-medium">
              <li className="flex items-center gap-3"><span className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center text-xs">1</span> Hampelmänner (60s)</li>
              <li className="flex items-center gap-3"><span className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center text-xs">2</span> Armkreisen (30s)</li>
              <li className="flex items-center gap-3"><span className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center text-xs">3</span> Torso Twists (30s)</li>
            </ul>
          </div>
        ) : (
          <div className="animate-pulse flex flex-col gap-2 w-full max-w-sm mb-8">
            <div className="h-12 bg-orange-200/50 rounded-xl w-full"></div>
            <div className="h-12 bg-orange-200/50 rounded-xl w-full"></div>
            <div className="h-12 bg-orange-200/50 rounded-xl w-full"></div>
          </div>
        )}

        <button 
          onClick={() => onComplete(seconds)}
          className="w-full max-w-xs bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          Training Starten <Play size={20} fill="currentColor" />
        </button>
      </div>

      {/* Background Deko */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-50 pointer-events-none" />
    </div>
  );
};