import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/dsStore';
import { THEORY_DATA } from '../../config/theoryData';
import { PALETTE } from '../../config/assets';

export default function TheoryPanel() {
  const currentScene = useAppStore((s) => s.currentScene);
  const [studyMode, setStudyMode] = useState('quick'); // 'quick' or 'deep'
  const [isOpen, setIsOpen] = useState(true);

  if (currentScene === 0) return null;

  const data = THEORY_DATA[currentScene];
  if (!data) return null;

  return (
      <motion.div
        initial={{ x: -400, opacity: 0 }}
        animate={{ x: isOpen ? 0 : 'calc(-100% + 48px)', opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          position: 'fixed',
          left: '20px',
          top: '100px',
          width: '350px',
          maxHeight: 'calc(100vh - 280px)',
          zIndex: 50,
          background: 'rgba(10,10,15,0.95)',
          border: `1px solid ${PALETTE.plasmaTeal}44`,
          borderRadius: '16px',
          boxShadow: `0 8px 32px rgba(0,0,0,0.8)`,
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header & Toggle */}
        <div style={{
          padding: '16px 14px 16px 20px',
          borderBottom: `1px solid ${PALETTE.plasmaTeal}33`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0, 255, 224, 0.1)'
        }}>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '18px',
            color: PALETTE.ghostWhite,
            letterSpacing: '0.05em',
            textShadow: '0 2px 8px rgba(0,0,0,0.9)'
          }}>
            {data.name}
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: PALETTE.plasmaTeal,
              cursor: 'pointer',
              fontSize: '16px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 255, 224, 0.1)',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 255, 224, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 255, 224, 0.1)'}
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>

        <div style={{
          padding: '12px 20px',
          display: 'flex',
          gap: '8px',
          borderBottom: `1px solid ${PALETTE.plasmaTeal}22`
        }}>
          <button
            onClick={() => setStudyMode('quick')}
            style={{
              flex: 1,
              padding: '6px 0',
              background: studyMode === 'quick' ? `${PALETTE.plasmaTeal}22` : 'transparent',
              border: `1px solid ${studyMode === 'quick' ? PALETTE.plasmaTeal : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '6px',
              color: studyMode === 'quick' ? PALETTE.plasmaTeal : '#888',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ⚡ Quick Review
          </button>
          <button
            onClick={() => setStudyMode('deep')}
            style={{
              flex: 1,
              padding: '6px 0',
              background: studyMode === 'deep' ? `${PALETTE.moltenOrange}22` : 'transparent',
              border: `1px solid ${studyMode === 'deep' ? PALETTE.moltenOrange : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '6px',
              color: studyMode === 'deep' ? PALETTE.moltenOrange : '#888',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🐢 Deep Dive
          </button>
        </div>

        {/* Content Area */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          flex: 1,
          fontFamily: 'Syne, sans-serif',
          fontSize: '14px',
          lineHeight: '1.6',
          color: 'rgba(240, 255, 254, 0.8)'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={studyMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {studyMode === 'quick' ? (
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ color: PALETTE.plasmaTeal, fontWeight: 700, marginRight: '8px' }}>TL;DR:</span>
                  {data.quick}
                </div>
              ) : (
                <div style={{ marginBottom: '20px', fontSize: '13px', textAlign: 'justify' }}>
                  <span style={{ color: PALETTE.moltenOrange, fontWeight: 700, display: 'block', marginBottom: '8px' }}>IN-DEPTH:</span>
                  {data.deep}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Complexity Section */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px'
          }}>
            <div style={{ color: '#aaa', marginBottom: '10px', fontSize: '10px', letterSpacing: '0.1em' }}>COMPLEXITY (TIME / SPACE)</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
              <div><span style={{ color: '#666' }}>Best:</span> <span style={{ color: PALETTE.plasmaTeal }}>{data.complexities?.bestTime}</span></div>
              <div><span style={{ color: '#666' }}>Avg:</span> <span style={{ color: '#00ff44' }}>{data.complexities?.avgTime}</span></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><span style={{ color: '#666' }}>Worst:</span> <span style={{ color: '#ff3366' }}>{data.complexities?.worstTime}</span></div>
              <div><span style={{ color: '#666' }}>Space:</span> <span style={{ color: PALETTE.moltenOrange }}>{data.complexities?.space}</span></div>
            </div>
          </div>

        {/* Use Cases */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ color: '#aaa', marginBottom: '10px', fontSize: '10px', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>USE CASES</div>
          <ul style={{ paddingLeft: '16px', margin: 0, color: 'rgba(240, 255, 254, 0.7)', fontSize: '13px' }}>
            {data.useCases.map((uc, i) => (
              <li key={i} style={{ marginBottom: '6px' }}>{uc}</li>
            ))}
          </ul>
        </div>

      </div>
    </motion.div>
  );
}
