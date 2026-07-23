import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  CanvasTexture,
  EquirectangularReflectionMapping,
  IcosahedronGeometry,
  type Group,
  type Mesh,
  MeshPhysicalMaterial,
  SRGBColorSpace,
} from "three";

// Minimal shape of the object three passes to Material.onBeforeCompile (its
// exported type name has churned across versions; this is all we touch).
interface CompileShader {
  uniforms: Record<string, { value: unknown }>;
  vertexShader: string;
  fragmentShader: string;
}

// A glossy, iridescent liquid blob — the hero showpiece. A high-detail
// icosahedron is displaced by GPU simplex noise (a slow morph) and lit by a
// gradient "environment" (a canvas texture used as an equirect reflection map),
// so the chrome surface catches Jima's brand gradient. Pure three.js — no drei,
// no external HDR fetches (keeps the client-side + CSP rules + size budget).

// Ashima 3D simplex noise (public domain) injected into the vertex shader.
const SIMPLEX_GLSL = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

/** A soft multi-stop gradient used as an equirect reflection map (iridescence). */
function gradientEnvTexture(): CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  // Vertical band: bright top → brand hues → deep bottom, so the blob reads as
  // a glossy object under a colorful sky.
  // High-contrast bands so the chrome reflects visible *structure* (a glossy
  // object needs bright specular streaks and deep falloff, not a flat pastel).
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0.0, "#ffffff");
  g.addColorStop(0.16, "#eaf6ff");
  g.addColorStop(0.3, "#38c7ff");
  g.addColorStop(0.5, "#7c5cff");
  g.addColorStop(0.66, "#ff2e9e");
  g.addColorStop(0.8, "#ff6a3d");
  g.addColorStop(0.92, "#3a0f5e");
  g.addColorStop(1.0, "#050109");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);
  // Crisp highlight blooms → mirror-like hotspots that sell the gloss.
  for (const [x, y, r, a] of [
    [120, 40, 90, 0.95],
    [360, 70, 70, 0.85],
    [260, 30, 140, 0.4],
  ] as const) {
    const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `rgba(255,255,255,${a})`);
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, 512, 256);
  }
  const tex = new CanvasTexture(c);
  tex.mapping = EquirectangularReflectionMapping;
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

function Blob({ animate }: { animate: boolean }) {
  const mesh = useRef<Mesh>(null);
  const group = useRef<Group>(null);
  const uniforms = useRef({ uTime: { value: 0 }, uDistort: { value: 0.42 }, uFreq: { value: 0.92 } });

  const geometry = useMemo(() => new IcosahedronGeometry(1.32, 96), []);
  const envMap = useMemo(gradientEnvTexture, []);

  const material = useMemo(() => {
    const m = new MeshPhysicalMaterial({
      color: "#e7ecff",
      metalness: 0.9,
      roughness: 0.06,
      envMap,
      envMapIntensity: 1.35,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      iridescence: 0.8,
      iridescenceIOR: 1.35,
    });
    m.onBeforeCompile = (shader: CompileShader) => {
      shader.uniforms.uTime = uniforms.current.uTime;
      shader.uniforms.uDistort = uniforms.current.uDistort;
      shader.uniforms.uFreq = uniforms.current.uFreq;
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>\nuniform float uTime;\nuniform float uDistort;\nuniform float uFreq;\n${SIMPLEX_GLSL}`,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           // Big low-freq lobes (the liquid form) + a finer octave (surface life),
           // sampled in object space so the silhouette actually morphs over time.
           float n = snoise(position * uFreq + uTime * 0.3);
           float n2 = snoise(position * (uFreq * 2.4) - uTime * 0.22);
           float disp = uDistort * n + uDistort * 0.28 * n2;
           transformed += normalize(position) * disp;`,
        );
    };
    return m;
  }, [envMap]);

  useFrame((state, delta) => {
    if (animate) uniforms.current.uTime.value += delta;
    const g = group.current;
    if (g) {
      const t = state.clock.elapsedTime;
      g.rotation.y = t * 0.22 + state.pointer.x * 0.35;
      g.rotation.x = -0.12 + Math.sin(t * 0.5) * 0.12 + state.pointer.y * 0.2;
      g.position.y = Math.sin(t * 0.8) * 0.06;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geometry} material={material} />
    </group>
  );
}

/** Sets the scene environment so metallic surfaces have something to reflect. */
function SceneEnv() {
  const { scene } = useThree();
  const env = useMemo(gradientEnvTexture, []);
  scene.environment = env;
  return null;
}

export default function HeroBackground({ animate }: { animate: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 3.7], fov: 42 }}
      frameloop={animate ? "always" : "demand"}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <SceneEnv />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} color="#fff1e8" />
      <directionalLight position={[-4, -1, -3]} intensity={0.8} color="#8ea2ff" />
      <pointLight position={[2, -3, 2]} intensity={2.2} color="#ff2e9e" distance={12} />
      <Blob animate={animate} />
    </Canvas>
  );
}
