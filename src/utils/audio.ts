// src/utils/audio.ts

// Einfache Audio-Funktion für Beeps
export const playBeep = (frequency: number = 600, type: string = 'sine', volume: number = 0.1, duration: number = 0.1) => {
    // Sicherheitscheck für Browser-Support
    if (typeof window === 'undefined' || !window.AudioContext) return;
  
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
  
      osc.type = type as any; 
      osc.frequency.value = frequency;
  
      osc.connect(gain);
      gain.connect(ctx.destination);
  
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      // Kurzes Fade-Out um Knacken zu verhindern
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
  
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error("Audio Error:", e);
    }
  };