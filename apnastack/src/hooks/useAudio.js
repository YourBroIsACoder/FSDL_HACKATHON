import { useEffect } from 'react'
import * as Tone from 'tone'
import { useAppStore } from '../store/dsStore'

// ── Synth Library ─────────────────────────────────────────────────────────────
let synthsReady = false
let synths = {}

async function ensureReady() {
  if (synthsReady) return
  await Tone.start()
  synths = {
    push:    new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 4 }).toDestination(),
    pop:     new Tone.MetalSynth({ frequency: 400, envelope: { attack: 0.001, decay: 0.1, release: 0.2 } }).toDestination(),
    enqueue: new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.3 } }).toDestination(),
    dequeue: new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 } }).toDestination(),
    insert:  new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 1 } }).toDestination(),
    delete:  new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0 } }).toDestination(),
    bloom:   new Tone.PolySynth(Tone.Synth).toDestination(),  // for BFS level tones
    space:   new Tone.Reverb({ decay: 5, wet: 0.8 }).toDestination(),
    // Ambient Void Drone
    drone:   new Tone.Oscillator({ type: 'fmtriangle', frequency: 'C2', volume: -15 }),
  }
  
  // Route drone through heavy reverb
  synths.drone.connect(synths.space)
  synths.drone.start()
  synthsReady = true
}

// ── Public API ────────────────────────────────────────────────────────────────
export function useAudio() {
  const audioEnabled = useAppStore((s) => s.audioEnabled)
  const currentScene = useAppStore((s) => s.currentScene)

  useEffect(() => {
    if (!synthsReady) return
    if (audioEnabled) {
      synths.drone.volume.rampTo(-15, 1)
      const freqs = ['C2', 'D2', 'F2', 'G2', 'A2', 'C3']
      synths.drone.frequency.rampTo(freqs[currentScene] || 'C2', 2)
    } else {
      synths.drone.volume.rampTo(-80, 0.5)
    }
  }, [audioEnabled, currentScene])

  async function play(type, note = 'C2') {
    if (!audioEnabled) return
    await ensureReady()
    const now = Tone.now()
    try {
      switch (type) {
        case 'push':    synths.push.triggerAttackRelease('C1', '8n', now); break
        case 'pop':     synths.pop.triggerAttackRelease('16n', now); break
        case 'enqueue': synths.enqueue.triggerAttackRelease('G4', '8n', now); break
        case 'dequeue': synths.dequeue.triggerAttackRelease('E4', '8n', now); break
        case 'insert':  synths.insert.triggerAttackRelease('C3', '4n', now); break
        case 'delete':  synths.delete.triggerAttackRelease('8n', now); break
        case 'bloom':   synths.bloom.triggerAttackRelease([note, 'E5', 'G5'], '4n', now); break
        default: break
      }
    } catch (_) {}
  }

  return { play }
}
