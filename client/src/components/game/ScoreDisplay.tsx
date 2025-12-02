import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { Level } from "@/lib/types";

export default function ScoreDisplay() {
  // Subscribe only to the score
  const score = usePlayer((state) => state.score);

  // Subscribe only to level info
  const currentLevel = useFireSafety((state) => state.currentLevel);
  const requiredScore = useFireSafety((state) => state.levelData.requiredScore);

  // Hide score HUD during the Basic Training tutorial
  if (currentLevel === Level.BasicTraining) {
    return null;
  }

  const scorePercentage =
    requiredScore > 0 ? Math.min(100, (score / requiredScore) * 100) : 0;
  
  return (
    <div className="absolute top-4 right-4 pointer-events-none">
      <div className="bg-gray-900/85 border-2 border-gray-500 rounded-2xl px-5 py-4 text-white shadow-[0_12px_25px_rgba(0,0,0,0.55)] min-w-[220px]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-300">
            Score
          </span>
          <span className="text-lg font-bold tracking-wide">
            {score} / {requiredScore}
          </span>
      </div>
      
        <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden">
        <div 
            className="h-full bg-amber-300 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(251,191,36,0.8)]"
          style={{ width: `${scorePercentage}%` }}
        />
      </div>
      </div>
    </div>
  );
}
