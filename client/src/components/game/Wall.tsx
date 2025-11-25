import { useRef, useEffect } from "react";
import { useTexture } from "@react-three/drei";
import { Mesh, RepeatWrapping, Vector3 } from "three";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { createBoundingBox } from "@/lib/collision";

interface WallProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export default function Wall({ position, rotation, scale }: WallProps) {
  const meshRef = useRef<Mesh>(null);
  const addCollidable = useFireSafety((state) => state.addCollidable);

  useEffect(() => {
    if (meshRef.current) {
      const boundingBox = createBoundingBox(
        new Vector3(...position),
        new Vector3(...scale),
        new THREE.Euler(...rotation)
      );
      addCollidable(boundingBox);
    }
  }, [addCollidable]);
  
  // Load wall texture
  const texture = useTexture("/textures/asphalt.png");
  
  // Configure the texture
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(2, 1);
  
  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      rotation={rotation} 
      receiveShadow
      castShadow
    >
      <boxGeometry args={scale} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
