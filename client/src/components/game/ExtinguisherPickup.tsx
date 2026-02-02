import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import FireExtinguisher from "./FireExtinguisher";
import ExitSign from "./ExitSign";
import GasMaskPickup from "./GasMaskPickup";
import { InteractiveObject, InteractiveObjectType } from "@/lib/types";

interface ExtinguisherPickupProps {
  object: InteractiveObject;
  isCollected: boolean;
}

export default function InteractiveObjectComponent({ object, isCollected }: ExtinguisherPickupProps) {
  const { scene } = useThree();

  const renderObject = useMemo(() => {
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
  }, [object, isCollected]);
  
  return renderObject;
}
