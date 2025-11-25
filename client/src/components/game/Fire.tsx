import ParticleFire from './ParticleFire';

type FireShape = 'wide' | 'chaotic' | 'triangular';

interface FireProps {
  position: [number, number, number];
  size?: number;
  intensity?: number;
  isActive?: boolean;
  shape?: FireShape;
}

export default function Fire({
  position,
  size = 1,
  intensity = 1,
  isActive = true,
  shape = 'triangular',
}: FireProps) {
  return (
    <ParticleFire
      position={position}
      size={size}
      intensity={intensity}
      isActive={isActive}
      shape={shape}
    />
  );
}
