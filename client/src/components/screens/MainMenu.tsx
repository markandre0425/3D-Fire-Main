import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ControlsCard } from "@/components/ui/ControlsCard";
import { useAudio } from "@/lib/stores/useAudio";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { useSettings } from "@/lib/stores/useSettings";
import {
  Shield,
  Flame,
  Home,
  Star,
  ArrowLeft,
  Volume2,
  VolumeX,
} from "lucide-react";
import { LEVELS } from "@/lib/constants";
import { Level, DifficultyLevel } from "@/lib/types";

interface MainMenuProps {
  onStartTutorial: () => void;
  onStartGame: () => void;
}

export default function MainMenu({ onStartTutorial, onStartGame }: MainMenuProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [expandedHowToPlay, setExpandedHowToPlay] = useState(false);
  const { isMuted, toggleMute, masterVolume, setMasterVolume } = useAudio();
  const { startLevel } = useFireSafety();
  const { difficulty, setDifficulty } = useSettings();

  const getDifficultyStyle = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.Beginner:
        return {
          icon: "🌱",
          label: "Rookie",
          cardBorderClass: "border-green-200 hover:border-green-500",
          badgeClass: "bg-green-100 text-green-700",
        };
      case DifficultyLevel.Intermediate:
        return {
          icon: "⭐",
          label: "Cadet",
          cardBorderClass: "border-yellow-200 hover:border-yellow-500",
          badgeClass: "bg-yellow-100 text-yellow-700",
        };
      case DifficultyLevel.Advanced:
        return {
          icon: "🔥",
          label: "Hero",
          cardBorderClass: "border-orange-200 hover:border-orange-500",
          badgeClass: "bg-orange-100 text-orange-700",
        };
      case DifficultyLevel.Expert:
        return {
          icon: "💎",
          label: "Captain",
          cardBorderClass: "border-red-200 hover:border-red-500",
          badgeClass: "bg-red-100 text-red-700",
        };
      case DifficultyLevel.Master:
        return {
          icon: "👑",
          label: "Chief",
          cardBorderClass: "border-purple-200 hover:border-purple-500",
          badgeClass: "bg-purple-100 text-purple-700",
        };
      default:
        return {
          icon: "⚫",
          label: "Unknown",
          cardBorderClass: "border-gray-200 hover:border-gray-500",
          badgeClass: "bg-gray-100 text-gray-700",
        };
    }
  };

  const handleLevelSelect = (level: Level) => {
    startLevel(level);
    onStartGame();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 z-50 font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Shield
          className="absolute top-10 left-10 w-12 h-12 text-yellow-300 animate-bounce opacity-40"
          style={{ animationDuration: "3s" }}
        />
        <Flame
          className="absolute bottom-20 right-20 w-16 h-16 text-orange-400 animate-pulse opacity-40"
          style={{ animationDuration: "2s" }}
        />
        <Home
          className="absolute top-1/3 right-10 w-10 h-10 text-green-300 animate-bounce opacity-40"
          style={{ animationDuration: "4s" }}
        />
        <Star className="absolute bottom-10 left-1/4 w-8 h-8 text-yellow-200 animate-spin-slow opacity-40" />
      </div>
      
      <Card className="w-full max-w-4xl h-[90vh] bg-white/95 border-8 border-yellow-400 shadow-2xl relative z-10 flex flex-col rounded-[2.5rem] overflow-hidden transform transition-all">
        <CardHeader className="text-center bg-gradient-to-b from-red-500 to-orange-500 text-white p-6 shadow-md relative z-20">
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white hover:bg-white/20 rounded-full w-12 h-12"
            >
              {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-6xl filter drop-shadow-lg">🚒</span>
              <CardTitle className="text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] stroke-black">
                APULA HEROES
              </CardTitle>
              <span className="text-6xl filter drop-shadow-lg">🧯</span>
            </div>
            <CardDescription className="text-xl text-yellow-100 font-bold bg-black/10 px-6 py-2 rounded-full inline-block">
              BFP Fire Safety Adventure
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 bg-gradient-to-b from-blue-50 to-purple-50 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
          {/* --- VIEW 1: MISSION SELECT --- */}
          {showLevelSelect ? (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="flex items-center mb-4">
                  <Button
                    onClick={() => setShowLevelSelect(false)}
                  className="mr-4 bg-gray-400 hover:bg-gray-500 text-white w-12 h-12 rounded-full shadow-md"
                  >
                  <ArrowLeft className="w-6 h-6" />
                  </Button>
                <h3 className="text-3xl font-black text-red-600 uppercase tracking-wide">Select Mission</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {Object.values(LEVELS).map((level) => {
                  const difficultyStyle = getDifficultyStyle(level.difficulty);
                  return (
                    <div
                      key={level.id}
                      className={`group bg-white p-4 rounded-2xl border-4 ${difficultyStyle.cardBorderClass} transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1`}
                      onClick={() => handleLevelSelect(level.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="bg-gray-100 p-2 rounded-xl text-2xl group-hover:scale-110 transition-transform">
                          {difficultyStyle.icon}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${difficultyStyle.badgeClass}`}
                        >
                          {difficultyStyle.label}
                        </div>
                      </div>
                      
                      <h4 className="text-xl font-black text-gray-800 mb-1 group-hover:text-blue-600">{level.name}</h4>
                      <p className="text-sm text-gray-500 leading-tight mb-3 line-clamp-2">{level.description}</p>

                      <div className="flex gap-2 text-xs font-bold">
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md">
                          🔥 {level.hazards.length} Hazards
                        </span>
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                          🧯 {level.objects.length} Tools
                        </span>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
          ) : showOptions ? (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <div className="flex items-center mb-6">
                <Button onClick={() => setShowOptions(false)} className="mr-4 bg-gray-400 rounded-full w-10 h-10 p-0">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h3 className="text-3xl font-black text-purple-600">SETTINGS</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border-4 border-purple-200 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">Sound Effects</h4>
                    <p className="text-sm text-gray-500">Enable audio for maximum immersion</p>
                  </div>
                  <Button
                    onClick={toggleMute}
                    className={`w-32 h-12 text-lg font-bold rounded-xl transition-colors ${
                      isMuted ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-green-100 text-green-600 hover:bg-green-200"
                    }`}
                  >
                    {isMuted ? "OFF" : "ON"}
                  </Button>
                </div>
                <div className="space-y-6">
                  {/* Master Volume Slider */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">Volume</h4>
                      <p className="text-sm text-gray-500">Adjust how loud the game is</p>
                    </div>
                    <div className="flex items-center gap-3 w-56">
                      <span className="text-sm text-gray-500 w-8 text-right">
                        {Math.round(masterVolume * 100)}%
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={Math.round(masterVolume * 100)}
                        onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Difficulty Selection */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">Difficulty</h4>
                      <p className="text-sm text-gray-500">Choose Difficulty</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setDifficulty(DifficultyLevel.Beginner)}
                        className={`px-4 h-10 text-sm font-bold rounded-full border-2 ${
                          difficulty === DifficultyLevel.Beginner
                            ? "bg-green-500 text-white border-green-700"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        Kid
                      </Button>
                      <Button
                        onClick={() => setDifficulty(DifficultyLevel.Intermediate)}
                        className={`px-4 h-10 text-sm font-bold rounded-full border-2 ${
                          difficulty === DifficultyLevel.Intermediate
                            ? "bg-yellow-500 text-white border-yellow-700"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        Standard
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in zoom-in-95 duration-300">
              <div className="bg-white p-6 rounded-3xl border-4 border-orange-200 shadow-lg max-w-2xl text-center relative overflow-visible">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-1 rounded-full font-bold text-sm shadow-sm border-2 border-white">
                  CAPTAIN BERONG BUMBERO SAYS:
                </div>
                <p className="text-xl text-gray-700 font-medium mt-2">
                  "Welcome to the team, Recruit! Before we fight fires, let's learn the basics in the Training Course!"
                </p>
              </div>
              
              <div className="grid grid-cols-1 w-full max-w-md gap-4">
                <Button 
                  className="group relative overflow-hidden bg-green-500 hover:bg-green-400 text-white h-24 text-2xl font-black rounded-3xl border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all shadow-xl"
                  onClick={onStartTutorial}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <span className="text-4xl group-hover:animate-bounce">🎓</span>
                    START TRAINING
                  </span>
                </Button>
                
                <Button 
                  className="group bg-blue-500 hover:bg-blue-400 text-white h-20 text-xl font-black rounded-3xl border-b-8 border-blue-700 active:border-b-0 active:translate-y-2 transition-all shadow-xl"
                  onClick={() => setShowLevelSelect(true)}
                >
                  <span className="flex items-center justify-center gap-3">
                    <span className="text-3xl">🗺️</span>
                    MISSION SELECT
                  </span>
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="bg-purple-500 hover:bg-purple-400 text-white h-16 font-bold rounded-2xl border-b-6 border-purple-700 active:border-b-0 active:translate-y-2 transition-all"
                    onClick={() => setShowOptions(true)}
                  >
                    ⚙️ SETTINGS
                  </Button>
                  <Button
                    className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 h-16 font-bold rounded-2xl border-b-6 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
                    onClick={() => setExpandedHowToPlay(!expandedHowToPlay)}
                  >
                    🎮 CONTROLS
                  </Button>
                </div>
              </div>
                
                {expandedHowToPlay && (
                  <ControlsCard onStopTest={() => setExpandedHowToPlay(false)} />
                )}
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


