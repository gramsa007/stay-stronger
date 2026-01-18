import React, { useState } from 'react';
import { X, Save, Dumbbell, Plus } from 'lucide-react';

interface EquipmentModalProps {
  onClose: () => void;
  equipment: string[];
  onSave: (eq: string[]) => void;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({ onClose, equipment, onSave }) => {
  const [items, setItems] = useState(equipment);
  const [newItem, setNewItem] = useState('');

  const add = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const remove = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[80vh]">
        <div className="bg-gray-900 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Dumbbell size={20} />
            <h2 className="font-bold">Mein Equipment</h2>
          </div>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <div className="p-4 flex gap-2 border-b border-gray-100">
          <input 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Neues Gerät (z.B. Kettlebell)"
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
          <button onClick={add} className="bg-gray-900 text-white p-3 rounded-xl hover:bg-gray-800">
            <Plus size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => (
              <span key={idx} className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 group">
                {item}
                <button onClick={() => remove(idx)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => { onSave(items); onClose(); }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Save size={18} /> Speichern
          </button>
        </div>
      </div>
    </div>
  );
};