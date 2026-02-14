import { useState, useEffect } from 'react';

// Default Videos mit Kategorien
const DEFAULT_VIDEOS = [
  { id: 1, title: "Bauch Workout", url: "https://youtu.be/X_ZJpZgRecI?si=ZPPr0TsWadupneDS", category: "Workout" },
  { id: 2, title: "Rücken Workout", url: "https://youtu.be/EKJoeNhkNzU?si=-U2B7LUN03_gnEyw", category: "Workout" },
  { id: 3, title: "Mobility Routine", url: "https://youtu.be/EhmghgFFoRc?si=C-gdvqMDJf2REY2e", category: "Mobility" }
];

// Default Prompts
const DEFAULT_PROMPTS = {
    system: "Du bist ein Hyrox Coach. Erstelle harte, effektive Workouts.",
    plan: "Erstelle einen Trainingsplan basierend auf meinen Zielen.",
    warmup: "Erstelle ein Aufwärmprogramm für Hyrox, ca. 5-10 Minuten.", 
    cooldown: "Erstelle ein Cooldown-Programm, Fokus auf Stretching und Erholung."
};

export const useAppPersistence = () => {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any>(DEFAULT_PROMPTS);
  const [equipment, setEquipment] = useState<any>([]);
  const [stats, setStats] = useState<any>({});
  const [links, setLinks] = useState<any[]>([]); 
  const [videos, setVideos] = useState<any[]>(DEFAULT_VIDEOS);

  useEffect(() => {
    const loadedData = localStorage.getItem('coachAndyData');
    if (loadedData) setData(JSON.parse(loadedData));

    const loadedHistory = localStorage.getItem('coachAndyHistory');
    if (loadedHistory) setHistory(JSON.parse(loadedHistory));

    const loadedPrompts = localStorage.getItem('coachAndyPrompts');
    if (loadedPrompts) {
        setPrompts(JSON.parse(loadedPrompts));
    } else {
        setPrompts(DEFAULT_PROMPTS);
    }
    
    const loadedEquip = localStorage.getItem('coachAndyEquipment');
    if (loadedEquip) setEquipment(JSON.parse(loadedEquip));

    const loadedVideos = localStorage.getItem('coachAndyVideos');
    if (loadedVideos) {
        setVideos(JSON.parse(loadedVideos));
    } else {
        setVideos(DEFAULT_VIDEOS);
    }
  }, []);

  // --- SAVE FUNCTIONS ---

  const saveData = (newData: any[]) => {
    setData(newData);
    localStorage.setItem('coachAndyData', JSON.stringify(newData));
  };

  const saveHistoryEntry = (entry: any) => {
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    localStorage.setItem('coachAndyHistory', JSON.stringify(newHistory));
  };

  const deleteHistoryEntry = (id: number) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('coachAndyHistory', JSON.stringify(newHistory));
  };

  const updateEquipment = (newEquip: any) => {
    setEquipment(newEquip);
    localStorage.setItem('coachAndyEquipment', JSON.stringify(newEquip));
  };

  const updatePrompts = (key: string, value: string) => {
    const newPrompts = { ...prompts, [key]: value };
    setPrompts(newPrompts);
    localStorage.setItem('coachAndyPrompts', JSON.stringify(newPrompts));
  };

  // UPDATE: Jetzt mit Kategorie!
  const addVideo = (title: string, url: string, category: string = "Allgemein") => {
    const newVideo = { id: Date.now(), title, url, category };
    const newVideos = [newVideo, ...videos];
    setVideos(newVideos);
    localStorage.setItem('coachAndyVideos', JSON.stringify(newVideos));
  };

  const deleteVideo = (id: number) => {
    const newVideos = videos.filter(v => v.id !== id);
    setVideos(newVideos);
    localStorage.setItem('coachAndyVideos', JSON.stringify(newVideos));
  };

  const resetAll = () => {
    if(window.confirm("Wirklich ALLES löschen?")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  const importData = (json: any) => {
      if (json.data) saveData(json.data);
      
      if (json.history) {
          setHistory(json.history);
          localStorage.setItem('coachAndyHistory', JSON.stringify(json.history));
      }

      // FIX: Intelligenter Import für Prompts (entpackt verschachtelte "all" Ebenen)
      if (json.prompts) {
          let cleanPrompts = json.prompts;
          // Solange eine "all"-Verschachtelung existiert, graben wir tiefer
          while (cleanPrompts.all) {
              cleanPrompts = cleanPrompts.all;
          }
          setPrompts(cleanPrompts);
          localStorage.setItem('coachAndyPrompts', JSON.stringify(cleanPrompts));
      }

      if (json.equipment) updateEquipment(json.equipment);
      
      if (json.videos) {
          setVideos(json.videos);
          localStorage.setItem('coachAndyVideos', JSON.stringify(json.videos));
      }
      
      alert("Daten erfolgreich importiert! Deine Prompts sind wieder da.");
  };

  return {
    data, setData: saveData,
    history, saveHistoryEntry, deleteHistoryEntry,
    prompts, updatePrompts,
    equipment, updateEquipment,
    stats,
    links,
    videos, addVideo, deleteVideo,
    resetAll, importData
  };
};