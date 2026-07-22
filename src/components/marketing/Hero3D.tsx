"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Mesh } from "three";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function Blob({ paused }: { paused: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (paused || !meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.12;
    meshRef.current.rotation.y += delta * 0.18;
  });

  return (
    <mesh ref={meshRef} scale={1.15}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color="#0B5FFF"
        distort={0.4}
        speed={paused ? 0 : 1.8}
        roughness={0.1}
        metalness={0.15}
      />
    </mesh>
  );
}

export function Hero3D() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <directionalLight position={[-3, -2, -4]} intensity={0.5} color="#7C3AED" />
      <Float speed={reduced ? 0 : 1.6} rotationIntensity={reduced ? 0 : 0.5} floatIntensity={reduced ? 0 : 0.9}>
        <Blob paused={reduced} />
      </Float>
      {!reduced && <Sparkles count={40} scale={4.5} size={2} speed={0.25} opacity={0.35} color="#0B5FFF" />}
    </Canvas>
  );
}
