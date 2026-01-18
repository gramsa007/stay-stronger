import React, { useState, useEffect } from 'react';
import { 
  UserCircle, Dumbbell, History as HistoryIcon, FileText, 
  Zap, Wind, Sparkles, Link as LinkIcon 
} from 'lucide-react';

import { useAppPersistence } from './hooks/useAppPersistence';
import { useActiveSession } from './hooks/useActiveSession';
import { useWakeLock } from './hooks/useWakeLock';
import { getStreakStats, formatTime } from './utils/helpers';
import { triggerWorkoutFinishConfetti } from './utils/confetti';

import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen';
import { WarmupScreen } from './screens/WarmupScreen';
import { CooldownScreen } from './screens/CooldownScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { PlanScreen } from './screens/PlanScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { LinksScreen } from './screens/LinksScreen';

import { ExerciseAnalysisModal } from './components/modals/ExerciseAnalysisModal';
import { EquipmentModal } from './components/modals/EquipmentModal';
import { PromptModal } from './components/modals/PromptModal';
import { PastePlanModal } from './components/modals/PastePlanModal';
import { CustomLogModal } from './components/modals/CustomLogModal';
import { ExitDialog } from './components/modals/ExitDialog';

export default function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [activeWeek, setActiveWeek] = useState(1);
  const [showCustomLogModal, setShowCustomLogModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showPastePlanModal, setShowPastePlanModal] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [activePromptModal, setActivePromptModal] = useState<string | null>(null);
  
  const [previewWorkout, setPreviewWorkout] = useState<any>(null);
  const [analysisExercise, setAnalysisExercise] = useState<string | null>(null);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<any>(null);

  const persistence = useAppPersistence();
  const session = useActiveSession();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  useEffect(() => {
    if (session.phase !== 'idle') requestWakeLock();
    else releaseWakeLock();
  }, [session.phase]);

  const visibleWorkouts = persistence.data.filter((w: any) => w.week === activeWeek);
  const isWorkoutCompleted = (workoutId: number) => persistence.history.some((entry: any) => entry.workoutId === workoutId);

  const calculateVolume = (snapshot: any) => {
      if (!snapshot || !snapshot.exercises) return 0;
      let vol = 0;
      snapshot.exercises.forEach((ex: any) => {
          ex.logs.forEach((log: any) => {
              if (log.completed) vol += (parseFloat(log.weight) || 0) * (parseFloat(log.reps) || 0);
          });
      });
      return vol;
  };

  const chartData = persistence.history.slice(0, 5).reverse().map((h: any) => ({
      date: new Date(h.date).toLocaleDateString(undefined, {weekday: 'short'}),
      volume: calculateVolume(h.snapshot),
      id: h.id,
      height: 0 
  })).map((v, _, arr) => {
      const max = Math.max(...arr.map(i => i.volume));
      return { ...v, height: max > 0 ? (v.volume / max) * 100 : 0 };
  });

  const handleStartWorkout = (id: number) => {
      setPreviewWorkout(null);
      const workout = persistence.data.find((w: any) => w.id === id);
      if (workout) session.startSession(workout);
  };

  const handleFinishWorkout = () => {
      if (!session.activeWorkoutData) return;
      persistence.saveHistoryEntry({
          id: Date.now(),
          workoutId: session.activeWorkoutData.id,
          workoutTitle: session.activeWorkoutData.title,
          date: new Date().toISOString(),
          week: session.activeWorkoutData.week,
          type: session.activeWorkoutData.type,
          totalDuration: formatTime(session.totalSeconds),
          snapshot: session.activeWorkoutData 
      });
      triggerWorkoutFinishConfetti();
      session.endSession();
      setActiveTab('training');
  };

  const handleSaveCustomLog = (title: string, duration: string, note: string) => {
      persistence.saveHistoryEntry({
          id: Date.now(),
          workoutId: -1, 
          workoutTitle: title,
          date: new Date().toISOString(),
          week: activeWeek,
          type: "Custom",
          totalDuration: duration ? duration + " Min" : "",
          snapshot: {
              title: title, focus: "Freies Training",
              exercises: [{ name: "Details / Notizen", logs: [{ weight: note, reps: duration + " Min", completed: true }] }]
          }
      });
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ 
        data: persistence.data, history: persistence.history, 
        prompts: persistence.prompts, equipment: persistence.equipment 
    }, null, 2);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([dataStr], { type: "application/json" }));
    link.download = `coach-andy-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCSVExport = () => {
    if (persistence.history.length === 0) return alert("Keine Daten.");
    let csv = "Datum,Workout,Typ,Uebung,Satz,Gewicht,Reps\n";
    persistence.history.forEach((e: any) => {
        e.snapshot?.exercises?.forEach((ex: any) => {
            ex.logs.forEach((l: any, i: number) => {
                if(l.weight && l.reps) csv += `${new Date(e.date).toLocaleDateString()},${e.workoutTitle},${e.type},${ex.name},${i+1},${l.weight},${l.reps}\n`;
            });
        });
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = `coach_andy_export.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (session.phase !== 'idle' && session.activeWorkoutData) {
      if (session.phase === 'warmup') return <WarmupScreen prompt={persistence.prompts.warmup} onComplete={(t) => { session.setTotalSeconds(t); session.setPhase('training'); }} onBack={() => setShowExitDialog(true)} />;
      if (session.phase === 'cooldown') return <CooldownScreen prompt={persistence.prompts.cooldown} onComplete={handleFinishWorkout} initialTime={session.totalSeconds} onTick={session.setTotalSeconds} />;
      return <ActiveWorkoutScreen 
          activeWorkoutData={session.activeWorkoutData} totalSeconds={session.totalSeconds} setTotalSeconds={session.setTotalSeconds}
          history={persistence.history} onBackRequest={() => setShowExitDialog(true)} onFinishWorkout={() => session.setPhase('cooldown')}
          onAnalysisRequest={setAnalysisExercise} handleInputChange={session.handleInputChange} toggleSetComplete={session.toggleSetComplete}
          isRestActive={session.isRestActive} restSeconds={session.restSeconds} activeRestContext={session.activeRestContext}
          ExitDialogComponent={<ExitDialog isOpen={showExitDialog} onSave={() => { session.endSession(); setShowExitDialog(false); }} onDiscard={() => { session.endSession(); setShowExitDialog(false); }} onCancel={() => setShowExitDialog(false)} />}
          AnalysisModalComponent={analysisExercise && <ExerciseAnalysisModal onClose={() => setAnalysisExercise(null)} exerciseName={analysisExercise} history={persistence.history} />}
      />;
    }
    return (
      <div className="pb-24 min-h-screen">
          {activeTab === 'profile' && (
            <DashboardScreen 
                stats={persistence.stats} streak={getStreakStats(persistence.history)}
                onExport={handleExportJSON}
                onImport={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    try {
                      const json = JSON.parse(ev.target?.result as string);
                      if (json.data || json.prompts) {
                          persistence.importData(json);
                          // NEUE MELDUNG !!!
                          alert("✅ Import erfolgreich! App wird neu geladen...");
                          window.location.reload();
                      } else {
                          alert("❌ Fehler: Das ist keine gültige Backup-Datei.");
                      }
                    } catch (err) { alert("❌ Kritischer Fehler: Datei defekt."); }
                  };
                  reader.readAsText(file);
                  e.target.value = '';
                }}
                onPastePlan={() => setShowPastePlanModal(true)} onOpenCustomLog={() => setShowCustomLogModal(true)}
                onOpenPlanPrompt={() => setActivePromptModal('plan')} onOpenEquipment={() => setShowEquipmentModal(true)}
                onOpenSystemPrompt={() => setActivePromptModal('system')} onOpenWarmupPrompt={() => setActivePromptModal('warmup')}
                onOpenCooldownPrompt={() => setActivePromptModal('cooldown')} onClearPlan={() => persistence.setData([])} onReset={() => persistence.resetAll()}
            />
          )}
          {activeTab === 'training' && <PlanScreen activeWeek={activeWeek} setActiveWeek={setActiveWeek} workouts={visibleWorkouts} isWorkoutCompleted={isWorkoutCompleted} onStartWorkout={handleStartWorkout} onPreviewWorkout={setPreviewWorkout} />}
          {activeTab === 'links' && <LinksScreen />}
          {activeTab === 'history' && <HistoryScreen history={persistence.history} selectedEntry={selectedHistoryEntry} chartData={chartData} onSelectEntry={setSelectedHistoryEntry} onClearSelection={() => setSelectedHistoryEntry(null)} onDeleteEntry={(e, id) => persistence.deleteHistoryEntry(id)} onExportCSV={handleCSVExport} onAnalysisRequest={setAnalysisExercise} />}
      </div>
    );
  };

  // HIER IST DIE HINTERGRUND-ÄNDERUNG (bg-slate-800 statt neutral-900)
  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans border-4 border-red-500">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        {showCustomLogModal && <CustomLogModal onClose={() => setShowCustomLogModal(false)} onSave={handleSaveCustomLog} />}
        {analysisExercise && <ExerciseAnalysisModal onClose={() => setAnalysisExercise(null)} exerciseName={analysisExercise} history={persistence.history} />}
        {showEquipmentModal && <EquipmentModal onClose={() => setShowEquipmentModal(false)} equipment={persistence.equipment} onSave={persistence.updateEquipment} />}
        {showPastePlanModal && <PastePlanModal onClose={() => setShowPastePlanModal(false)} onImport={persistence.importData} />}
        {showExitDialog && <ExitDialog isOpen={showExitDialog} onSave={() => { session.endSession(); setShowExitDialog(false); }} onDiscard={() => { session.endSession(); setShowExitDialog(false); }} onCancel={() => setShowExitDialog(false)} />}
        
        {activePromptModal && <PromptModal onClose={() => setActivePromptModal(null)} 
            title={activePromptModal === 'system' ? 'Philosophie' : activePromptModal} 
            icon={FileText} colorClass="bg-blue-600" 
            currentPrompt={persistence.prompts[activePromptModal as keyof typeof persistence.prompts]} 
            onSave={(val) => persistence.updatePrompts(activePromptModal as any, val)} 
            appendEquipment={activePromptModal === 'plan'} equipment={persistence.equipment} 
            appendHistory={activePromptModal === 'plan'} history={persistence.history} 
        />}

        {previewWorkout && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl">
                  <div className="p-5 rounded-t-3xl text-white bg-slate-900 flex justify-between items-start">
                      <div><h2 className="text-xl font-bold">{previewWorkout.title}</h2><p className="text-xs opacity-70 mt-1">{previewWorkout.focus}</p></div>
                      <button onClick={() => setPreviewWorkout(null)} className="text-white">✕</button>
                  </div>
                  <div className="p-4 overflow-y-auto space-y-3">{previewWorkout.exercises.map((ex: any, i: number) => <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-xl border border-gray-100"><div><h4 className="font-bold text-sm">{ex.name}</h4><p className="text-xs text-gray-400">RPE {ex.rpe}</p></div><span className="font-mono font-bold text-blue-600 text-sm">{ex.sets} x {ex.reps}</span></div>)}</div>
                  <div className="p-4 border-t border-gray-100 flex gap-3"><button onClick={() => setPreviewWorkout(null)} className="flex-1 py-3 text-gray-500 font-bold text-sm">Schließen</button><button onClick={() => handleStartWorkout(previewWorkout.id)} className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold">Starten</button></div>
              </div>
            </div>
        )}

        {renderContent()}

        {session.phase === 'idle' && (
          <div className="fixed bottom-0 w-full max-w-md mx-auto bg-white border-t border-gray-200 px-2 py-2 pb-6 flex justify-between items-center text-xs font-medium z-20 left-0 right-0">
            {['profile', 'training', 'links', 'history'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex flex-col items-center gap-1 p-2 rounded-lg flex-1 transition-colors ${activeTab === tab ? 'text-blue-800' : 'text-gray-400'}`}>
                    {tab === 'profile' && <UserCircle className="w-6 h-6" />}
                    {tab === 'training' && <Dumbbell className="w-6 h-6" />}
                    {tab === 'links' && <LinkIcon className="w-6 h-6" />}
                    {tab === 'history' && <HistoryIcon className="w-6 h-6" />}
                    <span className="capitalize">{tab === 'links' ? 'Bibliothek' : tab === 'profile' ? 'Profil' : tab === 'history' ? 'Verlauf' : 'Plan'}</span>
                </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}