import { useMemo } from "react";
import FirstPersonPlayer from "./FirstPersonPlayer";
import Lights from "./Lights";
import HomeEnvironment from "./HomeEnvironment";
import Hazard from "./Hazard";
import ExtinguisherPickup from "./ExtinguisherPickup";
import RandomFireSpawner from "./RandomFireSpawner";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";
import { Level as LevelEnum } from "@/lib/types";

export default function Level() {
  const { 
    hazards, 
    interactiveObjects,
    currentLevel,
    levelData
  } = useFireSafety();
  
  const playerState = usePlayer();
  
  // --- DYNAMIC MAP BOUNDS ---
  // Used by RandomFireSpawner to know where to put fires
  const mapBounds = useMemo(() => {
    switch (currentLevel) {
      case LevelEnum.Kitchen:
      case LevelEnum.LivingRoom:
      case LevelEnum.Bedroom:
      case LevelEnum.BasicTraining:
        return { minX: -9, maxX: 9, minZ: -9, maxZ: 9, y: 0.1 };
      case LevelEnum.FireClassification:
      case LevelEnum.EmergencyResponse:
        return { minX: -11, maxX: 11, minZ: -11, maxZ: 11, y: 0.1 };
      case LevelEnum.AdvancedRescue:
        return { minX: -13, maxX: 13, minZ: -13, maxZ: 13, y: 0.1 };
      case LevelEnum.BFPCertification:
        return { minX: -15, maxX: 15, minZ: -15, maxZ: 15, y: 0.1 };
      default:
        return { minX: -9, maxX: 9, minZ: -9, maxZ: 9, y: 0.1 };
    }
  }, [currentLevel]);
  
  return (
    <>
      <Lights />
      <HomeEnvironment />
      
      {/* 1. HAZARDS (Fires & Props) */}
      {/* This includes the Level-Specific fires loaded by the Store */}
      {hazards.map(hazard => (
        <Hazard key={`hazard-${hazard.id}`} hazard={hazard} />
      ))}
      
      {/* 2. ITEMS (Extinguishers, Masks) */}
      {interactiveObjects.map(obj => (
        <ExtinguisherPickup 
          key={`object-${obj.id}`} 
          object={obj} 
          isCollected={obj.isCollected} 
        />
      ))}
      
      {/* 3. DYNAMIC FIRES */}
      <RandomFireSpawner
        maxFires={2}
        spawnInterval={8000}
        spawnChance={0.3}
        environmentObjects={levelData.environmentObjects}
        mapBounds={mapBounds}
      />
      
      {/* 4. PLAYER CONTROLLER */}
      {/* Handles Movement, Pickup (E), and Extinguishing (F) Logic internally */}
      <FirstPersonPlayer />
    </>
  );
}
