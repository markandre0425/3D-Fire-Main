import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HazardState, HazardType } from "@/lib/types";
import Fire from "./Fire";
import { ProceduralPropaneTank } from "./ProceduralFurniture";

interface FireHazardProps {
  hazard: HazardState;
}

// --- GAS VAPOR EFFECT ---
function GasVapor({ intensity = 1 }: { intensity: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Green vapor clouds */}
      {[0, 1, 2, 3].map((i) => (
        <mesh 
          key={i} 
          position={[
            Math.sin(i * Math.PI / 2) * 0.3,
            Math.sin(i) * 0.2 + 0.3,
            Math.cos(i * Math.PI / 2) * 0.3
          ]}
        >
          <sphereGeometry args={[0.15 + i * 0.05, 8, 8]} />
          <meshBasicMaterial 
            color="#44ff44" 
            transparent 
            opacity={0.3 * intensity} 
          />
        </mesh>
      ))}
      {/* Rising vapor particles */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshBasicMaterial color="#66ff66" transparent opacity={0.2 * intensity} />
      </mesh>
      <mesh position={[0.1, 0.8, 0.1]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshBasicMaterial color="#88ff88" transparent opacity={0.15 * intensity} />
      </mesh>
    </group>
  );
}

// --- PROCEDURAL PROPS (Kitchen Items) ---

function FryingPan({ isBurnt }: { isBurnt: boolean }) {
  const color = isBurnt ? "#1a1a1a" : "#333333";
  return (
    <group>
      {/* Pan Body */}
      <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 0.1, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Oil/Grease inside */}
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color={isBurnt ? "#000000" : "#D4AF37"} roughness={0.1} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.4, 0.13, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.5, 0.05, 0.08]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
    </group>
  );
}

function TrashBin({ isBurnt }: { isBurnt: boolean }) {
  const color = isBurnt ? "#2a2a2a" : "#BDC3C7";
  return (
    <group position={[0, 0.25, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.5, 16]} />
        <meshStandardMaterial color={color} metalness={0.1} />
      </mesh>
      <mesh position={[0.05, 0.2, -0.05]} rotation={[0.5, 0.5, 0]}>
        <dodecahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial color={isBurnt ? "#111" : "#FFF"} />
      </mesh>
      <mesh position={[-0.05, 0.22, 0.05]} rotation={[0.2, 0.1, 0.4]}>
        <dodecahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial color={isBurnt ? "#111" : "#FFF"} />
      </mesh>
    </group>
  );
}

function Spill({ isBurnt }: { isBurnt: boolean }) {
  const color = isBurnt ? "#000000" : "#8E44AD";
  return (
    // Lifted to 0.02 to prevent floor z-fighting
    <group position={[0, 0.02, 0]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 7]} /> 
        <meshStandardMaterial color={color} roughness={0.1} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function PowerStrip({ isBurnt }: { isBurnt: boolean }) {
  const color = isBurnt ? "#222" : "#FFF";
  return (
    // Lifted base to 0.08 so it doesn't clip
    <group position={[0, 0.08, 0]} rotation={[0, 0.5, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.08, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.25, 0.05, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.08]} />
        <meshStandardMaterial color={isBurnt ? "#000" : "#FF0000"} emissive={isBurnt ? "#000" : "#FF0000"} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

function GenericDebris({ isBurnt }: { isBurnt: boolean }) {
  return (
    <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
      <boxGeometry args={[0.4, 0.3, 0.4]} />
      <meshStandardMaterial color={isBurnt ? "#222" : "#A0522D"} />
    </mesh>
  );
}

function WoodPallet({ isBurnt }: { isBurnt: boolean }) {
  const color = isBurnt ? "#1a1a1a" : "#8B4513";
  return (
    <group position={[0, 0.05, 0]}>
      <mesh castShadow receiveShadow position={[0.15, 0, 0]}>
        <boxGeometry args={[0.05, 0.1, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.15, 0, 0]}>
        <boxGeometry args={[0.05, 0.1, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}

function BookPile({ isBurnt }: { isBurnt: boolean }) {
  const c1 = isBurnt ? "#222" : "#8e44ad";
  const c2 = isBurnt ? "#222" : "#2980b9";
  const c3 = isBurnt ? "#222" : "#27ae60";
  return (
    <group position={[0, 0.1, 0]}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.4]} />
        <meshStandardMaterial color={c1} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.05, 0.05, 0]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.25, 0.04, 0.35]} />
        <meshStandardMaterial color={c2} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.05, 0.1, 0]} rotation={[0, -0.2, 0.1]}>
        <boxGeometry args={[0.28, 0.04, 0.38]} />
        <meshStandardMaterial color={c3} />
      </mesh>
    </group>
  );
}

export default function FireHazard({ hazard }: FireHazardProps) {
  if (hazard.type === HazardType.ElectricalOutlet) {
    return null;
  }
  
  const groupRef = useRef<THREE.Group>(null);
  
  const renderProp = () => {
    const isBurnt = hazard.isExtinguished;
    const typeStr = hazard.type.toString().toLowerCase().replace(/[^a-z0-9]/g, "");

    // Deterministic variant from ID (same fire always looks the same)
    const variantSeed = hazard.id.charCodeAt(hazard.id.length - 1) % 4;

    // 1. STOVE / PAN (Class K)
    if (typeStr.includes("classk") || typeStr.includes("stove") || typeStr.includes("grease")) {
      const heightOffset = hazard.position.y < 0.5 ? 0.9 : 0;
      return <group position={[0, heightOffset, 0]}><FryingPan isBurnt={isBurnt} /></group>;
    }

    // 2. CLASS A (Ordinary Combustibles) — 4 variants: TrashBin, WoodPallet, BookPile, Box
    if (typeStr.includes("classa") || typeStr.includes("trash") || typeStr.includes("wood") || typeStr.includes("paper") || typeStr.includes("dryer")) {
      switch (variantSeed) {
        case 0:
          return <TrashBin isBurnt={isBurnt} />;
        case 1:
          return <WoodPallet isBurnt={isBurnt} />;
        case 2:
          return <BookPile isBurnt={isBurnt} />;
        default:
          return <GenericDebris isBurnt={isBurnt} />;
      }
    }

    // 3. SPILL
    if (typeStr.includes("classb") || typeStr.includes("liquid") || typeStr.includes("oil") || typeStr.includes("chemical") || typeStr.includes("spill")) {
      return <Spill isBurnt={isBurnt} />;
    }

    // 4. ELECTRICAL
    if (typeStr.includes("classc") || typeStr.includes("electric") || typeStr.includes("heater") || typeStr.includes("appliance")) {
      return <PowerStrip isBurnt={isBurnt} />;
    }
    
    // 5. GAS LEAK - Propane tank with vapor
    if (typeStr.includes("gas") || typeStr.includes("leak") || typeStr.includes("propane")) {
      return <ProceduralPropaneTank />;
    }
    
    if (typeStr.includes("candle") || typeStr.includes("fireplace")) return null;

    return <GenericDebris isBurnt={isBurnt} />;
  };
  
  // Logic for showing Fire Effect
  const typeStr = hazard.type.toString().toLowerCase().replace(/[^a-z0-9]/g, "");
  const shouldUseNewFire = 
    typeStr.includes("class") || 
    typeStr.includes("fireplace") || 
    typeStr.includes("stove") || 
    typeStr.includes("candle") || 
    typeStr.includes("heater") || 
    typeStr.includes("dryer");
    
  // Calculate fire offset based on type (e.g. lift fire higher for pans)
  let fireYOffset = 0.2;
  if (typeStr.includes("stove") || typeStr.includes("classk")) {
     // If we lifted the pan, lift the fire too
     fireYOffset = hazard.position.y < 0.5 ? 1.1 : 0.2;
  }
  
  // Don't render anything if hazard is extinguished (no gray debris box)
  if (hazard.isExtinguished) {
    return null;
  }
  
  // Check if this is a gas leak hazard
  const isGasLeak = typeStr.includes("gas") || typeStr.includes("leak") || typeStr.includes("propane");
  
  return (
    <group 
      ref={groupRef}
      position={[hazard.position.x, hazard.position.y, hazard.position.z]}
    >
      {/* 1. THE OBJECT (Always Visible if active) */}
      {hazard.isActive && renderProp()}
      
      {/* 2. THE FIRE EFFECT (not for gas leaks) */}
      {shouldUseNewFire && !isGasLeak && hazard.isActive && !hazard.isExtinguished && (
        <Fire
          position={[0, fireYOffset, 0]} 
          size={Math.max(0.3, hazard.severity * 0.6)}
          intensity={hazard.severity}
          isActive={true}
          shape="triangular"
        />
      )}
      
      {/* 3. GAS VAPOR EFFECT (only for gas leaks) */}
      {isGasLeak && hazard.isActive && !hazard.isExtinguished && (
        <GasVapor intensity={hazard.severity} />
      )}
    </group>
  );
}
