// Spacetime fabric shader — Linked List scene
// Each node warps the grid like a gravity well

uniform float uTime;
uniform vec3  uNodePositions[16];   // max 16 nodes
uniform int   uNodeCount;

varying vec2  vUv;
varying float vWarp;

void main() {
  vec3 pos = position;
  float totalWarp = 0.0;

  for (int i = 0; i < 16; i++) {
    if (i >= uNodeCount) break;
    vec3  np   = uNodePositions[i];
    float dist = distance(pos.xz, np.xz);
    float w    = 1.5 / (dist * dist + 0.5);
    totalWarp += w;
    pos.y -= w * 0.8;
  }

  // subtle wave on flat fabric
  pos.y += sin(pos.x * 1.2 + uTime * 0.5) * 0.05
         + sin(pos.z * 1.1 + uTime * 0.4) * 0.05;

  vWarp = totalWarp;
  vUv   = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
