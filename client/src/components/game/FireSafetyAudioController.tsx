import { useEffect, useRef } from "react";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { useAudio } from "@/lib/stores/useAudio";

/**
 * FireSafetyAudioController
 *
 * Listens to fire safety game state and plays audio cues.
 * Keeps side-effects (sounds) out of Zustand store logic.
 */
export default function FireSafetyAudioController() {
  const hazards = useFireSafety((s) => s.hazards);
  const isLevelComplete = useFireSafety((s) => s.isLevelComplete);
  const playHit = useAudio((s) => s.playHit);
  const playLevelCompleted = useAudio((s) => s.playLevelCompleted);

  const prevExtinguishedIdsRef = useRef<Set<string>>(new Set());
  const prevLevelCompleteRef = useRef<boolean>(false);

  // Track newly extinguished hazards each frame
  useEffect(() => {
    const prev = prevExtinguishedIdsRef.current;
    const next = new Set<string>();

    for (const h of hazards) {
      if (h.isExtinguished) {
        next.add(h.id);
        if (!prev.has(h.id)) {
          // Newly extinguished hazard  (play hit sound once)
          playHit();
        }
      }
    }

    prevExtinguishedIdsRef.current = next;
  }, [hazards, playHit]);

  // Level complete sound when isLevelComplete flips from false to true
  useEffect(() => {
    if (!prevLevelCompleteRef.current && isLevelComplete) {
      playLevelCompleted();
    }
    prevLevelCompleteRef.current = isLevelComplete;
  }, [isLevelComplete, playLevelCompleted]);

  return null;
}

