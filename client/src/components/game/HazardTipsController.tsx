import { useEffect, useRef } from "react";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";
import { GAME_CONSTANTS, HAZARD_TIPS } from "@/lib/constants";
import { HazardType } from "@/lib/types";

/**
 * HazardTipsController
 *
 * Shows a short, kid-friendly tip the first time the player gets near
 * each type of hazard. Uses distance checks only in this controller
 * to keep stores pure.
 */
export default function HazardTipsController() {
  const hazards = useFireSafety((s) => s.hazards);
  const shownHazardTips = useFireSafety((s) => s.shownHazardTips);
  const markHazardTipShown = useFireSafety((s) => s.markHazardTipShown);
  const setCurrentHazardTipType = useFireSafety((s) => s.setCurrentHazardTipType);
  const playerPos = usePlayer((s) => s.position);

  const clearTipTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing timeout when hazards or position change,
    // new one will be set if a new tip triggers.
    if (clearTipTimeoutRef.current !== null) {
      window.clearTimeout(clearTipTimeoutRef.current);
      clearTipTimeoutRef.current = null;
    }

    let nearestHazardType: HazardType | null = null;
    let nearestDistance = Infinity;

    const radius = GAME_CONSTANTS.FIRE_DAMAGE_RANGE * 1.5;

    for (const hazard of hazards) {
      if (!hazard.isActive || hazard.isExtinguished) continue;
      if (!HAZARD_TIPS[hazard.type]) continue;
      if (shownHazardTips.includes(hazard.type)) continue;

      const dx = playerPos.x - hazard.position.x;
      const dz = playerPos.z - hazard.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < radius && dist < nearestDistance) {
        nearestDistance = dist;
        nearestHazardType = hazard.type;
      }
    }

    if (nearestHazardType != null) {
      markHazardTipShown(nearestHazardType);
      setCurrentHazardTipType(nearestHazardType);

      clearTipTimeoutRef.current = window.setTimeout(() => {
        setCurrentHazardTipType(null);
        clearTipTimeoutRef.current = null;
      }, 6000);
    }

    return () => {
      if (clearTipTimeoutRef.current !== null) {
        window.clearTimeout(clearTipTimeoutRef.current);
      }
    };
  }, [hazards, shownHazardTips, playerPos, markHazardTipShown, setCurrentHazardTipType]);

  return null;
}

