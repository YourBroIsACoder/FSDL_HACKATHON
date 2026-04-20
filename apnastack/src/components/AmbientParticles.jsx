import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PALETTE } from '../config/assets'

export default function AmbientParticles({ count = 500 }) {
  const pointsRef = useRef()

  const { positions, randomFactors } = useMemo(() => {
    const p = new Float32Array(count * 3)
    const r = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Widespread galaxy placement
      p[i * 3] = (Math.random() - 0.5) * 60
      p[i * 3 + 1] = (Math.random() - 0.5) * 60
      p[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10
      
      r[i] = Math.random()
    }
    return { positions: p, randomFactors: r }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.elapsedTime
    
    // Slight continuous rotation
    pointsRef.current.rotation.y = time * 0.02
    pointsRef.current.rotation.x = time * 0.01

    // Update positions slightly based on sine waves and random factors
    const positionsAttr = pointsRef.current.geometry.attributes.position
    const p = positionsAttr.array
    for (let i = 0; i < count; i++) {
        p[i * 3 + 1] += Math.sin(time * 0.5 + randomFactors[i] * 10) * 0.01
    }
    positionsAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
           attach="attributes-position"
           count={count}
           array={positions}
           itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
         size={0.12} 
         color={PALETTE.plasmaTeal}
         transparent
         opacity={0.2} // Dimmer background 
         sizeAttenuation={true}
         blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
