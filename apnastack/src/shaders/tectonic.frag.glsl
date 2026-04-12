// Tectonic fragment shader
uniform vec3 uColor;
uniform float uHeat;
uniform float uTime;

varying vec2 vUv;
varying float vDisplace;

void main() {
  vec3 rock   = uColor;
  vec3 lava   = vec3(1.0, 0.42, 0.21);  // molten orange
  vec3 glow   = vec3(0.0, 1.0, 0.88);   // plasma teal

  // Heat blend from bottom
  float heatMix = clamp(uHeat * 2.0 + vDisplace * 0.5, 0.0, 1.0);
  vec3  col     = mix(rock, lava, heatMix);

  // Edge glow
  float edge = abs(vUv.x - 0.5) + abs(vUv.y - 0.5);
  col = mix(col, glow, smoothstep(0.45, 0.5, edge) * 0.4);

  // Breathing pulse
  float pulse = 0.05 * sin(uTime * 2.0 + vUv.x * 6.28);
  col += pulse;

  gl_FragColor = vec4(col, 1.0);
}
