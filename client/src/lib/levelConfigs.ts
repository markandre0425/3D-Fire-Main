export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  bfpObjective: string;
  environment: {
    size: [number, number];
    walls: Array<{
      position: [number, number, number];
      size: [number, number, number];
    }>;
  };
  hazards: Array<{
    id: string;
    type: 'fire' | 'smoke' | 'electrical' | 'chemical';
    position: [number, number, number];
    intensity: number;
    smokeRadius?: number;
    damageRate?: number;
  }>;
  items: Array<{
    id: string;
    type: 'extinguisher' | 'gasMask' | 'smokeDetector' | 'firstAid';
    position: [number, number, number];
    extinguisherType?: string;
  }>;
  objectives: Array<{
    id: string;
    description: string;
    type: 'extinguish' | 'collect' | 'survive' | 'evacuate';
    target?: string;
    duration?: number;
  }>;
  bfpEducation: {
    preLevel: string[];
    postLevel: string[];
  };
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 1,
    name: "BFP Training Academy - Kitchen Fire",
    description: "Basic fire safety training with a simple kitchen fire scenario",
    difficulty: 'Easy',
    bfpObjective: "Learn basic fire triangle principles and Class K fire extinguishing",
    environment: {
      size: [8, 8],
      walls: [
        { position: [0, 1, -4], size: [8, 2, 0.2] },
        { position: [0, 1, 4], size: [8, 2, 0.2] },
        { position: [-4, 1, 0], size: [0.2, 2, 8] },
        { position: [4, 1, 0], size: [0.2, 2, 8] }
      ]
    },
    hazards: [
      {
        id: 'kitchen-fire-1',
        type: 'fire',
        position: [2, 0, 2],
        intensity: 1,
        smokeRadius: 1.5,
        damageRate: 10
      },
      {
        id: 'stove-fire',
        type: 'fire',
        position: [-2, 0, -2],
        intensity: 0.8,
        smokeRadius: 1,
        damageRate: 8
      },
      {
        id: 'microwave-fire',
        type: 'fire',
        position: [3, 0, -1],
        intensity: 0.6,
        smokeRadius: 1,
        damageRate: 6
      },
      {
        id: 'toaster-fire',
        type: 'fire',
        position: [-1, 0, 1],
        intensity: 0.5,
        smokeRadius: 0.8,
        damageRate: 5
      },
      {
        id: 'coffee-maker-fire',
        type: 'fire',
        position: [1, 0, -3],
        intensity: 0.7,
        smokeRadius: 1,
        damageRate: 7
      }
    ],
    items: [
      {
        id: 'gas-mask-1',
        type: 'gasMask',
        position: [-2, 1.2, 2]
      }
    ],
    objectives: [
      {
        id: 'extinguish-kitchen-fire',
        description: 'Extinguish the cooking oil fire using wet chemical extinguisher',
        type: 'extinguish',
        target: 'kitchen-fire-1'
      },
      {
        id: 'extinguish-stove-fire',
        description: 'Extinguish the stove fire to prevent kitchen spread',
        type: 'extinguish',
        target: 'stove-fire'
      },
      {
        id: 'extinguish-microwave',
        description: 'Extinguish the microwave fire',
        type: 'extinguish',
        target: 'microwave-fire'
      },
      {
        id: 'extinguish-toaster',
        description: 'Extinguish the toaster fire',
        type: 'extinguish',
        target: 'toaster-fire'
      },
      {
        id: 'extinguish-coffee-maker',
        description: 'Extinguish the coffee maker fire',
        type: 'extinguish',
        target: 'coffee-maker-fire'
      },
      {
        id: 'collect-mask',
        description: 'Collect BFP breathing apparatus for smoke protection',
        type: 'collect',
        target: 'gas-mask-1'
      }
    ],
    bfpEducation: {
      preLevel: [
        "Class K fires involve cooking oils and fats",
        "Use wet chemical extinguishers for kitchen fires",
        "Smoke inhalation is the leading cause of fire deaths",
        "Kitchen appliances can overheat and cause fires",
        "Never leave cooking appliances unattended"
      ],
      postLevel: [
        "Well done! You successfully contained multiple kitchen fires",
        "The BFP responds to over 12,000 fire incidents annually",
        "Proper ventilation and breathing apparatus save lives",
        "Kitchen fire safety is crucial for home protection"
      ]
    }
  },
  {
    id: 2,
    name: "BFP Station Response - Residential Fire",
    description: "Multiple room fire with electrical hazards and heavy smoke",
    difficulty: 'Medium',
    bfpObjective: "Handle Class A and C fires while managing smoke exposure",
    environment: {
      size: [12, 10],
      walls: [
        { position: [0, 1, -5], size: [12, 2, 0.2] },
        { position: [0, 1, 5], size: [12, 2, 0.2] },
        { position: [-6, 1, 0], size: [0.2, 2, 10] },
        { position: [6, 1, 0], size: [0.2, 2, 10] },
        { position: [0, 1, 0], size: [8, 2, 0.2] }, // Room divider
        { position: [2, 1, -2], size: [0.2, 2, 4] }  // Interior wall
      ]
    },
    hazards: [
      {
        id: 'living-room-fire',
        type: 'fire',
        position: [3, 0, -2],
        intensity: 2,
        smokeRadius: 2.5,
        damageRate: 15
      },
      {
        id: 'electrical-fire',
        type: 'fire',
        position: [-3, 0, 2],
        intensity: 1.5,
        smokeRadius: 2,
        damageRate: 12
      },
      {
        id: 'candle-fire',
        type: 'fire',
        position: [0, 0, -3],
        intensity: 1,
        smokeRadius: 1.5,
        damageRate: 6
      },
      {
        id: 'tv-fire',
        type: 'fire',
        position: [4, 0, 1],
        intensity: 1.2,
        smokeRadius: 1.8,
        damageRate: 10
      },
      {
        id: 'laptop-fire',
        type: 'fire',
        position: [-4, 0, -1],
        intensity: 0.8,
        smokeRadius: 1.2,
        damageRate: 8
      },
      {
        id: 'space-heater-fire',
        type: 'fire',
        position: [-2, 0, -3],
        intensity: 1.3,
        smokeRadius: 2,
        damageRate: 11
      },
      {
        id: 'lamp-fire',
        type: 'fire',
        position: [1, 0, 3],
        intensity: 0.6,
        smokeRadius: 1,
        damageRate: 5
      }
    ],
    items: [
      {
        id: 'gas-mask-2',
        type: 'gasMask',
        position: [-5, 1.2, 0]
      },
      {
        id: 'smoke-detector-1',
        type: 'smokeDetector',
        position: [0, 2, 0]
      }
    ],
    objectives: [
      {
        id: 'secure-breathing-apparatus',
        description: 'Equip BFP breathing apparatus before entering smoke zones',
        type: 'collect',
        target: 'gas-mask-2'
      },
      {
        id: 'extinguish-electrical',
        description: 'Safely extinguish electrical fire with CO2',
        type: 'extinguish',
        target: 'electrical-fire'
      },
      {
        id: 'extinguish-living-room',
        description: 'Extinguish main fire with appropriate extinguisher',
        type: 'extinguish',
        target: 'living-room-fire'
      },
      {
        id: 'extinguish-candle',
        description: 'Extinguish candle fire to prevent spread',
        type: 'extinguish',
        target: 'candle-fire'
      },
      {
        id: 'extinguish-tv',
        description: 'Extinguish television fire',
        type: 'extinguish',
        target: 'tv-fire'
      },
      {
        id: 'extinguish-laptop',
        description: 'Extinguish laptop fire',
        type: 'extinguish',
        target: 'laptop-fire'
      },
      {
        id: 'extinguish-space-heater',
        description: 'Extinguish space heater fire',
        type: 'extinguish',
        target: 'space-heater-fire'
      },
      {
        id: 'extinguish-lamp',
        description: 'Extinguish lamp fire',
        type: 'extinguish',
        target: 'lamp-fire'
      }
    ],
    bfpEducation: {
      preLevel: [
        "Class C fires involve energized electrical equipment",
        "Never use water on electrical fires - use CO2 or dry chemical",
        "Smoke rises and spreads horizontally along ceilings",
        "Breathing apparatus provides 30-45 minutes of clean air",
        "Electronic devices can overheat and cause fires",
        "Space heaters should never be left unattended"
      ],
      postLevel: [
        "Excellent work following BFP protocols!",
        "You correctly identified fire classes and used appropriate extinguishers",
        "Smoke management is crucial in structure fires",
        "BFP responds with 4-person firefighting teams to incidents",
        "Electrical fire safety is essential in modern homes"
      ]
    }
  },
  {
    id: 3,
    name: "BFP Emergency Response - Office Building",
    description: "Multi-floor office fire with limited oxygen and time pressure",
    difficulty: 'Hard',
    bfpObjective: "Coordinate evacuation while managing multiple fire types and smoke",
    environment: {
      size: [16, 14],
      walls: [
        { position: [0, 1, -7], size: [16, 2, 0.2] },
        { position: [0, 1, 7], size: [16, 2, 0.2] },
        { position: [-8, 1, 0], size: [0.2, 2, 14] },
        { position: [8, 1, 0], size: [0.2, 2, 14] },
        // Office partitions
        { position: [-4, 1, -3], size: [0.2, 2, 8] },
        { position: [4, 1, 3], size: [0.2, 2, 8] },
        { position: [0, 1, -3], size: [8, 2, 0.2] },
        { position: [0, 1, 3], size: [8, 2, 0.2] }
      ]
    },
    hazards: [
      {
        id: 'server-room-fire',
        type: 'fire',
        position: [6, 0, -5],
        intensity: 3,
        smokeRadius: 3,
        damageRate: 20
      },
      {
        id: 'office-fire-1',
        type: 'fire',
        position: [-6, 0, 5],
        intensity: 2.5,
        smokeRadius: 2.5,
        damageRate: 18
      },
      {
        id: 'chemical-storage-fire',
        type: 'fire',
        position: [6, 0, 5],
        intensity: 2,
        smokeRadius: 4,
        damageRate: 25
      },
      {
        id: 'paper-fire',
        type: 'fire',
        position: [0, 0, 0],
        intensity: 1.5,
        smokeRadius: 2,
        damageRate: 10
      },
      {
        id: 'stairwell-fire',
        type: 'fire',
        position: [-6, 0, -5],
        intensity: 2,
        smokeRadius: 2.5,
        damageRate: 15
      },
      {
        id: 'printer-fire',
        type: 'fire',
        position: [2, 0, -4],
        intensity: 1.8,
        smokeRadius: 2.2,
        damageRate: 12
      },
      {
        id: 'projector-fire',
        type: 'fire',
        position: [-2, 0, 4],
        intensity: 1.3,
        smokeRadius: 1.8,
        damageRate: 9
      },
      {
        id: 'coffee-machine-fire',
        type: 'fire',
        position: [4, 0, -1],
        intensity: 1.1,
        smokeRadius: 1.5,
        damageRate: 8
      },
      {
        id: 'vending-machine-fire',
        type: 'fire',
        position: [-4, 0, 1],
        intensity: 1.6,
        smokeRadius: 2,
        damageRate: 11
      },
      {
        id: 'file-cabinet-fire',
        type: 'fire',
        position: [0, 0, 4],
        intensity: 1.4,
        smokeRadius: 1.8,
        damageRate: 10
      }
    ],
    items: [
      {
        id: 'gas-mask-3a',
        type: 'gasMask',
        position: [-2, 1.2, -6]
      },
      {
        id: 'gas-mask-3b',
        type: 'gasMask',
        position: [2, 1.2, 6]
      },
      {
        id: 'first-aid-kit',
        type: 'firstAid',
        position: [0, 1.2, -6]
      }
    ],
    objectives: [
      {
        id: 'establish-breathing-protection',
        description: 'Secure breathing apparatus before entering danger zones',
        type: 'collect',
        target: 'gas-mask-3a'
      },
      {
        id: 'contain-server-fire',
        description: 'Extinguish server room fire to prevent data loss',
        type: 'extinguish',
        target: 'server-room-fire'
      },
      {
        id: 'contain-chemical-fire',
        description: 'Safely contain chemical storage fire',
        type: 'extinguish',
        target: 'chemical-storage-fire'
      },
      {
        id: 'clear-evacuation-route',
        description: 'Extinguish office fire to clear evacuation path',
        type: 'extinguish',
        target: 'office-fire-1'
      },
      {
        id: 'extinguish-paper-fire',
        description: 'Extinguish paper fire in corridor',
        type: 'extinguish',
        target: 'paper-fire'
      },
      {
        id: 'extinguish-stairwell',
        description: 'Clear stairwell fire for safe evacuation',
        type: 'extinguish',
        target: 'stairwell-fire'
      },
      {
        id: 'extinguish-printer',
        description: 'Extinguish printer fire',
        type: 'extinguish',
        target: 'printer-fire'
      },
      {
        id: 'extinguish-projector',
        description: 'Extinguish projector fire',
        type: 'extinguish',
        target: 'projector-fire'
      },
      {
        id: 'extinguish-coffee-machine',
        description: 'Extinguish coffee machine fire',
        type: 'extinguish',
        target: 'coffee-machine-fire'
      },
      {
        id: 'extinguish-vending-machine',
        description: 'Extinguish vending machine fire',
        type: 'extinguish',
        target: 'vending-machine-fire'
      },
      {
        id: 'extinguish-file-cabinet',
        description: 'Extinguish file cabinet fire',
        type: 'extinguish',
        target: 'file-cabinet-fire'
      }
    ],
    bfpEducation: {
      preLevel: [
        "Office buildings present complex fire scenarios",
        "Server rooms require CO2 extinguishers to protect equipment",
        "Chemical fires may require special dry chemical agents",
        "Evacuation routes must be kept clear at all times",
        "Breathing apparatus filters last 30-45 minutes under stress",
        "Office equipment can overheat and cause fires",
        "Paper fires spread quickly in office environments"
      ],
      postLevel: [
        "Outstanding performance under pressure!",
        "You followed BFP incident command protocols",
        "Multi-hazard environments require systematic approach",
        "BFP teams coordinate with building security systems",
        "Your actions prevented potential casualties",
        "Office fire safety requires attention to equipment"
      ]
    }
  },
  {
    id: 4,
    name: "BFP Crisis Response - Industrial Complex",
    description: "Large-scale industrial fire with toxic smoke and equipment failures",
    difficulty: 'Expert',
    bfpObjective: "Manage industrial emergency following full BFP response protocols",
    environment: {
      size: [20, 18],
      walls: [
        { position: [0, 1, -9], size: [20, 2, 0.2] },
        { position: [0, 1, 9], size: [20, 2, 0.2] },
        { position: [-10, 1, 0], size: [0.2, 2, 18] },
        { position: [10, 1, 0], size: [0.2, 2, 18] },
        // Industrial sections
        { position: [-5, 1, -4], size: [0.2, 2, 10] },
        { position: [5, 1, 4], size: [0.2, 2, 10] },
        { position: [0, 1, -4], size: [10, 2, 0.2] },
        { position: [0, 1, 4], size: [10, 2, 0.2] }
      ]
    },
    hazards: [
      {
        id: 'chemical-tank-fire',
        type: 'fire',
        position: [-7, 0, -6],
        intensity: 4,
        smokeRadius: 6,
        damageRate: 35
      },
      {
        id: 'machinery-fire-1',
        type: 'fire',
        position: [7, 0, -6],
        intensity: 3.5,
        smokeRadius: 4,
        damageRate: 30
      },
      {
        id: 'oil-fire',
        type: 'fire',
        position: [-7, 0, 6],
        intensity: 4,
        smokeRadius: 5,
        damageRate: 32
      },
      {
        id: 'machinery-fire-2',
        type: 'fire',
        position: [7, 0, 6],
        intensity: 3,
        smokeRadius: 3.5,
        damageRate: 28
      },
      {
        id: 'toxic-smoke-main',
        type: 'fire',
        position: [0, 0, 0],
        intensity: 2.5,
        smokeRadius: 4,
        damageRate: 20
      },
      {
        id: 'toxic-smoke-north',
        type: 'fire',
        position: [0, 0, -7],
        intensity: 2,
        smokeRadius: 3,
        damageRate: 18
      },
      {
        id: 'toxic-smoke-south',
        type: 'fire',
        position: [0, 0, 7],
        intensity: 2,
        smokeRadius: 3,
        damageRate: 18
      },
      {
        id: 'conveyor-belt-fire',
        type: 'fire',
        position: [-3, 0, -2],
        intensity: 2.8,
        smokeRadius: 3.5,
        damageRate: 22
      },
      {
        id: 'hydraulic-press-fire',
        type: 'fire',
        position: [3, 0, 2],
        intensity: 3.2,
        smokeRadius: 4,
        damageRate: 26
      },
      {
        id: 'welding-station-fire',
        type: 'fire',
        position: [-5, 0, 0],
        intensity: 2.5,
        smokeRadius: 3,
        damageRate: 20
      },
      {
        id: 'forklift-fire',
        type: 'fire',
        position: [5, 0, 0],
        intensity: 2.8,
        smokeRadius: 3.5,
        damageRate: 24
      },
      {
        id: 'compressor-fire',
        type: 'fire',
        position: [0, 0, -5],
        intensity: 2.2,
        smokeRadius: 2.8,
        damageRate: 18
      },
      {
        id: 'generator-fire',
        type: 'fire',
        position: [0, 0, 5],
        intensity: 3.5,
        smokeRadius: 4.5,
        damageRate: 30
      }
    ],
    items: [
      {
        id: 'gas-mask-4a',
        type: 'gasMask',
        position: [-8, 1.2, 0]
      },
      {
        id: 'gas-mask-4b',
        type: 'gasMask',
        position: [8, 1.2, 0]
      },
      {
        id: 'gas-mask-4c',
        type: 'gasMask',
        position: [0, 1.2, -8]
      }
    ],
    objectives: [
      {
        id: 'emergency-breathing-protection',
        description: 'Immediately secure breathing apparatus - toxic environment',
        type: 'collect',
        target: 'gas-mask-4a'
      },
      {
        id: 'contain-chemical-emergency',
        description: 'Contain chemical tank fire to prevent explosion',
        type: 'extinguish',
        target: 'chemical-tank-fire'
      },
      {
        id: 'secure-electrical-systems',
        description: 'Extinguish both electrical fires to prevent cascading failures',
        type: 'extinguish',
        target: 'machinery-fire-1'
      },
      {
        id: 'secure-electrical-systems-2',
        description: 'Complete electrical fire suppression',
        type: 'extinguish',
        target: 'machinery-fire-2'
      },
      {
        id: 'prevent-oil-spread',
        description: 'Extinguish oil fire before it spreads',
        type: 'extinguish',
        target: 'oil-fire'
      },
      {
        id: 'extinguish-toxic-fires',
        description: 'Extinguish toxic smoke fires to clear environment',
        type: 'extinguish',
        target: 'toxic-smoke-main'
      },
      {
        id: 'extinguish-north-toxic',
        description: 'Extinguish north toxic fire',
        type: 'extinguish',
        target: 'toxic-smoke-north'
      },
      {
        id: 'extinguish-south-toxic',
        description: 'Extinguish south toxic fire',
        type: 'extinguish',
        target: 'toxic-smoke-south'
      },
      {
        id: 'extinguish-conveyor',
        description: 'Extinguish conveyor belt fire',
        type: 'extinguish',
        target: 'conveyor-belt-fire'
      },
      {
        id: 'extinguish-hydraulic',
        description: 'Extinguish hydraulic press fire',
        type: 'extinguish',
        target: 'hydraulic-press-fire'
      },
      {
        id: 'extinguish-welding',
        description: 'Extinguish welding station fire',
        type: 'extinguish',
        target: 'welding-station-fire'
      },
      {
        id: 'extinguish-forklift',
        description: 'Extinguish forklift fire',
        type: 'extinguish',
        target: 'forklift-fire'
      },
      {
        id: 'extinguish-compressor',
        description: 'Extinguish compressor fire',
        type: 'extinguish',
        target: 'compressor-fire'
      },
      {
        id: 'extinguish-generator',
        description: 'Extinguish generator fire',
        type: 'extinguish',
        target: 'generator-fire'
      }
    ],
    bfpEducation: {
      preLevel: [
        "Industrial fires are among the most dangerous scenarios",
        "Toxic smoke requires full breathing apparatus protection",
        "Chemical tank fires can cause catastrophic explosions",
        "Electrical systems must be secured to prevent cascading failures",
        "BFP industrial response teams have specialized training",
        "Breathing apparatus may need multiple filter changes",
        "Industrial machinery fires require specialized extinguishing agents",
        "Multiple fire types require systematic approach"
      ],
      postLevel: [
        "EXCEPTIONAL PERFORMANCE! You've mastered BFP protocols!",
        "You successfully managed a complex industrial emergency",
        "Your systematic approach prevented catastrophic escalation",
        "This level of competency qualifies for BFP specialist training",
        "Industrial fire response requires years of experience",
        "You've demonstrated real understanding of fire science",
        "Industrial firefighting requires coordination and strategy"
      ]
    }
  }
];

export function getLevelConfig(levelId: number): LevelConfig | null {
  return LEVEL_CONFIGS.find(config => config.id === levelId) || null;
}

export function getNextLevel(currentLevelId: number): LevelConfig | null {
  const nextId = currentLevelId + 1;
  return getLevelConfig(nextId);
}

export function getTotalLevels(): number {
  return LEVEL_CONFIGS.length;
} 