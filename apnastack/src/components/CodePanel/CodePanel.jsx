import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/dsStore'
import './CodePanel.css'

const PSEUDOCODE = {
  push: [
    'function push(value):',
    '  stack.append(value)',
    '  top ← top + 1',
    '  return top',
  ],
  pop: [
    'function pop():',
    '  if stack.isEmpty() → error',
    '  val ← stack[top]',
    '  top ← top - 1',
    '  return val',
  ],
  enqueue: [
    'function enqueue(value):',
    '  queue.append(value)',
    '  tail ← tail + 1',
  ],
  dequeue: [
    'function dequeue():',
    '  if isEmpty() → error',
    '  val ← queue[head]',
    '  head ← head + 1',
    '  return val',
  ],
  insert: [
    'function insert(val, pos):',
    '  node ← new Node(val)',
    '  node.next ← list[pos]',
    '  list[pos-1].next ← node',
  ],
  delete: [
    'function delete(node):',
    '  prev.next ← node.next',
    '  free(node)',
  ],
  bfs: [
    'function BFS(root):',
    '  queue ← [root]',
    '  while queue not empty:',
    '    node ← queue.dequeue()',
    '    visit(node)',
    '    queue.enqueue(node.children)',
  ],
  dfs: [
    'function DFS(node):',
    '  visit(node)',
    '  for child in node.children:',
    '    DFS(child)',
  ],
}

const BIG_O = {
  push:    { time: 'O(1)', space: 'O(1)' },
  pop:     { time: 'O(1)', space: 'O(1)' },
  enqueue: { time: 'O(1)', space: 'O(1)' },
  dequeue: { time: 'O(1)', space: 'O(1)' },
  insert:  { time: 'O(n)', space: 'O(1)' },
  delete:  { time: 'O(n)', space: 'O(1)' },
  bfs:     { time: 'O(V+E)', space: 'O(V)' },
  dfs:     { time: 'O(V+E)', space: 'O(V)' },
}

export default function CodePanel({ activeOp, activeLine }) {
  const lines  = PSEUDOCODE[activeOp] || []
  const bigo   = BIG_O[activeOp]

  return (
    <AnimatePresence>
      {activeOp && (
        <motion.div
          className="code-panel"
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          drag dragMomentum={false}
        >
          <div className="code-header">
            <span className="code-op-name">{activeOp?.toUpperCase()}</span>
            {bigo && (
              <span className="code-bigo">
                <span className="bigo-time">T: {bigo.time}</span>
                <span className="bigo-space">S: {bigo.space}</span>
              </span>
            )}
          </div>
          <div className="code-body">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                className={`code-line ${i === activeLine ? 'active' : ''}`}
                animate={{ opacity: i === activeLine ? 1 : 0.45 }}
              >
                <span className="line-num">{i + 1}</span>
                <span className="line-text">{line}</span>
                {i === activeLine && (
                  <motion.span
                    className="line-beam"
                    layoutId="beam"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
