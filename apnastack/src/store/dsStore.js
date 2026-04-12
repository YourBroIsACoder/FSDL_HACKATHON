import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  // ── Scene Management ──────────────────────────────────────────────────────
  currentScene: 0,   // 0=Landing, 1=Stack, 2=Queue, 3=LinkedList, 4=Tree, 5=Graph
  setScene: (idx) => set({ currentScene: idx }),

  // ── Audio ──────────────────────────────────────────────────────────────────
  audioEnabled: false,
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),

  // ── Animation Speed ────────────────────────────────────────────────────────
  speed: 1.0,  // multiplier applied to all Tone.js and Framer durations
  setSpeed: (v) => set({ speed: v }),

  // ── Transient Effects & State ─────────────────────────────────────────────
  activeLine: -1,
  setActiveLine: (line) => set({ activeLine: line }),
  effects: [],
  triggerEffect: (type, params) => {
    const id = Date.now()
    set((s) => ({ effects: [...s.effects, { id, type, ...params }] }))
    setTimeout(() => {
      set((s) => ({ effects: s.effects.filter(e => e.id !== id) }))
    }, 2000)
  },

  // ── Stack DS ──────────────────────────────────────────────────────────────
  stack: [],
  stackPush: (val) => set((s) => ({ stack: [...s.stack, val] })),
  stackPop: () => {
    const s = get()
    if (!s.stack.length) return null
    const val = s.stack[s.stack.length - 1]
    const popIndex = s.stack.length - 1
    const total = s.stack.length
    // Calculate where the plate currently is: (index * 0.5 - (total * 0.25))
    const yPos = popIndex * 0.5 - (total * 0.25)
    s.triggerEffect('popExplosion', { y: yPos, val })
    set({ stack: s.stack.slice(0, -1) })
    return val
  },
  stackPeek: () => { const s = get(); return s.stack[s.stack.length - 1] },

  // ── Queue DS ──────────────────────────────────────────────────────────────
  queue: [],
  queueEnqueue: (val) => set((s) => ({ queue: [...s.queue, val] })),
  queueDequeue: () => {
    const s = get()
    if (!s.queue.length) return null
    const val = s.queue[0]
    set({ queue: s.queue.slice(1) })
    return val
  },

  // ── Linked List DS ────────────────────────────────────────────────────────
  linkedList: [],   // array of { id, val, next }
  llInsert: (val, idx) => set((s) => {
    const node = { id: Date.now(), val, next: null }
    const list = [...s.linkedList]
    list.splice(idx ?? list.length, 0, node)
    return { linkedList: list }
  }),
  llDelete: (id) => set((s) => ({ linkedList: s.linkedList.filter(n => n.id !== id) })),

  // ── Tree DS ───────────────────────────────────────────────────────────────
  tree: null,  // { id, val, left, right }
  treeInsert: (val) => {
    const insert = (node, v) => {
      if (!node) return { id: Date.now(), val: v, left: null, right: null }
      if (v < node.val) return { ...node, left: insert(node.left, v) }
      return { ...node, right: insert(node.right, v) }
    }
    set((s) => ({ tree: insert(s.tree, val) }))
  },
  traversalHighlights: [],  // array of node ids currently highlighted
  setTraversalHighlights: (ids) => set({ traversalHighlights: ids }),

  // ── Graph DS ──────────────────────────────────────────────────────────────
  graphNodes: [],  // [{ id, label }]
  graphEdges: [],  // [{ source, target }]
  graphAddNode: (label) => set((s) => ({
    graphNodes: [...s.graphNodes, { id: Date.now(), label }]
  })),
  graphAddEdge: (src, tgt) => set((s) => ({
    graphEdges: [...s.graphEdges, { source: src, target: tgt }]
  })),
  graphHighlights: [],
  setGraphHighlights: (ids) => set({ graphHighlights: ids }),

  // ── Operation Log ─────────────────────────────────────────────────────────
  lastOp: null,   // { type, value, timestamp }
  logOp: (type, value) => set({ lastOp: { type, value, timestamp: Date.now() } }),
}))
