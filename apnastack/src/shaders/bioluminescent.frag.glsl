// Iridescent bioluminescent — fragment shader
uniform float uTime;
uniform vec3  uBaseColor;
uniform float uHighlight;

varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.0);

  // Iridescent color shift based on view angle
  vec3 iriA = vec3(0.0, 1.0, 0.88);    // plasma teal
  vec3 iriB = vec3(0.48, 0.23, 0.93);  // deep violet
  vec3 iriC = vec3(1.0, 0.42, 0.21);   // molten orange
  float cycle = (sin(uTime * 1.2) + 1.0) * 0.5;
  vec3  iri   = mix(mix(iriA, iriB, cycle), iriC, fresnel);

  // Pulsing glow core
  float pulse  = 0.4 + 0.6 * abs(sin(uTime * 2.0));
  vec3  glow   = uBaseColor * pulse;

  // Traversal bloom
  vec3 bloom = vec3(1.0, 0.9, 0.5) * uHighlight;

  vec3 col = mix(glow, iri, fresnel * 0.7) + bloom;
  gl_FragColor = vec4(col, 0.92);
}
