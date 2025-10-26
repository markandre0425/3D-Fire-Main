import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

export default function ParticleFire({
  position,
  size = 1,
  intensity = 1,
  isActive = true,
  shape = 'triangular'
}: ParticleFireProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const particles = useRef<Particle[]>([]);
  const particleCount = Math.floor(intensity * 80) + 60; // 60-140 particles for denser, more solid fire

  // Debug log
  useEffect(() => {
    console.log(`🔥 ParticleFire rendering with shape: ${shape}, size: ${size}, position:`, position);
  }, [shape, size, position]);

  // Generate fire colors
  const fireColors = useMemo(() => [
    new THREE.Color(0xFF4500), // Orange Red
    new THREE.Color(0xFF6347), // Tomato
    new THREE.Color(0xFF8C00), // Dark Orange
    new THREE.Color(0xFFA500), // Orange
    new THREE.Color(0xFFFF00), // Yellow
    new THREE.Color(0xFF0000), // Red
  ], []);

  // Initialize particles
  useEffect(() => {
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      particles.current.push(createParticle());
    }
  }, [particleCount]);

  // Get shape-specific spawn parameters
  const getSpawnParams = () => {
    switch (shape) {
      case 'wide':
        return {
          spawnRadiusX: size * 1.2,
          spawnRadiusZ: size * 1.2,
          upwardForce: 0.2, // Low upward force - stays close to ground
          spreadForce: 0.6, // Strong horizontal spread - flows like water
          height: size * 0.8 // Short flames
        };
      case 'chaotic':
        return {
          spawnRadiusX: size * 0.6,
          spawnRadiusZ: size * 0.6,
          upwardForce: 0.3, // Low upward force
          spreadForce: 0.8, // Strong spread
          height: size * 1.2 // Medium height
        };
      case 'triangular':
      default:
        return {
          spawnRadiusX: size * 0.2,
          spawnRadiusZ: size * 0.2,
          upwardForce: 0.4, // Reduced from 1.0 - shorter flame
          spreadForce: 0.3, // Some spread
          height: size * 1.5 // Much shorter than before (was 3)
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

  // Update particles
  useFrame((_, delta) => {
    if (!isActive || !particlesRef.current) return;

    const geometry = particlesRef.current.geometry;
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;
    const sizes = geometry.attributes.size.array as Float32Array;

    particles.current.forEach((particle, i) => {
      // Update particle life
      particle.life -= delta / particle.maxLife;

      if (particle.life <= 0) {
        // Reset particle to bottom instead of making it disappear
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

      // Update position
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));

      // Water-like horizontal spread - stays low, flows outward
      const distanceFromCenter = Math.sqrt(
        particle.position.x * particle.position.x + 
        particle.position.z * particle.position.z
      );
      
      if (distanceFromCenter > 0.01) {
        // Normalize and push outward linearly like flowing liquid
        const normalizedX = particle.position.x / distanceFromCenter;
        const normalizedZ = particle.position.z / distanceFromCenter;
        
        particle.velocity.x += normalizedX * delta * 0.25; // Strong outward flow
        particle.velocity.z += normalizedZ * delta * 0.25;
      } else {
        // At center, give random initial direction
        particle.velocity.x += (Math.random() - 0.5) * delta * 0.4;
        particle.velocity.z += (Math.random() - 0.5) * delta * 0.4;
      }
      
      // Dampen vertical velocity to keep flames low
      particle.velocity.y *= 0.95; // More dampening = lower flames

      // Update geometry attributes
      const i3 = i * 3;
      positions[i3] = particle.position.x;
      positions[i3 + 1] = particle.position.y;
      positions[i3 + 2] = particle.position.z;

      // Color cycle: yellow at bottom -> orange -> red at top (stays bright)
      const lifeRatio = particle.life;
      if (lifeRatio > 0.6) {
        // Yellow to orange (bottom of flame)
        particle.color.setHex(0xFFFF00).lerp(new THREE.Color(0xFFA500), (1 - lifeRatio) / 0.4);
      } else if (lifeRatio > 0.3) {
        // Orange to red (middle of flame)
        particle.color.setHex(0xFFA500).lerp(new THREE.Color(0xFF4500), (0.6 - lifeRatio) / 0.3);
      } else {
        // Red (top of flame - stays bright, doesn't fade to black)
        particle.color.setHex(0xFF4500);
      }

      colors[i3] = particle.color.r;
      colors[i3 + 1] = particle.color.g;
      colors[i3 + 2] = particle.color.b;

      // Size stays consistent (doesn't shrink and disappear)
      sizes[i] = particle.size * intensity * 0.9; // Slightly smaller at top for natural look
    });

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
  });

  // Create geometry
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

  // Create material
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.5 * size, // Increased from 0.2 to 0.5 for more visibility
      vertexColors: true,
      transparent: true,
      opacity: 1.0, // Increased from 0.8 to 1.0 for brightness
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      map: createCircleTexture() // Add a circular texture for better particle appearance
    });
  }, [size]);

  // Helper function to create a circular gradient texture
  function createCircleTexture() {
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
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  if (!isActive) return null;

  return (
    <points ref={particlesRef} position={position} geometry={geometry} material={material} />
  );
}

