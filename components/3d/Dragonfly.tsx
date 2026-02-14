import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Vector3 } from 'three';
import { COLORS } from '../../constants';
import { Html } from '@react-three/drei';

interface DragonflyProps {
  interactive?: boolean;
  exploded?: boolean;
  onPartClick?: (part: string) => void;
  selectedPart?: string | null;
}

export const Dragonfly: React.FC<DragonflyProps> = ({ 
  interactive = false, 
  exploded = false, 
  onPartClick, 
  selectedPart 
}) => {
  const group = useRef<Group>(null);
  const wingLeftFront = useRef<Mesh>(null);
  const wingRightFront = useRef<Mesh>(null);
  const wingLeftBack = useRef<Mesh>(null);
  const wingRightBack = useRef<Mesh>(null);

  // Animation state for parts
  const expansion = useRef(0);

  useFrame(({ clock }, delta) => {
    // Flight animation
    const t = clock.getElapsedTime();
    const speed = interactive && exploded ? 5 : 40; // Slow down wings if exploded
    const angle = Math.sin(t * speed) * 0.4;
    
    if (wingLeftFront.current) wingLeftFront.current.rotation.x = angle;
    if (wingRightFront.current) wingRightFront.current.rotation.x = angle;
    if (wingLeftBack.current) wingLeftBack.current.rotation.x = -angle;
    if (wingRightBack.current) wingRightBack.current.rotation.x = -angle;

    // Explosion animation
    const targetExpansion = exploded ? 1 : 0;
    expansion.current += (targetExpansion - expansion.current) * delta * 5;
  });

  const getPartColor = (partName: string, defaultColor: string) => {
    if (!interactive) return defaultColor;
    return selectedPart === partName ? COLORS.HIGHLIGHT : defaultColor;
  };

  const handlePointerOver = (e: any) => {
    if (interactive) document.body.style.cursor = 'pointer';
    e.stopPropagation();
  };
  const handlePointerOut = () => {
    if (interactive) document.body.style.cursor = 'auto';
  };
  const handleClick = (part: string, e: any) => {
    if (interactive && onPartClick) {
      e.stopPropagation();
      onPartClick(part);
    }
  };

  const bodyMaterial = <meshStandardMaterial 
    color={COLORS.DRONE_BODY} 
    metalness={0.9} 
    roughness={0.3} 
    emissive={COLORS.DRONE_BODY}
    emissiveIntensity={0.2}
  />;

  const wingMaterial = <meshPhysicalMaterial 
    color="#a0e0ff" 
    transmission={0.6} 
    opacity={0.5} 
    transparent 
    roughness={0.1}
    metalness={0.1}
    thickness={0.02}
  />;

  // Calculate dynamic positions based on expansion
  const e = expansion.current;

  return (
    <group ref={group} scale={0.5}>
      
      {/* Central Fuselage (Main Body) */}
      <mesh 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, e * 0.5, 0]} // Moves up slightly
        onClick={(e) => handleClick('fuselage', e)}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.15, 0.1, 0.8, 8]} />
        <meshStandardMaterial color={getPartColor('fuselage', COLORS.DRONE_BODY)} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Battery / Tail */}
      <mesh 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, 0, -0.6 - (e * 0.8)]} // Moves back
        onClick={(e) => handleClick('battery', e)}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.08, 0.05, 1.2, 8]} />
        <meshStandardMaterial color={getPartColor('battery', '#a67c52')} metalness={0.9} roughness={0.3} />
      </mesh>
      
      {/* Head / Sensors */}
      <group position={[0, 0, 0.5 + (e * 0.5)]}> {/* Moves forward */}
        <mesh 
          onClick={(e) => handleClick('sensor', e)}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color={getPartColor('sensor', '#222')} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color={COLORS.DRONE_GLOW} />
        </mesh>
      </group>

      {/* Acoustic Emitter (Underbelly) */}
      <mesh 
        position={[0, -0.2 - (e * 0.4), 0]} 
        rotation={[Math.PI/2, 0, 0]}
        onClick={(e) => handleClick('emitter', e)}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <coneGeometry args={[0.15, 0.4, 16, 1, true]} />
        <meshStandardMaterial color={getPartColor('emitter', '#444')} side={2} />
      </mesh>

      {/* Wings Group */}
      <group position={[0, 0.1 + (e * 1), 0.2]}> {/* Moves Up */}
        <mesh 
            ref={wingLeftFront} 
            position={[-0.8 - (e * 0.5), 0, 0]} 
            rotation={[0, 0, 0.1]}
            onClick={(e) => handleClick('wings', e)}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
          <boxGeometry args={[1.6, 0.02, 0.4]} />
          {selectedPart === 'wings' ? <meshStandardMaterial color={COLORS.HIGHLIGHT} /> : wingMaterial}
        </mesh>
        <mesh 
            ref={wingRightFront} 
            position={[0.8 + (e * 0.5), 0, 0]} 
            rotation={[0, 0, -0.1]}
            onClick={(e) => handleClick('wings', e)}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
          <boxGeometry args={[1.6, 0.02, 0.4]} />
          {selectedPart === 'wings' ? <meshStandardMaterial color={COLORS.HIGHLIGHT} /> : wingMaterial}
        </mesh>
      </group>

      <group position={[0, 0.1 + (e * 1), -0.2]}>
        <mesh 
            ref={wingLeftBack} 
            position={[-0.7 - (e * 0.5), 0, 0]} 
            rotation={[0, 0, 0.1]}
            onClick={(e) => handleClick('wings', e)}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
           <boxGeometry args={[1.4, 0.02, 0.3]} />
           {selectedPart === 'wings' ? <meshStandardMaterial color={COLORS.HIGHLIGHT} /> : wingMaterial}
        </mesh>
        <mesh 
            ref={wingRightBack} 
            position={[0.7 + (e * 0.5), 0, 0]} 
            rotation={[0, 0, -0.1]}
            onClick={(e) => handleClick('wings', e)}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
           <boxGeometry args={[1.4, 0.02, 0.3]} />
           {selectedPart === 'wings' ? <meshStandardMaterial color={COLORS.HIGHLIGHT} /> : wingMaterial}
        </mesh>
      </group>
      
      {/* Legs (Decorative) */}
      <mesh position={[0.15 + (e * 0.2), -0.1 - (e * 0.2), 0.2]} rotation={[0, 0, -0.5]}>
         <cylinderGeometry args={[0.02, 0.01, 0.4]} />
         {bodyMaterial}
      </mesh>
       <mesh position={[-0.15 - (e * 0.2), -0.1 - (e * 0.2), 0.2]} rotation={[0, 0, 0.5]}>
         <cylinderGeometry args={[0.02, 0.01, 0.4]} />
         {bodyMaterial}
      </mesh>

      {/* Annotation Lines (Only in inspector exploded mode) */}
      {interactive && exploded && (
        <group>
             <Html position={[1.5, 0.5, 0]}>
                 <div className="text-xs text-white bg-black/50 px-2 rounded whitespace-nowrap">Wings (Polymer/Carbon)</div>
             </Html>
             <Html position={[0, 0.8, 0.8]}>
                 <div className="text-xs text-white bg-black/50 px-2 rounded whitespace-nowrap">Sensor Array (LiDAR/Stereo)</div>
             </Html>
             <Html position={[0, -0.5, 0]}>
                 <div className="text-xs text-white bg-black/50 px-2 rounded whitespace-nowrap">Acoustic Emitter</div>
             </Html>
             <Html position={[0, 0, -1.5]}>
                 <div className="text-xs text-white bg-black/50 px-2 rounded whitespace-nowrap">Modular Battery (Li-Ion)</div>
             </Html>
        </group>
      )}

    </group>
  );
};