import React, { useState } from 'react';
import { X, Link as LinkIcon, Save } from 'lucide-react';

interface AddLinkModalProps {
  onClose: () => void;
  onSave: (link: any) => void;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [channel, setChannel] = useState('');
  const [category, setCategory] = useState('Workout');
  const [desc, setDesc] = useState('');

  const handleSave = () => {
    if (!title || !url) return alert("Bitte Titel und URL angeben");

    // Automatische Typ-Erkennung
    let type = 'web';
    if (url.toLowerCase().includes('youtube') || url.toLowerCase().includes('youtu.be')) type = 'youtube';
    else if (url.toLowerCase().includes('instagram')) type = 'instagram';

    onSave({
      title,
      url,
      channel: channel || 'Web',
      category,
      desc,
      type
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <LinkIcon className="text-blue-400" />
            <h2 className="text-xl font-black italic uppercase">Neuer Link</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
        </div>
        
        {/* Formular */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase mb-1 ml-1">Titel</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:border-blue-500 outline-none" placeholder="z.B. Hyrox Technik" />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase mb-1 ml-1">URL (Link)</label>
            <input value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:border-blue-500 outline-none" placeholder="https://..." />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-black text-slate-500 uppercase mb-1 ml-1">Kategorie</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-900 outline-none appearance-none">
                <option>Workout</option>
                <option>Mobility</option>
                <option>Mindset</option>
                <option>Wissen</option>
                <option>Wettkampf</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-black text-slate-500 uppercase mb-1 ml-1">Kanal / Autor</label>
              <input value={channel} onChange={e => setChannel(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-900 outline-none" placeholder="z.B. Hyrox" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase mb-1 ml-1">Beschreibung</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:border-blue-500 outline-none resize-none" placeholder="Kurze Notiz..." />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-2 mt-4 active:scale-95"
          >
            <Save size={18} /> Speichern
          </button>
        </div>
      </div>
    </div>
  );
};