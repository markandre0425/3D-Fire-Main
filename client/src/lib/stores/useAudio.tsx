import { create } from "zustand";
import { Howl } from "howler";

interface AudioState {
  backgroundMusic: Howl | null;
  hitSound: Howl | null;
  successSound: Howl | null;
  levelCompletedSound: Howl | null;
  coughSound: Howl | null;
  fireDamageSound: Howl | null;
  deathSound: Howl | null;
  noAmmoSound: Howl | null;
  isMuted: boolean;

  setBackgroundMusic: (music: Howl) => void;
  setHitSound: (sound: Howl) => void;
  setSuccessSound: (sound: Howl) => void;
  setLevelCompletedSound: (sound: Howl) => void;
  setCoughSound: (sound: Howl) => void;
  setFireDamageSound: (sound: Howl) => void;
  setDeathSound: (sound: Howl) => void;
  setNoAmmoSound: (sound: Howl) => void;

  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playLevelCompleted: () => void;
  playCough: () => void;
  playFireDamage: () => void;
  playDeath: () => void;
  playNoAmmo: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  levelCompletedSound: null,
  coughSound: null,
  fireDamageSound: null,
  deathSound: null,
  noAmmoSound: null,
  isMuted: false, // Changed from true - sounds play by default

  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setLevelCompletedSound: (sound) => set({ levelCompletedSound: sound }),
  setCoughSound: (sound) => set({ coughSound: sound }),
  setFireDamageSound: (sound) => set({ fireDamageSound: sound }),
  setDeathSound: (sound) => set({ deathSound: sound }),
  setNoAmmoSound: (sound) => set({ noAmmoSound: sound }),
  
  toggleMute: () => {
    const { isMuted, backgroundMusic, hitSound, successSound, levelCompletedSound, coughSound, fireDamageSound, deathSound, noAmmoSound } = get();
    const newMutedState = !isMuted;

    if (backgroundMusic) {
      backgroundMusic.mute(newMutedState);
    }
    
    if (hitSound) {
      hitSound.mute(newMutedState);
    }
    
    if (successSound) {
      successSound.mute(newMutedState);
    }

    if (levelCompletedSound) {
      levelCompletedSound.mute(newMutedState);
    }
    
    if (coughSound) {
      coughSound.mute(newMutedState);
    }
    
    if (fireDamageSound) {
      fireDamageSound.mute(newMutedState);
    }
    
    if (deathSound) {
      deathSound.mute(newMutedState);
    }
    
    if (noAmmoSound) {
      noAmmoSound.mute(newMutedState);
    }

    set({ isMuted: newMutedState });
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      hitSound.volume(0.3);
      hitSound.play();
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      successSound.play();
    }
  },

  playLevelCompleted: () => {
    const { levelCompletedSound, isMuted } = get();
    if (levelCompletedSound && !isMuted) {
      try {
        levelCompletedSound.volume(0.7);
        levelCompletedSound.play();
      } catch (error) {
        console.error('❌ Error playing level completed sound:', error);
      }
    } else if (!levelCompletedSound) {
      console.error('❌ Level completed sound not loaded!');
    }
  },
  
  playCough: () => {
    const { coughSound, isMuted } = get();
    if (coughSound && !isMuted) {
      // Only play if not already playing to avoid overlap
      if (!coughSound.playing()) {
        coughSound.volume(0.5);
        coughSound.play();
      }
    }
  },
  
  playFireDamage: () => {
    const { fireDamageSound, isMuted } = get();
    if (fireDamageSound && !isMuted) {
      // Only play if not already playing to avoid overlap
      if (!fireDamageSound.playing()) {
        fireDamageSound.volume(0.6);
        fireDamageSound.play();
      }
    }
  },
  
  playDeath: () => {
    const { deathSound, isMuted } = get();
    if (deathSound && !isMuted) {
      deathSound.volume(0.7);
      deathSound.play();
    }
  },
  
  playNoAmmo: () => {
    const { noAmmoSound, isMuted } = get();
    if (noAmmoSound && !isMuted) {
      // Only play if not already playing to avoid spam
      if (!noAmmoSound.playing()) {
        noAmmoSound.volume(0.5);
        noAmmoSound.play();
      }
    }
  }
}));
