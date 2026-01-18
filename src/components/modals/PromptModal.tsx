import React, { useState, useEffect } from 'react';
import { X, Save, LucideIcon, RotateCcw } from 'lucide-react';

interface PromptModalProps {
  onClose: () => void;
  title: string;
  icon: LucideIcon;
  colorClass: string;
  currentPrompt: string;
  onSave: (val: string) => void;
  appendEquipment?: boolean;
  equipment?: any[];
  appendHistory?: boolean;
  history?: any[];
}

export const PromptModal: React.FC<PromptModalProps> = ({
  onClose, title, icon: Icon, colorClass, currentPrompt, onSave,
  appendEquipment, equipment, appendHistory, history
}) => {
  const [value, setValue] = useState(currentPrompt);

  useEffect(() => {
    setValue(currentPrompt);
  }, [currentPrompt]);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 overflow-hidden">
        
        {/* Header */}
        <div className={`p-6 ${colorClass} text-white flex justify-between items-center shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Icon size={24} />
            </div>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
            System Prompt (Anweisung an die KI)
          </label>
          
          {/* HIER WAR DER FEHLER: Jetzt text-gray-900 (Dunkelgrau) statt text-white */}
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-80 p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed shadow-inner"
            placeholder="Gib hier deine Anweisungen für Coach Andy ein..."
          />

          {/* Info Badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {appendEquipment && (
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 flex items-center gap-1">
                + Equipment wird automatisch angehängt
              </span>
            )}
            {appendHistory && (
              <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold border border-purple-100 flex items-center gap-1">
                + Trainingsverlauf wird automatisch angehängt
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
          <button 
            onClick={() => setValue(currentPrompt)} 
            className="px-4 py-2 text-gray-500 font-bold text-sm hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-2"
          >
            <RotateCcw size={16} /> Reset
          </button>
          <button 
            onClick={handleSave} 
            className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center gap-2 ${colorClass}`}
          >
            <Save size={18} /> Speichern
          </button>
        </div>
      </div>
    </div>
  );
};