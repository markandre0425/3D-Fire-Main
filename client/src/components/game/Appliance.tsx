import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HazardState } from '@/lib/types';
import Fire from './Fire';
import ModelLoader from './ModelLoader';

interface ApplianceProps {
  hazard: HazardState;
}

export default function Appliance({ hazard }: ApplianceProps) {
  const applianceRef = useRef<THREE.Group>(null);

  // Get appliance properties based on hazard ID
  const getApplianceProperties = () => {
    const id = hazard.id.toLowerCase();
    
    // Helper function to check if ID contains any of the appliance keywords
    const containsAppliance = (keywords: string[]) => {
      return keywords.some(keyword => id.includes(keyword));
    };
    
    if (containsAppliance(['microwave'])) {
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.8, 0.8, 0.8] as [number, number, number],
        position: [0, 0, 0] as [number, number, number],
        fireSize: 0.4,
        fireIntensity: 1.2
      };
    }
    
    if (containsAppliance(['toaster'])) {
      return {
        modelPath: '/models/simple_wood.glb',
        scale: [0.6, 0.6, 0.6] as [number, number, number],
        position: [0, 0, 0] as [number, number, number],
        fireSize: 0.3,
        fireIntensity: 1.0
      };
    }
    
    if (containsAppliance(['coffee', 'coffee-maker'])) {
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.7, 0.7, 0.7] as [number, number, number],
        position: [0, 0, 0] as [number, number, number],
        fireSize: 0.35,
        fireIntensity: 1.1
      };
    }
    
    if (containsAppliance(['tv', 'television'])) {
      return {
        modelPath: '/models/simple_wood.glb',
        scale: [1.0, 1.0, 1.0] as [number, number, number],
        position: [0, 0, 0] as [number, number, number],
        fireSize: 0.6,
        fireIntensity: 1.3
      };
    }
    
    if (containsAppliance(['laptop'])) {
      return {
        modelPath: '/models/simple_wood.glb',
        scale: [0.5, 0.5, 0.5] as [number, number, number],
        position: [0, 0, 0] as [number, number, number],
        fireSize: 0.25,
        fireIntensity: 0.9
      };
    }
    
    if (containsAppliance(['space-heater', 'spaceheater', 'lamp', 'printer', 'projector', 'vending', 'vending-machine', 'file-cabinet', 'filecabinet', 'conveyor', 'conveyor-belt', 'hydraulic', 'hydraulic-press', 'welding', 'welding-station', 'forklift', 'compressor', 'generator'])) {
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.8, 0.8, 0.8] as [number, number, number],
        position: [0, 0, 0] as [number, number, number],
        fireSize: 0.5,
        fireIntensity: 1.3
      };
    }
    
    // All appliances use simple_wood.glb
    if (containsAppliance(['meat-grinder', 'meat_grinder', 'simple-wood', 'simple_wood', 'wooden-tabouret', 'wooden_tabouret'])) {
      return {
        modelPath: '/models/simple_wood.glb',
        scale: [0.6, 0.6, 0.6] as [number, number, number],
        position: [0, 0, 0] as [number, number, number],
        fireSize: 0.4,
        fireIntensity: 1.1
      };
    }
    
    // Default appliance (fallback to basic geometry)
    return {
      modelPath: null,
      scale: [1, 1, 1] as [number, number, number],
      position: [0, 0, 0] as [number, number, number],
      fireSize: 0.4,
      fireIntensity: 1.0
    };
  };

  const applianceProps = getApplianceProperties();

  // Appliances are now positioned statically on surfaces

  return (
    <group
      ref={applianceRef}
      position={[hazard.position.x, hazard.position.y + applianceProps.position[1], hazard.position.z]}
      scale={applianceProps.scale}
    >
      {/* Render 3D model if available, otherwise fallback to basic geometry */}
      {applianceProps.modelPath ? (
        <ModelLoader
          modelPath={applianceProps.modelPath}
          position={[0, 0, 0]}
          scale={[1, 1, 1]}
          castShadow={true}
          receiveShadow={true}
          onError={() => {
            console.warn(`Failed to load model: ${applianceProps.modelPath}, falling back to basic geometry`);
          }}
        />
      ) : (
        // Fallback to basic geometry
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.3, 0.5]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
      )}
      
      {/* Main fire effect on top of appliance */}
      <Fire
        position={[0, applianceProps.position[1] + 0.3, 0]}
        size={applianceProps.fireSize}
        intensity={applianceProps.fireIntensity}
        isActive={hazard.isActive && !hazard.isExtinguished}
        shape="triangular"
      />
    </group>
  );
}
