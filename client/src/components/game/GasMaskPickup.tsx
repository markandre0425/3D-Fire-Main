import { useRef, useState, useEffect, Suspense } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { InteractiveObject } from '@/lib/types';
import { useFireSafety } from '@/lib/stores/useFireSafety';

useGLTF.preload('/models/gasmask.glb');

interface GasMaskPickupProps {
  object: InteractiveObject;
  isCollected?: boolean;
  onCollect?: () => void;
}

export default function GasMaskPickup({ object, isCollected = false }: GasMaskPickupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const { isPaused, isLevelComplete } = useFireSafety();
  
  // Load the gas mask model
  const { scene: gasMaskModel } = useGLTF('/models/gasmask.glb') as GLTF & {
    scene: THREE.Group
  };
  
  // Update loading state and apply materials
  useEffect(() => {
    if (gasMaskModel) {
      gasMaskModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
      setModelLoaded(true);
    }
  }, [gasMaskModel]);

  // Don't render if already collected
  if (isCollected) return null;
  
  // Position HUD slightly above/in front of the model to avoid clipping
  const labelPosition: [number, number, number] = [0, 1.15, 0.18];
  
  return (
    <group
      ref={groupRef}
      position={[object.position.x, object.position.y, object.position.z]}
      scale={[0.5, 0.5, 0.5]}
    >
      {modelLoaded ? (
        <Suspense fallback={
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>
        }>
          <group rotation={[0, Math.PI / 2, 0]}>
            <primitive object={gasMaskModel.clone()} castShadow receiveShadow />
          </group>
        </Suspense>
      ) : (
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
      )}
      
      {/* HTML overlay labels - hide when paused or level complete */}
      {!isPaused && !isLevelComplete && (
        <Html
          position={labelPosition}
          center
          distanceFactor={8}
          occlude={false}
          zIndexRange={[1000, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
        <div style={{
          background: 'rgba(0, 0, 0, 0.75)',
          padding: '8px 16px',
          borderRadius: '8px',
          textAlign: 'center',
          minWidth: '150px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        }}>
          <div style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '4px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
          }}>
            Gas Mask
          </div>
          <div style={{
            color: '#FFD700',
            fontSize: '13px',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          }}>
            Press E to Collect
          </div>
        </div>
      </Html>
      )}
    </group>
  );
} 