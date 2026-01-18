import { useState, useEffect } from 'react';

export const useAppPersistence = () => {
  const [data, setData] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('workout_data');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [history, setHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('workout_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [equipment, setEquipment] = useState(() => {
    try {
      const saved = localStorage.getItem('user_equipment');
      return saved ? JSON.parse(saved) : { dumbbells: [], kettlebells: [], machines: [] };
    } catch (e) { return { dumbbells: [], kettlebells: [], machines: [] }; }
  });

  const [prompts, setPrompts] = useState(() => {
    try {
      const saved = localStorage.getItem('user_prompts');
      return saved ? JSON.parse(saved) : {
        system: "Du bist Coach Andy, ein erfahrener Fitness-Mentor.",
        plan: "Erstelle einen Hyrox-fokussierten Trainingsplan.",
        warmup: "Gib mir ein 5-minütiges dynamisches Warmup.",
        cooldown: "Gib mir ein entspanntes Cooldown mit Stretching."
      };
    } catch (e) { return {}; }
  });

  // NEU: Links Verwaltung mit Default-Werten
  const [links, setLinks] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('user_links');
      return saved ? JSON.parse(saved) : [
        { id: 1, title: "Hyrox Weltrekord Lauf", channel: "Hunter McIntyre", url: "https://youtube.com", category: "Workout", type: "youtube", desc: "Analyse der Technik und Pacing." },
        { id: 2, title: "10 Min Hüft-Mobility", channel: "Movement by David", url: "https://youtube.com", category: "Mobility", type: "youtube", desc: "Tägliche Routine für offene Hüften." },
        { id: 3, title: "Kettlebell Flow Inspiration", channel: "kb_strength", url: "https://instagram.com", category: "Workout", type: "instagram", desc: "Complex für Grip-Kraft." },
        { id: 4, title: "Mindset für Wettkämpfe", channel: "Coach Andy", url: "https://youtube.com", category: "Mindset", type: "youtube", desc: "Wie man Nervosität in Energie wandelt." },
        { id: 5, title: "Schulter Pre-Hab", channel: "Squat University", url: "https://youtube.com", category: "Mobility", type: "youtube", desc: "Wichtig vor Overhead-Press." },
        { id: 6, title: "Hyrox Regelwerk 2024", channel: "Hyrox Official", url: "https://hyrox.com", category: "Wissen", type: "web", desc: "Das offizielle Rulebook." }
      ];
    } catch (e) { return []; }
  });

  // Listener für Änderungen
  useEffect(() => { localStorage.setItem('workout_data', JSON.stringify(data)); }, [data]);
  useEffect(() => { localStorage.setItem('workout_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('user_equipment', JSON.stringify(equipment)); }, [equipment]);
  useEffect(() => { localStorage.setItem('user_prompts', JSON.stringify(prompts)); }, [prompts]);
  useEffect(() => { localStorage.setItem('user_links', JSON.stringify(links)); }, [links]);

  const saveHistoryEntry = (entry: any) => {
    setHistory((prev: any[]) => [entry, ...prev]);
  };

  const deleteHistoryEntry = (id: number) => {
    setHistory((prev: any[]) => prev.filter(item => item.id !== id));
  };

  const updateEquipment = (newEquipment: any) => {
    setEquipment(newEquipment);
  };

  const updatePrompts = (key: string, value: string) => {
    setPrompts((prev: any) => ({ ...prev, [key]: value }));
  };

  // NEUE FUNKTIONEN FÜR LINKS
  const addLink = (link: any) => {
    setLinks((prev) => [{ ...link, id: Date.now() }, ...prev]);
  };

  const deleteLink = (id: number) => {
    setLinks((prev) => prev.filter(l => l.id !== id));
  };

  const importData = (json: any) => {
    if (!json) return;
    const newData = json.data || json.workouts || (Array.isArray(json) ? json : null);
    
    if (newData && newData.length > 0) {
      localStorage.setItem('workout_data', JSON.stringify(newData));
      if (json.history) localStorage.setItem('workout_history', JSON.stringify(json.history));
      if (json.prompts) localStorage.setItem('user_prompts', JSON.stringify(json.prompts));
      if (json.equipment) localStorage.setItem('user_equipment', JSON.stringify(json.equipment));
      if (json.links) localStorage.setItem('user_links', JSON.stringify(json.links));
      window.location.reload();
    } else {
      alert("Fehler: Keine Trainingsdaten im Code gefunden. Suche nach 'data': [...]");
    }
  };

  const resetAll = () => {
    if (window.confirm("Wirklich alles löschen?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return {
    data, setData,
    history, saveHistoryEntry, deleteHistoryEntry,
    equipment, updateEquipment,
    prompts, updatePrompts,
    links, addLink, deleteLink, // Exportiere die neuen Funktionen
    importData, resetAll,
    stats: { totalWorkouts: history.length }
  };
};