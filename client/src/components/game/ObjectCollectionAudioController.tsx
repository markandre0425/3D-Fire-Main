import { useEffect, useRef } from "react";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { useAudio } from "@/lib/stores/useAudio";

/**
 * ObjectCollectionAudioController
 *
 * Listens for newly collected interactive objects and plays the
 * generic "success" pickup sound. Keeps audio side-effects
 * outside of the FireSafety store.
 */
export default function ObjectCollectionAudioController() {
  const interactiveObjects = useFireSafety((s) => s.interactiveObjects);
  const playSuccess = useAudio((s) => s.playSuccess);

  const prevCollectedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const prev = prevCollectedIdsRef.current;
    const next = new Set<string>();

    for (const obj of interactiveObjects) {
      if (obj.isCollected) {
        next.add(obj.id);
        if (!prev.has(obj.id)) {
          // Newly collected object (play success sound once)
          playSuccess();
        }
      }
    }

    prevCollectedIdsRef.current = next;
  }, [interactiveObjects, playSuccess]);

  return null;
}

