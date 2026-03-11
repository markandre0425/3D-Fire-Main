// NOTE: This fire particle system is currently **not in use**.
// Kept for reference only; the game uses a different fire implementation.

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { PositionalAudio } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '@/lib/stores/useGame';

type FireShape = 'wide' | 'chaotic' | 'triangular';

interface ParticleFireProps {
  position: [number, number, number];
  size?: number;
  intensity?: number;
  isActive?: boolean;
  shape?: FireShape;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
}

// OPTIMIZATION: Shared temporary vector to avoid creating new Vector3 objects in every frame
const _tempVec = new THREE.Vector3();

// OPTIMIZATION: Shared Color constants to avoid creating new THREE.Color objects in the loop
const COLOR_YELLOW = new THREE.Color(0xFFFF00);
const COLOR_ORANGE = new THREE.Color(0xFFA500);
const COLOR_RED_ORANGE = new THREE.Color(0xFF4500);

// OPTIMIZATION: Global texture cache to prevent creating a new canvas for every fire instance
let _cachedCircleTexture: THREE.CanvasTexture | undefined;

function getCircleTexture(): THREE.CanvasTexture | undefined {
  if (_cachedCircleTexture) return _cachedCircleTexture;

  if (typeof document === 'undefined') return undefined;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return undefined;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  _cachedCircleTexture = new THREE.CanvasTexture(canvas);
  _cachedCircleTexture.needsUpdate = true;
  return _cachedCircleTexture;
}

export default function ParticleFire({
  position,
  size = 1,
  intensity = 1,
  isActive = true,
  shape = 'triangular'
}: ParticleFireProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const soundRef = useRef<THREE.PositionalAudio>(null!); 
  const { camera } = useThree();
  const [audioListener, setAudioListener] = useState<THREE.AudioListener | null>(null);
  const gamePhase = useGame(state => state.phase);
  const shouldPlay = isActive && gamePhase === "playing";

  useEffect(() => {
    if (!camera) return;
    const listener = new THREE.AudioListener();
    camera.add(listener);
    setAudioListener(listener);

    return () => {
      camera.remove(listener);
      setAudioListener(null);
    };
  }, [camera]);
  
  // 1. OPTIMIZED AUDIO LOADING
  const audioBuffer = useLoader(THREE.AudioLoader, '/sounds/fire-sounds.mp3');

  const particles = useRef<Particle[]>([]);
  // OPTIMIZATION: Clamp max particles to prevent performance issues on low-end devices
  const MAX_PARTICLES = 100;
  const particleCount = Math.min(MAX_PARTICLES, Math.floor(intensity * 40) + 30);
  
  const lastUpdate = useRef(0);

  // Generate fire colors
  const fireColors = useMemo(() => [
    COLOR_RED_ORANGE,
    new THREE.Color(0xFF6347),
    new THREE.Color(0xFF8C00),
    COLOR_ORANGE,
    COLOR_YELLOW,
    new THREE.Color(0xFF0000),
  ], []);

  // 2. CONFIGURE AUDIO BEHAVIOR
  useEffect(() => {
    if (soundRef.current && shouldPlay && audioBuffer) {
      soundRef.current.setBuffer(audioBuffer);
      soundRef.current.setRefDistance(2);  // Sound starts fading after 2 meters
      soundRef.current.setMaxDistance(15); // Sound stops after 15 meters
      soundRef.current.setLoop(true);
      soundRef.current.setVolume(0.8);     // 80% Max Volume
      
      if (!soundRef.current.isPlaying) {
        soundRef.current.play();
      }
    }
    
    return () => {
      if (soundRef.current && soundRef.current.isPlaying) {
        soundRef.current.stop();
      }
    };
  }, [audioBuffer, shouldPlay]);

  // Initialize particles
  useEffect(() => {
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      particles.current.push(createParticle());
    }
  }, [particleCount]);

  const getSpawnParams = () => {
    switch (shape) {
      case 'wide':
        return {
          spawnRadiusX: size * 1.2,
          spawnRadiusZ: size * 1.2,
          upwardForce: 0.2,
          spreadForce: 0.6,
          height: size * 0.8
        };
      case 'chaotic':
        return {
          spawnRadiusX: size * 0.6,
          spawnRadiusZ: size * 0.6,
          upwardForce: 0.3,
          spreadForce: 0.8,
          height: size * 1.2
        };
      case 'triangular':
      default:
        return {
          spawnRadiusX: size * 0.2,
          spawnRadiusZ: size * 0.2,
          upwardForce: 0.4,
          spreadForce: 0.3,
          height: size * 1.5
        };
    }
  };

  const createParticle = (): Particle => {
    const params = getSpawnParams();
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.3;

    return {
      position: new THREE.Vector3(
        Math.cos(angle) * radius * params.spawnRadiusX,
        0,
        Math.sin(angle) * radius * params.spawnRadiusZ
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * params.spreadForce,
        params.upwardForce + Math.random() * 0.5,
        (Math.random() - 0.5) * params.spreadForce
      ),
      life: 1.0,
      maxLife: 1.0 + Math.random() * 0.5,
      size: (0.1 + Math.random() * 0.15) * size,
      color: fireColors[Math.floor(Math.random() * fireColors.length)].clone()
    };
  };

  // Animation Loop
  useFrame((state, delta) => {
    if (!shouldPlay || !particlesRef.current) return;

    const now = state.clock.getElapsedTime();
    const dt = now - lastUpdate.current;
    if (dt < 1 / 30) return;
    lastUpdate.current = now;

    const geometry = particlesRef.current.geometry;
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;
    const sizes = geometry.attributes.size.array as Float32Array;

    particles.current.forEach((particle, i) => {
      particle.life -= dt / particle.maxLife;

      if (particle.life <= 0) {
        particle.life = 1.0;
        const params = getSpawnParams();
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.3;
        
        particle.position.set(
          Math.cos(angle) * radius * params.spawnRadiusX,
          0,
          Math.sin(angle) * radius * params.spawnRadiusZ
        );
        particle.velocity.set(
          (Math.random() - 0.5) * params.spreadForce,
          params.upwardForce + Math.random() * 0.5,
          (Math.random() - 0.5) * params.spreadForce
        );
      }

      // OPTIMIZATION: Use shared vector instead of creating new ones with .clone()
      _tempVec.copy(particle.velocity).multiplyScalar(dt);
      particle.position.add(_tempVec);

      // Calculate spread
      const distanceFromCenter = Math.sqrt(
        particle.position.x * particle.position.x + 
        particle.position.z * particle.position.z
      );
      
      if (distanceFromCenter > 0.01) {
        const normalizedX = particle.position.x / distanceFromCenter;
        const normalizedZ = particle.position.z / distanceFromCenter;
        particle.velocity.x += normalizedX * dt * 0.25; 
        particle.velocity.z += normalizedZ * dt * 0.25;
      } else {
        particle.velocity.x += (Math.random() - 0.5) * dt * 0.4;
        particle.velocity.z += (Math.random() - 0.5) * dt * 0.4;
      }
      
      particle.velocity.y *= 0.95;

      const i3 = i * 3;
      positions[i3] = particle.position.x;
      positions[i3 + 1] = particle.position.y;
      positions[i3 + 2] = particle.position.z;

      const lifeRatio = particle.life;
      
      // OPTIMIZATION: Use shared Color constants to avoid 'new THREE.Color()' allocation per frame
      if (lifeRatio > 0.6) {
        // Yellow to orange (bottom)
        particle.color.copy(COLOR_YELLOW).lerp(COLOR_ORANGE, (1 - lifeRatio) / 0.4);
      } else if (lifeRatio > 0.3) {
        // Orange to red (middle)
        particle.color.copy(COLOR_ORANGE).lerp(COLOR_RED_ORANGE, (0.6 - lifeRatio) / 0.3);
      } else {
        // Red (top)
        particle.color.copy(COLOR_RED_ORANGE);
      }

      colors[i3] = particle.color.r;
      colors[i3 + 1] = particle.color.g;
      colors[i3 + 2] = particle.color.b;
      sizes[i] = particle.size * intensity * 0.9; 
    });

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.5;
      colors[i * 3 + 2] = 0;
      sizes[i] = 0.1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    return geo;
  }, [particleCount]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.5 * size,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      map: getCircleTexture() // OPTIMIZATION: Use cached texture
    });
  }, [size]);

  if (!isActive) return null;

  return (
    <group position={position}>
      <points 
        ref={particlesRef} 
        position={[0, 0, 0]} 
        geometry={geometry} 
        material={material} 
      />
      
      {/* 3D Positional Audio Node */}
      {audioListener && <positionalAudio ref={soundRef} args={[audioListener]} />}
    </group>
  );
}