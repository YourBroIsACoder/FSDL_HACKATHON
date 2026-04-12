// Spacetime fabric — fragment shader
uniform float uTime;

varying vec2  vUv;
varying float vWarp;

void main() {
  // Grid lines
  float gridX = abs(sin(vUv.x * 40.0)) * 0.15;
  float gridY = abs(sin(vUv.y * 40.0)) * 0.15;
  float grid  = gridX + gridY;

  vec3 flatColor = vec3(0.04, 0.08, 0.25);        // deep blue
  vec3 warpColor = vec3(1.0, 1.0, 1.0);           // white near wells
  vec3 glowColor = vec3(0.0, 1.0, 0.88);          // teal grid lines

  vec3 col = mix(flatColor, warpColor, clamp(vWarp * 0.3, 0.0, 1.0));
  col      = mix(col, glowColor, grid * (0.5 + vWarp * 0.2));

  // Subtle animation shimmer
  col += 0.03 * sin(uTime * 3.0 + vUv.x * 20.0);

  gl_FragColor = vec4(col, 0.9);
}
