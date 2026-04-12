// Iridescent bioluminescent shader — Tree nodes
uniform float uTime;
uniform vec3  uBaseColor;
uniform float uHighlight; // 0..1 when traversed

varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vNormal  = normalize(normalMatrix * normal);
  vViewDir = normalize(cameraPosition - (modelMatrix * vec4(position, 1.0)).xyz);
  
  // Noise-based vertex displacement for organic feel
  float disp = sin(position.x * 3.0 + uTime) * 0.05
             + sin(position.y * 2.7 + uTime * 1.3) * 0.05
             + sin(position.z * 3.1 + uTime * 0.9) * 0.05;
  vec3 displaced = position + normal * disp;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
