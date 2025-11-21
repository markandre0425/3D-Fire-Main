import { useEffect } from "react";
import FireHazard from "./FireHazard";
import Fire from "./Fire";
import { HazardState, HazardType } from "@/lib/types";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { SAFETY_TIPS } from "@/lib/constants";
import Appliance from "./Appliance";

interface HazardProps {
  hazard: HazardState;
}

export default function Hazard({ hazard }: HazardProps) {
  const { showSafetyTip } = useFireSafety();

  useEffect(() => {
    let tipTimeoutId: NodeJS.Timeout;

    if (hazard.isActive && !hazard.isExtinguished) {
      let relevantTipId = "";
      
      switch (hazard.type) {
        case HazardType.StoveTop:
          relevantTipId = "tip1"; // Keep an eye on the stove
          break;
        case HazardType.ElectricalOutlet:
          relevantTipId = "tip9"; // Don't overload outlets
          break;
        case HazardType.Candle:
          relevantTipId = "tip7"; // Avoid candle hazards
          break;
        case HazardType.Fireplace:
          relevantTipId = "tip5"; // Keep space heaters away (also applies to fireplaces)
          break;
        case HazardType.SpacerHeater:
          relevantTipId = "tip5"; // Keep space heaters away
          break;
        case HazardType.CloggedDryer:
          relevantTipId = "tip8"; // Clean dryer lint
          break;
        case HazardType.ClassAFire:
        case HazardType.ClassBFire:
        case HazardType.ClassCFire:
        case HazardType.ClassDFire:
        case HazardType.ClassKFire:
          relevantTipId = "tip2"; // Fire safety tips
          break;
        default:
          // Find a random prevention tip
          const preventionTips = SAFETY_TIPS.filter(tip => 
            tip.category === "Prevention"
          );
          if (preventionTips.length > 0) {
            relevantTipId = preventionTips[
              Math.floor(Math.random() * preventionTips.length)
            ].id;
          }
      }
      
      // Show tip after a delay
      tipTimeoutId = setTimeout(() => {
        showSafetyTip(relevantTipId);
        
        // Hide tip after 5 seconds
        setTimeout(() => {
          showSafetyTip(null);
        }, 5000);
      }, 2000);
    }
    
    return () => {
      clearTimeout(tipTimeoutId);
    };
  }, [hazard.isActive, hazard.isExtinguished, hazard.type, showSafetyTip]);
  
  // Check if this hazard should use the Appliance component
  const shouldUseAppliance = hazard.id.toLowerCase().includes('microwave') ||
                            hazard.id.toLowerCase().includes('toaster') ||
                            hazard.id.toLowerCase().includes('coffee') ||
                            hazard.id.toLowerCase().includes('tv') ||
                            hazard.id.toLowerCase().includes('television') ||
                            hazard.id.toLowerCase().includes('laptop') ||
                            hazard.id.toLowerCase().includes('space-heater') ||
                            hazard.id.toLowerCase().includes('lamp') ||
                            hazard.id.toLowerCase().includes('printer') ||
                            hazard.id.toLowerCase().includes('projector') ||
                            hazard.id.toLowerCase().includes('vending') ||
                            hazard.id.toLowerCase().includes('file-cabinet') ||
                            hazard.id.toLowerCase().includes('conveyor') ||
                            hazard.id.toLowerCase().includes('hydraulic') ||
                            hazard.id.toLowerCase().includes('welding') ||
                            hazard.id.toLowerCase().includes('forklift') ||
                            hazard.id.toLowerCase().includes('compressor') ||
                            hazard.id.toLowerCase().includes('generator') ||
                            hazard.id.toLowerCase().includes('meat-grinder') ||
                            hazard.id.toLowerCase().includes('meat_grinder') ||
                            hazard.id.toLowerCase().includes('simple-wood') ||
                            hazard.id.toLowerCase().includes('simple_wood') ||
                            hazard.id.toLowerCase().includes('wooden-tabouret') ||
                            hazard.id.toLowerCase().includes('wooden_tabouret');
  
  // Check if this hazard should use the new Fire component
  // This includes both the original fire types and the new ones from level configs
  const shouldUseNewFire = hazard.type === HazardType.ClassAFire || 
                          hazard.type === HazardType.ClassBFire || 
                          hazard.type === HazardType.ClassCFire || 
                          hazard.type === HazardType.ClassDFire || 
                          hazard.type === HazardType.ClassKFire ||
                          // New fire types from level configs
                          hazard.type === HazardType.Fireplace ||
                          hazard.type === HazardType.StoveTop ||
                          hazard.type === HazardType.Candle ||
                          hazard.type === HazardType.SpacerHeater ||
                          hazard.type === HazardType.CloggedDryer;
  
  // Render appliance-type hazards using the Appliance component
  if (shouldUseAppliance) {
    return <Appliance hazard={hazard} />;
  }
  
  // Render fire-type hazards using the new Fire component
  if (shouldUseNewFire) {
    return (
      <Fire
        position={[hazard.position.x, hazard.position.y, hazard.position.z]}
        size={Math.max(0.5, hazard.severity * 0.8)}
        intensity={hazard.severity}
        isActive={hazard.isActive && !hazard.isExtinguished}
      />
    );
  }
  
  // Render other hazard types using FireHazard
  return <FireHazard hazard={hazard} />;
}
