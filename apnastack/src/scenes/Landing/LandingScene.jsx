import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PALETTE } from '../../config/assets'

import vertexShader from '../../shaders/bioluminescent.vert.glsl?raw'
import fragmentShader from '../../shaders/bioluminescent.frag.glsl?raw'

function HeroBlob() {
  const meshRef = useRef()
  const matRef = useRef()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBaseColor: { value: new THREE.Color(PALETTE.plasmaTeal).multiplyScalar(0.5) },
    uHighlight: { value: 0.1 }
  }), [])

  useFrame((state, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta * 0.5
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
      meshRef.current.rotation.x += delta * 0.05
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5
    }
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[4, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function LandingScene() {
  return (
    <group>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 10, 5]} intensity={2} />
      
      {/* 3D Liquid Hero Blob */}
      <HeroBlob />

      {/* Hero Text */}
      <Html position={[0, -2, 0]} center zIndexRange={[100, 0]} className="pointer-events-none">
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontFamily: 'Syne', 
            fontSize: '8vw', 
            fontWeight: 800, 
            color: '#fff', 
            margin: 0, 
            letterSpacing: '0.1em',
            textShadow: '0 0 40px rgba(0,255,224,0.5)' 
          }}>
            APNASTACK
          </h1>
          <p style={{ 
            fontFamily: 'JetBrains Mono', 
            color: PALETTE.plasmaTeal, 
            fontSize: '1vw',
            letterSpacing: '0.3em',
            marginTop: '10px'
          }}>
            SCROLL TO SHATTER THE REALITY OF DATA STRUCTURES
          </p>
        </div>
      </Html>
    </group>
  )
}
