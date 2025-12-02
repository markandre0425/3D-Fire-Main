import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/lib/stores/useGame";
import { useAudio } from "@/lib/stores/useAudio";

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
}

export default function PauseMenu({ onResume, onRestart }: PauseMenuProps) {
  const { restart } = useGame();
  const { isMuted, toggleMute } = useAudio();
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
      <Card className="w-full max-w-md bg-gray-900/95 border-2 border-gray-500 shadow-[0_25px_65px_rgba(0,0,0,0.8)] text-white">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-300">
            Pause Menu
          </CardTitle>
          <p className="text-2xl font-bold tracking-wide">Take A Breather</p>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex flex-col gap-3">
            <Button 
              className="w-full bg-gray-800 border-2 border-gray-500 hover:bg-gray-700 text-white py-4 uppercase tracking-[0.2em]"
              onClick={onResume}
            >
              Resume Game
            </Button>
            
            <Button 
              className="w-full bg-gray-800 border-2 border-gray-500 hover:bg-gray-700 text-white py-4 uppercase tracking-[0.2em]"
              onClick={onRestart}
            >
              Restart Level
            </Button>
            
            <Button 
              className="w-full bg-gray-800 border-2 border-gray-500 hover:bg-gray-700 text-white py-4 uppercase tracking-[0.2em]"
              onClick={toggleMute}
            >
              {isMuted ? "Unmute Sound" : "Mute Sound"}
            </Button>
            
            <Button 
              className="w-full bg-gray-800 border-2 border-gray-500 hover:bg-gray-700 text-white py-4 uppercase tracking-[0.2em]"
              onClick={restart}
            >
              Quit to Main Menu
            </Button>
          </div>
          
          <div className="mt-6 text-gray-400 text-xs text-center tracking-[0.25em] uppercase">
            Press ESC to resume the game
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
