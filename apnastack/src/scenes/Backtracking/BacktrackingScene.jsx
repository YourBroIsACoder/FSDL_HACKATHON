import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PALETTE } from '../../config/assets'
import { useAppStore } from '../../store/dsStore'

const QueenToken = ({ position, status, delayOffset = 0 }) => {
    const groupRef = useRef();
    const meshRef = useRef();
    const auraRef = useRef();

    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.elapsedTime;
        
        if (status === 'checking') {
            groupRef.current.position.y = Math.sin(time * 8 + delayOffset) * 0.3 + 0.5;
            meshRef.current.rotation.y += 0.08;
            if (auraRef.current) {
                auraRef.current.scale.setScalar(1 + Math.sin(time * 12) * 0.2);
            }
        } else if (status === 'clash') {
            groupRef.current.position.x = position[0] + Math.sin(time * 40) * 0.15;
            if (auraRef.current) auraRef.current.scale.setScalar(1.5);
        } else {
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.15);
            if (auraRef.current) {
                auraRef.current.scale.setScalar(1 + Math.sin(time * 3 + delayOffset) * 0.05);
            }
        }
    });

    let color = PALETTE.plasmaTeal;
    let emissive = PALETTE.plasmaTeal;
    
    if (status === 'checking') {
        color = '#ffe83a';
        emissive = '#ffe83a';
    } else if (status === 'clash') {
        color = PALETTE.moltenOrange;
        emissive = PALETTE.moltenOrange;
    } else if (status === 'placed') {
        color = '#00ffaa';
        emissive = '#00ffaa';
    }

    return (
        <group position={[position[0], 2, position[2]]} ref={groupRef}>
            {/* The Queen Geometry */}
            <group ref={meshRef}>
                {/* Base */}
                <mesh position={[0, 0.1, 0]}>
                    <cylinderGeometry args={[0.35, 0.45, 0.2, 32]} />
                    <meshStandardMaterial 
                        color={color} 
                        emissive={emissive} 
                        emissiveIntensity={status === 'clash' ? 2 : 0.6} 
                        metalness={0.8} 
                        roughness={0.2} 
                        clearcoat={1} 
                    />
                </mesh>
                {/* Body */}
                <mesh position={[0, 0.7, 0]}>
                    <cylinderGeometry args={[0.2, 0.35, 1.0, 32]} />
                    <meshStandardMaterial 
                        color={color} 
                        emissive={emissive} 
                        emissiveIntensity={0.4} 
                        roughness={0.1} 
                    />
                </mesh>
                {/* Collar */}
                <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.22, 0.05, 16, 32]} />
                    <meshStandardMaterial 
                        color={color} 
                        emissive={emissive} 
                        emissiveIntensity={1.2} 
                        metalness={0.9} 
                        roughness={0.1} 
                    />
                </mesh>
                {/* Crown / Top */}
                <mesh position={[0, 1.4, 0]}>
                    <sphereGeometry args={[0.15, 32, 32]} />
                    <meshStandardMaterial 
                        color="#ffffff" 
                        emissive="#ffffff" 
                        emissiveIntensity={status === 'clash' ? 2 : 1} 
                        roughness={0} 
                        metalness={1} 
                    />
                </mesh>
            </group>

            {/* Aura Glow */}
            <mesh ref={auraRef} position={[0, 0.7, 0]}>
                <cylinderGeometry args={[0.45, 0.55, 1.6, 32]} />
                <meshBasicMaterial 
                    color={color} 
                    transparent 
                    opacity={status === 'clash' ? 0.4 : (status === 'checking' ? 0.2 : 0.1)} 
                    blending={THREE.AdditiveBlending} 
                    depthWrite={false} 
                />
            </mesh>

            {status === 'clash' && (
                <Html position={[0, 2.2, 0]} center zIndexRange={[100, 0]}>
                    <div className="text-[#ff3333] font-black text-4xl drop-shadow-[0_0_15px_rgba(255,0,0,1)] pointer-events-none animate-pulse">
                        ✖
                    </div>
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
            <group position={[0, -0.6, 0]}>
                {/* Board Base / Frame */}
                <mesh position={[0, -0.15, 0]}>
                    <boxGeometry args={[N + 0.4, 0.2, N + 0.4]} />
                    <meshStandardMaterial 
                        color="#0a0a0f" 
                        metalness={0.9} 
                        roughness={0.4} 
                        clearcoat={1} 
                        clearcoatRoughness={0.2} 
                    />
                </mesh>
                
                {/* Grid Overlay / Tiles */}
                {Array.from({ length: N }).map((_, r) => (
                    Array.from({ length: N }).map((_, c) => {
                        const isLight = (r + c) % 2 === 0;
                        return (
                            <group key={`tile-${r}-${c}`} position={[r + o, 0, c + o]}>
                                <mesh>
                                    <boxGeometry args={[0.96, 0.1, 0.96]} />
                                    <meshStandardMaterial 
                                        color={isLight ? '#2a2a35' : '#14141d'} 
                                        metalness={0.6}
                                        roughness={0.2}
                                        opacity={0.9}
                                        transparent
                                    />
                                </mesh>
                                {/* Tile inner glow/border */}
                                <mesh position={[0, 0.051, 0]} rotation={[-Math.PI/2, 0, 0]}>
                                    <planeGeometry args={[0.85, 0.85]} />
                                    <meshBasicMaterial 
                                        color={isLight ? '#4a4a5d' : '#1a1a25'} 
                                        transparent 
                                        opacity={0.4} 
                                        blending={THREE.AdditiveBlending}
                                    />
                                </mesh>
                            </group>
                        )
                    })
                ))}
            </group>

            {/* Draw Placed Queens */}
            {board.map((colIndex, r) => {
                if (colIndex !== -1) {
                    return (
                        <QueenToken 
                            key={`queen-${r}`} 
                            position={[r + o, 0, colIndex + o]} 
                            status="idle" 
                            delayOffset={r * 0.5} 
                        />
                    )
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
