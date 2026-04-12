import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './CustomCursor.css'

export default function CustomCursor() {
  const dotRef   = useRef(null)
  const trailRef = useRef(null)
  const particles = useRef([])

  useEffect(() => {
    document.body.style.cursor = 'none'
    let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Spawn particle
      const p = {
        x: mouseX, y: mouseY,
        life: 1.0,
        size: Math.random() * 6 + 2,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        el: document.createElement('div'),
      }
      p.el.className = 'cursor-particle'
      document.body.appendChild(p.el)
      particles.current.push(p)
    }
    window.addEventListener('mousemove', onMove)

    let rafId
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`
      }
      // Lerp trail
      trailX += (mouseX - trailX) * 0.12
      trailY += (mouseY - trailY) * 0.12
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailX - 16}px, ${trailY - 16}px)`
      }
      // Update particles
      particles.current = particles.current.filter((p) => {
        p.life -= 0.045
        p.x += p.vx
        p.y += p.vy
        p.el.style.opacity = p.life
        p.el.style.width   = `${p.size * p.life}px`
        p.el.style.height  = `${p.size * p.life}px`
        p.el.style.left    = `${p.x}px`
        p.el.style.top     = `${p.y}px`
        if (p.life <= 0) { p.el.remove(); return false }
        return true
      })
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <>
      <div ref={dotRef}   className="cursor-dot"   />
      <div ref={trailRef} className="cursor-trail" />
    </>
  )
}
