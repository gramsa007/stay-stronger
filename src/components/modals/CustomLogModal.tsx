import React, { useState } from 'react';
import { X, Save, Clock, FileText, Type } from 'lucide-react';

interface CustomLogProps {
  onClose: () => void;
  onSave: (title: string, duration: string, note: string) => void;
}

export const CustomLogModal: React.FC<CustomLogProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (title) {
      onSave(title, duration, note);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="bg-green-600 p-4 flex justify-between items-center text-white">
          <h2 className="font-bold">Manuelles Log</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Aktivität</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-3 focus-within:ring-2 ring-green-500">
              <Type size={18} className="text-gray-400" />
              <input 
                className="flex-1 outline-none text-gray-800"
                placeholder="z.B. Laufen, Yoga..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dauer (Min)</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-3 focus-within:ring-2 ring-green-500">
              <Clock size={18} className="text-gray-400" />
              <input 
                type="number"
                className="flex-1 outline-none text-gray-800"
                placeholder="45"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notiz</label>
            <div className="flex items-start gap-2 border border-gray-200 rounded-xl p-3 focus-within:ring-2 ring-green-500">
              <FileText size={18} className="text-gray-400 mt-1" />
              <textarea 
                className="flex-1 outline-none text-gray-800 resize-none h-20"
                placeholder="Wie war's?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={!title}
            className="w-full py-3.5 bg-green-600 disabled:opacity-50 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 mt-2"
          >
            <Save size={18} /> Speichern
          </button>
        </div>
      </div>
    </div>
  );
};