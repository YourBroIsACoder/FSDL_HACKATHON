// Central asset registry
// ──────────────────────────────────────────────────────────────────────────────
// Drop your downloaded GLBs into public/models/<scene>/ and update paths here.
// If a file is missing, scenes will fallback to procedural Three.js geometry.
// ──────────────────────────────────────────────────────────────────────────────

export const MODELS = {
  stack: {
    strata:  '/models/stack/rock_strata.glb',
    crystal: '/models/stack/crystal_cave.glb',
  },
  queue: {
    bird: '/models/queue/bird.glb',
  },
  linkedList: {
    blackhole:     '/models/linked_list/blackhole.glb',
    accretionDisk: '/models/linked_list/accretion_disk.glb',
  },
  tree: {
    jellyfish: '/models/tree/jellyfish.glb',
    coral:     '/models/tree/deep_sea_coral.glb',
  },
  graph: {
    fungus: '/models/graph/fungus_network.glb',
    roots:  '/models/graph/roots.glb',
  },
}

// Paste your Spline sharable URLs here
export const SPLINE_URLS = {
  landing:    null, // e.g. 'https://prod.spline.design/XXXX/scene.splinecode'
  transition: null,
}

// Color palette mirroring the design system
export const PALETTE = {
  voidBlack:    '#0a0a0f',
  plasmaTeal:   '#00ffe0',
  moltenOrange: '#ff6b35',
  deepViolet:   '#7c3aed',
  ghostWhite:   '#f0fffe',
}
