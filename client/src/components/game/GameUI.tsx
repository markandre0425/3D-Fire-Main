import { useFireSafety } from "@/lib/stores/useFireSafety";
import PauseMenu from "../screens/PauseMenu";

export default function GameUI() {
  const { 
    isPaused, 
    resumeGame, 
    resetLevel
  } = useFireSafety();

  return (
    <>
      {/* Pause Menu Overlay */}
      {isPaused && (
        <PauseMenu onResume={resumeGame} onRestart={resetLevel} />
      )}
    </>
  );
}
