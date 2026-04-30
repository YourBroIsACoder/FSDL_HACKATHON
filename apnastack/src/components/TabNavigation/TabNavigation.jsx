import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/dsStore';
import { useQuizStore } from '../../store/quizStore';
import './TabNavigation.css';

const TABS = [
  { id: 0, label: 'VOID' },
  { id: 1, label: 'STACK' },
  { id: 2, label: 'QUEUE' },
  { id: 3, label: 'LLIST' },
  { id: 4, label: 'TREE' },
  { id: 5, label: 'GRAPH' },
  { id: 6, label: 'DP' },
  { id: 7, label: 'BACKTRACKING' },
  { id: 8, label: 'DIV&CONQ' },
  { id: 9, label: 'GREEDY' },
  { id: 10, label: 'SORTING' },
  { id: 11, label: 'RECURSION' },
];

export default function TabNavigation() {
  const currentScene = useAppStore((s) => s.currentScene);
  const setScene = useAppStore((s) => s.setScene);
  const toggleSandbox = useAppStore((s) => s.toggleSandbox);
  const sandboxVisible = useAppStore((s) => s.sandboxVisible);

  return (
    <nav className="tab-navigation">
      <div className="tab-container">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${currentScene === tab.id ? 'active' : ''}`}
            onClick={() => setScene(tab.id)}
          >
            <span className="tab-label">{tab.label}</span>
            {currentScene === tab.id && <div className="tab-indicator" />}
          </button>
        ))}
        
        <div className="tab-divider" style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 12px', opacity: 0.5 }} />

        <button
          className={`tab-button ${sandboxVisible ? 'active' : ''}`}
          onClick={toggleSandbox}
          style={{ 
            color: sandboxVisible ? 'var(--accent)' : 'var(--text-dim)',
            borderColor: sandboxVisible ? 'var(--accent)' : 'transparent',
          }}
        >
          <span className="tab-label">💻 SANDBOX</span>
        </button>

        {currentScene !== 0 && (
          <button
            className="tab-button"
            onClick={() => useQuizStore.getState().openSelector()}
            style={{ 
              color: '#00ffe0',
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(0, 255, 224, 0.5)'
            }}
          >
            <span className="tab-label">🎓 QUIZZES</span>
          </button>
        )}
      </div>
    </nav>
  );
}
