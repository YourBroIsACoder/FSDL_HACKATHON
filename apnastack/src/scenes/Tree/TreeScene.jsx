import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { useAppStore } from '../../store/dsStore'
import { PALETTE } from '../../config/assets'

import vertexShader from '../../shaders/bioluminescent.vert.glsl?raw'
import fragmentShader from '../../shaders/bioluminescent.frag.glsl?raw'

// Recursive tree node math
function calculateTreeLayout(node, x = 0, y = 5, level = 0, layout = []) {
  if (!node) return layout
  layout.push({ ...node, x, y, level })
  
  const hSpacing = 6 / Math.pow(1.8, level) // branches get closer as depth increases
  if (node.left) calculateTreeLayout(node.left, x - hSpacing, y - 2.5, level + 1, layout)
  if (node.right) calculateTreeLayout(node.right, x + hSpacing, y - 2.5, level + 1, layout)
  return layout
}

function TreeNode({ data }) {
  const meshRef = useRef()
  const matRef = useRef()
  const isHighlighted = useAppStore(s => s.traversalHighlights.includes(data.id))

  const uniforms = useMemo(() => ({
    uTime: { value: Math.random() * 10 },
    uBaseColor: { value: new THREE.Color(PALETTE.plasmaTeal) },
    uHighlight: { value: 0.0 }
  }), [])

  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta
      // Smooth bloom glow when highlighted
      const targetH = isHighlighted ? 1.0 : 0.0
      matRef.current.uniforms.uHighlight.value += Math.sign(targetH - matRef.current.uniforms.uHighlight.value) * delta * 5.0
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2
      // gently float
      meshRef.current.position.y = data.y + Math.sin(state.clock.elapsedTime * 2 + data.x) * 0.15
    }
  })

  return (
    <group position={[data.x, data.y, 0]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.8, 4]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      <Html position={[1, 1, 0]} className="pointer-events-none">
        <div style={{ color: 'var(--text)', fontFamily: 'JetBrains Mono', fontSize: '14px' }}>
          {data.val}
        </div>
      </Html>
    </group>
  )
}

function TreeEdges({ layout }) {
  const lines = []
  layout.forEach((node) => {
    if (node.left) {
      const leftChild = layout.find(n => n.id === node.left.id)
      if (leftChild) lines.push([new THREE.Vector3(node.x, node.y, 0), new THREE.Vector3(leftChild.x, leftChild.y, 0)])
    }
    if (node.right) {
      const rightChild = layout.find(n => n.id === node.right.id)
      if (rightChild) lines.push([new THREE.Vector3(node.x, node.y, 0), new THREE.Vector3(rightChild.x, rightChild.y, 0)])
    }
  })

  // We map the Lines as glowing tubes or simple lines
  return (
    <group>
      {lines.map((pts, i) => {
        const curve = new THREE.CatmullRomCurve3(pts)
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 8, 0.05, 8, false]} />
            <meshBasicMaterial color={PALETTE.deepViolet} transparent opacity={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function TreeScene() {
  const treeRoot = useAppStore(s => s.tree)
  const traversalOrder = useAppStore(s => s.traversalOrder)
  const layout = useMemo(() => calculateTreeLayout(treeRoot), [treeRoot])

  return (
    <group position={[0, 0, 0]}>
      <OrbitControls makeDefault enableZoom={true} enablePan={true} enableRotate={true} />
      
      {/* Lighting for depth */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2.5} color={PALETTE.moltenOrange} />
      <pointLight position={[-10, -5, 5]} intensity={2} color={PALETTE.plasmaTeal} />

      <Html position={[0, 10, -5]} center>
         <div className="traversal-dashboard">
            <div className="stat-label">TRAVERSAL SEQUENCE</div>
            <div className="traversal-chips">
               <AnimatePresence>
                  {traversalOrder.map((val, i) => (
                     <motion.span
                        key={`${i}-${val}`}
                        initial={{ scale: 0, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="traversal-chip"
                     >
                        {val}
                     </motion.span>
                  ))}
               </AnimatePresence>
               {traversalOrder.length === 0 && <span className="text-var(--text-dim) italic opacity-50">Waiting for traversal...</span>}
            </div>
         </div>
      </Html>

      <TreeEdges layout={layout} />
      {layout.map(node => (
        <TreeNode key={node.id} data={node} />
      ))}
    </group>
  )
}
