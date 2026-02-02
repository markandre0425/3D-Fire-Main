import { usePlayer } from "@/lib/stores/usePlayer";
import { PLAYER_CONSTANTS } from "@/lib/constants";

export default function HealthBar() {
  const { health, oxygen } = usePlayer();
  
  // Calculate health percentage
  const healthPercentage = (health / PLAYER_CONSTANTS.MAX_HEALTH) * 100;
  const oxygenPercentage = (oxygen / PLAYER_CONSTANTS.MAX_OXYGEN) * 100;
  
  // Critical thresholds
  const isHealthCritical = healthPercentage <= 40;
  const isOxygenCritical = oxygenPercentage <= 40;
  const isCritical = isHealthCritical || isOxygenCritical;
  
  // Determine health bar color based on health level
  const getHealthColor = () => {
    if (healthPercentage > 70) return "#4CAF50"; // Green
    if (healthPercentage > 30) return "#FFC107"; // Yellow
    return "#F44336"; // Red
  };
  
  // Determine oxygen bar color based on oxygen level
  const getOxygenColor = () => {
    if (oxygenPercentage > 70) return "#2196F3"; // Blue
    if (oxygenPercentage > 30) return "#03A9F4"; // Light Blue
    return "#F44336"; // Red
  };
  
  return (
    <div 
      className={`absolute bottom-4 left-4 w-72 bg-gray-900/85 border-2 rounded-2xl px-4 py-3 text-white shadow-[0_12px_25px_rgba(0,0,0,0.55)] transition-all duration-300 ${
        isCritical 
          ? 'border-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
          : 'border-gray-500'
      }`}
    >
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${
            isHealthCritical ? 'text-red-400 animate-pulse' : 'text-gray-300'
          }`}>
            Health {isHealthCritical && '⚠️'}
          </span>
          <span className={`text-sm font-bold tracking-wide ${
            isHealthCritical ? 'text-red-400' : ''
          }`}>
            {Math.round(health)}%
          </span>
        </div>
        <div className="w-full h-4 bg-neutral-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ease-out ${
              isHealthCritical ? 'animate-pulse' : ''
            }`}
            style={{ 
              width: `${healthPercentage}%`, 
              backgroundColor: getHealthColor(),
              boxShadow: isHealthCritical 
                ? '0 0 15px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4)' 
                : '0 0 12px rgba(0,0,0,0.4)'
            }}
          />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${
            isOxygenCritical ? 'text-red-400 animate-pulse' : 'text-gray-300'
          }`}>
            Oxygen {isOxygenCritical && '⚠️'}
          </span>
          <span className={`text-sm font-bold tracking-wide ${
            isOxygenCritical ? 'text-red-400' : ''
          }`}>
            {Math.round(oxygen)}%
          </span>
        </div>
        <div className="w-full h-4 bg-neutral-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ease-out ${
              isOxygenCritical ? 'animate-pulse' : ''
            }`}
            style={{ 
              width: `${oxygenPercentage}%`, 
              backgroundColor: getOxygenColor(),
              boxShadow: isOxygenCritical 
                ? '0 0 15px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4)' 
                : '0 0 12px rgba(0,0,0,0.4)'
            }}
          />
        </div>
      </div>
      
      {/* Critical warning message */}
      {isCritical && (
        <div className="mt-2 text-center text-xs text-red-400 font-bold uppercase tracking-wider animate-pulse">
          {isHealthCritical && isOxygenCritical 
            ? '⚠️ CRITICAL - FIND SAFETY!' 
            : isHealthCritical 
              ? '⚠️ LOW HEALTH - AVOID FIRE!' 
              : '⚠️ LOW OXYGEN - GET MASK!'}
        </div>
      )}
    </div>
  );
}
