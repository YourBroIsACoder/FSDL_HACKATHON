import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PALETTE } from '../../config/assets'
import { useAppStore } from '../../store/dsStore'

const QueenToken = ({ position, status, delayOffset }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;
        if (status === 'checking') {
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 6) * 0.2 + 0.5;
            meshRef.current.rotation.y += 0.05;
        } else if (status === 'clash') {
            meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 30) * 0.1;
        } else {
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.2);
        }
    });

    let color = PALETTE.plasmaTeal;
    let emissive = PALETTE.plasmaTeal;
    
    if (status === 'checking') {
        color = '#ffff00';
        emissive = '#ffff00';
    } else if (status === 'clash') {
        color = PALETTE.moltenOrange;
        emissive = PALETTE.moltenOrange;
    } else if (status === 'placed') {
        color = '#00ff44';
        emissive = '#00ff44';
    }

    return (
        <group position={[position[0], 2, position[2]]}>
            <mesh ref={meshRef}>
                <cylinderGeometry args={[0.3, 0.4, 1.2, 16]} />
                <meshPhysicalMaterial 
                   color={color} 
                   emissive={emissive}
                   emissiveIntensity={status === 'clash' ? 2 : 0.5}
                   transparent opacity={0.9} 
                   roughness={0.1}
                   transmission={0.5} 
                />
            </mesh>
            {status === 'clash' && (
                <Html position={[0,1,0]} center>
                    <div className="text-[#ff0000] font-black text-2xl drop-shadow-md pointer-events-none">X</div>
                </Html>
            )}
        </group>
    )
}

export default function BacktrackingScene() {
    const N = useAppStore(s => s.btBoardSize)
    const board = useAppStore(s => s.btBoard)
    const activeCell = useAppStore(s => s.btActiveCell)

    // Center offset
    const o = (N - 1) * -0.5;

    return (
        <group rotation={[Math.PI / 8, Math.PI / 4, 0]}>
            {/* Draw Chess Board */}
            {Array.from({ length: N }).map((_, r) => (
                Array.from({ length: N }).map((_, c) => {
                    const isLight = (r + c) % 2 === 0;
                    return (
                        <mesh key={`tile-${r}-${c}`} position={[r + o, -0.6, c + o]}>
                            <boxGeometry args={[0.95, 0.1, 0.95]} />
                            <meshStandardMaterial 
                               color={isLight ? '#ffffff' : '#111111'} 
                               roughness={0.8}
                               opacity={0.4}
                               transparent
                            />
                        </mesh>
                    )
                })
            ))}

            {/* Draw Placed Queens */}
            {board.map((colIndex, r) => {
                if (colIndex !== -1) {
                    return <QueenToken key={`queen-${r}`} position={[r + o, 0, colIndex + o]} status="idle" />
                }
                return null;
            })}

            {/* Draw Active Checking Cell Queen */}
            {activeCell && (
                <QueenToken 
                   position={[activeCell.r + o, 0, activeCell.c + o]} 
                   status={activeCell.status} 
                />
            )}
        </group>
    )
}
