import React, { useState, useEffect } from 'react';
import { Play, Timer, ChevronLeft, Loader2, RefreshCcw } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface WarmupScreenProps {
  prompt: string;
  onComplete: (totalTime: number) => void;
  onBack: () => void;
}

export const WarmupScreen: React.FC<WarmupScreenProps> = ({ prompt, onComplete, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(0); // Wird dynamisch gesetzt
  const [activeIndex, setActiveIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // API Key aus der Umgebungsvariable
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; 

  useEffect(() => {
    fetchWarmupRoutine();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      handleNext();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const fetchWarmupRoutine = async () => {
    setLoading(true);
    try {
      // FALLBACK: Falls kein API Key da ist, nutze eine Notfall-Liste (aber eine längere!)
      if (!API_KEY) throw new Error("Kein API Key");

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Wir zwingen die KI zu JSON
      const fullPrompt = `${prompt} 
      Antworte AUSSCHLIESSLICH als JSON Array. 
      Format: [{"name": "Übungsname", "duration": 90}] 
      (duration in Sekunden). Keine Einleitung, kein Markdown.`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text().replace(/```json|```/g, "").trim();
      
      const parsed = JSON.parse(text);
      
      // Sicherheits-Check: Ist es ein Array?
      if (Array.isArray(parsed) && parsed.length > 0) {
        setExercises(parsed);
        setTimeLeft(parsed[0].duration || 60);
      } else {
        throw new Error("Format falsch");
      }
    } catch (error) {
      console.error("KI Fehler, nutze Fallback:", error);
      // Fallback, falls die KI spinnt (damit du nicht leer ausgehst)
      setExercises([
        { name: "Laufen auf der Stelle (High Knees)", duration: 90 },
        { name: "Jumping Jacks (Hampelmänner)", duration: 90 },
        { name: "Armkreisen (Vorwärts/Rückwärts)", duration: 60 },
        { name: "Torso Twists", duration: 60 },
        { name: "Inchworms (Raupengang)", duration: 90 }
      ]);
      setTimeLeft(90);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeIndex < exercises.length - 1) {
      setActiveIndex(prev => prev + 1);
      setTimeLeft(exercises[activeIndex + 1].duration || 60);
    } else {
      // Fertig! Berechne Gesamtzeit für die Statistik
      const totalTime = exercises.reduce((acc, ex) => acc + (ex.duration || 60), 0);
      onComplete(totalTime);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-orange-50 px-6 text-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-orange-800">Coach Andy plant dein Warmup...</h2>
        <p className="text-sm text-orange-600 mt-2">"{prompt.slice(0, 50)}..."</p>
      </div>
    );
  }

  const currentExercise = exercises[activeIndex];

  return (
    <div className="h-screen flex flex-col bg-orange-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-6 flex items-center justify-between">
        <button onClick={onBack} className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors">
          <ChevronLeft className="w-6 h-6 text-orange-800" />
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-orange-400">Warmup Phase</span>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-orange-100/50 w-full max-w-sm text-center border border-orange-100">
          
          <div className="w-20 h-20 bg-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-orange-500/30 transform rotate-3">
             <Timer className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-black text-slate-800 mb-2 leading-tight">{currentExercise.name}</h1>
          <p className="text-orange-500 font-medium mb-8 uppercase tracking-wider text-xs">Übung {activeIndex + 1} von {exercises.length}</p>

          <div className="text-6xl font-black text-slate-900 font-mono mb-8 tracking-tighter">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>

          {!isActive ? (
            <button 
              onClick={() => setIsActive(true)}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg uppercase tracking-wide shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Play size={20} fill="currentColor" /> Starten
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-2 transition-all"
            >
               Nächste Übung
            </button>
          )}
        </div>
        
        {/* Progress Dots */}
        <div className="flex gap-2 mt-8">
          {exercises.map((_, idx) => (
            <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-orange-500' : 'w-2 bg-orange-200'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};