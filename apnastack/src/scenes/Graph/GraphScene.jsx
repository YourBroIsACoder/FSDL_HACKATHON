import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import * as d3 from 'd3'
import { useAppStore } from '../../store/dsStore'
import { PALETTE } from '../../config/assets'

// Optimized Edge renderer using standard Lines for performance
function GraphEdges({ edges }) {
  const lineRef = useRef()
  
  useFrame(() => {
    if (!lineRef.current) return
    const positions = []
    edges.forEach(edge => {
      positions.push(edge.source.x || 0, edge.source.y || 0, edge.source.z || 0)
      positions.push(edge.target.x || 0, edge.target.y || 0, edge.target.z || 0)
    });
    lineRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    lineRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color={PALETTE.plasmaTeal} transparent opacity={0.4} />
    </lineSegments>
  )
}

function GraphNode({ data }) {
  const meshRef = useRef()
  const isHighlighted = useAppStore(s => s.graphHighlights.includes(data.id))

  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.position.set(data.x || 0, data.y || 0, data.z || 0)
        meshRef.current.rotation.x += delta * 0.5
        meshRef.current.rotation.y += delta * 0.3
        const targetScale = isHighlighted ? 1.5 : 1.0
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.8, 1]} />
      <meshPhysicalMaterial 
        color={isHighlighted ? '#ffffff' : PALETTE.deepViolet} 
        transmission={isHighlighted ? 0 : 0.9} // Glassy if not highlighted
        opacity={1}
        transparent={true}
        roughness={0.1}
        ior={1.5}
        thickness={2}
        emissive={isHighlighted ? PALETTE.moltenOrange : PALETTE.plasmaTeal}
        emissiveIntensity={isHighlighted ? 2 : 0.2}
        wireframe={false}
      />
      <Html position={[0, 1.2, 0]} center className="pointer-events-none">
        <div style={{ color: '#fff', fontSize:'12px', fontFamily: 'JetBrains Mono', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px', border: `1px solid ${PALETTE.plasmaTeal}` }}>
            {data.label}
        </div>
      </Html>
    </mesh>
  )
}

export default function GraphScene() {
  const nodes = useAppStore(s => s.graphNodes)
  const edges = useAppStore(s => s.graphEdges)
  
  const simulation = useMemo(() => {
    return d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(5))
      .force('charge', d3.forceManyBody().strength(-10))
      .force('collide', d3.forceCollide().radius(1.5).iterations(2))
      .force('center', d3.forceCenter(0, 0))
      .force('x', d3.forceX(0).strength(0.08))
      .force('y', d3.forceY(0).strength(0.08))
      .force('z', () => {
          nodes.forEach(n => { n.z = (n.z || 0) * 0.95 + (Math.random() - 0.5) * 0.1 })
      })
  }, []) // eslint-disable-line

  useEffect(() => {
    simulation.nodes(nodes)
    const linkForce = simulation.force('link')
    if (linkForce) { linkForce.links(edges) }
    simulation.alpha(1).restart()
    return () => simulation.stop()
  }, [nodes, edges, simulation])

  return (
    <group>
      <ambientLight intensity={0.5} />
      <GraphEdges edges={edges} />
      {nodes.map(node => (
        <GraphNode key={node.id} data={node} />
      ))}
    </group>
  )
}
