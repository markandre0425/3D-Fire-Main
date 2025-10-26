import { create } from "zustand";
import { Howl } from "howler";

interface AudioState {
  backgroundMusic: Howl | null;
  hitSound: Howl | null;
  successSound: Howl | null;
  levelCompletedSound: Howl | null;
  isMuted: boolean;

  setBackgroundMusic: (music: Howl) => void;
  setHitSound: (sound: Howl) => void;
  setSuccessSound: (sound: Howl) => void;
  setLevelCompletedSound: (sound: Howl) => void;

  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playLevelCompleted: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  levelCompletedSound: null,
  isMuted: false, // Changed from true - sounds play by default

  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setLevelCompletedSound: (sound) => set({ levelCompletedSound: sound }),
  
  toggleMute: () => {
    const { isMuted, backgroundMusic, hitSound, successSound, levelCompletedSound } = get();
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
    console.log('🎉 playLevelCompleted called! Sound:', levelCompletedSound ? 'loaded' : 'NOT loaded', 'Muted:', isMuted);
    if (levelCompletedSound && !isMuted) {
      try {
        levelCompletedSound.volume(0.7);
        levelCompletedSound.play();
        console.log('🔊 Level completed sound playing!');
      } catch (error) {
        console.error('❌ Error playing level completed sound:', error);
      }
    } else if (!levelCompletedSound) {
      console.error('❌ Level completed sound not loaded!');
    } else if (isMuted) {
      console.log('🔇 Sound is muted - press M to unmute');
    }
  }
}));
