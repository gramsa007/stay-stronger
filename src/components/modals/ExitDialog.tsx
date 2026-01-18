import React from 'react';
import { AlertTriangle, X, Save, Trash2 } from 'lucide-react';

interface ExitDialogProps {
  isOpen: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export const ExitDialog: React.FC<ExitDialogProps> = ({ isOpen, onSave, onDiscard, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Workout beenden?</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Dein aktueller Fortschritt ist noch nicht abgeschlossen.
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onSave}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Save size={18} /> Speichern & Beenden
          </button>

          <button 
            onClick={onDiscard}
            className="w-full py-3.5 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 size={18} /> Verwerfen
          </button>
          
          <button 
            onClick={onCancel}
            className="w-full py-3 text-gray-400 font-medium text-sm hover:text-gray-600 mt-2"
          >
            Abbrechen, zurück zum Training
          </button>
        </div>
      </div>
    </div>
  );
};