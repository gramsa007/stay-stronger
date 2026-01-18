import React, { useState } from 'react';
import { X, ClipboardList, AlertTriangle } from 'lucide-react';

export const PastePlanModal = ({ onClose, onImport }: { onClose: () => void, onImport: (json: any) => void }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImportClick = () => {
    setError(null);
    try {
      // 1. Bereinigen: Entfernt Markdown-Code-Blöcke (```json ...) und Leerzeichen
      let cleanText = jsonText.trim();
      if (cleanText.startsWith('```json')) cleanText = cleanText.replace('```json', '');
      if (cleanText.startsWith('```')) cleanText = cleanText.replace('```', '');
      if (cleanText.endsWith('```')) cleanText = cleanText.replace('```', '');
      cleanText = cleanText.trim();

      if (!cleanText) {
        setError("Das Feld ist leer.");
        return;
      }

      // 2. Parsen
      const parsed = JSON.parse(cleanText);
      onImport(parsed);
    } catch (e) {
      console.error(e);
      setError("Format-Fehler: Bitte kopiere nur den Code zwischen den geschweiften Klammern { ... }");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-blue-400" />
            <h2 className="text-xl font-black italic uppercase">Plan Importieren</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
        </div>
        
        <div className="p-6 flex-1 flex flex-col min-h-0">
          <p className="text-xs text-gray-500 font-bold mb-4 uppercase tracking-wider">Füge hier den JSON-Code ein:</p>
          
          <textarea
            value={jsonText}
            onChange={(e) => { setJsonText(e.target.value); setError(null); }}
            className="w-full flex-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-[10px] font-mono focus:border-blue-500 outline-none transition-all resize-none mb-4 text-slate-700"
            placeholder='{ "data": [ ... ] }'
          />

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-100">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <button
            onClick={handleImportClick}
            className="w-full py-4 bg-blue-900 text-white rounded-2xl font-black shadow-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3 shrink-0 active:scale-95"
          >
            <ClipboardList size={20} /> Plan jetzt laden
          </button>
        </div>
      </div>
    </div>
  );
};