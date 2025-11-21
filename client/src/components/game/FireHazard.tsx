import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HazardState, HazardType } from "@/lib/types";
import { GAME_CONSTANTS } from "@/lib/constants";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import Fire from "./Fire";

interface FireHazardProps {
  hazard: HazardState;
}

export default function FireHazard({ hazard }: FireHazardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sparkGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const sparkPositionsRef = useRef<Float32Array | null>(null);
  const sparkVelocitiesRef = useRef<Float32Array | null>(null);
  
  const { updateHazard } = useFireSafety();
  
  // Check if this hazard should use the new fire system
  const shouldUseNewFire = hazard.type === HazardType.Fireplace || 
                          hazard.type === HazardType.StoveTop ||
                          hazard.type === HazardType.Candle ||
                          hazard.type === HazardType.SpacerHeater ||
                          hazard.type === HazardType.CloggedDryer;
  
  // Generate random particles for spark effects (only for non-fire hazards)
  const numParticles = useMemo(() => {
    if (shouldUseNewFire) return 0;
    return Math.max(4, Math.floor(hazard.severity * 4) + 2);
  }, [hazard.severity, shouldUseNewFire]);
  
  // Initialize spark particle geometry buffers
  useEffect(() => {
    if (shouldUseNewFire || numParticles === 0) return;
    
    const positions = new Float32Array(numParticles * 3);
    const velocities = new Float32Array(numParticles * 3);
    
    for (let i = 0; i < numParticles; i++) {
      const idx = i * 3;
      positions[idx] = Math.random() * 0.3 - 0.15;
      positions[idx + 1] = Math.random() * 0.15;
      positions[idx + 2] = Math.random() * 0.3 - 0.15;
      
      velocities[idx] = (Math.random() - 0.5) * 0.2;
      velocities[idx + 1] = Math.random() * 0.4;
      velocities[idx + 2] = (Math.random() - 0.5) * 0.2;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    
    sparkPositionsRef.current = positions;
    sparkVelocitiesRef.current = velocities;
    sparkGeometryRef.current = geometry;
    
    return () => {
      geometry.dispose();
      sparkGeometryRef.current = null;
      sparkPositionsRef.current = null;
      sparkVelocitiesRef.current = null;
    };
  }, [numParticles, shouldUseNewFire]);
  
  // Get hazard color based on type
  const getHazardBaseColor = () => {
    switch (hazard.type) {
      case HazardType.ElectricalOutlet:
        return "#7F8C8D"; // Gray
      case HazardType.StoveTop:
        return "#BDC3C7"; // Silver
      case HazardType.Candle:
        return "#FFFDD0"; // Cream for candle wax
      case HazardType.Fireplace:
        return "#E74C3C"; // Red
      case HazardType.SpacerHeater:
        return "#E67E22"; // Orange
      case HazardType.CloggedDryer:
        return "#95A5A6"; // Light gray
      default:
        return "#FFFFFF"; // White
    }
  };
  
  // Determine the size of the hazard base
  const getHazardDimensions = () => {
    switch (hazard.type) {
      case HazardType.ElectricalOutlet:
        return [0.2, 0.3, 0.1] as [number, number, number];
      case HazardType.StoveTop:
        return [0.8, 0.2, 0.6] as [number, number, number];
      case HazardType.Candle:
        return [0.15, 0.3, 0.15] as [number, number, number];
      case HazardType.Fireplace:
        return [1.2, 1, 0.4] as [number, number, number];
      case HazardType.SpacerHeater:
        return [0.6, 0.4, 0.3] as [number, number, number];
      case HazardType.CloggedDryer:
        return [0.8, 1, 0.6] as [number, number, number];
      default:
        return [0.5, 0.3, 0.5] as [number, number, number];
    }
  };
  
  // Animate particles (only for non-fire hazards)
  useFrame((_, delta) => {
    if (
      hazard.isExtinguished ||
      shouldUseNewFire ||
      !sparkPositionsRef.current ||
      !sparkVelocitiesRef.current ||
      !sparkGeometryRef.current
    ) {
      return;
    }
    
    const positions = sparkPositionsRef.current;
    const velocities = sparkVelocitiesRef.current;
    
    for (let i = 0; i < numParticles; i++) {
      const idx = i * 3;
      
      positions[idx] += velocities[idx] * delta;
      positions[idx + 1] += velocities[idx + 1] * delta;
      positions[idx + 2] += velocities[idx + 2] * delta;
      
      velocities[idx] += (Math.random() - 0.5) * delta * 0.5;
      velocities[idx + 2] += (Math.random() - 0.5) * delta * 0.5;
      velocities[idx + 1] -= delta * 0.3;
      
      if (positions[idx + 1] < 0 || positions[idx + 1] > 0.4) {
        positions[idx + 1] = 0.1;
        velocities[idx + 1] = Math.random() * 0.4;
      }
    }
    
    const positionAttr = sparkGeometryRef.current.attributes.position as THREE.BufferAttribute;
    positionAttr.needsUpdate = true;
  });
  
  return (
    <group 
      ref={groupRef}
      position={[hazard.position.x, hazard.position.y, hazard.position.z]}
    >
      {/* Hazard base object */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[
          getHazardDimensions()[0], 
          getHazardDimensions()[1], 
          getHazardDimensions()[2]
        ]} />
        <meshStandardMaterial color={getHazardBaseColor()} />
      </mesh>
      
      {/* New Fire System for fire-type hazards */}
      {shouldUseNewFire && hazard.isActive && !hazard.isExtinguished && (
        <Fire
          position={[0, getHazardDimensions()[1] / 2 + 0.1, 0]}
          size={Math.max(0.3, hazard.severity * 0.6)}
          intensity={hazard.severity}
          isActive={true}
          shape="triangular"
        />
      )}
      
      {/* Spark particles for non-fire hazards */}
      {!shouldUseNewFire && hazard.isActive && !hazard.isExtinguished && sparkGeometryRef.current && (
        <points geometry={sparkGeometryRef.current}>
          <pointsMaterial
            color="#FFF6A1"
            size={0.05}
            sizeAttenuation
            transparent
            opacity={0.85}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
}
