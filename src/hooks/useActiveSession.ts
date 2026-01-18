import { useState, useEffect, useRef } from 'react';

export const useActiveSession = () => {
  const [phase, setPhase] = useState<'idle' | 'warmup' | 'training' | 'cooldown'>('idle');
  const [activeWorkoutData, setActiveWorkoutData] = useState<any>(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRestActive, setIsRestActive] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [activeRestContext, setActiveRestContext] = useState<any>(null);
  const timerRef = useRef<number | null>(null);
  const restTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== 'idle' && phase !== 'cooldown') {
      timerRef.current = window.setInterval(() => setTotalSeconds(s => s + 1), 1000);
    } else if (timerRef.current) clearInterval(timerRef.current);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (isRestActive && restSeconds > 0) {
      restTimerRef.current = window.setInterval(() => {
        setRestSeconds(s => {
          if (s <= 1) {
            setIsRestActive(false);
            if (restTimerRef.current) clearInterval(restTimerRef.current);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (restTimerRef.current) clearInterval(restTimerRef.current); };
  }, [isRestActive, restSeconds]);

  const startSession = (workout: any) => {
    const initializedExercises = workout.exercises.map((ex: any) => ({
      ...ex,
      logs: Array.from({ length: parseInt(ex.sets) || 1 }, () => ({ weight: '', reps: ex.reps || '', completed: false }))
    }));
    setActiveWorkoutData({ ...workout, exercises: initializedExercises });
    setTotalSeconds(0);
    setPhase('warmup');
  };

  const skipRest = () => {
    setIsRestActive(false);
    setRestSeconds(0);
    if (restTimerRef.current) clearInterval(restTimerRef.current);
  };

  const handleInputChange = (exIdx: number, setIdx: number, field: string, value: string) => {
    const newData = { ...activeWorkoutData };
    newData.exercises[exIdx].logs[setIdx][field] = value;
    setActiveWorkoutData(newData);
  };

  const toggleSetComplete = (exIdx: number, setIdx: number) => {
    const newData = { ...activeWorkoutData };
    const currentSet = newData.exercises[exIdx].logs[setIdx];
    currentSet.completed = !currentSet.completed;
    if (currentSet.completed) {
      const pauseTime = newData.exercises[exIdx].rest ? parseInt(newData.exercises[exIdx].rest) : 60;
      setActiveRestContext({ exerciseName: newData.exercises[exIdx].name });
      setRestSeconds(pauseTime);
      setIsRestActive(true);
    } else setIsRestActive(false);
    setActiveWorkoutData(newData);
  };

  const endSession = () => { setPhase('idle'); setActiveWorkoutData(null); setTotalSeconds(0); setIsRestActive(false); };

  return { phase, setPhase, activeWorkoutData, totalSeconds, setTotalSeconds, startSession, endSession, handleInputChange, toggleSetComplete, isRestActive, restSeconds, activeRestContext, skipRest };
};