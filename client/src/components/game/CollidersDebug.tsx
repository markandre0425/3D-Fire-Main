import { useMemo } from "react";
import * as THREE from "three";
import { useFireSafety } from "@/lib/stores/useFireSafety";

export default function CollidersDebug({ enabled = false }: { enabled?: boolean }) {
  const collidables = useFireSafety((s) => s.collidables);

  const boxes = useMemo(() => {
    if (!enabled) return [];
    return collidables.map((b, idx) => {
      const min = new THREE.Vector3(b.min.x, b.min.y, b.min.z);
      const max = new THREE.Vector3(b.max.x, b.max.y, b.max.z);
      const size = new THREE.Vector3().subVectors(max, min);
      const center = new THREE.Vector3().addVectors(min, max).multiplyScalar(0.5);
      return { idx, size, center };
    });
  }, [collidables, enabled]);

  if (!enabled) return null;

  return (
    <group>
      {boxes.map(({ idx, size, center }) => (
        <mesh key={idx} position={[center.x, center.y, center.z]}>
          <boxGeometry args={[size.x, size.y, size.z]} />
          <meshBasicMaterial color="#00ff99" wireframe transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

