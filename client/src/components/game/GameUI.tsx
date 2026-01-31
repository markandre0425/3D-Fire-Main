import { useState, useEffect } from "react";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { SAFETY_TIPS } from "@/lib/constants";
import PauseMenu from "../screens/PauseMenu";

export default function GameUI() {
  const { 
    isPaused, 
    resumeGame, 
    resetLevel,
    activeTip, 
    levelData,
    isLevelComplete
  } = useFireSafety();

  const [showTip, setShowTip] = useState(false);
  const [tipContent, setTipContent] = useState<{title: string, content: string} | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  useEffect(() => {
    if (activeTip) {
      const tip = SAFETY_TIPS.find(t => t.id === activeTip);
      if (tip) {
        setTipContent({
          title: tip.title,
          content: tip.content
        });
        setShowTip(true);

        const tipTimeout = setTimeout(() => {
          setShowTip(false);
        }, 5000);
        
        return () => clearTimeout(tipTimeout);
      }
    } else {
      setShowTip(false);
    }
  }, [activeTip]);

  // Show level complete notification
  useEffect(() => {
    if (isLevelComplete) {
      setShowLevelComplete(true);
      
      const completeTimeout = setTimeout(() => {
        setShowLevelComplete(false);
      }, 2000);
      
      return () => clearTimeout(completeTimeout);
    }
  }, [isLevelComplete]);
  
  return (
    <>
      {/* Simple Gas Mask Status - Temporarily disabled for debugging */}
      {/* {hasGasMask && (
        <div className="absolute top-4 right-4 bg-blue-900 bg-opacity-80 p-2 rounded-md text-white">
          <h3 className="text-sm font-bold">🛡️ BFP Breathing Apparatus</h3>
          <p className="text-xs text-green-300">Smoke Protection: Active</p>
        </div>
      )} */}
      
      {/* BFP Gas Mask Status */}
      {/* {hasGasMask && (
        <div className="absolute top-4 right-4 bg-blue-900 bg-opacity-80 p-3 rounded-md text-white">
          <h3 className="text-sm font-bold mb-1">🛡️ BFP Breathing Apparatus</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs">Oxygen Filter:</span>
            <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  gasMaskOxygenLevel > 50 ? 'bg-green-500' : 
                  gasMaskOxygenLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${gasMaskOxygenLevel}%` }}
              />
            </div>
            <span className="text-xs">{Math.round(gasMaskOxygenLevel)}%</span>
          </div>
          {gasMaskOxygenLevel < 25 && (
            <p className="text-xs text-red-300 mt-1">⚠️ Filter Running Low!</p>
          )}
        </div>
      )} */}
      
      {/* Oxygen Level Display */}
      {/* <div className="absolute top-20 left-4 bg-black bg-opacity-50 p-2 rounded-md text-white">
        <div className="flex items-center space-x-2">
          <span className="text-sm">💨 Oxygen:</span>
          <div className="w-20 h-2 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                oxygen > 70 ? 'bg-blue-500' : 
                oxygen > 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${oxygen}%` }}
            />
          </div>
          <span className="text-xs">{Math.round(oxygen)}%</span>
        </div>
      </div> */}
      
      {/* Level Info */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="bg-gray-900/85 border-2 border-gray-500 rounded-2xl px-5 py-4 text-white shadow-[0_12px_25px_rgba(0,0,0,0.55)] max-w-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-300">
            Current Mission
          </h2>
          <p className="text-xl font-bold mt-1 tracking-wide">{levelData.name}</p>
          <p className="text-sm mt-2 text-gray-200 leading-snug">
            {levelData.description}
          </p>
        </div>
      </div>
      
      {/* Safety Tip */}
      {showTip && tipContent && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-5 bg-gray-900/95 border-2 border-yellow-400 rounded-2xl text-white max-w-md shadow-[0_16px_40px_rgba(0,0,0,0.65)]">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300 mb-2">
            Safety Tip
          </h3>
          <p className="text-xl font-bold">{tipContent.title}</p>
          <p className="text-md text-gray-200 mt-2 leading-snug">{tipContent.content}</p>
        </div>
      )}
      
      {/* Level Complete Notification */}
      {showLevelComplete && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-gray-900/95 border-2 border-green-400 px-10 py-8 rounded-3xl text-white text-center shadow-[0_25px_65px_rgba(0,0,0,0.7)] animate-bounce">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-300 mb-3">
              Mission Complete
            </p>
            <h2 className="text-4xl font-bold mb-2 tracking-wide">Great Work!</h2>
            <p className="text-lg text-gray-200">All hazards handled like a pro firefighter.</p>
          </div>
        </div>
      )}
      
      {/* Pause Menu */}
      {isPaused && (
        <PauseMenu onResume={resumeGame} onRestart={resetLevel} />
      )}
    </>
  );
}
