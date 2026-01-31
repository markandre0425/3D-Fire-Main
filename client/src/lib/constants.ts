import { Level, LevelData, SafetyTip, SafetyTipCategory, HazardType, InteractiveObjectType, DifficultyLevel } from "./types";

export const LEVELS: Record<Level, LevelData> = {
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
  [Level.Bedroom]: {
    id: Level.Bedroom,
    name: "Bedroom Safety",
    description: "Practice fire safety measures in the bedroom",
    hazards: [
      {
        id: "outlet_bedroom_1",
        type: HazardType.ElectricalOutlet,
        position: { x: -9.9, y: 0.4, z: -4 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet5",
        type: HazardType.ElectricalOutlet,
        position: { x: 4, y: 0.4, z: 9.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_bedroom_3",
        type: HazardType.ElectricalOutlet,
        position: { x: 9.9, y: 0.4, z: 2 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_bedroom_4",
        type: HazardType.ElectricalOutlet,
        position: { x: -6, y: 0.4, z: -9.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_bedroom_5",
        type: HazardType.ElectricalOutlet,
        position: { x: 7, y: 0.4, z: -9.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "heater2",
        type: HazardType.SpacerHeater,
        position: { x: 6, y: 0, z: -6 },
        isActive: true,
        severity: 2,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "dryer1",
        type: HazardType.CloggedDryer,
        position: { x: 7, y: 0, z: 6 },
        isActive: true,
        severity: 3,
        isSmoking: true,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "extinguisher3",
        type: InteractiveObjectType.FireExtinguisher,
        position: { x: -9.9, y: 1.2, z: 5 },
        isActive: true,
        isCollected: false
      },
      {
        id: "gasmask5",
        type: InteractiveObjectType.GasMask,
        position: { x: -9.9, y: 1.2, z: -3 },
        isActive: true,
        isCollected: false
      },
      {
        id: "gasmask6",
        type: InteractiveObjectType.GasMask,
        position: { x: 9.9, y: 1.2, z: 4 },
        isActive: true,
        isCollected: false
      },
      {
        id: "detector3",
        type: InteractiveObjectType.SmokeDetector,
        position: { x: 0, y: 2.5, z: 0 },
        isActive: false,
        isCollected: false
      },
      {
        id: "exit3",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: 0, y: 1.5, z: 9.8 },
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
        id: "bed",
        type: "bed",
        position: { x: -5, y: 0, z: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2, y: 0.8, z: 3 }
      },
      {
        id: "dresser",
        type: "dresser",
        position: { x: -7, y: 0, z: -7 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.5, y: 1.6, z: 0.8 }
      },
      {
        id: "gas_stove_bedroom",
        type: "gas_stove",
        position: { x: 0, y: 0, z: -9 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.5, y: 1.5, z: 2.5 }
      },
      {
        id: "bathroom_bedroom",
        type: "minimal_bathroom",
        position: { x: 6, y: 0, z: -7.5 },
        rotation: { x: 0, y: Math.PI, z: 0 }, // Rotated 180° to face into room (mounted on north wall)
        scale: { x: 8, y: 3, z: 5 } // Depth reduced to fit within walls (z: -10 to -5)PORT
      }
    ],
    requiredScore: 500,
    difficulty: DifficultyLevel.Advanced,
    learningObjectives: [
      "Handle high-severity hazards like clogged dryers",
      "Manage multiple fire sources simultaneously",
      "Practice emergency response under time pressure"
    ]
  },
  [Level.BasicTraining]: {
    id: Level.BasicTraining,
    name: "BFP Basic Training",
    description: "Learn the fundamentals with Captain Berong Bumbero! Master the PASS technique and basic fire safety principles.",
    hazards: [
      {
        id: "classA1",
        type: HazardType.ClassAFire,
        position: { x: 0, y: 0, z: -4 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet6",
        type: HazardType.ElectricalOutlet,
        position: { x: -9.9, y: 0.4, z: 2 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet7",
        type: HazardType.ElectricalOutlet,
        position: { x: 9.9, y: 0.4, z: -2 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_basic_3",
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
        id: "waterExt1",
        type: InteractiveObjectType.WaterExtinguisher,
        position: { x: -9.9, y: 1.2, z: 6 },
        isActive: true,
        isCollected: false
      },
      {
        id: "basicDetector",
        type: InteractiveObjectType.SmokeDetector,
        position: { x: 0, y: 2.5, z: 0 },
        isActive: false,
        isCollected: false
      },
      {
        id: "basicExit",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: 0, y: 1.5, z: 9.8 },
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
        id: "gas_stove_training",
        type: "gas_stove",
        position: { x: -6, y: 0, z: -8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.5, y: 2.5, z: 2.5 }
      },
    ],
    requiredScore: 150,
    difficulty: DifficultyLevel.Beginner,
    learningObjectives: [
      "Master the PASS technique (Pull, Aim, Squeeze, Sweep)",
      "Identify Class A fires (ordinary combustibles)",
      "Use water extinguisher safely and effectively"
    ]
  },
  [Level.FireClassification]: {
    id: Level.FireClassification,
    name: "Fire Classification Challenge",
    description: "Test your knowledge of different fire types! Match the right extinguisher to each fire class.",
    hazards: [
      {
        id: "classA2",
        type: HazardType.ClassAFire,
        position: { x: -6, y: 0, z: -5 },
        isActive: true,
        severity: 2,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "classB1",
        type: HazardType.ClassBFire,
        position: { x: 0, y: 0, z: -5 },
        isActive: true,
        severity: 2,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "classC1",
        type: HazardType.ClassCFire,
        position: { x: 6, y: 0, z: -5 },
        isActive: true,
        severity: 2,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet8",
        type: HazardType.ElectricalOutlet,
        position: { x: -11.9, y: 0.4, z: 4 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet9",
        type: HazardType.ElectricalOutlet,
        position: { x: 11.9, y: 0.4, z: -6 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_fireclass_3",
        type: HazardType.ElectricalOutlet,
        position: { x: -4, y: 0.4, z: 11.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_fireclass_4",
        type: HazardType.ElectricalOutlet,
        position: { x: 7, y: 0.4, z: -11.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "waterExt2",
        type: InteractiveObjectType.WaterExtinguisher,
        position: { x: -11.9, y: 1.2, z: 8 },
        isActive: true,
        isCollected: false
      },
      {
        id: "foamExt1",
        type: InteractiveObjectType.FoamExtinguisher,
        position: { x: 0, y: 1.2, z: 11.9 },
        isActive: true,
        isCollected: false
      },
      {
        id: "co2Ext1",
        type: InteractiveObjectType.CO2Extinguisher,
        position: { x: 11.9, y: 1.2, z: 8 },
        isActive: true,
        isCollected: false
      },
      {
        id: "classDetector",
        type: InteractiveObjectType.SmokeDetector,
        position: { x: 0, y: 2.5, z: 0 },
        isActive: false,
        isCollected: false
      }
    ],
    environmentObjects: [
      {
        id: "floor",
        type: "floor",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24, y: 0.1, z: 24 }
      },
      {
        id: "wall1",
        type: "wall",
        position: { x: 0, y: 1.5, z: -12 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24, y: 3, z: 0.1 }
      },
      {
        id: "wall2",
        type: "wall",
        position: { x: 0, y: 1.5, z: 12 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24, y: 3, z: 0.1 }
      },
      {
        id: "wall3",
        type: "wall",
        position: { x: -12, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 24, y: 3, z: 0.1 }
      },
      {
        id: "wall4",
        type: "wall",
        position: { x: 12, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 24, y: 3, z: 0.1 }
      },
      {
        id: "gas_stove_classification",
        type: "gas_stove",
        position: { x: -8, y: 0, z: -10 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.5, y: 2.5, z: 2.5 }
      },
    ],
    requiredScore: 600,
    difficulty: DifficultyLevel.Intermediate,
    learningObjectives: [
      "Classify fire types: A (solids), B (liquids), C (electrical)",
      "Select appropriate extinguisher for each fire class",
      "Understand fire triangle principles"
    ]
  },
  [Level.EmergencyResponse]: {
    id: Level.EmergencyResponse,
    name: "Emergency Response Drill",
    description: "Handle multiple hazards and emergency scenarios like a true fire safety hero!",
    hazards: [
      {
        id: "classK1",
        type: HazardType.ClassKFire,
        position: { x: -4, y: 0, z: -6 },
        isActive: true,
        severity: 3,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "gasLeak1",
        type: HazardType.GasLeak,
        position: { x: 4, y: 0, z: -6 },
        isActive: true,
        severity: 3,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "smokeArea1",
        type: HazardType.SmokeScreen,
        position: { x: 0, y: 0, z: 0 },
        isActive: true,
        severity: 2,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "outlet10",
        type: HazardType.ElectricalOutlet,
        position: { x: -6, y: 0.4, z: -11.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet11",
        type: HazardType.ElectricalOutlet,
        position: { x: 6, y: 0.4, z: 11.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_emerg_3",
        type: HazardType.ElectricalOutlet,
        position: { x: -11.9, y: 0.4, z: -7 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_emerg_4",
        type: HazardType.ElectricalOutlet,
        position: { x: 11.9, y: 0.4, z: 6 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_emerg_5",
        type: HazardType.ElectricalOutlet,
        position: { x: 0, y: 0.4, z: -11.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "wetChemExt1",
        type: InteractiveObjectType.WetChemicalExtinguisher,
        position: { x: -11.9, y: 1.2, z: 8 },
        isActive: true,
        isCollected: false
      },
      {
        id: "emergencyAlarm1",
        type: InteractiveObjectType.EmergencyAlarm,
        position: { x: 8, y: 1.8, z: 8 },
        isActive: false,
        isCollected: false
      },
      {
        id: "firstAid1",
        type: InteractiveObjectType.FirstAidKit,
        position: { x: 0, y: 1.2, z: 11.9 },
        isActive: true,
        isCollected: false
      },
      {
        id: "emergExit1",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: -11.8, y: 1.5, z: 0 },
        isActive: true,
        isCollected: false
      },
      {
        id: "emergExit2",
        type: InteractiveObjectType.EmergencyExit,
        position: { x: 11.8, y: 1.5, z: 0 },
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
        scale: { x: 24, y: 0.1, z: 24 }
      },
      {
        id: "wall1",
        type: "wall",
        position: { x: 0, y: 1.5, z: -12 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24, y: 3, z: 0.1 }
      },
      {
        id: "wall2",
        type: "wall",
        position: { x: 0, y: 1.5, z: 12 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24, y: 3, z: 0.1 }
      },
      {
        id: "wall3",
        type: "wall",
        position: { x: -12, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 24, y: 3, z: 0.1 }
      },
      {
        id: "wall4",
        type: "wall",
        position: { x: 12, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 24, y: 3, z: 0.1 }
      },
      {
        id: "gas_stove_emergency",
        type: "gas_stove",
        position: { x: -4, y: 0, z: -10 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.5, y: 2.5, z: 2.5 }
      },
    ],
    requiredScore: 800,
    difficulty: DifficultyLevel.Advanced,
    learningObjectives: [
      "Manage Class K fires (cooking oils) with wet chemical extinguisher",
      "Recognize and respond to gas leaks safely",
      "Navigate through smoke using proper techniques",
      "Activate emergency alarm systems"
    ]
  },
  [Level.AdvancedRescue]: {
    id: Level.AdvancedRescue,
    name: "Advanced Rescue Operations",
    description: "Complex multi-hazard scenario requiring expert coordination and rescue techniques.",
    hazards: [
      {
        id: "classD1",
        type: HazardType.ClassDFire,
        position: { x: -6, y: 0, z: -5 },
        isActive: true,
        severity: 4,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "chemSpill1",
        type: HazardType.ChemicalSpill,
        position: { x: 6, y: 0, z: -5 },
        isActive: true,
        severity: 4,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "multiSmoke1",
        type: HazardType.SmokeScreen,
        position: { x: -3, y: 0, z: 3 },
        isActive: true,
        severity: 3,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "multiSmoke2",
        type: HazardType.SmokeScreen,
        position: { x: 3, y: 0, z: 3 },
        isActive: true,
        severity: 3,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "outlet12",
        type: HazardType.ElectricalOutlet,
        position: { x: -13.9, y: 0.4, z: 6 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet13",
        type: HazardType.ElectricalOutlet,
        position: { x: 13.9, y: 0.4, z: -6 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_rescue_3",
        type: HazardType.ElectricalOutlet,
        position: { x: -13.9, y: 0.4, z: -8 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_rescue_4",
        type: HazardType.ElectricalOutlet,
        position: { x: 13.9, y: 0.4, z: 8 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_rescue_5",
        type: HazardType.ElectricalOutlet,
        position: { x: -8, y: 0.4, z: 13.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_rescue_6",
        type: HazardType.ElectricalOutlet,
        position: { x: 8, y: 0.4, z: -13.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "powderExt1",
        type: InteractiveObjectType.PowderExtinguisher,
        position: { x: -13.9, y: 1.2, z: 10 },
        isActive: true,
        isCollected: false
      },
      {
        id: "firstAid2",
        type: InteractiveObjectType.FirstAidKit,
        position: { x: 0, y: 1.2, z: 13.9 },
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
        scale: { x: 28, y: 0.1, z: 28 }
      },
      {
        id: "wall1",
        type: "wall",
        position: { x: 0, y: 1.5, z: -14 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 28, y: 3, z: 0.1 }
      },
      {
        id: "wall2",
        type: "wall",
        position: { x: 0, y: 1.5, z: 14 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 28, y: 3, z: 0.1 }
      },
      {
        id: "wall3",
        type: "wall",
        position: { x: -14, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 28, y: 3, z: 0.1 }
      },
      {
        id: "wall4",
        type: "wall",
        position: { x: 14, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 28, y: 3, z: 0.1 }
      },
      {
        id: "gas_stove_advanced",
        type: "gas_stove",
        position: { x: -8, y: 0, z: -12 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3, y: 3, z: 3 }
      },
    ],
    requiredScore: 1000,
    difficulty: DifficultyLevel.Expert,
    learningObjectives: [
      "Handle Class D fires (metals) with powder extinguisher",
      "Manage chemical spills safely",
      "Navigate complex smoke-filled environments",
      "Use escape ropes for emergency evacuation"
    ]
  },
  [Level.BFPCertification]: {
    id: Level.BFPCertification,
    name: "BFP Master Certification",
    description: "Ultimate fire safety challenge! Prove you're ready for BFP certification with Captain Berong Bumbero's master test.",
    hazards: [
      {
        id: "masterClassB",
        type: HazardType.ClassBFire,
        position: { x: 0, y: 0, z: -8 },
        isActive: true,
        severity: 3,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "masterClassC",
        type: HazardType.ClassCFire,
        position: { x: 8, y: 0, z: -8 },
        isActive: true,
        severity: 3,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "masterClassK",
        type: HazardType.ClassKFire,
        position: { x: -4, y: 0, z: 0 },
        isActive: true,
        severity: 4,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "masterGas",
        type: HazardType.GasLeak,
        position: { x: 4, y: 0, z: 0 },
        isActive: true,
        severity: 4,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "masterSmoke1",
        type: HazardType.SmokeScreen,
        position: { x: -4, y: 0, z: 4 },
        isActive: true,
        severity: 4,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "masterSmoke2",
        type: HazardType.SmokeScreen,
        position: { x: 4, y: 0, z: 4 },
        isActive: true,
        severity: 4,
        isSmoking: true,
        isExtinguished: false
      },
      {
        id: "outlet14",
        type: HazardType.ElectricalOutlet,
        position: { x: -8, y: 0.4, z: -15.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet15",
        type: HazardType.ElectricalOutlet,
        position: { x: 8, y: 0.4, z: 15.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_cert_3",
        type: HazardType.ElectricalOutlet,
        position: { x: -15.9, y: 0.4, z: -10 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_cert_4",
        type: HazardType.ElectricalOutlet,
        position: { x: 15.9, y: 0.4, z: 10 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_cert_5",
        type: HazardType.ElectricalOutlet,
        position: { x: -10, y: 0.4, z: 15.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_cert_6",
        type: HazardType.ElectricalOutlet,
        position: { x: 10, y: 0.4, z: -15.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      },
      {
        id: "outlet_cert_7",
        type: HazardType.ElectricalOutlet,
        position: { x: 0, y: 0.4, z: -15.9 },
        isActive: true,
        severity: 1,
        isSmoking: false,
        isExtinguished: false
      }
    ],
    objects: [
      {
        id: "masterWater",
        type: InteractiveObjectType.WaterExtinguisher,
        position: { x: -15.9, y: 1.2, z: 12 },
        isActive: true,
        isCollected: false
      },
      {
        id: "masterFoam",
        type: InteractiveObjectType.FoamExtinguisher,
        position: { x: -6, y: 1.2, z: 15.9 },
        isActive: true,
        isCollected: false
      },
      {
        id: "masterCO2",
        type: InteractiveObjectType.CO2Extinguisher,
        position: { x: 0, y: 1.2, z: 15.9 },
        isActive: true,
        isCollected: false
      },
      {
        id: "masterWetChem",
        type: InteractiveObjectType.WetChemicalExtinguisher,
        position: { x: 15.9, y: 1.2, z: 12 },
        isActive: true,
        isCollected: false
      },
      {
        id: "masterAlarm",
        type: InteractiveObjectType.EmergencyAlarm,
        position: { x: 6, y: 1.8, z: 5 },
        isActive: false,
        isCollected: false
      }
    ],
    environmentObjects: [
      {
        id: "floor",
        type: "floor",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 32, y: 0.1, z: 32 }
      },
      {
        id: "wall1",
        type: "wall",
        position: { x: 0, y: 1.5, z: -16 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 32, y: 3, z: 0.1 }
      },
      {
        id: "wall2",
        type: "wall",
        position: { x: 0, y: 1.5, z: 16 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 32, y: 3, z: 0.1 }
      },
      {
        id: "wall3",
        type: "wall",
        position: { x: -16, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 32, y: 3, z: 0.1 }
      },
      {
        id: "wall4",
        type: "wall",
        position: { x: 16, y: 1.5, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 32, y: 3, z: 0.1 }
      },
      {
        id: "gas_stove_master_1",
        type: "gas_stove",
        position: { x: -10, y: 0, z: -14 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.5, y: 3.5, z: 3.5 }
      },
      {
        id: "gas_stove_master_2",
        type: "gas_stove",
        position: { x: 10, y: 0, z: -14 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.5, y: 3.5, z: 3.5 }
      },
    ],
    requiredScore: 1500,
    difficulty: DifficultyLevel.Master,
    learningObjectives: [
      "Master all fire classes and appropriate extinguisher types",
      "Demonstrate expert PASS technique under pressure",
      "Coordinate complex emergency response procedures",
      "Achieve BFP fire safety certification standards"
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
  DAMAGE_DISTANCE: 1.2
};

export const COLLISION_GROUPS = {
  PLAYER: 1,
  ENVIRONMENT: 2,
  HAZARDS: 4,
  INTERACTIVE: 8
};
