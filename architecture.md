# AlgoReef Architecture & Rendering Model

AlgoReef is an advanced, hybrid web application designed to merge standard DOM-based UI/UX with high-fidelity, interactive 3D ecosystems. Because the application needs to keep standard HTML text panels synchronized with dynamic 120fps physics simulations, it leans purely on a carefully orchestrated subset of the React ecosystem: **React Three Fiber (R3F) and Zustand**.

## 1. The Global State Brain (Zustand)
At the heart of the engine is `src/store/dsStore.js`, an independent Zustand store. 
Unlike standard React Context, which forces a re-render of every subscribed component when data changes, Zustand allows us to bind specific 3D meshes to transient state slices without causing the entire DOM tree to lag.

- **Transient Handlers**: Operations like `queueEnqueue` or `dpFillCell` mutate global arrays/graphs instantly.
- **Audio Synths**: Tone.js is completely disconnected from React's rendering cycle but hooks into the exact same Zustand triggers so audio hits exactly when the mesh scales up.
- **The Speed Scale**: Every Tone.js envelope and `useFrame` physics loop reads `store.speed`. This forces time to artificially slow down or speed up natively.

## 2. The Command Loop & Concurrency (`App.jsx`)
The entry point of the app coordinates incoming DOM click events and translates them into asynchronous 3D animation subroutines.

- **Sequence ID architecture**: One of the core complexities of building a real-time visualizer is *user impatience*. If a user clicks "QuickSort" and then immediately clicks "BubbleSort", both `while` loops would normally execute concurrently, shredding the Array state and crashing the WebGL context.
- **The Delay Lock**: To solve this, `App.jsx` uses a `useRef(animId)`. Every algorithmic step (like sorting a swap) calls `await delay(ms)`. Inside the custom `delay` function, it checks if the active `animId` matches the one when the function started. If it doesn't, it `throw`s an exception inside a swallowed `try/catch` block, silently and instantly killing the old algorithm.

## 3. The Render Pipeline (@react-three/fiber)
Rather than raw Three.js, R3F treats 3D primitives like React components, which lets us utilize standard hooks like `useMemo` for massive geometry data and `useRef` for raw GPU updates.

- **D3 Physics Mapping**: In the Graph scene (`GraphScene.jsx`), mathematical forces (Repulsion, Link constraints, Centering) are handled on the CPU by `d3-force`. The output coordinates are fed directly into the `.position` properties of `<MeshPhysicalMaterial>` glass nodes via `useFrame`, entirely bypassing React's render phase for maximum 120hz smoothness.
- **Parametric Shaders**: Environments like the Linked List (`LinkedListScene.jsx`) use direct GLSL strings to render the "Spacetime Fabric" grid. Data passed from `nodes.map` is unpacked into `Float32Arrays` as uniforms, allowing the GPU to physically deform the grid beneath the nodes.
- **Hybrid DOM Overlays**: Tools like `<Html>` from `@react-three/drei` project 2D div elements directly onto 3D coordinates.

## 4. Cinematic Post-Processing
In order to distance AlgoReef from standard "academic" visualizers, the app runs an `<EffectComposer>` pipeline on the GPU after the 3D scene finishes rendering:

1. **Depth Of Field**: Simulates a physical macro-lens. The active models (like sorting rods) stay crisp, while the background and drifting particle system are aggressively blurred via Bokeh algorithms.
2. **Bloom**: Luminance thresholding intercepts the raw Hex codes (like `#00ffe0`) and bleeds light over the surrounding pixels to create glowing neon.
3. **Chromatic Aberration**: Offsets the Red and Blue channels slightly at the edges of the screen, mimicking the optical distortion found in premium camera lenses or deep-water environments.

## 5. Atmosphere Layer (`AmbientParticles.jsx`)
To make the scenes feel cohesive, a global `<points>` cloud is instantiated above all individual scenes. This uses an `AdditiveBlending` material and a CPU-side Math.sin wave to ripple 800 Cyan spores continuously through the background.
