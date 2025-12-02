import React from "react";

// --- MATERIALS ---
const materials = {
  chrome: <meshStandardMaterial color="#D0D0D0" roughness={0.2} metalness={0.8} />,
  whitePlastic: <meshStandardMaterial color="#F5F5F5" roughness={0.5} />,
  blackPlastic: <meshStandardMaterial color="#111111" roughness={0.8} />,
  screen: <meshStandardMaterial color="#050505" roughness={0.2} metalness={0.5} />,
  woodDark: <meshStandardMaterial color="#5C4033" roughness={0.9} />,
  woodLight: <meshStandardMaterial color="#8B5A2B" roughness={0.9} />,
  glass: <meshStandardMaterial color="#88CCFF" opacity={0.3} transparent />
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
