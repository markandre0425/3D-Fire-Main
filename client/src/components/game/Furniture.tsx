import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import ModelLoader from "./ModelLoader";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { createBoundingBox } from "../../lib/collision";

interface FurnitureProps {
  type: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number, number];
}

export default function Furniture({ 
  type, 
  position, 
  rotation = [0, 0, 0], 
  scale 
}: FurnitureProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const addCollidable = useFireSafety((state) => state.addCollidable);

  useEffect(() => {
    // We use the meshRef to signal that this is a collidable object.
    // ModelLoader doesn't forward the ref, so those won't have bounding boxes yet.
    // This is a limitation we can address later if needed.
    if (meshRef.current) {
      const boundingBox = createBoundingBox(
        new THREE.Vector3(...position),
        new THREE.Vector3(...scale),
        new THREE.Euler(...rotation)
      );
      addCollidable(boundingBox);
    }
  }, []);
  
  // Special handling for bathroom cubicle
  if (type === "minimal_bathroom") {
    const wallThickness = 0.1;
    const width = scale[0];
    const height = scale[1];
    const depth = scale[2];
    const gapWidth = Math.min(width * 0.4, 2);
    const segmentWidth = Math.max((width - gapWidth) / 2, wallThickness * 2);
    const backOffset = depth / 2 - wallThickness / 2;
    
    return (
        <group position={position} rotation={rotation}>
        {/* Back wall segments with center opening */}
        <mesh castShadow receiveShadow position={[-(gapWidth / 2 + segmentWidth / 2), height / 2, -backOffset]}>
          <boxGeometry args={[segmentWidth, height, wallThickness]} />
          <meshStandardMaterial color="#E0E0E0" />
        </mesh>
        <mesh castShadow receiveShadow position={[(gapWidth / 2 + segmentWidth / 2), height / 2, -backOffset]}>
          <boxGeometry args={[segmentWidth, height, wallThickness]} />
          <meshStandardMaterial color="#E0E0E0" />
        </mesh>
        
        {/* Right wall */}
        <mesh castShadow receiveShadow position={[width / 2, height / 2, 0]}>
          <boxGeometry args={[wallThickness, height, depth]} />
          <meshStandardMaterial color="#E0E0E0" />
        </mesh>
        
        <ModelLoader
          modelPath="/models/bathtub.glb"
          position={[4.5, 0.4, 1.5]}
          rotation={[0, Math.PI, 0]}
          scale={[1.2, 1.2, 1.2]}
        />
        <ModelLoader
          modelPath="/models/toilet.glb"
          position={[width / 2 - wallThickness * 8, 0, -1]}
          rotation={[0, Math.PI/ -2, 0]}
          scale={[1.2, 1.2, 1.2]}
        />
        <ModelLoader
          modelPath="/models/shower.glb"
          position={[0, 0.4, depth / 2 - wallThickness * 2]}
          rotation={[0, Math.PI, 0]}
          scale={[1.8, 1.8, 1.8]}
        />
        <ModelLoader
          modelPath="/models/washing_machine.glb"
          position={[-width / 2 + wallThickness * 5, 0.5, depth / -3]}
          rotation={[0, -Math.PI / -1, 0]}
          scale={[0.3, 0.3, 0.3]}
        />
        <ModelLoader
          modelPath="/models/washing_machine.glb"
          position={[-width / 2 + wallThickness * 7, 0.5, depth / 3]}
          rotation={[0, -Math.PI / -1, 0]}
          scale={[0.3, 0.3, 0.3]}
        />
        <ModelLoader
          modelPath="/models/washing_machine.glb"
          position={[-width / 2 + wallThickness * 6, 0.5, 0]}
          rotation={[0, -Math.PI / -1, 0]}
          scale={[0.3, 0.3, 0.3]}
        />
      </group>
    );
  }
  
  // Get 3D model path (for furniture with actual models)
  const getModelPath = () => {
    switch (type) {
      // Kitchen appliances
      case "gas_stove":
        return "/models/gas_stove.glb";
      case "kitchen_exhaust":
        return "/models/kitchen_exhaust.glb";
      case "fridge":
        return "/models/fridge.glb";
      case "retro_fridge":
        return "/models/retro_fridge.glb";
      case "sink_with_faucet":
        return "/models/sink_with_faucet.glb";
      case "small_kitchen_with_oven":
        return "/models/small_kitchen_with_oven.glb";
      
      // Sofa model
      case "sofa":
      case "office_sofa":
        return "/models/office_sofa.glb";
      
      // Table model
      case "table":
        return "/models/table.glb";
      
      // TV model
      case "curvedTV":
        return "/models/curvedTV.glb";
      
      // Generic wooden furniture uses simple_wood.glb
      case "counter":
      case "bed":
      case "stool":
      case "dresser":
        return "/models/simple_wood.glb";
      
      // No model available - will use colored box geometry
      default:
        return null;
    }
  };
  
  // Get texture (for furniture without 3D models - use box geometry)
  const getTextureUrl = () => {
    return "/textures/wood.jpg";
  };
  
  const modelPath = getModelPath();
  
  // IMPORTANT: Call ALL hooks at the top before any conditional returns!
  // This prevents "Rendered fewer hooks than expected" error
  const texture = useTexture(getTextureUrl());
  
  // If we have a 3D model, use ModelLoader
  if (modelPath) {
    return (
      <ModelLoader 
        modelPath={modelPath}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    );
  }
  
  // Otherwise, use box geometry with texture (fallback)
  
  const getColor = () => {
    switch (type) {
      case "sofa":
        return "#3498DB";
      case "bed":
        return "#9B59B6";
      case "dresser":
        return "#8B4513";
      case "counter":
        return "#D35400";
      default:
        return "#A0522D";
    }
  };
  
  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      rotation={rotation}
      castShadow 
      receiveShadow
    >
      <boxGeometry args={scale} />
      <meshStandardMaterial map={texture} color={getColor()} />
    </mesh>
  );
}