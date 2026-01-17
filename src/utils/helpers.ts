export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
};

export const prepareData = (rawData: any) => {
  if (!rawData || !rawData.weeks) {
    console.warn("Ungültige Datenstruktur empfangen. Fallback wird genutzt.");
    return null;
  }
  const processedWeeks = rawData.weeks.map((week: any, wIndex: number) => ({
    id: week.id || `week-${wIndex}`,
    title: week.title || `Woche ${wIndex + 1}`,
    days: (week.days || []).map((day: any, dIndex: number) => ({
      id: day.id || `day-${wIndex}-${dIndex}`,
      title: day.title || `Tag ${dIndex + 1}`,
      focus: day.focus || "Allgemein",
      exercises: (day.exercises || []).map((ex: any, eIndex: number) => ({
        id: ex.id || `ex-${wIndex}-${dIndex}-${eIndex}`,
        name: ex.name || "Übung",
        sets: ex.sets || 3,
        reps: ex.reps || "10",
        rest: ex.rest || 60,
        notes: ex.notes || "",
        weight: ex.weight || ""
      }))
    }))
  }));
  return { ...rawData, weeks: processedWeeks };
};