import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Fire as WolffoFire } from '@wolffo/three-fire';
import ParticleFire from './ParticleFire';

type FireShape = 'wide' | 'chaotic' | 'triangular';

interface FireProps {
  position: [number, number, number];
  size?: number;
  intensity?: number;
  isActive?: boolean;
  shape?: FireShape;
  useParticles?: boolean; // Toggle between particle and volumetric fire
}

export default function Fire({
  position,
  size = 1,
  intensity = 1,
  isActive = true,
  shape = 'triangular',
  useParticles = true // Default to particle system for better shape control
}: FireProps) {
  
  // If using particles, render the particle fire instead
  if (useParticles) {
    return (
      <ParticleFire
        position={position}
        size={size}
        intensity={intensity}
        isActive={isActive}
        shape={shape}
      />
    );
  }
  
  // Otherwise use the volumetric WolffoFire (will be circular)
  const fireRef = useRef<THREE.Group>(null);

  // Generate random fire color from orange to red
  const fireColor = useMemo(() => {
    const colors = [
      new THREE.Color(0xFF4500), // Orange Red
      new THREE.Color(0xFF6347), // Tomato
      new THREE.Color(0xFF7F50), // Coral
      new THREE.Color(0xFF8C00), // Dark Orange
      new THREE.Color(0xFFA500), // Orange
      new THREE.Color(0xFF6B35), // Red Orange
      new THREE.Color(0xFF4500), // Orange Red
      new THREE.Color(0xDC143C), // Crimson
      new THREE.Color(0xB22222), // Fire Brick
      new THREE.Color(0x8B0000), // Dark Red
    ];
    
    // Pick a random color from the array
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // Get shape-specific configuration
  const shapeConfig = useMemo(() => {
    switch (shape) {
      case 'wide':
        // Wide and Short (Spreading fire) - Much more dramatic
        return {
          scale: [size * 3, size * 0.5, size * 3] as [number, number, number],
          noiseScale: [3, 0.5, 3, 0.4] as [number, number, number, number],
          octaves: 4,
          magnitude: 1.0,
          lacunarity: 2.0,
          gain: 0.6
        };
      case 'chaotic':
        // Chaotic/Wild Fire - Irregular and turbulent
        return {
          scale: [size * 1.8, size * 1.5, size * 1.8] as [number, number, number],
          noiseScale: [2.5, 1.2, 2.5, 0.7] as [number, number, number, number],
          octaves: 6,
          magnitude: 2.2,
          lacunarity: 3.5,
          gain: 1.5
        };
      case 'triangular':
      default:
        // Triangular/Pointed (Traditional flame) - Tall and narrow
        return {
          scale: [size * 0.6, size * 3, size * 0.6] as [number, number, number],
          noiseScale: [0.4, 4, 0.4, 0.15] as [number, number, number, number],
          octaves: 3,
          magnitude: 2.5,
          lacunarity: 3.5,
          gain: 1.0
        };
    }
  }, [shape, size]);

  // Animate the fire with subtle pulsing (no floating)
  useFrame(() => {
    if (!isActive || !fireRef.current) return;

    const time = Date.now() * 0.001;

    // Subtle pulsing effect on all axes
    const pulse = 1 + Math.sin(time * 1.5) * 0.04 * intensity;
    const [scaleX, scaleY, scaleZ] = shapeConfig.scale;
    fireRef.current.scale.set(scaleX * pulse, scaleY * pulse, scaleZ * pulse);
  });

  if (!isActive) return null;

  return (
    <group
      ref={fireRef}
      position={position}
    >
      {/* Apply shape-specific scaling to the fire container */}
      <group scale={shapeConfig.scale}>
        <WolffoFire
          texture=""
          color={fireColor}
          iterations={Math.floor(intensity * 20) + 10} // 10-30 based on intensity
          octaves={shapeConfig.octaves}
          noiseScale={shapeConfig.noiseScale}
          magnitude={shapeConfig.magnitude * intensity}
          lacunarity={shapeConfig.lacunarity}
          gain={shapeConfig.gain}
          autoUpdate={true}
        />
      </group>
    </group>
  );
}
