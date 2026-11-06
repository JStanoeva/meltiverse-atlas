/**
 * SHADERS
 * GLSL shared by several parts of the system. One-off shaders (the Boophole
 * portal and the Cheese Highway) live next to the component that uses them.
 */

const NOISE_GLSL = `
  float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float noise(vec3 x){
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0.0,0.0,0.0)), hash(i + vec3(1.0,0.0,0.0)), f.x),
                   mix(hash(i + vec3(0.0,1.0,0.0)), hash(i + vec3(1.0,1.0,0.0)), f.x), f.y),
               mix(mix(hash(i + vec3(0.0,0.0,1.0)), hash(i + vec3(1.0,0.0,1.0)), f.x),
                   mix(hash(i + vec3(0.0,1.0,1.0)), hash(i + vec3(1.0,1.0,1.0)), f.x), f.y), f.z);
  }
  float fbm(vec3 p){ float s = 0.0; float a = 0.5; for (int i = 0; i < 5; i++){ s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
  vec3 hash3(vec3 p){
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453);
  }
  // round Swiss-cheese holes: distance to the nearest (randomly kept) cell point
  float swiss(vec3 p){
    vec3 i = floor(p); vec3 f = fract(p); float d = 1.0;
    for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) for (int z = -1; z <= 1; z++) {
      vec3 g = vec3(float(x), float(y), float(z));
      vec3 h = hash3(i + g);
      if (h.z > 0.45) { vec3 r = g + h * 0.8 + 0.1 - f; d = min(d, dot(r, r)); }
    }
    return sqrt(d);
  }
`;

// The First Taste: a churning star of pure flavor with Swiss sunspots
export const SUN_VS = `
  varying vec3 vPos; varying vec3 vN; varying vec3 vV;
  void main(){
    vPos = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`;
export const SUN_FS = `
  uniform float uTime; varying vec3 vPos; varying vec3 vN; varying vec3 vV;
  ${NOISE_GLSL}
  void main(){
    vec3 p = normalize(vPos) * 2.4;
    float n = fbm(p + vec3(uTime * 0.05, -uTime * 0.03, uTime * 0.04));
    float n2 = fbm(p * 2.3 - vec3(uTime * 0.07));
    vec3 col = mix(vec3(0.93, 0.52, 0.12), vec3(1.0, 0.8, 0.32), smoothstep(0.3, 0.65, n));
    col = mix(col, vec3(1.0, 0.97, 0.82), smoothstep(0.5, 0.78, n2) * 0.75);
    float hd = swiss(normalize(vPos) * 3.2 + vec3(0.0, uTime * 0.03, 0.0));
    float holes = 1.0 - smoothstep(0.16, 0.24, hd);
    float rimH = smoothstep(0.12, 0.2, hd) * (1.0 - smoothstep(0.2, 0.27, hd));
    col = mix(col, vec3(0.84, 0.42, 0.16), holes * 0.6);
    col += vec3(1.0, 0.9, 0.6) * rimH * 0.25;
    float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.2);
    col += vec3(1.0, 0.55, 0.62) * f * 0.7;
    gl_FragColor = vec4(col, 1.0);
  }`;

// Soft fresnel atmosphere shell
export const ATMO_VS = `
  varying vec3 vN; varying vec3 vV;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`;
export const ATMO_FS = `
  uniform vec3 uColor; uniform float uIntensity; uniform float uPower;
  varying vec3 vN; varying vec3 vV;
  void main(){
    float f = pow(1.0 - clamp(dot(vN, vV), 0.0, 1.0), uPower);
    gl_FragColor = vec4(uColor * f * uIntensity, 1.0);
  }`;

// Background stars: fixed pixel size, gentle twinkle
export const STAR_VS = `
  attribute float aSize; attribute vec3 aColor; attribute float aAlpha; attribute float aPhase;
  uniform float uTime; uniform float uPR;
  varying vec3 vColor; varying float vAlpha;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 0.7 + 0.3 * sin(uTime * (0.6 + fract(aPhase) * 1.8) + aPhase * 6.2831);
    vAlpha = aAlpha * tw; vColor = aColor;
    gl_PointSize = aSize * uPR;
  }`;
// World-sized glowing particles (storms, streams, caravans, dust)
export const PART_VS = `
  attribute float aSize; attribute vec3 aColor; attribute float aAlpha;
  uniform float uScale;
  varying vec3 vColor; varying float vAlpha;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(aSize * uScale / max(-mv.z, 0.001), 0.0, 90.0);
    vColor = aColor; vAlpha = aAlpha;
  }`;
export const POINT_FS = `
  varying vec3 vColor; varying float vAlpha;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.0, 0.5, d);
    a *= a;
    gl_FragColor = vec4(vColor * a * vAlpha, 1.0);
  }`;
