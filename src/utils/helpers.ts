// Zeit formatieren (z.B. 65 sek -> 1:05)
export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// NEU: Datum formatieren (z.B. für History Einträge)
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Streak Berechnung
export const getStreakStats = (history: any[]) => {
  if (!history || history.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const sortedDates = [...new Set(history.map(h => h.date.split('T')[0]))].sort();
  
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    if (i > 0) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffTime = Math.abs(curr.getTime() - prev.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    if (tempStreak > bestStreak) bestStreak = tempStreak;
  }

  const today = new Date().toISOString().split('T')[0];
  const lastWorkoutDate = sortedDates[sortedDates.length - 1];
  const diffToLast = Math.ceil(Math.abs(new Date(today).getTime() - new Date(lastWorkoutDate).getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffToLast <= 1) {
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }

  return { currentStreak, bestStreak };
};
