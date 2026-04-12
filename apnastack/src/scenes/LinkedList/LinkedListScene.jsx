import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../../store/dsStore'
import { PALETTE } from '../../config/assets'

import vertexShader from '../../shaders/spacetime.vert.glsl?raw'
import fragmentShader from '../../shaders/spacetime.frag.glsl?raw'

// Spacetime Fabric
function Fabric({ nodes }) {
  const matRef = useRef()
  
  // Convert linked list sequence to 3D positions spread along the X axis
  const nodePositions = useMemo(() => {
    return nodes.map((n, i) => new THREE.Vector3((i - nodes.length / 2) * 5, 0, 0))
  }, [nodes])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uNodePositions: { value: new Array(16).fill(new THREE.Vector3(0, -999, 0)) },
    uNodeCount: { value: 0 }
  }), [])

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime
      matRef.current.uniforms.uNodeCount.value = nodePositions.length
      nodePositions.forEach((pos, i) => {
        if (i < 16) matRef.current.uniforms.uNodePositions.value[i].copy(pos)
      })
      matRef.current.uniformsNeedUpdate = true
    }
  })

  return (
    <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100, 128, 128]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}

function LLNode({ data, pos, isLast }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group position={pos}>
      {/* The Gravity Singularity */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      
      {/* Accretion Disk */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 16, 64]} />
        <meshBasicMaterial color={PALETTE.plasmaTeal} transparent opacity={0.6} />
      </mesh>

      {/* Connection arrow to next */}
      {!isLast && (
        <mesh position={[2.5, 0, 0]}>
          <boxGeometry args={[3, 0.1, 0.1]} />
          <meshBasicMaterial color={PALETTE.ghostWhite} transparent opacity={0.3} />
        </mesh>
      )}

      <Html position={[0, 2, 0]} center className="pointer-events-none">
        <div style={{ color: '#00ffe0', fontFamily: 'JetBrains Mono', fontWeight: 'bold' }}>
          {data.val}
        </div>
      </Html>
    </group>
  )
}

export default function LinkedListScene() {
  const ll = useAppStore(s => s.linkedList)

  // Calculate layout natively
  const positions = ll.map((n, i) => new THREE.Vector3((i - ll.length / 2) * 5 + 2.5, -2.5, 0))

  return (
    <group>
      <Fabric nodes={ll} />
      {ll.map((node, i) => (
        <LLNode 
          key={node.id} 
          data={node} 
          pos={positions[i]} 
          isLast={i === ll.length - 1} 
        />
      ))}
    </group>
  )
}
