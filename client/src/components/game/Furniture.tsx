import { useEffect } from "react";
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
  const addCollidable = useFireSafety((state) => state.addCollidable);
  const collidableGeneration = useFireSafety((state) => state.collidableGeneration);

  useEffect(() => {
    const rotationEuler = new THREE.Euler(...rotation);
    const basePosition = new THREE.Vector3(...position);
    const quaternion = new THREE.Quaternion().setFromEuler(rotationEuler);

    const registerBox = (localCenter: THREE.Vector3, size: THREE.Vector3) => {
      const worldCenter = basePosition.clone().add(localCenter.clone().applyQuaternion(quaternion));
      const boundingBox = createBoundingBox(worldCenter, size, rotationEuler);
      addCollidable(boundingBox);
    };

    if (type === "minimal_bathroom") {
      const wallThickness = 0.1;
      const width = scale[0];
      const height = scale[1];
      const depth = scale[2];
      const gapWidth = Math.min(width * 0.4, 2);
      const segmentWidth = Math.max((width - gapWidth) / 2, wallThickness * 2);
      const backOffset = depth / 2 - wallThickness / 2;

      registerBox(
        new THREE.Vector3(-(gapWidth / 2 + segmentWidth / 2), height / 2, -backOffset),
        new THREE.Vector3(segmentWidth, height, wallThickness)
      );
      registerBox(
        new THREE.Vector3(gapWidth / 2 + segmentWidth / 2, height / 2, -backOffset),
        new THREE.Vector3(segmentWidth, height, wallThickness)
      );
      registerBox(
        new THREE.Vector3(width / 2, height / 2, 0),
        new THREE.Vector3(wallThickness, height, depth)
      );

      // Bathtub
      registerBox(
        new THREE.Vector3(4.5, -0.5, 1.5),
        new THREE.Vector3(2.5, 1, 1.5)
      );

      // Toilet
      registerBox(
        new THREE.Vector3(4.5, -0.4, -1.5),
        new THREE.Vector3(0.7, 1.4, 0.8)
      );

      // Washing machines
      registerBox(
        new THREE.Vector3(-5, -0.25, -1.5),
        new THREE.Vector3(1.2, 1.5, 1.2)
      );
      registerBox(
        new THREE.Vector3(-3.5, -0.25, -1.5),
        new THREE.Vector3(1.2, 1.5, 1.2)
      );
      registerBox(
        new THREE.Vector3(-2, -0.25, -1.5),
        new THREE.Vector3(1.2, 1.5, 1.2)
      );

      // Shower stall remains decorative; no collider to keep doorway open
    } else if (type === "curvedTV") {
      const colliderHeight = scale[1] * 0.4;
      registerBox(
        new THREE.Vector3(0, colliderHeight / 2, 0),
        new THREE.Vector3(scale[0] * 0.8, colliderHeight, scale[2] * 0.4)
      );
    } else if (type === "gas_stove") {
      const stoveHeight = scale[1] * 0.6;
      registerBox(
        new THREE.Vector3(0, stoveHeight / 2 + 0.2, 0),
        new THREE.Vector3(scale[0], stoveHeight, scale[2] * 0.9)
      );
    } else {
      registerBox(
        new THREE.Vector3(0, scale[1] / 2, 0),
        new THREE.Vector3(...scale)
      );
    }
  }, [addCollidable, position, rotation, scale, type, collidableGeneration]);
  
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
          position={[4.5, 0, 1.5]}
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