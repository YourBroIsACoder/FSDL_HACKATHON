import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/dsStore'
import './ControlPanel.css'

const SCENE_OPS = {
  1: [
    { id: 'push',    label: 'PUSH',     icon: '⬆' },
    { id: 'pop',     label: 'POP',      icon: '💥' },
    { id: 'peek',    label: 'PEEK',     icon: '👁' },
  ],
  2: [
    { id: 'enqueue', label: 'ENQUEUE',  icon: '➡' },
    { id: 'dequeue', label: 'DEQUEUE',  icon: '⬅' },
  ],
  3: [
    { id: 'insert',  label: 'INSERT',   icon: '✦' },
    { id: 'delete',  label: 'DELETE',   icon: '✕' },
  ],
  4: [
    { id: 'insert',  label: 'INSERT',   icon: '🌿' },
    { id: 'bfs',     label: 'BFS',      icon: '🔵' },
    { id: 'dfs',     label: 'DFS',      icon: '🔴' },
  ],
  5: [
    { id: 'addNode', label: 'ADD NODE', icon: '🍄' },
    { id: 'addEdge', label: 'ADD EDGE', icon: '🕸' },
    { id: 'bfs',     label: 'BFS',      icon: '🔵' },
  ],
  6: [
    { id: 'dpRun',   label: 'RUN DP',   icon: '🌊' },
    { id: 'dpReset', label: 'RESET',    icon: '✕' },
  ],
  7: [
    { id: 'btRun',   label: 'FIND PATH', icon: '🍄' },
    { id: 'btReset', label: 'GEN MAZE',  icon: '🎲' },
  ],
  8: [
    { id: 'dcRun',   label: 'SPLIT',     icon: '🧬' },
    { id: 'dcReset', label: 'RESET',     icon: '✕' },
  ],
  9: [
    { id: 'greedyRun', label: 'CLIMB',   icon: '⛰️' },
    { id: 'greedyReset', label: 'RESET', icon: '✕' },
  ],
  10: [
    { id: 'sortBubble', label: 'BUBBLE', icon: '🫧' },
    { id: 'sortQuick',  label: 'QUICK',  icon: '⚡' },
    { id: 'sortReset',  label: 'RESET',  icon: '✕' },
  ],
  11: [
    { id: 'recRun',   label: 'RECURSE',  icon: '🌀' },
    { id: 'recReset', label: 'RESET',    icon: '✕' },
  ]
}

const SCENE_PLACEHOLDERS = {
  1: 'value to push (e.g. 42)',
  2: 'value to enqueue (e.g. 99)',
  3: 'value to insert (e.g. 7)',
  4: 'value to insert (e.g. 15)',
  5: 'node label OR src-tgt (e.g. A-B)',
  6: 'grid size (e.g. 4)',
  7: 'board size N (e.g. 4, 6, 8)',
  8: 'comma-separated array (e.g. 8,3,5,1)',
  9: 'target amount (e.g. 87)',
  10: 'comma-separated array (e.g. 5,2,8,1,9)',
  11: 'start depth (e.g. 6)',
}

const SCENE_NAMES = ['LANDING', 'STACK', 'QUEUE', 'LINKED LIST', 'TREE', 'GRAPH', 'DP', 'BACKTRACKING', 'DIVIDE & CONQUER', 'GREEDY', 'SORTING', 'RECURSION']

export default function ControlPanel({ onOperation }) {
  const currentScene  = useAppStore((s) => s.currentScene)
  const audioEnabled  = useAppStore((s) => s.audioEnabled)
  const toggleAudio   = useAppStore((s) => s.toggleAudio)
  const speed         = useAppStore((s) => s.speed)
  const setSpeed      = useAppStore((s) => s.setSpeed)
  const [input, setInput] = useState('')

  const ops = SCENE_OPS[currentScene] || []
  if (!ops.length) return null
  const placeholder = SCENE_PLACEHOLDERS[currentScene] || 'value…'

  return (
    <motion.div
      className="control-panel"
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      drag dragMomentum={false}
    >
      {/* Scene Label */}
      <div className="panel-scene-label">
        <span className="scene-dot" />
        {SCENE_NAMES[currentScene]}
      </div>

      {/* Input */}
      <input
        id="ds-value-input"
        className="panel-input"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && ops[0]) onOperation(ops[0].id, input) }}
      />

      {/* Ops */}
      <div className="panel-ops">
        {ops.map((op) => (
          <motion.button
            key={op.id}
            id={`btn-${op.id}`}
            className="op-btn"
            whileHover={{ scale: 1.08, boxShadow: '0 0 20px #00ffe066' }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onOperation(op.id, input)}
          >
            <span className="op-icon">{op.icon}</span>
            <span className="op-label">{op.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Speed + Audio */}
      <div className="panel-controls">
        <label className="ctrl-label">SPEED
          <input
            id="speed-slider"
            type="range" min="0.25" max="3" step="0.25"
            value={speed}
            className="speed-slider"
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
          <span className="ctrl-val">{speed}x</span>
        </label>
        <motion.button
          id="audio-toggle"
          className={`audio-btn ${audioEnabled ? 'on' : ''}`}
          onClick={toggleAudio}
          whileTap={{ scale: 0.9 }}
        >
          {audioEnabled ? '🔊 ON' : '🔇 OFF'}
        </motion.button>
      </div>
    </motion.div>
  )
}
