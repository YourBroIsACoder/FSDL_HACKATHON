import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { PALETTE } from '../../config/assets'
import { useAppStore } from '../../store/dsStore'

const Cell = ({ r, c, val, isHighlighted }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;
        if (isHighlighted) {
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 8) * 0.2;
            meshRef.current.scale.setScalar(1.1);
        } else {
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.2);
            meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2);
        }
    })

    const color = isHighlighted ? PALETTE.moltenOrange : (val !== null ? '#00ffe0' : '#222222');
    const emissive = isHighlighted ? PALETTE.moltenOrange : (val !== null ? '#00ffe0' : '#000000');
    const intensity = isHighlighted ? 2 : (val !== null ? 0.3 : 0);

    return (
        <group position={[c * 1.5, 0, r * 1.5]}>
            <mesh ref={meshRef}>
                <boxGeometry args={[1.3, 0.4, 1.3]} />
                <meshStandardMaterial 
                   color={color}
                   emissive={emissive}
                   emissiveIntensity={intensity}
                   roughness={0.1}
                   metalness={0.5}
                   transparent opacity={0.9}
                />
            </mesh>
            {val !== null && (
                <Html position={[0,0.5,0]} center className="pointer-events-none">
                    <div className="text-white font-bold font-['JetBrains_Mono'] drop-shadow-md text-lg">
                        {val}
                    </div>
                </Html>
            )}
        </group>
    )
}

export default function DPScene() {
    const matrix = useAppStore(s => s.dpMatrix);
    const highlights = useAppStore(s => s.dpHighlights);

    if (!matrix || matrix.length === 0) return null;
    
    const rows = matrix.length;
    const cols = matrix[0].length;
    const xOffset = (cols - 1) * -0.75;
    const zOffset = (rows - 1) * -0.75;

    return (
        <>
            <OrbitControls makeDefault enableZoom={true} enablePan={true} enableRotate={true} />
            <group position={[xOffset, 0, zOffset]} rotation={[Math.PI / 8, Math.PI / 4, 0]}>
             {matrix.map((rowArr, r) => (
                 rowArr.map((val, c) => {
                     const isHigh = highlights.some(h => h.r === r && h.c === c);
                     return <Cell key={`${r}-${c}`} r={r} c={c} val={val} isHighlighted={isHigh} />
                 })
             ))}
            </group>
        </>
    )
}
