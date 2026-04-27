import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/dsStore'

/* ─── Operator precedence & helpers ─────────────────────────────────────────── */
const PRECEDENCE = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 }
const isOperator  = (c) => '+-*/^'.includes(c)
const isOperand   = (c) => /[a-zA-Z0-9]/.test(c)

function tokenize(expr) {
  // supports multi-char operands e.g. "ab+cd" → ['ab','+','cd']
  const tokens = []
  let buf = ''
  for (const ch of expr.replace(/\s/g, '')) {
    if (isOperand(ch)) { buf += ch }
    else {
      if (buf) { tokens.push(buf); buf = '' }
      if (ch === '(' || ch === ')' || isOperator(ch)) tokens.push(ch)
    }
  }
  if (buf) tokens.push(buf)
  return tokens
}

function buildSteps(tokens) {
  const steps = []
  const stack  = []   // operator stack
  const output = []

  const snap = (token, action, explanation) => steps.push({
    token, action, explanation,
    stack: [...stack],
    output: [...output],
  })

  for (const tok of tokens) {
    if (isOperand(tok)) {
      output.push(tok)
      snap(tok, 'output', `Operand → send directly to output`)

    } else if (tok === '(') {
      stack.push(tok)
      snap(tok, 'push', `Open paren → push onto stack`)

    } else if (tok === ')') {
      snap(tok, 'pop-until', `Close paren → pop until matching '('`)
      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop())
      }
      stack.pop()  // discard '('

    } else if (isOperator(tok)) {
      while (
        stack.length &&
        stack[stack.length - 1] !== '(' &&
        PRECEDENCE[stack[stack.length - 1]] >= PRECEDENCE[tok]
      ) {
        output.push(stack.pop())
        snap(tok, 'pop-higher', `'${stack[stack.length + 1] || ''}' has higher/equal precedence → pop it first`)
      }
      stack.push(tok)
      snap(tok, 'push', `Push operator '${tok}' (precedence ${PRECEDENCE[tok]})`)

    }
  }

  // drain remaining operators
  while (stack.length) {
    output.push(stack.pop())
    snap('(end)', 'drain', `Expression done → drain remaining operators`)
  }

  return steps
}

/* ─── Visual tokens ─────────────────────────────────────────────────────────── */
const TOKEN_COLOR = {
  output:       'var(--accent)',
  push:         'var(--accent2)',
  'pop-higher': '#ff8800',
  'pop-until':  '#ff4444',
  drain:        '#aaaaaa',
}

function TokenChip({ tok, highlight }) {
  return (
    <motion.span
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        margin: '2px',
        borderRadius: 6,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 16,
        fontWeight: 700,
        background: highlight ? 'var(--accent)' : 'var(--btn-bg)',
        color: highlight ? 'var(--bg)' : 'var(--text)',
        border: '1px solid var(--border)',
        boxShadow: highlight ? '0 0 12px var(--accent)' : 'none',
      }}
    >
      {tok}
    </motion.span>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function InfixPanel({ visible }) {
  const [expr,     setExpr]     = useState('a+b*c-d/e')
  const [steps,    setSteps]    = useState([])
  const [stepIdx,  setStepIdx]  = useState(-1)
  const [running,  setRunning]  = useState(false)
  const [error,    setError]    = useState('')
  const timerRef = useRef(null)

  const currentStep = steps[stepIdx] ?? null

  const reset = () => {
    clearTimeout(timerRef.current)
    setSteps([]); setStepIdx(-1); setRunning(false); setError('')
  }

  const handleBuild = () => {
    reset()
    try {
      const tokens = tokenize(expr)
      if (!tokens.length) throw new Error('Empty expression')
      const built = buildSteps(tokens)
      setSteps(built)
      setStepIdx(0)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleAutoPlay = () => {
    if (!steps.length) return
    setRunning(true)
    let i = stepIdx
    const tick = () => {
      i++
      if (i >= steps.length) { setRunning(false); return }
      setStepIdx(i)
      timerRef.current = setTimeout(tick, 900)
    }
    timerRef.current = setTimeout(tick, 900)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  if (!visible) return null

  const finalResult = stepIdx === steps.length - 1
    ? steps[steps.length - 1]?.output.join(' ')
    : null

  return (
    <AnimatePresence>
      <motion.div
        key="infix-panel"
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
          fontFamily: 'Syne, sans-serif',
        }}
      >
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)', fontSize: 11, letterSpacing: '0.2em', fontWeight: 700 }}>
            INFIX → POSTFIX  ·  STACK DEMO
          </span>
        </div>

        {/* Expression input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <input
            value={expr}
            onChange={e => { reset(); setExpr(e.target.value) }}
            placeholder="e.g. a+b*c or (a+b)*(c-d)"
            style={{
              flex: 1,
              padding: '9px 14px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: 'var(--text)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 15,
              outline: 'none',
            }}
            onKeyDown={e => e.key === 'Enter' && handleBuild()}
          />
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleBuild}
            style={{
              padding: '9px 18px',
              background: 'var(--btn-bg)',
              border: '1px solid var(--border-strong)',
              borderRadius: 10,
              color: 'var(--accent)',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}
          >
            BUILD STEPS
          </motion.button>
        </div>

        {error && (
          <div style={{ color: '#ff4444', fontSize: 12, marginBottom: 10 }}>{error}</div>
        )}

        {steps.length > 0 && (
          <>
            {/* Step explanation card */}
            <AnimatePresence mode="wait">
              {currentStep && (
                <motion.div
                  key={stepIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  style={{
                    padding: '12px 16px',
                    background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: 6,
                      background: TOKEN_COLOR[currentStep.action] ?? 'var(--accent)',
                      color: 'var(--bg)',
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                    }}>
                      {currentStep.action.toUpperCase()}
                    </span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--text)',
                    }}>
                      {currentStep.token}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-mid)', fontSize: 13, margin: 0 }}>
                    {currentStep.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stack + Output visualisation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {/* Operator Stack */}
              <div style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '10px 14px',
              }}>
                <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-dim)', marginBottom: 8 }}>
                  OPERATOR STACK
                </div>
                <div style={{ minHeight: 36, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  <AnimatePresence>
                    {currentStep?.stack.length === 0
                      ? <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>empty</span>
                      : currentStep?.stack.map((t, i) => (
                          <TokenChip key={i + '-' + t} tok={t} highlight={i === (currentStep.stack.length - 1)} />
                        ))
                    }
                  </AnimatePresence>
                </div>
              </div>

              {/* Output */}
              <div style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '10px 14px',
              }}>
                <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-dim)', marginBottom: 8 }}>
                  OUTPUT (POSTFIX)
                </div>
                <div style={{ minHeight: 36, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  <AnimatePresence>
                    {currentStep?.output.length === 0
                      ? <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>empty</span>
                      : currentStep?.output.map((t, i) => (
                          <TokenChip key={i + '-' + t} tok={t} highlight={false} />
                        ))
                    }
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Final result banner */}
            <AnimatePresence>
              {finalResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    padding: '10px 16px',
                    background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
                    border: '1px solid var(--accent)',
                    borderRadius: 10,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 16,
                    color: 'var(--accent)',
                    fontWeight: 700,
                    marginBottom: 14,
                    boxShadow: '0 0 20px color-mix(in srgb, var(--accent) 20%, transparent)',
                  }}
                >
                  ✓ Postfix result: {finalResult}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 8 }}>
              <motion.button
                whileTap={{ scale: 0.93 }}
                disabled={stepIdx <= 0}
                onClick={() => { clearTimeout(timerRef.current); setRunning(false); setStepIdx(i => Math.max(0, i - 1)) }}
                style={{
                  padding: '7px 14px', borderRadius: 8,
                  background: 'var(--btn-bg)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontWeight: 700, fontSize: 11,
                  letterSpacing: '0.1em', cursor: stepIdx <= 0 ? 'not-allowed' : 'pointer',
                  opacity: stepIdx <= 0 ? 0.4 : 1,
                }}
              >◀ PREV</motion.button>

              <motion.button
                whileTap={{ scale: 0.93 }}
                disabled={stepIdx >= steps.length - 1}
                onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                style={{
                  padding: '7px 14px', borderRadius: 8,
                  background: 'var(--btn-bg)', border: '1px solid var(--border)',
                  color: 'var(--accent)', fontWeight: 700, fontSize: 11,
                  letterSpacing: '0.1em', cursor: stepIdx >= steps.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: stepIdx >= steps.length - 1 ? 0.4 : 1,
                }}
              >NEXT ▶</motion.button>

              <motion.button
                whileTap={{ scale: 0.93 }}
                disabled={running || stepIdx >= steps.length - 1}
                onClick={handleAutoPlay}
                style={{
                  padding: '7px 14px', borderRadius: 8,
                  background: running ? 'var(--btn-bg)' : 'color-mix(in srgb, var(--accent2) 20%, transparent)',
                  border: '1px solid var(--accent2)',
                  color: 'var(--accent2)', fontWeight: 700, fontSize: 11,
                  letterSpacing: '0.1em', cursor: 'pointer', flex: 1,
                }}
              >
                {running ? '⏸ RUNNING...' : '▶▶ AUTO-PLAY'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={reset}
                style={{
                  padding: '7px 14px', borderRadius: 8,
                  background: 'var(--btn-bg)', border: '1px solid var(--border)',
                  color: 'var(--text-dim)', fontWeight: 700, fontSize: 11,
                  letterSpacing: '0.1em', cursor: 'pointer',
                }}
              >✕ RESET</motion.button>
            </div>

            {/* Step counter */}
            <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-dim)', marginTop: 8, letterSpacing: '0.15em' }}>
              STEP {stepIdx + 1} / {steps.length}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
