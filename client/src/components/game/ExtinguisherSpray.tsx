import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { InteractiveObjectType } from "@/lib/types";
import { useAudio } from "@/lib/stores/useAudio";
import { useExtinguisherSound } from "@/lib/hooks/useExtinguisherSound";

interface ExtinguisherSprayProps {
  active: boolean;
  extinguisherType?: InteractiveObjectType;
}

// --- OPTIMIZATION 1: Singleton Texture Cache ---
// Created once, reused forever.
let cachedMistTexture: THREE.CanvasTexture | null = null;

function getMistTexture() {
  if (cachedMistTexture) return cachedMistTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.5)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }

  cachedMistTexture = new THREE.CanvasTexture(canvas);
  return cachedMistTexture;
}

// --- OPTIMIZATION 2: Singleton Geometry Cache ---
// The particle "cloud" shape is generic. We generate it once and reuse it.
// This saves CPU cycles and memory allocation every time the player spawns.
let cachedGeometry: THREE.BufferGeometry | null = null;

function getSprayGeometry() {
  if (cachedGeometry) return cachedGeometry;

  const count = 300;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count * 3); 

  for (let i = 0; i < count; i++) {
    randoms[i * 3 + 0] = Math.random();             // Phase
    randoms[i * 3 + 1] = 0.8 + Math.random() * 0.4; // Speed var
    randoms[i * 3 + 2] = Math.random();             // Spread var
  }

  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
  
  cachedGeometry = geo;
  return cachedGeometry;
}

export default function ExtinguisherSpray({ 
  active, 
  extinguisherType = InteractiveObjectType.FireExtinguisher 
}: ExtinguisherSprayProps) {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const { isMuted } = useAudio();
  const { startSpray, stopSpray } = useExtinguisherSound();

  // 1. Sound Logic
  useEffect(() => {
    if (active && !isMuted) {
      startSpray();
    } else {
      stopSpray();
    }
    return () => stopSpray();
  }, [active, isMuted, startSpray, stopSpray]);

  // 2. Spray Colors
  const sprayColor = useMemo(() => {
    switch (extinguisherType) {
      case InteractiveObjectType.WaterExtinguisher:
        return new THREE.Vector3(0.7, 0.85, 1.0);
      case InteractiveObjectType.FoamExtinguisher:
        return new THREE.Vector3(0.95, 0.95, 0.85);
      case InteractiveObjectType.CO2Extinguisher:
        return new THREE.Vector3(0.9, 0.9, 0.95);
      case InteractiveObjectType.PowderExtinguisher:
        return new THREE.Vector3(1.0, 1.0, 0.9);
      case InteractiveObjectType.WetChemicalExtinguisher:
        return new THREE.Vector3(0.85, 0.95, 0.85);
      default:
        return new THREE.Vector3(1.0, 1.0, 1.0);
    }
  }, [extinguisherType]);

  // 3. Retrieve Cached Assets
  const texture = useMemo(() => getMistTexture(), []);
  const geometry = useMemo(() => getSprayGeometry(), []);

  // 4. Shader Material
  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: texture },
      uColor: { value: sprayColor }
    },
    vertexShader: `
      uniform float uTime;
      attribute vec3 aRandom; 
      varying float vAlpha;

      void main() {
        float t = mod(uTime * 3.0 + aRandom.x * 10.0, 1.0);
        vec3 pos = vec3(0.0);
        
        float distance = t * 8.0; 
        pos.z = -distance;
        
        float spreadAmount = distance * 0.12; 
        float angle = aRandom.z * 6.28;
        pos.x += cos(angle) * spreadAmount;
        pos.y += sin(angle) * spreadAmount;

        pos.y -= t * t * 1.5;

        float size = 80.0 * (0.3 + t * 5.0); 

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        gl_PointSize = size / -mvPosition.z;
        vAlpha = (1.0 - smoothstep(0.7, 1.0, t)) * smoothstep(0.0, 0.1, t);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec3 uColor;
      varying float vAlpha;
      
      void main() {
        vec4 tex = texture2D(uTexture, gl_PointCoord);
        if (tex.a < 0.01) discard;
        gl_FragColor = vec4(uColor, tex.a * vAlpha * 0.5);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), [texture, sprayColor]);

  useEffect(() => {
    shaderRef.current = shaderMaterial;
  }, [shaderMaterial]);

  useFrame((state) => {
    // Only update uniform if actively spraying or visible
    if (shaderRef.current && active) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // OPTIMIZATION 3: "visible" toggle prevents remounting
  return (
    <points 
      geometry={geometry} 
      material={shaderMaterial} 
      frustumCulled={false} 
      visible={active} 
    />
  );
}
