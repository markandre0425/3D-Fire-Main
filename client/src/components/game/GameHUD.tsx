import React from "react";
import HealthBar from "./HealthBar";
import ScoreDisplay from "./ScoreDisplay";
import ExtinguisherAmmoBar from "./ExtinguisherAmmoBar";
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

      {/* 5. Bottom right: Extinguisher Ammo (shows only when player has extinguisher) */}
      <ExtinguisherAmmoBar />

      {/* 6. Controls Help - positioned above the ammo bar when present */}
      <div className="absolute bottom-36 right-4">
        <ControlsHelp />
      </div>
    </div>
  );
}
