import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../../store/dsStore'
import { PALETTE } from '../../config/assets'

// A procedural, mathematical interpretation of the Queue flocking.
export default function QueueScene() {
  const queue = useAppStore(s => s.queue)
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tempMat = useMemo(() => new THREE.Matrix4(), [])
  const tempPos = useMemo(() => new THREE.Vector3(), [])
  const tempRot = useMemo(() => new THREE.Euler(), [])
  const targetPos = useMemo(() => new THREE.Vector3(), [])

  // To simulate flocking and moving forwards
  useFrame((state, delta) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    
    queue.forEach((item, i) => {
      // In a queue, index 0 is at the front (right side), index N is at the back (left side).
      const xTarget = (queue.length / 2 - i) * 2.5
      const yTarget = Math.sin(time * 2 + i) * 0.5 // hovering murmuration
      const zTarget = Math.cos(time * 1.5 + i) * 1.5
      targetPos.set(xTarget, yTarget, zTarget)

      // Current matrix
      meshRef.current.getMatrixAt(i, tempMat)
      tempPos.setFromMatrixPosition(tempMat)
      tempRot.setFromRotationMatrix(tempMat)

      // Lerp position towards target
      tempPos.lerp(targetPos, delta * 4)
      tempRot.z += delta

      dummy.position.copy(tempPos)
      dummy.rotation.copy(tempRot)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // Initialize new items at a far distance so they "fly in"
  // Since useFrame runs continuously, we just need to ensure the instanced mesh count is correct
  // and untouched matrices are roughly set.
  useMemo(() => {
    if (!meshRef.current) return
    for(let i=0; i<queue.length; i++) {
        // Only set matrix for newly added items to the end of the queue
        if (i === queue.length - 1) {
            dummy.position.set(-20, 0, 0) // Spawn far left
            dummy.rotation.set(-Math.PI/2, 0, 0)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        }
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [queue.length, dummy])

  return (
    <group position={[0,0,0]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0,5,5]} intensity={1} />
      
      <instancedMesh ref={meshRef} args={[null, null, Math.max(queue.length, 1)]} count={queue.length}>
        {/* Cone geometry rotated to look like a "teardrop/drone/bird" flying right */}
        <coneGeometry args={[0.5, 1.5, 16]} />
        <meshStandardMaterial color={PALETTE.moltenOrange} metalness={0.8} roughness={0.2} />
      </instancedMesh>

      {/* Floating labels for the queue items */}
      {queue.map((item, i) => {
        // We use simple CSS transforms here because matching HTML exactly to InstancedMesh is tricky
        const xPos = (queue.length / 2 - i) * 2.5
        return (
          <Html key={`${item}-${i}`} position={[xPos, 1.5, 0]} center className="pointer-events-none">
            <div style={{ color: '#fff', fontSize:'12px', fontFamily: 'JetBrains Mono' }}>
              {item}
            </div>
          </Html>
        )
      })}
    </group>
  )
}
