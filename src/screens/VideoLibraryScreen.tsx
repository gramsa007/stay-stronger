import React, { useState } from 'react';
import { 
  Youtube, ExternalLink, Video, Plus, Trash2, X, Save, 
  CheckCircle, Clock, Activity, FileText, Search, ImageOff, Filter 
} from 'lucide-react';

interface VideoLibraryScreenProps {
  videos: any[];
  // UPDATE: Wir übergeben jetzt auch die Kategorie
  onAddVideo: (title: string, url: string, category: string) => void;
  onDeleteVideo: (id: number) => void;
  onLogVideo: (video: any, duration: string, intensity: string, note: string) => void;
}

const CATEGORIES = ["Alle", "Workout", "Mobility", "Technik", "Mindset"];

// Helper: Extrahiert die YouTube ID für das Thumbnail
const getThumbnail = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg` 
    : null;
};

export const VideoLibraryScreen: React.FC<VideoLibraryScreenProps> = ({ videos, onAddVideo, onDeleteVideo, onLogVideo }) => {
  // UI States
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("Alle");

  // Add Form States
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('Workout'); // Default

  // Log Modal States
  const [loggingVideo, setLoggingVideo] = useState<any | null>(null);
  const [logDuration, setLogDuration] = useState('');
  const [logIntensity, setLogIntensity] = useState('5');
  const [logNote, setLogNote] = useState('');

  const openVideo = (url: string) => {
    window.open(url, '_blank');
  };

  const handleSaveVideo = () => {
    if (newTitle && newUrl) {
      onAddVideo(newTitle, newUrl, newCategory);
      setIsAdding(false);
      setNewTitle('');
      setNewUrl('');
      setNewCategory('Workout');
    }
  };

  // Filter Logik
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Alle" 
      ? true 
      : (video.category === selectedCategory || (!video.category && selectedCategory === "Sonstiges")); // Fallback für alte Videos
    
    return matchesSearch && matchesCategory;
  });

  // Öffnet das Log-Modal
  const handleLogClick = (e: React.MouseEvent, video: any) => {
      e.stopPropagation(); 
      setLoggingVideo(video);
      setLogDuration('15');
      setLogIntensity('5');
      setLogNote('');
  };

  const confirmLog = () => {
      if(loggingVideo) {
          onLogVideo(loggingVideo, logDuration, logIntensity, logNote);
          setLoggingVideo(null);
      }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      {/* --- HEADER --- */}
      <div className="bg-slate-900 pt-12 pb-8 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <h1 className="text-white text-2xl font-black italic uppercase tracking-tighter mb-1">
              Media Center
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">
              Deine Hyrox Bibliothek
            </p>
          </div>
          
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`p-3 rounded-2xl text-white transition-all shadow-lg ${isAdding ? 'bg-red-500 hover:bg-red-600 rotate-45' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Video suchen..." 
                className="w-full bg-slate-800/50 text-white placeholder-slate-400 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700/50 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {/* Category Chips (Scrollable) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
                        selectedCategory === cat 
                        ? 'bg-white text-slate-900 shadow-md transform scale-105' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* --- ADD FORM --- */}
      {isAdding && (
        <div className="mx-5 -mt-4 mb-6 bg-white p-5 rounded-[2rem] shadow-xl border border-blue-100 relative z-20 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
             <PlusCircle size={18} />
             <h3 className="font-black uppercase text-sm">Neues Video</h3>
          </div>
          
          <div className="space-y-3">
            <input 
                type="text" 
                placeholder="Titel" 
                className="w-full bg-slate-50 p-3 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="YouTube Link" 
                className="w-full bg-slate-50 p-3 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
            />
            
            {/* Category Select */}
            <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.filter(c => c !== "Alle").map(cat => (
                    <button
                        key={cat}
                        onClick={() => setNewCategory(cat)}
                        className={`py-2 rounded-lg text-[10px] font-black uppercase transition-colors ${
                            newCategory === cat 
                            ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' 
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <button 
                onClick={handleSaveVideo}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-lg mt-2"
            >
                <Save size={16} /> Speichern
            </button>
          </div>
        </div>
      )}

      {/* --- VIDEO LIST --- */}
      <div className="px-5 space-y-4 pt-4">
        {filteredVideos.length === 0 ? (
            <div className="text-center py-12 opacity-50 flex flex-col items-center">
                <Video size={48} className="text-slate-300 mb-2" strokeWidth={1} />
                <p className="text-sm font-bold text-slate-400">Keine Videos gefunden.</p>
            </div>
        ) : (
            filteredVideos.map((video) => {
                const thumbnail = getThumbnail(video.url);
                
                return (
                  <div 
                    key={video.id}
                    className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all active:scale-[0.98]"
                    onClick={() => openVideo(video.url)}
                  >
                    <div className="flex p-3 gap-3">
                        {/* Thumbnail or Fallback Icon */}
                        <div className="w-24 h-24 shrink-0 rounded-xl bg-slate-100 relative overflow-hidden">
                            {thumbnail ? (
                                <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <Youtube size={32} />
                                </div>
                            )}
                            {/* Play Overlay */}
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                                    <Video size={14} className="text-slate-900 ml-0.5" />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                            <div>
                                <div className="flex justify-between items-start gap-2">
                                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1">
                                        {video.category || "Allgemein"}
                                    </span>
                                </div>
                                <h3 className="text-slate-900 font-bold text-sm leading-tight line-clamp-2 mb-1">
                                    {video.title}
                                </h3>
                                <p className="text-slate-400 text-[10px] truncate">{video.url}</p>
                            </div>

                            {/* Action Row */}
                            <div className="flex justify-end items-center gap-2 mt-2">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if(window.confirm("Löschen?")) onDeleteVideo(video.id);
                                    }}
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button 
                                    onClick={(e) => handleLogClick(e, video)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-wide hover:bg-green-100 transition-colors"
                                >
                                    <CheckCircle size={14} /> Log
                                </button>
                            </div>
                        </div>
                    </div>
                  </div>
                );
            })
        )}
      </div>

      {/* --- LOG MODAL --- */}
      {loggingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-black italic uppercase text-slate-900">Training Loggen</h3>
                    <button onClick={() => setLoggingVideo(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                        <X size={18} />
                    </button>
                </div>
                
                <p className="text-sm text-slate-500 mb-4 font-medium">
                    Details zu <span className="text-blue-600 font-bold">"{loggingVideo.title}"</span>:
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1">
                            <Clock size={14} /> Dauer (Minuten)
                        </label>
                        <input 
                            type="number" 
                            className="w-full bg-slate-50 p-3 rounded-xl font-bold text-slate-900 text-lg outline-none focus:ring-2 focus:ring-blue-500"
                            value={logDuration}
                            onChange={(e) => setLogDuration(e.target.value)}
                            placeholder="z.B. 15"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1">
                            <Activity size={14} /> Intensität (RPE {logIntensity}/10)
                        </label>
                        <input 
                            type="range" 
                            min="1" max="10" 
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            value={logIntensity}
                            onChange={(e) => setLogIntensity(e.target.value)}
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1 px-1">
                            <span>Leicht</span>
                            <span>Mittel</span>
                            <span>Hart</span>
                            <span>Max</span>
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1">
                            <FileText size={14} /> Notiz (Optional)
                        </label>
                        <textarea 
                            className="w-full bg-slate-50 p-3 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={2}
                            value={logNote}
                            onChange={(e) => setLogNote(e.target.value)}
                            placeholder="Wie hat es sich angefühlt?"
                        />
                    </div>

                    <button 
                        onClick={confirmLog}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-black uppercase text-sm shadow-lg shadow-green-200 active:scale-95 transition-transform"
                    >
                        Eintragen & Feiern 🎉
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// Falls Lucide Icon 'PlusCircle' noch nicht importiert war, habe ich es oben ergänzt.
// Falls 'Filter' oder 'ImageOff' nicht in deiner Lucide-Version sind, können wir sie weglassen, aber meistens sind sie Standard.
import { PlusCircle } from 'lucide-react';