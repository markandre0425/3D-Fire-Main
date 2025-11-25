export default function Crosshair() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative w-6 h-6 flex items-center justify-center">
        <span className="absolute block w-px h-4 bg-white/80" />
        <span className="absolute block h-px w-4 bg-white/80" />
        <span className="absolute block w-6 h-6 border border-white/30 rounded-full" />
      </div>
    </div>
  );
}

