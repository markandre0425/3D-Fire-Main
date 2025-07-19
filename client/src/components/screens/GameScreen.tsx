import { Suspense, useEffect } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Level from "../game/Level";
import KeyboardManager from "../game/KeyboardManager";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";
import { Level as LevelType } from "@/lib/types";
import { useGame } from "@/lib/stores/useGame";

export default function GameScreen() {
  const { startLevel, levelTime, isLevelComplete } = useFireSafety();
  const { health, score } = usePlayer();
  const { end } = useGame();

  useEffect(() => {
    startLevel(LevelType.Kitchen);
  }, [startLevel]);

  useEffect(() => {
    const gameOverCheckDelay = setTimeout(() => {
      if (health <= 0) {
        console.log("Game over: Player health depleted");
        end();
      }

      if (levelTime <= 0 && levelTime !== undefined) {
        console.log("Game over: Time ran out");
        end();
      }
    }, 1000);
    
    return () => clearTimeout(gameOverCheckDelay);
  }, [health, levelTime, end]);

  useEffect(() => {
    if (isLevelComplete) {
      console.log("Level completed!");

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
      {/* Camera */}
      <PerspectiveCamera
        makeDefault
        position={[0, 5, 10]}
        fov={50}
      />
      
      {/* Controls - limit to prevent going below the floor */}
      <OrbitControls 
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={15}
      />
      
      {/* Game level */}
      <Suspense fallback={null}>
        <Level />
      </Suspense>
      
      {/* Keyboard manager component to handle key presses */}
      <KeyboardManager />
    </>
  );
}

