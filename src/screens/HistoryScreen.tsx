import React, { useState } from 'react';
import { Clock, Trophy, Trash2, ChevronDown, ChevronUp, Sparkles, Copy, Dumbbell } from 'lucide-react';

interface HistoryScreenProps {
  history: any[];
  onDeleteEntry: (id: number) => void;
  onSelectEntry: (entry: any) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ 
  history, 
  onDeleteEntry, 
  onSelectEntry 
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: '2-digit'
    });
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Berechnet das Gesamtvolumen (Gewicht * Reps) für eine Session
  const calculateVolume = (exercises: any[]) => {
    let volume = 0;
    if (!exercises) return 0;
    
    exercises.forEach(ex => {
      if (ex.logs) {
        ex.logs.forEach((log: any) => {
          const w = parseFloat(log.weight) || 0;
          const r = parseFloat(log.reps) || 0;
          volume += w * r;
        });
      }
    });
    return volume;
  };

  // Erstellt einen String für AI-Analyse eines EINZELNEN Trainings
  const copyForAI = (entry: any) => {
    let text = `Training am ${formatDate(entry.date)}: ${entry.workoutTitle}\n`;
    text += `Dauer: ${entry.totalDuration}\n\n`;
    
    if (entry.snapshot && entry.snapshot.exercises) {
      entry.snapshot.exercises.forEach((ex: any) => {
        text += `${ex.name}:\n`;
        if (ex.logs) {
           ex.logs.forEach((log: any, idx: number) => {
             text += `  Set ${idx+1}: ${log.weight}kg x ${log.reps}\n`;
           });
        }
        text += "\n";
      });
    }

    navigator.clipboard.writeText(text).then(() => {
      alert("Training für AI kopiert! 📋");
    });
  };

  // --- NEU: Kopiert den GESAMTEN Verlauf MIT AI-PROMPT ---
  const copyAllHistory = () => {
    if (history.length === 0) {
      alert("Noch keine Trainings zum Kopieren vorhanden.");
      return;
    }

    // HIER IST DER MAGISCHE TEIL: Der Prompt wird automatisch vorangestellt
    let fullText = "Hier ist mein kompletter Trainingsverlauf. Bitte analysiere ihn als erfahrener Strength Coach.\n";
    fullText += "1. Progressive Overload: Wo werde ich stärker, wo stagniere ich?\n";
    fullText += "2. Volumen: Wie entwickelt sich mein Workload?\n";
    fullText += "3. Balance: Trainiere ich ausgeglichen (Push/Pull/Legs)?\n";
    fullText += "4. Empfehlung: Soll ich nächste Woche Gewichte erhöhen oder halten?\n\n";
    fullText += "HIER SIND DIE DATEN:\n\n";

    // Wir gehen durch ALLE Einträge
    history.forEach((entry) => {
      fullText += `--------------------------------------------------\n`;
      fullText += `DATUM: ${formatDate(entry.date)} | TITEL: ${entry.workoutTitle || "Freies Training"}\n`;
      fullText += `DAUER: ${entry.totalDuration}\n\n`;

      if (entry.snapshot && entry.snapshot.exercises) {
        entry.snapshot.exercises.forEach((ex: any) => {
          fullText += `${ex.name}:\n`;
          if (ex.logs) {
             ex.logs.forEach((log: any, idx: number) => {
               // Wenn Weight oder Reps leer sind, schreibe 0
               const w = log.weight || "0";
               const r = log.reps || "0";
               fullText += `  - Set ${idx+1}: ${w}kg x ${r} Reps\n`;
             });
          }
        });
      }
      fullText += "\n";
    });

    navigator.clipboard.writeText(fullText).then(() => {
      alert("✅ Kompletter Verlauf + Analyse-Prompt kopiert!\nEinfach in Gemini einfügen und absenden.");
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      <div className="bg-slate-900 pt-12 pb-12 px-6 rounded-b-[3rem] shadow-xl">
        <h1 className="text-white text-2xl font-black italic uppercase tracking-tighter mb-2">Verlauf</h1>
        <div className="flex items-center justify-between">
            <div className="text-white font-mono text-sm opacity-80">{history.length} Workouts</div>
            
            {/* NEUER BUTTON: Gesamten Verlauf kopieren */}
            <button 
                onClick={copyAllHistory}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-900/50"
            >
                <Copy size={14} />
                Alles Kopieren
            </button>
        </div>
      </div>

      <div className="px-5 -mt-6 space-y-3">
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200 mt-4">
            <Trophy className="mx-auto text-gray-300 mb-3" size={30} />
            <p className="text-slate-500 font-bold text-sm">Noch keine Trainings absolviert.</p>
          </div>
        ) : (
          history.map((entry) => {
            const isExpanded = expandedId === entry.id;
            const exercises = entry.snapshot?.exercises || [];
            const volume = calculateVolume(exercises);

            return (
              <div key={entry.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
                
                {/* --- CARD HEADER (Clickable) --- */}
                <div 
                  onClick={() => toggleExpand(entry.id)}
                  className="p-4 flex items-center gap-4 cursor-pointer active:bg-gray-50"
                >
                  {/* Date Badge */}
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 shrink-0">
                    <span className="text-[10px] text-gray-500 font-bold">{formatDate(entry.date).split('.')[0]}</span>
                    <span className="text-xs text-slate-900 font-black">{formatDate(entry.date).split('.')[1]}</span>
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-slate-900 truncate uppercase italic">
                      {entry.workoutTitle || "Freies Training"}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                        <Clock size={10} /> {entry.totalDuration || "0:00"}
                      </span>
                      {volume > 0 && (
                         <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                           <Dumbbell size={10} /> {(volume / 1000).toFixed(1)}t
                         </span>
                      )}
                    </div>
                  </div>

                  {/* Actions (Delete & Expand Icon) */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if(window.confirm("Löschen?")) onDeleteEntry(entry.id);
                      }}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                {/* --- EXPANDED DETAILS (Accordion) --- */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-gray-100 p-4 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* AI Copy Button (Einzeln) */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyForAI(entry);
                      }}
                      className="w-full mb-4 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md active:scale-95 transition-all"
                    >
                      <Sparkles size={14} /> 
                      Dieses Training analysieren
                    </button>

                    {/* Exercise List */}
                    <div className="space-y-4">
                      {exercises.map((ex: any, idx: number) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                          <h4 className="font-bold text-xs text-slate-900 uppercase mb-2">{ex.name}</h4>
                          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-500 border-b border-gray-100 pb-1 mb-1 opacity-50">
                            <span>Set</span>
                            <span>Weight</span>
                            <span>Reps</span>
                          </div>
                          {ex.logs && ex.logs.map((log: any, sIdx: number) => (
                            <div key={sIdx} className="grid grid-cols-3 gap-2 text-xs font-medium text-slate-700 py-0.5">
                              <span className="text-slate-400">{sIdx + 1}</span>
                              <span>{log.weight}</span>
                              <span>{log.reps}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};