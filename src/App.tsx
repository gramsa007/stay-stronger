import React, { useState, useEffect, useRef } from 'react';
import {
  Dumbbell, ArrowLeft, Save, Timer, Flame, Settings, Download, Upload,
  UserCircle, FileJson, Trash2, History, PlayCircle, CheckCircle2,
  CheckSquare, AlertTriangle, X, CalendarDays, Cloud, Database,
  RefreshCw, Clock, Target, ChevronRight, FileText, Copy, Check,
  Edit, RotateCcw, Package, Plus, Minus, Zap, Wind, Sparkles, ClipboardCheck
} from 'lucide-react';

const SaveIcon = Save;

// --- STANDARDS & PROMPTS ---
const DEFAULT_SYSTEM_PROMPT = `Du bist Coach Andy, ein erfahrener Hyrox- und Fitness-Coach. Deine Philosophie: 1. Hyrox besteht zu 50% aus Laufen und zu 50% aus funktionaler Kraft. 2. Konsistenz schlägt Intensität. 3. Form geht immer vor Gewicht.`;
const DEFAULT_WARMUP_PROMPT = `Erstelle ein spezifisches Warm-up (5-10 Min) für das Workout (RAMP-Struktur).`;
const DEFAULT_COOLDOWN_PROMPT = `Erstelle ein Cool Down (5-10 Min) zur Regeneration.`;
const DEFAULT_PLAN_PROMPT = `Erstelle einen neuen 4-Wochen-Trainingsplan als JSON.`;

const DEFAULT_EQUIPMENT = [
  { category: 'Langhantel', items: ['Olympia-Stange', 'Gewichte bis 100kg'] },
  { category: 'Kettlebells', items: ['8 kg', '12 kg', '16 kg'] },
  { category: 'Sonstiges', items: ['Klimmzugstange', 'Laufschuhe'] }
];

const prepareData = (workouts) => workouts.map(w => ({
  ...w,
  exercises: w.exercises.map(ex => ({
    ...ex,
    logs: ex.logs || Array.from({ length: ex.sets }).map(() => ({ weight: '', reps: '', completed: false }))
  }))
}));

const rawWorkouts = [
  { id: 1, week: 1, title: 'Tag 1: Kraft Basis', type: 'strength', duration: '60 Min', focus: 'Grundkraft', color: 'border-blue-500 text-blue-600', badgeColor: 'bg-blue-100 text-blue-700', exercises: [{ name: 'Kniebeugen', sets: 3, reps: '10', rpe: '8' }] }
];

// --- HILFSKOMPONENTEN ---

function WorkoutTimer({ initialTime = 0 }) {
  const [seconds, setSeconds] = useState(initialTime);
  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const format = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  return <div className="bg-white/20 px-3 py-1 rounded-full font-mono text-white text-sm border border-white/10">{format(seconds)}</div>;
}

// --- MODALE ---

function PromptModal({ isOpen, onClose, title, icon: Icon, currentPrompt, onSave, colorClass }) {
  const [text, setText] = useState(currentPrompt);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className={`p-6 text-white flex justify-between items-center ${colorClass}`}>
          <h3 className="font-bold flex items-center gap-2"><Icon size={20}/> {title}</h3>
          <button onClick={onClose}><X/></button>
        </div>
        <div className="p-6 bg-gray-50"><textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-64 p-4 rounded-xl border font-mono text-sm"/></div>
        <div className="p-4 border-t flex gap-2"><button onClick={() => { onSave(text); onClose(); }} className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl">Speichern</button></div>
      </div>
    </div>
  );
}

function EquipmentModal({ isOpen, onClose, equipment, onSave }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Package className="text-blue-600"/> Equipment</h3>
        <div className="space-y-4">{equipment.map((c, i) => <div key={i} className="p-3 bg-gray-50 rounded-xl"><h4 className="font-bold text-sm">{c.category}</h4><p className="text-xs text-gray-500">{c.items.join(', ')}</p></div>)}</div>
        <button onClick={onClose} className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-xl">Schließen</button>
      </div>
    </div>
  );
}

// --- HAUPT APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('training');
  const [activeWeek, setActiveWeek] = useState(1);
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('coachAndyData')) || prepareData(rawWorkouts));
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('coachAndyHistory')) || []);
  const [equipment, setEquipment] = useState(() => JSON.parse(localStorage.getItem('coachAndyEquipment')) || DEFAULT_EQUIPMENT);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const saveWorkout = () => {
    const entry = { id: Date.now(), title: activeWorkout.title, date: new Date().toISOString(), week: activeWorkout.week, type: activeWorkout.type };
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    localStorage.setItem('coachAndyHistory', JSON.stringify(newHistory));
    setActiveWorkout(null);
    setActiveTab('history');
  };

  if (activeWorkout) return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center sticky top-0 z-10">
        <button onClick={() => setActiveWorkout(null)}><ArrowLeft/></button>
        <h2 className="font-bold">{activeWorkout.title}</h2>
        <WorkoutTimer />
      </div>
      <div className="p-4 space-y-4">
        {activeWorkout.exercises.map((ex, exIdx) => (
          <div key={exIdx} className="bg-white p-5 rounded-3xl border shadow-sm">
            <h3 className="font-bold mb-4 text-slate-800">{ex.name} <span className="text-xs text-slate-400 font-medium ml-2">RPE {ex.rpe}</span></h3>
            <div className="space-y-3">
              {ex.logs.map((log, sIdx) => (
                <div key={sIdx} className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">{sIdx+1}</div>
                  <input type="number" placeholder="kg" className="flex-1 p-2 bg-slate-50 border rounded-xl text-center font-bold" value={log.weight} onChange={(e) => { const d = {...activeWorkout}; d.exercises[exIdx].logs[sIdx].weight = e.target.value; setActiveWorkout(d); }} />
                  <input type="text" placeholder="reps" className="flex-1 p-2 bg-slate-50 border rounded-xl text-center font-bold" value={log.reps} onChange={(e) => { const d = {...activeWorkout}; d.exercises[exIdx].logs[sIdx].reps = e.target.value; setActiveWorkout(d); }} />
                  <button onClick={() => { const d = {...activeWorkout}; d.exercises[exIdx].logs[sIdx].completed = !log.completed; setActiveWorkout(d); }} className={`p-2 rounded-xl border transition-colors ${log.completed ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-200'}`}><Check size={20}/></button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={saveWorkout} className="w-full bg-slate-900 text-white py-4 rounded-3xl font-black shadow-xl mt-6 flex items-center justify-center gap-2"><SaveIcon size={20}/> TRAINING SPEICHERN</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <PromptModal isOpen={activeModal === 'system'} onClose={() => setActiveModal(null)} title="Philosophie" icon={FileText} currentPrompt={DEFAULT_SYSTEM_PROMPT} onSave={() => {}} colorClass="bg-blue-600" />
      <PromptModal isOpen={activeModal === 'warmup'} onClose={() => setActiveModal(null)} title="Warm-up" icon={Zap} currentPrompt={DEFAULT_WARMUP_PROMPT} onSave={() => {}} colorClass="bg-orange-500" />
      <EquipmentModal isOpen={activeModal === 'equipment'} onClose={() => setActiveModal(null)} equipment={equipment} onSave={setEquipment} />

      {activeTab === 'training' && (
        <>
          <header className="bg-white p-6 border-b shadow-sm sticky top-0 z-10">
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">Coach Andy <Dumbbell className="text-blue-600" /></h1>
            <div className="mt-6 flex gap-2">{[1, 2, 3, 4].map(w => (
              <button key={w} onClick={() => setActiveWeek(w)} className={`flex-1 py-2 rounded-2xl font-black transition-all ${activeWeek === w ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>W{w}</button>
            ))}</div>
          </header>
          <div className="p-4 space-y-4">
            {data.filter(w => w.week === activeWeek).map(w => (
              <div key={w.id} onClick={() => setActiveWorkout(JSON.parse(JSON.stringify(w)))} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center group active:scale-95 transition-all">
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${w.badgeColor}`}>{w.type}</span>
                  <h3 className="text-xl font-bold mt-2 text-slate-900">{w.title}</h3>
                  <div className="flex gap-4 mt-1 text-slate-400 text-xs font-bold uppercase tracking-tighter">
                    <span className="flex items-center gap-1"><Clock size={12}/> {w.duration}</span>
                    <span className="flex items-center gap-1"><Target size={12}/> {w.focus}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-blue-50 transition-colors"><ChevronRight className="text-slate-300 group-hover:text-blue-600" /></div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="p-6">
          <h1 className="text-3xl font-black mb-8 text-slate-900">Verlauf</h1>
          <div className="space-y-4">
            {history.map(h => (
              <div key={h.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
                <div><h4 className="font-bold text-slate-800">{h.title}</h4><p className="text-xs text-slate-400 font-bold uppercase">{new Date(h.date).toLocaleDateString()}</p></div>
                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center"><CheckCircle2 size={24}/></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-black mb-8">Einstellungen</h1>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <Cloud className="absolute -right-10 -bottom-10 w-40 h-40 opacity-5" />
            <h3 className="text-xl font-bold mb-1">Backup & Prompts</h3>
            <p className="text-xs text-slate-400 mb-6">Konfiguriere deine KI-Vorgaben</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveModal('system')} className="bg-white/10 p-4 rounded-2xl text-xs font-bold flex flex-col items-center gap-2"><FileText size={18}/> Philosophie</button>
              <button onClick={() => setActiveModal('warmup')} className="bg-white/10 p-4 rounded-2xl text-xs font-bold flex flex-col items-center gap-2"><Zap size={18}/> Warm-up</button>
              <button onClick={() => setActiveModal('equipment')} className="bg-white/10 p-4 rounded-2xl text-xs font-bold flex flex-col items-center gap-2 col-span-2"><Package size={18}/> Equipment Editor</button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[2.5rem] p-2 flex justify-between z-50">
        {[
          { id: 'profile', icon: UserCircle, label: 'Profil' },
          { id: 'training', icon: Dumbbell, label: 'Training' },
          { id: 'history', icon: History, label: 'Verlauf' }
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-1 flex flex-col items-center py-4 rounded-[2rem] transition-all ${activeTab === item.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>
            <item.icon size={22} />
            <span className="text-[10px] font-black mt-1 uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
