import { Level, LevelData, SafetyTip, SafetyTipCategory, HazardType, InteractiveObjectType, DifficultyLevel } from "./types";

export const LEVELS: Record<Level, LevelData> = {
  [Level.BasicTraining]: {
    id: Level.BasicTraining,
    name: "Basic Training",
    description: "Learn fire safety fundamentals: movement, equipment pickup, and extinguishing fires",
    hazards: [
      {
        id: "tutorial-fire",
        type: HazardType.ClassAFire,
        position: { x: 0, y: 0, z: -52 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "tutorial-mask",
        type: InteractiveObjectType.GasMask,
        position: { x: -3, y: 1.2, z: -32 },
        isActive: true,
        isCollected: false
      },
      {
        id: "tutorial-extinguisher",
        type: InteractiveObjectType.FireExtinguisher,
        position: { x: 3, y: 1.2, z: -42 },
        isActive: true,
        isCollected: false
      }
    ],
    environmentObjects: [],
    requiredScore: 100,
    difficulty: DifficultyLevel.Beginner,
    learningObjectives: [
      "Master basic movement controls (WASD, Space, C)",
      "Learn to pick up equipment (Gas Mask, Extinguisher)",
      "Practice extinguishing fires with the PASS technique"
    ]
  },
  [Level.Kitchen]: {
    id: Level.Kitchen,
    name: "Kitchen Safety",
    description: "Learn how to prevent and respond to kitchen fires",
    hazards: [
      {
        id: "stove1",
        type: HazardType.StoveTop,
        position: { x: -4, y: 0, z: -9 },
        isActive: true,
        severity: 2,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "outlet1",
        type: HazardType.ElectricalOutlet,
        position: { x: -4, y: 0.4, z: -9.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet2",
        type: HazardType.ElectricalOutlet,
        position: { x: 9.9, y: 0.4, z: 3 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_kitchen_3",
        type: HazardType.ElectricalOutlet,
        position: { x: 4, y: 0.4, z: 9.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "extinguisher1",
        type: InteractiveObjectType.FireExtinguisher,
        position: { x: -9.9, y: 1.2, z: 4 },
        isActive: true,
        isCollected: false
      },
      {
        id: "gasmask1",
        type: InteractiveObjectType.GasMask,
        position: { x: -9.9, y: 1.2, z: -2 },
        isActive: true,
        isCollected: false
      },
      {
        id: "detector1",
        type: InteractiveObjectType.SmokeDetector,
        position: { x: 0, y: 2.5, z: 0 },
        isActive: false,
        isCollected: false
      },
      {
        id: "exit1",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: 0, y: 1.5, z: 9.8 },
        isActive: true,
        isCollected: false
      },
      {
        id: "cabinet_kitchen",
        type: "ExtinguisherCabinet" as InteractiveObjectType,
        position: { x: 7, y: 2, z: -4.9 },
        isActive: true,
        isCollected: false
      }
    ],
    environmentObjects: [
      {
        id: "floor",
        type: "floor",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 20, y: 0.1, z: 20 }
      },
      {
        id: "wall1",
        type: "wall",
        position: { x: 0, y: 1.5, z: -10 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 20, y: 3, z: 0.1 }
      },
      {
        id: "wall2",
        type: "wall",
        position: { x: 0, y: 1.5, z: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 20, y: 3, z: 0.1 }
      },
      {
        id: "wall3",
        type: "wall",
        position: { x: -10, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 20, y: 3, z: 0.1 }
      },
      {
        id: "wall4",
        type: "wall",
        position: { x: 10, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 20, y: 3, z: 0.1 }
      },
      {
        id: "counter1",
        type: "counter",
        position: { x: -4, y: 0, z: -7 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "table",
        type: "table",
        position: { x: -9, y: 0, z: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3, y: 1, z: 4 }
      },
      {
        id: "gas_stove_kitchen",
        type: "gas_stove",
        position: { x: -3.5, y: 0, z: -9 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.5, y: 2.5, z: 2.5 }
      },
      {
        id: "bathroom_kitchen",
        type: "minimal_bathroom",
        position: { x: 4, y: 0, z: -7.5 },
        rotation: { x: 0, y: Math.PI, z: 0 }, // Rotated 180° to face into room (mounted on north wall)
        scale: { x: 12, y: 3, z: 5 } // Depth reduced to fit within walls (z: -10 to -5)
      },
      {
        id: "sofa_kitchen",
        type: "office_sofa",
        position: { x: -1.7, y: .1, z: 1.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2, y: 0.7, z: 2 }
      },
      {
        id: "retro_fridge_kitchen",
        type: "retro_fridge",
        position: { x: -8.5, y: 1.6, z: -8.5 },
        rotation: { x: 0, y: 4.7, z: 0 },
        scale: { x: 2, y: 2, z: 2 }
      },
      {
        id: "sink_kitchen",
        type: "sink_with_faucet",
        position: { x: -6, y: 0, z: -10 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3, y: 2, z: 3 }
      },
      {
        id: "curvedTV_kitchen",
        type: "curvedTV",
        position: { x: -9.9, y: 1.2, z: 1 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 3, y: 2, z: 3.5 }
      }
    ],
    requiredScore: 300,
    difficulty: DifficultyLevel.Beginner,
    learningObjectives: [
      "Learn to identify common kitchen fire hazards",
      "Practice using fire extinguisher with PASS technique",
      "Understand importance of smoke detector activation"
    ]
  },
  // --- LIVING ROOM LEVEL (Fully Procedural) ---
  [Level.LivingRoom]: {
    id: Level.LivingRoom,
    name: "Living Room Safety",
    description: "Identify hazards in the Bedroom, Closet, Bathroom, and Living Area.",
    hazards: [
      // 1. Fireplace (Living Room South Wall)
      {
        id: "fireplace1",
        type: HazardType.Fireplace,
        position: { x: -5, y: 0, z: 9 }, 
        isActive: true,
        severity: 2,
        isSmoking: true,
        isExtinguished: false
      },
      // 2. Candle (On Living Room Coffee Table)
      {
        id: "candle1",
        type: HazardType.Candle,
        position: { x: -6.5, y: 0.6, z: 5 }, 
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      // 3. Space Heater (Bedroom - Dangerous position near bed)
      {
        id: "heater1",
        type: HazardType.SpacerHeater,
        position: { x: -8, y: 0, z: -6 }, 
        isActive: true,
        severity: 2,
        isSmoking: true,
        isExtinguished: false
      },
      // 4. Electrical Outlets
      {
        id: "outlet_entertainment",
        type: HazardType.ElectricalOutlet,
        position: { x: -9.9, y: 0.5, z: 5 }, // Behind Living Room TV
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_computer",
        type: HazardType.ElectricalOutlet,
        position: { x: -9.9, y: 0.5, z: -3 }, // Behind Bedroom Computer
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_closet",
        type: HazardType.ElectricalOutlet,
        position: { x: 4, y: 0.5, z: -9.9 }, // Inside Closet
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "extinguisher2",
        type: InteractiveObjectType.FireExtinguisher,
        position: { x: 9.9, y: 1.2, z: 5 }, // Mounted on East Wall, facing west
        isActive: true,
        isCollected: false
      },
      {
        id: "gasmask3",
        type: InteractiveObjectType.GasMask,
        position: { x: -9.9, y: 1.6, z: -8 }, // Mounted on West Wall, facing camera
        isActive: true,
        isCollected: false
      },
      {
        id: "detector2",
        type: InteractiveObjectType.SmokeDetector,
        position: { x: 0, y: 2.8, z: 0 }, // Ceiling Center
        isActive: false,
        isCollected: false
      },
      {
        id: "exit2",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: 0, y: 1.5, z: 9.8 }, // South Wall Exit (matches Kitchen level)
        isActive: true,
        isCollected: false
      },
      {
        id: "cabinet_livingroom",
        type: "ExtinguisherCabinet" as InteractiveObjectType,
        position: { x: 9.5, y: 1.7, z: 0 }, // East Wall
        isActive: true,
        isCollected: false
      }
    ],
    environmentObjects: [
      // --- 1. STRUCTURE ---
      { id: "floor", type: "floor", position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20, y: 0.1, z: 20 } },
      // Outer Walls
      { id: "wall_n", type: "wall", position: { x: 0, y: 1.5, z: -10 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20, y: 3, z: 0.1 } },
      { id: "wall_s", type: "wall", position: { x: 0, y: 1.5, z: 10 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20, y: 3, z: 0.1 } },
      { id: "wall_e", type: "wall", position: { x: 10, y: 1.5, z: 0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 20, y: 3, z: 0.1 } },
      { id: "wall_w", type: "wall", position: { x: -10, y: 1.5, z: 0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 20, y: 3, z: 0.1 } },

      // --- 2. BEDROOM (Top Left: x -10 to 0, z -10 to 0) ---
      // Divider Wall (Vertical at x=0) with DOORWAY GAP (Door at z = -4 to -2)
      { id: "wall_bed_v1", type: "wall", position: { x: 0, y: 1.5, z: -8 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 4, y: 3, z: 0.1 } }, // -10 to -6
      { id: "wall_bed_v2", type: "wall", position: { x: 0, y: 1.5, z: -1 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 2, y: 3, z: 0.1 } }, // -2 to 0
      // Divider Wall (Horizontal at z=0) with DOORWAY GAP
      // Left Wall (-10 to -6)
      { id: "wall_bed_h_left", type: "wall", position: { x: -8, y: 1.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4, y: 3, z: 0.1 } },
      // Right Wall (-4 to 0) - Creates a 2m gap between -6 and -4
      { id: "wall_bed_h_right", type: "wall", position: { x: -2, y: 1.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4, y: 3, z: 0.1 } },
      
      // Bedroom Furniture
      { id: "bed_main", type: "bed", position: { x: -8, y: 0, z: -8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "dresser_main", type: "dresser", position: { x: -3, y: 0, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      // COMPUTER SET (Replaces old TV)
      { id: "pc_setup", type: "computer_desk", position: { x: -9, y: 0, z: -3 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 } },

      // --- 3. CLOSET & BATHROOM (Top Right: x 0 to 10, z -10 to 0) ---
      // REPLACED OLD WALL WITH DOORWAY CONFIGURATION:
      // Left Wall (0 to 7)
      { id: "wall_bath_h_left", type: "wall", position: { x: 3.5, y: 1.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7, y: 3, z: 0.1 } },
      // Right Wall (9 to 10) - Creates a 2m gap between 7 and 9
      { id: "wall_bath_h_right", type: "wall", position: { x: 9.5, y: 1.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 3, z: 0.1 } },
      // Vertical Divider between Closet and Bath (at x=5)
      { id: "wall_bath_v", type: "wall", position: { x: 5, y: 1.5, z: -5 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 10, y: 3, z: 0.1 } },
      
      // Closet (Left part of Top Right) - Walk-in Closet (position independently from lights)
      { id: "walk_in_closet_main", type: "walk_in_closet", position: { x: 3.5, y: 0, z: -5 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      // Closet ceiling lights (separate object so they can stay fixed or move independently)
      { id: "closet_lights_strip_1", type: "walk_in_closet_lights_1", position: { x: 5, y: 2.8, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "closet_lights_strip_2", type: "bathroom_lights_1", position: { x: 7.5, y: 2.8, z: -9.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      
      // Bathroom (Right part of Top Right)
      { id: "bath_sink", type: "sink_with_faucet", position: { x: 5.84, y: 0, z: 0 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 2, y: 2, z: 2 } },
      { id: "bath_mirror", type: "mirror", position: { x: 5.84, y: 1.5, z: 0.1 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "bath_tub", type: "bathtub", position: { x: 7.08, y: 0, z: -8.60 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 2, z: 2 } },
      { id: "bath_mirror_tub", type: "mirror", position: { x: 9.66, y: 1.5, z: -8.65 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "bath_toilet", type: "toilet", position: { x: 6, y: 0, z: -4.20 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 2, y: 2, z: 2 } },
      { id: "bath_stool", type: "stool", position: { x: 9, y: 0, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // --- 4. LIVING AREA (Bottom Left: x -10 to 0, z 0 to 10) ---
      { id: "wall_tv_living", type: "wall_tv", position: { x: -9.78, y: 2.2, z: 4.73 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.8, y: 1.5, z: 2 } },
      { id: "tv_stand", type: "tv", position: { x: -9, y: 0, z: 5 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
      { id: "sofa_main", type: "sofa", position: { x: -4, y: 0, z: 5 }, rotation: { x: 0, y: -Math.PI / 8, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
      { id: "coffee_table", type: "coffee", position: { x: -6.5, y: 0, z: 5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "bookshelf", type: "book", position: { x: -2, y: 0, z: 9 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1 } },
      { id: "floor_lamp", type: "lamp", position: { x: -9, y: 0, z: 9 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      // NEW: Speakers (left & right of TV)
      { id: "speaker_living", type: "speaker", position: { x: -9, y: 0, z: 2 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
      { id: "speaker_living_right", type: "speaker", position: { x: -9, y: 0, z: 8 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },

      // --- 5. DINING AREA (Bottom Right: x 0 to 10, z 0 to 10) ---
      { id: "dining_tbl", type: "table", position: { x: -6.68, y: 0, z: 6.8 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 } },
      { id: "stool_1", type: "stool", position: { x: 5, y: 0, z: 6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "stool_2", type: "stool", position: { x: 7, y: 0, z: 6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "stool_3", type: "stool", position: { x: 6, y: 0, z: 5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "stool_4", type: "stool", position: { x: 6, y: 0, z: 7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
    ],
    requiredScore: 400,
    difficulty: DifficultyLevel.Intermediate,
    learningObjectives: [
      "Identify multiple fire sources in one room",
      "Practice proper spacing from space heaters",
      "Learn candle safety and fireplace management"
    ]
  },
  [Level.Garage]: {
    id: Level.Garage,
    name: "Garage Workshop Safety",
    description: "Navigate fire hazards in a garage workshop with flammable liquids, electrical tools, and hot equipment.",
    hazards: [
      // 1. Gasoline fire near workbench (Class B - Flammable liquids)
      {
        id: "gas_can_fire",
        type: HazardType.ClassBFire,
        position: { x: -7, y: 0, z: -7 },
        isActive: true,
        severity: 2.5,
        isSmoking: true,
        isExtinguished: false
      },
      // 2. Electrical fire from overloaded power strip (Class C)
      {
        id: "power_strip_fire",
        type: HazardType.ClassCFire,
        position: { x: 7, y: 0, z: -8 },
        isActive: true,
        severity: 2,
        isSmoking: true,
        isExtinguished: false
      },
      // 3. Oily rag fire (spontaneous combustion - Class B)
      {
        id: "oily_rag_fire",
        type: HazardType.ClassBFire,
        position: { x: 5, y: 0, z: 5 },
        isActive: true,
        severity: 1.5,
        isSmoking: true,
        isExtinguished: false
      },
      // 4. Overloaded outlets (mounted on walls at eye level)
      {
        id: "outlet_garage_1",
        type: HazardType.ElectricalOutlet,
        position: { x: -9.9, y: 0.4, z: 0 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_garage_2",
        type: HazardType.ElectricalOutlet,
        position: { x: 9.9, y: 0.4, z: -4 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      // 5. Gas leak from propane tank
      {
        id: "propane_leak",
        type: HazardType.GasLeak,
        position: { x: -8, y: 0, z: 6 },
        isActive: true,
        severity: 2,
        isSmoking: false,
        isExtinguished: false
      }
    ],
    objects: [
      // Fire extinguisher (Class B for flammable liquids) - mounted on west wall
      {
        id: "extinguisher_garage",
        type: InteractiveObjectType.FoamExtinguisher,
        position: { x: -9.5, y: 1.2, z: -7 },
        isActive: true,
        isCollected: false
      },
      // CO2 Extinguisher for electrical fires - mounted on east wall
      {
        id: "co2_extinguisher",
        type: InteractiveObjectType.CO2Extinguisher,
        position: { x: 9.5, y: 1.2, z: -5 },
        isActive: true,
        isCollected: false
      },
      // Gas mask for fumes (mounted on north wall)
      {
        id: "gasmask_garage",
        type: InteractiveObjectType.GasMask,
        position: { x: 3, y: 1.5, z: -9.5 },
        isActive: true,
        isCollected: false
      },
      // Heat alarm (not smoke alarm - for garages)
      {
        id: "heat_alarm",
        type: InteractiveObjectType.SmokeDetector,
        position: { x: 0, y: 2.8, z: 0 },
        isActive: false,
        isCollected: false
      },
      // Emergency exit (fire-rated door)
      {
        id: "exit_garage",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: 0, y: 1.5, z: 9.8 },
        isActive: true,
        isCollected: false
      },
      // Fire Extinguisher Cabinet (refill station)
      {
        id: "cabinet_garage",
        type: "ExtinguisherCabinet" as InteractiveObjectType,
        position: { x: -5, y: 1.3, z: -9.9 }, // Same position as visual cabinet
        isActive: true,
        isCollected: false
      }
    ],
    environmentObjects: [
      // Floor (concrete texture)
      {
        id: "floor_garage",
        type: "floor",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 20, y: 0.1, z: 20 }
      },
      // Walls
      {
        id: "wall_garage_n",
        type: "wall",
        position: { x: 0, y: 1.5, z: -10 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 20, y: 3, z: 0.1 }
      },
      {
        id: "wall_garage_s",
        type: "wall",
        position: { x: 0, y: 1.5, z: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 20, y: 3, z: 0.1 }
      },
      {
        id: "wall_garage_w",
        type: "wall",
        position: { x: -10, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 20, y: 3, z: 0.1 }
      },
      {
        id: "wall_garage_e",
        type: "wall",
        position: { x: 10, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 20, y: 3, z: 0.1 }
      },
      // Workbench (west wall)
      {
        id: "workbench_main",
        type: "workbench",
        position: { x: -8, y: 0, z: -5 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Shelving unit (east wall)
      {
        id: "shelving_1",
        type: "garage_shelving",
        position: { x: 8, y: 0, z: -6 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Car placeholder (center)
      {
        id: "car_main",
        type: "garage_car",
        position: { x: 0, y: 0, z: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.5, y: 1.5, z: 1.5 }
      },
      // Gas cans (near workbench - hazard source)
      {
        id: "gas_cans",
        type: "gas_cans",
        position: { x: -7, y: 0, z: -7 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Tool pegboard (on wall) - 2x scale
      {
        id: "pegboard",
        type: "tool_pegboard",
        position: { x: -9.9, y: 1.8, z: -2 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 2, y: 2, z: 2 }
      },
      // Trash/oily rags bin (fire hazard)
      {
        id: "oily_rags_bin",
        type: "trash_bin",
        position: { x: 5, y: 0, z: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // --- VISUAL PROPS ---
      // Oil puddle under gas cans (visual storytelling)
      {
        id: "puddle_gas_cans",
        type: "oil_puddle",
        position: { x: -7, y: 0, z: -7 },
        rotation: { x: 0, y: 0.5, z: 0 },
        scale: { x: 1.2, y: 1, z: 1.2 }
      },
      // Oil drip under car
      {
        id: "puddle_car",
        type: "oil_puddle",
        position: { x: 0, y: 0, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 1, z: 0.8 }
      },
      // Ladder hanging on east wall
      {
        id: "wall_ladder",
        type: "ladder",
        position: { x: 9.8, y: 1.3, z: 3 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Bike mounted on west wall
      {
        id: "wall_bike",
        type: "hanging_bike",
        position: { x: -9.7, y: 1.8, z: 4 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1.2, y: 1.2, z: 1.2 }
      },
      // Motorcycle parked near south wall
      {
        id: "motorcycle",
        type: "motorcycle",
        position: { x: 6, y: 0, z: 7 },
        rotation: { x: 0, y: -Math.PI / 4, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // === ADDITIONAL GARAGE EQUIPMENT ===
      // Shop Vac near workbench
      {
        id: "shop_vac",
        type: "shop_vac",
        position: { x: -7, y: 0, z: -8 },
        rotation: { x: 0, y: 0.3, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Fire Extinguisher Cabinet on north wall
      {
        id: "extinguisher_cabinet",
        type: "extinguisher_cabinet",
        position: { x: -5, y: 1.3, z: -9.9 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.5, y: 1.5, z: 1.5 }
      },
      // First Aid Kit on east wall
      {
        id: "first_aid_kit",
        type: "first_aid_kit",
        position: { x: 9.9, y: 1.4, z: -2 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Metal Locker near entrance
      {
        id: "locker_1",
        type: "locker",
        position: { x: 8, y: 0, z: 8.5 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Hose Reel on west wall
      {
        id: "hose_reel",
        type: "hose_reel",
        position: { x: -9.9, y: 1.2, z: -6 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Floor Jack near car
      {
        id: "floor_jack",
        type: "floor_jack",
        position: { x: -3, y: 0, z: 2 },
        rotation: { x: 0, y: 0.5, z: 0 },
        scale: { x: 1.2, y: 1.2, z: 1.2 }
      },
      // Air Compressor against east wall
      {
        id: "air_compressor",
        type: "air_compressor",
        position: { x: 8, y: 0, z: -7 },
        rotation: { x: 0, y: -Math.PI / 4, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Tire Rack against south wall
      {
        id: "tire_rack",
        type: "tire_rack",
        position: { x: -6, y: 0, z: 9 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.2, y: 1.2, z: 1.2 }
      },
      // Oil Drum Rack (flammable!) near shelving
      {
        id: "oil_drums",
        type: "oil_drum_rack",
        position: { x: 7, y: 0, z: 5 },
        rotation: { x: 0, y: -0.3, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Oil Cans on workbench area
      {
        id: "oil_cans",
        type: "oil_cans",
        position: { x: -8.5, y: 0.9, z: -8.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Safety Cones near hazard areas
      {
        id: "safety_cones_1",
        type: "safety_cones",
        position: { x: 3, y: 0, z: -6 },
        rotation: { x: 0, y: 0.2, z: 0 },
        scale: { x: 4, y: 4, z: 4 }
      },
      // Additional safety cones near gas area
      {
        id: "safety_cones_2",
        type: "safety_cones",
        position: { x: 6, y: 0, z: -3 },
        rotation: { x: 0, y: -0.5, z: 0 },
        scale: { x: 4, y: 4, z: 4 }
      }
    ],
    requiredScore: 600,
    difficulty: DifficultyLevel.Expert,
    learningObjectives: [
      "Identify flammable liquid hazards (gasoline, paint, propane)",
      "Use proper extinguisher types (Class B for liquids, Class C for electrical)",
      "Store flammables 3 feet from heat sources",
      "Recognize spontaneous combustion risks (oily rags)",
      "Use heat alarms instead of smoke alarms in garages"
    ]
  }
};

export const SAFETY_TIPS: SafetyTip[] = [
  {
    id: "tip1",
    title: "Keep an Eye on the Stove",
    content: "Never leave cooking food unattended. Stay in the kitchen while frying, grilling, or broiling food.",
    category: SafetyTipCategory.Prevention
  },
  {
    id: "tip2",
    title: "Check Smoke Detectors",
    content: "Test your smoke alarms monthly and replace batteries at least once a year.",
    category: SafetyTipCategory.Detection
  },
  {
    id: "tip3",
    title: "Fire Extinguisher Basics: PASS",
    content: "Pull the pin, Aim at the base of the fire, Squeeze the handle, Sweep from side to side.",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip4",
    title: "Create an Escape Plan",
    content: "Develop and practice a home fire escape plan with all family members. Know two ways out of every room.",
    category: SafetyTipCategory.Evacuation
  },
  {
    id: "tip5",
    title: "Keep Space Heaters Away",
    content: "Keep space heaters at least 3 feet away from anything that can burn.",
    category: SafetyTipCategory.Prevention
  },
  {
    id: "tip6",
    title: "Stop, Drop, and Roll",
    content: "If your clothes catch fire, stop, drop to the ground, and roll to smother the flames.",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip7",
    title: "Avoid Candle Hazards",
    content: "Keep candles at least 12 inches away from anything flammable and never leave them unattended.",
    category: SafetyTipCategory.Prevention
  },
  {
    id: "tip8",
    title: "Clean Dryer Lint",
    content: "Clean the lint filter in your dryer before and after each load of laundry to prevent fires.",
    category: SafetyTipCategory.Prevention
  },
  {
    id: "tip9",
    title: "Don't Overload Outlets",
    content: "Avoid plugging too many devices into a single outlet or extension cord.",
    category: SafetyTipCategory.Prevention
  },
  {
    id: "tip10",
    title: "Stay Low in Smoke",
    content: "If there's smoke, get low and crawl under it to reach your exit. Smoke rises, so the air is clearer near the floor.",
    category: SafetyTipCategory.Evacuation
  },
  // New BFP-certified safety tips
  {
    id: "tip11",
    title: "BFP Fire Classification System",
    content: "Class A: Ordinary combustibles (wood, paper, cloth). Class B: Flammable liquids. Class C: Electrical equipment. Class D: Metals. Class K: Cooking oils.",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip12",
    title: "PASS Technique Mastery",
    content: "Pull the pin, Aim at the base of the fire, Squeeze the handle steadily, Sweep from side to side. Remember: Never turn your back on a fire!",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip13",
    title: "Emergency Response Priority",
    content: "BFP Standard: 1) Alert others and call for help, 2) Evacuate if fire is too large, 3) Fight small fires only if safe to do so, 4) Use correct extinguisher type.",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip14",
    title: "Gas Leak Safety Protocol",
    content: "If you smell gas: Don't use electrical switches, open windows for ventilation, evacuate immediately, and call emergency services from a safe location.",
    category: SafetyTipCategory.Prevention
  },
  {
    id: "tip15",
    title: "Chemical Fire Safety",
    content: "Never use water on chemical fires. Use appropriate extinguisher type, evacuate if uncertain, and always report chemical incidents to authorities.",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip16",
    title: "Fire Triangle Knowledge",
    content: "Fire needs three elements: Heat, Fuel, and Oxygen. Remove any one element to extinguish the fire. This is the foundation of BFP fire safety training.",
    category: SafetyTipCategory.Response
  },
  {
    id: "tip17",
    title: "Captain Berong Bumbero's Golden Rule",
    content: "When in doubt, get out! Your safety is more important than property. Follow your evacuation plan and let trained firefighters handle dangerous situations.",
    category: SafetyTipCategory.Evacuation
  }
];

export const PLAYER_CONSTANTS = {
  MOVEMENT_SPEED: 3,
  RUNNING_SPEED: 6,
  CROUCH_SPEED: 1.5,
  TURNING_SPEED: 2,
  MAX_HEALTH: 100,
  MAX_OXYGEN: 100,
  OXYGEN_DEPLETION_RATE: 5,
  HEALTH_DEPLETION_RATE: 10,
  STARTING_POSITION: { x: 0, y: 0, z: 4 },
  CHARACTER_BOUNDING_BOX: { x: 1.5, y: 5.1, z: 1.5 }
};

export const GAME_CONSTANTS = {
  INTERACTION_DISTANCE: 2,
  FIRE_SPREAD_RATE: 0.05,
  EXTINGUISHER_RANGE: 3,
  POINTS_FOR_EXTINGUISHING: 100,
  POINTS_FOR_PREVENTION: 50,
  POINTS_FOR_DETECTOR: 75,
  DAMAGE_DISTANCE: 1.2,
  // Hazard damage system
  FIRE_DAMAGE_RANGE: 2.5,        // Distance at which fire starts dealing damage
  FIRE_DAMAGE_RATE: 8,           // Damage per second when in fire range
  SMOKE_RANGE: 4,                // Distance at which smoke affects oxygen
  OXYGEN_DEPLETION_RATE: 15,     // Oxygen loss per second in smoke
  GAS_MASK_PROTECTION: 0.9,      // Gas mask reduces oxygen depletion by 90%
  OXYGEN_RECOVERY_RATE: 10,      // Oxygen recovery per second when safe
  LOW_OXYGEN_DAMAGE_RATE: 5      // Damage per second when oxygen is 0
};

// Extinguisher ammo system constants
export const EXTINGUISHER_AMMO = {
  MAX_CAPACITY: 100,              // Maximum ammo percentage
  DEFAULT_DRAIN_RATE: 4,          // Default drain rate (% per second) - ~25 seconds of spray
  LOW_AMMO_THRESHOLD: 30,         // Show warning at 30%
  CRITICAL_AMMO_THRESHOLD: 10,    // Critical warning at 10%
  RESPAWN_DELAY: 15000,           // 15 seconds to respawn after depletion
  CABINET_REFILL_AMOUNT: 100,     // Full refill from cabinet
  
  // Drain rates per extinguisher type (% per second)
  // Lower = longer spray time, Higher = shorter spray time
  DRAIN_RATES: {
    FireExtinguisher: 4,          // ~25 seconds
    WaterExtinguisher: 3.33,      // ~30 seconds
    FoamExtinguisher: 4,          // ~25 seconds
    CO2Extinguisher: 5,           // ~20 seconds
    PowderExtinguisher: 4,        // ~25 seconds
    WetChemicalExtinguisher: 3.33 // ~30 seconds
  } as Record<string, number>
};

export const COLLISION_GROUPS = {
  PLAYER: 1,
  ENVIRONMENT: 2,
  HAZARDS: 4,
  INTERACTIVE: 8
};
