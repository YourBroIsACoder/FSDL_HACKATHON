import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Center, Float, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { PALETTE } from '../../config/assets'

function TechGlobe() {
  const meshRef = useRef()
  const innerRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15
      meshRef.current.rotation.z += delta * 0.05
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.2
      innerRef.current.rotation.x -= delta * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[4.5, 1]} />
        <meshStandardMaterial 
          color={PALETTE.plasmaTeal} 
          wireframe={true} 
          transparent 
          opacity={0.15} 
        />
        {/* Inner core */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[2.5, 0]} />
          <meshStandardMaterial 
            color={PALETTE.moltenOrange} 
            emissive={PALETTE.moltenOrange} 
            emissiveIntensity={1.2} 
            wireframe={true} 
            transparent
            opacity={0.8}
          />
        </mesh>
      </mesh>
    </Float>
  )
}

function Starfield() {
  const pointsRef = useRef()
  
  const [positions] = useMemo(() => {
    const pos = new Float32Array(600 * 3)
    for (let i = 0; i < 600; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10
    }
    return [pos]
  }, [])

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial transparent color={PALETTE.plasmaTeal} size={0.08} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  )
}

export default function LandingScene() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current && state.pointer) {
      const targetRotationY = state.pointer.x * 0.1
      const targetRotationX = -state.pointer.y * 0.05
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color={PALETTE.plasmaTeal} />
      <directionalLight position={[-10, -10, -5]} intensity={1.5} color={PALETTE.moltenOrange} />
      
      <Center position={[0, 3.5, -2]}>
        <Text
          fontSize={4.5}
          maxWidth={200}
          lineHeight={1}
          letterSpacing={0.15}
          textAlign="center"
          outlineWidth={0.02}
          outlineColor={PALETTE.voidBlack}
        >
          ALGOREEF
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.8} 
            metalness={0.8}
            roughness={0.2}
          />
        </Text>
      </Center>

      <TechGlobe />
      <Starfield />
    </group>
  )
}
