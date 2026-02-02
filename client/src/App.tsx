import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
// import "@fontsource/inter"; // Temporarily disabled due to path issues
import { Controls } from "./lib/types";
import GameScreen from "./components/screens/GameScreen";
import MainMenu from "./components/screens/MainMenu";
import EndScreen from "./components/screens/EndScreen";
import TutorialScreen from "./components/screens/TutorialScreen";
import { useGame } from "./lib/stores/useGame";
import { useFireSafety } from "./lib/stores/useFireSafety";
import { Level } from "./lib/types";
import SoundManager from "./components/game/SoundManager";
import AudioUnlocker from "./components/game/AudioUnlocker";
import GameUI from "./components/game/GameUI";
import GameHUD from "./components/game/GameHUD";
import { Howl } from "howler";

const keyboardMap = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.action, keys: ["KeyE"] },
  { name: Controls.extinguish, keys: ["KeyF"] },
  { name: Controls.crouch, keys: ["KeyC"] },
  { name: Controls.run, keys: ["ShiftLeft"] },
  { name: Controls.jump, keys: ["Space"] },
  { name: Controls.pause, keys: ["Escape"] },
];

// Main App component
function App() {
  const { phase: gamePhase } = useGame();
  const [showCanvas, setShowCanvas] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const { setHitSound, setSuccessSound, setLevelCompletedSound, setCoughSound, setFireDamageSound, setDeathSound } = useAudio();

  useEffect(() => {
    // Configure Howl to use Web Audio API and prevent auto-initialization warnings
    const hit = new Howl({
      src: ['/sounds/hit.mp3'],
      volume: 0.5,
      html5: false, // Use Web Audio API instead of HTML5 audio
      preload: false, // Don't preload to avoid AudioContext initialization
    });
    
    const success = new Howl({
      src: ['/sounds/success.mp3'],
      volume: 0.5,
      html5: false,
      preload: false,
    });

    const levelCompleted = new Howl({
      src: ['/sounds/levelcompleted.mp3'],
      volume: 0.7,
      html5: false,
      preload: true, // Keep preload for this one as it's used for level completion
    });
    
    const cough = new Howl({
      src: ['/sounds/cough.mp3'],
      volume: 0.5,
      html5: false,
      preload: true, // Preload for quick response when player enters smoke
    });
    
    const fireDamage = new Howl({
      src: ['/sounds/Arayko.mp3'],
      volume: 0.6,
      html5: false,
      preload: true, // Preload for quick response when player takes fire damage
    });
    
    const death = new Howl({
      src: ['/sounds/Death.mp3'],
      volume: 0.7,
      html5: false,
      preload: true, // Preload for instant playback on death
    });
    
    // Set up event listeners after creation
    (levelCompleted as any).on('load', () => {
      console.log('✅ Level completed sound loaded successfully!');
      setLevelCompletedSound(levelCompleted);
    });
    
    (cough as any).on('load', () => {
      console.log('✅ Cough sound loaded successfully!');
    });
    
    (fireDamage as any).on('load', () => {
      console.log('✅ Fire damage sound loaded successfully!');
    });
    
    (death as any).on('load', () => {
      console.log('✅ Death sound loaded successfully!');
    });
    
    (levelCompleted as any).on('loaderror', (id: any, error: any) => {
      console.error('❌ Failed to load level completed sound:', error);
    });
    
    // Set the sound immediately (it will be ready when needed)
    setLevelCompletedSound(levelCompleted);
    setCoughSound(cough);
    setFireDamageSound(fireDamage);
    setDeathSound(death);
    
    setHitSound(hit);
    setSuccessSound(success);
    
    setLoadingComplete(true);
    
    return () => {
      hit.stop();
      success.stop();
      levelCompleted.stop();
      cough.stop();
      fireDamage.stop();
      death.stop();
    };
  }, [setHitSound, setSuccessSound, setLevelCompletedSound, setCoughSound, setFireDamageSound, setDeathSound]);

  // Update UI based on game phase
  useEffect(() => {
    if (loadingComplete) {
      switch (gamePhase) {
        case "ready":
          setShowMenu(true);
          setShowCanvas(false);
          setShowEndScreen(false);
          setShowTutorial(false);
          break;
        case "playing":
          setShowMenu(false);
          setShowCanvas(true);
          setShowEndScreen(false);
          break;
        case "ended":
          setShowEndScreen(true);
          break;
        default:
          break;
      }
    }
  }, [gamePhase, loadingComplete]);

  const startTutorial = () => {
    setShowMenu(false);
    setShowTutorial(true);
  };

  const startGame = () => {
    useGame.getState().start();
    setShowTutorial(false);
  };

  // When user completes the tutorial steps, set level to Basic Training so GameScreen shows TutorialLevel (3D)
  const startTutorialLevel = () => {
    useFireSafety.getState().startLevel(Level.BasicTraining);
    startGame();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen relative overflow-hidden">
        <KeyboardControls map={keyboardMap}>
          {showMenu && <MainMenu onStartTutorial={startTutorialLevel} onStartGame={startGame} />}
          
          {showTutorial && <TutorialScreen onComplete={startTutorialLevel} />}
          
          {showCanvas && (
            <>
              <Canvas
                shadows
                camera={{
                  position: [0, 5, 10],
                  fov: 50,
                  near: 0.1,
                  far: 1000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "default"
                }}
              >
                <color attach="background" args={["#87CEEB"]} />
                <Suspense fallback={null}>
                  <GameScreen />
                </Suspense>
              </Canvas>
              <div className="absolute inset-0 pointer-events-none">
                <GameUI />
                <GameHUD />
              </div>
            </>
          )}
          
          {showEndScreen && <EndScreen />}
          
          <SoundManager />
          <AudioUnlocker />
        </KeyboardControls>
      </div>
    </QueryClientProvider>
  );
}

export default App;
