import { useEffect, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "@/lib/types";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { useGame } from "@/lib/stores/useGame";

export default function KeyboardManager() {
  const { isPaused, pauseGame, resumeGame } = useFireSafety();
  const { phase } = useGame();
  
  // Track previous pause key state to detect actual key presses
  const prevPausePressed = useRef(false);
  
  // Get pause key state
  const isPausePressed = useKeyboardControls<Controls>(state => state.pause);
  
  // Handle pause key - only toggle when key is NEWLY pressed (not held)
  useEffect(() => {
    if (isPausePressed && !prevPausePressed.current && phase === "playing") {
      // Key was just pressed (not held)
      if (isPaused) {
        resumeGame();
      } else {
        pauseGame();
      }
    }
    
    // Update previous state
    prevPausePressed.current = isPausePressed;
  }, [isPausePressed, isPaused, pauseGame, resumeGame, phase]);
  
  
  return null;
}
