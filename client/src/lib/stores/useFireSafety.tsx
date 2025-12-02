import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { BoundingBox } from "../collision";
import { HazardState, InteractiveObject, Level, LevelData } from "../types";
import { LEVELS, SAFETY_TIPS, GAME_CONSTANTS } from "../constants";
import { usePlayer } from "./usePlayer";
import { useAudio } from "./useAudio";
import { getLevelConfig } from "../levelConfigs";
import { HazardType, InteractiveObjectType } from "../types";

interface FireSafetyState {
  currentLevel: Level;
  levelData: LevelData;
  completedLevels: Level[];
  isPaused: boolean;
  hazards: HazardState[];
  interactiveObjects: InteractiveObject[];
  collidables: BoundingBox[];
  collidableGeneration: number;
  activeTip: string | null;
  isLevelComplete: boolean;
  
  // Actions
  addCollidable: (collidable: BoundingBox) => void;
  clearCollidables: () => void;
  startLevel: (level: Level) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  completeLevel: () => void;
  resetLevel: () => void;
  updateHazard: (hazardId: string, updates: Partial<HazardState>) => void;
  updateInteractiveObject: (objectId: string, updates: Partial<InteractiveObject>) => void;
  showSafetyTip: (tipId: string | null) => void;
  extinguishHazard: (hazardId: string, amount?: number) => void;
  collectObject: (objectId: string) => void;
  activateSmokeDetector: (detectorId: string) => void;
  addHazard: (hazard: HazardState) => void;
}

export const useFireSafety = create<FireSafetyState>()(
  subscribeWithSelector((set, get) => ({
    currentLevel: Level.Kitchen,
    levelData: LEVELS[Level.Kitchen],
    completedLevels: [],
    isPaused: false,
    hazards: LEVELS[Level.Kitchen].hazards,
    interactiveObjects: LEVELS[Level.Kitchen].objects,
    collidables: [],
    collidableGeneration: 0,
    activeTip: null,
    isLevelComplete: false,
    
    addCollidable: (collidable: BoundingBox) => {
      set((state) => ({
        collidables: [...state.collidables, collidable],
      }));
    },

    clearCollidables: () => {
      const { collidableGeneration } = get();
      set({
        collidables: [],
        collidableGeneration: collidableGeneration + 1,
      });
    },

    startLevel: (level: Level) => {
      const levelData = LEVELS[level];
      const levelConfig = getLevelConfig(parseInt(level) || 1);
      const { collidableGeneration } = get();
      
      // Merge level config with constants for enhanced fire management
      let enhancedHazards = [...levelData.hazards];
      let enhancedObjects = [...levelData.objects];
      
      if (levelConfig) {
        // Add level-specific fires from levelConfigs
        const levelFires = levelConfig.hazards
          .filter((hazard: any) => hazard.type === 'fire')
          .map((hazard: any) => {
            // Map different fire types to appropriate HazardType enum values
            let hazardType = HazardType.ClassAFire; // Default to Class A
            
            // You can add more specific mapping logic here if needed
            // For now, all fires from level configs will use ClassAFire
            
            return {
              id: hazard.id,
              type: hazardType,
              position: { 
                x: hazard.position[0], 
                y: hazard.position[1], 
                z: hazard.position[2] 
              },
              isActive: true,
              severity: hazard.intensity,
              isSmoking: hazard.intensity > 1.5,
              isExtinguished: false
            };
          });
        
        // Add level-specific items from levelConfigs
        const levelItems = levelConfig.items
          .filter((item: any) => item.type === 'extinguisher')
          .map((item: any) => ({
            id: item.id,
            type: InteractiveObjectType.FireExtinguisher,
            position: { 
              x: item.position[0], 
              y: item.position[1], 
              z: item.position[2] 
            },
            isActive: true,
            isCollected: false
          }));
        
        enhancedHazards = [...enhancedHazards, ...levelFires];
        enhancedObjects = [...enhancedObjects, ...levelItems];
        
      }
      
      set({
        currentLevel: level,
        levelData,
        hazards: enhancedHazards,
        interactiveObjects: enhancedObjects,
        collidables: [],
        collidableGeneration: collidableGeneration + 1,
        isPaused: false,
        isLevelComplete: false,
        activeTip: null
      });
      
    },
    
    pauseGame: () => {
      set({ isPaused: true });
    },
    
    resumeGame: () => {
      set({ isPaused: false });
    },
    
    completeLevel: () => {
      const { currentLevel, completedLevels } = get();
      
      if (!completedLevels.includes(currentLevel)) {
        set({
          completedLevels: [...completedLevels, currentLevel],
          isLevelComplete: true
        });
      } else {
        set({ isLevelComplete: true });
      }
      
      useAudio.getState().playLevelCompleted();
    },
    
    resetLevel: () => {
      const { currentLevel } = get();
      const levelData = LEVELS[currentLevel];
      const { collidableGeneration } = get();
      
      set({
        hazards: [...levelData.hazards],
        interactiveObjects: [...levelData.objects],
        collidables: [],
        collidableGeneration: collidableGeneration + 1,
        isPaused: false,
        isLevelComplete: false,
        activeTip: null
      });
      
      // Reset player state
      usePlayer.getState().resetPlayer();
      
    },
    
    updateHazard: (hazardId: string, updates: Partial<HazardState>) => {
      const { hazards } = get();
      const updatedHazards = hazards.map(hazard => 
        hazard.id === hazardId ? { ...hazard, ...updates } : hazard
      );
      
      set({ hazards: updatedHazards });
    },
    
    updateInteractiveObject: (objectId: string, updates: Partial<InteractiveObject>) => {
      const { interactiveObjects } = get();
      const updatedObjects = interactiveObjects.map(obj => 
        obj.id === objectId ? { ...obj, ...updates } : obj
      );
      
      set({ interactiveObjects: updatedObjects });
    },
    
    showSafetyTip: (tipId: string | null) => {
      set({ activeTip: tipId });
    },
    
    // Gradual extinguishing: reduce severity over time instead of instant kill
    extinguishHazard: (hazardId: string, amount: number = 1.0) => {
      const { hazards } = get();

      let awardedScore = false;

      const updatedHazards = hazards.map((hazard) => {
        if (hazard.id !== hazardId) return hazard;

        const previousExtinguished = hazard.isExtinguished;
        const currentSeverity = typeof hazard.severity === "number" ? hazard.severity : 1.0;

        const newSeverity = Math.max(0, currentSeverity - amount);
        const isNowExtinguished = newSeverity <= 0;

        if (!previousExtinguished && isNowExtinguished) {
          awardedScore = true;
        }

        return {
          ...hazard,
          severity: newSeverity,
          isExtinguished: isNowExtinguished,
          // Keep smoking only while severity is above a threshold
          isSmoking: newSeverity > 1.0 ? hazard.isSmoking : false,
          // Optionally keep active until fully extinguished so visuals can shrink
          isActive: !isNowExtinguished,
        };
      });
      
      // Only award points / play sound when a hazard actually becomes extinguished
      if (awardedScore) {
      usePlayer.getState().addScore(GAME_CONSTANTS.POINTS_FOR_EXTINGUISHING);
      useAudio.getState().playHit();
      }
      
      set({ hazards: updatedHazards });
      
      // Check if all hazards are extinguished to complete level
      if (updatedHazards.length > 0 && updatedHazards.every((h) => h.isExtinguished)) {
        setTimeout(() => get().completeLevel(), 1500);
      }
    },
    
    collectObject: (objectId: string) => {
      const { interactiveObjects } = get();
      const object = interactiveObjects.find(obj => obj.id === objectId);
      
      if (object) {
        // Add points
        usePlayer.getState().addScore(GAME_CONSTANTS.POINTS_FOR_PREVENTION);
        
        const updatedObjects = interactiveObjects.map(obj => 
          obj.id === objectId ? { ...obj, isCollected: true } : obj
        );
        
        set({ interactiveObjects: updatedObjects });
        
        // If it's a fire extinguisher, give it to the player with type
        if (object.type === "FireExtinguisher" || 
            object.type === "WaterExtinguisher" ||
            object.type === "FoamExtinguisher" ||
            object.type === "CO2Extinguisher" ||
            object.type === "PowderExtinguisher" ||
            object.type === "WetChemicalExtinguisher") {
          usePlayer.getState().pickupExtinguisher(object.type);
        }
        
        // If it's a gas mask, give it to the player
        if (object.type === "GasMask") {
          usePlayer.getState().pickupGasMask();
        }
        
        useAudio.getState().playSuccess();
      }
    },
    
    activateSmokeDetector: (detectorId: string) => {
      const { interactiveObjects } = get();
      
      const updatedObjects = interactiveObjects.map(obj => 
        obj.id === detectorId ? { ...obj, isActive: true } : obj
      );
      
      // Add points
      usePlayer.getState().addScore(GAME_CONSTANTS.POINTS_FOR_DETECTOR);
      
      set({ interactiveObjects: updatedObjects });
      
      useAudio.getState().playSuccess();
    },

    // Allow systems like RandomFireSpawner to inject new hazards into the store
    addHazard: (hazard: HazardState) => {
      const { hazards } = get();
      set({
        hazards: [...hazards, hazard],
      });
    },
  }))
);

