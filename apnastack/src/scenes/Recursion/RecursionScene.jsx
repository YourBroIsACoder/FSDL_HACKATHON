import React, { useMemo } from 'react'
import { Html, Line, OrbitControls } from '@react-three/drei'
import { useAppStore } from '../../store/dsStore'

// Each node in the call tree
const TreeNode = ({ frame, x, y, parentX, parentY, isRoot }) => {
  const phaseColor = 
    frame.phase === 'base'      ? '#00ff88' :
    frame.phase === 'returning' ? '#ff8800' :
                                  '#00ffe0'

  const phaseBg = 
    frame.phase === 'base'      ? 'rgba(0,255,136,0.15)' :
    frame.phase === 'returning' ? 'rgba(255,136,0,0.15)' :
                                  'rgba(0,255,224,0.1)'

  const phaseLabel = 
    frame.phase === 'base'      ? 'BASE' :
    frame.phase === 'returning' ? `= ${frame.result}` :
                                  '...'

  return (
    <group>
      {/* Edge to parent */}
      {!isRoot && (
        <Line
          points={[[parentX, parentY, 0], [x, y, 0]]}
          color={phaseColor}
          lineWidth={1.5}
          transparent
          opacity={0.35}
        />
      )}

      {/* Node card */}
      <Html position={[x, y, 0]} center className="pointer-events-none">
        <div
          style={{
            background: phaseBg,
            border: `1.5px solid ${phaseColor}`,
            borderRadius: '10px',
            padding: '6px 14px',
            minWidth: '110px',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
            boxShadow: `0 0 12px ${phaseColor}55`,
            transition: 'all 0.3s',
          }}
        >
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--text)',
            fontSize: '13px',
            fontWeight: 'bold',
          }}>
            fact({frame.arg})
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: phaseColor,
            fontSize: '11px',
            marginTop: '2px',
          }}>
            {phaseLabel}
          </div>
        </div>
      </Html>
    </group>
  )
}

export default function RecursionScene() {
  const frames = useAppStore(s => s.recursionFrames)

  // Layout: each frame is a node in a vertical chain
  // All frames are laid out top→bottom, fitting within [-5, 5] Y space
  const MAX_Y = 5
  const MIN_Y = -5
  const nodes = useMemo(() => {
    if (!frames || frames.length === 0) return []
    const count = frames.length
    // If only 1 frame, center it
    if (count === 1) return [{ frame: frames[0], x: 0, y: 0, parentX: 0, parentY: 0, isRoot: true }]
    
    const step = (MAX_Y - MIN_Y) / (count - 1)
    return frames.map((frame, i) => ({
      frame,
      x: 0,
      y: MAX_Y - i * step,
      parentX: 0,
      parentY: MAX_Y - (i - 1) * step,
      isRoot: i === 0,
    }))
  }, [frames])

  if (!frames || frames.length === 0) {
    return (
      <Html position={[0, 0, 0]} center className="pointer-events-none">
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(0,255,224,0.4)',
          fontSize: '16px',
          textAlign: 'center',
          padding: '24px',
          border: '1px dashed rgba(0,255,224,0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(8px)',
        }}>
          Enter a number (e.g. 6)<br/>
          <span style={{ fontSize: '12px', opacity: 0.6 }}>then press RECURSE</span>
        </div>
      </Html>
    )
  }

  return (
    <group>
      <OrbitControls makeDefault enableZoom={true} enablePan={true} enableRotate={true} />
      {/* Legend */}
      <Html position={[5.5, 5, 0]} center className="pointer-events-none">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '10px 14px',
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          backdropFilter: 'blur(8px)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
        }}>
          {[
            { color: '#00ffe0', label: 'Calling…' },
            { color: '#00ff88', label: 'Base case' },
            { color: '#ff8800', label: 'Returning' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
              <span style={{ color: '#ffffff99' }}>{label}</span>
            </div>
          ))}
        </div>
      </Html>

      {/* Call chain title */}
      <Html position={[0, 6.5, 0]} center className="pointer-events-none">
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 900,
          fontSize: '18px',
          color: 'var(--text)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}>
          Call Stack
        </div>
      </Html>

      {/* Render all nodes */}
      {nodes.map((n, i) => (
        <TreeNode
          key={`${n.frame.arg}-${i}`}
          frame={n.frame}
          x={n.x}
          y={n.y}
          parentX={n.parentX}
          parentY={n.parentY}
          isRoot={n.isRoot}
        />
      ))}
    </group>
  )
}
