import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/dsStore'
import { QUIZ_DATA } from '../../config/quizzes'

export default function QuizPanel() {
  const visible = useAppStore(s => s.quizVisible)
  const closeQuiz = useAppStore(s => s.closeQuiz)
  const scene = useAppStore(s => s.currentScene)
  
  const [qIdx, setQIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selected, setSelected] = useState(null)

  const quiz = QUIZ_DATA[scene]
  if (!quiz || !visible) return null

  const currentQ = quiz.questions[qIdx]

  const handleSelect = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    if (idx === currentQ.correct) {
      setScore(s => s + 1)
    }
    
    setTimeout(() => {
      if (qIdx < quiz.questions.length - 1) {
        setQIdx(i => i + 1)
        setSelected(null)
      } else {
        setShowResult(true)
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setQIdx(0); setScore(0); setShowResult(false); setSelected(null); closeQuiz()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md bg-var(--bg-panel-solid) border border-var(--border-strong) rounded-3xl p-8 shadow-2xl"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          style={{ background: 'var(--bg-panel-solid)', border: '1px solid var(--border-strong)' }}
        >
          {!showResult ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] tracking-[0.2em] text-var(--accent) font-bold uppercase">Concept Quiz</span>
                <span className="text-[10px] text-var(--text-dim) font-bold">Question {qIdx + 1}/{quiz.questions.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-var(--text) mb-8 font-['Syne'] leading-tight">
                {currentQ.q}
              </h3>
              
              <div className="space-y-3">
                {currentQ.options.map((opt, i) => {
                  let status = 'idle'
                  if (selected !== null) {
                    if (i === currentQ.correct) status = 'correct'
                    else if (i === selected) status = 'wrong'
                  }
                  
                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className="w-full text-left p-4 rounded-xl border font-medium transition-all"
                      style={{
                        background: status === 'correct' ? '#00ff8822' : status === 'wrong' ? '#ff444422' : 'var(--btn-bg)',
                        borderColor: status === 'correct' ? '#00ff88' : status === 'wrong' ? '#ff4444' : 'var(--border)',
                        color: status === 'correct' ? '#00ff88' : status === 'wrong' ? '#ff4444' : 'var(--text)'
                      }}
                      whileHover={{ x: status === 'idle' ? 5 : 0 }}
                    >
                      {opt}
                    </motion.button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-black text-var(--text) mb-2 font-['Syne']">Quiz Complete!</h2>
              <p className="text-var(--text-dim) mb-8">You scored {score} out of {quiz.questions.length}</p>
              <button
                onClick={resetQuiz}
                className="px-8 py-3 bg-var(--accent) text-var(--bg) rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                style={{ background: 'var(--accent)', color: 'var(--bg)' }}
              >
                Continue Learning
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
