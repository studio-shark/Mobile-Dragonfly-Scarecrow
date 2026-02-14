import { useState, useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { 
    FIELD_SIZE, GRID_RES, DRONE_COUNT, DRONE_SPEED, DRONE_ALTITUDE, 
    MOCK_INIT_STATS, TOTAL_Projected_PESTS
} from '../constants';
import { DroneData, SimulationStats } from '../types';

export const useSimulation = (isPlaying: boolean, speed: number) => {
    // Initialize Field Data (Pest Density 0.0 - 1.0)
    const [pestDensity, setPestDensity] = useState<number[]>(() => {
        // Create perlin-ish noise or clusters for initial pest distribution
        const arr = new Array(GRID_RES * GRID_RES).fill(0);
        return arr.map((_, i) => {
             const x = (i % GRID_RES) / GRID_RES;
             const y = Math.floor(i / GRID_RES) / GRID_RES;
             // Simple cluster logic
             const distToCenter = Math.sqrt((x-0.5)**2 + (y-0.5)**2);
             return Math.min(1, Math.max(0, 1.2 - distToCenter * 2 + (Math.random() * 0.2)));
        });
    });

    // Mutable ref for high-freq physics updates
    const dronesRef = useRef<DroneData[]>([]);
    
    // Initial Drone Setup
    useEffect(() => {
        const drones: DroneData[] = [];
        const spacing = FIELD_SIZE / DRONE_COUNT;
        
        for (let i = 0; i < DRONE_COUNT; i++) {
            drones.push({
                id: i,
                position: new Vector3(-FIELD_SIZE/2, DRONE_ALTITUDE, -FIELD_SIZE/2 + (i * spacing)),
                velocity: new Vector3(1, 0, 0),
                battery: 100,
                status: 'active',
                flightTime: 0,
                coveredArea: 0,
                soundIntensity: 0.8
            });
        }
        dronesRef.current = drones;
    }, []);

    // Stats State
    const [stats, setStats] = useState<SimulationStats>({
        ...MOCK_INIT_STATS,
        pestDensityMap: pestDensity
    });

    const lastTimeRef = useRef<number>(Date.now());

    // Simulation Loop Function
    const update = useCallback(() => {
        if (!isPlaying) {
            lastTimeRef.current = Date.now();
            return;
        }

        const now = Date.now();
        const delta = (now - lastTimeRef.current) / 1000 * speed;
        lastTimeRef.current = now;
        
        // Update Drones
        dronesRef.current.forEach(drone => {
            // Simple lawnmower pattern logic
            // Move along X
            drone.position.x += drone.velocity.x * DRONE_SPEED * delta;
            
            // Turn around at edges
            const limit = FIELD_SIZE / 2 - 5;
            if (drone.position.x > limit && drone.velocity.x > 0) {
                drone.velocity.x = -1;
                drone.position.z += 10; // Shift row
            } else if (drone.position.x < -limit && drone.velocity.x < 0) {
                drone.velocity.x = 1;
                drone.position.z += 10; // Shift row
            }

            // Keep within bounds Z
            if (drone.position.z > limit) drone.position.z = -limit;

            // Bobbing motion
            drone.position.y = DRONE_ALTITUDE + Math.sin(now * 0.002 + drone.id) * 1;

            // Stats update
            drone.flightTime += delta / 60;
            drone.battery = Math.max(0, drone.battery - delta * 0.05);
            drone.coveredArea += DRONE_SPEED * delta * 5; // Width of effect approx 5m
            
            // Interaction with Field (Pest Reduction)
            // Map drone pos to grid index
            const gridX = Math.floor(((drone.position.x + FIELD_SIZE/2) / FIELD_SIZE) * GRID_RES);
            const gridZ = Math.floor(((drone.position.z + FIELD_SIZE/2) / FIELD_SIZE) * GRID_RES);
            
            // Effect radius (3x3 grid)
            for (let ox = -2; ox <= 2; ox++) {
                for (let oz = -2; oz <= 2; oz++) {
                    const gx = gridX + ox;
                    const gz = gridZ + oz;
                    if (gx >= 0 && gx < GRID_RES && gz >= 0 && gz < GRID_RES) {
                        const idx = gz * GRID_RES + gx;
                        if (pestDensity[idx] > 0) {
                            // Reduce pest density in this cell
                            // We mutate the array directly for perf, then trigger state update less frequently if needed
                            // But for React rendering we need new ref eventually.
                            // Here we'll mutate a local temp or just the state ref if we were using a ref for grid.
                            // Since we use state for grid, we need to be careful.
                            // Optimization: Mutate a ref-held grid, and sync to state every 500ms
                        }
                    }
                }
            }
        });

        // HACK: Update global grid stats in a simplified way for the demo
        // In a real app, use a texture for GPU processing or a Worker.
        // Here we just decay total pest count based on coverage
        const reductionRate = 0.001 * speed * DRONE_COUNT;
        
        setStats(prev => {
            const newCovered = prev.totalAreaCovered + (DRONE_SPEED * delta * 5 * DRONE_COUNT);
            const newReduction = Math.min(100, prev.pestReduction + reductionRate);
            
            // Mutate grid locally for visual effect
            // We'll actually return a new grid every frame? No, too slow.
            // Let's just update the grid ref and trigger a re-render every X frames.
            
            return {
                ...prev,
                totalAreaCovered: newCovered,
                pestReduction: newReduction,
                costSavings: newCovered * 0.15, // $0.15 per sq meter saved vs spray
            };
        });

    }, [isPlaying, speed]);

    // Separate effect for grid updates to avoid React lag
    useEffect(() => {
        if(!isPlaying) return;
        const interval = setInterval(() => {
             setPestDensity(prev => {
                 // Decrease values based on drone positions
                 const next = [...prev];
                 dronesRef.current.forEach(d => {
                    const gx = Math.floor(((d.position.x + FIELD_SIZE/2) / FIELD_SIZE) * GRID_RES);
                    const gz = Math.floor(((d.position.z + FIELD_SIZE/2) / FIELD_SIZE) * GRID_RES);
                    const idx = gz * GRID_RES + gx;
                    if (idx >= 0 && idx < next.length) {
                        next[idx] = Math.max(0, next[idx] - 0.3); // Heavy reduction on pass
                        // Spread effect
                        if (idx+1 < next.length) next[idx+1] *= 0.9;
                        if (idx-1 >= 0) next[idx-1] *= 0.9;
                        if (idx+GRID_RES < next.length) next[idx+GRID_RES] *= 0.9;
                        if (idx-GRID_RES >= 0) next[idx-GRID_RES] *= 0.9;
                    }
                 });
                 return next;
             });
        }, 100); // 10fps grid update for UI
        return () => clearInterval(interval);
    }, [isPlaying]);

    // Main Loop
    useFrame(() => {
        update();
    });

    return { 
        drones: dronesRef.current,
        pestDensity,
        stats
    };
};