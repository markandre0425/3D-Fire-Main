import { Suspense, useEffect, useState } from "react";
import Level from "../game/Level";
import TutorialLevel from "../game/TutorialLevel";
import KeyboardManager from "../game/KeyboardManager";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";
import { Level as LevelType } from "@/lib/types";
import { useGame } from "@/lib/stores/useGame";

export default function GameScreen() {
  const { startLevel, isLevelComplete, currentLevel } = useFireSafety();
  const { health } = usePlayer();
  const { end } = useGame();

  // State to track if tutorial is active
  // Skip tutorial if a level other than BasicTraining is already active (quick access)
  const [showTutorial, setShowTutorial] = useState(
    currentLevel === LevelType.BasicTraining || currentLevel === undefined
  );

  // Handle tutorial completion - transition to real game
  const handleTutorialComplete = () => {
    setShowTutorial(false);
    // FIX: Start the Kitchen level only when tutorial finishes
    startLevel(LevelType.Kitchen);
  };

  // NOTE: do not call startLevel(Kitchen) here on mount. 
  // If we did, it would overwrite the Tutorial data and break the pickups.
  // TutorialLevel initializes its own data.
  
  // If a level is already started (from quick access), skip tutorial
  useEffect(() => {
    if (currentLevel && currentLevel !== LevelType.BasicTraining) {
      setShowTutorial(false);
    }
  }, [currentLevel]);

  useEffect(() => {
    const gameOverCheckDelay = setTimeout(() => {
      if (health <= 0) {
        end();
      }
    }, 1000);
    
    return () => clearTimeout(gameOverCheckDelay);
  }, [health, end]);

  useEffect(() => {
    if (isLevelComplete) {
      const currentLevel = useFireSafety.getState().currentLevel;
      const completedLevels = useFireSafety.getState().completedLevels;

      if (currentLevel === LevelType.Kitchen && !completedLevels.includes(LevelType.LivingRoom)) {
        setTimeout(() => startLevel(LevelType.LivingRoom), 2000);
      } else if (currentLevel === LevelType.LivingRoom && !completedLevels.includes(LevelType.Bedroom)) {
        setTimeout(() => startLevel(LevelType.Bedroom), 2000);
      } else {
        setTimeout(() => end(), 2000);
      }
    }
  }, [isLevelComplete, end, startLevel]);
  
  return (
    <>
      <Suspense fallback={null}>
        {showTutorial ? (
          <TutorialLevel onComplete={handleTutorialComplete} />
        ) : (
        <Level />
        )}
      </Suspense>
      <KeyboardManager />
    </>
  );
}
