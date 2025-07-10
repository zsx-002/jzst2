import { useEffect, useRef } from 'react';

interface MetronomeOptions {
  bpm: number;
  isPlaying: boolean;
  onBeat: () => void;
  onActionSuccess?: () => void;
}

export const useMetronome = ({ bpm, isPlaying, onBeat, onActionSuccess }: MetronomeOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize BGM
    if (!bgmRef.current) {
      bgmRef.current = new Audio('https://p.gsxcdn.com/3076374150_wju8pkal.mp3');
      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.3;
    }

    if (isPlaying) {
      // Start BGM
      bgmRef.current?.play().catch(console.warn);
      
      const beatInterval = (60 / bpm) * 1000;
      
      intervalRef.current = setInterval(() => {
        onBeat();
        playBeatSound();
      }, beatInterval);
    } else {
      // Pause BGM
      if (bgmRef.current) {
        bgmRef.current.pause();
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bpm, isPlaying, onBeat]);

  // Cleanup BGM on unmount
  useEffect(() => {
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);
  const playBeatSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  const playSuccessSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Create a crisp success sound with multiple frequencies
      oscillator.frequency.value = 1500;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
      
      // Add a second harmonic for richness
      const oscillator2 = ctx.createOscillator();
      const gainNode2 = ctx.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(ctx.destination);
      
      oscillator2.frequency.value = 2000;
      oscillator2.type = 'sine';
      
      gainNode2.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      oscillator2.start(ctx.currentTime);
      oscillator2.stop(ctx.currentTime + 0.15);
      
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  const playCelebrationSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const ctx = audioContextRef.current;
      
      // Create a celebratory fanfare with multiple tones
      const frequencies = [523, 659, 784, 1047]; // C, E, G, C (major chord)
      
      frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        const startTime = ctx.currentTime + (index * 0.1);
        const duration = 0.4;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  const playErrorSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 200;
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  return {
    playSuccessSound,
    playErrorSound,
    playCelebrationSound
  };
};