import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Zap, Wind, Coffee } from 'lucide-react';

interface PromptModalProps {
  type: 'system' | 'plan' | 'warmup' | 'cooldown';
  value: string;
  onClose: () => void;
  onSave: (newValue: string) => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ type, value, onClose, onSave }) => {
  const [text, setText] = useState(value || '');

  // Bezeichnungen und Icons je nach Typ
  const config = {
    system: { title: 'Coaching Philosophie', icon: <Sparkles size={20} />, color: 'bg-indigo-600' },
    plan: { title: 'Plan Erstellung', icon: <Zap size={20} />, color: 'bg-blue-600' },
    warmup: { title: 'Warmup Prompt', icon: <Wind size={20} />, color: 'bg-orange-600' },
    cooldown: { title: 'Cooldown Prompt', icon: <Coffee size={20} />, color: 'bg-teal-600' }
  };

  const current = config[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      
      {/* Modal Container */}
      <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-800 flex flex-col max-h-[85vh] animate-in zoom-in-95 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${current.color} rounded-xl text-white shadow-lg`}>
              {current.icon}
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight italic uppercase">{current.title}</h2>
              <p className="text-xs text-slate-400 font-medium tracking-wider">KI-Anweisungen bearbeiten</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Prompt Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 bg-transparent text-slate-200 text-sm leading-relaxed outline-none resize-none custom-scrollbar"
              placeholder="Gib hier die Anweisungen für die KI ein..."
            />
          </div>
          <p className="mt-4 text-[10px] text-slate-500 font-medium leading-relaxed px-2">
            Hinweis: Diese Texte steuern, wie Coach Andy Trainingspläne erstellt und mit dir interagiert.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-3 text-slate-400 font-bold text-sm hover:text-white transition-colors"
          >
            Abbrechen
          </button>
          <button 
            onClick={() => onSave(text)}
            className={`px-8 py-3 ${current.color} hover:opacity-90 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-transform active:scale-95`}
          >
            <Save size={18} /> Speichern
          </button>
        </div>

      </div>
    </div>
  );
};