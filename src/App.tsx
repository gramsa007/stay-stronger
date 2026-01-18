import React, { useState, useEffect } from 'react';
import { 
  UserCircle, Dumbbell, History as HistoryIcon, FileText, 
  Zap, Wind, Sparkles 
} from 'lucide-react';

// Custom Hooks
import { useAppPersistence } from './hooks/useAppPersistence';
import { useActiveSession } from './hooks/useActiveSession';
import { useWakeLock } from './hooks/useWakeLock'; // <--- NEU: Import

// Utils
import { getStreakStats, formatTime } from './utils/helpers';
import { triggerWorkoutFinishConfetti } from './utils/confetti'; // <--- NEU: Import

// Screens
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen';
import { WarmupScreen } from './screens/WarmupScreen';
import { CooldownScreen } from './screens/CooldownScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { PlanScreen } from './screens/PlanScreen';
import { HistoryScreen } from './screens/HistoryScreen';

// Modals
import { ExerciseAnalysisModal } from './components/modals/ExerciseAnalysisModal';
import { EquipmentModal } from './components/modals/EquipmentModal';
import { PromptModal } from './components/modals/PromptModal';
import { PastePlanModal } from './components/modals/PastePlanModal';
import { CustomLogModal } from './components/modals/CustomLogModal';
import { ExitDialog } from './components/modals/ExitDialog';

export default function App() {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('training');
  const [activeWeek, setActiveWeek] = useState(1);
  
  // Modal States
  const [showCustomLogModal, setShowCustomLogModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showPastePlanModal, setShowPastePlanModal] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [activePromptModal, setActivePromptModal] = useState<string | null>(null);
  
  // Selection States
  const [previewWorkout, setPreviewWorkout] = useState<any>(null);
  const [analysisExercise, setAnalysisExercise] = useState<string | null>(null);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<any>(null);

  // --- HOOKS ---
  const persistence = useAppPersistence();
  const session = useActiveSession();
  
  // <--- NEU: Wake Lock Integration --->
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  // Dieser Effekt hält den Bildschirm wach, solange eine Session läuft (Warmup, Training oder Cooldown)
  useEffect(() => {
    if (session.phase !== 'idle') {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [session.phase]);
  // <--- ENDE Wake Lock --->

  // --- DERIVED DATA & HELPERS ---
  const visibleWorkouts = persistence.data.filter((w: any) => w.week === activeWeek);

  const isWorkoutCompleted = (workoutId: number) => {
    return persistence.history.some((entry: any) => entry.workoutId === workoutId);
  };

  // Chart Data Calculation
  const calculateVolume = (snapshot: any) => {
      if (!snapshot || !snapshot.exercises) return 0;
      let vol = 0;
      snapshot.exercises.forEach((ex: any) => {
          ex.logs.forEach((log: any) => {
              const w = parseFloat(log.weight) || 0;
              const r = parseFloat(log.reps) || 0;
              if (log.completed) vol += w * r;
          });
      });
      return vol;
  };

  const getLastWorkoutsVolume = () => {
      const last5 = persistence.history.slice(0, 5).reverse(); 
      if (last5.length === 0) return [];
      const volumes = last5.map((h: any) => ({
          date: new Date(h.date).toLocaleDateString(undefined, {weekday: 'short'}),
          volume: calculateVolume(h.snapshot),
          id: h.id
      }));
      const maxVol = Math.max(...volumes.map((v: any) => v.volume));
      return volumes.map((v: any) => ({...v, height: maxVol > 0 ? (v.volume / maxVol) * 100 : 0 }));
  };

  const chartData = getLastWorkoutsVolume();

  // --- ACTIONS ---

  const handleStartWorkout = (id: number) => {
      setPreviewWorkout(null);
      const workout = persistence.data.find((w: any) => w.id === id);
      if (workout) session.startSession(workout);
  };

  const handleFinishWorkout = () => {
      if (!session.activeWorkoutData) return;
      
      const newEntry = {
          id: Date.now(),
          workoutId: session.activeWorkoutData.id,
          workoutTitle: session.activeWorkoutData.title,
          date: new Date().toISOString(),
          week: session.activeWorkoutData.week,
          type: session.activeWorkoutData.type,
          totalDuration: formatTime(session.totalSeconds),
          snapshot: session.activeWorkoutData 
      };
      
      persistence.saveHistoryEntry(newEntry);
      
      // <--- NEU: Visuelles Feedback beim Abschluss --->
      triggerWorkoutFinishConfetti();
      
      session.endSession();
      setActiveTab('training');
  };

  const handleBackRequest = () => setShowExitDialog(true);
  
  const handleExitSave = () => {
      session.endSession();
      setShowExitDialog(false);
  };

  const handleExitDiscard = () => {
      session.endSession();
      setShowExitDialog(false);
  };

  const handleExitCancel = () => setShowExitDialog(false);

  const handleSaveCustomLog = (title: string, duration: string, note: string) => {
      const newEntry = {
          id: Date.now(),
          workoutId: -1, 
          workoutTitle: title,
          date: new Date().toISOString(),
          week: activeWeek,
          type: "Custom",
          totalDuration: duration ? duration + " Min" : "",
          snapshot: {
              title: title,
              focus: "Freies Training",
              exercises: [
                  {
                      name: "Details / Notizen",
                      logs: [{ weight: note, reps: duration + " Min", completed: true }]
                  }
              ]
          }
      };
      persistence.saveHistoryEntry(newEntry);
  };

  const handleCSVExport = () => {
    if (persistence.history.length === 0) {
        alert("Keine Daten zum Exportieren.");
        return;
    }
    let csvContent = "Datum,Dauer,Woche,Workout Name,Typ,Uebung,Satz,Gewicht (kg),Wiederholungen\n";
    persistence.history.forEach((entry: any) => {
        const date = new Date(entry.date).toLocaleDateString();
        const duration = entry.totalDuration || "";
        const workoutName = entry.workoutTitle.replace(/,/g, ""); 
        if (entry.snapshot && entry.snapshot.exercises) {
            entry.snapshot.exercises.forEach((ex: any) => {
                const exName = ex.name.replace(/,/g, "");
                ex.logs.forEach((log: any, index: number) => {
                    if(log.weight && log.reps) {
                        csvContent += `${date},${duration},${entry.week},${workoutName},${entry.type},${exName},${index + 1},${log.weight},${log.reps}\n`;
                    }
                });
            });
        }
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `coach_andy_export_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportJSON = () => {
    const exportObject = { 
        data: persistence.data, 
        history: persistence.history, 
        prompts: persistence.prompts,
        equipment: persistence.equipment 
    }; 
    const dataStr = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coach-andy-full-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper für Modals
  const ExitDialogComponent = (
    <ExitDialog 
        isOpen={showExitDialog} 
        onSave={handleExitSave} 
        onDiscard={handleExitDiscard} 
        onCancel={handleExitCancel} 
    />
  );

  const AnalysisModalComponent = analysisExercise && (
     <ExerciseAnalysisModal 
        onClose={() => setAnalysisExercise(null)} 
        exerciseName={analysisExercise} 
        history={persistence.history} 
     />
  );

  // --- RENDER ---

  // 1. ACTIVE SESSION OVERLAY
  if (session.phase !== 'idle' && session.activeWorkoutData) {
      if (session.phase === 'warmup') {
          return (
            <>
              {ExitDialogComponent}
              <WarmupScreen 
                  prompt={persistence.prompts.warmup} 
                  onComplete={(elapsed: number) => { session.setTotalSeconds(elapsed); session.setPhase('training'); }}
                  onBack={handleBackRequest}
              />
            </>
          );
      }
      if (session.phase === 'cooldown') {
          return (
            <>
              {ExitDialogComponent}
              <CooldownScreen 
                prompt={persistence.prompts.cooldown} 
                onComplete={handleFinishWorkout} 
                initialTime={session.totalSeconds} 
                onTick={session.setTotalSeconds} 
              />
            </>
          );
      }
      // Training Phase
      return (
          <ActiveWorkoutScreen 
            activeWorkoutData={session.activeWorkoutData}
            totalSeconds={session.totalSeconds}
            setTotalSeconds={session.setTotalSeconds}
            history={persistence.history}
            onBackRequest={handleBackRequest}
            onFinishWorkout={() => session.setPhase('cooldown')}
            onAnalysisRequest={(name: string) => setAnalysisExercise(name)}
            handleInputChange={session.handleInputChange}
            toggleSetComplete={session.toggleSetComplete}
            isRestActive={session.isRestActive}
            restSeconds={session.restSeconds}
            activeRestContext={session.activeRestContext}
            ExitDialogComponent={ExitDialogComponent}
            AnalysisModalComponent={AnalysisModalComponent}
          />
      );
  }

  // 2. MAIN APP
  return (
    <div className="min-h-screen bg-neutral-900 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-2xl overflow-hidden">
        
        {/* GLOBAL MODALS */}
        {showCustomLogModal && <CustomLogModal onClose={() => setShowCustomLogModal(false)} onSave={handleSaveCustomLog} />}
        {AnalysisModalComponent}
        {showEquipmentModal && <EquipmentModal onClose={() => setShowEquipmentModal(false)} equipment={persistence.equipment} onSave={persistence.updateEquipment} />}
        {showPastePlanModal && <PastePlanModal onClose={() => setShowPastePlanModal(false)} onImport={persistence.importData} />}
        {showExitDialog && ExitDialogComponent}

        {/* PROMPT MODALS */}
        {activePromptModal === 'system' && <PromptModal onClose={() => setActivePromptModal(null)} title="Coach Philosophie" icon={FileText} colorClass="bg-gradient-to-r from-blue-600 to-indigo-700" currentPrompt={persistence.prompts.system} onSave={(val) => persistence.updatePrompts('system', val)} />}
        {activePromptModal === 'warmup' && <PromptModal onClose={() => setActivePromptModal(null)} title="Warm-up Prompt" icon={Zap} colorClass="bg-gradient-to-r from-orange-500 to-red-600" currentPrompt={persistence.prompts.warmup} onSave={(val) => persistence.updatePrompts('warmup', val)} />}
        {activePromptModal === 'cooldown' && <PromptModal onClose={() => setActivePromptModal(null)} title="Cool Down Prompt" icon={Wind} colorClass="bg-gradient-to-r from-teal-500 to-cyan-600" currentPrompt={persistence.prompts.cooldown} onSave={(val) => persistence.updatePrompts('cooldown', val)} />}
        {activePromptModal === 'plan' && <PromptModal onClose={() => setActivePromptModal(null)} title="Plan erstellen" icon={Sparkles} colorClass="bg-gradient-to-r from-blue-600 to-indigo-600" currentPrompt={persistence.prompts.plan} onSave={(val) => persistence.updatePrompts('plan', val)} appendEquipment={true} equipment={persistence.equipment} appendHistory={true} history={persistence.history} />}

        {/* WORKOUT PREVIEW (Inline Modal) */}
        {previewWorkout && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95">
                  <div className={`p-5 rounded-t-3xl text-white bg-gradient-to-r from-gray-800 to-gray-900 flex justify-between items-start shrink-0`}>
                      <div><h2 className="text-xl font-bold">{previewWorkout.title}</h2><p className="text-xs opacity-70 mt-1">{previewWorkout.focus}</p></div>
                      <button onClick={() => setPreviewWorkout(null)} className="bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition-colors">✕</button>
                  </div>
                  <div className="p-4 overflow-y-auto space-y-3">
                      {previewWorkout.exercises.map((ex: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                              <div><h4 className="font-bold text-gray-800 text-sm">{ex.name}</h4><p className="text-xs text-gray-400 mt-0.5">RPE {ex.rpe}</p></div>
                              <div className="text-right"><span className="font-mono font-bold text-blue-600 text-sm">{ex.sets} x {ex.reps}</span></div>
                          </div>
                      ))}
                  </div>
                  <div className="p-4 border-t border-gray-100 shrink-0 flex gap-3">
                      <button onClick={() => setPreviewWorkout(null)} className="flex-1 py-3 text-gray-500 font-bold text-sm">Schließen</button>
                      <button onClick={() => handleStartWorkout(previewWorkout.id)} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">Jetzt starten</button>
                  </div>
              </div>
            </div>
        )}

        <div className="pb-24 min-h-screen">
          {activeTab === 'profile' && (
            <DashboardScreen 
                stats={persistence.stats}
                streak={getStreakStats(persistence.history)}
                onExport={handleExportJSON}
                onImport={(e: any) => { /* File handling logic */ }}
                onPastePlan={() => setShowPastePlanModal(true)}
                onOpenCustomLog={() => setShowCustomLogModal(true)}
                onOpenPlanPrompt={() => setActivePromptModal('plan')}
                onOpenEquipment={() => setShowEquipmentModal(true)}
                onOpenSystemPrompt={() => setActivePromptModal('system')}
                onOpenWarmupPrompt={() => setActivePromptModal('warmup')}
                onOpenCooldownPrompt={() => setActivePromptModal('cooldown')}
                onClearPlan={() => { if(confirm("Plan löschen?")) persistence.setData([]); }}
                onReset={() => { if(confirm("Alles zurücksetzen?")) persistence.resetAll(); }}
            />
          )}

          {activeTab === 'training' && (
            <PlanScreen 
                activeWeek={activeWeek}
                setActiveWeek={setActiveWeek}
                workouts={visibleWorkouts}
                isWorkoutCompleted={isWorkoutCompleted}
                onStartWorkout={handleStartWorkout}
                onPreviewWorkout={setPreviewWorkout}
            />
          )}

          {activeTab === 'history' && (
            <HistoryScreen 
                history={persistence.history}
                selectedEntry={selectedHistoryEntry}
                chartData={chartData}
                onSelectEntry={setSelectedHistoryEntry}
                onClearSelection={() => setSelectedHistoryEntry(null)}
                onDeleteEntry={(id: number) => persistence.deleteHistoryEntry(id)}
                onExportCSV={handleCSVExport}
                onAnalysisRequest={setAnalysisExercise}
            />
          )}
        </div>

        {/* BOTTOM NAV */}
        <div className="fixed bottom-0 w-full max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-2 pb-6 flex justify-between items-center text-xs font-medium z-20 left-0 right-0">
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 p-2 rounded-lg flex-1 transition-colors ${activeTab === 'profile' ? 'text-blue-800' : 'text-gray-400 hover:text-gray-600'}`}><UserCircle className="w-6 h-6" /><span>Profil</span></button>
          <button onClick={() => setActiveTab('training')} className={`flex flex-col items-center gap-1 p-2 rounded-lg flex-1 transition-colors ${activeTab === 'training' ? 'text-blue-800' : 'text-gray-400 hover:text-gray-600'}`}><Dumbbell className="w-6 h-6" /><span>Training</span></button>
          <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1 p-2 rounded-lg flex-1 transition-colors ${activeTab === 'history' ? 'text-blue-800' : 'text-gray-400 hover:text-gray-600'}`}><HistoryIcon className="w-6 h-6" /><span>Verlauf</span></button>
        </div>

      </div>
    </div>
  );
}