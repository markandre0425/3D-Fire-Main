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
    
    console.log(`🔍 Appliance component checking hazard ID: "${id}"`);
    
    // Helper function to check if ID contains any of the appliance keywords
    const containsAppliance = (keywords: string[]) => {
      return keywords.some(keyword => id.includes(keyword));
    };
    
    if (containsAppliance(['microwave'])) {
      console.log(`✅ Found microwave appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.8, 0.8, 0.8] as [number, number, number],
        position: [0, 0.2, 0] as [number, number, number],
        fireSize: 0.4,
        fireIntensity: 1.2
      };
    }
    
    if (containsAppliance(['toaster'])) {
      console.log(`✅ Found toaster appliance for hazard: ${id}`);
      return {
        modelPath: '/models/toaster.glb',
        scale: [0.6, 0.6, 0.6] as [number, number, number],
        position: [0, 0.1, 0] as [number, number, number],
        fireSize: 0.3,
        fireIntensity: 1.0
      };
    }
    
    if (containsAppliance(['coffee', 'coffee-maker'])) {
      console.log(`✅ Found coffee machine appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.7, 0.7, 0.7] as [number, number, number],
        position: [0, 0.25, 0] as [number, number, number],
        fireSize: 0.35,
        fireIntensity: 1.1
      };
    }
    
    if (containsAppliance(['tv', 'television'])) {
      console.log(`✅ Found TV appliance for hazard: ${id}`);
      return {
        modelPath: '/models/tv.glb',
        scale: [1.0, 1.0, 1.0] as [number, number, number],
        position: [0, 0.35, 0] as [number, number, number],
        fireSize: 0.6,
        fireIntensity: 1.3
      };
    }
    
    if (containsAppliance(['laptop'])) {
      console.log(`✅ Found laptop appliance for hazard: ${id}`);
      return {
        modelPath: '/models/laptop.glb',
        scale: [0.5, 0.5, 0.5] as [number, number, number],
        position: [0, 0.025, 0] as [number, number, number],
        fireSize: 0.25,
        fireIntensity: 0.9
      };
    }
    
    if (containsAppliance(['space-heater', 'spaceheater'])) {
      console.log(`✅ Found space heater appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.6, 0.6, 0.6] as [number, number, number],
        position: [0, 0.2, 0] as [number, number, number],
        fireSize: 0.5,
        fireIntensity: 1.4
      };
    }
    
    if (containsAppliance(['lamp'])) {
      console.log(`✅ Found lamp appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.4, 0.4, 0.4] as [number, number, number],
        position: [0, 0.15, 0] as [number, number, number],
        fireSize: 0.2,
        fireIntensity: 0.8
      };
    }
    
    if (containsAppliance(['printer'])) {
      console.log(`✅ Found printer appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.7, 0.7, 0.7] as [number, number, number],
        position: [0, 0.15, 0] as [number, number, number],
        fireSize: 0.4,
        fireIntensity: 1.2
      };
    }
    
    if (containsAppliance(['projector'])) {
      console.log(`✅ Found projector appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.5, 0.5, 0.5] as [number, number, number],
        position: [0, 0.1, 0] as [number, number, number],
        fireSize: 0.3,
        fireIntensity: 1.0
      };
    }
    
    if (containsAppliance(['vending', 'vending-machine'])) {
      console.log(`✅ Found vending machine appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [1.2, 1.2, 1.2] as [number, number, number],
        position: [0, 0.75, 0] as [number, number, number],
        fireSize: 0.7,
        fireIntensity: 1.5
      };
    }
    
    if (containsAppliance(['file-cabinet', 'filecabinet'])) {
      console.log(`✅ Found file cabinet appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.8, 0.8, 0.8] as [number, number, number],
        position: [0, 0.6, 0] as [number, number, number],
        fireSize: 0.5,
        fireIntensity: 1.3
      };
    }
    
    if (containsAppliance(['conveyor', 'conveyor-belt'])) {
      console.log(`✅ Found conveyor belt appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [1.5, 1.5, 1.5] as [number, number, number],
        position: [0, 0.15, 0] as [number, number, number],
        fireSize: 0.8,
        fireIntensity: 1.6
      };
    }
    
    if (containsAppliance(['hydraulic', 'hydraulic-press'])) {
      console.log(`✅ Found hydraulic press appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.8, 0.8, 0.8] as [number, number, number],
        position: [0, 0.4, 0] as [number, number, number],
        fireSize: 0.6,
        fireIntensity: 1.4
      };
    }
    
    if (containsAppliance(['welding', 'welding-station'])) {
      console.log(`✅ Found welding station appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.7, 0.7, 0.7] as [number, number, number],
        position: [0, 0.15, 0] as [number, number, number],
        fireSize: 0.5,
        fireIntensity: 1.5
      };
    }
    
    if (containsAppliance(['forklift'])) {
      console.log(`✅ Found forklift appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [1.0, 1.0, 1.0] as [number, number, number],
        position: [0, 0.3, 0] as [number, number, number],
        fireSize: 0.6,
        fireIntensity: 1.4
      };
    }
    
    if (containsAppliance(['compressor'])) {
      console.log(`✅ Found compressor appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [0.6, 0.6, 0.6] as [number, number, number],
        position: [0, 0.3, 0] as [number, number, number],
        fireSize: 0.4,
        fireIntensity: 1.2
      };
    }
    
    if (containsAppliance(['generator'])) {
      console.log(`✅ Found generator appliance for hazard: ${id}`);
      return {
        modelPath: null, // Model not available, use fallback geometry
        scale: [1.0, 1.0, 1.0] as [number, number, number],
        position: [0, 0.4, 0] as [number, number, number],
        fireSize: 0.8,
        fireIntensity: 1.7
      };
    }
    
    // New models added
    if (containsAppliance(['meat-grinder', 'meat_grinder'])) {
      console.log(`✅ Found meat grinder appliance for hazard: ${id}`);
      return {
        modelPath: '/models/meat_grinder.glb',
        scale: [0.5, 0.5, 0.5] as [number, number, number],
        position: [0, 0.25, 0] as [number, number, number],
        fireSize: 0.3,
        fireIntensity: 1.1
      };
    }
    
    if (containsAppliance(['simple-wood', 'simple_wood'])) {
      console.log(`✅ Found simple wood appliance for hazard: ${id}`);
      return {
        modelPath: '/models/simple_wood.glb',
        scale: [0.8, 0.8, 0.8] as [number, number, number],
        position: [0, 0.4, 0] as [number, number, number],
        fireSize: 0.5,
        fireIntensity: 1.2
      };
    }
    
    if (containsAppliance(['wooden-tabouret', 'wooden_tabouret'])) {
      console.log(`✅ Found wooden tabouret appliance for hazard: ${id}`);
      return {
        modelPath: '/models/wooden_tabouret.glb',
        scale: [0.6, 0.6, 0.6] as [number, number, number],
        position: [0, 0.3, 0] as [number, number, number],
        fireSize: 0.4,
        fireIntensity: 1.0
      };
    }
    
    console.log(`❌ No appliance match found for hazard: ${id}, using fallback geometry`);
    // Default appliance (fallback to basic geometry)
    return {
      modelPath: null,
      scale: [1, 1, 1] as [number, number, number],
      position: [0, 0.15, 0] as [number, number, number],
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
      
      {/* Main fire effect on top of appliance - Traditional triangular flame */}
      <Fire
        position={[0, applianceProps.position[1] + 0.3, 0]}
        size={applianceProps.fireSize}
        intensity={applianceProps.fireIntensity}
        isActive={hazard.isActive && !hazard.isExtinguished}
        shape="triangular"
      />
      
      {/* Additional smaller fires around the appliance for realism */}
      {hazard.isActive && !hazard.isExtinguished && (
        <>
          {/* Side fire - Wide spreading fire */}
          <Fire
            position={[0.3, applianceProps.position[1] + 0.1, 0]}
            size={applianceProps.fireSize * 0.6}
            intensity={applianceProps.fireIntensity * 0.8}
            isActive={true}
            shape="wide"
          />
          
          {/* Opposite side fire - Chaotic wild fire */}
          <Fire
            position={[-0.3, applianceProps.position[1] + 0.1, 0]}
            size={applianceProps.fireSize * 0.6}
            intensity={applianceProps.fireIntensity * 0.8}
            isActive={true}
            shape="chaotic"
          />
          
          {/* Back fire - Wide spreading fire */}
          <Fire
            position={[0, applianceProps.position[1] + 0.1, 0.3]}
            size={applianceProps.fireSize * 0.5}
            intensity={applianceProps.fireIntensity * 0.7}
            isActive={true}
            shape="wide"
          />
        </>
      )}
    </group>
  );
}
