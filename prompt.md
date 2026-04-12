🔥 ApnaStack — Full Concrete System Blueprint

🎨 Visual Identity
PropertyDecisionThemeDeep space bioluminescent organism labPalette#0a0a0f void black · #00ffe0 plasma teal · #ff6b35 molten orange · #7c3aed deep violet · #f0fffe ghost whiteFontSyne (display, geometric aggressive) + JetBrains Mono (code labels)CursorCustom glowing orb that leaves a particle trailSoundTone.js — each operation has a unique synthesized sound

🏗️ Full Tech Stack
React 18 (Vite)
├── Three.js — raw WebGL, custom GLSL shaders
├── @react-three/fiber — React renderer for Three.js
├── @react-three/drei — helpers (effects, text, env)
├── Framer Motion — UI panels, page transitions, parallax
├── Spline (@splinetool/react-spline) — hero portal scenes
├── D3.js — force graph physics for Graph DS
├── Tone.js — synthesized audio per operation
├── Lenis — ultra-smooth scroll for parallax sections
└── Tailwind CSS — brutalist UI overlay

📦 3D Strategy: Go Mostly Procedural
---
**Core Philosophy**: Drop heavy Spline and Sketchfab dependencies almost entirely. A procedural Three.js scene is kilobytes, ensuring instant loading even on college Wi-Fi, while allowing every vertex to respond to data structure state.

### 🎭 What Goes Fully Procedural (Three.js)
1. **Stack (Tectonic)**: `PlaneGeometry` with custom displacement `ShaderMaterial`. A rock scan would only fight the material.
2. **Tree (Bioluminescent)**: `IcosahedronGeometry` deformed by Perlin noise every frame for a living, breathing look, paired with the iridescent view-angle shader.
3. **Linked List (Spacetime)**: Subdivided `PlaneGeometry` driven by a gravity well vertex shader. The math creates the visual.
4. **Graph Edges**: `TubeGeometry` along procedurally branching curves, allowing real-time animation of hyphae growth.

### 🛠️ What Stays External (Minimal)
- **Landing Hero**: 1 Spline embed (purely decorative, loads once).
- **Queue (Boids)**: 1 Bird GLB (*only* if clean & <30k triangles. Otherwise, instanced cones).
- **Graph Nodes (Mycelium)**: 1 Fungi GLB (organic irregularity is hard to fake procedurally).


🗺️ App Architecture — 6 Scenes
🌐 Scene 0 — LANDING (Spline + Framer)
Spline Scene: Floating ApnaStack logo
made of liquid metal morphing geometry

Framer parallax layers:
  Layer 1 (0.1x): Star field
  Layer 2 (0.3x): Nebula clouds (CSS radial gradients)
  Layer 3 (0.6x): Floating DS icons
  Layer 4 (1.0x): Hero text "APNASTACK"
  Layer 5 (1.4x): CTA button

Scroll down → Lenis smooth scroll →
scene dissolves into Stack universe

🌋 Scene 1 — STACK (Three.js Custom Shaders)
Metaphor: Tectonic Geological Layers
THREE.js setup:
- Each stack element = PlaneGeometry with
  custom displacement shader (looks like rock strata)
- ShaderMaterial per layer:
    uniform float uTime;        // breathing animation
    uniform vec3 uColor;        // layer identity color
    uniform float uHeat;        // glow from bottom
  
PUSH animation:
  1. Camera shake (Framer useMotionValue)
  2. New PlaneGeometry erupts from y=-∞
  3. Particle system: debris flies outward (Points)
  4. Shockwave ring: torus that expands and fades
  5. Tone.js: deep rumble synth

POP animation:
  1. Top layer crystallizes (shader: voronoi fracture pattern)
  2. Shatters into 200+ fragment meshes with physics
  3. Fragments drift upward, fade to dust
  4. Tone.js: high-pitched crystal shatter

UI Panel (Framer):
  Slides in from right, glass morphism
  Shows array state, complexity, pseudocode
  Animates each line highlight on operation

🐦 Scene 2 — QUEUE (Three.js Boids + Framer)
Metaphor: Murmuration / Flocking Birds
Boids simulation in Three.js:
- 50-200 instanced meshes (InstancedMesh for perf)
- Each boid: teardrop geometry, metallic shader
- Rules: separation, alignment, cohesion
- Formation has clear FRONT and BACK

ENQUEUE:
  1. New boid spawns at horizon (z = -500)
  2. Flies toward flock with motion blur shader
  3. Joins back of formation, formation reshapes
  4. Tone.js: soft whoosh

DEQUEUE:
  1. Front boid detaches
  2. Accelerates away with velocity trail (Line geometry)
  3. Disappears into distance fog
  4. Tone.js: departing flutter

Framer parallax:
  Sky gradient shifts dawn→dusk as queue fills (0→max)
  Cloud layers at different parallax speeds

🧬 Scene 3 — LINKED LIST (Three.js + GLSL)
Metaphor: Spacetime Fabric / Gravity Wells
Base: PlaneGeometry(100, 100, 128, 128) — the fabric
ShaderMaterial:
  - Reads node positions as uniforms
  - Displaces vertices: y += gravity(distance_to_each_node)
  - Color: shifts from deep blue (flat) → white (warped)
  - Grid lines on the fabric glow at warp points

Each Node = gravitational singularity
  SphereGeometry, accretion disk (torus, rotates)
  Lens flare effect (drei Sparkles)

INSERT:
  1. Fabric tears — white flash at insertion point
  2. New singularity forms (sphere scales from 0)
  3. Fabric displacement recalculates smoothly
  4. Pointer arrow: animated beam connecting prev→new→next
  5. Tone.js: deep space reverb tone

DELETE:
  1. Hawking radiation: particles spiral INTO node
  2. Node implodes (scale → 0 with flash)
  3. Fabric snaps flat at that point
  4. Remaining nodes' gravity redistributes

🪸 Scene 4 — TREE (Three.js + Custom Shader)
Metaphor: Bioluminescent Deep Sea Organism
Tree structure → organic geometry:
- Nodes: IcosahedronGeometry with Perlin noise deformation
  ShaderMaterial:
    iridescent surface (view-angle dependent color)
    pulsing glow (sin(uTime) on emissive)
    
- Edges: TubeGeometry along CatmullRomCurve3
  animated sine-wave deformation on vertices
  looks like living tendril/tentacle

Mouse interaction:
  Raycaster detects hover
  Hovered subtree: tendrils REACH toward cursor
  Uses spring physics (Framer useSpring)

BFS Traversal:
  1. Chemical signal = glowing sphere racing along tubes
  2. Reaches node → node BLOOMS (geometry expands, petals open)
  3. Color wave: violet → teal → gold as signal passes
  4. Previously visited nodes dim but continue pulsing
  5. Tone.js: ascending musical notes per level

DFS Traversal:
  Signal dives DEEP first — camera follows it
  Feels like descending into the ocean

Background: volumetric god rays (postprocessing bloom)
           particle fog with slow drift

🍄 Scene 5 — GRAPH (D3 + Three.js Hybrid)
Metaphor: Mycelium / Fungal Intelligence Network
D3 forceSimulation → drives Three.js positions
- Nodes: organic blob geometry (metaballs effect)
  merge visually when nodes get close
- Edges: grow procedurally using L-system branching
  not straight lines — they GROW like fungal hyphae
  animated via custom vertex shader

ADD NODE:
  1. Spore drops from top
  2. Lands, germinates — hyphae grow outward
  3. Connects to nearest nodes organically

BFS:
  Nutrient pulse travels network
  Each branch: bright flash then subsides to amber glow
  Shows the algorithm DECIDING which branch to explore

HOVER node:
  Sporulation — particles drift outward like spores
  Connected nodes pulse sympathetically

Framer overlay:
  Adjacency matrix animates alongside
  Each cell lights up as edge is traversed

🎬 Scene Transition System
Framer AnimatePresence:
  Exit: current scene's geometry
    → all meshes scale to 0 with stagger
    → particles implode to center
    → 500ms blackout

  Enter: next scene
    → particles explode from center
    → geometry scales up with spring
    → custom Spline transition portal plays

Lenis scroll controls which scene is active
Progress bar: glowing line at screen edge

🖥️ UI System (Framer Motion)
Floating Control Panel (bottom center):
  Glass morphism card
  Operation buttons with magnetic hover effect
  Speed slider (affects animation timing)
  
Code Panel (right side):
  Slides in on operation trigger
  Syntax highlighted pseudocode
  Active line highlight animates with beam

Info Cards (top left):
  Big O complexity
  Memory visualization bar
  Counter for operations

All panels: drag-to-reposition
            minimize with spring animation

📁 Folder Structure
apnastack/
├── src/
│   ├── scenes/
│   │   ├── Landing/        # Spline + Framer parallax
│   │   ├── Stack/          # Tectonic shaders
│   │   ├── Queue/          # Boids simulation
│   │   ├── LinkedList/     # Spacetime fabric
│   │   ├── Tree/           # Bioluminescent organism
│   │   └── Graph/          # Mycelium network
│   ├── shaders/
│   │   ├── tectonic.glsl
│   │   ├── iridescent.glsl
│   │   ├── spacetime.glsl
│   │   └── bioluminescent.glsl
│   ├── components/
│   │   ├── ControlPanel/
│   │   ├── CodePanel/
│   │   ├── SceneTransition/
│   │   └── CustomCursor/
│   ├── hooks/
│   │   ├── useAudio.js     # Tone.js
│   │   ├── useBoids.js     # Flocking sim
│   │   └── useDS.js        # Data structure state
│   └── store/
│       └── dsStore.js      # Zustand global state

🚀 Build Order (What We Code First)
Phase 1 — Foundation
  ✅ Vite + React + R3F setup
  ✅ Lenis scroll + scene routing
  ✅ Custom cursor + Tone.js audio engine
  ✅ UI panel system (Framer)

Phase 2 — The Procedural Core
  🔥 Stack (tectonic shaders) — Zero GLB dependency, sets the code pattern for displacement & particles.
  🔥 Tree (bioluminescent organism) — Iridescent shader reused from Stack.
  🔥 Linked List (spacetime) — Gravity well shader (self-contained, 2 hours work max).

Phase 3 — External Integrations
  Queue (boids) — Intro to instancing, relies on external bird geometry if found.
  Graph (mycelium) — Mixes procedural edges with external fungi nodes.

Phase 4 — Polish
  Scene transitions (Spline portals)
  Parallax landing
  Sound design
  Mobile fallbacks

---
*Note: Procedural components maximize performance and interaction fidelity. Rely on `InstancedMesh` for grouped geometries.*
