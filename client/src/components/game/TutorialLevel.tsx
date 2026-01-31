import { useEffect, useRef, useMemo } from "react";
import { Text, useTexture } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";
import { InteractiveObjectType, HazardType, LevelData, Level, DifficultyLevel, EnvironmentObject } from "@/lib/types";
import FirstPersonPlayer from "./FirstPersonPlayer";
import Lights from "./Lights";
import HomeEnvironment from "./HomeEnvironment";
import ExtinguisherPickup from "./ExtinguisherPickup";
import Hazard from "./Hazard";
import ModelLoader from "./ModelLoader";

interface TutorialLevelProps {
  onComplete: () => void;
}

// --- 3D TEXT LABEL HELPER ---
function InfoLabel({ text, position, size = 0.5, color = "black" }: { text: string, position: [number, number, number], size?: number, color?: string }) {
  return (
    <Text
      position={position}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="white"
    >
      {text}
    </Text>
  );
}

export default function TutorialLevel({ onComplete }: TutorialLevelProps) {
  const { position: playerPos, setSpawnPoint, respawn, hasExtinguisher, setHasExtinguisher, setHasGasMask } = usePlayer();
  
  // FIX 1: Use selectors to prevent infinite re-render loops.
  // we just used `useFireSafety()`, this component would re-render every time a collider is added.
  const hazards = useFireSafety((state) => state.hazards);
  const interactiveObjects = useFireSafety((state) => state.interactiveObjects);
  
  // Refs to ensure initialization only happens once
  const initialized = useRef(false);
  const completionTriggered = useRef(false);

  // Load floor texture
  const woodTexture = useTexture("/textures/wood.jpg");
  
  // Configure texture tiling for the long hallway
  useEffect(() => {
    woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
    // Floor is 20x100, scaling by 2.5 that gives a natural plank size
    woodTexture.repeat.set(20 / 2.5, 100 / 2.5); 
  }, [woodTexture]);

  // --- 1. DEFINE TUTORIAL LEVEL DATA ---
  const tutorialLevelData = useMemo<LevelData>(() => {
    const envObjects: EnvironmentObject[] = [
      // NOTE: DO NOT add a 'floor' object here for HomeEnvironment because it causes bouncing in the tutorial.
      // HomeEnvironment adds physics for floors, which causes bouncing in the tutorial
      // because FirstPersonPlayer enforces Y=0 ground level.
      // We will render the floor visually manually below.
      
      // Walls (HomeEnvironment's Wall component automatically adds colliders)
      { id: 'wall-l', type: 'wall', position: {x:-6, y:2, z:-40}, rotation: {x:0, y:0, z:0}, scale: {x:1, y:5, z:100} },
      { id: 'wall-r', type: 'wall', position: {x:6, y:2, z:-40}, rotation: {x:0, y:0, z:0}, scale: {x:1, y:5, z:100} },
      { id: 'wall-end', type: 'wall', position: {x:0, y:2, z:-62}, rotation: {x:0, y:0, z:0}, scale: {x:20, y:5, z:1} },
      
      // Obstacles (Simulated as walls for collision)
      // Jump Box
      { id: 'obs-jump', type: 'wall', position: {x:0, y:0.5, z:-10}, rotation: {x:0, y:0, z:0}, scale: {x:12, y:1, z:1} },
      
      // Pedestals
      { id: 'ped-mask', type: 'wall', position: {x:-3, y:0.5, z:-32}, rotation: {x:0, y:0, z:0}, scale: {x:2, y:1, z:2} },
      { id: 'ped-ext', type: 'wall', position: {x:3, y:0.5, z:-42}, rotation: {x:0, y:0, z:0}, scale: {x:2, y:1, z:2} },
    ];

    return {
      id: Level.BasicTraining,
      name: "Fire Academy",
      description: "Basic Training Course",
      hazards: [
        {
          id: "tutorial-fire",
          type: HazardType.ClassAFire,
          position: { x: 0, y: 0, z: -52 },
          isActive: true,
          severity: 1.0,
          isSmoking: false,
          isExtinguished: false
        },
        // FIX: Added an "Impossible" hazard far below the map.
        // This ensures 'hazards.every(h => h.isExtinguished)' is never true.
        // This prevents the game store from auto-completing the tutorial level.
        {
          id: "tutorial-dummy",
          type: HazardType.ClassAFire,
          position: { x: 0, y: -1000, z: 0 }, // Far far far far away ow ow
          isActive: true,
          severity: 1.0,
          isSmoking: false,
          isExtinguished: false
        }
      ],
      objects: [
        {
          id: "tutorial-mask",
          type: InteractiveObjectType.GasMask,
          position: { x: -3, y: 1.2, z: -32 },
          isActive: true,
          isCollected: false
        },
        {
          id: "tutorial-extinguisher",
          type: InteractiveObjectType.FireExtinguisher,
          position: { x: 3, y: 1.2, z: -42 },
          isActive: true,
          isCollected: false
        }
      ],
      environmentObjects: envObjects,
      // FIX: Set high score requirement so extinguishing the fire DOES NOT auto-complete the level.
      // only completes when the player walks into the portal. 
      requiredScore: 1000, 
      difficulty: DifficultyLevel.Beginner,
      learningObjectives: ["Movement", "Interaction"]
    };
  }, []);

  // --- 2. INITIALIZE ---
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Reset inventory so player starts tutorial empty-handed
    setHasExtinguisher(false);
    setHasGasMask(false);

    // FIX 2: Reset colliders immediately to prevent stale physics
    useFireSafety.setState({ collidables: [] });
    
    // Inject Data into Store
    useFireSafety.setState({
      currentLevel: Level.BasicTraining,
      levelData: tutorialLevelData,
      hazards: tutorialLevelData.hazards,
      interactiveObjects: tutorialLevelData.objects,
      // Force HomeEnvironment to rebuild walls/physics
      collidables: [], 
      collidableGeneration: useFireSafety.getState().collidableGeneration + 1
    });

    setSpawnPoint({ x: 0, y: 2, z: 0 });
    respawn();
    
    // FIX 3: Removed manual addWall() calls. 
    // HomeEnvironment (rendered below) will read 'levelData' and create the walls + colliders.
    // prevents the "Double Collider" issue and the "createBoundingBox is not defined" error.

  }, [tutorialLevelData, setSpawnPoint, respawn, setHasExtinguisher, setHasGasMask]);

  // --- 3. PROGRESS CHECK: only complete when fire is out AND player reached portal ---
  const tutorialFire = hazards.find((h) => h.id === "tutorial-fire");
  const isFireOut = tutorialFire ? tutorialFire.isExtinguished : false;

  useEffect(() => {
    if (playerPos.z < -58 && !completionTriggered.current && isFireOut) {
      completionTriggered.current = true;
      // Clear inventory before transitioning so next level starts empty-handed
      usePlayer.getState().setHasExtinguisher(false);
      usePlayer.getState().setHasGasMask(false);
      onComplete();
    }
  }, [playerPos, onComplete, isFireOut]);

  return (
    <group>
      <Lights />
      <FirstPersonPlayer />
      
      {/* Handles Wall/Obstacle Rendering & Physics */}
      <HomeEnvironment />

      {/* Manual Floor (Visual Only - No Physics to prevent bouncing) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]} receiveShadow>
        <planeGeometry args={[20, 100]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>

      {/* Render Game Entities */}
      {interactiveObjects.map(obj => (
        <ExtinguisherPickup key={obj.id} object={obj} isCollected={obj.isCollected} />
      ))}
      {hazards.map(hazard => (
        // Only render visible hazards (skip dummy one)
        hazard.id !== "tutorial-dummy" ? (
          <Hazard key={hazard.id} hazard={hazard} />
        ) : null
      ))}

      {/* --- VISUAL EXTRAS --- */}
      
      {/* Jump Box Visual Overlay */}
      <mesh position={[0, 0.5, -10]} castShadow>
        <boxGeometry args={[12, 1, 1]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
      
      {/* Pedestal Visual Overlays */}
      <mesh position={[-3, 0.5, -32]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      <mesh position={[3, 0.5, -42]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {/* --- INSTRUCTIONS --- */}
      <InfoLabel text="WELCOME RECRUIT!" position={[0, 2.5, -3]} size={0.8} color="#3b82f6" />
      <InfoLabel text="Use W A S D to Move" position={[0, 1.8, -3]} />

      <InfoLabel text="Press SPACE to Jump" position={[0, 2.5, -10]} color="#f59e0b" />

      {/* Crouch Visual Beam (No collider) */}
      <mesh position={[0, 2.8, -20]} castShadow>
        <boxGeometry args={[12, 1, 1]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <InfoLabel text="Press C to Crouch" position={[0, 3.8, -20]} color="#ef4444" />
      <InfoLabel text="(Watch your head!)" position={[0, 3.4, -20]} size={0.3} />

      <InfoLabel text="EQUIPMENT: GAS MASK" position={[0, 3.5, -32]} color="#10b981" size={0.7} />
      <InfoLabel text = "GAS MASK: Protects you from smoke and harmful gases." position={[0, 2.9, -32]} color="#10b981" size={0.4} />
      <InfoLabel text="Press E to Pickup" position={[-3, 2.5, -32]} size={0.4} />
      
      <InfoLabel text="WEAPON: EXTINGUISHER" position={[0, 3.5, -42]} color="#ef4444" size={0.7} />
      <InfoLabel text="Press E to Pickup" position={[3, 2.5, -42]} size={0.4} />
      
      {/* Dynamic instruction based on state */}
      {isFireOut ? (
        <InfoLabel text="FIRE EXTINGUISHED! PROCEED." position={[0, 2.5, -52]} color="#10b981" size={0.6} />
      ) : hasExtinguisher ? (
        <InfoLabel text="GREAT! Now Press F to Extinguish the Fire!" position={[0, 2.5, -48]} color="#ef4444" size={0.4} />
      ) : (
        <InfoLabel text="Grab the Extinguisher first!" position={[0, 2.5, -48]} color="#555" size={0.4} />
      )}

      {/* Portal & exit: only pass when fire is out */}
      {isFireOut ? (
        <>
          <InfoLabel text="TRAINING COMPLETE" position={[0, 3.0, -55]} color="#10b981" size={1.0} />
          <mesh position={[0, 1.5, -58]}>
            <torusGeometry args={[1.5, 0.2, 16, 32]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
          </mesh>
          <pointLight position={[0, 1.5, -58]} color="#00ffff" intensity={2} distance={5} />
        </>
      ) : (
        <>
          <InfoLabel text="EXTINGUISH FIRE TO LEAVE" position={[0, 3.0, -55]} color="#ff0000" size={0.8} />
          <mesh position={[0, 1.5, -58]}>
            <torusGeometry args={[1.5, 0.2, 16, 32]} />
            <meshStandardMaterial color="#555" transparent opacity={0.5} />
          </mesh>
          <mesh position={[0, 2.5, -58]}>
            <boxGeometry args={[4, 5, 0.1]} />
            <meshStandardMaterial color="#ff0000" transparent opacity={0.2} />
          </mesh>
        </>
      )}

    </group>
  );
}
