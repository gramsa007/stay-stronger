import React, { useState } from 'react';
import { X, ClipboardCheck } from 'lucide-react';

interface PastePlanProps {
  onClose: () => void;
  onImport: (json: string) => void;
}

export const PastePlanModal: React.FC<PastePlanProps> = ({ onClose, onImport }) => {
  const [json, setJson] = useState('');

  const handleImport = () => {
    if (!json.trim()) return;
    onImport(json);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[80vh]">
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <h2 className="font-bold">Plan Importieren</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="p-4 flex-1">
          <p className="text-sm text-gray-500 mb-3">Füge hier den JSON-Code ein, den ChatGPT generiert hat:</p>
          <textarea 
            className="w-full h-64 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder='{ "data": [ ... ] }'
            value={json}
            onChange={(e) => setJson(e.target.value)}
          />
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleImport}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <ClipboardCheck size={18} /> Plan laden
          </button>
        </div>
      </div>
    </div>
  );
};