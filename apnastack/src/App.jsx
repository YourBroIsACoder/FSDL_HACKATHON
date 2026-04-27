import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from '@react-three/postprocessing'

import CustomCursor from './components/CustomCursor/CustomCursor'
import ControlPanel from './components/ControlPanel/ControlPanel'
import CodePanel from './components/CodePanel/CodePanel'
import TabNavigation from './components/TabNavigation/TabNavigation'
import TheoryPanel from './components/TheoryPanel/TheoryPanel'
import HelpGuide from './components/HelpGuide/HelpGuide'
import SceneManager from './components/SceneManager'
import LandingOverlay from './components/LandingOverlay'
import IntroOverlay from './components/IntroOverlay'
import AmbientParticles from './components/AmbientParticles'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import InfixPanel from './components/InfixPanel/InfixPanel'
import ParenthesesPanel from './components/ParenthesesPanel/ParenthesesPanel'
import QuizPanel from './components/QuizPanel/QuizPanel'
import CodeSandboxPanel from './components/CodeSandboxPanel/CodeSandboxPanel'

import { useAppStore } from './store/dsStore'
import { useAudio } from './hooks/useAudio'

// Handles camera responsiveness
function CameraRig() {
  const { camera, size } = useThree()
  
  useEffect(() => {
    const aspect = size.width / size.height
    camera.fov = aspect < 1 ? 70 : 45
    camera.updateProjectionMatrix()
  }, [size, camera])

  return null
}

function PostProcessing() {
  return (
    <EffectComposer disableNormalPass>
      {/* Reduced DOF blur to maintain text clarity on components */}
      <DepthOfField focusDistance={0} focalLength={0.01} bokehScale={1.2} />
      <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.2} />
      <ChromaticAberration offset={[0.001, 0.001]} />
    </EffectComposer>
  )
}

export default function App() {
  // Audio synths
  const { play } = useAudio()
  const [showInfix, setShowInfix] = useState(false)

  // Zustand State
  const currentScene = useAppStore(s => s.currentScene)
  const theme = useAppStore(s => s.theme)
  const hasSeenIntro = useAppStore(s => s.hasSeenIntro)
  const lastOp = useAppStore(s => s.lastOp)
  const logOp = useAppStore(s => s.logOp)

  // Zustand Action Binders
  const stackPush = useAppStore(s => s.stackPush)
  const stackPop = useAppStore(s => s.stackPop)
  const queueEnqueue = useAppStore(s => s.queueEnqueue)
  const queueDequeue = useAppStore(s => s.queueDequeue)
  const llInsert = useAppStore(s => s.llInsert)
  const llDelete = useAppStore(s => s.llDelete)
  const llReverse = useAppStore(s => s.llReverse)
  const llSetHighlight = useAppStore(s => s.llSetHighlight)
  const treeInsert = useAppStore(s => s.treeInsert)
  const linkedList = useAppStore(s => s.linkedList)
  const tree = useAppStore(s => s.tree)
  const graphAddNode = useAppStore(s => s.graphAddNode)
  const graphAddEdge = useAppStore(s => s.graphAddEdge)
  const graphNodes = useAppStore(s => s.graphNodes)
  const queue = useAppStore(s => s.queue)

  const dpFillCell = useAppStore(s => s.dpFillCell)
  const dpSetHighlights = useAppStore(s => s.dpSetHighlights)
  const dpSetMatrix = useAppStore(s => s.dpSetMatrix)

  const btSetState = useAppStore(s => s.btSetState)

  const dcBoxes = useAppStore(s => s.dcBoxes)
  const dcSetBoxes = useAppStore(s => s.dcSetBoxes)

  const greedySetState = useAppStore(s => s.greedySetState)

  const recursionSetFrames = useAppStore(s => s.recursionSetFrames)

  const sortArray = useAppStore(s => s.sortArray)
  const sortSetArray = useAppStore(s => s.sortSetArray)
  const sortSetHighlights = useAppStore(s => s.sortSetHighlights)

  const sortIncComparisons = useAppStore(s => s.sortIncComparisons)
  const sortIncSwaps       = useAppStore(s => s.sortIncSwaps)
  const sortResetStats     = useAppStore(s => s.sortResetStats)
  const openQuiz      = useAppStore(s => s.openQuiz)
  const speed = useAppStore(s => s.speed)
  const setActiveLine = useAppStore(s => s.setActiveLine)
  const activeLine = useAppStore(s => s.activeLine)

  const setTraversalOrder = useAppStore(s => s.setTraversalOrder)
  const setTraversalHighlights = useAppStore(s => s.setTraversalHighlights)

  const showParentheses = useAppStore(s => s.showParentheses)
  const toggleParentheses = useAppStore(s => s.toggleParentheses)

  // Animation Concurrency Lock
  const activeAnimId = useRef(0)

  // Handlers
  const handleOperation = async (opId, value) => {
    logOp(opId, value)
    play(opId)
    
    const valObj = value || Math.floor(Math.random() * 100)
    
    const animId = Date.now()
    activeAnimId.current = animId
    const checkCancel = () => { if (activeAnimId.current !== animId) throw new Error('CANCELLED') }
    const delay = async (ms) => { 
      const state = useAppStore.getState();
      if (state.isStepMode) {
        const currentTrigger = state.stepTrigger;
        await new Promise(resolve => {
          const unsub = useAppStore.subscribe(s => {
            if (s.stepTrigger !== currentTrigger || !s.isStepMode) {
              unsub();
              resolve();
            }
          });
        });
      } else {
        await new Promise(r => setTimeout(r, ms)); 
      }
      checkCancel();
    }

    // Code Line Sequencer
    const sequenceLines = async (count) => {
      try {
        for (let i = 0; i < count; i++) {
          setActiveLine(i)
          await delay(400 / speed)
        }
        setActiveLine(-1)
      } catch(e) {}
    }

    // Determine lines length safely
    let lines = 3;
    if (opId === 'push') lines = 4;
    if (opId === 'pop') lines = 5;
    if (opId === 'dequeue') lines = 5;
    if (opId === 'bfs' || opId === 'dfs') lines = 6;
    if (['greedyRun', 'recRun', 'btRun', 'dpRun'].includes(opId)) lines = 5;

    const isHeavyAlgo = ['greedyRun', 'recRun', 'btRun', 'dpRun'].includes(opId);
    if (isHeavyAlgo) {
        await sequenceLines(lines); // wait for heavy ones now to trigger quiz after
        openQuiz();
    } else {
        await sequenceLines(lines);
    }

    // Map UI actions to Zustand store mutations
    switch (opId) {
      case 'infixDemo': setShowInfix(v => !v); break;
      case 'balancedParens': toggleParentheses(); break;
      case 'push': stackPush(valObj); break;
      case 'pop': stackPop(); break;
      case 'enqueue': queueEnqueue(valObj); break;
      case 'dequeue': queueDequeue(); break;
      case 'addNode': graphAddNode(valObj || `N${graphNodes.length}`); break;
      case 'addEdge': 
        if (graphNodes.length > 1) {
            let srcId, tgtId;
            if (value && typeof value === 'string') {
                let parsed = [];
                if (value.includes(',')) parsed = value.split(',');
                else if (value.includes('-')) parsed = value.split('-');
                
                if (parsed.length === 2) {
                    const [srcLabel, tgtLabel] = parsed.map(s => s.trim());
                    const srcNode = graphNodes.find(n => String(n.label) === srcLabel || String(n.label).endsWith(srcLabel));
                    const tgtNode = graphNodes.find(n => String(n.label) === tgtLabel || String(n.label).endsWith(tgtLabel));
                    if (srcNode && tgtNode) {
                        srcId = srcNode.id;
                        tgtId = tgtNode.id;
                    }
                }
            }
            
            if (!srcId || !tgtId) {
                // Random fallback
                srcId = graphNodes[graphNodes.length - 1].id;
                tgtId = graphNodes[Math.floor(Math.random() * (graphNodes.length - 1))].id;
            }
            graphAddEdge(srcId, tgtId);
        }
        break;
      case 'insert': 
        if (currentScene === 3) {
            let parts = value.split(',').map(s => s.trim());
            let v = parts[0] || Math.floor(Math.random() * 100).toString();
            let idx = parts.length > 1 ? parseInt(parts[1]) : linkedList.length;
            const finalIdx = isNaN(idx) ? linkedList.length : idx;
            
            const runLLInsert = async () => {
                try {
                    // Traverse to index
                    const traverseLimit = Math.min(finalIdx, linkedList.length);
                    for(let i = 0; i < traverseLimit; i++) {
                        llSetHighlight(linkedList[i].id);
                        await delay(600 / speed);
                    }
                    llInsert(v, finalIdx);
                    llSetHighlight(null);
                } catch(e) {}
            };
            runLLInsert();
        }
        if (currentScene === 4) treeInsert(valObj);
        break;
      case 'delete':
        if (currentScene === 3 && linkedList.length > 0) {
            const inputVal = value.trim();
            let idx = -1;
            if (inputVal !== '') {
                const parsedIdx = parseInt(inputVal);
                if (!isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < linkedList.length) idx = parsedIdx;
                else idx = linkedList.findIndex(n => n.val.toString() === inputVal);
            }
            if (idx === -1) idx = linkedList.length - 1;

            const runLLDelete = async () => {
                try {
                    // Traverse animation
                    for(let i = 0; i <= idx; i++) {
                        llSetHighlight(linkedList[i].id);
                        await delay(600 / speed);
                    }
                    llDelete(linkedList[idx].id);
                    llSetHighlight(null);
                    openQuiz();
                } catch(e) {}
            };
            runLLDelete();
        }
        break;
      case 'reverse':
        if (currentScene === 3) {
            const runLLReverse = async () => {
                try {
                    // Visual step-by-step reverse
                    for(let i = 0; i < linkedList.length; i++) {
                        llSetHighlight(linkedList[i].id);
                        await delay(500 / speed);
                    }
                    llReverse();
                    llSetHighlight(null);
                    openQuiz();
                } catch(e) {}
            };
            runLLReverse();
        }
        break;
      case 'scheduler':
        if (currentScene === 2) {
            const runScheduler = async () => {
                try {
                    const tasks = ['P1 (4s)', 'P2 (2s)', 'P3 (6s)'];
                    for (const t of tasks) {
                        queueEnqueue(t);
                        await delay(800 / speed);
                    }
                    
                    // Process one by one (simplified)
                    for (let i = 0; i < 5; i++) {
                        if (queue.length === 0) break;
                        play('pop');
                        const active = queueDequeue();
                        await delay(1200 / speed);
                        // If it's a long task, put it back
                        if (active.includes('P1') || active.includes('P3')) {
                            queueEnqueue(active.replace(/\d+s/, (m) => (parseInt(m)-2)+'s'));
                            await delay(800 / speed);
                        }
                    }
                    openQuiz();
                } catch(e) {}
            };
            runScheduler();
        }
        break;
      case 'bfs':
        play('bloom')
        break;
      case 'inorder':
      case 'preorder':
      case 'postorder':
        if (currentScene === 4 && tree) {
            const runTraversal = async () => {
                try {
                    const order = [];
                    setTraversalOrder([]);
                    
                    const traverse = async (node) => {
                        if (!node) return;
                        
                        if (opId === 'preorder') {
                            order.push(node.val);
                            setTraversalOrder([...order]);
                            setTraversalHighlights([node.id]);
                            await delay(800 / speed);
                        }
                        
                        await traverse(node.left);
                        
                        if (opId === 'inorder') {
                            order.push(node.val);
                            setTraversalOrder([...order]);
                            setTraversalHighlights([node.id]);
                            await delay(800 / speed);
                        }
                        
                        await traverse(node.right);
                        
                        if (opId === 'postorder') {
                            order.push(node.val);
                            setTraversalOrder([...order]);
                            setTraversalHighlights([node.id]);
                            await delay(800 / speed);
                        }
                    };
                    
                    await traverse(tree);
                    setTraversalHighlights([]);
                    openQuiz();
                } catch(e) {}
            };
            runTraversal();
        }
        break;
      case 'dpRun':
        const gridSize = parseInt(value) || 4; 
        const G = Math.min(Math.max(gridSize, 2), 6); // bounded for visuals
        
        const runGridTraveler = async () => {
             try {
                 let matrix = Array(G).fill(null).map(() => Array(G).fill(null));
                 dpSetMatrix(matrix);
                 const dSpeed = 1000 / speed;
                 
                 for(let r = 0; r < G; r++) {
                     for(let c = 0; c < G; c++) {
                         let val = 1;
                         let highlights = [];
                         if (r > 0 || c > 0) {
                             val = 0;
                             if (r > 0) { val += matrix[r-1][c]; highlights.push({ r: r-1, c }); }
                             if (c > 0) { val += matrix[r][c-1]; highlights.push({ r, c: c-1 }); }
                         }
                         
                         dpSetHighlights(highlights);
                         await delay(dSpeed * 0.4);
                         
                         dpFillCell(r, c, val);
                         matrix[r][c] = val; 
                         play('push');
                         
                         dpSetHighlights([]);
                         await delay(dSpeed * 0.4);
                     }
                 }
                 play('bloom');
             } catch(e) {}
        }
        runGridTraveler()
        break;
      case 'dpReset':
        dpSetMatrix([])
        break;
      case 'btReset':
        btSetState(4, [-1,-1,-1,-1], null);
        break;
      case 'btRun':
        const nSize = parseInt(value) || 4; 
        const N = Math.min(Math.max(nSize, 4), 8); // bound 4-8 for visual clarity
        const btSpeedScale = 1000 / speed;
        
        const runQueens = async () => {
            try {
                let board = Array(N).fill(-1);
                btSetState(N, [...board], null);
                
                const isSafe = async (row, col) => {
                    btSetState(N, [...board], { r: row, c: col, status: 'checking' });
                    play('push');
                    await delay(btSpeedScale * 0.2);
                    
                    for (let i = 0; i < row; i++) {
                        if (board[i] === col || Math.abs(board[i] - col) === Math.abs(i - row)) {
                            btSetState(N, [...board], { r: row, c: col, status: 'clash' });
                            play('pop');
                            await delay(btSpeedScale * 0.3);
                            return false;
                        }
                    }
                    btSetState(N, [...board], { r: row, c: col, status: 'placed' });
                    await delay(btSpeedScale * 0.15);
                    return true;
                };
                
                const solve = async (row) => {
                    if (row === N) return true;
                    for (let col = 0; col < N; col++) {
                        if (await isSafe(row, col)) {
                            board[row] = col;
                            btSetState(N, [...board], null);
                            if (await solve(row + 1)) return true;
                            
                            // backtrack
                            btSetState(N, [...board], { r: row, c: col, status: 'clash' });
                            play('pop');
                            await delay(btSpeedScale * 0.3);
                            board[row] = -1;
                            btSetState(N, [...board], null);
                        }
                    }
                    return false;
                };
                
                if (await solve(0)) {
                    play('bloom');
                }
            } catch(e) {}
        }
        runQueens();
        break;
      case 'dcReset': {
        const dcInput = value && value.trim();
        const dcUserArr = dcInput
          ? dcInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
          : [8, 3, 5, 4, 7, 1, 2, 6];
        const dcArr = dcUserArr.length >= 2 ? dcUserArr : [8, 3, 5, 4, 7, 1, 2, 6];
        dcSetBoxes([{ id: 'root', level: 0, xOffset: 0, width: dcArr.length, arr: dcArr }]);
        break;
      }
      case 'dcRun':
        // Divide logic: find all boxes that have width > 1 and split them in half
        const currentBoxes = dcBoxes.length > 0 ? [...dcBoxes] : [{ id: 'root', level: 0, xOffset: 0, width: 8, arr: [8,3,5,4,7,1,2,6] }];
        if (dcBoxes.length === 0) {
            dcSetBoxes(currentBoxes);
            break;
        }
        
        let didSplit = false;
        const nextBoxes = [];
        for (let b of currentBoxes) {
            if (b.width > 1) {
                didSplit = true;
                const mid = Math.floor(b.width / 2);
                const leftId = b.id + '-L';
                const rightId = b.id + '-R';
                const leftWidth = mid;
                const rightWidth = b.width - mid;
                
                // For layout:
                // Left offset moves left by (rightWidth)/2
                // Right offset moves right by (leftWidth)/2
                // Level goes down (+1)
                
                nextBoxes.push({
                   id: leftId,
                   level: b.level + 1,
                   xOffset: b.xOffset - (rightWidth * 0.5) - 0.2, // extra 0.2 for gap
                   width: leftWidth,
                   arr: b.arr.slice(0, mid)
                });
                
                nextBoxes.push({
                   id: rightId,
                   level: b.level + 1,
                   xOffset: b.xOffset + (leftWidth * 0.5) + 0.2,
                   width: rightWidth,
                   arr: b.arr.slice(mid)
                });
            } else {
                nextBoxes.push(b);
            }
        }
        
        if (didSplit) {
            play('push')
            dcSetBoxes(nextBoxes);
        } else {
            play('pop') // Already max divided
        }
        break;
      case 'greedyReset':
        greedySetState(0, []);
        break;
      case 'greedyRun':
        const target = parseInt(value) || 87; // User input flexibility, default 87
        if (target <= 0) break;
        
        const runCoinChange = async () => {
            try {
                greedySetState(target, []);
                let remaining = target;
                const denoms = [25, 10, 5, 1];
                let currentCoins = [];
                
                // Pause before start
                await delay(1000 / speed);
                
                for (let i = 0; i < denoms.length; i++) {
                    const coin = denoms[i];
                    while (remaining >= coin) {
                        remaining -= coin;
                        currentCoins.push(coin);
                        greedySetState(target, [...currentCoins]);
                        play('push');
                        await delay(800 / speed);
                    }
                    if (remaining === 0) break;
                }
                play('bloom');
            } catch(e) {}
        };
        runCoinChange();
        break;
      case 'sortReset': {
        // If user typed a comma-separated list, use it; else default
        const rInput = value && value.trim();
        const rArr = rInput
          ? rInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
          : [8, 3, 5, 4, 7, 1, 2, 6];
        const finalRArr = rArr.length >= 2 ? rArr : [8, 3, 5, 4, 7, 1, 2, 6];
        sortSetArray(finalRArr);
        sortSetHighlights([]);
        sortResetStats();
        break;
      }
      case 'sortBubble': {
        // Parse user input array or use current
        const bInput = value && value.trim();
        const bUserArr = bInput
          ? bInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
          : null;
        if (bUserArr && bUserArr.length >= 2) sortSetArray(bUserArr);
        sortResetStats();
        const bubbleSpeed = 1000 / speed;
        const bubbleSort = async () => {
           try {
               let arr = bUserArr && bUserArr.length >= 2 ? [...bUserArr] : [...sortArray];
               for (let i = 0; i < arr.length; i++) {
                  for (let j = 0; j < arr.length - i - 1; j++) {
                     sortIncComparisons();
                     sortSetHighlights([j, j+1]);
                     await delay(bubbleSpeed * 0.3);
                     if (arr[j] > arr[j+1]) {
                         play('pop');
                         let temp = arr[j];
                         arr[j] = arr[j+1];
                         arr[j+1] = temp;
                         sortIncSwaps();
                         sortSetArray([...arr]);
                         await delay(bubbleSpeed * 0.5);
                     }
                  }
               }
               sortSetHighlights([]);
               play('bloom');
           } catch(e) {}
        }
        bubbleSort()
        break;
      }
      case 'sortQuick':
        sortResetStats();
        const qSpeed = 1000 / speed;
        const quick = async (arr, low, high) => {
            if (low < high) {
                let p = await partition(arr, low, high);
                await quick(arr, low, p - 1);
                await quick(arr, p + 1, high);
            }
        };
        const partition = async (arr, low, high) => {
            let pivot = arr[high];
            let i = low - 1;
            for (let j = low; j < high; j++) {
                sortIncComparisons();
                sortSetHighlights([j, high, i]);
                await delay(qSpeed * 0.3);
                if (arr[j] < pivot) {
                    i++;
                    play('pop');
                    let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                    sortIncSwaps();
                    sortSetArray([...arr]);
                    await delay(qSpeed * 0.5);
                }
            }
            let temp2 = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp2;
            sortIncSwaps();
            sortSetArray([...arr]);
            play('push');
            await delay(qSpeed * 0.5);
            return i + 1;
        };
        const runQuick = async () => {
            try {
                let arr = [...sortArray];
                await quick(arr, 0, arr.length - 1);
                sortSetHighlights([]);
                play('bloom');
                openQuiz();
            } catch (e) {}
        }
        runQuick();
        break;
      case 'recReset':
        recursionSetFrames([]);
        break;
      case 'recRun':
        const startVal = parseInt(value) || 5; 
        const n = Math.min(startVal, 10); // Limit deep recursion
        
        const runFactorial = async () => {
            try {
                let frames = [];
                const rSpeed = 1000 / speed;
                
                // Dive Phase
                for (let i = n; i >= 1; i--) {
                    frames.push({ arg: i, phase: 'calling' });
                    recursionSetFrames([...frames]);
                    play('push');
                    await delay(rSpeed * 0.6);
                }
                
                // Base Case
                frames[frames.length - 1].phase = 'base';
                recursionSetFrames([...frames]);
                play('bloom');
                await delay(rSpeed);
                
                // Returning Phase
                let result = 1;
                for (let i = frames.length - 1; i >= 0; i--) {
                   result = result * frames[i].arg;
                   frames[i].phase = 'returning';
                   frames[i].result = result;
                   recursionSetFrames([...frames]);
                   play('pop');
                   await delay(rSpeed * 0.7);
                   if (i > 0) {
                      frames.pop();
                      recursionSetFrames([...frames]);
                   }
                }
            } catch(e) {}
        }
        runFactorial();
        break;
      default: break;
    }
  }

  return (
    <>
      <CustomCursor />
      <TabNavigation />

      {/* R3F Canvas Container */}
      <div className="canvas-container interactive-canvas">
        <Canvas camera={{ position: [0, 5, 20], fov: 45 }} dpr={[1, 1.5]}>
          <color attach="background" args={[theme === 'light' ? '#fff8f0' : '#0a0a0f']} />
          <ambientLight intensity={0.5} />
          
          <AmbientParticles count={250} />
          
          <Suspense fallback={null}>
            <SceneManager sceneIndex={currentScene} />
            <Preload all />
          </Suspense>

          <CameraRig />
          <PostProcessing />
        </Canvas>
      </div>

      {/* UI Overlays */}
      {currentScene === 0 && <LandingOverlay />}
      {currentScene !== 0 && <IntroOverlay />}
      {currentScene !== 0 && hasSeenIntro && <TheoryPanel />}
      {currentScene !== 0 && hasSeenIntro && <ControlPanel onOperation={handleOperation} />}
      {currentScene !== 0 && hasSeenIntro && <CodePanel activeOp={lastOp?.type} activeLine={activeLine} />}
      {currentScene !== 0 && hasSeenIntro && <HelpGuide />}
      {currentScene === 1 && <InfixPanel visible={showInfix} />}
      {currentScene === 1 && <ParenthesesPanel visible={showParentheses} />}
      <QuizPanel />
      <CodeSandboxPanel />
      <ThemeToggle />
    </>
  )
}
