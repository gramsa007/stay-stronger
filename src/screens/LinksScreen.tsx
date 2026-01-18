import React, { useState } from 'react';
import { 
  Search, Youtube, Instagram, ExternalLink, 
  PlayCircle, Trash2, Plus
} from 'lucide-react';
import { AddLinkModal } from '../components/modals/AddLinkModal';

interface LinksScreenProps {
  links: any[];
  onAddLink: (link: any) => void;
  onDeleteLink: (id: number) => void;
}

export const LinksScreen: React.FC<LinksScreenProps> = ({ links, onAddLink, onDeleteLink }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Alles');
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ['Alles', 'Workout', 'Mobility', 'Mindset', 'Wissen', 'Wettkampf'];

  const getIcon = (type: string) => {
    switch(type) {
      case 'youtube': return <Youtube size={20} />;
      case 'instagram': return <Instagram size={20} />;
      default: return <ExternalLink size={20} />;
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case 'youtube': return 'text-red-600 bg-red-50';
      case 'instagram': return 'text-pink-600 bg-pink-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          link.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Alles' || link.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      
      {showAddModal && <AddLinkModal onClose={() => setShowAddModal(false)} onSave={onAddLink} />}

      {/* Header Bereich */}
      <div className="bg-slate-900 pt-12 pb-8 px-6 rounded-b-[2rem] shadow-xl sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white text-2xl font-black italic uppercase tracking-tighter">Bibliothek</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {/* Suchleiste */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Suche..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 text-white placeholder:text-slate-500 rounded-2xl py-4 pl-12 pr-4 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Kategorien Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                activeCategory === cat 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Bereich */}
      <div className="px-5 mt-6 space-y-4">
        {filteredLinks.length === 0 ? (
          <div className="text-center mt-12 opacity-50">
            <Search size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-400 font-bold">Keine Ergebnisse gefunden.</p>
          </div>
        ) : (
          filteredLinks.map((link) => (
            <div 
              key={link.id} 
              className="relative block bg-white rounded-[1.5rem] p-1 shadow-sm border border-gray-100 group"
            >
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 pr-12"
              >
                {/* Icon Box */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getColor(link.type)}`}>
                  {getIcon(link.type)}
                </div>
                
                {/* Text Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-md">
                      {link.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 truncate">
                      {link.channel}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-black text-slate-900 leading-snug mb-1 truncate">
                    {link.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 font-medium line-clamp-2">
                    {link.desc}
                  </p>
                </div>
              </a>

              {/* Löschen Button (oben rechts, absolut positioniert) */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if(window.confirm("Link wirklich löschen?")) onDeleteLink(link.id);
                }}
                className="absolute top-4 right-4 p-2 text-slate-200 hover:text-red-500 transition-colors z-10"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};