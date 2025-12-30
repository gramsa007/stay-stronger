import React, { useState, useEffect, useRef } from 'react';
import {
  Dumbbell,
  ArrowLeft,
  Save,
  Timer,
  Flame,
  Settings,
  Download,
  Upload,
  UserCircle,
  FileJson,
  Trash2,
  History,
  PlayCircle,
  CheckCircle2,
  CheckSquare,
  AlertTriangle,
  X,
  Save as SaveIcon,
  CalendarDays,
  Cloud,
  Database,
  RefreshCw,
  Clock,
  Target,
  ChevronRight,
  FileText,
  Copy,
  Check,
  Edit, 
  RotateCcw,
  Package,
  Plus, 
  Minus,
  Zap,
  Wind,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';

// --- STANDARD PROMPTS ---
const DEFAULT_SYSTEM_PROMPT = `Du bist Coach Andy, ein erfahrener Hyrox- und Fitness-Coach.
Deine Philosophie:
1. Hyrox besteht zu 50% aus Laufen und zu 50% aus funktionaler Kraft.
2. Konsistenz schlägt Intensität.
3. Form geht immer vor Gewicht.

Deine Aufgaben:
- Erstelle progressive Trainingspläne (Kraft, Ausdauer, Hyrox-Sim).
- Motiviere den Athleten, aber achte auf Verletzungsprävention.
- Nutze RPE (Rate of Perceived Exertion) zur Steuerung der Intensität.
- Wenn der Athlet Equipment-Einschränkungen hat (z.B. nur Kettlebells), passe den Plan kreativ an.`;

const DEFAULT_WARMUP_PROMPT = `Du bist Coach Andy. Deine Aufgabe ist es, ein spezifisches Warm-up (5-10 Minuten) für das anstehende Workout zu erstellen.

Deine Philosophie fürs Aufwärmen:
1. "Warm-up to perform": Wir wärmen uns auf, um Leistung zu bringen.
2. Dynamik vor Statik: Keine langen Halteübungen.
3. Spezifität: Bereite genau die Gelenke und Muskeln vor.

Struktur (RAMP): Raise, Activate, Mobilize, Potentiate.`;

const DEFAULT_COOLDOWN_PROMPT = `Du bist Coach Andy. Deine Aufgabe ist es, ein Cool Down (5-10 Minuten) zu erstellen, um den Körper herunterzufahren.

Deine Philosophie fürs Cool Down:
1. Parasympathikus aktivieren: Atmung beruhigen, Stress abbauen.
2. Statisches Dehnen: Jetzt ist die Zeit für längere Dehnübungen (30-60sek halten).
3. Mobility: Fokus auf die Muskelgruppen, die gerade trainiert wurden.`;

// --- ANGEPASSTER PLAN PROMPT (MIT CODE-BLOCK ZWANG) ---
const DEFAULT_PLAN_PROMPT = `Erstelle einen neuen 4-Wochen-Trainingsplan (3-4 Einheiten pro Woche) für Hyrox/Functional Fitness.

WICHTIGE ANWEISUNG FÜR DAS OUTPUT-FORMAT:
Bitte verpacke die Antwort IMMER in einen Markdown-Code-Block (Start mit \`\`\`json und Ende mit \`\`\`).
Dadurch erhalte ich einen "Kopieren"-Button.

Der Inhalt des Code-Blocks muss ein valides JSON-Array sein mit exakt dieser Struktur:
[
  {
    "id": 1,
    "week": 1,
    "title": "Titel des Workouts",
    "type": "strength" | "circuit" | "endurance",
    "duration": "60 Min",
    "focus": "Kurze Beschreibung",
    "color": "border-blue-500 text-blue-600",
    "badgeColor": "bg-blue-100 text-blue-700",
    "exercises": [
      { "name": "Übungsname", "sets": 3, "reps": "10-12", "rpe": "8", "note": "Hinweis" }
    ]
  }
]

ANWEISUNG ZUR PROGRESSION:
Analysiere meinen Trainingsverlauf der letzten 4 Wochen (siehe unten).
- Wenn ich mich bei Übungen gesteigert habe, erhöhe leicht das Volumen oder die Intensität.
- Wenn ich stagniert habe, variiere den Reiz.
- Berücksichtige strikt mein verfügbares Equipment (siehe unten).`;

// --- EQUIPMENT LISTE ---
const DEFAULT_EQUIPMENT = [
  { category: 'Langhantel', items: ['Olympia-Stange', 'Gewichte bis 100kg', 'Power Rack'] },
  { category: 'Kettlebells', items: ['4 kg', '6 kg', '8 kg', '12 kg'] },
  { category: 'Bodyweight & Sonstiges', items: ['Klimmzugstange', 'Therabänder (div. Stärken)', 'Laufschuhe'] }
];

// --- HILFSFUNKTION: Daten vorbereiten ---
const prepareData = (workouts) => {
  return workouts.map(workout => ({
    ...workout,
    exercises: workout.exercises.map(ex => ({
      ...ex,
      logs: ex.logs || Array.from({ length: ex.sets }).map(() => ({
        weight: '',
        reps: '',
        completed: false
      }))
    }))
  }));
};

// --- INITIALE DATEN ---
const rawWorkouts = [
  {
    id: 1,
    week: 1,
    title: 'Tag 1: KB Kraft',
    type: 'strength',
    duration: '45-60 Min',
    focus: 'Ganzkörper & Basis',
    color: 'border-blue-500 text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-700',
    exercises: [
      { name: 'Goblet Squats (KB)', sets: 3, reps: '10-12', rpe: '8', note: 'Nimm die 8er oder 12er' },
      { name: 'Schulterdrücken', sets: 3, reps: '8-10', rpe: '8', note: 'Pro Seite (4er oder 6er)' },
      { name: 'Einarmiges Rudern', sets: 3, reps: '10-12', rpe: '8', note: 'Abstützen auf Stuhl' },
      { name: 'Rumanian Deadlift', sets: 3, reps: '12-15', rpe: '7', note: 'Beide Hände an die 12er' },
      { name: 'Floor Press', sets: 3, reps: '10-12', rpe: '8', note: 'Rückenlage am Boden' },
    ],
  },
  {
    id: 2,
    week: 1,
    title: 'Tag 2: Ausdauer Zirkel',
    type: 'circuit',
    duration: '30-40 Min',
    focus: 'Herz-Kreislauf',
    color: 'border-orange-500 text-orange-600',
    badgeColor: 'bg-orange-100 text-orange-700',
    exercises: [
      { name: 'KB Swings', sets: 3, reps: '20', rpe: 'Explosiv', note: 'Hüft-Einsatz! (12er)' },
      { name: 'Thruster', sets: 3, reps: '10', rpe: 'Hoch', note: 'Squat + Drücken' },
      { name: 'Burpees', sets: 3, reps: '10', rpe: 'Pace', note: 'Ohne Gewicht' },
      { name: 'Mountain Climbers', sets: 3, reps: '30sek', rpe: 'Schnell', note: 'Am Boden' },
    ],
  },
  {
    id: 3,
    week: 1,
    title: 'Tag 3: Core & Grip',
    type: 'assistance',
    duration: '30 Min',
    focus: 'Stabilität',
    color: 'border-teal-500 text-teal-600',
    badgeColor: 'bg-teal-100 text-teal-700',
    exercises: [
      { name: 'Farmers Carry', sets: 3, reps: '40m', rpe: '7', note: 'Pro Seite laufen' },
      { name: 'Russian Twists', sets: 3, reps: '20', rpe: '9', note: 'Füße hoch wenn möglich' },
      { name: 'Plank Pull-Through', sets: 3, reps: '12', rpe: '8', note: 'KB durchziehen' },
      { name: 'Halo', sets: 3, reps: '10', rpe: '7', note: 'Um den Kopf kreisen' },
    ],
  },
  {
    id: 4,
    week: 2,
    title: 'Tag 1: Kraft Steigerung',
    type: 'strength',
    duration: '50-60 Min',
    focus: 'Mehr Gewicht',
    color: 'border-red-500 text-red-600',
    badgeColor: 'bg-red-100 text-red-700',
    exercises: [
      { name: 'Goblet Squats (Schwer)', sets: 4, reps: '8', rpe: '9', note: 'Versuch die 16er!' },
      { name: 'Push Press', sets: 4, reps: '6-8', rpe: '9', note: 'Mit Beinschwung' },
    ],
  }
];

// --- TIMER KOMPONENTE ---
function WorkoutTimer({ transparent = false, initialTime = 0 }) {
  const [seconds, setSeconds] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setSeconds(initialTime);
  }, [initialTime]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (transparent) {
      return (
        <div 
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full cursor-pointer hover:bg-white/30 transition-colors border border-white/10 shadow-sm"
        >
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-400 animate-pulse' : 'bg-gray-300'}`}></div>
            <span className="font-mono text-xs font-bold text-white tracking-widest">
                {formatTime(seconds)} min
            </span>
        </div>
      )
  }

  return (
    <div 
      onClick={() => setIsActive(!isActive)}
      className="flex items-center gap-2 bg-blue-900 bg-opacity-50 px-3 py-1 rounded-lg border border-blue-400/30 cursor-pointer hover:bg-blue-800 transition-colors"
    >
      <Timer size={18} className={`text-blue-200 ${isActive ? 'animate-pulse' : ''}`} />
      <span className="font-mono text-xl font-bold text-white tracking-widest">
        {formatTime(seconds)}
      </span>
    </div>
  );
}

// --- WARMUP SCREEN ---
function WarmupScreen({ prompt, onComplete, onBack }) {
  const WARMUP_DURATION = 300; 
  const [timeLeft, setTimeLeft] = useState(WARMUP_DURATION); 

  const handleFinish = () => {
      const elapsed = WARMUP_DURATION - timeLeft;
      onComplete(elapsed);
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish(); 
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4 sticky top-0 z-10 shadow-lg">
          <div className="flex justify-between items-center mb-1">
            <button onClick={onBack} className="flex items-center gap-1 text-orange-100 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Zurück</span>
            </button>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-mono text-xs font-bold text-white tracking-widest border border-white/10">
               WARM-UP
            </span>
          </div>
          <h1 className="text-xl font-black mt-1">Aufwärmen</h1>
          <p className="text-orange-100 text-[10px] flex items-center gap-1">
            <Flame size={10} /> Mach dich bereit
          </p>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 shadow-sm mb-6 flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 text-orange-600">
                    <Zap size={24} fill="currentColor" />
                    <h3 className="font-bold text-lg">Deine Routine</h3>
                </div>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {prompt}
                </div>
            </div>

            <div>
                <div className="text-center mb-8">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Restzeit</p>
                    <div className="text-7xl font-black text-gray-800 font-mono tracking-tighter">
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <button 
                    onClick={handleFinish}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <Dumbbell size={20} />
                    Warm-up beenden & Workout starten
                </button>
            </div>
        </div>
    </div>
  );
}

// --- COOLDOWN SCREEN ---
function CooldownScreen({ prompt, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(300); 

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 sticky top-0 z-10 shadow-lg">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1 text-teal-100">
               <CheckCircle2 size={20} />
               <span className="text-sm font-medium">Workout geschafft!</span>
            </div>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-mono text-xs font-bold text-white tracking-widest border border-white/10">
               COOL-DOWN
            </span>
          </div>
          <h1 className="text-xl font-black mt-1">Regeneration</h1>
          <p className="text-teal-100 text-[10px] flex items-center gap-1">
            <Wind size={10} /> Fahre das System runter
          </p>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="bg-teal-50 border border-teal-100 rounded-3xl p-6 shadow-sm mb-6 flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 text-teal-600">
                    <Wind size={24} fill="currentColor" />
                    <h3 className="font-bold text-lg">Deine Routine</h3>
                </div>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {prompt}
                </div>
            </div>

            <div>
                <div className="text-center mb-8">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Restzeit</p>
                    <div className="text-7xl font-black text-gray-800 font-mono tracking-tighter">
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <button 
                    onClick={onComplete}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <SaveIcon size={20} />
                    Cool Down beenden & Speichern
                </button>
            </div>
        </div>
    </div>
  );
}

// --- PASTE PLAN MODAL ---
function PastePlanModal({ isOpen, onClose, onImport }) {
    const [jsonText, setJsonText] = useState("");
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleImport = () => {
        try {
            // Bereinige den Text von Markdown-Code-Blöcken
            let cleanedText = jsonText.trim();
            if (cleanedText.startsWith("```json")) {
                cleanedText = cleanedText.substring(7);
            } else if (cleanedText.startsWith("```")) {
                cleanedText = cleanedText.substring(3);
            }
            if (cleanedText.endsWith("```")) {
                cleanedText = cleanedText.substring(0, cleanedText.length - 3);
            }
            
            const parsed = JSON.parse(cleanedText.trim());
            
            if (Array.isArray(parsed)) {
                onImport(parsed);
                setJsonText("");
                setError(null);
                onClose();
            } else {
                setError("Format-Fehler: Es muss eine Liste von Workouts sein (startet mit '[').");
            }
        } catch (e) {
            setError("Ungültiges JSON. Bitte kopiere nur den Code-Bereich (beginnt mit '[').");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200 relative overflow-hidden">
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <ClipboardCheck size={20} className="text-blue-400"/> Plan einfügen
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 bg-gray-50 flex-1 flex flex-col gap-4">
                    <p className="text-sm text-gray-600">Füge hier den JSON-Code ein, den die KI erstellt hat:</p>
                    <textarea 
                        className="w-full flex-1 p-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono text-xs"
                        placeholder='[ { "id": 1, "title": "..." } ]'
                        value={jsonText}
                        onChange={(e) => setJsonText(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                    <button 
                        onClick={handleImport}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        Plan laden & anwenden
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- CONFIRMATION MODAL ---
function ExitDialog({ isOpen, onSave, onDiscard, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Training verlassen?</h3>
          <p className="text-gray-500 text-sm mt-1">
            Möchtest du deine Fortschritte speichern oder verwerfen?
          </p>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={onSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <SaveIcon size={18} /> Speichern & Verlassen
          </button>
          
          <button 
            onClick={onDiscard}
            className="w-full bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 size={18} /> Verwerfen
          </button>
          
          <button 
            onClick={onCancel}
            className="w-full text-gray-400 font-medium py-2 hover:text-gray-600 transition-colors text-sm"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}

// --- PROMPT MODAL (EDITABLE + DYNAMIC APPEND) ---
function PromptModal({ isOpen, onClose, title, icon: Icon, currentPrompt, onSave, colorClass, appendEquipment = false, equipment = [], appendHistory = false, history = [] }) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(currentPrompt);

  useEffect(() => {
    let finalPrompt = currentPrompt;

    if (isOpen) {
        if (appendEquipment) {
            let equipmentString = "\n\n=== MEIN VERFÜGBARES EQUIPMENT ===\n";
            equipment.forEach(cat => {
                equipmentString += `- ${cat.category}: ${cat.items.join(', ')}\n`;
            });
            finalPrompt += equipmentString;
        }

        if (appendHistory) {
 
