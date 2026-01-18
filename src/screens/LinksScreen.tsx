import React, { useState, useEffect } from 'react';
import { 
  Youtube, Instagram, Plus, Trash2, Search, 
  LayoutGrid, X, ExternalLink, Calendar, Tag
} from 'lucide-react';

interface CustomLink {
  id: number;
  title: string;
  url: string;
  platform: 'youtube' | 'instagram' | 'web';
  category: string;
  date: string;
}

const CATEGORIES = ["Mobility", "Technik", "Workout", "Mindset", "Ernährung"];

export const LinksScreen = () => {
  const [links, setLinks] = useState<CustomLink[]>(() => {
    const saved = localStorage.getItem('coach-andy-links');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Alle');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newPlatform, setNewPlatform] = useState<'youtube' | 'instagram' | 'web'>('youtube');
  const [newCategory, setNewCategory] = useState('Mobility');

  useEffect(() => {
    localStorage.setItem('coach-andy-links', JSON.stringify(links));
  }, [links]);

  const handleAdd = () => {
    if (!newTitle || !newUrl) return;
    
    let safeUrl = newUrl;
    if (!safeUrl.startsWith('http')) safeUrl = 'https://' + safeUrl;

    const newLink: CustomLink = {
      id: Date.now(),
      title: newTitle,
      url: safeUrl,
      platform: newPlatform,
      category: newCategory,
      date: new Date().toLocaleDateString('de-DE') 
    };

    setLinks([newLink, ...links]);
    setNewTitle('');
    setNewUrl('');
    setShowAddForm(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Eintrag wirklich löschen?')) {
      setLinks(links.filter(l => l.id !== id));
    }
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Alle' || link.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (platform: string) => {
    switch(platform) {
      case 'youtube': return <Youtube size={24} className="text-white" />;
      case 'instagram': return <Instagram size={24} className="text-white" />;
      default: return <ExternalLink size={24} className="text-white" />;
    }
  };

  const getIconBg = (platform: string) => {
    switch(platform) {
      case 'youtube': return 'bg-gradient-to-br from-red-500 to-red-600';
      case 'instagram': return 'bg-gradient-to-br from-purple-500 to-pink-500';
      default: return 'bg-gradient-to-br from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-8 pb-6 px-6 rounded-b-[2.5rem] shadow-xl z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-black text-white tracking-tight">Bibliothek</h1>
              <LayoutGrid className="text-white/80" size={24} />
            </div>
            <p className="text-white/80 text-sm font-medium">Videos, Tutorials & Links</p>
          </div>
          <button onClick={() => setShowAddForm(true)} className="bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-slate-900 px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm border border-white/30">
            <Plus size={16} /> Neu
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" size={18} />
          <input 
            type="text" placeholder="Suche..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/60 outline-none focus:bg-white/20 transition-all font-medium"
          />
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto px-6 py-6 scrollbar-hide snap-x">
        <button onClick={() => setActiveCategory('Alle')} className={`snap-start px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeCategory === 'Alle' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 shadow-sm'}`}>Alle</button>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`snap-start px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 shadow-sm'}`}>{cat}</button>
        ))}
      </div>

      {/* List */}
      <div className="px-6 space-y-4">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-10 text-gray-400"><p>Keine Einträge gefunden.</p></div>
        ) : (
          filteredLinks.map((link) => (
            <div key={link.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:scale-[1.01] transition-transform">
              <div className={`w-14 h-14 ${getIconBg(link.platform)} rounded-2xl flex items-center justify-center shadow-md shrink-0`}>{getIcon(link.platform)}</div>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate mb-1">{link.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide">{link.category}</span>
                  <span className="text-gray-300 text-[10px] flex items-center gap-1"><Calendar size={10} /> {link.date}</span>
                </div>
              </a>
              <button onClick={() => handleDelete(link.id)} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 space-y-4">
            <div className="flex justify-between items-center mb-2"><h2 className="text-xl font-bold text-gray-900">Neuer Eintrag</h2><button onClick={() => setShowAddForm(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button></div>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Titel" className="w-full p-3.5 bg-gray-50 rounded-xl font-medium outline-none focus:ring-2 focus:ring-slate-900" />
            <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="Link" className="w-full p-3.5 bg-gray-50 rounded-xl font-medium outline-none focus:ring-2 focus:ring-slate-900" />
            <div className="flex flex-wrap gap-2">{CATEGORIES.map(cat => (<button key={cat} onClick={() => setNewCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${newCategory === cat ? 'bg-slate-900 text-white' : 'bg-white text-gray-500'}`}>{cat}</button>))}</div>
            <button onClick={handleAdd} disabled={!newTitle || !newUrl} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl mt-2">Speichern</button>
          </div>
        </div>
      )}
    </div>
  );
};