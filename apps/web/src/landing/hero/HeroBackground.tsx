import { useRef, type ReactNode } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { Color, type Group, type ShaderMaterial } from "three";

// Soft flowing pastel gradient on near-white — domain-warped value-noise fbm.
const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uEmber;
  uniform vec3 uCandy;
  uniform vec3 uViolet;
  uniform vec3 uSky;
  varying vec2 vUv;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    float t = uTime * 0.045;
    vec2 m = (uMouse - 0.5) * 0.35;
    vec2 p = uv * 2.4 + m;
    float n1 = fbm(p + vec2(t, -t));
    float n2 = fbm(p * 1.6 + vec2(-t, t) + n1);
    float n3 = fbm(p + n2 * 1.2);

    vec3 col = vec3(1.0);
    col = mix(col, uEmber,  smoothstep(0.25, 0.75, n1) * 0.55);
    col = mix(col, uCandy,  smoothstep(0.35, 0.85, n2) * 0.42);
    col = mix(col, uViolet, smoothstep(0.45, 0.95, n3) * 0.34);
    col = mix(col, uSky,    smoothstep(0.55, 1.0,  fbm(p*0.8 - t)) * 0.28);
    col = mix(col, vec3(1.0), 0.28); // keep it a LIGHT theme
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Clip-space fullscreen quad — ignores the camera.
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

function GradientPlane() {
  const mat = useRef<ShaderMaterial>(null);
  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime!.value = state.clock.elapsedTime;
    const u = mat.current.uniforms.uMouse!.value as [number, number];
    u[0] += (state.pointer.x * 0.5 + 0.5 - u[0]) * 0.05;
    u[1] += (state.pointer.y * 0.5 + 0.5 - u[1]) * 0.05;
  });
  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        depthTest={false}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: [0.5, 0.5] },
          uEmber: { value: new Color("#FF6A3D") },
          uCandy: { value: new Color("#FF6FC1") },
          uViolet: { value: new Color("#9B87FF") },
          uSky: { value: new Color("#7ADBFF") },
        }}
      />
    </mesh>
  );
}

// Minimal float: gentle bob + rotation. (Replaces drei's <Float>.)
function Floaty({ speed = 1, amp = 0.3, children }: { speed?: number; amp?: number; children: ReactNode }) {
  const ref = useRef<Group>(null);
  const seed = useRef(Math.PI * speed);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + seed.current;
    ref.current.position.y = Math.sin(t) * amp;
    ref.current.rotation.z = Math.sin(t * 0.6) * 0.25;
    ref.current.rotation.x = Math.cos(t * 0.4) * 0.2;
  });
  return <group ref={ref}>{children}</group>;
}

function Pebble(props: ThreeElements["mesh"] & { color: string }) {
  const { color, ...rest } = props;
  return (
    <mesh {...rest}>
      <icosahedronGeometry args={[1, 3]} />
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.1} transparent opacity={0.9} />
    </mesh>
  );
}

function Pebbles() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.pointer.x * 0.15;
      group.current.rotation.x = state.pointer.y * 0.1;
    }
  });
  const shapes: { pos: [number, number, number]; color: string; scale: number; speed: number }[] = [
    { pos: [-2.6, 1.3, -1], color: "#FF4D1C", scale: 0.55, speed: 1.1 },
    { pos: [2.8, 0.8, -1.5], color: "#7C5CFF", scale: 0.7, speed: 0.9 },
    { pos: [1.9, -1.6, -0.5], color: "#38C7FF", scale: 0.45, speed: 1.3 },
    { pos: [-2.2, -1.4, -1.2], color: "#FF2E9E", scale: 0.5, speed: 1.0 },
    { pos: [0.2, 2.0, -2], color: "#D8F34D", scale: 0.4, speed: 1.5 },
  ];
  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <Floaty key={i} speed={s.speed}>
          <Pebble position={s.pos} color={s.color} scale={s.scale} />
        </Floaty>
      ))}
    </group>
  );
}

export default function HeroBackground({ animate }: { animate: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      frameloop={animate ? "always" : "demand"}
      gl={{ antialias: true, alpha: false }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <GradientPlane />
      {animate && <Pebbles />}
    </Canvas>
  );
}
