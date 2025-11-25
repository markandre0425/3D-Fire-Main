import * as THREE from 'three';

export interface BoundingBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export function createBoundingBox(
  position: THREE.Vector3,
  size: THREE.Vector3,
  rotation: THREE.Euler
): BoundingBox {
  const box = new THREE.Box3();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z));
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
