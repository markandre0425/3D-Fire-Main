import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { Controls } from "@/lib/types";
import { PLAYER_CONSTANTS } from "@/lib/constants";
import { GLTF } from "three-stdlib";

const PLAYER_HEIGHT = PLAYER_CONSTANTS.CHARACTER_BOUNDING_BOX.y;
const PLAYER_RADIUS = PLAYER_CONSTANTS.CHARACTER_BOUNDING_BOX.x * 0.5;
const EYE_OFFSET = PLAYER_HEIGHT * 0.5;
const GROUND_LEVEL = PLAYER_CONSTANTS.STARTING_POSITION.y;
const GRAVITY = 25;
const JUMP_FORCE = 10;
const STEP_HEIGHT = 0.35;
const MOVEMENT_VECTOR = new THREE.Vector3();
const MOVEMENT_DELTA = new THREE.Vector3();
const CURRENT_POSITION = new THREE.Vector3();
const PROPOSED_POSITION = new THREE.Vector3();
const FORWARD_VECTOR = new THREE.Vector3();
const RIGHT_VECTOR = new THREE.Vector3();
const UP_VECTOR = new THREE.Vector3(0, 1, 0);
const HAND_OFFSET = new THREE.Vector3(0.4, -0.5, -0.8);
const NOZZLE_OFFSET = new THREE.Vector3(0.05, -0.15, -0.9);
const ENABLE_SPRAY_EFFECT = false;

useGLTF.preload("/models/fire_extinguisher.glb");

/**
 * First-person player scaffolding:
 * - Locks the pointer when the canvas is clicked
 * - Captures mouse movement to rotate the camera
 * - Moves a simple collider (cylinder) using WASD
 * - Syncs position back to usePlayer store
 *
 * NOTE: This is scaffolding only. It doesn't yet handle:
 * - Jumping / gravity
 * - Interaction prompts
 * - Weapon/extinguisher rendering
 */

export default function FirstPersonPlayer() {
  const { camera, gl, scene } = useThree();
  const [subscribeKeys] = useKeyboardControls<Controls>();
  const { position, hasExtinguisher } = usePlayer();
  const { collidables } = useFireSafety();
  const { scene: extinguisherScene } = useGLTF("/models/fire_extinguisher.glb") as GLTF & {
    scene: THREE.Group;
  };
const extinguisherGroup = useRef<THREE.Group>(new THREE.Group());
const sprayRef = useRef<THREE.Mesh | null>(null);
const sprayGroup = useRef(new THREE.Group());

  const controlsRef = useRef({
    forward: false,
    backward: false,
    leftward: false,
    rightward: false,
    run: false,
    jump: false,
    extinguish: false,
  });
  const velocityY = useRef(0);
  const grounded = useRef(true);
  const yaw = useRef(0);
  const pitch = useRef(0);

  useEffect(() => {
    const handleF = (event: KeyboardEvent) => {
      if (event.code === "KeyF") {
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", handleF, true);
    window.addEventListener("keyup", handleF, true);
    return () => {
      window.removeEventListener("keydown", handleF, true);
      window.removeEventListener("keyup", handleF, true);
    };
  }, []);

  // Pointer lock setup
  useEffect(() => {
    const handleClick = () => {
      gl.domElement.requestPointerLock();
    };
    gl.domElement.addEventListener("click", handleClick);
    return () => {
      gl.domElement.removeEventListener("click", handleClick);
    };
  }, [gl.domElement]);


  useEffect(() => {
    camera.rotation.order = "YXZ";
    camera.rotation.set(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    const group = extinguisherGroup.current;
    group.clear();
    if (extinguisherScene) {
      const clone = extinguisherScene.clone(true);
      clone.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          child.frustumCulled = false;
        }
      });
      group.add(clone);
    } else {
      const placeholder = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.3, 0.1),
        new THREE.MeshStandardMaterial({ color: "#E53935" })
      );
      group.add(placeholder);
    }
    group.scale.setScalar(0.35 * 2.5);

    /*
    if (ENABLE_SPRAY_EFFECT) {
      const sprayGeometry = new THREE.ConeGeometry(0.12, 0.8, 16, 1, true);
      const sprayMaterial = new THREE.MeshBasicMaterial({
        color: "#E0F7FA",
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const sprayMesh = new THREE.Mesh(sprayGeometry, sprayMaterial);
      sprayMesh.visible = false;
      sprayGroup.current.add(sprayMesh);
      group.add(sprayGroup.current);
      sprayRef.current = sprayMesh;
    }
    */
  }, [extinguisherScene]);

  useEffect(() => {
    const group = extinguisherGroup.current;
    scene.add(group);
    return () => {
      scene.remove(group);
    };
  }, [scene]);

  useEffect(() => {
    extinguisherGroup.current.visible = hasExtinguisher;
  }, [hasExtinguisher]);

  // Mouse look
  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) return;
      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;
      const yawSpeed = 0.002;
      const pitchSpeed = 0.002;

      yaw.current -= movementX * yawSpeed;
      pitch.current -= movementY * pitchSpeed;
      const pitchLimit = Math.PI / 2 - 0.01;
      pitch.current = Math.max(-pitchLimit, Math.min(pitchLimit, pitch.current));
      camera.rotation.set(pitch.current, yaw.current, 0);
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [camera, gl.domElement]);

  // Subscribe to keyboard controls
  useEffect(() => {
    const unsubscribe = subscribeKeys(
      (state) => state,
      (state) => {
        controlsRef.current = {
          forward: state.forward,
          backward: state.backward,
          leftward: state.leftward,
          rightward: state.rightward,
          run: state.run,
          jump: (state as any).jump || false,
          extinguish: (state as any).extinguish || false,
        };
      }
    );
    return () => unsubscribe();
  }, [subscribeKeys]);

  const collidesAt = (center: THREE.Vector3) => {
    // Simple cylinder/AABB overlap; placeholder until we port full logic.
    const radius = PLAYER_RADIUS;
    for (const obstacle of collidables) {
      if (
        center.x + radius > obstacle.min.x &&
        center.x - radius < obstacle.max.x &&
        center.z + radius > obstacle.min.z &&
        center.z - radius < obstacle.max.z
      ) {
        if (
          center.y < obstacle.max.y &&
          center.y + PLAYER_HEIGHT > obstacle.min.y
        ) {
          return true;
        }
      }
    }
    return false;
  };

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    const hasInput = controls.forward || controls.backward || controls.leftward || controls.rightward;
    const speed = (controls.run ? PLAYER_CONSTANTS.RUNNING_SPEED : PLAYER_CONSTANTS.MOVEMENT_SPEED) * delta;

    if (controls.jump && grounded.current) {
      velocityY.current = JUMP_FORCE;
      grounded.current = false;
    }

    velocityY.current -= GRAVITY * delta;

    camera.getWorldDirection(FORWARD_VECTOR);
    FORWARD_VECTOR.y = 0;
    FORWARD_VECTOR.normalize();
    RIGHT_VECTOR.crossVectors(FORWARD_VECTOR, UP_VECTOR).normalize();

    MOVEMENT_VECTOR.set(0, 0, 0);
    if (controls.forward) MOVEMENT_VECTOR.add(FORWARD_VECTOR);
    if (controls.backward) MOVEMENT_VECTOR.sub(FORWARD_VECTOR);
    if (controls.leftward) MOVEMENT_VECTOR.sub(RIGHT_VECTOR);
    if (controls.rightward) MOVEMENT_VECTOR.add(RIGHT_VECTOR);

    if (MOVEMENT_VECTOR.lengthSq() > 0) {
      MOVEMENT_VECTOR.normalize();
      MOVEMENT_DELTA.copy(MOVEMENT_VECTOR).multiplyScalar(speed);
    } else {
      MOVEMENT_DELTA.set(0, 0, 0);
    }

    CURRENT_POSITION.set(position.x, position.y, position.z);
    PROPOSED_POSITION.copy(CURRENT_POSITION).add(MOVEMENT_DELTA);
    PROPOSED_POSITION.y += velocityY.current * delta;

    let finalPosition = CURRENT_POSITION.clone();

    const tryResolveCollision = () => {
      const stepPosition = PROPOSED_POSITION.clone();
      stepPosition.y += STEP_HEIGHT;
      if (!collidesAt(stepPosition)) {
        return stepPosition;
      }
      const slideX = new THREE.Vector3(CURRENT_POSITION.x + MOVEMENT_DELTA.x, stepPosition.y, CURRENT_POSITION.z);
      if (!collidesAt(slideX)) return slideX;
      const slideZ = new THREE.Vector3(CURRENT_POSITION.x, stepPosition.y, CURRENT_POSITION.z + MOVEMENT_DELTA.z);
      if (!collidesAt(slideZ)) return slideZ;
      const slideXZ = new THREE.Vector3(CURRENT_POSITION.x + MOVEMENT_DELTA.x, stepPosition.y, CURRENT_POSITION.z + MOVEMENT_DELTA.z);
      if (!collidesAt(slideXZ)) return slideXZ;
      return null;
    };

    if (!collidesAt(PROPOSED_POSITION)) {
      finalPosition.copy(PROPOSED_POSITION);
    } else {
      const stepped = tryResolveCollision();
      if (stepped) {
        finalPosition.copy(stepped);
      } else if (!collidesAt(new THREE.Vector3(CURRENT_POSITION.x + MOVEMENT_DELTA.x, CURRENT_POSITION.y, CURRENT_POSITION.z))) {
        finalPosition.set(CURRENT_POSITION.x + MOVEMENT_DELTA.x, CURRENT_POSITION.y, CURRENT_POSITION.z);
      } else if (!collidesAt(new THREE.Vector3(CURRENT_POSITION.x, CURRENT_POSITION.y, CURRENT_POSITION.z + MOVEMENT_DELTA.z))) {
        finalPosition.set(CURRENT_POSITION.x, CURRENT_POSITION.y, CURRENT_POSITION.z + MOVEMENT_DELTA.z);
      }
    }

    if (finalPosition.y <= GROUND_LEVEL) {
      finalPosition.y = GROUND_LEVEL;
      velocityY.current = 0;
      grounded.current = true;
    } else {
      grounded.current = false;
    }

    usePlayer.setState((state) => ({
      position: { ...state.position, x: finalPosition.x, y: finalPosition.y, z: finalPosition.z }
    }));
    camera.position.set(finalPosition.x, finalPosition.y + EYE_OFFSET, finalPosition.z);

    if (extinguisherGroup.current) {
      extinguisherGroup.current.visible = hasExtinguisher;
      if (hasExtinguisher) {
        camera.updateMatrixWorld(true);
        const handWorld = HAND_OFFSET.clone();
        camera.localToWorld(handWorld);
        extinguisherGroup.current.position.copy(handWorld);
        extinguisherGroup.current.quaternion.copy(camera.quaternion);

        if (sprayGroup.current) {
          const nozzleWorld = NOZZLE_OFFSET.clone();
          extinguisherGroup.current.localToWorld(nozzleWorld);
          sprayGroup.current.position.copy(nozzleWorld);
          sprayGroup.current.quaternion.copy(extinguisherGroup.current.quaternion);
        }
      }
    }

    /*
    if (ENABLE_SPRAY_EFFECT && sprayRef.current) {
      const spraying = controls.extinguish && hasExtinguisher;
      sprayRef.current.visible = spraying;
      if (spraying) {
        const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 18) * 0.1;
        sprayRef.current.scale.set(pulse, 1, pulse);
      }
    } else if (sprayRef.current) {
      sprayRef.current.visible = false;
    }
    */
  });

  return null;
}

