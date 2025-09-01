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
  const sparkParticles = useRef<THREE.Mesh[]>([]);
  
  const { updateHazard } = useFireSafety();
  
  // Check if this hazard should use the new fire system
  const shouldUseNewFire = hazard.type === HazardType.Fireplace || 
                          hazard.type === HazardType.StoveTop ||
                          hazard.type === HazardType.Candle ||
                          hazard.type === HazardType.SpacerHeater;
  
  // Generate random particles for spark effects (only for non-fire hazards)
  const numParticles = useMemo(() => {
    if (shouldUseNewFire) return 0;
    return Math.floor(hazard.severity * 8) + 3;
  }, [hazard.severity, shouldUseNewFire]);
  
  // Initialize spark particles
  useEffect(() => {
    if (shouldUseNewFire) return;
    
    sparkParticles.current = [];
    
    for (let i = 0; i < numParticles; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 4, 4),
        new THREE.MeshStandardMaterial({
          color: "#FFDD00",
          emissive: "#FFFF00",
          emissiveIntensity: 2,
          toneMapped: false
        })
      );
      
      // Random initial position
      particle.position.set(
        Math.random() * 0.4 - 0.2,
        Math.random() * 0.2,
        Math.random() * 0.4 - 0.2
      );
      
      sparkParticles.current.push(particle);
    }
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
    if (hazard.isExtinguished || shouldUseNewFire) return;
    
    // Animate particles
    sparkParticles.current.forEach((particle, i) => {
      const offset = i * 0.1;
      particle.position.y += (Math.random() - 0.5) * delta * 2;
      particle.position.x += Math.sin(Date.now() * 0.001 + offset) * delta * 0.5;
      particle.position.z += Math.cos(Date.now() * 0.001 + offset) * delta * 0.5;
      
      // Reset particles that go too high
      if (particle.position.y > 2) {
        particle.position.y = 0;
      }
    });
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
        />
      )}
      
      {/* Spark particles for non-fire hazards */}
      {!shouldUseNewFire && hazard.isActive && !hazard.isExtinguished && sparkParticles.current.map((_, i) => (
        <mesh 
          key={`spark-${hazard.id}-${i}`}
          position={[
            Math.random() * 0.4 - 0.2,
            getHazardDimensions()[1] / 2 + 0.2,
            Math.random() * 0.4 - 0.2
          ]}
          scale={[0.05, 0.05, 0.05]}
        >
          <sphereGeometry args={[1, 4, 4]} />
          <meshStandardMaterial 
            color="#FFDD00" 
            emissive="#FFFF00"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
