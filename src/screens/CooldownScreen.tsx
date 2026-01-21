import React, { useState, useEffect } from 'react';
import { Play, Wind, ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface CooldownScreenProps {
  prompt: string;
  onComplete: () => void;
  initialTime: number; 
  onTick: (t: number) => void;
}

export const CooldownScreen: React.FC<CooldownScreenProps> = ({ prompt, onComplete, initialTime, onTick }) => {
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalSessionTime, setTotalSessionTime] = useState(initialTime);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

  useEffect(() => {
    fetchCooldownRoutine();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
        setTotalSessionTime((total) => {
           const newTotal = total + 1;
           onTick(newTotal); // Aktualisiert die Gesamtzeit in der App
           return newTotal;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleNext();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const fetchCooldownRoutine = async () => {
    setLoading(true);
    try {
      if (!API_KEY) throw new Error("Kein API Key");

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const fullPrompt = `${prompt} 
      Antworte AUSSCHLIESSLICH als JSON Array. 
      Format: [{"name": "Übungsname", "duration": 120}] 
      (duration in Sekunden). Keine Einleitung.`;

      const result = await model.generateContent(fullPrompt);
      const text = await result.response.text().replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        setExercises(parsed);
        setTimeLeft(parsed[0].duration || 60);
      } else {
        throw new Error("Format falsch");
      }
    } catch (error) {
      console.error("KI Fehler Cooldown:", error);
      setExercises([
        { name: "Pigeon Pose (Taube) - Rechts", duration: 60 },
        { name: "Pigeon Pose (Taube) - Links", duration: 60 },
        { name: "Couch Stretch (Hüftbeuger) - Rechts", duration: 60 },
        { name: "Couch Stretch (Hüftbeuger) - Links", duration: 60 },
        { name: "Kindhaltung (Child's Pose)", duration: 90 }
      ]);
      setTimeLeft(60);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeIndex < exercises.length - 1) {
      setActiveIndex(prev => prev + 1);
      setTimeLeft(exercises[activeIndex + 1].duration || 60);
    } else {
      onComplete(); // Training beenden
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-teal-50 px-6 text-center">
        <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-teal-800">Coach Andy plant deine Erholung...</h2>
      </div>
    );
  }

  const currentExercise = exercises[activeIndex];

  return (
    <div className="h-screen flex flex-col bg-teal-50 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-200 rounded-full blur-3xl opacity-40 translate-y-1/3 -translate-x-1/4"></div>

      <div className="relative z-10 px-6 pt-12 pb-6 flex items-center justify-center">
        <span className="text-xs font-black uppercase tracking-widest text-teal-600">Cooldown & Recovery</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-teal-100/50 w-full max-w-sm text-center border border-teal-100">
          
          <div className="w-20 h-20 bg-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-teal-500/30">
             <Wind className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-black text-slate-800 mb-2 leading-tight">{currentExercise.name}</h1>
          <p className="text-teal-500 font-medium mb-8 uppercase tracking-wider text-xs">Entspannung {activeIndex + 1} von {exercises.length}</p>

          <div className="text-6xl font-black text-slate-900 font-mono mb-8 tracking-tighter">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>

          {!isActive ? (
            <button 
              onClick={() => setIsActive(true)}
              className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold text-lg uppercase tracking-wide shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Play size={20} fill="currentColor" /> Starten
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-2 transition-all"
            >
               {activeIndex < exercises.length - 1 ? "Nächste Übung" : "Abschließen"}
            </button>
          )}
        </div>
        
        <div className="flex gap-2 mt-8">
          {exercises.map((_, idx) => (
            <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-teal-500' : 'w-2 bg-teal-200'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}