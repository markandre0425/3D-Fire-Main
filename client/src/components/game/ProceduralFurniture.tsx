import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

// --- MATERIALS ---
const materials = {
  chrome: <meshStandardMaterial color="#D0D0D0" roughness={0.2} metalness={0.8} />,
  whitePlastic: <meshStandardMaterial color="#F5F5F5" roughness={0.5} />,
  blackPlastic: <meshStandardMaterial color="#111111" roughness={0.8} />,
  screen: <meshStandardMaterial color="#050505" roughness={0.2} metalness={0.5} />,
  woodDark: <meshStandardMaterial color="#5C4033" roughness={0.9} />,
  woodLight: <meshStandardMaterial color="#8B5A2B" roughness={0.9} />,
  glass: <meshStandardMaterial color="#88CCFF" opacity={0.3} transparent />,
  mirror: <meshStandardMaterial color="#E0E0E0" roughness={0.1} metalness={0.9} />,
  light: <meshStandardMaterial color="#FFE5B4" emissive="#FFE5B4" emissiveIntensity={0.5} />,
  speakerGrille: <meshStandardMaterial color="#222222" roughness={0.9} />,
  // Specific materials for the Wall TV
  screenOn: <meshBasicMaterial color="#88CCFF" />,
  powerLight: <meshBasicMaterial color="#FF0000" />,
  mountMetal: <meshStandardMaterial color="#333333" roughness={0.8} metalness={0.5} />
};

// --- KITCHEN ITEMS ---

export function ProceduralFridge() {
  return (
    <group position={[0, 1, 0]}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 2.0, 0.8]} />
        {materials.whitePlastic}
      </mesh>
      <mesh position={[0, 0.4, 0.41]}>
        <boxGeometry args={[0.88, 0.02, 0.05]} />
        {materials.chrome}
      </mesh>
      <mesh position={[0.35, 0.6, 0.45]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        {materials.chrome}
      </mesh>
      <mesh position={[0.35, 0.0, 0.45]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        {materials.chrome}
      </mesh>
    </group>
  );
}

export function ProceduralStove() {
  return (
    <group position={[0, 0.5, 0]}>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, 1.0, 0.8]} />
        {materials.whitePlastic}
      </mesh>
      {/* Oven Window */}
      <mesh position={[0, 0, 0.41]}>
        <boxGeometry args={[0.6, 0.5, 0.02]} />
        {materials.blackPlastic}
      </mesh>
      {/* Burners (4 flat cylinders) */}
      <group position={[0, 0.51, 0]}>
        <mesh position={[-0.2, 0, -0.2]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          {materials.blackPlastic}
        </mesh>
        <mesh position={[0.2, 0, -0.2]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          {materials.blackPlastic}
        </mesh>
        <mesh position={[-0.2, 0, 0.2]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          {materials.blackPlastic}
        </mesh>
        <mesh position={[0.2, 0, 0.2]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          {materials.blackPlastic}
        </mesh>
      </group>
      {/* Back Panel */}
      <mesh position={[0, 0.65, -0.35]}>
        <boxGeometry args={[0.8, 0.3, 0.1]} />
        {materials.whitePlastic}
      </mesh>
    </group>
  );
}

export function ProceduralCounter() {
  return (
    <group position={[0, 0.5, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.0, 1.0, 0.8]} />
        {materials.woodLight}
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[1.1, 0.1, 0.9]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.45, 0.38]}>
        <boxGeometry args={[1.0, 0.1, 0.05]} />
        {materials.blackPlastic}
      </mesh>
    </group>
  );
}

// --- LIVING ROOM ITEMS ---

export function ProceduralTV() {
  return (
    <group position={[0, 0.6, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.9, 0.05]} />
        {materials.blackPlastic}
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[1.5, 0.8, 0.01]} />
        {materials.screen}
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.4, 0.1, 0.3]} />
        {materials.chrome}
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.05]} />
        {materials.blackPlastic}
      </mesh>
    </group>
  );
}

export function ProceduralTable() {
  return (
    <group position={[0, 0.75, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.1, 1.0]} />
        {materials.woodDark}
      </mesh>
      <group position={[0, -0.4, 0]}>
        <mesh position={[-0.6, 0, 0.4]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          {materials.woodDark}
        </mesh>
        <mesh position={[0.6, 0, 0.4]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          {materials.woodDark}
        </mesh>
        <mesh position={[-0.6, 0, -0.4]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          {materials.woodDark}
        </mesh>
        <mesh position={[0.6, 0, -0.4]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          {materials.woodDark}
        </mesh>
      </group>
    </group>
  );
}

// --- COMPUTER SETUP ---

export function ProceduralComputer() {
  return (
    <group position={[0, 0.75, 0]}>
      {/* Monitor */}
      <group position={[0, 0.4, -0.1]}>
        {/* Monitor Stand */}
        <mesh castShadow receiveShadow position={[0, -0.3, 0]}>
          <boxGeometry args={[0.3, 0.05, 0.2]} />
          {materials.blackPlastic}
        </mesh>
        {/* Monitor Screen */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.5, 0.05]} />
          {materials.blackPlastic}
        </mesh>
        {/* Screen Display */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.65, 0.45, 0.01]} />
          {materials.screen}
        </mesh>
        {/* Monitor Base */}
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.25, 0.1, 0.15]} />
          {materials.blackPlastic}
        </mesh>
      </group>
      {/* Computer Tower */}
      <group position={[-0.5, 0, 0.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.6, 0.4]} />
          {materials.blackPlastic}
        </mesh>
        {/* Power Button */}
        <mesh position={[0.11, 0.2, 0]}>
          <boxGeometry args={[0.02, 0.05, 0.05]} />
          {materials.chrome}
        </mesh>
        {/* USB Ports */}
        <mesh position={[0.11, -0.1, 0.1]}>
          <boxGeometry args={[0.02, 0.15, 0.05]} />
          {materials.blackPlastic}
        </mesh>
      </group>
      {/* Keyboard */}
      <group position={[0, 0.05, 0.15]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.02, 0.2]} />
          {materials.blackPlastic}
        </mesh>
      </group>
      {/* Mouse */}
      <group position={[0.35, 0.05, 0.15]}>
        <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.12, 0.05, 0.08]} />
          {materials.blackPlastic}
        </mesh>
      </group>
    </group>
  );
}

export function ProceduralDesk() {
  return (
    <group position={[0, 0.75, 0]}>
      {/* Desk Top */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.05, 0.6]} />
        {materials.woodDark}
      </mesh>
      {/* Left Leg */}
      <mesh position={[-0.55, -0.35, 0.25]}>
        <boxGeometry args={[0.1, 0.7, 0.1]} />
        {materials.woodDark}
      </mesh>
      {/* Right Leg */}
      <mesh position={[0.55, -0.35, 0.25]}>
        <boxGeometry args={[0.1, 0.7, 0.1]} />
        {materials.woodDark}
      </mesh>
      {/* Back Left Leg */}
      <mesh position={[-0.55, -0.35, -0.25]}>
        <boxGeometry args={[0.1, 0.7, 0.1]} />
        {materials.woodDark}
      </mesh>
      {/* Back Right Leg */}
      <mesh position={[0.55, -0.35, -0.25]}>
        <boxGeometry args={[0.1, 0.7, 0.1]} />
        {materials.woodDark}
      </mesh>
      {/* Keyboard Tray (Optional - for leg room) */}
      <mesh position={[0, -0.2, 0.3]}>
        <boxGeometry args={[0.8, 0.05, 0.3]} />
        {materials.woodDark}
      </mesh>
    </group>
  );
}

export function ProceduralMirror() {
  return (
    <group>
      {/* Outer Frame (Chrome/Silver) */}
      <mesh castShadow receiveShadow position={[0, 0, -0.06]}>
        <boxGeometry args={[1.2, 2.5, 0.12]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Inner Frame Border (Dark) */}
      <mesh castShadow receiveShadow position={[0, 0, -0.04]}>
        <boxGeometry args={[1.15, 2.45, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>
      
      {/* Silver Lens Layer - Highly reflective silver surface */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[1, 2.3]} />
        <meshStandardMaterial 
          color="#E8E8E8" 
          roughness={0.05} 
          metalness={0.95}
          envMapIntensity={1.0}
        />
      </mesh>
      
      {/* Mirror surface - OPTIMIZED: Using meshBasicMaterial for base tint */}
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[1, 2.3]} />
        {/* Silver-blue tint that suggests reflection without expensive calculations */}
        <meshBasicMaterial color="#D0D8E0" transparent opacity={0.4} />
      </mesh>
      
      {/* Subtle highlight gradient effect (optional visual enhancement) */}
      <mesh position={[0, 0.5, -0.01]}>
        <planeGeometry args={[0.3, 0.8]} />
        <meshBasicMaterial color="#F0F4F8" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export function ProceduralWallTV() {
  return (
    <group>
      {/* Wall Mount Bracket */}
      <mesh castShadow receiveShadow position={[0, 0, -0.15]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        {materials.mountMetal}
      </mesh>
      
      {/* TV Frame/Bezel */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.9, 0.1]} />
        {materials.blackPlastic}
      </mesh>
      
      {/* Screen */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.5, 0.85]} />
        {materials.screenOn}
      </mesh>
      
      {/* Power LED Indicator */}
      <mesh position={[0.75, -0.4, 0.06]}>
        <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
        {materials.powerLight}
      </mesh>
      
      {/* Thin side accent (optional detail) */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[1.6, 0.9, 0.02]} />
        {materials.chrome}
      </mesh>
    </group>
  );
}

// Dual-woofer tower speaker — matches reference (cabinet #1a1a1a, woofers #333, tweeter #111/#222)
export function ProceduralSpeaker() {
  return (
    <group position={[0, 0.8, 0]} scale={[0.29, 0.29, 0.29]}>
      {/* Cabinet */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 5.5, 1.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>

      {/* Woofer 1 (Top) */}
      <mesh position={[0, 0.2, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.0, 0.5, 32, 1, true]} />
        <meshStandardMaterial color="#333" side={THREE.DoubleSide} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.2, 0.65]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#111" roughness={0.2} />
      </mesh>

      {/* Woofer 2 (Bottom) */}
      <mesh position={[0, -2.0, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.0, 0.5, 32, 1, true]} />
        <meshStandardMaterial color="#333" side={THREE.DoubleSide} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, -2.0, 0.65]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#111" roughness={0.2} />
      </mesh>

      {/* Tweeter (Top) */}
      <mesh position={[0, 2.0, 0.76]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.0, 0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
}

// --- WALK-IN CLOSET (ENHANCED) ---

// OPTIMIZATION: Cached glow texture (singleton pattern) - shared across all LightGlow instances
let cachedGlowTexture: THREE.CanvasTexture | null = null;

function getGlowTexture() {
  if (cachedGlowTexture) return cachedGlowTexture;
  
  const canvas = document.createElement('canvas');
  // OPTIMIZATION: Reduced resolution from 128x128 to 64x64 for better performance
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Warm white/yellow glow gradient
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)'); // Bright warm white center
    gradient.addColorStop(0.4, 'rgba(255, 230, 150, 0.4)'); // Warm yellow mid
    gradient.addColorStop(1, 'rgba(255, 200, 100, 0)'); // Transparent edge
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  
  cachedGlowTexture = new THREE.CanvasTexture(canvas);
  return cachedGlowTexture;
}

// Glow Billboard Component for Lights
function LightGlow({ position }: { position: [number, number, number] }) {
  const glowRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  // OPTIMIZATION: Use cached texture instead of creating new one per instance
  const glowTexture = useMemo(() => getGlowTexture(), []);

  useFrame(() => {
    if (glowRef.current) {
      glowRef.current.lookAt(camera.position);
    }
  });

  return (
    <mesh ref={glowRef} position={position}>
      <planeGeometry args={[0.4, 0.4]} />
      <meshBasicMaterial
        map={glowTexture}
        transparent={true}
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// --- COMPACTED DIMENSIONS ---
// Reduced from 5x4 to 3.5x2.5 so it fits inside standard rooms without clipping
const CLOSET_WIDTH = 3.5;
const CLOSET_DEPTH = 2.5;

// --- Components ---
// --- OPTIMIZATION 2: Simplified Hanger (No Instancing needed for low count) ---
const Hanger = ({ position, rotation, color }: { position: [number, number, number], rotation: [number, number, number], color: string }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Hook: Reduced segments (12) */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.04, 0.005, 8, 12, Math.PI]} />
        {materials.chrome}
      </mesh>
      {/* Shoulder */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        {materials.blackPlastic}
      </mesh>
      {/* Cloth */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.9, 0.05]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
};

const HangingRod = ({ length, position }: { length: number, position: [number, number, number] }) => {
  const clothes = useMemo(() => {
    const items = [];
    // OPTIMIZATION: Reduced density from 6 to 2 per unit (approx 1/3)
    const count = Math.floor(length * 2); 
    const colors = ["#4a5d23", "#8f3f3f", "#2d3e50", "#e0c090", "#1a1a1a", "#ffffff"];

    for (let i = 0; i < count; i++) {
      items.push({
        position: [
          (i / count) * length - length / 2 + 0.1,
          -0.05,
          0
        ] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: [0, (Math.random() - 0.5) * 0.2, 0] as [number, number, number],
      });
    }

    return items;
  }, [length]);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
        {/* OPTIMIZATION: Reduced cylinder segments from 16 to 8 */}
        <cylinderGeometry args={[0.02, 0.02, length, 8]} />
        {materials.chrome}
      </mesh>
      {/* Standard Mapping - Fast enough for < 20 items */}
      {clothes.map((item, idx) => (
        <Hanger
          key={idx}
          position={item.position}
          rotation={item.rotation}
          color={item.color}
        />
      ))}
    </group>
  );
};

const ShelfUnit = ({ position, width, height, shelves = 4 }: { position: [number, number, number], width: number, height: number, shelves?: number }) => {
  const shelfHeight = height / shelves;

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.05, height, 0.5]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.05, height, 0.5]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} />
      </mesh>
      {Array.from({ length: shelves }).map((_, i) => (
        <group key={i} position={[0, i * shelfHeight + 0.1, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, 0.05, 0.5]} />
            <meshStandardMaterial color="#3d2817" roughness={0.8} />
          </mesh>
          {/* OPTIMIZATION: Reduced probability from 0.7 to 0.85 (15% chance, fewer random items) */}
          {Math.random() > 0.85 && (
            <mesh castShadow position={[0, 0.15, 0]} rotation={[0, (Math.random() - 0.5) * 0.5, 0]}>
              <boxGeometry args={[0.25, 0.2, 0.35]} />
              <meshStandardMaterial color={Math.random() > 0.5 ? "#d1bfa7" : "#333"} />
            </mesh>
          )}
        </group>
      ))}
      <mesh castShadow receiveShadow position={[0, height, 0]}>
        <boxGeometry args={[width + 0.1, 0.05, 0.55]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} />
      </mesh>
    </group>
  );
};

const DrawerUnit = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[0.8, 0.9, 0.5]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} />
      </mesh>
      {[0.2, 0.5, 0.8].map((y, i) => (
        <group key={i} position={[0, y, 0.26]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.7, 0.25, 0.02]} />
            <meshStandardMaterial color="#8c6b4a" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.15, 0.02, 0.02]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={1.0} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const FloorMirror = () => {
  return (
    <group position={[0, 1.5, -CLOSET_DEPTH / 2 + 0.1]}>
      <mesh castShadow receiveShadow position={[0, 0, -0.05]}>
        <boxGeometry args={[1.2, 2.5, 0.1]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>
      {/* OPTIMIZATION: Replaced expensive MeshReflectorMaterial with standard material for better performance */}
      <mesh>
        <planeGeometry args={[1, 2.3]} />
        <meshStandardMaterial color="#a0a0a0" roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  );
};

// --- Single light fixture (bracket + bulb + glow) ---
function ClosetLightFixture({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const rot = rotation ?? [0, 0, 0];
  return (
    <group position={position} rotation={rot}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        {materials.chrome}
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        {materials.whitePlastic}
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        {materials.light}
      </mesh>
      <LightGlow position={[0, 0, 0.12]} />
    </group>
  );
}

// --- Closet Lights Strip 1 (right-side wall strip, 5 lights) - position separately in constants ---
export function ClosetLightsStrip1() {
  return (
    <group>
      <ClosetLightFixture position={[0, 0, -0.5]} rotation={[Math.PI, -Math.PI / 2, 0]} />
      <ClosetLightFixture position={[0, 0, -2.6]} rotation={[Math.PI, -Math.PI / 2, 0]} />
      <ClosetLightFixture position={[0, 0, -4.7]} rotation={[Math.PI, -Math.PI / 2, 0]} />
      <ClosetLightFixture position={[0, 0, 1.6]} rotation={[Math.PI, -Math.PI / 2, 0]} />
      <ClosetLightFixture position={[0, 0, -6.8]} rotation={[Math.PI, -Math.PI / 2, 0]} />
    </group>
  );
}

// --- Closet Lights Strip 2 (other walls strip, 5 lights) - position separately in constants ---
export function ClosetLightsStrip2() {
  return (
    <group rotation={[0.5, 0, 0]}>
      <ClosetLightFixture position={[-2, 0, 0]} />
      <ClosetLightFixture position={[-1, 0, 0]} />
      <ClosetLightFixture position={[0, 0, 0]} />
      <ClosetLightFixture position={[1, 0, 0]} />
      <ClosetLightFixture position={[2, 0, 0]} />
    </group>
  );
}

// --- Main Component (Updated Layout) ---
export function ProceduralCloset() {
  return (
    <group>
      {/* 1. Left Wall: Double Hanging Section */}
      {/* Moved closer to center: x was -2.1, now approx -1.45 */}
      <group position={[-CLOSET_WIDTH / 2 + 0.3, 0, 0]}>
        {/* Shortened rods to prevent clipping with back wall (3.5 -> 2.0) */}
        <HangingRod position={[0, 2.5, 0]} length={2.0} />
        <HangingRod position={[0, 1.2, 0]} length={2.0} />
        <mesh position={[0, 1.5, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.05, 3, 0.5]} />
          <meshStandardMaterial color="#3d2817" roughness={0.8} />
        </mesh>
      </group>

      {/* 2. Right Wall: Shelving */}
      {/* Moved closer to center: x was +2.0, now approx +1.45 */}
      <group position={[CLOSET_WIDTH / 2 - 0.3, 0, 0]}>
        {/* Adjusted Z positions and width to stay within new depth */}
        <ShelfUnit position={[0, 0, 0]} width={0.6} height={3} shelves={6} />
        <ShelfUnit position={[0, 0, 0.7]} width={0.6} height={3} shelves={5} />
      </group>

      {/* 3. Back Wall Center */}
      {/* Pulled forward: z was -1.5, now -1.05 */}
      <group position={[0, 0, -CLOSET_DEPTH / 2 + 0.2]}>
        {/* FloorMirror removed - uncomment to restore: <FloorMirror /> */}
        <DrawerUnit position={[-0.85, 0, 0]} />
        <DrawerUnit position={[0.85, 0, 0]} />
      </group>

      {/* 4. Center Island */}
      {/* Scaled down to fit the tighter walking space (1.2x1.2 -> 0.8x0.6) */}
      <group position={[0, 0, 0.4]}>
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[0.8, 1, 0.6]} />
          <meshStandardMaterial color="#3d2817" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.01, 0]}>
          <boxGeometry args={[0.8, 0.02, 0.6]} />
          <meshStandardMaterial color="#111" roughness={0.2} />
        </mesh>
      </group>

      {/* Lighting: ClosetLightsStrip1 / ClosetLightsStrip2 (positioned separately in constants) */}
    </group>
  );
}
