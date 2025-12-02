import React from "react";

interface KeyCapProps {
  label: string;
  width?: string;
}

function KeyCap({ label, width = "w-9" }: KeyCapProps) {
  return (
    <div
      className={`
        ${width} h-9
        bg-neutral-700 border-2 border-gray-400 rounded
        flex items-center justify-center
        shadow-sm
      `}
    >
      <span className="text-xs font-bold text-white uppercase tracking-wide">{label}</span>
    </div>
  );
}

function ControlRow({ keyLabel, label }: { keyLabel: string; label: string }) {
  return (
    // FIX 1: Changed justify-end to justify-start so [Key][Label] always starts from the left
    <div className="flex items-center justify-start gap-3">
      <div
        className="
          w-9 h-9
          bg-neutral-700 border-2 border-gray-400 rounded
          flex items-center justify-center
          shadow-sm
        "
      >
        <span className="text-xs font-bold text-white uppercase">{keyLabel}</span>
      </div>
      <span className="text-sm font-medium text-white/90 drop-shadow-md">
        {label}
      </span>
    </div>
  );
}

export default function ControlsHelp() {
  return (
    <div className="absolute bottom-8 right-8 pointer-events-none select-none flex flex-col items-end gap-6">
      {/* SECONDARY ACTIONS LIST */}
      <div className="flex flex-col items-start gap-2">
        <ControlRow keyLabel="E" label="Interact" />
        <ControlRow keyLabel="F" label="Extinguish" />
        <ControlRow keyLabel="C" label="Crouch" />
        <ControlRow keyLabel="R" label="Respawn / Unstuck" />
      </div>

      {/* MOVEMENT & PRIMARY ACTIONS CLUSTER */}
      <div className="flex items-end gap-4">
        {/* Left: WASD */}
        <div className="flex flex-col items-center gap-1">
          <KeyCap label="W" />
          <div className="flex gap-1">
            <KeyCap label="A" />
            <KeyCap label="S" />
            <KeyCap label="D" />
          </div>
        </div>

        {/* Right: Shift */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <KeyCap label = "Space" width="w-24" />
            <span className="text-sm font-medium text-white/90 drop-shadow-md">Jump</span>
          </div>
          <div className="flex items-center gap-3">
            <KeyCap label="SHIFT" width="w-24" />
            <span className="text-sm font-medium text-white/90 drop-shadow-md">Sprint</span>
          </div>  
        </div>
      </div>
    </div>
  );
}