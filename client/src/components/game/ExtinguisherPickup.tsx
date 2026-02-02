import { Html } from "@react-three/drei";
import FireExtinguisher from "./FireExtinguisher";
import ExitSign from "./ExitSign";
import GasMaskPickup from "./GasMaskPickup";
import { ProceduralExtinguisherCabinet } from "./ProceduralFurniture";
import { InteractiveObject, InteractiveObjectType } from "@/lib/types";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { usePlayer } from "@/lib/stores/usePlayer";

interface ExtinguisherPickupProps {
  object: InteractiveObject;
  isCollected: boolean;
}

// Cabinet component with label
function ExtinguisherCabinetWithLabel({ object }: { object: InteractiveObject }) {
  const { isPaused, isLevelComplete } = useFireSafety();
  const { hasExtinguisher, extinguisherAmmo } = usePlayer();
  
  // Determine wall position for label offset
  const isOnWestWall = Math.abs(object.position.x - (-10)) < 0.5;
  const isOnEastWall = Math.abs(object.position.x - 10) < 0.5;
  const isOnNorthWall = Math.abs(object.position.z - (-10)) < 0.5;
  const isOnSouthWall = Math.abs(object.position.z - 10) < 0.5;
  
  // Position label above cabinet
  let labelPosition: [number, number, number] = [0, 0.8, 0.3];
  if (isOnWestWall) {
    labelPosition = [0.3, 0.8, 0];
  } else if (isOnEastWall) {
    labelPosition = [-0.3, 0.8, 0];
  } else if (isOnNorthWall) {
    labelPosition = [0, 0.8, 0.3];
  } else if (isOnSouthWall) {
    labelPosition = [0, 0.8, -0.3];
  }
  
  // Determine what action text to show
  const getActionText = () => {
    if (!hasExtinguisher) {
      return "Need extinguisher first";
    }
    if (extinguisherAmmo >= 100) {
      return "Already full";
    }
    return "Press E to Refill";
  };
  
  const actionText = getActionText();
  const canRefill = hasExtinguisher && extinguisherAmmo < 100;
  
  return (
    <group position={[object.position.x, object.position.y, object.position.z]}>
      <ProceduralExtinguisherCabinet />
      
      {/* HTML overlay label - hide when paused or level complete */}
      {!isPaused && !isLevelComplete && (
        <Html
          position={labelPosition}
          center
          distanceFactor={8}
          occlude={false}
          zIndexRange={[1000, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.75)',
            padding: '8px 16px',
            borderRadius: '8px',
            textAlign: 'center',
            minWidth: '150px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          }}>
            <div style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '4px',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            }}>
              🧯 Refill Station
            </div>
            <div style={{
              color: canRefill ? '#FFD700' : '#888888',
              fontSize: '13px',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
            }}>
              {actionText}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function InteractiveObjectComponent({ object, isCollected }: ExtinguisherPickupProps) {
  // Handle cabinet separately (outside useMemo) to ensure reactive updates
  const typeStr = object.type?.toString() || "";
  const isCabinet = typeStr === "ExtinguisherCabinet" || typeStr === "extinguisher_cabinet";
  
  if (isCabinet) {
    return <ExtinguisherCabinetWithLabel object={object} />;
  }

  // Other objects can be memoized
  switch (object.type) {
    case InteractiveObjectType.FireExtinguisher:
    case InteractiveObjectType.FoamExtinguisher:
    case InteractiveObjectType.CO2Extinguisher:
    case InteractiveObjectType.WaterExtinguisher:
    case InteractiveObjectType.PowderExtinguisher:
    case InteractiveObjectType.WetChemicalExtinguisher:
      return <FireExtinguisher object={object} isCollected={isCollected} />;
    case InteractiveObjectType.EmergencyExit:
      return <ExitSign object={object} />;
    case InteractiveObjectType.GasMask:
      return <GasMaskPickup object={object} isCollected={isCollected} />;
    default:
      return null;
  }
}
