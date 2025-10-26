import { useRef, useEffect, useState } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

interface ModelLoaderProps {
  modelPath: string;
  position: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export default function ModelLoader({
  modelPath,
  position,
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true,
  onLoad,
  onError
}: ModelLoaderProps) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    
    loader.load(
      modelPath,
      (gltf) => {
        const loadedModel = gltf.scene;
        
        // Apply shadows to all meshes in the model
        loadedModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }
        });
        
        setModel(loadedModel);
        setLoading(false);
        onLoad?.();
      },
      (progress) => {
        // Optional: Handle loading progress
      },
      (error) => {
        console.error('Error loading model:', error);
        setError(error.message);
        setLoading(false);
        onError?.(error);
      }
    );
  }, [modelPath, castShadow, receiveShadow, onLoad, onError]);

  // Optional: Add subtle animation
  useFrame(() => {
    if (modelRef.current && model) {
      // Very subtle floating effect
      const time = Date.now() * 0.001;
      modelRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.02;
    }
  });

  if (loading) {
    return (
      <mesh position={position}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    );
  }

  if (error) {
    return (
      <mesh position={position}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    );
  }

  if (!model) return null;

  return (
    <primitive
      ref={modelRef}
      object={model}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
}
