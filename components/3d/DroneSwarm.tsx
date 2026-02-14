import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Color, Group, Mesh, MeshBasicMaterial } from 'three';
import { Trail, Float } from '@react-three/drei';
import { Dragonfly } from './Dragonfly';
import { DroneData } from '../../types';
import { COLORS } from '../../constants';

interface DroneSwarmProps {
  drones: DroneData[];
  onDroneClick: (id: number) => void;
  selectedDroneId: number | null;
}

export const DroneSwarm: React.FC<DroneSwarmProps> = ({ drones, onDroneClick, selectedDroneId }) => {
  return (
    <>
      {drones.map((drone) => (
        <SingleDrone 
            key={drone.id} 
            data={drone} 
            isSelected={selectedDroneId === drone.id}
            onClick={() => onDroneClick(drone.id)}
        />
      ))}
    </>
  );
};

interface SingleDroneProps {
    data: DroneData;
    isSelected: boolean;
    onClick: () => void;
}

const SingleDrone: React.FC<SingleDroneProps> = ({ data, isSelected, onClick }) => {
    const meshRef = useRef<Group>(null);
    const soundWaveRef = useRef<Mesh>(null);

    // Smooth movement in visual frame
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Lerp position for smoothness if updates are jagged (though here updates are per frame from parent)
            meshRef.current.position.copy(data.position);
            
            // Orient towards velocity
            if (data.velocity.lengthSq() > 0.01) {
                const targetPos = data.position.clone().add(data.velocity);
                meshRef.current.lookAt(targetPos);
            }
        }

        // Animate Sound Wave
        if (soundWaveRef.current) {
            const scale = (state.clock.getElapsedTime() * 5) % 10;
            soundWaveRef.current.scale.set(scale, scale, scale);
            const opacity = Math.max(0, 1 - scale / 10);
            (soundWaveRef.current.material as MeshBasicMaterial).opacity = opacity * 0.3;
        }
    });

    return (
        <group>
             {/* The Trail */}
            <Trail
                width={isSelected ? 4 : 2}
                length={12}
                color={new Color(isSelected ? COLORS.TRAIL_HIGH_INTENSITY : COLORS.TRAIL)}
                attenuation={(t) => t * t}
            >
                <group ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                         {/* Selection Highlight */}
                        {isSelected && (
                            <mesh position={[0,0,0]}>
                                <sphereGeometry args={[2.5, 16, 16]} />
                                <meshBasicMaterial color={COLORS.TRAIL_HIGH_INTENSITY} wireframe transparent opacity={0.2} />
                            </mesh>
                        )}
                        <Dragonfly />
                        
                        {/* Sound Wave Emitter Visual */}
                        <mesh rotation={[-Math.PI/2, 0, 0]} ref={soundWaveRef}>
                            <ringGeometry args={[0.5, 0.6, 32]} />
                            <meshBasicMaterial color={COLORS.DRONE_GLOW} transparent side={2} />
                        </mesh>
                        
                        {/* Fake Point Light for atmosphere */}
                        <pointLight 
                            color={COLORS.DRONE_GLOW} 
                            intensity={2} 
                            distance={15} 
                            decay={2}
                        />
                    </Float>
                </group>
            </Trail>
        </group>
    )
}