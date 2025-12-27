import { useCallback, useRef, useEffect } from 'react';

// Simple click sound using Web Audio API
const createClickSound = (audioContext: AudioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

// Fanfare sound using Web Audio API
const createFanfareSound = (audioContext: AudioContext) => {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  const duration = 0.2;
  
  notes.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * duration);
    
    const startTime = audioContext.currentTime + index * duration;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  });
  
  // Final chord
  const chordTime = audioContext.currentTime + notes.length * duration;
  [523.25, 659.25, 783.99, 1046.50].forEach((freq) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(freq, chordTime);
    
    gainNode.gain.setValueAtTime(0.3, chordTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, chordTime + 0.8);
    
    oscillator.start(chordTime);
    oscillator.stop(chordTime + 0.8);
  });
};

// Christmas jingle using Web Audio API
const createChristmasJingle = (audioContext: AudioContext, onEnd?: () => void) => {
  // "Jingle Bells" melody notes with timing
  const melody = [
    { note: 659.25, duration: 0.25 }, // E
    { note: 659.25, duration: 0.25 }, // E
    { note: 659.25, duration: 0.5 },  // E
    { note: 659.25, duration: 0.25 }, // E
    { note: 659.25, duration: 0.25 }, // E
    { note: 659.25, duration: 0.5 },  // E
    { note: 659.25, duration: 0.25 }, // E
    { note: 783.99, duration: 0.25 }, // G
    { note: 523.25, duration: 0.25 }, // C
    { note: 587.33, duration: 0.25 }, // D
    { note: 659.25, duration: 1.0 },  // E
  ];
  
  let time = audioContext.currentTime;
  let totalDuration = 0;
  
  melody.forEach(({ note, duration }) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(note, time);
    
    gainNode.gain.setValueAtTime(0.15, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration * 0.9);
    
    oscillator.start(time);
    oscillator.stop(time + duration);
    
    time += duration;
    totalDuration += duration;
  });
  
  if (onEnd) {
    setTimeout(onEnd, totalDuration * 1000);
  }
  
  return totalDuration;
};

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingMusicRef = useRef(false);
  const musicTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playClick = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    createClickSound(ctx);
  }, [getAudioContext]);

  const playFanfare = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    createFanfareSound(ctx);
  }, [getAudioContext]);

  const playBackgroundMusic = useCallback(() => {
    if (isPlayingMusicRef.current) return;
    
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    isPlayingMusicRef.current = true;
    
    const playLoop = () => {
      if (!isPlayingMusicRef.current) return;
      
      const duration = createChristmasJingle(ctx, () => {
        if (isPlayingMusicRef.current) {
          musicTimeoutRef.current = setTimeout(playLoop, 1000);
        }
      });
    };
    
    playLoop();
  }, [getAudioContext]);

  const stopBackgroundMusic = useCallback(() => {
    isPlayingMusicRef.current = false;
    if (musicTimeoutRef.current) {
      clearTimeout(musicTimeoutRef.current);
      musicTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopBackgroundMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopBackgroundMusic]);

  return {
    playClick,
    playFanfare,
    playBackgroundMusic,
    stopBackgroundMusic,
  };
};
