import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import Character from "./Character";
import Lights from "./Lights";
import HomeEnvironment from "./HomeEnvironment";
import Hazard from "./Hazard";
import ExtinguisherPickup from "./ExtinguisherPickup";
import ExtinguisherEffect from "./ExtinguisherEffect";
import RandomFireSpawner from "./RandomFireSpawner";
import Fire from "./Fire";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "@/lib/types";
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

  console.log("Level component - Interactive objects:", interactiveObjects);
  
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
      console.log(`Level ${currentLevel} initialized with ${fires.length} fires`);
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
              obj.type === "WetChemicalExtinguisher") {
            collectObject(obj.id);
          }
          console.log(`Interacted with ${obj.type}: ${obj.id}`);
        }
      });
    }
  }, [actionPressed, interactiveObjects, playerState.position, collectObject]);
  
  // Handle fire extinguisher usage with enhanced effects
  useEffect(() => {
    if (extinguishPressed && playerState.hasExtinguisher && extinguishCooldown.current <= 0) {
      setIsExtinguishing(true);
      
      // Check for nearby hazards to extinguish
      let extinguishedAny = false;
      hazards.forEach(hazard => {
        if (hazard.isExtinguished || !hazard.isActive) return;
        
        const dx = playerState.position.x - hazard.position.x;
        const dz = playerState.position.z - hazard.position.z;
        const distanceSquared = dx * dx + dz * dz;
        
        if (distanceSquared < GAME_CONSTANTS.EXTINGUISHER_RANGE * GAME_CONSTANTS.EXTINGUISHER_RANGE) {
          extinguishHazard(hazard.id);
          extinguishedAny = true;
          console.log(`Extinguished hazard: ${hazard.id}`);
        }
      });

      // Check for nearby level fires to extinguish
      setLevelFires(prev => prev.map(fire => {
        const dx = playerState.position.x - fire.position[0];
        const dz = playerState.position.z - fire.position[2];
        const distanceSquared = dx * dx + dz * dz;
        
        if (distanceSquared < GAME_CONSTANTS.EXTINGUISHER_RANGE * GAME_CONSTANTS.EXTINGUISHER_RANGE) {
          console.log(`Extinguished level fire: ${fire.id}`);
          return { ...fire, isActive: false };
        }
        return fire;
      }));
      
      // Set cooldown to prevent spam and allow for animation
      extinguishCooldown.current = 0.5;
      
      // Stop extinguishing effect after a short duration
      setTimeout(() => {
        setIsExtinguishing(false);
      }, 200);
    } else if (!extinguishPressed) {
      setIsExtinguishing(false);
    }
  }, [extinguishPressed, playerState.hasExtinguisher, hazards, playerState.position, extinguishHazard]);
  
  return (
    <>
      <Lights />
      <HomeEnvironment />
      
      {/* Render hazards */}
      {hazards.map(hazard => (
        <Hazard key={hazard.id} hazard={hazard} />
      ))}
      
      {/* Render level-specific fires from levelConfigs */}
      {levelFires.map(fire => (
        <Fire
          key={fire.id}
          position={fire.position}
          size={fire.size}
          intensity={fire.intensity}
          isActive={fire.isActive}
        />
      ))}
      
      {/* Random Fire Spawner for additional dynamic fires */}
      <RandomFireSpawner
        maxFires={3}
        spawnInterval={5000}
        spawnChance={0.4}
        mapBounds={{
          minX: -8,
          maxX: 8,
          minZ: -8,
          maxZ: 8,
          y: 0.1
        }}
      />
      
      {/* Render interactive objects */}
      {interactiveObjects.map(obj => {
        console.log("Rendering interactive object:", obj);
        return (
          <ExtinguisherPickup 
            key={obj.id} 
            object={obj} 
            isCollected={obj.isCollected} 
          />
        );
      })}
      
      {/* Fire extinguisher effects */}
      {playerState.hasExtinguisher && (
        <ExtinguisherEffect
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
