import React, { useMemo, useRef, useEffect } from 'react';
import { InstancedMesh, Object3D, Color, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { FIELD_SIZE, GRID_RES, COLORS } from '../../constants';
import { LayerType } from '../../types';

interface FieldProps {
  pestDensity: number[]; // Flattened grid 0-1
  activeLayer: LayerType;
}

export const Field: React.FC<FieldProps> = ({ pestDensity, activeLayer }) => {
  const cropMesh = useRef<InstancedMesh>(null);
  const pestMesh = useRef<InstancedMesh>(null);
  const groundRef = useRef<Mesh>(null);
  
  const dummy = useMemo(() => new Object3D(), []);
  const pestColor = new Color(COLORS.PEST);
  const healthyColor = new Color(COLORS.CROP_HEALTHY);
  const damagedColor = new Color(COLORS.CROP_DAMAGED);

  // Initialize Crops
  useEffect(() => {
    if (!cropMesh.current) return;
    let i = 0;
    const spacing = FIELD_SIZE / GRID_RES;
    const offset = FIELD_SIZE / 2;

    for (let x = 0; x < GRID_RES; x++) {
      for (let z = 0; z < GRID_RES; z++) {
        dummy.position.set(
          x * spacing - offset + spacing/2,
          0,
          z * spacing - offset + spacing/2
        );
        // Randomize height slightly for realism
        dummy.scale.set(1, 0.8 + Math.random() * 0.4, 1);
        dummy.updateMatrix();
        cropMesh.current.setMatrixAt(i++, dummy.matrix);
      }
    }
    cropMesh.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  // Update Visuals based on Layer
  useFrame(() => {
    if (!cropMesh.current || !pestMesh.current) return;

    let i = 0;
    const spacing = FIELD_SIZE / GRID_RES;
    const offset = FIELD_SIZE / 2;

    for (let x = 0; x < GRID_RES; x++) {
      for (let z = 0; z < GRID_RES; z++) {
        const pestLevel = pestDensity[i];
        
        // PEST LAYER VISUALIZATION
        if (activeLayer === LayerType.PEST_DENSITY) {
            // Position pest indicator
            dummy.position.set(
                x * spacing - offset + spacing/2,
                1.5 + Math.sin(Date.now() * 0.002 + x) * 0.5, // Float animation
                z * spacing - offset + spacing/2
            );
            // Scale based on pest density
            const scale = Math.max(0, pestLevel * 0.8);
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            pestMesh.current.setMatrixAt(i, dummy.matrix);
            pestMesh.current.setColorAt(i, pestColor);
        } else {
             // Hide pests if layer inactive
             dummy.scale.set(0,0,0);
             dummy.updateMatrix();
             pestMesh.current.setMatrixAt(i, dummy.matrix);
        }

        // CROP HEALTH VISUALIZATION
        // High pest density = damaged crop color
        // Low pest density = healthy crop color
        const color = new Color().lerpColors(healthyColor, damagedColor, pestLevel);
        
        // If Health Layer is active, emphasize the colors (maybe make healthy extra bright)
        // If Pest Layer is active, we just show standard crops
        // If NO layer, show standard realistic crops (mostly green but slightly varied)
        
        if (activeLayer === LayerType.CROP_HEALTH) {
             cropMesh.current.setColorAt(i, color);
        } else {
             // Default state: slightly varied greens, not reacting strongly to data unless inspected
             // Or we can leave the damage persistent. Let's make damage persistent but subtle.
             const naturalColor = new Color(COLORS.CROP_HEALTHY).multiplyScalar(0.8 + Math.random()*0.2);
             const displayedColor = naturalColor.lerp(damagedColor, pestLevel * 0.5); // Only 50% impact on visual without layer
             cropMesh.current.setColorAt(i, displayedColor);
        }
        
        i++;
      }
    }
    pestMesh.current.instanceMatrix.needsUpdate = true;
    if (pestMesh.current.instanceColor) pestMesh.current.instanceColor.needsUpdate = true;
    if (cropMesh.current.instanceColor) cropMesh.current.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[FIELD_SIZE * 1.5, FIELD_SIZE * 1.5]} />
        <meshStandardMaterial color="#0a0f0a" roughness={1} />
      </mesh>
      
      {/* Grid Lines (Subtle) */}
      <gridHelper args={[FIELD_SIZE, GRID_RES, 0x222222, 0x111111]} position={[0, 0.01, 0]} />

      {/* Crops */}
      <instancedMesh ref={cropMesh} args={[undefined, undefined, GRID_RES * GRID_RES]} castShadow receiveShadow>
        <coneGeometry args={[1, 3, 5]} />
        <meshStandardMaterial color={COLORS.CROP_HEALTHY} roughness={0.8} />
      </instancedMesh>

      {/* Pest Indicators (Spheres) */}
      <instancedMesh ref={pestMesh} args={[undefined, undefined, GRID_RES * GRID_RES]}>
         <sphereGeometry args={[1.5, 8, 8]} />
         <meshBasicMaterial color={COLORS.PEST} transparent opacity={0.6} />
      </instancedMesh>
    </group>
  );
};