import React from "react";
import HealthBar from "./HealthBar";
import ScoreDisplay from "./ScoreDisplay";
import ControlsHelp from "../ui/ControlsHelp";
import Crosshair from "../ui/Crosshair";
import { usePlayer } from "@/lib/stores/usePlayer";

// --- DAMAGE VIGNETTE ---
// Red pulse at screen edges when health is low.
function DamageVignette() {
  const health = usePlayer((state) => state.health);

  if (health > 40) return null;

  const opacity = Math.min(0.8, (40 - health) / 40);

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

// --- EXTINGUISHER AMMO ---
// Pressure/ammo bar for the extinguisher. Wire sprayCapacity to usePlayer when ready.
function AmmoDisplay() {
  const sprayCapacity = 100; // Placeholder until you wire it up (e.g. usePlayer(state => state.sprayCapacity))

  return (
    <div className="w-64 bg-gray-900/85 border-2 border-gray-500 rounded-2xl px-4 py-3 text-white shadow-[0_12px_25px_rgba(0,0,0,0.55)]">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Pressure
        </span>
        <span className="text-sm font-bold tracking-wide">
          {Math.round(sprayCapacity)}%
        </span>
      </div>
      <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-500 rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(6,182,212,0.6)]"
          style={{ width: `${sprayCapacity}%` }}
        />
      </div>
    </div>
  );
}

export default function GameHUD() {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-40">
      {/* 1. Visual effects (behind other HUD) */}
      <DamageVignette />

      {/* 2. Top: Score */}
      <ScoreDisplay />

      {/* 3. Center: Crosshair */}
      <Crosshair />

      {/* 4. Bottom left: Health & Oxygen */}
      <HealthBar />

      {/* 5. Bottom right: Controls (and Ammo when wired) */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-4">
        <ControlsHelp />
        {/* Uncomment when sprayCapacity is in usePlayer */}
        {/* <AmmoDisplay /> */}
      </div>
    </div>
  );
}
