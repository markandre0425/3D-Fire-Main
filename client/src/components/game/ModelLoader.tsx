import { useRef, useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { BoundingBox } from '../../lib/collision';

interface ModelLoaderProps {
  modelPath: string;
  position: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onBoundingBoxReady?: (box: BoundingBox) => void;
}

export default function ModelLoader({
  modelPath,
  position,
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true,
  onLoad,
  onError,
  onBoundingBoxReady
}: ModelLoaderProps) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const loader = new GLTFLoader();

    loader.load(
      modelPath,
      (gltf: GLTF) => {
        const loadedModel = gltf.scene;

        loadedModel.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }
        });

        setModel(loadedModel);
        setLoading(false);
        onLoad?.();
      },
      (progress: ProgressEvent<EventTarget>) => {
        // Optional progress handling
      },
      (event: unknown) => {
        const normalizedError =
          event instanceof Error
            ? event
            : new Error(
                typeof event === 'object' && event && 'message' in event
                  ? String((event as { message?: string }).message)
                  : 'Failed to load model'
              );

        console.error(`Error loading model ${modelPath}:`, event);
        setError(normalizedError.message);
        setLoading(false);
        onError?.(normalizedError);
      }
    );
  }, [modelPath, castShadow, receiveShadow, onLoad, onError]);

  useEffect(() => {
    if (!modelRef.current || !onBoundingBoxReady) return;

    modelRef.current.updateMatrixWorld(true);
    const boundingBox = new THREE.Box3().setFromObject(modelRef.current);
    onBoundingBoxReady({
      min: boundingBox.min.clone(),
      max: boundingBox.max.clone()
    });
  }, [
    model,
    onBoundingBoxReady,
    position[0],
    position[1],
    position[2],
    rotation[0],
    rotation[1],
    rotation[2],
    scale[0],
    scale[1],
    scale[2]
  ]);

  if (loading) {
    return (
      <mesh position={position}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    );
  }

  if (error) {
    console.error(`ModelLoader error for ${modelPath}:`, error);
    return (
      <group position={position}>
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
      </group>
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
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  );
}