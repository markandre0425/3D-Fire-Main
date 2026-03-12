import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { Level } from "@/lib/types";

// Floating "+100" popup that appears when score changes
function ScorePopup({ points, id }: { points: number; id: number }) {
  return (
    <div
      key={id}
      className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl font-extrabold pointer-events-none select-none"
      style={{
        color: points >= 100 ? "#facc15" : "#34d399",
        textShadow: "0 0 8px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5)",
        animation: "scorePopup 1.2s ease-out forwards",
      }}
    >
      +{points}
    </div>
  );
}

export default function ScoreDisplay() {
  const score = usePlayer((state) => state.score);
  const currentLevel = useFireSafety((state) => state.currentLevel);
  const requiredScore = useFireSafety((state) => state.levelData.requiredScore);

  // Track popups
  const [popups, setPopups] = useState<{ points: number; id: number }[]>([]);
  const prevScore = useRef(score);
  const popupId = useRef(0);

  useEffect(() => {
    const diff = score - prevScore.current;
    if (diff > 0) {
      const newId = popupId.current++;
      setPopups((prev) => [...prev, { points: diff, id: newId }]);

      // Remove popup after animation
      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== newId));
      }, 1300);
    }
    prevScore.current = score;
  }, [score]);

  // Hide score HUD during the Basic Training tutorial
  if (currentLevel === Level.BasicTraining) {
    return null;
  }

  const scorePercentage =
    requiredScore > 0 ? Math.min(100, (score / requiredScore) * 100) : 0;

  return (
    <div className="absolute top-4 right-4 pointer-events-none">
      <div className="relative bg-gray-900/85 border-2 border-gray-500 rounded-2xl px-5 py-4 text-white shadow-[0_12px_25px_rgba(0,0,0,0.55)] min-w-[220px]">
        {/* Score popups float from here */}
        {popups.map((p) => (
          <ScorePopup key={p.id} points={p.points} id={p.id} />
        ))}

        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-300">
            ⭐ Score
          </span>
          <span className="text-lg font-bold tracking-wide">
            {score}
          </span>
        </div>

        <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-300 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(251,191,36,0.8)]"
            style={{ width: `${scorePercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1 text-right">
          {score} / {requiredScore}
        </div>
      </div>
    </div>
  );
}
