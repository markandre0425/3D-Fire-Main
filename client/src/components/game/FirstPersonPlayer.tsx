import { useEffect, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { Controls, InteractiveObjectType } from "@/lib/types";
// Added GAME_CONSTANTS to imports for interaction distance
import { PLAYER_CONSTANTS, GAME_CONSTANTS } from "@/lib/constants";
import { GLTF } from "three-stdlib";
import ExtinguisherSpray from "./ExtinguisherSpray";

const PLAYER_HEIGHT = PLAYER_CONSTANTS.CHARACTER_BOUNDING_BOX.y;
const PLAYER_RADIUS = PLAYER_CONSTANTS.CHARACTER_BOUNDING_BOX.x * 0.5;
const CROUCH_FACTOR = 0.6; 

const EYE_OFFSET = PLAYER_HEIGHT * 0.5;
const CROUCH_EYE_OFFSET = EYE_OFFSET * CROUCH_FACTOR;

const GROUND_LEVEL = PLAYER_CONSTANTS.STARTING_POSITION.y;
const GRAVITY = 25;
const JUMP_FORCE = 10;
const STEP_HEIGHT = 0.1;

const FORWARD_VECTOR = new THREE.Vector3();
const RIGHT_VECTOR = new THREE.Vector3();
const UP_VECTOR = new THREE.Vector3(0, 1, 0);
const HAND_OFFSET = new THREE.Vector3(0.4, -0.5, -0.8);
// Handle offset in camera space (where the handle appears on the right side of the screen)
// positions the spray origin at the handle location in first-person view
// X: right (positive) / left (negative), Y: up (positive) / down (negative), Z: forward (negative = toward camera)
const HANDLE_CAMERA_OFFSET = new THREE.Vector3(0.4, -0.4, -0.7); // Handle position in camera space
const ENABLE_SPRAY_EFFECT = true;

// --- CONFIGURATION: Extinguisher damage over time ---
// Time to extinguish ≈ severity / rate
// - Small fire (0.5) → 0.5 / 0.2 = 2.5s
// - Big fire (1.0) → 1.0 / 0.2 = 5.0s
const EXTINGUISH_RATE = 0.2;

useGLTF.preload("/models/fire_extinguisher.glb");


export default function FirstPersonPlayer() {
  const { camera, gl } = useThree();
  
  // FIX: Get specific state for rendering updates (Visuals)
  const extinguishPressed = useKeyboardControls<Controls>(state => state.extinguish);
  
  // Get subscription for physics updates (Movement loop)
  const [subscribeKeys] = useKeyboardControls<Controls>();
  const { hasExtinguisher, extinguisherType } = usePlayer();
  const respawnPlayer = usePlayer((state) => state.respawn);
  const spawnPoint = usePlayer((state) => state.spawnPoint);
  
  // OPTIMIZATION: Use selector to prevent re-renders when Score/Oxygen changes
  const extinguishHazard = useFireSafety((state) => state.extinguishHazard);
  const { scene: extinguisherScene } = useGLTF("/models/fire_extinguisher.glb") as GLTF & {
    scene: THREE.Group;
  };

  const clonedExtinguisher = useMemo(() => extinguisherScene.clone(), [extinguisherScene]);
  const extinguisherGroup = useRef<THREE.Group>(null);
  const sprayGroup = useRef<THREE.Group>(null);
  
  const extinguishCooldown = useRef(0);

  const controlsRef = useRef({
    forward: false,
    backward: false,
    leftward: false,
    rightward: false,
    run: false,
    jump: false,
    crouch: false,
    extinguish: false,
  });
  
  const velocityY = useRef(0);
  const grounded = useRef(true);
  const positionRef = useRef(new THREE.Vector3(0,0,0));

  // Pointer lock setup
  useEffect(() => {
    const handleClick = () => {
      gl.domElement.requestPointerLock();
    };
    gl.domElement.addEventListener("click", handleClick);
    return () => {
      gl.domElement.removeEventListener("click", handleClick);
    };
  }, [gl.domElement]);


  useEffect(() => {
    camera.rotation.order = "YXZ";
    camera.rotation.set(0, 0, 0);
  }, [camera]);

  // Initialize position from store on mount
  useEffect(() => {
    const startPos = usePlayer.getState().position;
    positionRef.current.set(startPos.x, startPos.y, startPos.z);
  }, []);

  // --- INTERACTION HANDLER ---
  useEffect(() => {
    return subscribeKeys(
      (state) => state.action,
      (pressed) => {
        if (pressed) {
          const state = useFireSafety.getState();
          const playerPos = usePlayer.getState().position;
          const objects = state.interactiveObjects;
          const collect = state.collectObject;
          
          // Interaction distance logic
          const interactDistSq = ((GAME_CONSTANTS?.INTERACTION_DISTANCE || 2.5) + 0.5) ** 2;

          // DEBUG LOGGING
          // console.log("Attempting interaction. Player at:", playerPos);
          // console.log("Objects available:", objects.length);

          for (const obj of objects) {
            if (obj.isCollected || !obj.isActive) {
               // console.log(`Skipping ${obj.id} (Collected: ${obj.isCollected}, Active: ${obj.isActive})`);
               continue;
            }

            const dx = playerPos.x - obj.position.x;
            const dy = playerPos.y - obj.position.y; 
            const dz = playerPos.z - obj.position.z;
            const distSq = dx*dx + dy*dy + dz*dz;

            // console.log(`Checking ${obj.id} at distSq: ${distSq} vs Limit: ${interactDistSq}`);

            if (distSq < interactDistSq) {
              console.log(`Collecting ${obj.id}`);
              collect(obj.id);
              break; 
            }
          }
        }
      }
    );
  }, [subscribeKeys]);

  // Respawn Handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r") {
        respawnPlayer();
        velocityY.current = 0;
        grounded.current = true;
        camera.rotation.set(0, 0, 0);
        
        const freshSpawn = usePlayer.getState().spawnPoint;
        positionRef.current.set(freshSpawn.x, freshSpawn.y, freshSpawn.z);
        camera.position.set(freshSpawn.x, freshSpawn.y + EYE_OFFSET, freshSpawn.z);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [respawnPlayer, camera]);

  // Mouse look
  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) return;
      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;
      const yawSpeed = 0.002;
      const pitchSpeed = 0.002;

      camera.rotation.y -= movementX * yawSpeed;
      const newPitch = camera.rotation.x - movementY * pitchSpeed;
      // Clamp pitch to avoid flipping over
      camera.rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, newPitch));
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [camera, gl.domElement]);

  // Controls subscription (For Physics Loop - Non-Rendering)
  useEffect(() => {
    const unsubscribe = subscribeKeys(
      (state) => state,
      (state) => {
        controlsRef.current = {
          forward: state.forward,
          backward: state.backward,
          leftward: state.leftward,
          rightward: state.rightward,
          run: state.run,
          jump: (state as any).jump || false,
          crouch: (state as any).crouch || false,
          extinguish: (state as any).extinguish || false,
        };
      }
    );
    return () => unsubscribe();
  }, [subscribeKeys]);

  // Collision check!!!!
  const collidesAt = (pos: THREE.Vector3, height: number) => {
    const radius = PLAYER_RADIUS * 0.9; 
    const collidables = useFireSafety.getState().collidables; // Read fresh state without re-render

    for (const obstacle of collidables) {
      if (
        pos.x + radius > obstacle.min.x &&
        pos.x - radius < obstacle.max.x &&
        pos.z + radius > obstacle.min.z &&
        pos.z - radius < obstacle.max.z
      ) {
        if (
          pos.y < obstacle.max.y &&
          pos.y + height > obstacle.min.y
        ) {
          return true;
        }
      }
    }
    return false;
  };

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    const isCrouching = controls.crouch;
    
    // --- MOVEMENT & PHYSICS LOGIC ---
    const currentSpeed = isCrouching 
      ? PLAYER_CONSTANTS.CROUCH_SPEED 
      : (controls.run ? PLAYER_CONSTANTS.RUNNING_SPEED : PLAYER_CONSTANTS.MOVEMENT_SPEED);
    
    const moveSpeed = currentSpeed * delta;
    const currentHeight = isCrouching ? PLAYER_HEIGHT * CROUCH_FACTOR : PLAYER_HEIGHT;
    const targetEyeHeight = isCrouching ? CROUCH_EYE_OFFSET : EYE_OFFSET;

    // --- 1. CALCULATE MOVEMENT VECTORS ---
    camera.getWorldDirection(FORWARD_VECTOR);
    FORWARD_VECTOR.y = 0;
    FORWARD_VECTOR.normalize();
    RIGHT_VECTOR.crossVectors(FORWARD_VECTOR, UP_VECTOR).normalize();

    const moveDir = new THREE.Vector3(0, 0, 0);
    if (controls.forward) moveDir.add(FORWARD_VECTOR);
    if (controls.backward) moveDir.sub(FORWARD_VECTOR);
    if (controls.leftward) moveDir.sub(RIGHT_VECTOR);
    if (controls.rightward) moveDir.add(RIGHT_VECTOR);

    if (moveDir.lengthSq() > 0) moveDir.normalize();
    
    const dx = moveDir.x * moveSpeed;
    const dz = moveDir.z * moveSpeed;

    // --- 2. HORIZONTAL COLLISION (Separate Axes to prevent Wall Stick/Bounce) ---
    const nextPos = positionRef.current.clone();
    
    // Horizontal Collision (Slide) instead of bouncing off walls
    nextPos.x += dx;
    if (collidesAt(nextPos, currentHeight)) nextPos.x -= dx;

    nextPos.z += dz;
    if (collidesAt(nextPos, currentHeight)) nextPos.z -= dz;

    // --- 3. VERTICAL PHYSICS ---
    if (controls.jump && grounded.current && !isCrouching) {
      velocityY.current = JUMP_FORCE;
      grounded.current = false;
    }
    
    velocityY.current -= GRAVITY * delta;
    const dy = velocityY.current * delta;

    // Apply Gravity
    nextPos.y += dy;

    // Check Floor Collision
    if (nextPos.y <= GROUND_LEVEL) {
        nextPos.y = GROUND_LEVEL;
      velocityY.current = 0;
      grounded.current = true;
    } else {
        // Check Object collision (Vertical)
        if (collidesAt(nextPos, currentHeight)) {
            // If moving down (Fall), hit object then land.
            if (velocityY.current < 0) {
                velocityY.current = 0;
                grounded.current = true;
                nextPos.y -= dy; // Undo move to sit on top
            } else {
                // Hit head on ceiling
                velocityY.current = 0;
                nextPos.y -= dy;
            }
    } else {
      grounded.current = false;
        }
    }

    // --- 4. APPLY UPDATES ---
    positionRef.current.copy(nextPos);
    
    // Sync to Store (for other components)
    usePlayer.setState((state) => ({
      position: { ...state.position, x: nextPos.x, y: nextPos.y, z: nextPos.z }
    }));

    // Update Camera
    camera.position.set(nextPos.x, nextPos.y + targetEyeHeight, nextPos.z);

    // --- EXTINGUISHER VISUALS ---
    const isSpraying = controls.extinguish && hasExtinguisher;

    if (extinguisherGroup.current && hasExtinguisher) {
      camera.updateMatrixWorld(true);
      const handWorld = HAND_OFFSET.clone();
      if (isCrouching) handWorld.y += 0.2;
      
      camera.localToWorld(handWorld);
      extinguisherGroup.current.position.copy(handWorld);
      extinguisherGroup.current.quaternion.copy(camera.quaternion);

      if (sprayGroup.current) {
        const handleWorld = HANDLE_CAMERA_OFFSET.clone();
        camera.localToWorld(handleWorld);
        sprayGroup.current.position.copy(handleWorld);
        sprayGroup.current.quaternion.copy(camera.quaternion);
      }
      
      // --- EXTINGUISHING LOGIC (GAMEPLAY, DAMAGE OVER TIME) ---
      // run hazard checks at a fixed interval to save CPU,
      // also apply a severity reduction scaled by time to keep the rate consistent.
      const checkInterval = 0.1; // seconds, 10 checks per second

      if (extinguishCooldown.current > 0) {
        extinguishCooldown.current -= delta;
      }

      if (isSpraying && extinguishCooldown.current <= 0) {
        const px = nextPos.x;
        const pz = nextPos.z;
        const rangeSq = 4 * 4; // 4 meters range

        // Amount of severity to remove this tick
        const damageAmount = EXTINGUISH_RATE * checkInterval;

        const hazards = useFireSafety.getState().hazards;

        for (const hazard of hazards) {
          if (hazard.isExtinguished || !hazard.isActive) continue;

          const hx = hazard.position.x;
          const hz = hazard.position.z;
          const distSq = (px - hx) ** 2 + (pz - hz) ** 2;

          if (distSq < rangeSq) {
            // Gradually reduce the fire's severity over time
            extinguishHazard(hazard.id, damageAmount);
          }
        }
        extinguishCooldown.current = checkInterval;
      }
    }
  });

  // FIX: Use the state-based 'extinguishPressed' for visual toggling
  const isSprayingVisual = extinguishPressed && hasExtinguisher;

  return (
    <>
      {hasExtinguisher && (
        <group ref={extinguisherGroup}>
          <primitive 
            object={clonedExtinguisher} 
            scale={[0.35 * 2.5, 0.35 * 2.5, 0.35 * 2.5]} 
          />
        </group>
      )}

      {ENABLE_SPRAY_EFFECT && hasExtinguisher && (
        <group ref={sprayGroup}>
          <ExtinguisherSpray 
            active={isSprayingVisual}
            extinguisherType={extinguisherType || InteractiveObjectType.FireExtinguisher}
          />
        </group>
      )}
    </>
  );
}

