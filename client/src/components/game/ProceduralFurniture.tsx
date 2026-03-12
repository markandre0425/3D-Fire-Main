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
      <mesh receiveShadow position={[0, 0.55, 0]}>
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
        <mesh receiveShadow position={[0, -0.3, 0]}>
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
        <mesh receiveShadow>
          <boxGeometry args={[0.6, 0.02, 0.2]} />
          {materials.blackPlastic}
        </mesh>
      </group>
      {/* Mouse */}
      <group position={[0.35, 0.05, 0.15]}>
        <mesh receiveShadow rotation={[0, 0, Math.PI / 6]}>
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
            <mesh position={[0, 0.15, 0]} rotation={[0, (Math.random() - 0.5) * 0.5, 0]}>
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
          <mesh receiveShadow>
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

// =============================================
// GARAGE / WORKSHOP COMPONENTS
// =============================================

// --- Workbench ---
export function ProceduralWorkbench() {
  return (
    <group>
      {/* Tabletop */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.08, 0.8]} />
        <meshStandardMaterial color="#5C4033" roughness={0.9} />
      </mesh>
      {/* Legs */}
      {[[-1.1, 0, -0.3], [-1.1, 0, 0.3], [1.1, 0, -0.3], [1.1, 0, 0.3]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.45, pos[2]]} castShadow>
          <boxGeometry args={[0.08, 0.9, 0.08]} />
          <meshStandardMaterial color="#3d2817" roughness={0.8} />
        </mesh>
      ))}
      {/* Lower shelf */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[2.3, 0.05, 0.7]} />
        <meshStandardMaterial color="#5C4033" roughness={0.9} />
      </mesh>
      {/* Vise on corner */}
      <mesh position={[1.0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.15, 0.2, 0.25]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// --- Garage Shelving Unit ---
export function ProceduralGarageShelving() {
  const shelfCount = 4;
  const height = 2.4;
  const width = 1.5;
  const depth = 0.5;
  
  return (
    <group>
      {/* Vertical posts */}
      {[[-width/2 + 0.05, 0], [width/2 - 0.05, 0]].map((pos, i) => (
        <mesh key={i} position={[pos[0], height/2, pos[1]]} castShadow>
          <boxGeometry args={[0.05, height, 0.05]} />
          <meshStandardMaterial color="#666" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* Shelves */}
      {Array.from({ length: shelfCount }).map((_, i) => (
        <mesh key={`shelf-${i}`} position={[0, 0.3 + i * (height / shelfCount), 0]} castShadow receiveShadow>
          <boxGeometry args={[width, 0.03, depth]} />
          <meshStandardMaterial color="#555" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Some boxes on shelves */}
      <mesh position={[-0.3, 0.5, 0]} castShadow>
        <boxGeometry args={[0.3, 0.25, 0.3]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 1.1, 0]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.35]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.8} />
      </mesh>
    </group>
  );
}

// --- Water Heater ---
export function ProceduralWaterHeater() {
  return (
    <group>
      {/* Main tank (cylinder) */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 1.8, 16]} />
        <meshStandardMaterial color="#E8E8E8" roughness={0.4} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.1, 16]} />
        <meshStandardMaterial color="#CCC" roughness={0.3} />
      </mesh>
      {/* Pipes on top */}
      <mesh position={[-0.15, 2.1, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.15, 2.1, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#c44" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Control panel */}
      <mesh position={[0, 0.5, 0.36]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.02]} />
        <meshStandardMaterial color="#333" roughness={0.6} />
      </mesh>
    </group>
  );
}

// --- Simple Car (Placeholder) ---
export function ProceduralCar() {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.6, 4]} />
        <meshStandardMaterial color="#1a1a8a" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 1.0, -0.3]} castShadow>
        <boxGeometry args={[1.8, 0.6, 2]} />
        <meshStandardMaterial color="#1a1a8a" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Windshield (front) */}
      <mesh position={[0, 1.0, 0.8]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.7, 0.5, 0.05]} />
        <meshStandardMaterial color="#88CCFF" opacity={0.5} transparent roughness={0.1} />
      </mesh>
      {/* Wheels */}
      {[[-0.9, 0.25, 1.3], [0.9, 0.25, 1.3], [-0.9, 0.25, -1.3], [0.9, 0.25, -1.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#222" roughness={0.9} />
        </mesh>
      ))}
      {/* Headlights */}
      <mesh position={[-0.6, 0.5, 2.01]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color="#FFFFAA" emissive="#FFFFAA" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.6, 0.5, 2.01]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color="#FFFFAA" emissive="#FFFFAA" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// --- Gas Cans (Group) ---
export function ProceduralGasCans() {
  return (
    <group>
      {/* Gas can 1 (red) */}
      <mesh position={[-0.2, 0.25, 0]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.15]} />
        <meshStandardMaterial color="#cc2222" roughness={0.6} />
      </mesh>
      {/* Spout */}
      <mesh position={[-0.2, 0.55, 0.05]} rotation={[0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      {/* Gas can 2 (yellow - diesel) */}
      <mesh position={[0.2, 0.25, 0.1]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.15]} />
        <meshStandardMaterial color="#cccc22" roughness={0.6} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.2, 0.55, 0.1]} castShadow>
        <boxGeometry args={[0.18, 0.05, 0.03]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
    </group>
  );
}

// --- Tool Pegboard ---
export function ProceduralToolPegboard() {
  return (
    <group>
      {/* Board - base size (scaled 2x in constants) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.6, 0.03]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
      
      {/* Pegboard holes pattern (decorative) */}
      {Array.from({ length: 20 }).map((_, i) => (
        Array.from({ length: 12 }).map((_, j) => (
          <mesh key={`hole-${i}-${j}`} position={[-1.1 + i * 0.12, -0.7 + j * 0.13, 0.016]}>
            <circleGeometry args={[0.012, 6]} />
            <meshStandardMaterial color="#6B5344" />
          </mesh>
        ))
      ))}
      
      {/* === ROW 1: TOP ROW - Power Tools & Large Tools === */}
      
      {/* Cordless Drill */}
      <group position={[-1.0, 0.5, 0.05]}>
        {/* Body */}
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.08, 0.06]} />
          <meshStandardMaterial color="#FFD700" roughness={0.4} />
        </mesh>
        {/* Handle */}
        <mesh position={[0, -0.08, 0]} castShadow>
          <boxGeometry args={[0.06, 0.12, 0.05]} />
          <meshStandardMaterial color="#333" roughness={0.6} />
        </mesh>
        {/* Chuck */}
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.025, 0.02, 0.06, 12]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Drill bit */}
        <mesh position={[0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.08, 8]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Hammer */}
      <group position={[-0.7, 0.45, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.28, 0.025]} />
          <meshStandardMaterial color="#5C4033" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.14, 0.06, 0.04]} />
          <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      
      {/* Claw hammer */}
      <group position={[-0.5, 0.45, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.055, 0.26, 0.02]} />
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.1, 0.055, 0.03]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.04, 0.19, 0]} rotation={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.03, 0.05, 0.015]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Rubber mallet */}
      <group position={[-0.3, 0.45, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.05, 0.25, 0.02]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
      </group>
      
      {/* Hand saw */}
      <group position={[0.1, 0.55, 0.05]}>
        <mesh position={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.06, 0.02]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.08, 0.008]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.035, 0]} castShadow>
          <boxGeometry args={[0.33, 0.008, 0.01]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Hacksaw */}
      <group position={[0.55, 0.55, 0.05]}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[0.25, 0.008, 0.015]} />
          <meshStandardMaterial color="#ff6600" roughness={0.5} />
        </mesh>
        <mesh position={[0.12, -0.04, 0]} castShadow>
          <boxGeometry args={[0.008, 0.08, 0.015]} />
          <meshStandardMaterial color="#ff6600" roughness={0.5} />
        </mesh>
        {/* Handle */}
        <mesh position={[-0.14, -0.03, 0]} castShadow>
          <boxGeometry args={[0.06, 0.04, 0.025]} />
          <meshStandardMaterial color="#333" roughness={0.6} />
        </mesh>
        {/* Blade */}
        <mesh position={[0, -0.08, 0]} castShadow>
          <boxGeometry args={[0.22, 0.015, 0.003]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Level */}
      <group position={[0.95, 0.55, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.045, 0.025]} />
          <meshStandardMaterial color="#FFD700" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.015]} castShadow>
          <boxGeometry args={[0.06, 0.025, 0.012]} />
          <meshStandardMaterial color="#88ff88" transparent opacity={0.7} />
        </mesh>
      </group>
      
      {/* === ROW 2: UPPER-MIDDLE - Wrenches & Pliers === */}
      
      {/* Combination wrenches (set of 6 sizes) */}
      {[-1.0, -0.88, -0.76, -0.64, -0.52, -0.4].map((x, i) => (
        <group key={`wrench-${i}`} position={[x, 0.15, 0.05]}>
          <mesh rotation={[0, 0, 0.1]} castShadow>
            <boxGeometry args={[0.02 + i * 0.005, 0.16 + i * 0.025, 0.012]} />
            <meshStandardMaterial color="#888" metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.09 + i * 0.012, 0]} rotation={[0, 0, 0.1]} castShadow>
            <boxGeometry args={[0.03 + i * 0.006, 0.015, 0.01]} />
            <meshStandardMaterial color="#888" metalness={0.85} roughness={0.15} />
          </mesh>
        </group>
      ))}
      
      {/* Adjustable wrench (large) */}
      <group position={[-0.2, 0.15, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.035, 0.24, 0.015]} />
          <meshStandardMaterial color="#777" metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0.018, 0.13, 0]} castShadow>
          <boxGeometry args={[0.02, 0.04, 0.012]} />
          <meshStandardMaterial color="#666" metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.08, 0.012]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.008, 12]} />
          <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      
      {/* Pipe wrench */}
      <group position={[0, 0.15, 0.05]}>
        <mesh rotation={[0, 0, -0.1]} castShadow>
          <boxGeometry args={[0.04, 0.28, 0.018]} />
          <meshStandardMaterial color="#cc2222" roughness={0.5} />
        </mesh>
        <mesh position={[0.025, 0.15, 0]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[0.015, 0.08, 0.015]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Pliers */}
      <group position={[0.25, 0.1, 0.05]}>
        <mesh position={[-0.015, -0.06, 0]} rotation={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[0.02, 0.12, 0.016]} />
          <meshStandardMaterial color="#cc2222" roughness={0.6} />
        </mesh>
        <mesh position={[0.015, -0.06, 0]} rotation={[0, 0, -0.1]} castShadow>
          <boxGeometry args={[0.02, 0.12, 0.016]} />
          <meshStandardMaterial color="#cc2222" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[0.03, 0.08, 0.012]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Needle-nose pliers */}
      <group position={[0.42, 0.1, 0.05]}>
        <mesh position={[-0.012, -0.05, 0]} rotation={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[0.018, 0.1, 0.014]} />
          <meshStandardMaterial color="#ff6600" roughness={0.5} />
        </mesh>
        <mesh position={[0.012, -0.05, 0]} rotation={[0, 0, -0.08]} castShadow>
          <boxGeometry args={[0.018, 0.1, 0.014]} />
          <meshStandardMaterial color="#ff6600" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.012, 0.1, 0.008]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Wire cutters */}
      <group position={[0.58, 0.1, 0.05]}>
        <mesh position={[-0.012, -0.05, 0]} rotation={[0, 0, 0.12]} castShadow>
          <boxGeometry args={[0.016, 0.1, 0.014]} />
          <meshStandardMaterial color="#4444cc" roughness={0.5} />
        </mesh>
        <mesh position={[0.012, -0.05, 0]} rotation={[0, 0, -0.12]} castShadow>
          <boxGeometry args={[0.016, 0.1, 0.014]} />
          <meshStandardMaterial color="#4444cc" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.03, 0]} castShadow>
          <boxGeometry args={[0.025, 0.05, 0.01]} />
          <meshStandardMaterial color="#555" metalness={0.85} roughness={0.15} />
        </mesh>
      </group>
      
      {/* Locking pliers (vise-grip) */}
      <group position={[0.75, 0.1, 0.05]}>
        <mesh position={[0, -0.04, 0]} castShadow>
          <boxGeometry args={[0.025, 0.1, 0.018]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.02, -0.08, 0]} castShadow>
          <boxGeometry args={[0.015, 0.04, 0.015]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[0.02, 0.06, 0.012]} />
          <meshStandardMaterial color="#666" metalness={0.85} roughness={0.15} />
        </mesh>
      </group>
      
      {/* C-clamp */}
      <group position={[0.95, 0.1, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.1, 0.02]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.03, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.08, 0.018]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.05, 8]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* === ROW 3: LOWER-MIDDLE - Screwdrivers & Precision Tools === */}
      
      {/* Screwdriver set (8 different) */}
      {[-1.0, -0.88, -0.76, -0.64, -0.52, -0.4, -0.28, -0.16].map((x, i) => (
        <group key={`screwdriver-${i}`} position={[x, -0.25, 0.05]}>
          <mesh castShadow>
            <boxGeometry args={[0.022, 0.08, 0.02]} />
            <meshStandardMaterial 
              color={['#cc4444', '#44cc44', '#4444cc', '#cccc44', '#cc44cc', '#44cccc', '#ff8800', '#888888'][i]} 
              roughness={0.5} 
            />
          </mesh>
          <mesh position={[0, 0.09 + i * 0.01, 0]} castShadow>
            <boxGeometry args={[0.012, 0.1 + i * 0.02, 0.01]} />
            <meshStandardMaterial color="#888" metalness={0.85} roughness={0.15} />
          </mesh>
        </group>
      ))}
      
      {/* Precision screwdriver set */}
      <group position={[0.1, -0.25, 0.05]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <group key={`precision-${i}`} position={[i * 0.03 - 0.075, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.006, 0.006, 0.06, 8]} />
              <meshStandardMaterial color="#333" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.05, 0]} castShadow>
              <cylinderGeometry args={[0.003, 0.003, 0.04, 6]} />
              <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Allen key set (hex wrenches) - L-shaped */}
      <group position={[0.35, -0.25, 0.05]}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <group key={`allen-${i}`} position={[i * 0.018 - 0.06, i * 0.012, 0]}>
            <mesh rotation={[0, 0, Math.PI / 6]} castShadow>
              <boxGeometry args={[0.006 + i * 0.0015, 0.06 + i * 0.01, 0.006 + i * 0.0015]} />
              <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Torx set */}
      <group position={[0.55, -0.25, 0.05]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <group key={`torx-${i}`} position={[i * 0.025 - 0.06, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.015, 0.07, 0.015]} />
              <meshStandardMaterial color="#4444aa" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.055, 0]} castShadow>
              <boxGeometry args={[0.008, 0.04, 0.008]} />
              <meshStandardMaterial color="#888" metalness={0.85} roughness={0.15} />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Utility knife */}
      <group position={[0.78, -0.25, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.03, 0.012]} />
          <meshStandardMaterial color="#555" roughness={0.6} />
        </mesh>
        <mesh position={[0.055, 0, 0]} castShadow>
          <boxGeometry args={[0.025, 0.02, 0.006]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Chisel set */}
      <group position={[0.98, -0.2, 0.05]}>
        {[0, 1, 2].map((i) => (
          <group key={`chisel-${i}`} position={[i * 0.04 - 0.04, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.02, 0.08, 0.015]} />
              <meshStandardMaterial color="#8B4513" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.06, 0]} castShadow>
              <boxGeometry args={[0.015 + i * 0.005, 0.05, 0.008]} />
              <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* === ROW 4: BOTTOM ROW - Supplies & Accessories === */}
      
      {/* Tape measure */}
      <group position={[-1.0, -0.55, 0.05]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
          <meshStandardMaterial color="#ff6600" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.02, 0.035]} castShadow>
          <boxGeometry args={[0.015, 0.012, 0.015]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
      
      {/* Electrical tape roll */}
      <group position={[-0.85, -0.55, 0.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.025, 0.012, 8, 16]} />
          <meshStandardMaterial color="#111" roughness={0.4} />
        </mesh>
      </group>
      
      {/* Duct tape roll */}
      <group position={[-0.68, -0.52, 0.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.035, 0.015, 8, 16]} />
          <meshStandardMaterial color="#888" roughness={0.5} />
        </mesh>
      </group>
      
      {/* Masking tape */}
      <group position={[-0.5, -0.52, 0.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.03, 0.012, 8, 16]} />
          <meshStandardMaterial color="#f5deb3" roughness={0.6} />
        </mesh>
      </group>
      
      {/* Scissors */}
      <group position={[-0.32, -0.55, 0.05]}>
        <mesh position={[-0.015, 0.03, 0]} rotation={[0, 0, 0.15]} castShadow>
          <boxGeometry args={[0.012, 0.08, 0.006]} />
          <meshStandardMaterial color="#888" metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0.015, 0.03, 0]} rotation={[0, 0, -0.15]} castShadow>
          <boxGeometry args={[0.012, 0.08, 0.006]} />
          <meshStandardMaterial color="#888" metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[-0.02, -0.03, 0]} castShadow>
          <torusGeometry args={[0.02, 0.006, 8, 12]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
        <mesh position={[0.02, -0.03, 0]} castShadow>
          <torusGeometry args={[0.02, 0.006, 8, 12]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
      </group>
      
      {/* Flashlight */}
      <group position={[-0.1, -0.55, 0.05]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.12, 12]} />
          <meshStandardMaterial color="#222" roughness={0.4} />
        </mesh>
        <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.028, 0.02, 0.03, 12]} />
          <meshStandardMaterial color="#333" roughness={0.4} />
        </mesh>
        <mesh position={[0.085, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <circleGeometry args={[0.024, 12]} />
          <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.3} />
        </mesh>
      </group>
      
      {/* Voltage tester */}
      <group position={[0.1, -0.55, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.025, 0.1, 0.015]} />
          <meshStandardMaterial color="#ff4444" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.008, 0.03, 0.008]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Stud finder */}
      <group position={[0.28, -0.55, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.08, 0.02]} />
          <meshStandardMaterial color="#444" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.03, 0.012]} castShadow>
          <circleGeometry args={[0.01, 8]} />
          <meshStandardMaterial color="#44ff44" emissive="#44ff44" emissiveIntensity={0.3} />
        </mesh>
      </group>
      
      {/* Wire stripper */}
      <group position={[0.48, -0.55, 0.05]}>
        <mesh position={[-0.015, 0, 0]} rotation={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[0.02, 0.12, 0.015]} />
          <meshStandardMaterial color="#cc4444" roughness={0.5} />
        </mesh>
        <mesh position={[0.015, 0, 0]} rotation={[0, 0, -0.1]} castShadow>
          <boxGeometry args={[0.02, 0.12, 0.015]} />
          <meshStandardMaterial color="#cc4444" roughness={0.5} />
        </mesh>
      </group>
      
      {/* Multimeter */}
      <group position={[0.7, -0.52, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.1, 0.025]} />
          <meshStandardMaterial color="#FFD700" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.015, 0.015]} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.005]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* Dial */}
        <mesh position={[0, -0.025, 0.015]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.008, 12]} />
          <meshStandardMaterial color="#888" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
      
      {/* Safety glasses */}
      <group position={[0.92, -0.55, 0.05]}>
        {/* Lenses */}
        <mesh position={[-0.025, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 0.025, 0.005]} />
          <meshStandardMaterial color="#88ccff" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.025, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 0.025, 0.005]} />
          <meshStandardMaterial color="#88ccff" transparent opacity={0.5} />
        </mesh>
        {/* Frame */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.01, 0.015, 0.005]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.055, 0, 0.02]} castShadow>
          <boxGeometry args={[0.04, 0.008, 0.005]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
        <mesh position={[0.055, 0, 0.02]} castShadow>
          <boxGeometry args={[0.04, 0.008, 0.005]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
      </group>
      
      {/* Work gloves */}
      <group position={[1.08, -0.52, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.1, 0.02]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        <mesh position={[0.035, 0.02, 0]} castShadow>
          <boxGeometry args={[0.02, 0.04, 0.015]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
      </group>
      
      {/* Hanging hooks (decorative) */}
      {[-1.1, -0.8, -0.5, -0.2, 0.1, 0.4, 0.7, 1.0].map((x, i) => (
        <mesh key={`hook-${i}`} position={[x, 0.7, 0.025]} castShadow>
          <boxGeometry args={[0.012, 0.025, 0.035]} />
          <meshStandardMaterial color="#666" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// --- Trash Bin (for oily rags) ---
export function ProceduralTrashBin() {
  return (
    <group>
      {/* Bin body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.7, 12]} />
        <meshStandardMaterial color="#444" roughness={0.7} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <torusGeometry args={[0.25, 0.02, 8, 16]} />
        <meshStandardMaterial color="#555" roughness={0.6} />
      </mesh>
      {/* Oily rags peeking out */}
      <mesh position={[0.1, 0.75, 0]} rotation={[0.2, 0.5, 0.3]} castShadow>
        <boxGeometry args={[0.15, 0.02, 0.2]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      <mesh position={[-0.05, 0.73, 0.08]} rotation={[-0.3, 0.2, 0.1]} castShadow>
        <boxGeometry args={[0.12, 0.02, 0.18]} />
        <meshStandardMaterial color="#555544" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ============================================
// PROPANE TANK (For Gas Leak Hazard)
// ============================================

/**
 * Propane Tank - Cylindrical gas tank with valve
 * Used for GasLeak hazard visualization
 */
export function ProceduralPropaneTank() {
  return (
    <group>
      {/* Main tank body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.7, 16]} />
        <meshStandardMaterial color="#2a6e2a" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Tank top dome */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2a6e2a" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Tank bottom dome */}
      <mesh position={[0, -0.02, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2a6e2a" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Valve on top */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Valve handle */}
      <mesh position={[0, 0.92, 0]} castShadow>
        <boxGeometry args={[0.12, 0.03, 0.03]} />
        <meshStandardMaterial color="#cc0000" roughness={0.6} />
      </mesh>
      {/* Handle grip */}
      <mesh position={[0.08, 0.5, 0]} castShadow>
        <boxGeometry args={[0.03, 0.25, 0.05]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0.35, 0.21]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.01]} />
        <meshStandardMaterial color="#fff" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ============================================
// GARAGE VISUAL PROPS (Decoration Only)
// ============================================

/**
 * Oil/Gasoline Puddle - Visual indicator of fuel spill
 * Place under gas_can_fire or car for environmental storytelling
 */
export function ProceduralPuddle() {
  return (
    <group>
      {/* Main puddle - irregular shape using multiple overlapping circles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.1} 
          metalness={0.6} 
          transparent 
          opacity={0.85} 
        />
      </mesh>
      {/* Secondary puddle blob */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.01, 0.3]} receiveShadow>
        <circleGeometry args={[0.5, 24]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.1} 
          metalness={0.6} 
          transparent 
          opacity={0.8} 
        />
      </mesh>
      {/* Small drip trail */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.4, 0.01, -0.5]} receiveShadow>
        <circleGeometry args={[0.3, 16]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.1} 
          metalness={0.6} 
          transparent 
          opacity={0.7} 
        />
      </mesh>
      {/* Rainbow sheen effect (gasoline look) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.1, 0.015, 0.1]} receiveShadow>
        <circleGeometry args={[0.6, 24]} />
        <meshStandardMaterial 
          color="#3a2a4a" 
          roughness={0.0} 
          metalness={0.9} 
          transparent 
          opacity={0.3} 
        />
      </mesh>
    </group>
  );
}

/**
 * Ladder - Hanging on wall or ceiling
 * Aluminum/silver step ladder
 */
export function ProceduralLadder() {
  const railHeight = 2.5;
  const railWidth = 0.5;
  const rungCount = 7;
  
  return (
    <group>
      {/* Left Rail */}
      <mesh position={[-railWidth / 2, 0, 0]} castShadow>
        <boxGeometry args={[0.05, railHeight, 0.03]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Right Rail */}
      <mesh position={[railWidth / 2, 0, 0]} castShadow>
        <boxGeometry args={[0.05, railHeight, 0.03]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Rungs */}
      {Array.from({ length: rungCount }).map((_, i) => {
        const yPos = (i / (rungCount - 1)) * (railHeight - 0.2) - (railHeight - 0.2) / 2;
        return (
          <mesh key={i} position={[0, yPos, 0]} castShadow>
            <boxGeometry args={[railWidth - 0.05, 0.03, 0.05]} />
            <meshStandardMaterial color="#A0A0A0" metalness={0.6} roughness={0.4} />
          </mesh>
        );
      })}
      
      {/* Wall mount hooks */}
      <mesh position={[-railWidth / 2, railHeight / 2 - 0.1, -0.05]} castShadow>
        <boxGeometry args={[0.08, 0.15, 0.1]} />
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[railWidth / 2, railHeight / 2 - 0.1, -0.05]} castShadow>
        <boxGeometry args={[0.08, 0.15, 0.1]} />
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * Motorcycle - Floor standing sport bike
 * Detailed geometric representation
 */
export function ProceduralMotorcycle() {
  const bodyColor = "#1a1a1a"; // Black
  const accentColor = "#cc0000"; // Red accents
  const chromeColor = "#c0c0c0";
  const wheelRadius = 0.35;
  
  return (
    <group>
      {/* === WHEELS === */}
      {/* Front Wheel */}
      <group position={[0, wheelRadius, 0.9]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[wheelRadius, 0.06, 12, 24]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        {/* Front Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[wheelRadius - 0.08, wheelRadius - 0.08, 0.08, 16]} />
          <meshStandardMaterial color={chromeColor} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Front Axle */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
          <meshStandardMaterial color={chromeColor} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Rear Wheel */}
      <group position={[0, wheelRadius, -0.7]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[wheelRadius, 0.08, 12, 24]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        {/* Rear Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[wheelRadius - 0.1, wheelRadius - 0.1, 0.1, 16]} />
          <meshStandardMaterial color={chromeColor} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Rear Axle */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.25, 8]} />
          <meshStandardMaterial color={chromeColor} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* === FRAME === */}
      {/* Main Frame - Lower */}
      <mesh position={[0, 0.4, 0.1]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 0.08, 1.2]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} />
      </mesh>
      {/* Main Frame - Upper diagonal */}
      <mesh position={[0, 0.55, 0.3]} rotation={[-0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.06, 0.8]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} />
      </mesh>
      
      {/* === FUEL TANK === */}
      <mesh position={[0, 0.7, 0.15]} castShadow>
        <boxGeometry args={[0.35, 0.2, 0.5]} />
        <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Tank top curve */}
      <mesh position={[0, 0.82, 0.15]} castShadow>
        <boxGeometry args={[0.28, 0.06, 0.4]} />
        <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.4} />
      </mesh>
      
      {/* === SEAT === */}
      <mesh position={[0, 0.72, -0.25]} castShadow>
        <boxGeometry args={[0.28, 0.08, 0.5]} />
        <meshStandardMaterial color="#222" roughness={0.9} />
      </mesh>
      {/* Seat back (passenger) */}
      <mesh position={[0, 0.68, -0.5]} castShadow>
        <boxGeometry args={[0.24, 0.06, 0.2]} />
        <meshStandardMaterial color="#222" roughness={0.9} />
      </mesh>
      
      {/* === FRONT FORK === */}
      {/* Left Fork */}
      <mesh position={[-0.12, 0.5, 0.7]} rotation={[0.3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
        <meshStandardMaterial color={chromeColor} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Right Fork */}
      <mesh position={[0.12, 0.5, 0.7]} rotation={[0.3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
        <meshStandardMaterial color={chromeColor} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Fork top bracket */}
      <mesh position={[0, 0.75, 0.6]} castShadow>
        <boxGeometry args={[0.3, 0.06, 0.08]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} />
      </mesh>
      
      {/* === HANDLEBARS === */}
      <mesh position={[0, 0.85, 0.55]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.03, 0.04]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} />
      </mesh>
      {/* Left Grip */}
      <mesh position={[-0.32, 0.85, 0.55]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.1, 8]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      {/* Right Grip */}
      <mesh position={[0.32, 0.85, 0.55]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.1, 8]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      {/* Mirrors */}
      <mesh position={[-0.35, 0.9, 0.55]} castShadow>
        <boxGeometry args={[0.08, 0.06, 0.02]} />
        <meshStandardMaterial color="#222" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.35, 0.9, 0.55]} castShadow>
        <boxGeometry args={[0.08, 0.06, 0.02]} />
        <meshStandardMaterial color="#222" roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* === HEADLIGHT === */}
      <mesh position={[0, 0.65, 0.95]} castShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffffaa" emissiveIntensity={0.3} />
      </mesh>
      
      {/* === EXHAUST === */}
      <mesh position={[0.2, 0.25, -0.3]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.8, 12]} />
        <meshStandardMaterial color={chromeColor} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Exhaust tip */}
      <mesh position={[0.2, 0.25, -0.75]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.15, 12]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* === ENGINE BLOCK === */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.25, 0.2, 0.35]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Engine cylinder */}
      <mesh position={[0.15, 0.45, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.15, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.4} />
      </mesh>
      
      {/* === REAR FENDER === */}
      <mesh position={[0, 0.55, -0.6]} castShadow>
        <boxGeometry args={[0.2, 0.04, 0.3]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} />
      </mesh>
      
      {/* === TAIL LIGHT === */}
      <mesh position={[0, 0.6, -0.72]} castShadow>
        <boxGeometry args={[0.12, 0.04, 0.02]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
      
      {/* === KICKSTAND === */}
      <mesh position={[-0.15, 0.15, -0.1]} rotation={[0, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} />
        <meshStandardMaterial color="#444" roughness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Wall-Mounted Bike - Hung on wall hooks
 * Simple geometric representation
 */
export function ProceduralHangingBike() {
  const wheelRadius = 0.35;
  const frameColor = "#cc3333"; // Red bike
  
  return (
    <group>
      {/* Wall mount bracket */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.15, 0.8, 0.08]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Top hook */}
      <mesh position={[0.08, 0.6, 0]} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.06]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Bottom hook */}
      <mesh position={[0.08, 0.2, 0]} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.06]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Bike frame - offset from wall */}
      <group position={[0.25, 0, 0]}>
        {/* Front Wheel */}
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[wheelRadius, 0.03, 8, 24]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
        {/* Front Hub */}
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
          <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Rear Wheel */}
        <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[wheelRadius, 0.03, 8, 24]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
        {/* Rear Hub */}
        <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
          <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Frame - Main tube (vertical when hung) */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
          <meshStandardMaterial color={frameColor} roughness={0.5} />
        </mesh>
        
        {/* Frame - Cross tube */}
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
          <meshStandardMaterial color={frameColor} roughness={0.5} />
        </mesh>
        
        {/* Seat */}
        <mesh position={[0.1, -0.2, 0]} castShadow>
          <boxGeometry args={[0.08, 0.15, 0.1]} />
          <meshStandardMaterial color="#222" roughness={0.9} />
        </mesh>
        
        {/* Handlebars */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.08, 0.04, 0.35]} />
          <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================
// ADDITIONAL GARAGE EQUIPMENT
// ============================================

/**
 * Shop Vac - Industrial vacuum cleaner
 */
export function ProceduralShopVac() {
  return (
    <group>
      {/* Main tank body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.7, 16]} />
        <meshStandardMaterial color="#cc2222" roughness={0.5} />
      </mesh>
      {/* Tank lid */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.05, 16]} />
        <meshStandardMaterial color="#222" roughness={0.6} />
      </mesh>
      {/* Motor housing on top */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.2, 16]} />
        <meshStandardMaterial color="#222" roughness={0.6} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 1.0, 0]}>
        <torusGeometry args={[0.1, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#333" roughness={0.7} />
      </mesh>
      {/* Hose connection port */}
      <mesh position={[0.25, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.05, 0.08, 12]} />
        <meshStandardMaterial color="#333" roughness={0.6} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.15, 0.08, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
      <mesh position={[-0.15, 0.08, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
      {/* Front caster */}
      <mesh position={[0.18, 0.05, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * Fire Extinguisher Cabinet - Wall-mounted glass-front cabinet
 */
export function ProceduralExtinguisherCabinet() {
  return (
    <group>
      {/* Cabinet body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.35, 0.6, 0.15]} />
        <meshStandardMaterial color="#cc2222" roughness={0.5} />
      </mesh>
      {/* Glass door (no shadow) */}
      <mesh position={[0, 0, 0.076]}>
        <boxGeometry args={[0.28, 0.5, 0.005]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      {/* Door frame */}
      <mesh position={[0, 0.26, 0.075]}>
        <boxGeometry args={[0.32, 0.02, 0.02]} />
        <meshStandardMaterial color="#aa1111" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.26, 0.075]}>
        <boxGeometry args={[0.32, 0.02, 0.02]} />
        <meshStandardMaterial color="#aa1111" roughness={0.5} />
      </mesh>
      <mesh position={[-0.15, 0, 0.075]}>
        <boxGeometry args={[0.02, 0.52, 0.02]} />
        <meshStandardMaterial color="#aa1111" roughness={0.5} />
      </mesh>
      <mesh position={[0.15, 0, 0.075]}>
        <boxGeometry args={[0.02, 0.52, 0.02]} />
        <meshStandardMaterial color="#aa1111" roughness={0.5} />
      </mesh>
      {/* Extinguisher inside */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 12]} />
        <meshStandardMaterial color="#cc0000" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.08, 8]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      {/* "FIRE EXTINGUISHER" label area" */}
      <mesh position={[0, 0.35, 0.08]}>
        <boxGeometry args={[0.25, 0.06, 0.005]} />
        <meshStandardMaterial color="#fff" roughness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * First Aid Kit - Wall-mounted first aid station
 */
export function ProceduralFirstAidKit() {
  return (
    <group>
      {/* Box body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.25, 0.1]} />
        <meshStandardMaterial color="#fff" roughness={0.5} />
      </mesh>
      {/* Red cross - horizontal */}
      <mesh position={[0, 0, 0.051]}>
        <boxGeometry args={[0.15, 0.04, 0.005]} />
        <meshStandardMaterial color="#cc0000" roughness={0.5} />
      </mesh>
      {/* Red cross - vertical */}
      <mesh position={[0, 0, 0.051]}>
        <boxGeometry args={[0.04, 0.15, 0.005]} />
        <meshStandardMaterial color="#cc0000" roughness={0.5} />
      </mesh>
      {/* Handle/latch */}
      <mesh position={[0.12, 0, 0.055]}>
        <boxGeometry args={[0.02, 0.06, 0.02]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Hinge */}
      <mesh position={[-0.14, 0, 0.04]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Metal Locker - Employee storage locker
 */
export function ProceduralLocker() {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.4, 1.8, 0.45]} />
        <meshStandardMaterial color="#666" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Door panel */}
      <mesh position={[0, 0.9, 0.226]}>
        <boxGeometry args={[0.36, 1.7, 0.02]} />
        <meshStandardMaterial color="#555" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Vents at top */}
      {[-0.08, 0, 0.08].map((x, i) => (
        <mesh key={`vent-${i}`} position={[x, 1.6, 0.24]}>
          <boxGeometry args={[0.06, 0.15, 0.01]} />
          <meshStandardMaterial color="#333" roughness={0.7} />
        </mesh>
      ))}
      {/* Handle */}
      <mesh position={[0.14, 1.0, 0.25]}>
        <boxGeometry args={[0.03, 0.12, 0.03]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Lock */}
      <mesh position={[0.14, 0.85, 0.25]}>
        <cylinderGeometry args={[0.015, 0.015, 0.03, 8]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.15, 0.03, -0.18]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial color="#444" roughness={0.7} />
      </mesh>
      <mesh position={[0.15, 0.03, -0.18]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial color="#444" roughness={0.7} />
      </mesh>
      <mesh position={[-0.15, 0.03, 0.18]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial color="#444" roughness={0.7} />
      </mesh>
      <mesh position={[0.15, 0.03, 0.18]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial color="#444" roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * Hose Reel - Wall-mounted air/water hose reel
 */
export function ProceduralHoseReel() {
  return (
    <group>
      {/* Wall mount bracket */}
      <mesh position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[0.4, 0.08, 0.1]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Reel drum */}
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        <meshStandardMaterial color="#cc4400" roughness={0.5} />
      </mesh>
      {/* Reel sides */}
      <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Hose wrapped (simplified as torus layers) */}
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.18, 0.02, 8, 24]} />
        <meshStandardMaterial color="#ff6600" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.16, 0.02, 8, 24]} />
        <meshStandardMaterial color="#ff6600" roughness={0.7} />
      </mesh>
      {/* Crank handle */}
      <mesh position={[0.28, 0, 0.15]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.12, 0.02, 0.02]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Floor Jack - Hydraulic floor jack
 */
export function ProceduralFloorJack() {
  return (
    <group>
      {/* Base frame */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[0.25, 0.08, 0.5]} />
        <meshStandardMaterial color="#cc2222" roughness={0.5} />
      </mesh>
      {/* Lifting arm */}
      <mesh position={[0, 0.15, -0.1]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.18, 0.06, 0.35]} />
        <meshStandardMaterial color="#cc2222" roughness={0.5} />
      </mesh>
      {/* Saddle (lifting pad) */}
      <mesh position={[0, 0.22, -0.2]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.04, 12]} />
        <meshStandardMaterial color="#222" roughness={0.6} />
      </mesh>
      {/* Hydraulic cylinder */}
      <mesh position={[0, 0.1, 0.05]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Handle socket */}
      <mesh position={[0, 0.12, 0.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
        <meshStandardMaterial color="#333" roughness={0.6} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.1, 0.04, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.04, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
      {/* Front casters */}
      <mesh position={[-0.08, 0.03, -0.2]} castShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 0.03, -0.2]} castShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * Air Compressor - Tank-style compressor
 */
export function ProceduralAirCompressor() {
  return (
    <group>
      {/* Main tank (horizontal) */}
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.7, 16]} />
        <meshStandardMaterial color="#cc2222" roughness={0.4} />
      </mesh>
      {/* Tank end caps */}
      <mesh position={[-0.36, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <sphereGeometry args={[0.25, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#cc2222" roughness={0.4} />
      </mesh>
      <mesh position={[0.36, 0.35, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <sphereGeometry args={[0.25, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#cc2222" roughness={0.4} />
      </mesh>
      {/* Motor/pump on top */}
      <mesh position={[0.15, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.25, 12]} />
        <meshStandardMaterial color="#333" roughness={0.6} />
      </mesh>
      {/* Pump head */}
      <mesh position={[-0.1, 0.68, 0]} castShadow>
        <boxGeometry args={[0.15, 0.2, 0.12]} />
        <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Pressure gauge */}
      <mesh position={[0, 0.62, 0.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.62, 0.22]} castShadow>
        <circleGeometry args={[0.035, 12]} />
        <meshStandardMaterial color="#fff" roughness={0.8} />
      </mesh>
      {/* Regulator knob */}
      <mesh position={[0.12, 0.62, 0.18]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
        <meshStandardMaterial color="#222" roughness={0.6} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.25, 0.1, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 12]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
      <mesh position={[-0.25, 0.1, -0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 12]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.35, 0.6, 0]} castShadow>
        <boxGeometry args={[0.04, 0.3, 0.04]} />
        <meshStandardMaterial color="#333" roughness={0.6} />
      </mesh>
      <mesh position={[0.35, 0.78, 0]} castShadow>
        <boxGeometry args={[0.08, 0.04, 0.2]} />
        <meshStandardMaterial color="#333" roughness={0.6} />
      </mesh>
      {/* Drain valve */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Tire Rack - Wall-mounted or freestanding tire storage
 */
export function ProceduralTireRack() {
  return (
    <group>
      {/* Frame - vertical posts */}
      <mesh position={[-0.4, 0.6, 0]} castShadow>
        <boxGeometry args={[0.05, 1.2, 0.05]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.4, 0.6, 0]} castShadow>
        <boxGeometry args={[0.05, 1.2, 0.05]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Horizontal bars */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.85, 0.04, 0.04]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.85, 0.04, 0.04]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.85, 0.04, 0.04]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Tires on rack (4 tires) */}
      {[0.35, 0.75, 1.15].map((y, i) => (
        <group key={`tire-row-${i}`}>
          <mesh position={[-0.15, y, 0.12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.15, 0.06, 8, 16]} />
            <meshStandardMaterial color="#222" roughness={0.9} />
          </mesh>
          {i < 2 && (
            <mesh position={[0.2, y, 0.12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.15, 0.06, 8, 16]} />
              <meshStandardMaterial color="#222" roughness={0.9} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

/**
 * Oil Drum Rack - 55-gallon drums on stand
 */
export function ProceduralOilDrumRack() {
  return (
    <group>
      {/* Rack frame */}
      <mesh position={[-0.35, 0.25, 0]} castShadow>
        <boxGeometry args={[0.05, 0.5, 0.5]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.35, 0.25, 0]} castShadow>
        <boxGeometry args={[0.05, 0.5, 0.5]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Cross support */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.75, 0.04, 0.04]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Oil drum 1 (blue) */}
      <mesh position={[-0.18, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial color="#2244aa" roughness={0.5} />
      </mesh>
      {/* Drum rim */}
      <mesh position={[-0.18, 0.45, 0.21]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.15, 0.015, 8, 16]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Oil drum 2 (black - motor oil) */}
      <mesh position={[0.18, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      <mesh position={[0.18, 0.45, 0.21]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.15, 0.015, 8, 16]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Warning label on drum */}
      <mesh position={[-0.18, 0.45, 0.16]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.005]} />
        <meshStandardMaterial color="#ffcc00" roughness={0.8} />
      </mesh>
      {/* Spigot/tap on drum */}
      <mesh position={[-0.18, 0.3, 0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.05, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * Oil Cans / Fluid Bottles - Collection of lubricants
 */
export function ProceduralOilCans() {
  return (
    <group>
      {/* Large oil container */}
      <mesh position={[-0.15, 0.15, 0]} castShadow>
        <boxGeometry args={[0.12, 0.3, 0.08]} />
        <meshStandardMaterial color="#333" roughness={0.5} />
      </mesh>
      <mesh position={[-0.15, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.02, 0.04, 8]} />
        <meshStandardMaterial color="#666" roughness={0.5} />
      </mesh>
      {/* Medium bottle (red - brake fluid) */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, 0.2, 12]} />
        <meshStandardMaterial color="#cc2222" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.02, 0.04, 8]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      {/* Small bottle (green - coolant) */}
      <mesh position={[0.12, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.035, 0.16, 12]} />
        <meshStandardMaterial color="#22aa22" roughness={0.4} />
      </mesh>
      <mesh position={[0.12, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.015, 0.04, 8]} />
        <meshStandardMaterial color="#fff" roughness={0.5} />
      </mesh>
      {/* Spray can (blue - WD-40 style) */}
      <mesh position={[0.22, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.2, 12]} />
        <meshStandardMaterial color="#2244cc" roughness={0.4} />
      </mesh>
      <mesh position={[0.22, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
        <meshStandardMaterial color="#cc0000" roughness={0.5} />
      </mesh>
      {/* Funnel */}
      <mesh position={[-0.25, 0.08, 0.05]} castShadow>
        <coneGeometry args={[0.05, 0.1, 12, 1, true]} />
        <meshStandardMaterial color="#ff6600" roughness={0.5} side={2} />
      </mesh>
      <mesh position={[-0.25, 0.01, 0.05]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.05, 8]} />
        <meshStandardMaterial color="#ff6600" roughness={0.5} />
      </mesh>
    </group>
  );
}

/**
 * Safety Cones - Traffic cones for marking areas
 */
export function ProceduralSafetyCones() {
  return (
    <group>
      {/* Cone 1 */}
      <group position={[-0.25, 0, 0]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.2, 0.02, 0.2]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <coneGeometry args={[0.08, 0.35, 12]} />
          <meshStandardMaterial color="#ff6600" roughness={0.5} />
        </mesh>
        {/* Reflective stripes */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <coneGeometry args={[0.065, 0.06, 12]} />
          <meshStandardMaterial color="#fff" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.12, 0]} castShadow>
          <coneGeometry args={[0.078, 0.06, 12]} />
          <meshStandardMaterial color="#fff" roughness={0.3} />
        </mesh>
      </group>
      {/* Cone 2 */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.2, 0.02, 0.2]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <coneGeometry args={[0.08, 0.35, 12]} />
          <meshStandardMaterial color="#ff6600" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <coneGeometry args={[0.065, 0.06, 12]} />
          <meshStandardMaterial color="#fff" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.12, 0]} castShadow>
          <coneGeometry args={[0.078, 0.06, 12]} />
          <meshStandardMaterial color="#fff" roughness={0.3} />
        </mesh>
      </group>
      {/* Cone 3 */}
      <group position={[0.25, 0, 0]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.2, 0.02, 0.2]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <coneGeometry args={[0.08, 0.35, 12]} />
          <meshStandardMaterial color="#ff6600" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <coneGeometry args={[0.065, 0.06, 12]} />
          <meshStandardMaterial color="#fff" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.12, 0]} castShadow>
          <coneGeometry args={[0.078, 0.06, 12]} />
          <meshStandardMaterial color="#fff" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
