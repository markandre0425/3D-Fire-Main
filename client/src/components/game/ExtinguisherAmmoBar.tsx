import { usePlayer } from "@/lib/stores/usePlayer";
import { EXTINGUISHER_AMMO } from "@/lib/constants";
import { InteractiveObjectType } from "@/lib/types";

/**
 * ExtinguisherAmmoBar - HUD component showing extinguisher ammo level
 * 
 * Features:
 * - Shows current ammo percentage
 * - Color changes based on ammo level (green -> yellow -> red)
 * - Pulses and glows when low/critical
 * - Shows extinguisher type
 * - Warning messages when low/empty
 */
export default function ExtinguisherAmmoBar() {
  const { hasExtinguisher, extinguisherType, extinguisherAmmo } = usePlayer();
  
  // Don't render if player doesn't have an extinguisher
  if (!hasExtinguisher) return null;
  
  const ammoPercentage = (extinguisherAmmo / EXTINGUISHER_AMMO.MAX_CAPACITY) * 100;
  const isLow = ammoPercentage <= EXTINGUISHER_AMMO.LOW_AMMO_THRESHOLD;
  const isCritical = ammoPercentage <= EXTINGUISHER_AMMO.CRITICAL_AMMO_THRESHOLD;
  const isEmpty = ammoPercentage <= 0;
  
  // Get extinguisher type display name
  const getTypeName = () => {
    if (!extinguisherType) return "Standard";
    
    switch (extinguisherType) {
      case InteractiveObjectType.FireExtinguisher:
        return "Standard";
      case InteractiveObjectType.WaterExtinguisher:
        return "Water (Class A)";
      case InteractiveObjectType.FoamExtinguisher:
        return "Foam (Class B)";
      case InteractiveObjectType.CO2Extinguisher:
        return "CO2 (Class C)";
      case InteractiveObjectType.PowderExtinguisher:
        return "Powder (Class D)";
      case InteractiveObjectType.WetChemicalExtinguisher:
        return "Wet Chemical (Class K)";
      default:
        return "Standard";
    }
  };
  
  // Get bar color based on ammo level
  const getBarColor = () => {
    if (isEmpty) return "#666"; // Gray when empty
    if (isCritical) return "#F44336"; // Red
    if (isLow) return "#FFC107"; // Yellow
    return "#4CAF50"; // Green
  };
  
  return (
    <div 
      className={`absolute bottom-4 right-4 w-64 bg-gray-900/85 border-2 rounded-2xl px-4 py-3 text-white shadow-[0_12px_25px_rgba(0,0,0,0.55)] transition-all duration-300 ${
        isCritical && !isEmpty
          ? 'border-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
          : isLow && !isEmpty
            ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
            : 'border-gray-500'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-semibold uppercase tracking-[0.2em] flex items-center gap-1 ${
          isEmpty ? 'text-red-400' : isCritical ? 'text-red-400 animate-pulse' : isLow ? 'text-yellow-400' : 'text-gray-300'
        }`}>
          🧯 Extinguisher {isCritical && !isEmpty && '⚠️'} {isEmpty && '❌'}
        </span>
        <span className={`text-sm font-bold tracking-wide ${
          isEmpty ? 'text-red-400' : isCritical ? 'text-red-400' : isLow ? 'text-yellow-400' : ''
        }`}>
          {Math.round(ammoPercentage)}%
        </span>
      </div>
      
      {/* Ammo Bar */}
      <div className="w-full h-4 bg-neutral-700 rounded-full overflow-hidden mb-2">
        <div 
          className={`h-full rounded-full transition-all duration-150 ease-out ${
            isCritical && !isEmpty ? 'animate-pulse' : ''
          }`}
          style={{ 
            width: `${ammoPercentage}%`, 
            backgroundColor: getBarColor(),
            boxShadow: isCritical && !isEmpty
              ? '0 0 15px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4)' 
              : isLow && !isEmpty
                ? '0 0 10px rgba(234, 179, 8, 0.6)'
                : '0 0 8px rgba(0,0,0,0.3)'
          }}
        />
      </div>
      
      {/* Type Label */}
      <div className="text-xs text-gray-400 text-center">
        [{getTypeName()}]
      </div>
      
      {/* Warning Messages */}
      {isEmpty && (
        <div className="mt-2 text-center text-xs text-red-400 font-bold uppercase tracking-wider animate-pulse">
          EMPTY - FIND NEW EXTINGUISHER!
        </div>
      )}
      {isCritical && !isEmpty && (
        <div className="mt-2 text-center text-xs text-red-400 font-bold uppercase tracking-wider animate-pulse">
          ⚠️ ALMOST EMPTY!
        </div>
      )}
      {isLow && !isCritical && (
        <div className="mt-2 text-center text-xs text-yellow-400 font-bold uppercase tracking-wider">
          LOW - USE WISELY!
        </div>
      )}
    </div>
  );
}
