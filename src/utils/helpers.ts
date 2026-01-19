export const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getStreakStats = (history: any[]) => {
  // Sicherheits-Check: Absturz verhindern, wenn history leer ist
  if (!history || !Array.isArray(history) || history.length === 0) {
    return { current: 0, best: 0 };
  }

  try {
    // 1. Alle Trainings-Tage sammeln (ohne Uhrzeit)
    const uniqueDays = [...new Set(history.map(h => {
      try { return new Date(h.date).toDateString(); } 
      catch { return null; }
    }))].filter(d => d);

    const sortedDates = uniqueDays
      .map(d => new Date(d as string))
      .sort((a, b) => b.getTime() - a.getTime());

    if (sortedDates.length === 0) return { current: 0, best: 0 };

    // --- Current Streak ---
    let current = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWorkout = sortedDates[0];
    
    if (lastWorkout.getTime() === today.getTime() || lastWorkout.getTime() === yesterday.getTime()) {
      current = 1;
      let prevDate = lastWorkout;
      
      for (let i = 1; i < sortedDates.length; i++) {
        const expectedDate = new Date(prevDate);
        expectedDate.setDate(expectedDate.getDate() - 1);
        
        if (sortedDates[i].getTime() === expectedDate.getTime()) {
          current++;
          prevDate = sortedDates[i];
        } else {
          break; 
        }
      }
    }

    // --- Best Streak ---
    let best = 0;
    let tempStreak = 1;
    
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const diffDays = Math.ceil(Math.abs(sortedDates[i].getTime() - sortedDates[i+1].getTime()) / (1000 * 60 * 60 * 24)); 
      if (diffDays === 1) tempStreak++;
      else {
        if (tempStreak > best) best = tempStreak;
        tempStreak = 1;
      }
    }
    if (tempStreak > best) best = tempStreak;
    if (best === 0 && sortedDates.length > 0) best = 1;
    if (current > best) best = current;

    // WICHTIG: Hier müssen die Namen 'current' und 'best' sein!
    return { current, best };

  } catch (error) {
    return { current: 0, best: 0 };
  }
};
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Formatiert das Datum nach deutschem Standard (z.B. 19.01.2026)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};