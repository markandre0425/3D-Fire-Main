import { useEffect } from "react";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { useGame } from "@/lib/stores/useGame";
import { Level as LevelType } from "@/lib/types";

/**
 * GameFlowController
 *
 * Handles high-level game progression when levels are completed:
 * - Advances Kitchen → Living Room → Garage
 * - Ends the game after the final level
 *
 * Keeps orchestration logic out of the presentation components.
 */
export default function GameFlowController() {
  const isLevelComplete = useFireSafety((s) => s.isLevelComplete);
  const startLevel = useFireSafety((s) => s.startLevel);
  const endGame = useGame((s) => s.end);

  useEffect(() => {
    if (!isLevelComplete) return;

    const { currentLevel, completedLevels } = useFireSafety.getState();

    const timeout = setTimeout(() => {
      if (currentLevel === LevelType.Kitchen && !completedLevels.includes(LevelType.LivingRoom)) {
        startLevel(LevelType.LivingRoom);
      } else if (currentLevel === LevelType.LivingRoom && !completedLevels.includes(LevelType.Garage)) {
        startLevel(LevelType.Garage);
      } else {
        endGame();
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isLevelComplete, startLevel, endGame]);

  return null;
}

