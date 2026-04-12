# 📦 ApnaStack — Asset Acquisition Guide (Minimalist Procedural Approach)
> **Important:** Based on our pivot to a mostly procedural architecture, we only need **two GLB files** and **one Spline scene**.
> Download these manually and place them in the folders below.

---

## 📁 Where to Put Files

```
apnastack/
└── public/
    └── models/
        ├── queue/
        │   └── bird.glb              ← (Optional) Boid unit mesh
        └── graph/
            └── fungus_node.glb       ← Organic node geometry
```

---

## 🛠️ Sketchfab — Minimal Downloads

### 1. Create a Free Account
- Go to: https://sketchfab.com/signup

### 2. Search & Download (Only these two!)

#### 🐦 QUEUE — Boids (Optional)
*If you can't find a clean one under 30k triangles in 15 mins, skip it. The code will fall back to procedural instanced cones.*
| Search Term | Pick | Download As |
|---|---|---|
| `low poly bird` | Any clean, simple bird mesh | `bird.glb` |

#### 🍄 GRAPH — Mycelium Network Node
*We need this because organic irregularity is hard to fake procedurally.*
| Search Term | Pick | Download As |
|---|---|---|
| `mycology` | **MuseumoftheCosmos** collection | `fungus_node.glb` |

### 3. How to Download
1. Click a model
2. Click the blue **"Download"** button (only free/CC models)
3. Choose **"GLB"** format 
4. Rename and place in `public/models/[scene]/`

---

## ✨ Spline — Landing Hero Only

### 1. Create a Free Account
- Go to: https://spline.design/

### 2. Find the Hero Scene
- Go to: https://spline.design/community
- Search for: `Liquid Chrome Flux` (or any single high-impact organic blob)
- Click **"Export" → "Sharable Link"**
- Paste the URL into `SPLINE_URLS.landing` inside `src/config/assets.js`

---

## 🔌 Updated Asset Config

Your `src/config/assets.js` should now just look like this:

```js
export const MODELS = {
  queue: {
    bird: '/models/queue/bird.glb',
  },
  graph: {
    node: '/models/graph/fungus_node.glb',
  },
}

export const SPLINE_URLS = {
  landing: 'PASTE_YOUR_SPLINE_URL_HERE',
}

export const PALETTE = {
  voidBlack:    '#0a0a0f',
  plasmaTeal:   '#00ffe0',
  moltenOrange: '#ff6b35',
  deepViolet:   '#7c3aed',
  ghostWhite:   '#f0fffe',
}
```
