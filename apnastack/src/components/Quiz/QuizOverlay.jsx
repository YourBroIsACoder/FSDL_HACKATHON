import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import quizzesData from '../../data/quizzes.json';
import { PALETTE } from '../../config/assets';
import './QuizOverlay.css';

// The 5-set quick popup
function PopupQuiz({ data, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const q = data[currentIdx];

  const handleSelect = (idx) => {
    if (selectedOption !== null) return; // Prevent double click
    setSelectedOption(idx);
    
    setTimeout(() => {
      if (idx === q.correct) setScore(s => s + 1);
      
      if (currentIdx + 1 < data.length) {
        setCurrentIdx(c => c + 1);
        setSelectedOption(null);
      } else {
        setShowScore(true);
      }
    }, 800);
  };

  return (
    <motion.div
      className="quiz-modal popup"
      initial={{ y: 50, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0, scale: 0.95 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="quiz-close" onClick={onClose}>✕</button>
      
      {showScore ? (
        <div className="quiz-score-view">
          <h2>POPUP COMPLETE</h2>
          <div className="score-circle">
            <span>{score}</span> / {data.length}
          </div>
          <p>{score === data.length ? "Flawless! You're ready." : "Good effort! Keep exploring."}</p>
          <button className="quiz-btn" onClick={onClose}>CONTINUE EXPLORING</button>
        </div>
      ) : (
        <div className="quiz-question-view">
          <div className="quiz-header">
            <h3>Quick Check-in</h3>
            <span className="quiz-progress">{currentIdx + 1}/{data.length}</span>
          </div>
          <p className="quiz-q-text">{q.question}</p>
          <div className="quiz-options">
            {q.options.map((opt, i) => {
              let btnClass = "quiz-opt-btn";
              if (selectedOption !== null) {
                if (i === q.correct) btnClass += " correct";
                else if (i === selectedOption) btnClass += " wrong";
              }
              return (
                <button 
                  key={i} 
                  className={btnClass}
                  onClick={() => handleSelect(i)}
                  disabled={selectedOption !== null}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// The 10-set rigorous concept clearing
function ConceptQuiz({ data, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'right' | 'wrong'

  const q = data[currentIdx];

  const handleSelect = (idx) => {
    setSelectedOption(idx);
    if (idx === q.correct) {
      setFeedback('right');
    } else {
      setFeedback('wrong');
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < data.length) {
      setCurrentIdx(c => c + 1);
      setSelectedOption(null);
      setFeedback(null);
    } else {
      // Quiz complete!
      onClose();
    }
  };

  return (
    <motion.div
      className="quiz-modal concept"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="quiz-close" onClick={onClose}>✕</button>
      
      <div className="quiz-header concept-header">
        <h2>CLEAR YOUR CONCEPTS</h2>
        <span className="quiz-progress">{currentIdx + 1}/{data.length}</span>
      </div>

      <div className="concept-layout">
        <div className="concept-q-area">
          <p className="quiz-q-text">{q.question}</p>
          <div className="quiz-options concept-options">
            {q.options.map((opt, i) => {
              let btnClass = "quiz-opt-btn";
              if (selectedOption === i) {
                btnClass += (feedback === 'right' ? ' correct' : ' wrong');
              } else if (feedback !== null && i === q.correct) {
                btnClass += ' correct'; // Reveal correct answer
              }

              return (
                <button 
                  key={i} 
                  className={btnClass}
                  onClick={() => feedback === null && handleSelect(i)}
                  disabled={feedback !== null}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>

        <div className="concept-feedback-area">
          <AnimatePresence>
            {feedback && (
              <motion.div 
                className={`feedback-box ${feedback}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3>{feedback === 'right' ? 'Spot On!' : 'Not Quite.'}</h3>
                <p>{feedback === 'right' ? q.explanationRight : q.explanationWrong}</p>
                
                {feedback === 'wrong' && (
                  <button className="quiz-btn retry" onClick={() => {
                    setSelectedOption(null);
                    setFeedback(null);
                  }}>Try Again</button>
                )}

                {feedback === 'right' && (
                  <button className="quiz-btn next" onClick={handleNext}>
                    {currentIdx + 1 === data.length ? 'FINISH' : 'NEXT QUESTION'}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function QuizSelector({ onClose }) {
  const { startConceptQuiz } = useQuizStore();
  const dsList = [
    { id: 1, name: "THE STACK" },
    { id: 2, name: "THE QUEUE" },
    { id: 3, name: "LINKED LIST" },
    { id: 4, name: "BINARY TREE" },
    { id: 5, name: "THE GRAPH" },
    { id: 6, name: "DYNAMIC PROGRAMMING" },
    { id: 7, name: "BACKTRACKING" },
    { id: 8, name: "DIVIDE & CONQUER" },
    { id: 9, name: "GREEDY" },
    { id: 10, name: "SORTING" },
    { id: 11, name: "RECURSION" }
  ];

  return (
    <motion.div
      className="quiz-modal selector"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      style={{ maxWidth: '800px', width: '90%', padding: '40px' }}
    >
      <button className="quiz-close" onClick={onClose}>✕</button>
      
      <div className="quiz-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', color: '#00ffe0', textShadow: '0 0 20px rgba(0, 255, 224, 0.4)' }}>SELECT A MASTERCLASS</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: '10px' }}>Choose a Data Structure to clear your concepts with a rigorous 10-question evaluation.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        {dsList.map(ds => (
          <button
            key={ds.id}
            onClick={() => startConceptQuiz(ds.id)}
            style={{
              padding: '20px',
              background: 'rgba(0, 255, 224, 0.05)',
              border: '1px solid rgba(0, 255, 224, 0.2)',
              borderRadius: '12px',
              color: 'var(--text)',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
              textAlign: 'center',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 224, 0.15)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 224, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 224, 0.05)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'none';
            }}
          >
            {ds.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function QuizOverlay() {
  const { activeQuizType, activeSceneId, closeQuiz } = useQuizStore();

  if (!activeQuizType) return null;

  if (activeQuizType === 'selector') {
    return (
      <div className="quiz-overlay-backdrop" onClick={closeQuiz}>
        <AnimatePresence mode="wait">
          <QuizSelector key="selector" onClose={closeQuiz} />
        </AnimatePresence>
      </div>
    );
  }

  if (!activeSceneId) return null;

  const topicData = quizzesData[activeSceneId];
  
  if (!topicData) {
    // If we don't have quiz data for this scene yet, just close it.
    console.warn(`No quiz data found for scene ID: ${activeSceneId}`);
    closeQuiz();
    return null;
  }

  const isPopup = activeQuizType === 'popup';
  const data = isPopup ? topicData.popup : topicData.concept;

  if (!data || data.length === 0) {
     closeQuiz();
     return null;
  }

  return (
    <div className="quiz-overlay-backdrop" onClick={closeQuiz}>
      <AnimatePresence mode="wait">
        {isPopup ? (
          <PopupQuiz key="popup" data={data} onClose={closeQuiz} />
        ) : (
          <ConceptQuiz key="concept" data={data} onClose={closeQuiz} />
        )}
      </AnimatePresence>
    </div>
  );
}
