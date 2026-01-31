import * as THREE from 'three';

export interface BoundingBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

const DEFAULT_COLLISION_SCALE = 0.7;
const MIN_WALL_THICKNESS = 0.3; // Minimum thickness for walls to prevent tunneling

export function createBoundingBox(
  position: THREE.Vector3,
  size: THREE.Vector3,
  rotation: THREE.Euler,
  scale: number = DEFAULT_COLLISION_SCALE
): BoundingBox {
  const box = new THREE.Box3();
  // Don't scale down thin dimensions (like wall thickness) below minimum
  // This prevents walls from becoming paper-thin and allowing character tunneling
  const scaledSize = new THREE.Vector3(
    size.x < MIN_WALL_THICKNESS ? Math.max(size.x, MIN_WALL_THICKNESS) : size.x * scale,
    size.y < MIN_WALL_THICKNESS ? Math.max(size.y, MIN_WALL_THICKNESS) : size.y * scale,
    size.z < MIN_WALL_THICKNESS ? Math.max(size.z, MIN_WALL_THICKNESS) : size.z * scale
  );
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(scaledSize.x, scaledSize.y, scaledSize.z)
  );
  mesh.position.copy(position);
  mesh.rotation.copy(rotation);
  mesh.updateMatrixWorld();
  box.setFromObject(mesh);
  return {
    min: box.min,
    max: box.max,
  };
}

export function checkCollision(box1: BoundingBox, box2: BoundingBox): boolean {
  return (
    box1.min.x < box2.max.x &&
    box1.max.x > box2.min.x &&
    box1.min.y < box2.max.y &&
    box1.max.y > box2.min.y &&
    box1.min.z < box2.max.z &&
    box1.max.z > box2.min.z
  );
}
