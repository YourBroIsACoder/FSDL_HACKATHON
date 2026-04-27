import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import * as d3 from 'd3'
import { useAppStore } from '../../store/dsStore'
import { PALETTE } from '../../config/assets'

function GraphEdges({ edges, theme }) {
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
      <lineBasicMaterial 
        color={theme === 'light' ? '#000000' : PALETTE.plasmaTeal} 
        transparent 
        opacity={theme === 'light' ? 0.3 : 0.6} 
      />
    </lineSegments>
  )
}

function GraphNode({ data, theme }) {
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

  // Theme-aware node colors
  const baseColor = theme === 'light' ? '#111111' : PALETTE.deepViolet;
  const emColor = isHighlighted ? PALETTE.moltenOrange : (theme === 'light' ? '#333333' : PALETTE.plasmaTeal);

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.8, 2]} />
      <meshStandardMaterial 
        color={isHighlighted ? '#ffffff' : baseColor}
        emissive={emColor}
        emissiveIntensity={isHighlighted ? 2 : (theme === 'light' ? 0 : 0.8)}
        roughness={0.2}
        metalness={0.8}
      />
      <Html position={[0, 1.2, 0]} center className="pointer-events-none">
        <div style={{ 
          color: theme === 'light' ? '#000' : '#fff', 
          fontSize:'14px', 
          fontWeight: 'bold',
          fontFamily: 'JetBrains Mono', 
          background: theme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)', 
          padding: '2px 8px', 
          borderRadius: '6px', 
          border: `1px solid ${isHighlighted ? PALETTE.moltenOrange : (theme === 'light' ? '#000' : PALETTE.plasmaTeal)}`,
          backdropFilter: 'blur(4px)'
        }}>
            {data.label}
        </div>
      </Html>
    </mesh>
  )
}

export default function GraphScene() {
  const nodes = useAppStore(s => s.graphNodes)
  const edges = useAppStore(s => s.graphEdges)
  const theme = useAppStore(s => s.theme)
  
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
      <OrbitControls makeDefault enableZoom={true} enablePan={true} enableRotate={true} />
      <GraphEdges edges={edges} theme={theme} />
      {nodes.map(node => (
        <GraphNode key={node.id} data={node} theme={theme} />
      ))}
    </group>
  )
}
