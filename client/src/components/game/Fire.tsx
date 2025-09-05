import { useRef, useMemo } from 'react';
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

  // Animate the fire
  useFrame(() => {
    if (!isActive || !fireRef.current) return;

    const time = Date.now() * 0.001;

    // Dynamic flickering effect
    const flicker = 1 + Math.sin(time * 3) * 0.2 * intensity;
    fireRef.current.scale.y = size * 2 * flicker;

    // Comment out or remove these lines to stop movement:
    // fireRef.current.rotation.z = Math.sin(time * 0.2) * 0.08;  // No more swaying
    // fireRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;  // No more spinning
    
    // Comment out or remove these lines to stop scale bouncing:
    // const scaleVariation = 1 + Math.sin(time * 2) * 0.1 * intensity;
    // fireRef.current.scale.x = size * scaleVariation;
    // fireRef.current.scale.z = size * scaleVariation;
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
        color={fireColor}
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
