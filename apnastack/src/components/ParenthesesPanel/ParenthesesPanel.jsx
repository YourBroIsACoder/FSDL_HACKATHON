import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/dsStore'

function checkBalanced(expr) {
  const steps = []
  const stack = []
  const chars = expr.split('')

  const snap = (char, action, explanation) => steps.push({
    char, action, explanation,
    stack: [...stack],
  })

  const pairs = { ')': '(', ']': '[', '}': '{' }

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    if ('([{'.includes(ch)) {
      stack.push(ch)
      snap(ch, 'push', `Opening bracket '${ch}' found → push to stack`)
    } else if (')]}'.includes(ch)) {
      if (stack.length === 0) {
        snap(ch, 'error', `Closing bracket '${ch}' found but stack is empty! → UNBALANCED`)
        return { steps, result: false }
      }
      const top = stack.pop()
      if (top !== pairs[ch]) {
        snap(ch, 'error', `'${ch}' doesn't match top of stack '${top}' → UNBALANCED`)
        return { steps, result: false }
      }
      snap(ch, 'pop', `'${ch}' matches '${top}' → pop from stack`)
    } else {
      snap(ch, 'skip', `Character '${ch}' is not a bracket → skip`)
    }
  }

  const finalResult = stack.length === 0
  if (!finalResult) {
    snap('(end)', 'error', `End of string reached but stack is not empty: [${stack.join(', ')}] → UNBALANCED`)
  } else {
    snap('(end)', 'success', `End of string reached and stack is empty → BALANCED!`)
  }

  return { steps, result: finalResult }
}

const ACTION_COLOR = {
  push: 'var(--accent2)',
  pop: 'var(--accent)',
  error: '#ff4444',
  success: '#00ff88',
  skip: 'var(--text-dim)',
}

export default function ParenthesesPanel({ visible }) {
  const [expr, setExpr] = useState('{[()]}')
  const [steps, setSteps] = useState([])
  const [stepIdx, setStepIdx] = useState(-1)
  const [running, setRunning] = useState(false)
  const timerRef = useRef(null)

  const currentStep = steps[stepIdx] ?? null

  const reset = () => {
    clearTimeout(timerRef.current)
    setSteps([]); setStepIdx(-1); setRunning(false)
  }

  const handleCheck = () => {
    reset()
    const { steps: newSteps } = checkBalanced(expr)
    setSteps(newSteps)
    setStepIdx(0)
  }

  const handleAutoPlay = () => {
    if (!steps.length) return
    setRunning(true)
    let i = stepIdx
    const tick = () => {
      i++
      if (i >= steps.length) { setRunning(false); return }
      setStepIdx(i)
      timerRef.current = setTimeout(tick, 800)
    }
    timerRef.current = setTimeout(tick, 800)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        key="parens-panel"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 300,
          width: 'min(700px, 95vw)',
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-strong)',
          borderRadius: 20,
          padding: '20px 24px',
          backdropFilter: 'blur(20px)',
          boxShadow: 'var(--glow-panel)',
        }}
      >
        <div style={{ color: 'var(--accent)', fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, marginBottom: 14 }}>
          BALANCED PARENTHESES CHECKER
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <input
            value={expr}
            onChange={e => { reset(); setExpr(e.target.value) }}
            placeholder="e.g. {[( )]}"
            style={{
              flex: 1, padding: '9px 14px', background: 'var(--input-bg)',
              border: '1px solid var(--border)', borderRadius: 10,
              color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace', fontSize: 15, outline: 'none',
            }}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
          />
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleCheck}
            style={{
              padding: '9px 18px', background: 'var(--btn-bg)',
              border: '1px solid var(--border-strong)', borderRadius: 10,
              color: 'var(--accent)', fontWeight: 700, fontSize: 12, cursor: 'pointer',
            }}
          >
            VALIDATE
          </motion.button>
        </div>

        {steps.length > 0 && (
          <>
            <AnimatePresence mode="wait">
              {currentStep && (
                <motion.div
                  key={stepIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  style={{
                    padding: '12px 16px', borderRadius: 10, marginBottom: 14,
                    background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: 6,
                      background: ACTION_COLOR[currentStep.action] || 'var(--accent)',
                      color: 'var(--bg)', fontSize: 11, fontWeight: 800,
                    }}>
                      {currentStep.action.toUpperCase()}
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
                      {currentStep.char}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-mid)', fontSize: 13, margin: 0 }}>{currentStep.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 8, letterSpacing: '0.1em' }}>CHECKER STACK</div>
              <div style={{ display: 'flex', gap: 6, minHeight: 32 }}>
                {currentStep?.stack.length === 0 ? <span style={{ color: 'var(--text-dim)' }}>empty</span> : 
                  currentStep.stack.map((s, i) => (
                    <span key={i} style={{
                      padding: '2px 8px', borderRadius: 4, background: 'var(--accent)', color: 'var(--bg)',
                      fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: 14
                    }}>{s}</span>
                  ))
                }
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStepIdx(i => Math.max(0, i - 1))} style={{ padding: '7px 14px', borderRadius: 8, background: 'var(--btn-bg)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}>PREV</button>
              <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))} style={{ padding: '7px 14px', borderRadius: 8, background: 'var(--btn-bg)', border: '1px solid var(--border)', color: 'var(--accent)', cursor: 'pointer' }}>NEXT</button>
              <button onClick={handleAutoPlay} disabled={running} style={{ flex: 1, padding: '7px 14px', borderRadius: 8, background: 'var(--accent2)', color: 'white', border: 'none', cursor: 'pointer' }}>
                {running ? 'RUNNING...' : 'AUTO-PLAY'}
              </button>
              <button onClick={reset} style={{ padding: '7px 14px', borderRadius: 8, background: 'var(--btn-bg)', border: '1px solid var(--border)', color: 'var(--text-dim)', cursor: 'pointer' }}>✕</button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
