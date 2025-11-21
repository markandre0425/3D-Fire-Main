import { useState, useEffect, useCallback } from 'react';
import Fire from './Fire';
import { EnvironmentObject } from '@/lib/types';

interface FireSpawn {
  id: string;
  position: [number, number, number];
  intensity: number;
  size: number;
  color: string;
  isActive: boolean;
  shape: 'wide' | 'chaotic' | 'triangular';
}

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
  const [fires, setFires] = useState<FireSpawn[]>([]);

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

  // Generate random fire properties
  const generateFireProperties = useCallback(() => {
    const intensity = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
    const size = Math.random() * 0.6 + 0.4; // 0.4 to 1.0
    
    // Random fire colors
    const colors = ['#FF4500', '#FF6347', '#FF8C00', '#FFA500', '#FF7F50'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Random fire shape
    const shapes: ('wide' | 'chaotic' | 'triangular')[] = ['wide', 'chaotic', 'triangular'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    return { intensity, size, color, shape };
  }, []);

  // Spawn a new fire
  const spawnFire = useCallback(() => {
    if (fires.length >= maxFires) return;
    
    const position = generateRandomPosition();
    const { intensity, size, color, shape } = generateFireProperties();
    
    const newFire: FireSpawn = {
      id: `fire-${Date.now()}-${Math.random()}`,
      position,
      intensity,
      size,
      color,
      isActive: true,
      shape
    };
    
    setFires(prev => [...prev, newFire]);
  }, [fires.length, maxFires, generateRandomPosition, generateFireProperties]);

  // Extinguish a fire
  const extinguishFire = useCallback((fireId: string) => {
    // Immediately remove fire - no explosion/dispersion effect
    setFires(prev => prev.filter(fire => fire.id !== fireId));
  }, []);

  // Spawn timer
  useEffect(() => {
    const spawnTimer = setInterval(() => {
      if (Math.random() < spawnChance) {
        spawnFire();
      }
    }, spawnInterval);

    return () => clearInterval(spawnTimer);
  }, [spawnFire, spawnInterval, spawnChance]);

  // Clean up fires that are too close to each other
  useEffect(() => {
    const minDistance = 2; // Minimum distance between fires
    
    setFires(prev => {
      const validFires = prev.filter((fire, index) => {
        for (let i = 0; i < index; i++) {
          const otherFire = prev[i];
          const distance = Math.sqrt(
            Math.pow(fire.position[0] - otherFire.position[0], 2) +
            Math.pow(fire.position[2] - otherFire.position[2], 2)
          );
          if (distance < minDistance) {
            return false;
          }
        }
        return true;
      });
      
      return validFires;
    });
  }, [fires]);

  return (
    <>
      {fires.map(fire => (
        <Fire
          key={fire.id}
          position={fire.position}
          size={fire.size}
          intensity={fire.intensity}
          isActive={fire.isActive}
          shape={fire.shape}
        />
      ))}
    </>
  );
}

