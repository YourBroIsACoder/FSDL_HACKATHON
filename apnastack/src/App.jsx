import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'

import CustomCursor from './components/CustomCursor/CustomCursor'
import ControlPanel from './components/ControlPanel/ControlPanel'
import CodePanel from './components/CodePanel/CodePanel'
import SceneManager from './components/SceneManager'

import { useSceneScroll } from './hooks/useSceneScroll'
import { useAppStore } from './store/dsStore'
import { useAudio } from './hooks/useAudio'

// Separate Rig for Camera and Effects
function CameraRig({ velocity }) {
  const { camera, size } = useThree()
  
  useEffect(() => {
    const aspect = size.width / size.height
    camera.fov = aspect < 1 ? 70 : 45
    camera.updateProjectionMatrix()
  }, [size, camera])

  return null
}

function PostProcessing({ velocity }) {
  const absV = Math.abs(velocity)
  const offset = Math.min(absV * 0.005, 0.04)
  
  return (
    <EffectComposer disableNormalPass>
      <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.2} />
      <ChromaticAberration offset={[offset, offset]} />
    </EffectComposer>
  )
}

export default function App() {
  // Drives the overall page scroll and maps it to a zustand `currentScene` index
  const { progress, velocity } = useSceneScroll()
  
  // Audio synths
  const { play } = useAudio()

  // Zustand State
  const currentScene = useAppStore(s => s.currentScene)
  const lastOp = useAppStore(s => s.lastOp)
  const logOp = useAppStore(s => s.logOp)

  // Zustand Action Binders
  const stackPush = useAppStore(s => s.stackPush)
  const stackPop = useAppStore(s => s.stackPop)
  const queueEnqueue = useAppStore(s => s.queueEnqueue)
  const queueDequeue = useAppStore(s => s.queueDequeue)
  const llInsert = useAppStore(s => s.llInsert)
  const llDelete = useAppStore(s => s.llDelete)
  const treeInsert = useAppStore(s => s.treeInsert)
  const linkedList = useAppStore(s => s.linkedList)
  const graphAddNode = useAppStore(s => s.graphAddNode)
  const graphAddEdge = useAppStore(s => s.graphAddEdge)
  const graphNodes = useAppStore(s => s.graphNodes)

  const speed = useAppStore(s => s.speed)
  const setActiveLine = useAppStore(s => s.setActiveLine)

  // Handlers
  const handleOperation = async (opId, value) => {
    logOp(opId, value)
    play(opId)
    
    const valObj = value || Math.floor(Math.random() * 100)

    // Code Line Sequencer
    const sequenceLines = async (count) => {
      for (let i = 0; i < count; i++) {
        setActiveLine(i)
        await new Promise(r => setTimeout(r, 400 / speed))
      }
      setActiveLine(-1)
    }

    // Determine lines length safely (these numbers match PSEUDOCODE length in CodePanel)
    let lines = 3
    if (opId === 'push') lines = 4
    if (opId === 'pop') lines = 5
    if (opId === 'dequeue') lines = 5
    if (opId === 'bfs' || opId === 'dfs') lines = 6

    await sequenceLines(lines)

    // Map UI actions to Zustand store mutations
    switch (opId) {
      case 'push': stackPush(valObj); break;
      case 'pop': stackPop(); break;
      case 'enqueue': queueEnqueue(valObj); break;
      case 'dequeue': queueDequeue(); break;
      case 'addNode': graphAddNode(valObj); break;
      case 'addEdge': 
        if (graphNodes.length > 1) {
            // randomly connect last node to a previous node
            const src = graphNodes[graphNodes.length - 1].id
            const tgt = graphNodes[Math.floor(Math.random() * (graphNodes.length - 1))].id
            graphAddEdge(src, tgt)
        }
        break;
      case 'insert': 
        if (currentScene === 3) llInsert(valObj, linkedList.length); // Linked List
        if (currentScene === 4) treeInsert(valObj); // Tree
        break;
      case 'delete':
        if (currentScene === 3 && linkedList.length > 0) llDelete(linkedList[linkedList.length - 1].id);
        break;
      case 'bfs':
        // A full visual BFS would queue state highlights over time.
        // For now, we trigger the Tone.js bloom sound effect.
        play('bloom')
        break;
      default: break;
    }
  }

  const activeLine = useAppStore(s => s.activeLine)

  return (
    <>
      <CustomCursor />
      
      {/* 600vh div to give Lenis something to actually scroll */}
      <div className="scroll-track" />

      {/* R3F Canvas Container */}
      <div className="canvas-container interactive-canvas">
        <Canvas camera={{ position: [0, 5, 20], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={['#0a0a0f']} />
          <ambientLight intensity={0.5} />
          
          <Suspense fallback={null}>
            <SceneManager sceneIndex={currentScene} />
            <Preload all />
          </Suspense>

          <CameraRig velocity={velocity} />
          <PostProcessing velocity={velocity} />
        </Canvas>
      </div>

      {/* UI Overlays */}
      <ControlPanel onOperation={handleOperation} />
      <CodePanel activeOp={lastOp?.type} activeLine={activeLine} />

      {/* Progress Bar mapped to overall scroll progress */}
      <div 
        style={{
          position: 'fixed', right: 0, top: 0, height: `${progress * 100}%`,
          width: '3px', background: '#00ffe0', boxShadow: '0 0 10px #00ffe0',
          zIndex: 100
        }} 
      />
    </>
  )
}
