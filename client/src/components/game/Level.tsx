import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import Character from "./Character";
import Lights from "./Lights";
import HomeEnvironment from "./HomeEnvironment";
import Hazard from "./Hazard";
import ExtinguisherPickup from "./ExtinguisherPickup";
import ParticleSprayEffect from "./ParticleSprayEffect";
import RandomFireSpawner from "./RandomFireSpawner";
import Fire from "./Fire";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useKeyboardControls } from "@react-three/drei";
import { Controls, Level as LevelEnum } from "@/lib/types";
import { GAME_CONSTANTS } from "@/lib/constants";
import { getLevelConfig } from "@/lib/levelConfigs";

export default function Level() {
  const { 
    hazards, 
    interactiveObjects, 
    updateLevelTime,
    extinguishHazard,
    collectObject,
    isPaused,
    currentLevel
  } = useFireSafety();
  
  const playerState = usePlayer();
  const [isExtinguishing, setIsExtinguishing] = useState(false);
  const [levelFires, setLevelFires] = useState<Array<{
    id: string;
    position: [number, number, number];
    intensity: number;
    size: number;
    isActive: boolean;
  }>>([]);

  const lastUpdateTime = useRef(Date.now());
  const extinguishCooldown = useRef(0);
  
  // Initialize level-specific fires from levelConfigs
  useEffect(() => {
    const levelConfig = getLevelConfig(parseInt(currentLevel) || 1);
    if (levelConfig) {
      const fires = levelConfig.hazards
        .filter(hazard => hazard.type === 'fire')
        .map(hazard => ({
          id: hazard.id,
          position: hazard.position as [number, number, number],
          intensity: hazard.intensity,
          size: Math.max(0.5, hazard.intensity * 0.8),
          isActive: true
        }));
      
      setLevelFires(fires);
    }
  }, [currentLevel]);
  
  // Get keyboard controls
  const actionPressed = useKeyboardControls<Controls>(state => state.action);
  const extinguishPressed = useKeyboardControls<Controls>(state => state.extinguish);
  
  // Update level time on every frame
  useFrame((_, delta) => {
    if (isPaused) return;
    
    const now = Date.now();
    const deltaTime = (now - lastUpdateTime.current) / 1000; // in seconds
    lastUpdateTime.current = now;
    
    // Update level time
    updateLevelTime(deltaTime);
    
    // Update extinguisher cooldown
    if (extinguishCooldown.current > 0) {
      extinguishCooldown.current -= delta;
    }
  });
  
  // Handle player interaction with objects
  useEffect(() => {
    if (actionPressed) {
      // Check for nearby interactive objects
      interactiveObjects.forEach(obj => {
        if (obj.isCollected) return;
        
        const dx = playerState.position.x - obj.position.x;
        const dz = playerState.position.z - obj.position.z;
        const distanceSquared = dx * dx + dz * dz;
        
        if (distanceSquared < GAME_CONSTANTS.INTERACTION_DISTANCE * GAME_CONSTANTS.INTERACTION_DISTANCE) {
          if (obj.type === "FireExtinguisher" || 
              obj.type === "WaterExtinguisher" ||
              obj.type === "FoamExtinguisher" ||
              obj.type === "CO2Extinguisher" ||
              obj.type === "PowderExtinguisher" ||
              obj.type === "WetChemicalExtinguisher" ||
              obj.type === "GasMask") {
            collectObject(obj.id);
          }
        }
      });
    }
  }, [actionPressed, interactiveObjects, playerState.position, collectObject]);
  
  // Handle fire extinguisher usage - optimized with useFrame
  useFrame((_, delta) => {
    if (isPaused) return;
    
    // Update cooldown
    if (extinguishCooldown.current > 0) {
      extinguishCooldown.current -= delta;
    }
    
    // Show spray effect whenever button is pressed (regardless of cooldown)
    if (extinguishPressed && playerState.hasExtinguisher) {
      setIsExtinguishing(true);
      
      // Only actually extinguish fires when cooldown is ready
      if (extinguishCooldown.current <= 0) {
        const playerX = playerState.position.x;
        const playerZ = playerState.position.z;
        const rangeSquared = GAME_CONSTANTS.EXTINGUISHER_RANGE * GAME_CONSTANTS.EXTINGUISHER_RANGE;
        
        // Check hazards - only iterate once per spray
        for (const hazard of hazards) {
          if (hazard.isExtinguished || !hazard.isActive) continue;
          
          const dx = playerX - hazard.position.x;
          const dz = playerZ - hazard.position.z;
          const distanceSquared = dx * dx + dz * dz;
          
          if (distanceSquared < rangeSquared) {
            extinguishHazard(hazard.id);
            break; // Only extinguish one at a time to avoid lag
          }
        }

        // Check level fires - optimized to modify only if needed
        for (let i = 0; i < levelFires.length; i++) {
          const fire = levelFires[i];
          if (!fire.isActive) continue;
          
          const dx = playerX - fire.position[0];
          const dz = playerZ - fire.position[2];
          const distanceSquared = dx * dx + dz * dz;
          
          if (distanceSquared < rangeSquared) {
            setLevelFires(prev => {
              const newFires = [...prev];
              newFires[i] = { ...fire, isActive: false };
              return newFires;
            });
            break; // Only extinguish one at a time
          }
        }
        
        // Set cooldown
        extinguishCooldown.current = 0.3; // Reduced from 0.5 for better responsiveness
      }
    } else {
      // Stop spray effect when button is released
      setIsExtinguishing(false);
    }
  });
  
  return (
    <>
      <Lights />
      <HomeEnvironment />
      
      {/* Render hazards */}
      {hazards.map(hazard => (
        <Hazard key={`hazard-${hazard.id}`} hazard={hazard} />
      ))}
      
      {/* Render level-specific fires from levelConfigs */}
      {levelFires.map(fire => (
        <Fire
          key={`levelfire-${fire.id}`}
          position={fire.position}
          size={fire.size}
          intensity={fire.intensity}
          isActive={fire.isActive}
        />
      ))}
      
      {/* Random Fire Spawner for additional dynamic fires */}
      <RandomFireSpawner
        maxFires={2}
        spawnInterval={8000}
        spawnChance={0.3}
        environmentObjects={useFireSafety.getState().levelData.environmentObjects}
        mapBounds={(() => {
          // Dynamic map bounds based on room size (matching 2x scaled rooms)
          const getBounds = () => {
            switch (currentLevel) {
              case LevelEnum.Kitchen:
              case LevelEnum.LivingRoom:
              case LevelEnum.Bedroom:
              case LevelEnum.BasicTraining:
                return { minX: -9, maxX: 9, minZ: -9, maxZ: 9, y: 0.1 }; // 20×20 rooms
              case LevelEnum.FireClassification:
              case LevelEnum.EmergencyResponse:
                return { minX: -11, maxX: 11, minZ: -11, maxZ: 11, y: 0.1 }; // 24×24 rooms
              case LevelEnum.AdvancedRescue:
                return { minX: -13, maxX: 13, minZ: -13, maxZ: 13, y: 0.1 }; // 28×28 rooms
              case LevelEnum.BFPCertification:
                return { minX: -15, maxX: 15, minZ: -15, maxZ: 15, y: 0.1 }; // 32×32 rooms
              default:
                return { minX: -9, maxX: 9, minZ: -9, maxZ: 9, y: 0.1 };
            }
          };
          return getBounds();
        })()}
      />
      
      {/* Render interactive objects */}
      {interactiveObjects.map(obj => (
        <ExtinguisherPickup 
          key={`object-${obj.id}`} 
          object={obj} 
          isCollected={obj.isCollected} 
        />
      ))}
      
      {/* Fire extinguisher effects */}
      {playerState.hasExtinguisher && (
        <ParticleSprayEffect
          isActive={isExtinguishing}
          playerPosition={playerState.position}
          playerRotation={playerState.rotation}
          extinguisherType={playerState.extinguisherType || undefined}
        />
      )}
      
      {/* BFP Educational Content Modal */}
      {/* <BFPEducationalContent
        isVisible={showBFPEducation}
        onClose={() => setShowBFPEducation(false)}
      /> */}
      
      <Character />
    </>
  );
}
