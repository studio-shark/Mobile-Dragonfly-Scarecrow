import React, { useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { Vector3 } from 'three';
import { Field } from './Field';
import { DroneSwarm } from './DroneSwarm';
import { Dragonfly } from './Dragonfly';
import { useSimulation } from '../../hooks/useSimulation';
import { AppState, DroneData } from '../../types';

interface SceneProps {
  appState: AppState;
  setStats: (data: { stats: any, drones: DroneData[] }) => void;
  onDroneClick: (id: number) => void;
  onPartSelect: (part: string) => void;
}

const CameraController = ({ mode, targetDrone }: { mode: 'orbit' | 'follow', targetDrone?: DroneData }) => {
    const { camera, controls } = useThree();
    
    useFrame(() => {
        if (mode === 'follow' && targetDrone) {
            const targetPos = targetDrone.position;
            const offset = new Vector3(0, 5, 12); 
            const desiredPos = targetPos.clone().add(offset);
            camera.position.lerp(desiredPos, 0.05);
            camera.lookAt(targetPos);
            if (controls) (controls as any).target.lerp(targetPos, 0.1);
        }
    });

    return (
        <OrbitControls 
            makeDefault 
            enablePan={mode === 'orbit'} 
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={2}
            maxDistance={150}
        />
    );
};

// Separate Inspector Scene Component
const InspectorScene = ({ exploded, selectedPart, onPartSelect }: { exploded: boolean, selectedPart: string | null, onPartSelect: (p: string) => void }) => {
    return (
        <group>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4444ff" />
            
            <Dragonfly 
                interactive={true} 
                exploded={exploded} 
                selectedPart={selectedPart}
                onPartClick={onPartSelect}
            />
            
            <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={10} color="#000000" />
            <OrbitControls makeDefault minDistance={2} maxDistance={10} />
            <Environment preset="city" />
        </group>
    )
}

const SimulationScene = ({ appState, setStats, onDroneClick }: SceneProps) => {
    const { drones, pestDensity, stats } = useSimulation(appState.isPlaying, appState.playbackSpeed);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setStats({ stats, drones: [...drones] }); 
        }, 200); 
        return () => clearInterval(interval);
    }, [stats, drones, setStats]);

    const targetDrone = appState.selectedDroneId !== null 
        ? drones.find(d => d.id === appState.selectedDroneId) 
        : undefined;

    return (
        <>
            <ambientLight intensity={0.1} color="#001133" />
            <pointLight position={[100, 100, 100]} intensity={0.5} color="#4444ff" />
            <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            <Field pestDensity={pestDensity} activeLayer={appState.activeLayer} />
            <DroneSwarm 
                drones={drones} 
                onDroneClick={onDroneClick} 
                selectedDroneId={appState.selectedDroneId} 
            />
            
            <CameraController mode={appState.cameraMode} targetDrone={targetDrone} />
            
            <fog attach="fog" args={['#000510', 30, 250]} />
        </>
    );
}

export const Scene: React.FC<SceneProps> = (props) => {
    return (
        <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 40, 80]} fov={50} />
            
            {props.appState.viewMode === 'simulation' ? (
                <SimulationScene {...props} />
            ) : (
                <InspectorScene 
                    exploded={props.appState.inspector.exploded} 
                    selectedPart={props.appState.inspector.selectedPart}
                    onPartSelect={props.onPartSelect}
                />
            )}

            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.8} radius={0.4} />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </Canvas>
    );
};