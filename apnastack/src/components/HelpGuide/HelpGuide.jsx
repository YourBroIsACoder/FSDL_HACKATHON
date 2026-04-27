import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PALETTE } from '../../config/assets'
import { useAppStore } from '../../store/dsStore'
import './HelpGuide.css'

const SCENE_GUIDES = {
  1: { title: 'Stack', text: 'Type a value and click PUSH to add it to the top. Click POP to remove the top item. Notice how it follows Last-In-First-Out (LIFO).' },
  2: { title: 'Queue', text: 'Type a value and click ENQUEUE to add it to the back. Click DEQUEUE to remove from the front. Notice how it follows First-In-First-Out (FIFO).' },
  3: { title: 'Linked List', text: 'Type "value, index" (e.g. 42, 0) to insert. To delete, type either the INDEX (e.g. 0 for Head) or the VALUE (e.g. 42). If empty, it deletes the Tail. Watch the pointers dynamically rewire!' },
  4: { title: 'Binary Search Tree', text: 'Type a number and click INSERT to place it in the BST. Click TRAVERSE to watch a breadth-first search highlight the nodes layer by layer.' },
  5: { title: 'Graph', text: 'Type "Source-Target" (e.g. A-B) and click ADD EDGE to connect nodes. Click BFS to watch a breadth-first search ripple through the connections.' },
  6: { title: 'Dynamic Programming', text: 'Type a grid size (e.g. 4) and click RUN DP to solve the grid traveler problem. Watch how it builds the solution bottom-up, filling the matrix.' },
  7: { title: 'Backtracking', text: 'Click GEN MAZE to create a new board. Click FIND PATH to watch the N-Queens solver explore possibilities. It backtracks (glows red) when a path fails!' },
  8: { title: 'Divide & Conquer', text: 'Click SPLIT to divide the array recursively. Watch how Merge Sort breaks the problem down before building the sorted array back up.' },
  9: { title: 'Greedy', text: 'Type a target amount (e.g. 87) and click CLIMB to find the minimum coins needed. It greedily picks the largest coin possible at each step.' },
  10: { title: 'Sorting', text: 'Click BUBBLE or QUICK to run different sorting algorithms on the array. Observe how Quick Sort partitions elements vs Bubble Sort adjacent swaps.' },
  11: { title: 'Recursion', text: 'Click RECURSE to calculate factorial. Watch the call tree branch out and then resolve back down (orange) as base cases are hit.' },
}

export default function HelpGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const currentScene = useAppStore(s => s.currentScene)
  const guide = SCENE_GUIDES[currentScene]

  return (
    <>
      <motion.button
        className="help-btn"
        whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${PALETTE.plasmaTeal}88` }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        ?
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="help-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="help-modal"
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="help-header">
                <h2>HOW TO USE ALGO REEF</h2>
                <button className="help-close" onClick={() => setIsOpen(false)}>✕</button>
              </div>
              
              <div className="help-content">
                {guide && (
                  <div className="help-section" style={{ background: 'rgba(0, 255, 224, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,255,224,0.2)' }}>
                    <h3 style={{ color: PALETTE.moltenOrange }}>✨ Current Subject: {guide.title}</h3>
                    <p>{guide.text}</p>
                  </div>
                )}

                <div className="help-section">
                  <h3>🌍 3D Navigation</h3>
                  <p>Most visualizations are fully 3D. <strong>Click and drag</strong> to rotate the view. <strong>Scroll</strong> to zoom in and out. <strong>Right-click and drag</strong> to pan across large data structures like Graphs and Trees.</p>
                </div>

                <div className="help-section">
                  <h3>🎮 Control Panel (Bottom)</h3>
                  <p>Type values into the input box and click the action buttons (e.g., <strong>PUSH</strong>, <strong>INSERT</strong>) to trigger algorithms. Adjust the <strong>SPEED</strong> slider to speed up or slow down the visual execution.</p>
                </div>

                <div className="help-section">
                  <h3>📚 Theory Panel (Left)</h3>
                  <p>Click the arrow to expand the theory panel. Use <strong>Quick Review</strong> for a TL;DR summary or <strong>Deep Dive</strong> for a textbook explanation. Time and space complexities are constantly visible here.</p>
                </div>

                <div className="help-section">
                  <h3>💻 Code Panel (Right)</h3>
                  <p>As the animation runs, watch this panel! A glowing beam will trace the exact line of pseudocode currently executing, linking the theory to the 3D visual step-by-step.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
