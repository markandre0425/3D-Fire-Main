import { create } from "zustand";
import { DifficultyLevel } from "../types";

interface SettingsState {
  difficulty: DifficultyLevel;
  setDifficulty: (difficulty: DifficultyLevel) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  difficulty: DifficultyLevel.Beginner,
  setDifficulty: (difficulty) => set({ difficulty }),
}));

