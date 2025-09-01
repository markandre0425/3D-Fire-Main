import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Fire as WolffoFire } from '@wolffo/three-fire';

interface FireProps {
  position: [number, number, number];
  size?: number;
  intensity?: number;
  isActive?: boolean;
}

export default function Fire({
  position,
  size = 1,
  intensity = 1,
  isActive = true
}: FireProps) {
  const fireRef = useRef<THREE.Group>(null);

  // Animate the fire
  useFrame(() => {
    if (!isActive || !fireRef.current) return;

    const time = Date.now() * 0.001;

    // Dynamic flickering effect
    const flicker = 1 + Math.sin(time * 3) * 0.2 * intensity;
    fireRef.current.scale.y = size * 2 * flicker;

    // Gentle swaying motion
    fireRef.current.rotation.z = Math.sin(time * 1.5) * 0.08;

    // Slight rotation for dynamic effect
    fireRef.current.rotation.y = Math.sin(time * 0.8) * 0.05;

    // Scale variation based on intensity
    const scaleVariation = 1 + Math.sin(time * 2) * 0.1 * intensity;
    fireRef.current.scale.x = size * scaleVariation;
    fireRef.current.scale.z = size * scaleVariation;
  });

  if (!isActive) return null;

  return (
    <group
      ref={fireRef}
      position={position}
      scale={[size, size * 2, size]}
    >
      <WolffoFire
        texture="/fire.gif"
        color={new THREE.Color(0xffffff)}
        iterations={Math.floor(intensity * 20) + 10} // 10-30 based on intensity
        octaves={3}
        noiseScale={[1, 2, 1, 0.3]}
        magnitude={1.3 * intensity}
        lacunarity={2}
        gain={0.5}
        autoUpdate={true}
      />
    </group>
  );
}
