import { useRef, Suspense } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { Group } from "three";
import { InteractiveObject } from "@/lib/types";
import { useFireSafety } from "@/lib/stores/useFireSafety";

interface ExitSignProps {
  object: InteractiveObject;
}

export default function ExitSign({ object }: ExitSignProps) {
  const groupRef = useRef<Group>(null);
  const { scene: exitModel } = useGLTF("/models/exit.glb");
  const { isPaused, isLevelComplete } = useFireSafety();
  
  // Snap position to nearest wall to prevent floating
  const getSnappedPosition = () => {
    const { x, y, z } = object.position;
    const threshold = 8;
    const wallLimit = 9.95; // Wall is at 10, thickness 0.1
    const groundLevel = -1.5; // Lowered to touch floor

    if (z > threshold) return [x, groundLevel, wallLimit];
    if (z < -threshold) return [x, groundLevel, -wallLimit];
    if (x > threshold) return [wallLimit, groundLevel, z];
    if (x < -threshold) return [-wallLimit, groundLevel, z];
    
    return [x, groundLevel, z];
  };

  return (
    <group 
      ref={groupRef}
      position={getSnappedPosition() as [number, number, number]}
      scale={[3, 2.5, 1]} // Adjusted height to fit wall
    >
      <Suspense fallback={
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.3, 0.05]} />
          <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={1.5} />
        </mesh>
      }>
        <group rotation={[0, -Math.PI / 2, 0]}>
          <primitive 
            object={exitModel.clone()} 
            castShadow 
            receiveShadow 
          />
        </group>
      </Suspense>

      {!isPaused && !isLevelComplete && (
        <Html
          position={[0, 2.2, 0]}
          center
          distanceFactor={12}
          occlude={false}
          zIndexRange={[1000, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.85)',
            padding: '8px 16px',
            borderRadius: '8px',
            textAlign: 'center',
            minWidth: '200px',
            border: '2px solid rgba(74, 222, 128, 0.5)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
          }}>
            <div style={{
              color: '#4ade80',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '4px',
              textShadow: '0 0 10px rgba(74, 222, 128, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              EXIT
            </div>
            <div style={{
              color: 'white',
              fontSize: '14px',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
            }}>
              Move to the next room when all dangers are gone
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
