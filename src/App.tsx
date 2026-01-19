import React, { useState, useEffect } from 'react';
import { UserCircle, Dumbbell, History as HistoryIcon, Link as LinkIcon } from 'lucide-react';
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
    if (session.phase !== 'idle') requestWakeLock(); else releaseWakeLock();
  }, [session.phase]);

  const visibleWorkouts = persistence.data.filter((w: any) => w.week === activeWeek);
  const isWorkoutCompleted = (id: number) => persistence.history.some((e: any) => e.workoutId === id);

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
        id: Date.now(), workoutId: -1, workoutTitle: title,
        date: new Date().toISOString(), week: activeWeek, type: "Custom",
        totalDuration: duration ? duration + " Min" : "",
        snapshot: { title: title, focus: "Freies Training", exercises: [{ name: "Details", logs: [{ weight: note, reps: duration + " Min", completed: true }] }] }
    });
  };

  const handleExportJSON = () => {
    const backup = { data: persistence.data, history: persistence.history, prompts: persistence.prompts, equipment: persistence.equipment, links: persistence.links };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `coach-andy-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        {showCustomLogModal && <CustomLogModal onClose={() => setShowCustomLogModal(false)} onSave={handleSaveCustomLog} />}
        {analysisExercise && <ExerciseAnalysisModal onClose={() => setAnalysisExercise(null)} exerciseName={analysisExercise} history={persistence.history} />}
        {showEquipmentModal && <EquipmentModal onClose={() => setShowEquipmentModal(false)} equipment={persistence.equipment as any} onSave={persistence.updateEquipment} />}
        {showPastePlanModal && <PastePlanModal onClose={() => setShowPastePlanModal(false)} onImport={(json) => { persistence.importData(json); setShowPastePlanModal(false); }} />}
        {activePromptModal && <PromptModal type={activePromptModal as any} value={(persistence.prompts as any)[activePromptModal]} onClose={() => setActivePromptModal(null)} onSave={(v) => { persistence.updatePrompts(activePromptModal, v); setActivePromptModal(null); }} />}
        {showExitDialog && <ExitDialog isOpen={showExitDialog} onSave={() => { session.endSession(); setShowExitDialog(false); }} onDiscard={() => { session.endSession(); setShowExitDialog(false); }} onCancel={() => setShowExitDialog(false)} />}

        {session.phase !== 'idle' ? (
          <>
            {session.phase === 'warmup' && <WarmupScreen prompt={persistence.prompts.warmup} onComplete={(t) => { session.setTotalSeconds(t); session.setPhase('training'); }} onBack={() => setShowExitDialog(true)} />}
            {session.phase === 'cooldown' && <CooldownScreen prompt={persistence.prompts.cooldown} onComplete={handleFinishWorkout} initialTime={session.totalSeconds} onTick={session.setTotalSeconds} />}
            {session.phase === 'training' && <ActiveWorkoutScreen activeWorkoutData={session.activeWorkoutData} totalSeconds={session.totalSeconds} setTotalSeconds={session.setTotalSeconds} history={persistence.history} onBackRequest={() => setShowExitDialog(true)} onFinishWorkout={() => session.setPhase('cooldown')} onAnalysisRequest={setAnalysisExercise} handleInputChange={session.handleInputChange} toggleSetComplete={session.toggleSetComplete} isRestActive={session.isRestActive} restSeconds={session.restSeconds} activeRestContext={session.activeRestContext} onSkipRest={session.skipRest} />}
          </>
        ) : (
          <div className="pb-24 min-h-screen">
            {activeTab === 'profile' && <DashboardScreen stats={persistence.stats} streak={getStreakStats(persistence.history)} onPastePlan={() => setShowPastePlanModal(true)} onOpenCustomLog={() => setShowCustomLogModal(true)} onOpenPlanPrompt={() => setActivePromptModal('plan')} onOpenEquipment={() => setShowEquipmentModal(true)} onOpenSystemPrompt={() => setActivePromptModal('system')} onOpenWarmupPrompt={() => setActivePromptModal('warmup')} onOpenCooldownPrompt={() => setActivePromptModal('cooldown')} onClearPlan={() => persistence.setData([])} onReset={persistence.resetAll} onExport={handleExportJSON} onImport={persistence.importData} />}
            {activeTab === 'training' && <PlanScreen activeWeek={activeWeek} setActiveWeek={setActiveWeek} workouts={visibleWorkouts} isWorkoutCompleted={isWorkoutCompleted} onStartWorkout={(id) => { const w = persistence.data.find((x: any) => x.id === id); if(w) session.startSession(w); }} onPreviewWorkout={setPreviewWorkout} />}
            {activeTab === 'links' && <LinksScreen links={persistence.links} onAddLink={persistence.addLink} onDeleteLink={persistence.deleteLink} />}
            {activeTab === 'history' && <HistoryScreen history={persistence.history} onDeleteEntry={persistence.deleteHistoryEntry} onSelectEntry={setSelectedHistoryEntry} />}
          </div>
        )}

        {session.phase === 'idle' && (
          <div className="fixed bottom-0 w-full max-w-md mx-auto bg-white border-t border-gray-200 px-2 py-2 pb-6 flex justify-between items-center text-xs font-medium z-20">
            {['profile', 'training', 'links', 'history'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex flex-col items-center gap-1 p-2 rounded-lg flex-1 transition-colors ${activeTab === tab ? 'text-blue-800' : 'text-gray-400'}`}>
                    {tab === 'profile' ? <UserCircle size={24} /> : tab === 'training' ? <Dumbbell size={24} /> : tab === 'links' ? <LinkIcon size={24} /> : <HistoryIcon size={24} />}
                    <span className="capitalize">{tab === 'profile' ? 'Profil' : tab === 'training' ? 'Plan' : tab === 'links' ? 'Links' : 'Verlauf'}</span>
                </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}