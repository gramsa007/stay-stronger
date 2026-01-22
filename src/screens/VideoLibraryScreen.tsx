import React, { useState } from 'react';
import { Youtube, ExternalLink, Video, Plus, Trash2, X, Save, CheckCircle, Clock, Activity, FileText } from 'lucide-react';

interface VideoLibraryScreenProps {
  videos: any[];
  onAddVideo: (title: string, url: string) => void;
  onDeleteVideo: (id: number) => void;
  // UPDATE: Die Funktion nimmt jetzt mehr Parameter
  onLogVideo: (video: any, duration: string, intensity: string, note: string) => void;
}

export const VideoLibraryScreen: React.FC<VideoLibraryScreenProps> = ({ videos, onAddVideo, onDeleteVideo, onLogVideo }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // NEU: State für das Log-Modal
  const [loggingVideo, setLoggingVideo] = useState<any | null>(null);
  const [logDuration, setLogDuration] = useState('');
  const [logIntensity, setLogIntensity] = useState('5'); // Standard Mittel
  const [logNote, setLogNote] = useState('');

  const openVideo = (url: string) => {
    window.open(url, '_blank');
  };

  const handleSaveVideo = () => {
    if (newTitle && newUrl) {
      onAddVideo(newTitle, newUrl);
      setIsAdding(false);
      setNewTitle('');
      setNewUrl('');
    }
  };

  // Öffnet das Log-Modal
  const handleLogClick = (e: React.MouseEvent, video: any) => {
      e.stopPropagation(); 
      setLoggingVideo(video);
      setLogDuration('15'); // Standardwert
      setLogIntensity('5');
      setLogNote('');
  };

  // Speichert das Log und schließt Modal
  const confirmLog = () => {
      if(loggingVideo) {
          onLogVideo(loggingVideo, logDuration, logIntensity, logNote);
          setLoggingVideo(null);
      }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      {/* Header Section */}
      <div className="bg-slate-900 pt-12 pb-12 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[100px] opacity-10 translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-white text-2xl font-black italic uppercase tracking-tighter mb-1">
              Video Library
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">
              Tutorials & Workouts
            </p>
          </div>
          
          {/* Add Button */}
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="p-3 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-colors"
          >
            {isAdding ? <X size={24} /> : <Plus size={24} />}
          </button>
        </div>
      </div>

      {/* --- ADD NEW VIDEO OVERLAY --- */}
      {isAdding && (
        <div className="mx-5 -mt-6 mb-4 bg-white p-5 rounded-[2rem] shadow-lg border-2 border-blue-100 relative z-30 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-black text-slate-900 uppercase text-sm mb-3">Neues Video verknüpfen</h3>
          <input 
            type="text" 
            placeholder="Titel (z.B. Hyrox Technik)" 
            className="w-full bg-slate-50 p-3 rounded-xl text-sm font-bold text-slate-900 mb-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="YouTube Link einfügen" 
            className="w-full bg-slate-50 p-3 rounded-xl text-sm font-medium text-slate-700 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <button 
            onClick={handleSaveVideo}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-lg shadow-slate-300"
          >
            <Save size={16} /> Speichern
          </button>
        </div>
      )}

      {/* --- LOG WORKOUT MODAL (Overlay) --- */}
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
                    Details zu <span className="text-blue-600 font-bold">"{loggingVideo.title}"</span> erfassen:
                </p>

                <div className="space-y-4">
                    {/* Duration Input */}
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

                    {/* Intensity Slider */}
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

                    {/* Note Input */}
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

      {/* Video List */}
      <div className="px-5 -mt-6 space-y-4 relative z-20 pt-4">
        {videos.map((video) => (
          <div 
            key={video.id}
            className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer active:scale-95 transition-all group hover:border-red-100 relative"
            onClick={() => openVideo(video.url)}
          >
            {/* Icon Box */}
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
              <Youtube size={28} strokeWidth={1.5} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 font-black italic uppercase text-sm mb-1 truncate pr-6">{video.title}</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider truncate">{video.url}</p>
            </div>

            {/* Actions Container */}
            <div className="flex items-center gap-3">
                 {/* LOG BUTTON */}
                <button 
                    onClick={(e) => handleLogClick(e, video)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-300 hover:bg-green-50 hover:text-green-600 hover:scale-110 transition-all shadow-sm"
                    title="Training loggen"
                >
                    <CheckCircle size={20} />
                </button>

                <div className="text-gray-300 group-hover:text-red-500 transition-colors">
                    <ExternalLink size={20} />
                </div>
            </div>

            {/* Delete Button */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm("Video löschen?")) onDeleteVideo(video.id);
                }}
                className="absolute -top-2 -right-2 bg-white text-gray-400 p-2 rounded-full shadow-md border border-gray-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 size={14} />
            </button>
          </div>
        ))}

        {videos.length === 0 && (
            <div className="text-center py-10 opacity-50">
                <p>Keine Videos gespeichert.</p>
            </div>
        )}

        {/* Info Box */}
        <div className="mt-8 p-6 bg-slate-200/50 rounded-[2rem] text-center">
          <Video size={24} className="mx-auto text-slate-400 mb-2" />
          <p className="text-slate-500 text-xs font-bold">
            Sammlung deiner wichtigsten Tutorials & Motivation-Clips.
          </p>
        </div>
      </div>
    </div>
  );
};