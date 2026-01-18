import React, { useState } from 'react';
import { X, Save, Sparkles } from 'lucide-react';

interface PromptModalProps {
  onClose: () => void;
  title: string;
  icon: any;
  colorClass: string;
  currentPrompt: string;
  onSave: (val: string) => void;
  appendEquipment?: boolean;
  equipment?: string[];
  appendHistory?: boolean;
  history?: any[];
}

export const PromptModal: React.FC<PromptModalProps> = ({ 
  onClose, title, icon: Icon, colorClass, currentPrompt, onSave, 
  appendEquipment, equipment, appendHistory, history 
}) => {
  const [val, setVal] = useState(currentPrompt);

  const handleCopy = () => {
    let finalPrompt = val;
    if (appendEquipment && equipment) {
      finalPrompt += `\n\nVerfügbares Equipment: ${equipment.join(', ')}`;
    }
    if (appendHistory && history) {
      // Letzte 3 Workouts als Kontext
      const context = history.slice(0, 3).map(h => `${h.workoutTitle} (${h.date})`).join(', ');
      finalPrompt += `\n\nTrainingshistorie: ${context}`;
    }
    navigator.clipboard.writeText(finalPrompt);
    alert("Prompt in die Zwischenablage kopiert! Füge ihn in ChatGPT/Claude ein.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        <div className={`${colorClass} p-4 flex justify-between items-center text-white`}>
          <div className="flex items-center gap-2">
            <Icon size={20} />
            <h2 className="font-bold">{title}</h2>
          </div>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-sm text-gray-500 mb-2">Bearbeite den System-Prompt für die KI:</p>
          <textarea 
            className="w-full h-48 p-3 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
          
          {(appendEquipment || appendHistory) && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
              <span className="font-bold text-gray-700">Hinweis:</span> Beim Kopieren werden automatisch 
              {appendEquipment && ' dein Equipment'} {appendEquipment && appendHistory && 'und'} {appendHistory && ' deine letzten Workouts'} angehängt.
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex gap-3">
          <button 
            onClick={handleCopy}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Sparkles size={18} /> Kopieren
          </button>
          <button 
            onClick={() => { onSave(val); onClose(); }}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Save size={18} /> Speichern
          </button>
        </div>
      </div>
    </div>
  );
};