import { useState, useEffect, useCallback } from 'react';
import Fire from './Fire';

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
  mapBounds = {
    minX: -8,
    maxX: 8,
    minZ: -8,
    maxZ: 8,
    y: 0.1
  }
}: RandomFireSpawnerProps) {
  const [fires, setFires] = useState<FireSpawn[]>([]);

  // Generate random position within map bounds
  const generateRandomPosition = useCallback((): [number, number, number] => {
    const x = Math.random() * (mapBounds.maxX - mapBounds.minX) + mapBounds.minX;
    const z = Math.random() * (mapBounds.maxZ - mapBounds.minZ) + mapBounds.minZ;
    return [x, mapBounds.y, z];
  }, [mapBounds]);

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
    console.log(`🔥 ${shape} fire spawned at [${position[0].toFixed(2)}, ${position[1].toFixed(2)}, ${position[2].toFixed(2)}]`);
  }, [fires.length, maxFires, generateRandomPosition, generateFireProperties]);

  // Extinguish a fire
  const extinguishFire = useCallback((fireId: string) => {
    setFires(prev => prev.map(fire => 
      fire.id === fireId ? { ...fire, isActive: false } : fire
    ));
    
    // Remove extinguished fire after animation
    setTimeout(() => {
      setFires(prev => prev.filter(fire => fire.id !== fireId));
    }, 2000);
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

