"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { heroState } from "./hero-state";
import { useCssColor } from "./use-accent-color";

type SceneProps = { simplified: boolean };

function fibonacciSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return positions;
}

/** Particle shell: represents the many small decisions that make up a website */
function ParticleShell({ count, color }: { count: number; color: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => fibonacciSphere(count, 1.55), [count]);

  useFrame((state) => {
    const p = ref.current;
    if (!p) return;
    const t = state.clock.elapsedTime;
    p.rotation.y = t * 0.08;
    const s = 1 + Math.sin(t * 0.7) * 0.015;
    p.scale.setScalar(s);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.016} color={color} transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** Three orbit rings: Design, Development, Conversion */
function OrbitRings({ color }: { color: string }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (a.current) a.current.rotation.z += delta * 0.12;
    if (b.current) b.current.rotation.z -= delta * 0.09;
    if (c.current) c.current.rotation.z += delta * 0.06;
  });

  const mat = <meshBasicMaterial color={color} transparent opacity={0.28} />;

  return (
    <group>
      <mesh ref={a} rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[2.05, 0.0035, 8, 220]} />
        {mat}
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 3.2, -0.6, 0.4]}>
        <torusGeometry args={[2.35, 0.0035, 8, 220]} />
        {mat}
      </mesh>
      <mesh ref={c} rotation={[Math.PI / 1.7, 0.9, -0.3]}>
        <torusGeometry args={[2.6, 0.0035, 8, 220]} />
        {mat}
      </mesh>
    </group>
  );
}

/** Core geometry: the structured, engineered center */
function Core({ color, simplified }: { color: string; simplified: boolean }) {
  const wire = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (wire.current) {
      wire.current.rotation.x += delta * 0.15;
      wire.current.rotation.y -= delta * 0.1;
    }
    if (inner.current) {
      const t = state.clock.elapsedTime;
      inner.current.scale.setScalar(0.62 + Math.sin(t * 1.2) * 0.02);
    }
  });

  return (
    <group>
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.05, simplified ? 1 : 2]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.22} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial color="#0b0b0f" roughness={0.25} metalness={0.85} emissive={color} emissiveIntensity={0.12} />
      </mesh>
    </group>
  );
}

/** Applies pointer + scroll influence to the whole scene */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const { pointer, scroll } = heroState;
    const k = 1 - Math.pow(0.001, delta); // frame-rate independent lerp

    g.rotation.y += (pointer.x * 0.35 - g.rotation.y) * k * 0.6;
    g.rotation.x += (-pointer.y * 0.25 - g.rotation.x) * k * 0.6;

    const targetY = -scroll * 1.6;
    const targetScale = 1 - scroll * 0.25;
    g.position.y += (targetY - g.position.y) * k;
    const s = g.scale.x + (targetScale - g.scale.x) * k;
    g.scale.setScalar(s);

    state.camera.position.z = 6 + scroll * 1.5;
  });

  return <group ref={group}>{children}</group>;
}

function Scene({ simplified }: SceneProps) {
  const accent = useCssColor("--accent");
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 6]} intensity={1.4} />
      <pointLight position={[-4, -2, 3]} intensity={6} color={accent} distance={12} />
      <Rig>
        <Core color={accent} simplified={simplified} />
        <ParticleShell count={simplified ? 700 : 2200} color={accent} />
        {!simplified && <OrbitRings color={accent} />}
      </Rig>
    </>
  );
}

export default function HeroScene({ simplified }: SceneProps) {
  return (
    <Canvas
      dpr={simplified ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 42, near: 0.1, far: 50 }}
      gl={{ antialias: !simplified, alpha: true, powerPreference: "high-performance" }}
      frameloop="always"
      style={{ background: "transparent" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Scene simplified={simplified} />
    </Canvas>
  );
}
