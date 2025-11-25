import { useRef, useEffect, useCallback } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { createBoundingBox } from "../../lib/collision";

interface WallProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export default function Wall({ position, rotation, scale }: WallProps) {
  const addCollidable = useFireSafety((state) => state.addCollidable);
  const collidableGeneration = useFireSafety((state) => state.collidableGeneration);
  const storedBoundingBox = useRef<THREE.Box3 | null>(null);
  const lastRegisteredGeneration = useRef<number>(-1);
  const collidableGenerationRef = useRef(collidableGeneration);

  const [px, py, pz] = position;
  const [rx, ry, rz] = rotation;
  const [sx, sy, sz] = scale;

  useEffect(() => {
    collidableGenerationRef.current = collidableGeneration;
  }, [collidableGeneration]);

  const registerBoundingBox = useCallback(() => {
    const boundingBox = createBoundingBox(
      new THREE.Vector3(px, py, pz),
      new THREE.Vector3(sx, sy, sz),
      new THREE.Euler(rx, ry, rz)
    );
    const clonedBox = new THREE.Box3(boundingBox.min.clone(), boundingBox.max.clone());
    storedBoundingBox.current = clonedBox;
    lastRegisteredGeneration.current = collidableGenerationRef.current;
    addCollidable({
      min: clonedBox.min.clone(),
      max: clonedBox.max.clone()
    });
  }, [addCollidable, px, py, pz, rx, ry, rz, sx, sy, sz]);

  useEffect(() => {
    registerBoundingBox();
  }, [registerBoundingBox]);

  useEffect(() => {
    if (!storedBoundingBox.current) return;
    if (lastRegisteredGeneration.current === collidableGeneration) return;

    lastRegisteredGeneration.current = collidableGeneration;
    addCollidable({
      min: storedBoundingBox.current.min.clone(),
      max: storedBoundingBox.current.max.clone()
    });
  }, [addCollidable, collidableGeneration]);
  
  // Load wall texture
  const texture = useTexture("/textures/asphalt.png");
  
  // Configure the texture
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  
  return (
    <mesh 
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