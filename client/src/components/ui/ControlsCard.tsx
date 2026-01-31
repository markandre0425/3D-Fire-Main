import { useEffect, useState } from "react";
import { Button } from "./button";

const useActiveKeys = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code;
      setActiveKeys((prev) => new Set(prev).add(code));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return activeKeys;
};

interface ControlsCardProps {
  onStopTest?: () => void;
}

export function ControlsCard({ onStopTest }: ControlsCardProps) {
  const activeKeys = useActiveKeys();

  const controls = [
    { label: "WASD", keys: ["KeyW", "KeyA", "KeyS", "KeyD"], action: "Move" },
    { label: "E", keys: ["KeyE"], action: "Grab" },
    { label: "F", keys: ["KeyF"], action: "Spray" },
    { label: "C", keys: ["KeyC"], action: "Duck" },
    { label: "R", keys: ["KeyR"], action: "Unstuck" },
    { label: "ESC", keys: ["Escape"], action: "Pause" },
  ];

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl border-4 border-yellow-300 p-4 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-black text-xl text-yellow-800">🎮 CONTROLS</h4>
        <Button
          size="sm"
          variant="ghost"
          onClick={onStopTest}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-300 px-3 py-1 rounded-md font-bold uppercase text-sm"
        >
          Stop Test
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {controls.map((ctrl) => {
          const isActive = ctrl.keys.some((k) => activeKeys.has(k));

          return (
            <div
              key={ctrl.label}
              className={`
                flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-100
                ${
                  isActive
                    ? "bg-green-500/20 border-green-500 text-green-700 shadow-[0_0_15px_rgba(34,197,94,0.3)] scale-105"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }
              `}
            >
              <span
                className={`text-2xl font-black mb-1 ${isActive ? "text-green-600" : "text-gray-800"}`}
              >
                {ctrl.label}
              </span>
              <span className="text-xs uppercase tracking-wider opacity-80 font-bold">
                {ctrl.action}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
