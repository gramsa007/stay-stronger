import { useState, useEffect } from 'react';

const DEFAULT_PROMPTS = {
  system: "Du bist Coach Andy, ein motivierender Fitness-Coach.",
  warmup: "Gib mir ein 5-Minuten Warmup für Oberkörper.",
  cooldown: "Gib mir ein 5-Minuten Cooldown.",
  plan: "Erstelle einen Plan basierend auf..."
};

// WICHTIG: Das 'export const' macht den Hook für App.tsx verfügbar
export const useAppPersistence = () => {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<string[]>(['Kurzhanteln', 'Bank']);
  const [prompts, setPrompts] = useState(DEFAULT_PROMPTS);
  
  // FIX: Hier fehlten 'total' und 'thisWeek' für den DashboardScreen
  const [stats, setStats] = useState({ 
    name: 'Athlet', 
    weight: 75, 
    height: 180,
    total: 0,     // Neu: Behebt den Dashboard-Fehler
    thisWeek: 0   // Neu: Behebt den Dashboard-Fehler
  });

  useEffect(() => {
    const load = (key: string, setter: any, fallback: any) => {
      const saved = localStorage.getItem('coach_andy_' + key);
      if (saved) {
        try {
          setter(JSON.parse(saved));
        } catch (e) {
          console.error("Error loading " + key, e);
        }
      } else if (fallback) {
        setter(fallback);
      }
    };

    load('data', setData, []);
    load('history', setHistory, []);
    load('equipment', setEquipment, ['Hanteln', 'Matte']);
    load('prompts', setPrompts, DEFAULT_PROMPTS);
    // FIX: Fallback angepasst mit allen Feldern
    load('stats', setStats, { name: 'User', weight: 0, height: 0, total: 0, thisWeek: 0 });
  }, []);

  // Update Stats automatisch basierend auf History
  useEffect(() => {
    if(history.length > 0) {
        // Simple Logik: Gesamtzahl der Workouts setzen
        const total = history.length;
        // Wir behalten die alten Werte bei und aktualisieren nur total
        setStats(prev => ({ ...prev, total })); 
    }
  }, [history]);

  const save = (key: string, value: any) => {
    localStorage.setItem('coach_andy_' + key, JSON.stringify(value));
  };

  const saveHistoryEntry = (entry: any) => {
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    save('history', newHistory);
  };

  const deleteHistoryEntry = (id: number) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    save('history', newHistory);
  };

  const updatePrompts = (key: string, value: string) => {
    const newPrompts = { ...prompts, [key]: value };
    setPrompts(newPrompts);
    save('prompts', newPrompts);
  };

  const updateEquipment = (newEq: string[]) => {
    setEquipment(newEq);
    save('equipment', newEq);
  };

  const importData = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      if (imported.data) { setData(imported.data); save('data', imported.data); }
      if (imported.history) { setHistory(imported.history); save('history', imported.history); }
      if (imported.prompts) { setPrompts(imported.prompts); save('prompts', imported.prompts); }
      if (imported.equipment) { setEquipment(imported.equipment); save('equipment', imported.equipment); }
      alert("Import erfolgreich!");
    } catch (e) {
      alert("Fehler beim Importieren der Datei.");
    }
  };

  const resetAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  return {
    data, setData: (d: any) => { setData(d); save('data', d); },
    history, saveHistoryEntry, deleteHistoryEntry,
    equipment, updateEquipment,
    prompts, updatePrompts,
    stats, setStats: (s: any) => { setStats(s); save('stats', s); },
    importData, resetAll
  };
};