import { useRef } from "react";
import { DoubleSide, Mesh, RepeatWrapping, TextureLoader } from "three";
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
      case Level.Bedroom:
      case Level.BasicTraining:
        return 20; // 20x20 rooms
      case Level.FireClassification:
      case Level.EmergencyResponse:
        return 24; // 24x24 rooms
      case Level.AdvancedRescue:
        return 28; // 28x28 rooms
      case Level.BFPCertification:
        return 32; // 32x32 rooms
      default:
        return 20;
    }
  };
  
  // All levels use wood texture
  const texture = useTexture("/textures/wood.jpg");
  
  // Configure the texture with proper tiling based on room size
  const floorSize = getFloorSize();
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(floorSize / 2.5, floorSize / 2.5); // Scale texture repeat with room size
  
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
