import { useState, useEffect, useRef } from 'react';

export const useActiveSession = () => {
  const [phase, setPhase] = useState<'idle' | 'warmup' | 'training' | 'cooldown'>('idle');
  const [activeWorkoutData, setActiveWorkoutData] = useState<any>(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  
  // Rest Timer Logic
  const [isRestActive, setIsRestActive] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [activeRestContext, setActiveRestContext] = useState<any>(null); // Welcher Satz hat Pause ausgelöst?

  const timerRef = useRef<any>(null);

  // Der Haupt-Timer der Session
  useEffect(() => {
    if (phase !== 'idle') {
      timerRef.current = setInterval(() => {
        setTotalSeconds(s => s + 1);
        
        // Wenn Rest aktiv ist, diesen runterzählen
        if (isRestActive) {
          setRestSeconds(r => {
            if (r <= 1) {
              setIsRestActive(false); // Pause vorbei
              return 0;
            }
            return r - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, isRestActive]);

  const startSession = (workout: any) => {
    // Deep copy um State-Probleme zu vermeiden
    const workoutCopy = JSON.parse(JSON.stringify(workout));
    // Initialisiere logs falls nicht vorhanden
    workoutCopy.exercises.forEach((ex: any) => {
       if(!ex.logs || ex.logs.length === 0) {
           // Erstelle leere Logs basierend auf Sets
           ex.logs = Array(parseInt(ex.sets || 3)).fill({ weight: '', reps: '', completed: false });
       }
    });

    setActiveWorkoutData(workoutCopy);
    setTotalSeconds(0);
    setPhase('warmup'); // Startet immer mit Warmup, kann in App.tsx übersprungen werden wenn gewünscht
  };

  const endSession = () => {
    setPhase('idle');
    setActiveWorkoutData(null);
    setTotalSeconds(0);
    setIsRestActive(false);
  };

  const handleInputChange = (exIdx: number, setIdx: number, field: string, val: string) => {
    if (!activeWorkoutData) return;
    const newData = { ...activeWorkoutData };
    newData.exercises[exIdx].logs[setIdx][field] = val;
    setActiveWorkoutData(newData);
  };

  const toggleSetComplete = (exIdx: number, setIdx: number) => {
    if (!activeWorkoutData) return;
    const newData = { ...activeWorkoutData };
    const currentStatus = newData.exercises[exIdx].logs[setIdx].completed;
    
    newData.exercises[exIdx].logs[setIdx].completed = !currentStatus;
    setActiveWorkoutData(newData);

    // Wenn wir den Satz auf "completed" setzen, starten wir den Rest Timer
    if (!currentStatus) {
      const defaultRest = 90; // Standard 90s Pause, könnte aus Übung kommen
      setRestSeconds(defaultRest);
      setIsRestActive(true);
      setActiveRestContext({ exIdx, setIdx });
    } else {
      // Wenn wir "unchecken", brechen wir die Pause ab, falls es genau dieser Satz war
      if (activeRestContext?.exIdx === exIdx && activeRestContext?.setIdx === setIdx) {
        setIsRestActive(false);
      }
    }
  };

  return {
    phase, setPhase,
    activeWorkoutData,
    totalSeconds, setTotalSeconds,
    startSession, endSession,
    handleInputChange, toggleSetComplete,
    isRestActive, restSeconds, activeRestContext
  };
};