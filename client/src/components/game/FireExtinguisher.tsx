import { useRef, useState, useEffect, Suspense } from "react";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { InteractiveObject } from "@/lib/types";
import { useFireSafety } from "@/lib/stores/useFireSafety";

useGLTF.preload('/models/fire_extinguisher.glb');

interface FireExtinguisherProps {
  object: InteractiveObject;
  isCollected: boolean;
}

export default function FireExtinguisher({ object, isCollected }: FireExtinguisherProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const { isPaused, isLevelComplete } = useFireSafety();
  
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
  
  // No animation - fire extinguishers are wall-mounted and static
  // useFrame is removed to prevent spinning/hovering
  
  // Don't render if already collected
  if (isCollected) return null;

  // Determine rotation based on wall position (similar to GasMaskPickup)
  const isOnWestWall = Math.abs(object.position.x - (-10)) < 0.5;
  const isOnEastWall = Math.abs(object.position.x - 10) < 0.5;
  const isOnNorthWall = Math.abs(object.position.z - (-10)) < 0.5;
  const isOnSouthWall = Math.abs(object.position.z - 10) < 0.5;

  let rotation: [number, number, number] = [0, 0, 0]; // Default rotation (upright)
  if (isOnWestWall) {
    rotation = [0, Math.PI / 2, 0]; // Face east (toward center)
  } else if (isOnEastWall) {
    rotation = [0, -Math.PI / 2, 0]; // Face west (toward center)
  } else if (isOnNorthWall) {
    rotation = [0, Math.PI, 0]; // Face south (toward center)
  } else if (isOnSouthWall) {
    rotation = [0, 0, 0]; // Face north (toward center)
  }

  // Position HUD slightly above and in front of the model to avoid clipping
  // Adjust label position if wall-mounted
  let labelPosition: [number, number, number] = [0, 1.35, 0.2];
  if (isOnWestWall) {
    labelPosition = [0.2, 1.35, 0]; // Move label slightly to the right (east)
  } else if (isOnEastWall) {
    labelPosition = [-0.2, 1.35, 0]; // Move label slightly to the left (west)
  } else if (isOnNorthWall) {
    labelPosition = [0, 1.35, 0.2]; // Move label slightly forward (south)
  } else if (isOnSouthWall) {
    labelPosition = [0, 1.35, -0.2]; // Move label slightly backward (north)
  }
  
  return (
    <group
      ref={groupRef}
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={rotation}
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
            Fire Extinguisher
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
