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
  const hasStartedMusic = useRef(false);

  useEffect(() => {
    if (phase === "playing" && !isPaused && backgroundMusic && !hasStartedMusic.current) {
      if (!isMuted) {
        backgroundMusic.play();
      }
      hasStartedMusic.current = true;
      console.log("Background music started");
    }

    if ((isPaused || phase !== "playing") && backgroundMusic) {
      backgroundMusic.pause();
      console.log("Background music paused");
    }

    if (phase === "playing" && !isPaused && backgroundMusic && hasStartedMusic.current) {
      if (!isMuted) {
        backgroundMusic.play();
      }
      console.log("Background music resumed");
    }

    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        console.log("Background music cleaned up");
      }
    };
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
