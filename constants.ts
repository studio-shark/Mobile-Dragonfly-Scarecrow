export const FIELD_SIZE = 200;
export const GRID_RES = 40; // 40x40 grid
export const DRONE_COUNT = 12;
export const DRONE_SPEED = 10;
export const DRONE_ALTITUDE = 8;
export const TOTAL_Projected_PESTS = 5000;

export const PHYSICS = {
  GRAVITY: 9.81,
  AIR_DENSITY: 1.225,
  WING_AREA: 0.18, // m2
  DRAG_COEFF: 0.8,
  LIFT_EFFICIENCY: 0.85 // Battery discharge efficiency
};

export const BLUEPRINTS = [
  { id: 'scheme', title: 'Figure 1: Complete Engineering Scheme', desc: 'Orthographic views of the integrated system.' },
  { id: 'flight', title: 'Figure 2: Aerodynamic Flight System', desc: 'Quad-wing mechanics and servo actuators.' },
  { id: 'acoustic', title: 'Figure 3: Acoustic Pest Repellent', desc: 'Ultrasonic emitter and projection cone.' },
  { id: 'nav', title: 'Figure 4: Navigation & Swarm Control', desc: 'Sensor array and mesh network architecture.' },
  { id: 'power', title: 'Figure 5: Power Distribution', desc: 'Battery modules and BMS schematic.' },
  { id: 'safety', title: 'Figure 6: Environmental Sealing', desc: 'IP65 enclosure and safety systems.' },
];

export const COLORS = {
  TRAIL: '#00f3ff',
  TRAIL_HIGH_INTENSITY: '#0aff00',
  PEST: '#ff3333',
  CROP_HEALTHY: '#22c55e',
  CROP_DAMAGED: '#eab308',
  DRONE_BODY: '#cd7f32', // Bronze
  DRONE_GLOW: '#00f3ff',
  HIGHLIGHT: '#facc15', // Yellow for selection
};

export const MOCK_INIT_STATS = {
  totalAreaCovered: 0,
  pestReduction: 0,
  costSavings: 0,
  activeDrones: DRONE_COUNT
};