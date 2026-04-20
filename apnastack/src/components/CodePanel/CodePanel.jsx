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
  addNode: [
    'function addNode(graph, val):',
    '  node ← new Node(val)',
    '  graph.nodes.append(node)',
  ],
  addEdge: [
    'function addEdge(u, v):',
    '  u.edges.append(v)',
    '  v.edges.append(u) // if undirected',
  ],
  greedyRun: [
     'function coin_change(target):',
     '  for coin in [25, 10, 5, 1]:',
     '    while target >= coin:',
     '      target -= coin',
     '      coins.push(coin)',
     '  return coins'
  ],
  recRun: [
     'function factorial(n):',
     '  if n <= 1: return 1',
     '  return n * factorial(n - 1)'
  ],
  btRun: [
     'function NQueens(row):',
     '  if row == N: return True',
     '  for col in 0 to N-1:',
     '    if isSafe(row, col):',
     '      place_queen()',
     '      if NQueens(row + 1): return True',
     '      remove_queen()',
     '  return False'
  ],
  dpRun: [
     'function GridTraveler(grid):',
     '  dp[0][0] = 1',
     '  for r in rows:',
     '    for c in cols:',
     '      if r > 0 or c > 0:',
     '         dp[r][c] = dp[r-1][c] + dp[r][c-1]',
  ],
  dcRun: [
    'function split(Array):',
    '  mid ← len(Array) / 2',
    '  left ← Array[0...mid]',
    '  right ← Array[mid...end]',
    '  return left, right',
  ],
  greedyRun: [
    'function climb(pos):',
    '  loop 15 times:',
    '    next ← argmax(height(neighbor))',
    '    if height(next) > height(pos):',
    '      pos ← next',
    '    else break',
  ],
  sortBubble: [
    'function bubbleSort(A):',
    '  for i from 1 to len(A):',
    '    for j from 0 to len(A)-i-1:',
    '      if A[j] > A[j+1]:',
    '        swap(A[j], A[j+1])',
  ],
  sortQuick: [
    'function quickSort(A, low, high):',
    '  if low < high:',
    '    p ← partition(A, low, high)',
    '    quickSort(A, low, p-1)',
    '    quickSort(A, p+1, high)',
  ],
  recRun: [
    'function recurse(depth):',
    '  if depth == MAX:',
    '    return BASE_CASE',
    '  return recurse(depth+1)',
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
  addNode:   { time: 'O(1)', space: 'O(1)' },
  addEdge:   { time: 'O(1)', space: 'O(1)' },
  dpRun:     { time: 'O(n)', space: 'O(n)' },
  dcRun:     { time: 'O(1)', space: 'O(n)' },
  greedyRun: { time: 'O(k)', space: 'O(1)' },
  sortBubble:{ time: 'O(n²)', space: 'O(1)' },
  sortQuick: { time: 'O(n log n)', space: 'O(log n)' },
  recRun:    { time: 'O(n)', space: 'O(n)' },
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
