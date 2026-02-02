import { useRef, useEffect, useState, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { Controls, Level } from "@/lib/types";
import { PLAYER_CONSTANTS, GAME_CONSTANTS } from "../../lib/constants";

const PLAYER_SIZE = new THREE.Vector3(
  PLAYER_CONSTANTS.CHARACTER_BOUNDING_BOX.x,
  PLAYER_CONSTANTS.CHARACTER_BOUNDING_BOX.y,
  PLAYER_CONSTANTS.CHARACTER_BOUNDING_BOX.z
);
const FORWARD_VECTOR = new THREE.Vector3();
const RIGHT_VECTOR = new THREE.Vector3();
const MOVEMENT_VECTOR = new THREE.Vector3();
const MOVEMENT_DELTA = new THREE.Vector3();
const CURRENT_POSITION = new THREE.Vector3();
const PROPOSED_POSITION = new THREE.Vector3();
const SLIDE_POSITION = new THREE.Vector3();
const TEMP_BOX = new THREE.Box3();
const TEMP_OBSTACLE_BOX = new THREE.Box3();

useGLTF.preload('/models/firefighter.glb');
useGLTF.preload('/models/fire_extinguisher.glb');

export default function Character() {
  const playerRef = useRef<THREE.Group>(null);
  const characterRef = useRef<THREE.Mesh>(null);
  const modelRef = useRef<THREE.Group>(null);
  const extinguisherRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isUsingExtinguisher, setIsUsingExtinguisher] = useState(false);
  const animationPhase = useRef(0);
  
  // Animation state for walking/running
  const walkAnimationPhase = useRef(0);
  const [isMoving, setIsMoving] = useState(false);
  const [currentMoveSpeed, setCurrentMoveSpeed] = useState(0);
  
  // Load the character model
  const { scene: characterModel } = useGLTF('/models/firefighter.glb') as GLTF & {
    scene: THREE.Group
  };
  
  // Load the fire extinguisher model
  const { scene: extinguisherModel } = useGLTF('/models/fire_extinguisher.glb') as GLTF & {
    scene: THREE.Group
  };
  
  // Get direct access to necessary player state properties
  const { 
    position, 
    rotation,
    isCrouching,
    isRunning,
    hasExtinguisher,
    hasGasMask,
    setCrouching,
    setRunning,
    depleteOxygen,
    replenishOxygen
  } = usePlayer();
  
  // Get hazards, game pause state, and current level
  const {
    hazards,
    isPaused,
    currentLevel,
    collidables,
  } = useFireSafety();
  
  // Get keyboard controls at the component level
  const [subscribe, getKeys] = useKeyboardControls<Controls>();

  // Get camera for direction calculation
  const { camera } = useThree();
  
  // Store keyboard controls state
  const controlsRef = useRef({
    forward: false,
    backward: false,
    leftward: false,
    rightward: false,
    run: false,
    crouch: false,
    extinguish: false
  });

  const getBoundarySize = () => {
    switch (currentLevel) {
      case Level.Kitchen:
      case Level.LivingRoom:
      case Level.Garage:
      case Level.BasicTraining:
        return 9.5;
      default:
        return 9.5;
    }
  };

  const collidesAt = (center: THREE.Vector3) => {
    TEMP_BOX.setFromCenterAndSize(center, PLAYER_SIZE);
    for (const obstacle of collidables) {
      TEMP_OBSTACLE_BOX.min.copy(obstacle.min);
      TEMP_OBSTACLE_BOX.max.copy(obstacle.max);
      if (TEMP_BOX.intersectsBox(TEMP_OBSTACLE_BOX)) {
        return true;
      }
    }
    return false;
  };
  
  // Set up keyboard controls subscription once
  useEffect(() => {
    // Subscribe to all key changes
    const unsubscribe = subscribe(
      (state) => state,
      (state) => {
        // Update our local ref with current control states
        controlsRef.current = state;
        
        // Handle special controls directly
        setCrouching(state.crouch || false);
        setRunning(state.run || false);
        
        // Handle extinguisher animation
        if (state.extinguish && hasExtinguisher) {
          setIsUsingExtinguisher(true);
        } else {
          setIsUsingExtinguisher(false);
        }
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, [subscribe, getKeys, setCrouching, setRunning, hasExtinguisher]);
  
  // Handle player movement and rotation in the game loop
  useFrame((_, delta) => {
    if (isPaused || !playerRef.current) return;
    
    const controls = controlsRef.current;
    const hasInput = controls.forward || controls.backward || controls.leftward || controls.rightward;
    
    camera.getWorldDirection(FORWARD_VECTOR);
    FORWARD_VECTOR.y = 0;
    if (FORWARD_VECTOR.lengthSq() === 0) {
      FORWARD_VECTOR.set(0, 0, 1);
    } else {
      FORWARD_VECTOR.normalize();
    }
    RIGHT_VECTOR.crossVectors(FORWARD_VECTOR, new THREE.Vector3(0, 1, 0)).normalize();
    
    MOVEMENT_VECTOR.set(0, 0, 0);
    if (controls.forward) MOVEMENT_VECTOR.add(FORWARD_VECTOR);
    if (controls.backward) MOVEMENT_VECTOR.sub(FORWARD_VECTOR);
    if (controls.leftward) MOVEMENT_VECTOR.sub(RIGHT_VECTOR);
    if (controls.rightward) MOVEMENT_VECTOR.add(RIGHT_VECTOR);
    
    const moveSpeedScalar = (controls.run ? PLAYER_CONSTANTS.RUNNING_SPEED : PLAYER_CONSTANTS.MOVEMENT_SPEED) * delta;
    if (MOVEMENT_VECTOR.lengthSq() > 0) {
      MOVEMENT_VECTOR.normalize();
      MOVEMENT_DELTA.copy(MOVEMENT_VECTOR).multiplyScalar(moveSpeedScalar);
    } else {
      MOVEMENT_DELTA.set(0, 0, 0);
    }
    
    CURRENT_POSITION.set(position.x, position.y, position.z);
    PROPOSED_POSITION.copy(CURRENT_POSITION).add(MOVEMENT_DELTA);
    
    const boundary = getBoundarySize();
    PROPOSED_POSITION.x = THREE.MathUtils.clamp(PROPOSED_POSITION.x, -boundary, boundary);
    PROPOSED_POSITION.z = THREE.MathUtils.clamp(PROPOSED_POSITION.z, -boundary, boundary);
    
    let finalPosition = CURRENT_POSITION.clone();
    if (MOVEMENT_DELTA.lengthSq() > 0) {
      if (!collidesAt(PROPOSED_POSITION)) {
        finalPosition.copy(PROPOSED_POSITION);
      } else {
        // try sliding along x
        SLIDE_POSITION.set(CURRENT_POSITION.x + MOVEMENT_DELTA.x, CURRENT_POSITION.y, CURRENT_POSITION.z);
        SLIDE_POSITION.x = THREE.MathUtils.clamp(SLIDE_POSITION.x, -boundary, boundary);
        if (Math.abs(MOVEMENT_DELTA.x) > 1e-4 && !collidesAt(SLIDE_POSITION)) {
          finalPosition.copy(SLIDE_POSITION);
        } else {
          SLIDE_POSITION.set(CURRENT_POSITION.x, CURRENT_POSITION.y, CURRENT_POSITION.z + MOVEMENT_DELTA.z);
          SLIDE_POSITION.z = THREE.MathUtils.clamp(SLIDE_POSITION.z, -boundary, boundary);
          if (Math.abs(MOVEMENT_DELTA.z) > 1e-4 && !collidesAt(SLIDE_POSITION)) {
            finalPosition.copy(SLIDE_POSITION);
          }
        }
      }
    }
    
    const displacement = finalPosition.clone().sub(CURRENT_POSITION);
    const moveDistance = displacement.length();
    const moveSpeed = moveDistance / Math.max(delta, 1e-5);
    setCurrentMoveSpeed(moveSpeed);
    const moving = moveDistance > 1e-3 || hasInput;
    setIsMoving(moving);
    
    if (moveDistance > 0) {
      playerRef.current.position.copy(finalPosition);
      usePlayer.setState((state) => ({
        position: { ...state.position, x: finalPosition.x, z: finalPosition.z }
      }));
    }
    
    if (moving && MOVEMENT_VECTOR.lengthSq() > 0) {
      const heading = Math.atan2(MOVEMENT_VECTOR.x, MOVEMENT_VECTOR.z);
      playerRef.current.rotation.y = heading;
      usePlayer.setState((state) => ({
        rotation: { ...state.rotation, y: heading }
      }));
    }
    
    // Animate fire extinguisher usage
    if (isUsingExtinguisher && extinguisherRef.current) {
      animationPhase.current += delta * 8;
      const shake = Math.sin(animationPhase.current) * 0.1;
      extinguisherRef.current.position.set(0.3 + shake * 0.2, 0.3 + shake * 0.1, 0.3);
      extinguisherRef.current.rotation.x = shake * 0.3;
      extinguisherRef.current.rotation.z = shake * 0.2;
    } else if (extinguisherRef.current) {
      extinguisherRef.current.position.set(0.3, 0.3, 0.3);
      extinguisherRef.current.rotation.set(0, 0, 0);
      animationPhase.current = 0;
    }
    
    // Character animations
    if (modelRef.current) {
      if (moving) {
        const animationSpeed = isRunning ? 12 : 8;
        walkAnimationPhase.current += delta * animationSpeed;
        const bobIntensity = isRunning ? 0.15 : 0.08;
        const bobFrequency = isRunning ? 3 : 2.5;
        modelRef.current.position.y = Math.sin(walkAnimationPhase.current * bobFrequency) * bobIntensity;
        modelRef.current.rotation.z = Math.sin(walkAnimationPhase.current * bobFrequency) * (isRunning ? 0.15 : 0.1);
        modelRef.current.rotation.x = Math.sin(walkAnimationPhase.current * bobFrequency) * (isRunning ? 0.2 : 0.15);
        if (isRunning) {
          modelRef.current.rotation.x += -0.1;
        }
        if (isCrouching) {
          modelRef.current.position.y *= 0.5;
          modelRef.current.rotation.z *= 0.7;
        }
      } else {
        walkAnimationPhase.current = 0;
        modelRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.005;
        modelRef.current.rotation.z = 0;
        modelRef.current.rotation.x = 0;
      }
      if (isUsingExtinguisher) {
        modelRef.current.rotation.x = -0.2;
        modelRef.current.rotation.z = 0;
        modelRef.current.position.y = 0;
      }
    }

    // Oxygen logic
    if (!hasGasMask) {
      depleteOxygen(PLAYER_CONSTANTS.OXYGEN_DEPLETION_RATE * delta);
    } else {
      replenishOxygen(PLAYER_CONSTANTS.OXYGEN_DEPLETION_RATE * 0.3 * delta);
    }
  });
  
  // Set initial position on mount
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.set(position.x, position.y, position.z);
      playerRef.current.rotation.y = rotation.y;
    }
  }, []);
  
  // Update model loaded state
  useEffect(() => {
    if (characterModel) {
      setModelLoaded(true);
    }
  }, [characterModel]);
  
  // Get animation scale based on movement type
  const getAnimationScale = (): [number, number, number] => {
    if (isCrouching) return [1.5, 1.05, 1.5];
    if (isRunning && isMoving) return [1.56, 1.56, 1.56]; // Slightly bigger when running
    return [1.5, 1.5, 1.5];
  };
  
  return (
    <group 
      ref={playerRef} 
      position={[position.x, position.y, position.z]}
      rotation={[0, rotation.y, 0]}
    >
      {modelLoaded ? (
        <Suspense fallback={
          <mesh 
            ref={characterRef} 
            position={[0, 2.5, 0]} 
            castShadow
          >
            <boxGeometry args={[1.5, isCrouching ? 3 : 5.1, 1.5]} />
            <meshStandardMaterial 
              color={
                isRunning && isMoving ? "#FF6B6B" : // Red when running
                isMoving ? "#3498DB" : // Blue when walking  
                hasExtinguisher ? "#E74C3C" : "#3498DB" // Default colors
              } 
            />
          </mesh>
        }>
          <group 
            ref={modelRef} 
            scale={getAnimationScale()} 
            position={[0, isCrouching ? -1.8 : -1.5, 0]}
          >
            <primitive object={characterModel} castShadow receiveShadow />
          </group>
          
          {/* Fire extinguisher (if player has one) */}
          {hasExtinguisher && extinguisherModel && (
            <group 
              ref={extinguisherRef}
              position={[0.9, 0.9, 0.9]} 
              scale={[1.8, 1.8, 1.8]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <primitive object={extinguisherModel.clone()} castShadow receiveShadow />
            </group>
          )}
          
          {/* Removed action indicator ring to avoid circle above player */}
          

        </Suspense>
      ) : (
        // Fallback while loading
        <mesh 
          ref={characterRef} 
          position={[0, 2.5, 0]} 
          castShadow
        >
          <boxGeometry args={[1.5, isCrouching ? 3 : 5.1, 1.5]} />
          <meshStandardMaterial 
            color={
              isRunning && isMoving ? "#FF6B6B" : // Red when running
              isMoving ? "#3498DB" : // Blue when walking  
              hasExtinguisher ? "#E74C3C" : "#3498DB" // Default colors
            } 
          />
        </mesh>
      )}
    </group>
  );
}