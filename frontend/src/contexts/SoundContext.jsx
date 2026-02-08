import React, { createContext, useContext, useState, useEffect } from 'react';

const SoundContext = createContext();

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return context;
};

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);

  // Load preferences from localStorage
  useEffect(() => {
    const savedEnabled = localStorage.getItem('soundEnabled');
    const savedVolume = localStorage.getItem('soundVolume');
    
    if (savedEnabled !== null) {
      setSoundEnabled(savedEnabled === 'true');
    }
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled);
    localStorage.setItem('soundVolume', volume);
  }, [soundEnabled, volume]);

  // Play sound using Web Audio API
  const playSound = (type) => {
    if (!soundEnabled) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = volume;

    switch (type) {
      case 'alert':
        // High-priority alert sound - urgent beeps
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          gain2.gain.value = volume;
          osc2.frequency.value = 1000;
          osc2.type = 'sine';
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.1);
        }, 150);
        
        setTimeout(() => {
          const osc3 = audioContext.createOscillator();
          const gain3 = audioContext.createGain();
          osc3.connect(gain3);
          gain3.connect(audioContext.destination);
          gain3.gain.value = volume;
          osc3.frequency.value = 800;
          osc3.type = 'sine';
          osc3.start();
          osc3.stop(audioContext.currentTime + 0.1);
        }, 300);
        break;

      case 'notification':
        // Gentle notification sound
        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
        break;

      case 'success':
        // Success chime - ascending notes
        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
        
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          gain2.gain.value = volume;
          osc2.frequency.value = 659.25; // E5
          osc2.type = 'sine';
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.2);
        }, 100);
        break;

      case 'warning':
        // Warning sound - descending tones
        oscillator.frequency.value = 660;
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;

      default:
        // Default beep
        oscillator.frequency.value = 440;
        oscillator.type = 'sine';
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const updateVolume = (newVolume) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  };

  const value = {
    soundEnabled,
    volume,
    playSound,
    toggleSound,
    updateVolume,
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};
