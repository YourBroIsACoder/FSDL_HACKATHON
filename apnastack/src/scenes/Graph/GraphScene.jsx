import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import * as d3 from 'd3'
import { useAppStore } from '../../store/dsStore'
import { PALETTE } from '../../config/assets'

function GraphEdges({ lines }) {
  // Renders the glowing mycelium hyphae lines connecting nodes
  return (
    <group>
      {lines.map((line, i) => {
        const pts = [
            new THREE.Vector3(line.source.x || 0, line.source.y || 0, line.source.z || 0),
            new THREE.Vector3(line.target.x || 0, line.target.y || 0, line.target.z || 0)
        ]
        const curve = new THREE.LineCurve3(pts[0], pts[1])
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 4, 0.08, 6, false]} />
            <meshBasicMaterial color={PALETTE.plasmaTeal} transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

function GraphNode({ data }) {
  const meshRef = useRef()
  const isHighlighted = useAppStore(s => s.graphHighlights.includes(data.id))

  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.position.set(data.x || 0, data.y || 0, data.z || 0)
        // Add subtle organic rotation/breathing
        meshRef.current.rotation.x += delta * 0.5
        meshRef.current.rotation.y += delta * 0.3
        
        // Scale pulse if highlighted (e.g. during BFS)
        const targetScale = isHighlighted ? 1.5 : 1.0
        meshRef.current.scale.lerpScalar(targetScale, 0.1)
    }
  })

  // We are using procedural Metaball-like organic blobs
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} /> {/* icosahedron with detail=1 looks organic */}
      <meshStandardMaterial 
        color={isHighlighted ? '#ffffff' : PALETTE.deepViolet} 
        wireframe={!isHighlighted}
        emissive={isHighlighted ? PALETTE.moltenOrange : '#000'}
      />
      <Html position={[0, 1.5, 0]} center className="pointer-events-none">
        <div style={{ color: '#fff', fontSize:'14px', fontFamily: 'JetBrains Mono' }}>
            {data.id}
        </div>
      </Html>
    </mesh>
  )
}

export default function GraphScene() {
  const nodes = useAppStore(s => s.graphNodes)
  const edges = useAppStore(s => s.graphEdges)
  
  // Local state to force rerenders when D3 updates the positions
  const [simTick, setSimTick] = useState(0)

  // Configure D3 Force simulation
  const simulation = useMemo(() => {
    return d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(4))
      .force('charge', d3.forceManyBody().strength(-20))
      .force('center', d3.forceCenter(0, 0))
      // Add fake Z force to keep it semi-3D but mostly planar
      .force('z', () => {
          nodes.forEach(n => { n.z = (n.z || 0) * 0.95 + (Math.random() - 0.5) * 0.5 })
      })
  }, []) // eslint-disable-line

  useEffect(() => {
    // D3 mutates the original objects, which is fine since they are passed as refs
    simulation.nodes(nodes)
    // d3 maps source/target strings to the actual node objects
    const linkForce = simulation.force('link')
    if (linkForce) { linkForce.links(edges) }
    
    simulation.alpha(1).restart()

    // Listen for ticks
    simulation.on('tick', () => {
      setSimTick(t => t + 1)
    })

    return () => simulation.stop()
  }, [nodes, edges, simulation])

  return (
    <group position={[0,0,0]}>
      <ambientLight intensity={0.5} />
      <GraphEdges lines={edges} />
      {nodes.map(node => (
        <GraphNode key={node.id} data={node} />
      ))}
    </group>
  )
}
