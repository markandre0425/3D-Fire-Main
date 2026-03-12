import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAchievements, AchievementId } from "@/lib/stores/useAchievements";
import { ACHIEVEMENTS } from "@/lib/constants";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { Level } from "@/lib/types";

/**
 * AchievementsController
 *
 * Unlocks simple local achievements and shows a toast using `sonner`
 * when a new badge is earned.
 */
export default function AchievementsController() {
  const hasExtinguisher = usePlayer((s) => s.hasExtinguisher);
  const completedLevels = useFireSafety((s) => s.completedLevels);

  const unlock = useAchievements((s) => s.unlock);
  const lastUnlocked = useAchievements((s) => s.lastUnlocked);
  const clearLastUnlocked = useAchievements((s) => s.clearLastUnlocked);

  const prevHasExtinguisherRef = useRef(hasExtinguisher);

  // Unlock "first_extinguisher_use" when the player first gets any extinguisher
  useEffect(() => {
    if (!prevHasExtinguisherRef.current && hasExtinguisher) {
      unlock("first_extinguisher_use");
    }
    prevHasExtinguisherRef.current = hasExtinguisher;
  }, [hasExtinguisher, unlock]);

  // Unlock "all_levels_cleared" when Kitchen, Living Room, and Garage are completed
  useEffect(() => {
    const required: Level[] = [Level.Kitchen, Level.LivingRoom, Level.Garage];
    if (required.every((lvl) => completedLevels.includes(lvl))) {
      unlock("all_levels_cleared");
    }
  }, [completedLevels, unlock]);

  // Show a toast whenever a new achievement is unlocked
  useEffect(() => {
    if (!lastUnlocked) return;

    const id: AchievementId = lastUnlocked;
    const meta = ACHIEVEMENTS[id];
    if (meta) {
      toast.success(meta.title, {
        description: meta.description,
      });
    }

    clearLastUnlocked();
  }, [lastUnlocked, clearLastUnlocked]);

  return null;
}

