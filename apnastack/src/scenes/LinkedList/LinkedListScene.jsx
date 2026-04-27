import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, OrbitControls, RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../../store/dsStore'
import { PALETTE } from '../../config/assets'

function LLNode({ data, pos, isFirst, isLast }) {
  const meshRef = useRef()
  // Try to grab highlight if the store supports it for LL operations
  const isHighlighted = useAppStore(s => s.traversalHighlights?.includes(data.id) || false)

  useFrame((state) => {
    if (meshRef.current) {
        // Subtle floating
        meshRef.current.position.y = pos.y + Math.sin(state.clock.elapsedTime * 2 + pos.x) * 0.15
    }
  })

  const glowColor = isHighlighted ? PALETTE.moltenOrange : PALETTE.plasmaTeal

  return (
    <group position={pos} ref={meshRef}>
      
      {/* HEAD Indicator */}
      {isFirst && (
        <Html position={[-0.3, 1.6, 0]} center className="pointer-events-none">
          <div style={{ color: PALETTE.plasmaTeal, fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 'bold', textShadow: '0 0 10px #00ffe0' }}>
            HEAD
          </div>
          <div style={{ width: '2px', height: '16px', background: PALETTE.plasmaTeal, margin: '4px auto 0 auto', boxShadow: '0 0 10px #00ffe0' }} />
        </Html>
      )}

      {/* Node Box - Premium Glassy Look */}
      <RoundedBox args={[2.2, 1.4, 1]} radius={0.15} smoothness={4}>
        <meshStandardMaterial 
           color={PALETTE.deepViolet} 
           metalness={0.3}
           opacity={0.9} 
           transparent
           roughness={0.1}
           emissive={glowColor}
           emissiveIntensity={isHighlighted ? 0.8 : 0.2}
        />
      </RoundedBox>
      
      {/* Pointer Box Segment (visual separator) */}
      <group position={[0.7, 0, 0.05]}>
        <mesh>
            <boxGeometry args={[0.05, 1.4, 1.01]} />
            <meshBasicMaterial color={PALETTE.ghostWhite} transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Connection arrow to next */}
      {!isLast && (
        <group position={[1.5, 0, 0]}>
          {/* Line */}
          <mesh position={[0.7, 0, 0]}>
            <boxGeometry args={[1.4, 0.05, 0.05]} />
            <meshBasicMaterial color={glowColor} transparent opacity={0.8} />
          </mesh>
          {/* Arrowhead */}
          <mesh position={[1.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.15, 0.3, 8]} />
            <meshBasicMaterial color={glowColor} />
          </mesh>
        </group>
      )}

      {/* NULL Indicator for Tail */}
      {isLast && (
        <group position={[1.5, 0, 0]}>
          <mesh position={[0.4, 0, 0]}>
            <boxGeometry args={[0.8, 0.05, 0.05]} />
            <meshBasicMaterial color={PALETTE.moltenOrange} transparent opacity={0.6} />
          </mesh>
          <Html position={[1.1, 0, 0]} center className="pointer-events-none">
             <div style={{ color: PALETTE.moltenOrange, fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 'bold' }}>
              NULL
            </div>
          </Html>
        </group>
      )}

      {/* Value */}
      <Html position={[-0.3, 0, 0.6]} center className="pointer-events-none">
        <div style={{ color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', fontSize: '24px', fontWeight: 'bold' }}>
          {data.val}
        </div>
      </Html>
      {/* Pointer Label */}
      <Html position={[0.7, 0, 0.6]} center className="pointer-events-none">
         <div style={{ color: glowColor, fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>
          *next
        </div>
      </Html>

      {/* Ambient particles around the node */}
      <Sparkles count={10} scale={3} size={2} speed={0.4} opacity={0.2} color={glowColor} />
    </group>
  )
}

export default function LinkedListScene() {
  const ll = useAppStore(s => s.linkedList)

  // Calculate horizontal layout
  const positions = useMemo(() => 
    ll.map((n, i) => new THREE.Vector3((i - ll.length / 2) * 4.5 + 2.25, 0, 0)),
  [ll])

  return (
    <group position={[0, -0.5, 0]}>
      <OrbitControls makeDefault enableZoom={true} enablePan={true} enableRotate={true} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 10, 5]} intensity={1} />
      
      {ll.map((node, i) => (
        <LLNode 
          key={node.id} 
          data={node} 
          pos={positions[i]} 
          isFirst={i === 0}
          isLast={i === ll.length - 1} 
        />
      ))}
    </group>
  )
}
