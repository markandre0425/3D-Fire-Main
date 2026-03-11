import { useMemo } from 'react';
import * as THREE from 'three';
import BillboardFire from './BillboardFire';
// import CartoonFire from './CartoonFire'; // Keep as backup, not currently used

type FireShape = 'wide' | 'chaotic' | 'triangular';

interface FireProps {
  position: [number, number, number];
  size?: number;
  intensity?: number;
  isActive?: boolean;
  shape?: FireShape;
}

// Helper function to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// A simple billboard on the floor to fake light casting
function FakeGlow({ size, color }: { size: number; color: string }) {
  // Create a simple soft glow texture
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    // Create radial gradient from center (bright) to edge (transparent)
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    const rgb = hexToRgb(color);
    if (rgb) {
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`);
      gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [color]);

  if (!glowTexture) return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      {/* Slightly smaller glow to reduce overdraw */}
      <planeGeometry args={[size * 2.5, size * 2.5]} />
      <meshBasicMaterial
        map={glowTexture}
        transparent={true}
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function Fire({
  position,
  size = 1,
  intensity = 1,
  isActive = true,
  shape = 'triangular',
}: FireProps) {
  if (!isActive) return null;

  return (
    <group position={position}>
      {/* 1. The Fire (Optimized: Single Layer with integrated smoke) */}
      <BillboardFire
        position={[0, 0, 0]}
        size={size}
        intensity={intensity}
        isActive={isActive}
        shape={shape}
      />

      {/* 2. Fake Light - looks like fire is lighting the ground */}
      <FakeGlow size={size} color="#ffaa00" />
    </group>
  );
}
