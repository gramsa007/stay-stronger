import React, { useState } from 'react';
import { X, Plus, Trash2, Dumbbell, Save } from 'lucide-react';

interface EquipmentCategory {
  category: string;
  items: string[];
}

interface EquipmentModalProps {
  onClose: () => void;
  equipment: EquipmentCategory[];
  onSave: (eq: EquipmentCategory[]) => void;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({ onClose, equipment, onSave }) => {
  // SICHERHEIT: Falls equipment 'undefined' ist, nimm eine leere Liste []
  const [localEquipment, setLocalEquipment] = useState<EquipmentCategory[]>(equipment || []);
  const [newItemText, setNewItemText] = useState<{ [key: string]: string }>({});

  const handleAddItem = (categoryName: string) => {
    const text = newItemText[categoryName]?.trim();
    if (!text) return;

    const updated = localEquipment.map(cat => {
      if (cat.category === categoryName) {
        return { ...cat, items: [...cat.items, text] };
      }
      return cat;
    });

    setLocalEquipment(updated);
    setNewItemText({ ...newItemText, [categoryName]: '' });
  };

  const handleDeleteItem = (categoryName: string, itemIndex: number) => {
    const updated = localEquipment.map(cat => {
      if (cat.category === categoryName) {
        return { ...cat, items: cat.items.filter((_, idx) => idx !== itemIndex) };
      }
      return cat;
    });
    setLocalEquipment(updated);
  };

  const handleSave = () => {
    onSave(localEquipment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 border border-slate-800">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-900/50">
               <Dumbbell size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Mein Equipment</h2>
              <p className="text-xs text-slate-400 font-medium">Was hast du im Home Gym?</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {(!localEquipment || localEquipment.length === 0) && (
            <div className="text-center text-slate-500 py-4">
              Keine Daten geladen. Bitte importiere dein Backup.
            </div>
          )}
          
          {localEquipment?.map((cat) => (
            <div key={cat.category} className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {cat.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 group border border-slate-600">
                    {item}
                    <button onClick={() => handleDeleteItem(cat.category, idx)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" placeholder="Neues Item..." value={newItemText[cat.category] || ''}
                  onChange={(e) => setNewItemText({ ...newItemText, [cat.category]: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                />
                <button onClick={() => handleAddItem(cat.category)} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors shadow-lg shadow-blue-900/20">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/50 rounded-b-3xl flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-3 text-slate-400 font-bold text-sm hover:text-white transition-colors">Abbrechen</button>
          <button onClick={handleSave} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/40 flex items-center gap-2 transition-transform active:scale-95"><Save size={16} /> Speichern</button>
        </div>
      </div>
    </div>
  );
};