import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CanvasTexture,
  Color,
  ExtrudeGeometry,
  type Group,
  type InstancedMesh,
  Object3D,
  Shape,
} from "three";

// A rounded-rectangle profile extruded with a soft bevel — the "motion tile".
function roundedRectShape(w: number, h: number, r: number): Shape {
  const s = new Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

function MotionTile() {
  const ref = useRef<Group>(null);
  const geo = useMemo(() => {
    const g = new ExtrudeGeometry(roundedRectShape(1.7, 1.7, 0.42), {
      depth: 0.32,
      bevelEnabled: true,
      bevelSize: 0.07,
      bevelThickness: 0.07,
      bevelSegments: 5,
      curveSegments: 24,
    });
    g.center();
    return g;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // Gentle sway (keeps the play face toward the viewer), not a full spin.
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.42;
    ref.current.rotation.x = -0.42 + Math.sin(t * 0.6) * 0.05;
    ref.current.position.y = 1.15 + Math.sin(t * 0.9) * 0.12;
  });

  return (
    <group ref={ref} position={[0, 1.15, 0]} rotation={[-0.5, 0, 0.22]}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color="#FF4D1C" roughness={0.28} metalness={0.18} />
      </mesh>
      {/* Play glyph on the face. */}
      <mesh position={[0.03, 0, 0.3]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.36, 0.36, 0.06, 3]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.35} emissive="#FFFFFF" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

function GridPlatform() {
  const ref = useRef<InstancedMesh>(null);
  const cols = 11;
  const rows = 16;
  const spacing = 0.74;

  useLayoutEffect(() => {
    if (!ref.current) return;
    const dummy = new Object3D();
    const base = new Color("#EDEDF3");
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - (cols - 1) / 2) * spacing;
        const z = (r - (rows - 1) / 2) * spacing - 1.5;
        // Gentle dome so the platform feels like a soft surface.
        const d = Math.hypot(x, z + 1.5);
        const y = -0.06 - d * 0.03;
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        ref.current.setMatrixAt(i, dummy.matrix);
        ref.current.setColorAt(i, base);
        i++;
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, cols * rows]} receiveShadow>
      <boxGeometry args={[0.58, 0.16, 0.58]} />
      <meshStandardMaterial roughness={0.78} metalness={0.03} color="#E8E8F0" />
    </instancedMesh>
  );
}

function ContactShadow() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(20,16,30,0.36)");
    g.addColorStop(0.7, "rgba(20,16,30,0.12)");
    g.addColorStop(1, "rgba(20,16,30,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new CanvasTexture(c);
  }, []);
  return (
    <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.4, 3.4]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

function Scene({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.pointer.x * 0.12;
      group.current.position.x = state.pointer.x * 0.2;
    }
  });
  return (
    <group ref={group}>
      <GridPlatform />
      {/* Object sits over the right of the grid, clear of the left-side copy. */}
      <group position={[1.35, 0, 0.5]}>
        <ContactShadow />
        {animate ? <MotionTile /> : <StaticTile />}
      </group>
    </group>
  );
}

function StaticTile() {
  const geo = useMemo(() => {
    const g = new ExtrudeGeometry(roundedRectShape(1.7, 1.7, 0.42), {
      depth: 0.32,
      bevelEnabled: true,
      bevelSize: 0.07,
      bevelThickness: 0.07,
      bevelSegments: 5,
      curveSegments: 24,
    });
    g.center();
    return g;
  }, []);
  return (
    <mesh geometry={geo} position={[0, 1.15, 0]} rotation={[-0.5, 0, 0.22]}>
      <meshStandardMaterial color="#FF4D1C" roughness={0.28} metalness={0.18} />
    </mesh>
  );
}

export default function HeroBackground({ animate }: { animate: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      shadows={false}
      camera={{ position: [0.4, 2.1, 6.4], fov: 42 }}
      frameloop={animate ? "always" : "demand"}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera }) => camera.lookAt(0.5, 0.85, 0)}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 7, 4]} intensity={1.4} color="#fff4ec" />
      <directionalLight position={[-5, 3, -2]} intensity={0.55} color="#dfe6ff" />
      <Scene animate={animate} />
    </Canvas>
  );
}
