import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/dsStore'

const SCENE_COUNT = 6

export function useSceneScroll() {
  const setScene = useAppStore((s) => s.setScene)
  const currentScene = useAppStore((s) => s.currentScene)
  const [progress, setProgress] = useState(0)
  const [velocity, setVelocity] = useState(0)

  useEffect(() => {
    let lenis
    ;(async () => {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      lenis.on('scroll', (e) => {
        const p = e.progress
        const sceneIdx = Math.min(SCENE_COUNT - 1, Math.floor(p * SCENE_COUNT))
        setScene(sceneIdx)
        setProgress(p)
        setVelocity(e.velocity || 0)
      })
      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    })()
    return () => lenis?.destroy()
  }, [setScene])

  return { currentScene, progress }
}
