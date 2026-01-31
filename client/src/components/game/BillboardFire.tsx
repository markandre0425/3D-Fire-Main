import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PositionalAudio } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/lib/stores/useGame";
import { useAudio } from "@/lib/stores/useAudio";

type FireShape = 'wide' | 'chaotic' | 'triangular';

interface BillboardFireProps {
  position?: [number, number, number];
  size?: number;
  intensity?: number;
  isActive?: boolean;
  shape?: FireShape;
  color?: string;
  opacity?: number;
  smokeMode?: boolean;
}

export default function BillboardFire({
  position = [0, 0, 0],
  size = 1,
  intensity = 1,
  isActive = true,
  shape = 'triangular',
  color,
  opacity = 1,
  smokeMode = false,
}: BillboardFireProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const { gl } = useThree();
  const gamePhase = useGame((state) => state.phase);
  const { isMuted } = useAudio();

  // Only play animation/audio if game is running and fire is active
  const shouldPlay = isActive && gamePhase === "playing";

  const getParticleCount = () => {
    const baseCount = Math.floor(intensity * 40) + 30;
    switch (shape) {
      case "wide":
        return Math.floor(baseCount * 1.5);
      case "chaotic":
        return Math.floor(baseCount * 1.2);
      case "triangular":
      default:
        return baseCount;
    }
  };

  const count = getParticleCount();

  const attributes = useMemo(() => {
    const randoms = new Float32Array(count * 3);
    const offsets = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      randoms[i * 3 + 0] = Math.random();
      randoms[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      randoms[i * 3 + 2] = Math.random();

      let x = 0;
      let z = 0;
      if (shape === "wide") {
        x = (Math.random() - 0.5) * 3.5 * size;
        z = (Math.random() - 0.5) * 0.5 * size;
      } else if (shape === "chaotic") {
        x = (Math.random() - 0.5) * 2.0 * size;
        z = (Math.random() - 0.5) * 2.0 * size;
      } else {
        const r = Math.random() * 0.5 * size;
        const angle = Math.random() * Math.PI * 2;
        x = Math.cos(angle) * r;
        z = Math.sin(angle) * r;
    }
    
      offsets[i * 3 + 0] = x;
      offsets[i * 3 + 1] = 0;
      offsets[i * 3 + 2] = z;
    }

    return { randoms, offsets };
  }, [count, shape, size]);

  const fireTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    if (smokeMode && color) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      if (rgb) {
        const r = parseInt(rgb[1], 16);
        const g = parseInt(rgb[2], 16);
        const b = parseInt(rgb[3], 16);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.7})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    } else {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.9)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy?.() ?? 1;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    return texture;
  }, [smokeMode, color, opacity, gl]);

  const geometry = useMemo(() => {
    const base = new THREE.PlaneGeometry(1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = base.index;
    geo.setAttribute("position", base.attributes.position);
    geo.setAttribute("uv", base.attributes.uv);
    return geo;
  }, []);

  // Force frustum culling off to prevent disappearing at angles
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.frustumCulled = false;
    }
  }, []);

  useEffect(() => {
    if (!geometry) return;
    geometry.setAttribute(
      "aRandom",
      new THREE.InstancedBufferAttribute(attributes.randoms, 3)
    );
    geometry.getAttribute("aRandom").needsUpdate = true;
    geometry.setAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(attributes.offsets, 3)
    );
    geometry.getAttribute("aOffset").needsUpdate = true;
    geometry.instanceCount = count;
    geometry.computeVertexNormals();
  }, [geometry, attributes, count]);

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: fireTexture },
          uGlobalSize: { value: size },
        uOpacity: { value: opacity },
      },
      vertexShader: `
        uniform float uTime;
          uniform float uGlobalSize;
        
          attribute vec3 aRandom;
          attribute vec3 aOffset;
        
        varying float vLife;
          varying vec2 vUv;
          varying float vAlphaMod;
        
        void main() {
            vUv = uv;
          float t = mod(uTime * aRandom.y + aRandom.x * 10.0, 1.0);
          vLife = t;
          
            vec3 localPos = vec3(0.0);
            float height = 2.5 * uGlobalSize;
            localPos.y = t * height;

            float wiggleSeed = aRandom.x * 20.0;
            float wiggle = 0.25 * uGlobalSize * t;
            localPos.x += sin(t * 8.0 + wiggleSeed) * wiggle;
            localPos.z += cos(t * 6.0 + wiggleSeed * 0.7) * wiggle;

            vec3 centerPos = aOffset + localPos;
            
            // --- BILLBOARD FIX: USE VIEW SPACE ALIGNMENT ---
            // 1. Transform instance center to View Space (relative to camera)
            vec4 mvPosition = modelViewMatrix * vec4(centerPos, 1.0);
          
            // 2. Scale logic
            float particleScale = 1.5 * uGlobalSize * (0.8 + aRandom.z * 0.4);
            if (t < 0.15) {
              particleScale *= t / 0.15;
          } else {
              particleScale *= 1.0 - (t - 0.15) * 0.2;
          }
          
            // 3. Offset in X/Y in VIEW space means "Flat against the screen"
            // This guarantees the fire always faces the camera regardless of rotation
            mvPosition.xy += position.xy * particleScale;
          
          gl_Position = projectionMatrix * mvPosition;
          
            vAlphaMod = 1.0;
            if (t > 0.8) {
              vAlphaMod = smoothstep(1.0, 0.8, t);
          }
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uOpacity;

        varying float vLife;
          varying vec2 vUv;
          varying float vAlphaMod;
        
        void main() {
            vec4 tex = texture2D(uTexture, vUv);
            if (tex.a < 0.1) discard;
          
            // FIX: Use rich GOLD instead of Pale Yellow to avoid "whitish substance"
            vec3 gold = vec3(1.0, 0.8, 0.0); 
            // Updated to the specific orange you requested
            vec3 orange = vec3(1.0, 0.45, 0.05);
            vec3 red = vec3(0.9, 0.1, 0.0);
            vec3 smoke = vec3(0.2, 0.2, 0.2);

            vec3 color = gold;
            if (vLife > 0.3) color = mix(gold, orange, (vLife - 0.3) * 3.0);
            if (vLife > 0.6) color = mix(orange, red, (vLife - 0.6) * 4.0);
            if (vLife > 0.85) color = mix(red, smoke, (vLife - 0.85) * 6.0);

            float finalAlpha = tex.a * vAlphaMod * uOpacity;
            gl_FragColor = vec4(color, finalAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
        blending: smokeMode ? THREE.NormalBlending : THREE.NormalBlending,
      }),
    [fireTexture, size, opacity, smokeMode]
  );

  useFrame((state) => {
    if (shaderMaterial && shouldPlay) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      shaderMaterial.dispose();
      fireTexture?.dispose();
    };
  }, [geometry, shaderMaterial, fireTexture]);

  if (!isActive) return null;

  return (
    <mesh
      ref={meshRef}
      position={position}
        geometry={geometry}
        material={shaderMaterial}
      frustumCulled={false}
        visible={shouldPlay}
    >
      {/* Spatial fire crackle */}
      {shouldPlay && !isMuted && !smokeMode && (
        <PositionalAudio
          url="/sounds/fire-sounds.mp3"
          distance={10}
          loop
          autoplay
          // Louder for bigger/more intense fires
          volume={Math.min(1.0, intensity * 1.5)}
        />
      )}
    </mesh>
  );
}