import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/dsStore'

export default function ThemeToggle() {
  const theme       = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const [flash, setFlash]   = useState(false)

  const isDark = theme === 'dark'

  const handleToggle = useCallback(() => {
    setFlash(true)
    setTimeout(() => setFlash(false), 500)
    toggleTheme()
  }, [toggleTheme])

  return (
    <>
      {/* Crazy full-screen flash burst */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            className="theme-flash-overlay"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.7, scale: 3 }}
            exit={{ opacity: 0, scale: 5 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* The pill toggle */}
      <motion.button
        id="theme-toggle-btn"
        className="theme-toggle"
        onClick={handleToggle}
        title={isDark ? 'Switch to Solar Flare mode' : 'Switch to Dark mode'}
        whileHover={{ scale: 1.1, boxShadow: 'var(--glow)' }}
        whileTap={{ scale: 0.92 }}
      >
        {/* Track label glyphs */}
        <span
          style={{
            position: 'absolute',
            left: 6,
            fontSize: 10,
            opacity: isDark ? 0.9 : 0.3,
            userSelect: 'none',
            transition: 'opacity 0.3s',
          }}
        >
          🌑
        </span>
        <span
          style={{
            position: 'absolute',
            right: 6,
            fontSize: 10,
            opacity: isDark ? 0.3 : 0.9,
            userSelect: 'none',
            transition: 'opacity 0.3s',
          }}
        >
          ☀️
        </span>

        {/* Sliding thumb */}
        <motion.div
          className="theme-toggle-thumb"
          layout
          animate={{ x: isDark ? 0 : 26 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <motion.span
            key={theme}
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 180, scale: 0 }}
            transition={{ duration: 0.3 }}
            style={{ fontSize: 11 }}
          >
            {isDark ? '🌙' : '🔥'}
          </motion.span>
        </motion.div>
      </motion.button>
    </>
  )
}
