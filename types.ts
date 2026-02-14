import { Vector3 } from 'three';

export interface DroneData {
  id: number;
  position: Vector3;
  velocity: Vector3;
  battery: number;
  status: 'active' | 'returning' | 'charging';
  flightTime: number; // in minutes
  coveredArea: number; // in sq meters
  soundIntensity: number; // 0-1
}

export interface SimulationStats {
  totalAreaCovered: number;
  pestReduction: number; // percentage
  costSavings: number; // currency
  activeDrones: number;
  pestDensityMap: number[]; // Flattened grid 
}

export enum LayerType {
  NONE = 'none',
  PEST_DENSITY = 'pest_density',
  CROP_HEALTH = 'crop_health'
}

export type ViewMode = 'simulation' | 'inspector';
export type ActiveModule = 'none' | 'blueprints' | 'physics' | 'production' | 'library';

export interface AppState {
  isPlaying: boolean;
  playbackSpeed: number;
  activeLayer: LayerType;
  selectedDroneId: number | null;
  cameraMode: 'orbit' | 'follow';
  viewMode: ViewMode;
  activeModule: ActiveModule;
  inspector: {
    exploded: boolean;
    selectedPart: string | null;
  };
}

export interface PhysicsParams {
  mass: number; // kg
  speed: number; // m/s
  batteryCapacity: number; // Wh
  wingSpan: number; // m
}
