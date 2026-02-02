import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PlayerState, InteractiveObjectType } from "../types";
import { PLAYER_CONSTANTS, EXTINGUISHER_AMMO } from "../constants";

interface PlayerStateStore extends PlayerState {
  // Actions
  moveForward: (distance: number, cameraDirection?: { x: number; z: number }) => void;
  moveBackward: (distance: number, cameraDirection?: { x: number; z: number }) => void;
  moveLeft: (distance: number, cameraDirection?: { x: number; z: number }) => void;
  moveRight: (distance: number, cameraDirection?: { x: number; z: number }) => void;
  rotate: (angle: number) => void;
  setCrouching: (isCrouching: boolean) => void;
  setRunning: (isRunning: boolean) => void;
  takeDamage: (amount: number) => void;
  depleteOxygen: (amount: number) => void;
  replenishOxygen: (amount: number) => void;
  resetPlayer: () => void;
  setSpawnPoint: (point: { x: number; y: number; z: number }) => void;
  respawn: () => void;
  pickupExtinguisher: (extinguisherType?: InteractiveObjectType) => void;
  setHasExtinguisher: (has: boolean) => void;
  useExtinguisher: () => void;
  addScore: (points: number) => void;
  setScore: (score: number) => void;
  getMovementSpeed: () => number;
  pickupGasMask: () => void;
  setHasGasMask: (has: boolean) => void;
  // Extinguisher ammo actions
  drainExtinguisherAmmo: (amount: number) => void;
  refillExtinguisherAmmo: (amount: number) => void;
  canUseExtinguisher: () => boolean;
  getExtinguisherDrainRate: () => number;
}

export const usePlayer = create<PlayerStateStore>()(
  subscribeWithSelector((set, get) => ({
    position: { ...PLAYER_CONSTANTS.STARTING_POSITION },
    spawnPoint: { ...PLAYER_CONSTANTS.STARTING_POSITION },
    rotation: { x: 0, y: 0, z: 0 },
    health: PLAYER_CONSTANTS.MAX_HEALTH,
    hasExtinguisher: false,
    extinguisherType: null,
    extinguisherAmmo: 0, // Starts at 0, set to 100 when picking up extinguisher
    hasGasMask: false,
    isCrouching: false,
    isRunning: false,
    oxygen: PLAYER_CONSTANTS.MAX_OXYGEN,
    score: 0,
    
    moveForward: (distance: number, cameraDirection?: { x: number; z: number }) => {
      const { position, rotation } = get();
      const speed = get().getMovementSpeed();
      const actualDistance = distance * speed;

      if (cameraDirection) {
        // Move relative to camera direction
        const newX = position.x + cameraDirection.x * actualDistance;
        const newZ = position.z + cameraDirection.z * actualDistance;

        // Update character rotation to face movement direction
        const angle = Math.atan2(cameraDirection.x, cameraDirection.z);
        set({
          position: { ...position, x: newX, z: newZ },
          rotation: { ...rotation, y: angle }
        });
      } else {
        // Original character-relative movement (fallback)
        const angle = rotation.y;
        const newX = position.x - Math.sin(angle) * actualDistance;
        const newZ = position.z - Math.cos(angle) * actualDistance;

        set({ position: { ...position, x: newX, z: newZ } });
      }
    },
    
    moveBackward: (distance: number, cameraDirection?: { x: number; z: number }) => {
      const { position, rotation } = get();
      const speed = get().getMovementSpeed();
      const actualDistance = distance * speed;

      if (cameraDirection) {
        // Move relative to camera direction (opposite)
        const newX = position.x - cameraDirection.x * actualDistance;
        const newZ = position.z - cameraDirection.z * actualDistance;

        // Update character rotation to face movement direction
        const angle = Math.atan2(-cameraDirection.x, -cameraDirection.z);
        set({
          position: { ...position, x: newX, z: newZ },
          rotation: { ...rotation, y: angle }
        });
      } else {
        // Original character-relative movement (fallback)
        const angle = rotation.y;
        const newX = position.x + Math.sin(angle) * actualDistance;
        const newZ = position.z + Math.cos(angle) * actualDistance;

        set({ position: { ...position, x: newX, z: newZ } });
      }
    },
    
    moveLeft: (distance: number, cameraDirection?: { x: number; z: number }) => {
      const { position, rotation } = get();
      const speed = get().getMovementSpeed();
      const actualDistance = distance * speed;

      if (cameraDirection) {
        // Move left relative to camera direction (perpendicular)
        const leftX = cameraDirection.z; // Perpendicular to camera direction (corrected)
        const leftZ = -cameraDirection.x;
        const newX = position.x + leftX * actualDistance;
        const newZ = position.z + leftZ * actualDistance;

        // Update character rotation to face movement direction
        const angle = Math.atan2(leftX, leftZ);
        set({
          position: { ...position, x: newX, z: newZ },
          rotation: { ...rotation, y: angle }
        });
      } else {
        // Original character-relative movement (fallback)
        const angle = rotation.y - Math.PI / 2;
        const newX = position.x - Math.sin(angle) * actualDistance;
        const newZ = position.z - Math.cos(angle) * actualDistance;

        set({ position: { ...position, x: newX, z: newZ } });
      }
    },
    
    moveRight: (distance: number, cameraDirection?: { x: number; z: number }) => {
      const { position, rotation } = get();
      const speed = get().getMovementSpeed();
      const actualDistance = distance * speed;

      if (cameraDirection) {
        // Move right relative to camera direction (perpendicular)
        const rightX = -cameraDirection.z; // Perpendicular to camera direction (corrected)
        const rightZ = cameraDirection.x;
        const newX = position.x + rightX * actualDistance;
        const newZ = position.z + rightZ * actualDistance;

        // Update character rotation to face movement direction
        const angle = Math.atan2(rightX, rightZ);
        set({
          position: { ...position, x: newX, z: newZ },
          rotation: { ...rotation, y: angle }
        });
      } else {
        // Original character-relative movement (fallback)
        const angle = rotation.y + Math.PI / 2;
        const newX = position.x - Math.sin(angle) * actualDistance;
        const newZ = position.z - Math.cos(angle) * actualDistance;

        set({ position: { ...position, x: newX, z: newZ } });
      }
    },
    
    rotate: (angle: number) => {
      const { rotation } = get();
      set({ rotation: { ...rotation, y: rotation.y + angle } });
    },
    
    setCrouching: (isCrouching: boolean) => {
      set({ isCrouching });
      
      // Adjust height when crouching
      if (isCrouching) {
        set(state => ({ position: { ...state.position, y: 0.5 } }));
      } else {
        set(state => ({ position: { ...state.position, y: 1 } }));
      }
    },
    
    setRunning: (isRunning: boolean) => {
      set({ isRunning });
    },
    
    takeDamage: (amount: number) => {
      set(state => ({ 
        health: Math.max(0, state.health - amount) 
      }));
    },
    
    depleteOxygen: (amount: number) => {
      set(state => ({ 
        oxygen: Math.max(0, state.oxygen - amount) 
      }));
      
      // If oxygen is depleted, start taking damage
      if (get().oxygen <= 0) {
        get().takeDamage(amount / 2);
      }
    },
    
    replenishOxygen: (amount: number) => {
      set(state => ({ 
        oxygen: Math.min(PLAYER_CONSTANTS.MAX_OXYGEN, state.oxygen + amount) 
      }));
    },
    
    resetPlayer: () => {
      set({
        position: { ...PLAYER_CONSTANTS.STARTING_POSITION },
        spawnPoint: { ...PLAYER_CONSTANTS.STARTING_POSITION },
        rotation: { x: 0, y: 0, z: 0 },
        health: PLAYER_CONSTANTS.MAX_HEALTH,
        hasExtinguisher: false,
        extinguisherType: null,
        extinguisherAmmo: 0,
        hasGasMask: false,
        isCrouching: false,
        isRunning: false,
        oxygen: PLAYER_CONSTANTS.MAX_OXYGEN
      });
    },
    
    setSpawnPoint: (point: { x: number; y: number; z: number }) => {
      set({ spawnPoint: { ...point } });
    },
    
    respawn: () => {
      const { spawnPoint } = get();
      set(state => ({
        position: { ...spawnPoint },
        rotation: { ...state.rotation, x: 0, z: 0 }
      }));
    },
    
    pickupExtinguisher: (extinguisherType?: InteractiveObjectType) => {
      set({ 
        hasExtinguisher: true,
        extinguisherType: extinguisherType || InteractiveObjectType.FireExtinguisher,
        extinguisherAmmo: EXTINGUISHER_AMMO.MAX_CAPACITY // Full ammo on pickup
      });
    },

    setHasExtinguisher: (has: boolean) => {
      set((state) => ({
        hasExtinguisher: has,
        extinguisherType: has ? (state.extinguisherType || InteractiveObjectType.FireExtinguisher) : null,
        extinguisherAmmo: has ? EXTINGUISHER_AMMO.MAX_CAPACITY : 0,
      }));
    },
    
    useExtinguisher: () => {
      // Logic for using the extinguisher
      // This is just a placeholder - the actual extinguishing is handled in FireSafety store
    },
    
    addScore: (points: number) => {
      set(state => ({ score: state.score + points }));
    },

    setScore: (score: number) => {
      set({ score });
    },
    
    pickupGasMask: () => {
      set({ hasGasMask: true });
    },

    setHasGasMask: (has: boolean) => {
      set({ hasGasMask: has });
    },
    
    getMovementSpeed: () => {
      const { isCrouching, isRunning } = get();
      
      if (isCrouching) {
        return PLAYER_CONSTANTS.CROUCH_SPEED;
      } else if (isRunning) {
        return PLAYER_CONSTANTS.RUNNING_SPEED;
      } else {
        return PLAYER_CONSTANTS.MOVEMENT_SPEED;
      }
    },
    
    // === EXTINGUISHER AMMO ACTIONS ===
    
    drainExtinguisherAmmo: (amount: number) => {
      const prevAmmo = get().extinguisherAmmo;
      const newAmmo = Math.max(0, prevAmmo - amount);
      
      set({ extinguisherAmmo: newAmmo });
      
      // If ammo just reached 0, trigger respawn timer
      if (prevAmmo > 0 && newAmmo <= 0) {
        console.log("🧯 Extinguisher depleted! Respawn in 15 seconds...");
        
        // Import dynamically to avoid circular dependency
        import("./useFireSafety").then(({ useFireSafety }) => {
          const lastPickedId = useFireSafety.getState().lastPickedExtinguisherId;
          if (lastPickedId) {
            setTimeout(() => {
              useFireSafety.getState().respawnExtinguisher(lastPickedId);
            }, EXTINGUISHER_AMMO.RESPAWN_DELAY);
          }
        });
      }
    },
    
    refillExtinguisherAmmo: (amount: number) => {
      set(state => ({
        extinguisherAmmo: Math.min(EXTINGUISHER_AMMO.MAX_CAPACITY, state.extinguisherAmmo + amount)
      }));
    },
    
    canUseExtinguisher: () => {
      const { hasExtinguisher, extinguisherAmmo } = get();
      return hasExtinguisher && extinguisherAmmo > 0;
    },
    
    getExtinguisherDrainRate: () => {
      const { extinguisherType } = get();
      if (!extinguisherType) return EXTINGUISHER_AMMO.DEFAULT_DRAIN_RATE;
      
      // Get drain rate for specific extinguisher type
      const typeName = extinguisherType.toString();
      return EXTINGUISHER_AMMO.DRAIN_RATES[typeName] || EXTINGUISHER_AMMO.DEFAULT_DRAIN_RATE;
    }
  }))
);
