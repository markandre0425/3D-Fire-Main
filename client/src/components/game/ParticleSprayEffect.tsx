import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Howl } from 'howler';
import { useAudio } from '@/lib/stores/useAudio';
import { InteractiveObjectType } from '@/lib/types';

interface ParticleSprayEffectProps {
  isActive: boolean;
  playerPosition: { x: number; y: number; z: number };
  playerRotation: { y: number };
  extinguisherType?: InteractiveObjectType;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
}

export default function ParticleSprayEffect({
  isActive,
  playerPosition,
  playerRotation,
  extinguisherType = InteractiveObjectType.FireExtinguisher
}: ParticleSprayEffectProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const particles = useRef<Particle[]>([]);
  const particleCount = 10;
  const spraySound = useRef<Howl | null>(null);
  const { isMuted } = useAudio();
  const velocityHelper = useRef(new THREE.Vector3());

  // Get spray colors based on extinguisher type
  const sprayColors = useMemo(() => {
    switch (extinguisherType) {
      case InteractiveObjectType.WaterExtinguisher:
        return [
          new THREE.Color(0.6, 0.8, 1.0),
          new THREE.Color(0.7, 0.85, 1.0),
          new THREE.Color(0.8, 0.9, 1.0)
        ];
      case InteractiveObjectType.FoamExtinguisher:
        return [
          new THREE.Color(0.95, 0.95, 0.85),
          new THREE.Color(1.0, 1.0, 0.9),
          new THREE.Color(0.9, 0.9, 0.8)
        ];
      case InteractiveObjectType.CO2Extinguisher:
        return [
          new THREE.Color(0.85, 0.85, 0.9),
          new THREE.Color(0.9, 0.9, 0.95),
          new THREE.Color(0.95, 0.95, 1.0)
        ];
      case InteractiveObjectType.PowderExtinguisher:
        return [
          new THREE.Color(1.0, 0.95, 0.8),
          new THREE.Color(1.0, 1.0, 0.9),
          new THREE.Color(0.95, 0.9, 0.75)
        ];
      case InteractiveObjectType.WetChemicalExtinguisher:
        return [
          new THREE.Color(0.8, 0.9, 0.8),
          new THREE.Color(0.85, 0.95, 0.85),
          new THREE.Color(0.9, 1.0, 0.9)
        ];
      default:
        return [
          new THREE.Color(0.85, 0.85, 0.85),
          new THREE.Color(0.9, 0.9, 0.9),
          new THREE.Color(0.95, 0.95, 0.95)
        ];
    }
  }, [extinguisherType]);

  const createParticle = (): Particle => {
    const angle = playerRotation.y;
    const spreadAngle = (Math.random() - 0.5) * 0.15; // Narrower cone (was 0.4)
    
    let baseSpeed = 2.5; // 50% of original (was 5)
    let upwardBias = -0.3;
    
    switch (extinguisherType) {
      case InteractiveObjectType.CO2Extinguisher:
        baseSpeed = 3; // 50% of original (was 6)
        upwardBias = 0;
        break;
      case InteractiveObjectType.FoamExtinguisher:
        baseSpeed = 2; // 50% of original (was 4)
        upwardBias = -0.5;
        break;
      case InteractiveObjectType.PowderExtinguisher:
        baseSpeed = 2.75; // 50% of original (was 5.5)
        upwardBias = -0.2;
        break;
    }

    const speed = baseSpeed + Math.random() * 1; // 50% of original (was 2)

    return {
      position: new THREE.Vector3(
        0, // Start at center
        0, // Start at center height
        0  // Start at center
      ),
      velocity: new THREE.Vector3(
        Math.sin(angle + spreadAngle) * speed,
        upwardBias + (Math.random() - 0.5) * 0.2, // Less vertical spread
        Math.cos(angle + spreadAngle) * speed
      ),
      life: 1.0,
      maxLife: 0.5 + Math.random() * 0.25, // 50% shorter life (was 1.0 + 0.5)
      size: (0.1 + Math.random() * 0.15),
      color: sprayColors[Math.floor(Math.random() * sprayColors.length)].clone()
    };
  };

  // Initialize particles
  useEffect(() => {
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      particles.current.push(createParticle());
    }
  }, [particleCount]);

  // Initialize spray sound
  useEffect(() => {
    spraySound.current = new Howl({
      src: ['/sounds/spray.mp3'],
      loop: true,
      volume: 0.5,
    });

    return () => {
      spraySound.current?.unload();
    };
  }, []);

  // Handle sound
  useEffect(() => {
    if (isActive && !isMuted) {
      spraySound.current?.play();
    } else {
      spraySound.current?.stop();
    }
  }, [isActive, isMuted]);

  // Update particles - SAME AS FIRE
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
        // Reset particle
        particle.life = 1.0;
        const angle = playerRotation.y;
        const spreadAngle = (Math.random() - 0.5) * 0.15; // Narrower cone
        
        let baseSpeed = 2.5; // 50% of original
        let upwardBias = -0.3;
        
        switch (extinguisherType) {
          case InteractiveObjectType.CO2Extinguisher:
            baseSpeed = 3; // 50% of original
            upwardBias = 0;
            break;
          case InteractiveObjectType.FoamExtinguisher:
            baseSpeed = 2; // 50% of original
            upwardBias = -0.5;
            break;
          case InteractiveObjectType.PowderExtinguisher:
            baseSpeed = 2.75; // 50% of original
            upwardBias = -0.2;
            break;
        }

        const speed = baseSpeed + Math.random() * 1; // 50% of original
        
        particle.position.set(
          0, // Start at center
          0, // Start at center height
          0  // Start at center
        );
        particle.velocity.set(
          Math.sin(angle + spreadAngle) * speed,
          upwardBias + (Math.random() - 0.5) * 0.2, // Less vertical spread
          Math.cos(angle + spreadAngle) * speed
        );
      }

      // Update position
      const step = velocityHelper.current;
      step.copy(particle.velocity).multiplyScalar(delta);
      particle.position.add(step);
      
      // Gravity
      particle.velocity.y -= 3 * delta;
      
      // Air resistance
      particle.velocity.y *= 0.95;

      // Update geometry attributes (position is relative to the points object)
      const i3 = i * 3;
      positions[i3] = particle.position.x;
      positions[i3 + 1] = particle.position.y;
      positions[i3 + 2] = particle.position.z;

      // Color stays bright
      const lifeRatio = particle.life;
      colors[i3] = particle.color.r;
      colors[i3 + 1] = particle.color.g;
      colors[i3 + 2] = particle.color.b;

      // Size stays consistent
      sizes[i] = particle.size * 0.9;
    });

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
  });

  // Create geometry and material once - SAME AS FIRE
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -100;
      positions[i * 3 + 2] = 0;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
      sizes[i] = 0.1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    return geo;
  }, [particleCount]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      map: createCircleTexture()
    });
  }, []);

  // Helper function to create circular particle texture
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

  // Calculate nozzle position (in front of player at chest height)
  const angle = playerRotation.y;
  const nozzleX = playerPosition.x + Math.sin(angle) * 0.5;
  const nozzleY = playerPosition.y + 0.7; // Chest height
  const nozzleZ = playerPosition.z + Math.cos(angle) * 0.5;

  return (
    <points ref={particlesRef} position={[nozzleX, nozzleY, nozzleZ]} geometry={geometry} material={material} />
  );
}
