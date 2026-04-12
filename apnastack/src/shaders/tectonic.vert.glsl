// Tectonic displacement shader — used for Stack scene layers
// Vertex shader: displaces PlaneGeometry vertices using noise + heat

uniform float uTime;
uniform float uHeat;
uniform float uIndex;

varying vec2 vUv;
varying float vDisplace;

// Simple 2D → scalar hash noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
    u.y
  );
}

void main() {
  vUv = uv;
  vec3 pos = position;

  float n = noise(pos.xz * 0.5 + uTime * 0.1);
  float strata = sin(pos.x * 2.0 + uIndex * 1.2 + uTime * 0.2) * 0.3;
  float heat   = uHeat * noise(pos.xz * 2.0 + uTime * 0.5) * 0.8;

  pos.y += n * 0.4 + strata + heat;
  vDisplace = pos.y;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
