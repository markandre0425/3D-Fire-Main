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
  
  // Determine rotation based on wall position
  // If on west wall (x close to -10), face east (toward center)
  // If on east wall (x close to 10), face west (toward center)
  // If on north wall (z close to -10), face south (toward center)
  // If on south wall (z close to 10), face north (toward center)
  // Otherwise use default rotation
  const isOnWestWall = Math.abs(object.position.x - (-10)) < 0.5;
  const isOnEastWall = Math.abs(object.position.x - 10) < 0.5;
  const isOnNorthWall = Math.abs(object.position.z - (-10)) < 0.5;
  const isOnSouthWall = Math.abs(object.position.z - 10) < 0.5;
  
  let rotation: [number, number, number] = [0, Math.PI / 2, 0]; // Default rotation
  if (isOnWestWall) {
    rotation = [0, Math.PI / 2, 0]; // Face south (rotated 90 degrees)
  } else if (isOnEastWall) {
    rotation = [0, Math.PI, 0]; // Face west (toward center)
  } else if (isOnNorthWall) {
    rotation = [0, Math.PI / 2, 0]; // Face south (toward center)
  } else if (isOnSouthWall) {
    rotation = [0, -Math.PI / 2, 0]; // Face north (toward center)
  }
  
  // Position HUD slightly above/in front of the model to avoid clipping
  // Adjust label position based on wall orientation
  let labelPosition: [number, number, number] = [0, 1.15, 0.18];
  if (isOnWestWall) {
    labelPosition = [0.2, 1.15, 0]; // In front (east) when on west wall
  } else if (isOnEastWall) {
    labelPosition = [-0.2, 1.15, 0]; // In front (west) when on east wall
  } else if (isOnNorthWall) {
    labelPosition = [0, 1.15, 0.2]; // In front (south) when on north wall
  } else if (isOnSouthWall) {
    labelPosition = [0, 1.15, -0.2]; // In front (north) when on south wall
  }
  
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
          <group rotation={rotation}>
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