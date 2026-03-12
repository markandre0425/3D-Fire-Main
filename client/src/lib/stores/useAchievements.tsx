import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACHIEVEMENTS } from "../constants";

export type AchievementId = keyof typeof ACHIEVEMENTS;

interface AchievementsState {
  unlocked: AchievementId[];
  lastUnlocked: AchievementId | null;
  unlock: (id: AchievementId) => void;
  clearLastUnlocked: () => void;
}

export const useAchievements = create<AchievementsState>()(
  persist(
    (set, get) => ({
      unlocked: [],
      lastUnlocked: null,
      unlock: (id) => {
        const { unlocked } = get();
        if (unlocked.includes(id)) return;
        set({ unlocked: [...unlocked, id], lastUnlocked: id });
      },
      clearLastUnlocked: () => set({ lastUnlocked: null }),
    }),
    {
      name: "fire-safety-achievements",
    }
  )
);

