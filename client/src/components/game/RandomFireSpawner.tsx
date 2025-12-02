import { useEffect, useCallback } from 'react';
import { EnvironmentObject, HazardState, HazardType } from '@/lib/types';
import { useFireSafety } from '@/lib/stores/useFireSafety';

interface RandomFireSpawnerProps {
  maxFires?: number;
  spawnInterval?: number; // in milliseconds
  spawnChance?: number; // 0-1, probability of spawning each interval
  environmentObjects?: EnvironmentObject[]; // Models to spawn fires on
  mapBounds?: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
    y: number;
  };
}

export default function RandomFireSpawner({
  maxFires = 5,
  spawnInterval = 10000, // 10 seconds
  spawnChance = 0.3, // 30% chance each interval
  environmentObjects = [],
  mapBounds = {
    minX: -8,
    maxX: 8,
    minZ: -8,
    maxZ: 8,
    y: 0.1
  }
}: RandomFireSpawnerProps) {
  const addHazard = useFireSafety(state => state.addHazard);

  // Filter furniture models (exclude walls, floors, and special types)
  const furnitureModels = environmentObjects.filter(obj => 
    obj.type !== 'wall' && 
    obj.type !== 'floor' &&
    obj.type !== 'minimal_bathroom'
  );

  // Generate random position on a model or within map bounds
  const generateRandomPosition = useCallback((): [number, number, number] => {
    // 80% chance to spawn on a model, 20% chance on floor
    if (furnitureModels.length > 0 && Math.random() < 0.8) {
      const randomModel = furnitureModels[Math.floor(Math.random() * furnitureModels.length)];
      // Spawn fire on top of the model (y position + half of scale.y)
      const y = randomModel.position.y + (randomModel.scale.y / 2) + 0.1;
      return [randomModel.position.x, y, randomModel.position.z];
    } else {
      // Fallback to random floor position
      const x = Math.random() * (mapBounds.maxX - mapBounds.minX) + mapBounds.minX;
      const z = Math.random() * (mapBounds.maxZ - mapBounds.minZ) + mapBounds.minZ;
      return [x, mapBounds.y, z];
    }
  }, [furnitureModels, mapBounds]);

  // Spawn a new hazard-backed fire into the global store
  const spawnFire = useCallback(() => {
    // Limit number of dynamic fires by checking current hazards in the store
    const currentHazards = useFireSafety.getState().hazards;
    const dynamicFires = currentHazards.filter(h => h.id.startsWith('random-fire-'));
    if (dynamicFires.length >= maxFires) return;

    const position = generateRandomPosition();
    const intensity = Math.random() * 0.8 + 0.2; // 0.2 to 1.0

    const newHazard: HazardState = {
      id: `random-fire-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: HazardType.ClassAFire,
      position: { x: position[0], y: position[1], z: position[2] },
      isActive: true,
      severity: intensity,
      isSmoking: intensity > 1.0,
      isExtinguished: false,
    };
    addHazard(newHazard);
  }, [addHazard, generateRandomPosition, maxFires]);

  // Spawn timer
  useEffect(() => {
    const spawnTimer = setInterval(() => {
      if (Math.random() < spawnChance) {
        spawnFire();
      }
    }, spawnInterval);

    return () => clearInterval(spawnTimer);
  }, [spawnFire, spawnInterval, spawnChance]);

  // Rendering is handled by the main Level/Hazard system via the global store
  return null;
}

