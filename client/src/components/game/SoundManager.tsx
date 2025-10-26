import { useEffect, useRef } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { useGame } from "@/lib/stores/useGame";
import { useFireSafety } from "@/lib/stores/useFireSafety";

export default function SoundManager() {
  const { 
    backgroundMusic, 
    isMuted, 
    toggleMute 
  } = useAudio();
  const { phase } = useGame();
  const { isPaused } = useFireSafety();
  const isPlayingRef = useRef(false);

  // Handle background music play/pause based on game state
  useEffect(() => {
    if (!backgroundMusic) return;

    const shouldPlay = phase === "playing" && !isPaused && !isMuted;

    if (shouldPlay && !isPlayingRef.current) {
      backgroundMusic.play();
      isPlayingRef.current = true;
    } else if (!shouldPlay && isPlayingRef.current) {
      backgroundMusic.pause();
      isPlayingRef.current = false;
    }
  }, [phase, isPaused, backgroundMusic, isMuted]);

  const handleMuteToggle = () => {
    toggleMute();
    
    if (backgroundMusic) {
      if (isMuted) {
        backgroundMusic.play();
      } else {
        backgroundMusic.pause();
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        handleMuteToggle();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isMuted]);
  
  return null;
}
