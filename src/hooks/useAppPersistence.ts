import { useState, useEffect } from 'react';

export const useAppPersistence = () => {
  // SICHERHEITS-LADEN: Verhindert Abstürze durch kaputte Daten
  const safeLoad = (key: string, fallback: any) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
      return parsed || fallback;
    } catch (e) {
      console.error(`Fehler bei ${key}`, e);
      return fallback;
    }
  };

  const [data, setData] = useState<any[]>(() => safeLoad('workout_data', []));
  const [history, setHistory] = useState<any[]>(() => safeLoad('workout_history', []));
  const [links, setLinks] = useState<any[]>(() => safeLoad('user_links', []));
  
  const [equipment, setEquipment] = useState(() => safeLoad('user_equipment', { 
    dumbbells: [], kettlebells: [], machines: [] 
  }));

  const [prompts, setPrompts] = useState(() => safeLoad('user_prompts', {
    system: "Du bist Coach Andy, ein erfahrener Fitness-Mentor.",
    plan: "Erstelle einen Hyrox-fokussierten Trainingsplan.",
    warmup: "Gib mir ein 5-minütiges dynamisches Warmup.",
    cooldown: "Gib mir ein entspanntes Cooldown mit Stretching."
  }));

  useEffect(() => { localStorage.setItem('workout_data', JSON.stringify(data)); }, [data]);
  useEffect(() => { localStorage.setItem('workout_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('user_equipment', JSON.stringify(equipment)); }, [equipment]);
  useEffect(() => { localStorage.setItem('user_prompts', JSON.stringify(prompts)); }, [prompts]);
  useEffect(() => { localStorage.setItem('user_links', JSON.stringify(links)); }, [links]);

  const saveHistoryEntry = (entry: any) => setHistory((prev) => [entry, ...prev]);
  const deleteHistoryEntry = (id: number) => setHistory((prev) => prev.filter(item => item.id !== id));
  const updateEquipment = (newEquipment: any) => setEquipment(newEquipment);
  const updatePrompts = (key: string, value: string) => setPrompts((prev: any) => ({ ...prev, [key]: value }));
  const addLink = (link: any) => setLinks((prev) => [{ ...link, id: Date.now() }, ...prev]);
  const deleteLink = (id: number) => setLinks((prev) => prev.filter(l => l.id !== id));

  const importData = (json: any) => {
    if (!json) return;
    try {
      const newData = json.data || json.workouts || (Array.isArray(json) ? json : null);
      if (newData) localStorage.setItem('workout_data', JSON.stringify(newData));
      if (json.history) localStorage.setItem('workout_history', JSON.stringify(json.history));
      if (json.prompts) localStorage.setItem('user_prompts', JSON.stringify(json.prompts));
      if (json.equipment) localStorage.setItem('user_equipment', JSON.stringify(json.equipment));
      if (json.links) localStorage.setItem('user_links', JSON.stringify(json.links));
      window.location.reload();
    } catch (e) { alert("Import fehlgeschlagen"); }
  };

  const resetAll = () => {
    if (window.confirm("Alles löschen?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return {
    data, setData, history, saveHistoryEntry, deleteHistoryEntry,
    equipment, updateEquipment, prompts, updatePrompts,
    links, addLink, deleteLink, importData, resetAll,
    stats: { totalWorkouts: Array.isArray(history) ? history.length : 0 }
  };
};