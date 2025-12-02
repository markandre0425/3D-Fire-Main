import { useEffect, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import FireHazard from "./FireHazard";
import Fire from "./Fire";
import { HazardState, HazardType } from "@/lib/types";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { SAFETY_TIPS } from "@/lib/constants";
import Appliance from "./Appliance";

interface HazardProps {
  hazard: HazardState;
}

// --- OPTIMIZATION 1: Global Geometries ---
const SPARK_GEOMETRY = new THREE.PlaneGeometry(0.5, 0.5);
const GLOW_GEOMETRY = new THREE.PlaneGeometry(0.6, 0.6);

// --- OPTIMIZATION 2: Singleton Texture Cache ---
let cachedLightningTexture: THREE.CanvasTexture | null = null;
let cachedGlowTexture: THREE.CanvasTexture | null = null;

function getLightningTexture(): THREE.CanvasTexture {
  if (cachedLightningTexture) return cachedLightningTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);
    
    // Draw Bolt
    ctx.strokeStyle = '#FFFFFF';
    ctx.shadowColor = '#00FFFF'; // Cyan Glow
    ctx.shadowBlur = 15;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(64, 10);
    ctx.lineTo(45, 40);
    ctx.lineTo(75, 40); // Jagged Zig-Zag
    ctx.lineTo(50, 80);
    ctx.lineTo(80, 80);
    ctx.lineTo(64, 118);
    ctx.stroke();
  }
  
  cachedLightningTexture = new THREE.CanvasTexture(canvas);
  return cachedLightningTexture;
}

function getGlowTexture(): THREE.CanvasTexture {
  if (cachedGlowTexture) return cachedGlowTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Soft Blue Glow Gradient
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(0, 200, 255, 1)'); // Bright Cyan Center
    gradient.addColorStop(0.4, 'rgba(0, 100, 255, 0.5)'); // Blue Mid
    gradient.addColorStop(1, 'rgba(0, 0, 255, 0)'); // Transparent Edge
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  
  cachedGlowTexture = new THREE.CanvasTexture(canvas);
  return cachedGlowTexture;
}

// --- COMPONENT: Electric Sparks for Outlets ---
function ElectricSparks() {
  const sparkRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const { camera } = useThree();

  const sparkTexture = useMemo(() => getLightningTexture(), []);
  const glowTexture = useMemo(() => getGlowTexture(), []);

  useFrame((state) => {
    if (!sparkRef.current || !glowRef.current || !lightRef.current) return;

    // FIX 1: Billboarding in World Space
    // ensures the spark/glow always faces the camera, regardless of the wall angle.
    // fixes the issue where the left outlet's spark was invisible.
    sparkRef.current.lookAt(camera.position);
    glowRef.current.lookAt(camera.position);

    // FLICKER LOGIC:
    const time = state.clock.elapsedTime;
    const flicker = Math.sin(time * 50.0) * Math.random(); 

    if (flicker > 0.6) { 
      // Show Spark
      sparkRef.current.visible = true;
      // apply local Z rotation AFTER looking at camera
      sparkRef.current.rotateZ((Math.random() - 0.5) * 0.5);
      
      const scale = 0.8 + Math.random() * 0.4;
      sparkRef.current.scale.set(scale, scale, scale);

      // Show Fake Light (Glow Sprite)
      glowRef.current.visible = true;
      glowRef.current.rotateZ(Math.random() * Math.PI); 
      const glowScale = 1.0 + Math.random() * 0.5;
      glowRef.current.scale.set(glowScale, glowScale, glowScale);

      // Flash the PointLight (The "Circle" on the wall)
      lightRef.current.intensity = 1.5 + Math.random() * 2;
    } else {
      sparkRef.current.visible = false;
      glowRef.current.visible = false;
      lightRef.current.intensity = 0;
    }
  });

  return (
    // Z = 0.1 puts it slightly in front of the outlet faceplate
    <group position={[0, 0, 0.1]}>
      {/* 1. The Spark Bolt */}
      <mesh ref={sparkRef} geometry={SPARK_GEOMETRY}>
        <meshBasicMaterial 
          map={sparkTexture} 
          transparent={true}
          color="#AAEEFF"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* 2. The Fake Light Plane */}
      <mesh ref={glowRef} geometry={GLOW_GEOMETRY} position={[0, 0, -0.05]}>
        <meshBasicMaterial 
          map={glowTexture}
          transparent={true}
          color="#0088FF"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.6}
        />
      </mesh>

      {/* 3. The Real Light (Casts the glow on the wall) */}
      <pointLight ref={lightRef} color="#0088FF" distance={2} decay={2} />
    </group>
  );
}

// --- COMPONENT: Procedural Outlet Model (Double Sided) ---
// Renders sockets on both Front (Z+) and Back (Z-)
function ProceduralOutlet({ rotation = [0, 0, 0] }: { rotation?: [number, number, number] }) {
  return (
    <group rotation={rotation}>
      {/* Faceplate (White Box) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.25, 0.4, 0.05]} />
        <meshStandardMaterial color="#F5F5F5" roughness={0.4} />
      </mesh>
      
      {/* --- FRONT SIDE SOCKETS --- */}
      {/* Top Socket (Dark Grey) */}
      <mesh position={[0, 0.08, 0.03]}>
        <boxGeometry args={[0.12, 0.1, 0.02]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
      {/* Bottom Socket (Dark Grey) */}
      <mesh position={[0, -0.08, 0.03]}>
        <boxGeometry args={[0.12, 0.1, 0.02]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>

      {/* --- BACK SIDE SOCKETS (New) --- */}
      {/* Top Socket (Dark Grey) */}
      <mesh position={[0, 0.08, -0.03]}>
        <boxGeometry args={[0.12, 0.1, 0.02]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
      {/* Bottom Socket (Dark Grey) */}
      <mesh position={[0, -0.08, -0.03]}>
        <boxGeometry args={[0.12, 0.1, 0.02]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function Hazard({ hazard }: HazardProps) {
  const { showSafetyTip } = useFireSafety();

  useEffect(() => {
    let tipTimeoutId: NodeJS.Timeout;

    if (hazard.isActive && !hazard.isExtinguished) {
      let relevantTipId = "";
      
      switch (hazard.type) {
        case HazardType.StoveTop:
          relevantTipId = "tip1"; // Keep an eye on the stove
          break;
        case HazardType.ElectricalOutlet:
          relevantTipId = "tip9"; // Don't overload outlets
          break;
        case HazardType.Candle:
          relevantTipId = "tip7"; // Avoid candle hazards
          break;
        case HazardType.Fireplace:
          relevantTipId = "tip5"; // Keep space heaters away (also applies to fireplaces)
          break;
        case HazardType.SpacerHeater:
          relevantTipId = "tip5"; // Keep space heaters away
          break;
        case HazardType.CloggedDryer:
          relevantTipId = "tip8"; // Clean dryer lint
          break;
        case HazardType.ClassAFire:
        case HazardType.ClassBFire:
        case HazardType.ClassCFire:
        case HazardType.ClassDFire:
        case HazardType.ClassKFire:
          relevantTipId = "tip2"; // Fire safety tips
          break;
        default:
          // Find a random prevention tip
          const preventionTips = SAFETY_TIPS.filter(tip => 
            tip.category === "Prevention"
          );
          if (preventionTips.length > 0) {
            relevantTipId = preventionTips[
              Math.floor(Math.random() * preventionTips.length)
            ].id;
          }
      }
      
      // Show tip after a delay
      tipTimeoutId = setTimeout(() => {
        showSafetyTip(relevantTipId);
        
        // Hide tip after 5 seconds
        setTimeout(() => {
          showSafetyTip(null);
        }, 5000);
      }, 2000);
    }
    
    return () => {
      clearTimeout(tipTimeoutId);
    };
  }, [hazard.isActive, hazard.isExtinguished, hazard.type, showSafetyTip]);
  
  // Check if this hazard should use the Appliance component
  const shouldUseAppliance = hazard.id.toLowerCase().includes('microwave') ||
                            hazard.id.toLowerCase().includes('toaster') ||
                            hazard.id.toLowerCase().includes('coffee') ||
                            hazard.id.toLowerCase().includes('tv') ||
                            hazard.id.toLowerCase().includes('television') ||
                            hazard.id.toLowerCase().includes('laptop') ||
                            hazard.id.toLowerCase().includes('space-heater') ||
                            hazard.id.toLowerCase().includes('lamp') ||
                            hazard.id.toLowerCase().includes('printer') ||
                            hazard.id.toLowerCase().includes('projector') ||
                            hazard.id.toLowerCase().includes('vending') ||
                            hazard.id.toLowerCase().includes('file-cabinet') ||
                            hazard.id.toLowerCase().includes('conveyor') ||
                            hazard.id.toLowerCase().includes('hydraulic') ||
                            hazard.id.toLowerCase().includes('welding') ||
                            hazard.id.toLowerCase().includes('forklift') ||
                            hazard.id.toLowerCase().includes('compressor') ||
                            hazard.id.toLowerCase().includes('generator') ||
                            hazard.id.toLowerCase().includes('meat-grinder') ||
                            hazard.id.toLowerCase().includes('meat_grinder') ||
                            hazard.id.toLowerCase().includes('simple-wood') ||
                            hazard.id.toLowerCase().includes('simple_wood') ||
                            hazard.id.toLowerCase().includes('wooden-tabouret') ||
                            hazard.id.toLowerCase().includes('wooden_tabouret');
  
  // Check if this hazard should use the new Fire component directly (without props)
  // Only non-Class fire types use Fire component directly
  const shouldUseNewFire = // Class fires removed - they go through FireHazard for props
                          hazard.type === HazardType.Fireplace ||
                          hazard.type === HazardType.Candle;
  
  // Render appliance-type hazards using the Appliance component
  if (shouldUseAppliance) {
    return <Appliance hazard={hazard} />;
  }
  
  // Render fire-type hazards using the new Fire component (only for non-Class fires)
  if (shouldUseNewFire) {
    return (
      <Fire
        position={[hazard.position.x, hazard.position.y, hazard.position.z]}
        size={Math.max(0.5, hazard.severity * 0.8)}
        intensity={hazard.severity}
        isActive={hazard.isActive && !hazard.isExtinguished}
      />
    );
  }
  
  // Electrical Outlet: Uses Procedural Model + Spark Effect
  if (hazard.type === HazardType.ElectricalOutlet) {
    const { x, y, z } = hazard.position;
    let outletRotation: [number, number, number] = [0, 0, 0];
    
    // Wall detection logic
    const wallThreshold = 0.5;
    if (Math.abs(z + 10) < wallThreshold || Math.abs(z + 11) < wallThreshold || Math.abs(z + 15) < wallThreshold || Math.abs(z + 16) < wallThreshold) {
      outletRotation = [0, 0, 0]; 
    } else if (Math.abs(z - 10) < wallThreshold || Math.abs(z - 11) < wallThreshold || Math.abs(z - 15) < wallThreshold || Math.abs(z - 16) < wallThreshold) {
      outletRotation = [0, Math.PI, 0]; 
    } else if (Math.abs(x - 10) < wallThreshold || Math.abs(x - 11) < wallThreshold || Math.abs(x - 15) < wallThreshold || Math.abs(x - 16) < wallThreshold) {
      outletRotation = [0, Math.PI / 2, 0]; 
    } else if (Math.abs(x + 10) < wallThreshold || Math.abs(x + 11) < wallThreshold || Math.abs(x + 15) < wallThreshold || Math.abs(x + 16) < wallThreshold) {
      outletRotation = [0, -Math.PI / 2, 0]; 
    }
    
    return (
      <group position={[x, y, z]} rotation={outletRotation}>
        <ProceduralOutlet /> 
        {hazard.isActive && !hazard.isExtinguished && (
          <>
            {/* Front Sparks (Z = 0.1) */}
            <ElectricSparks />
            {/* Back Sparks (Z = -0.1) - Manually positioned relative to group */}
            <group position={[0, 0, -0.2]}>
              <ElectricSparks />
            </group>
          </>
        )}
      </group>
    );
  }
  
  // Render other hazard types using FireHazard
  return <FireHazard hazard={hazard} />;
}
