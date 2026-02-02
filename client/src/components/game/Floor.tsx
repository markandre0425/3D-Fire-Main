import { useRef, useMemo } from "react";
import { DoubleSide, Mesh, RepeatWrapping } from "three";
import { useTexture } from "@react-three/drei";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { Level } from "@/lib/types";

export default function Floor() {
  const meshRef = useRef<Mesh>(null);
  const { currentLevel } = useFireSafety();
  
  // Get floor size based on current level (matching the 2x scaled rooms)
  const getFloorSize = () => {
    switch (currentLevel) {
      case Level.Kitchen:
      case Level.LivingRoom:
      case Level.Garage:
      case Level.BasicTraining:
        return 20; // 20x20 rooms
      default:
        return 20;
    }
  };
  
  const floorSize = getFloorSize();
  
  // Load base texture
  const textureBase = useTexture("/textures/wood.jpg");
  
  // Clone texture to avoid shared state issues between levels
  const texture = useMemo(() => {
    const tex = textureBase.clone();
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(floorSize / 2.5, floorSize / 2.5); // Scale texture repeat with room size
    tex.needsUpdate = true;
    return tex;
  }, [textureBase, floorSize]);
  
  return (
    <mesh 
      ref={meshRef} 
      position={[0, 0, 0]} 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[floorSize, floorSize]} />
      <meshStandardMaterial map={texture} side={DoubleSide} />
    </mesh>
  );
}
