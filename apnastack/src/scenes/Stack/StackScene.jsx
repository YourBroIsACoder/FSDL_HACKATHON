import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../../store/dsStore'
import { PALETTE } from '../../config/assets'

import vertexShader from '../../shaders/tectonic.vert.glsl?raw'
import fragmentShader from '../../shaders/tectonic.frag.glsl?raw'

// Tectonic Plate component
function StackLayer({ item, index, total }) {
  const meshRef = useRef()
  const matRef = useRef()

  // Animate pushing/popping
  const targetY = index * 0.5 - (total * 0.25)
  const isTop = index === total - 1

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIndex: { value: index },
      uColor: { value: new THREE.Color(PALETTE.voidBlack).lerp(new THREE.Color('#1a1a24'), 0.5) },
      uHeat: { value: isTop ? 1.0 : (index / total) * 0.5 },
    }),
    [index, total, isTop]
  )

  useFrame((state, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    if (meshRef.current) {
      // Smooth lerp to target vertical position
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 5 * delta
    }
  })

  return (
    <mesh ref={meshRef} position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6, 4, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
        side={THREE.DoubleSide}
      />
      {/* 3D Label for the value */}
      <Html position={[3.2, 0, 0]} right center className="pointer-events-none">
        <div style={{ color: '#fff', fontFamily: 'JetBrains Mono', fontSize: '18px', fontWeight: 'bold' }}>
          {item}
        </div>
      </Html>
    </mesh>
  )
}


// Procedural Fracture Explosion
function PopExplosion({ yPos }) {
  const meshRef = useRef()
  const COUNT = 150
  
  // Instance velocities and initial state
  const physicsData = useMemo(() => {
    const data = []
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const r = Math.random() * 4 + 1
      data.push({
        velocity: new THREE.Vector3(Math.cos(theta) * r, Math.random() * 5 + 2, Math.sin(theta) * r),
        rotationSpeed: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(10),
        life: 1.0
      })
    }
    return data
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tempMat = useMemo(() => new THREE.Matrix4(), [])
  const tempPos = useMemo(() => new THREE.Vector3(), [])
  const tempRot = useMemo(() => new THREE.Euler(), [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    physicsData.forEach((p, i) => {
      p.life -= delta * 1.5
      if (p.life > 0) {
        // Gravity & Velocity
        p.velocity.y -= 9.8 * delta
        
        // Extract matrix
        meshRef.current.getMatrixAt(i, tempMat)
        tempPos.setFromMatrixPosition(tempMat)
        
        // Update physics
        tempPos.addScaledVector(p.velocity, delta)
        tempRot.setFromRotationMatrix(tempMat)
        tempRot.x += p.rotationSpeed.x * delta
        tempRot.y += p.rotationSpeed.y * delta
        tempRot.z += p.rotationSpeed.z * delta
        
        dummy.position.copy(tempPos)
        dummy.rotation.copy(tempRot)
        dummy.scale.setScalar(p.life)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      } else {
        dummy.scale.setScalar(0)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // Initialize instances at center yPos
  useMemo(() => {
    if (!meshRef.current) return
    for (let i = 0; i < COUNT; i++) {
      dummy.position.set(0, yPos, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
  }, [yPos, dummy])

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <dodecahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color={PALETTE.moltenOrange} emissive={PALETTE.plasmaTeal} emissiveIntensity={2} toneMapped={false} />
    </instancedMesh>
  )
}

export default function StackScene() {
  const stack = useAppStore(s => s.stack)
  const effects = useAppStore(s => s.effects)
  const popEffects = effects.filter(e => e.type === 'popExplosion')

  return (
    <group position={[0, -1, 0]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 10, 5]} intensity={1} />
      
      {stack.map((item, index) => (
        <StackLayer 
          key={`${item}-${index}`} 
          item={item} 
          index={index} 
          total={stack.length} 
        />
      ))}

      {popEffects.map(eff => (
        <PopExplosion key={eff.id} yPos={eff.y} />
      ))}
    </group>
  )
}
