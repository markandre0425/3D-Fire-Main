import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { usePlayer } from "./usePlayer";
import { useFireSafety } from "./useFireSafety";

export type GamePhase = "ready" | "playing" | "ended";

interface GameState {
  phase: GamePhase;
  
  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set) => ({
    phase: "ready",
    
    start: () => {
      set((state) => {
        // Only transition from ready to playing
        if (state.phase === "ready") {
          // Reset player state when starting a new game
          usePlayer.getState().resetPlayer();
          return { phase: "playing" };
        }
        return {};
      });
    },
    
    restart: () => {
      // Reset player and game state when restarting
      usePlayer.getState().resetPlayer();
      useFireSafety.getState().resetLevel();
      set(() => ({ phase: "ready" }));
    },
    
    end: () => {
      set((state) => {
        // Only transition from playing to ended
        if (state.phase === "playing") {
          return { phase: "ended" };
        }
        return {};
      });
    }
  }))
);
