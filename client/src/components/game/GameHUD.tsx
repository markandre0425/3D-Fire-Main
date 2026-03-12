import React from "react";
import HealthBar from "./HealthBar";
import ScoreDisplay from "./ScoreDisplay";
import ExtinguisherAmmoBar from "./ExtinguisherAmmoBar";
import ControlsHelp from "../ui/ControlsHelp";
import Crosshair from "../ui/Crosshair";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { GAME_CONSTANTS, HAZARD_TIPS } from "@/lib/constants";

// Debug position overlay — commented out for production
// function DebugPosition() {
//   const pos = usePlayer((s) => s.position);
//   const enabled = usePlayer((s) => (s as any).debugPositionOverlay ?? true);
//   if (!enabled) return null;
//   return (
//     <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-white bg-black/60 px-3 py-2 rounded-lg border border-white/10">
//       <div className="font-bold tracking-wide mb-1">POS</div>
//       <div>
//         x: {pos.x.toFixed(2)} y: {pos.y.toFixed(2)} z: {pos.z.toFixed(2)}
//       </div>
//     </div>
//   );
// }

function HazardHUDIndicator() {
  const hazards = useFireSafety((s) => s.hazards);
  const activeCount = hazards.filter(
    (h) => h.isActive && !h.isExtinguished
  ).length;

  if (activeCount === 0) return null;

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 text-xs text-white bg-red-600/70 px-3 py-1.5 rounded-full border border-white/20 shadow-md">
      <span className="font-semibold tracking-wide mr-2">Fires</span>
      <span className="px-2 py-0.5 rounded-full bg-black/40 text-[11px]">
        {activeCount} active
      </span>
    </div>
  );
}

// --- DAMAGE VIGNETTE ---
// Red pulse at screen edges when health is low.
function DamageVignette() {
  const health = usePlayer((state) => state.health);

  if (health > GAME_CONSTANTS.HEALTH_VIGNETTE_THRESHOLD) return null;

  const opacity = Math.min(
    0.8,
    (GAME_CONSTANTS.HEALTH_VIGNETTE_THRESHOLD - health) /
    GAME_CONSTANTS.HEALTH_VIGNETTE_THRESHOLD
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-300 ease-out"
      style={{
        background:
          "radial-gradient(circle at center, transparent 50%, rgba(220, 20, 20, 0.6) 100%)",
        opacity,
      }}
    />
  );
}

function DangerText() {
  const health = usePlayer((s) => s.health);
  const oxygen = usePlayer((s) => s.oxygen);

  const inCriticalHealth = health <= GAME_CONSTANTS.HEALTH_CRITICAL_THRESHOLD;
  const inLowOxygen = oxygen <= GAME_CONSTANTS.OXYGEN_CRITICAL_THRESHOLD;

  if (!inCriticalHealth && !inLowOxygen) return null;

  let message = "";
  if (inCriticalHealth && inLowOxygen) {
    message = "Danger: Fire and smoke!";
  } else if (inCriticalHealth) {
    message = "Move away from the fire!";
  } else {
    message = "Air is running out!";
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm text-white bg-red-700/70 px-4 py-2 rounded-lg border border-white/30 shadow-lg transition-opacity duration-300 ease-out">
      <span className="font-semibold tracking-wide">{message}</span>
    </div>
  );
}

function HazardTipBanner() {
  const currentType = useFireSafety((s) => s.currentHazardTipType);

  if (!currentType) return null;

  const message = HAZARD_TIPS[currentType];
  if (!message) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-xl text-center text-xs sm:text-sm text-gray-900 bg-yellow-100/95 px-4 py-2 rounded-2xl border border-yellow-300 shadow-lg pointer-events-none select-none">
      <div className="font-bold text-yellow-900 mb-1 uppercase tracking-wide">
        Safety Tip
      </div>
      <div className="text-yellow-900">{message}</div>
    </div>
  );
}

function MissionInfo() {
  const levelData = useFireSafety((s) => s.levelData);

  return (
    <div className="absolute top-4 left-4 pointer-events-none select-none">
      <div className="bg-gray-900/85 border-2 border-gray-500 rounded-2xl px-5 py-4 text-white shadow-[0_12px_25px_rgba(0,0,0,0.55)] max-w-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-300">
          Current Mission
        </h2>
        <p className="text-xl font-bold mt-1 tracking-wide">{levelData.name}</p>
        <p className="text-sm mt-2 text-gray-200 leading-snug">
          {levelData.description}
        </p>
      </div>
    </div>
  );
}

function LevelCompleteNotification() {
  const isLevelComplete = useFireSafety((s) => s.isLevelComplete);
  const hazards = useFireSafety((s) => s.hazards);
  const objects = useFireSafety((s) => s.interactiveObjects);
  const score = usePlayer((s) => s.score);

  if (!isLevelComplete) return null;

  // Per-level star rating (kid-friendly criteria)
  const allFiresOut = hazards.every((h) => h.isExtinguished);
  const collectableObjects = objects.filter(
    (o) => {
      const t = o.type as unknown as string;
      return t !== "EmergencyExit" && t !== "ExtinguisherCabinet" && t !== "extinguisher_cabinet";
    }
  );
  const allItemsCollected =
    collectableObjects.length > 0 &&
    collectableObjects.every((o) => o.isCollected);

  let stars = 1; // ⭐ = completed the level
  if (allFiresOut) stars = 2; // ⭐⭐ = all fires extinguished
  if (allFiresOut && allItemsCollected) stars = 3; // ⭐⭐⭐ = everything done

  const messages = [
    "Good job! 🎉",
    "Great work, Fire Hero! 🔥",
    "AMAZING! You're a real firefighter! 🚒",
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="bg-gray-900/95 border-2 border-green-400 px-10 py-8 rounded-3xl text-white text-center shadow-[0_25px_65px_rgba(0,0,0,0.7)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-300 mb-3">
          Mission Complete
        </p>

        {/* Animated stars */}
        <div className="flex justify-center gap-3 mb-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="text-5xl"
              style={{
                opacity: i < stars ? 1 : 0.2,
                animation:
                  i < stars
                    ? `starPop 0.5s ease-out ${i * 0.2}s both`
                    : "none",
                display: "inline-block",
              }}
            >
              ⭐
            </span>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-2 tracking-wide">
          {messages[stars - 1]}
        </h2>
        <p className="text-lg text-gray-200 mb-1">Score: {score} points</p>
        <p className="text-sm text-gray-400">
          {stars < 3 ? "Try again to get all 3 stars! ⭐" : "Perfect score! 🌟"}
        </p>
      </div>
    </div>
  );
}

export default function GameHUD() {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-40">
      {/* 1. Visual effects (behind other HUD) */}
      <DamageVignette />

      {/* 2. Overlays & Notifications */}
      {/* <DebugPosition /> */}
      <HazardHUDIndicator />
      <DangerText />
      <HazardTipBanner />
      <MissionInfo />
      <LevelCompleteNotification />

      {/* 3. Game State UI */}
      <ScoreDisplay />
      <Crosshair />
      <HealthBar />
      <ExtinguisherAmmoBar />

      {/* 4. Controls Help - positioned above the ammo bar when present */}
      <div className="absolute bottom-36 right-4">
        <ControlsHelp />
      </div>
    </div>
  );
}
