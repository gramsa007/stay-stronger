import React, { useState } from 'react';
import { X, Save, PlusCircle, Clock, FileText, Type } from 'lucide-react';

interface CustomLogModalProps {
  onClose: () => void;
  onSave: (title: string, duration: string, note: string) => void;
}

export const CustomLogModal: React.FC<CustomLogModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!title) return alert("Bitte gib dem Training einen Titel.");
    onSave(title, duration, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <PlusCircle className="text-blue-400" />
            <h2 className="text-xl font-black italic uppercase">Freies Training</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
        </div>
        
        {/* Formular */}
        <div className="p-6 space-y-5">
          
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mb-2 ml-1">
              <Type size={14} /> Titel
            </label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" 
              placeholder="z.B. Joggen im Park" 
              autoFocus
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mb-2 ml-1">
              <Clock size={14} /> Dauer (Minuten)
            </label>
            <input 
              type="number"
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" 
              placeholder="z.B. 45" 
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mb-2 ml-1">
              <FileText size={14} /> Notizen / Details
            </label>
            <textarea 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              className="w-full h-32 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-slate-900 focus:border-blue-500 outline-none resize-none transition-all placeholder:text-slate-300 leading-relaxed" 
              placeholder="Wie lief es? Was hast du gemacht?" 
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 mt-4"
          >
            <Save size={18} /> Eintrag Speichern
          </button>
        </div>
      </div>
    </div>
  );
};