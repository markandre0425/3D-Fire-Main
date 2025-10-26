import { useRef, useState, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { InteractiveObject } from "@/lib/types";

useGLTF.preload('/models/fire_extinguisher.glb');

interface FireExtinguisherProps {
  object: InteractiveObject;
  isCollected: boolean;
}

export default function FireExtinguisher({ object, isCollected }: FireExtinguisherProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // Load the model
  const { scene: extinguisherModel } = useGLTF('/models/fire_extinguisher.glb') as GLTF & {
    scene: THREE.Group
  };
  
  // Update loading state and apply materials
  useEffect(() => {
    if (extinguisherModel) {
      // Clone and traverse to ensure proper materials
      extinguisherModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Ensure material is visible
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
      setModelLoaded(true);
    }
  }, [extinguisherModel]);
  
  // Simple animation for the fire extinguisher
  useFrame((_, delta) => {
    if (!isCollected && groupRef.current) {
      // Make it hover slightly
      groupRef.current.position.y = object.position.y + Math.sin(Date.now() * 0.002) * 0.05;
      
      // Rotate slowly
      groupRef.current.rotation.y += delta * 0.5;
    }
  });
  
  // Don't render if already collected
  if (isCollected) return null;
  
  return (
    <group
      ref={groupRef}
      position={[object.position.x, object.position.y, object.position.z]}
      scale={[0.8, 0.8, 0.8]} // Proportional to character size (character is 0.5 scale, this is slightly bigger)
    >
      {modelLoaded ? (
        <Suspense fallback={
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
            <meshStandardMaterial color="#FF0000" />
          </mesh>
        }>
          <primitive object={extinguisherModel.clone()} castShadow receiveShadow />
        </Suspense>
      ) : (
        // Fallback while loading
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
      )}
    </group>
  );
}
