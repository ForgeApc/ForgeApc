import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";

function SpinningBuild({ parts, useCase, hasGpu, gpuColor, ramSticks }) {
  const groupRef = useRef();

  useEffect(() => {
    let id;
    const tick = () => {
      if (groupRef.current) groupRef.current.rotation.y += 0.005;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Case */}
      <mesh>
        <boxGeometry args={[2.2, 3.2, 2.2]} />
        <meshStandardMaterial color="#0d1117" transparent opacity={0.45} />
      </mesh>

      {/* Motherboard */}
      <mesh position={[-0.3, 0.1, 0.95]}>
        <boxGeometry args={[1.5, 2.2, 0.06]} />
        <meshStandardMaterial color="#0a2010" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[-0.3, 0.1, 0.99]}>
        <boxGeometry args={[1.4, 0.02, 0.01]} />
        <meshStandardMaterial color="#19e8db" emissive="#19e8db" emissiveIntensity={1} />
      </mesh>

      {/* CPU */}
      <mesh position={[-0.1, 0.7, 0.99]}>
        <boxGeometry args={[0.38, 0.38, 0.05]} />
        <meshStandardMaterial color="#aaa" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[-0.1, 0.7, 1.02]}>
        <boxGeometry args={[0.3, 0.3, 0.01]} />
        <meshStandardMaterial color="#19e8db" emissive="#19e8db" emissiveIntensity={0.5} />
      </mesh>

      {/* Cooler */}
      {parts.cooler && (
        <mesh position={[-0.1, 0.7, 0.72]}>
          <cylinderGeometry args={[0.24, 0.24, 0.35, 16]} />
          <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
        </mesh>
      )}

      {/* RAM */}
      {Array.from({ length: ramSticks }).map((_, i) => (
        <mesh key={i} position={[0.28 + i * 0.13, 0.65, 0.99]}>
          <boxGeometry args={[0.08, 0.6, 0.05]} />
          <meshStandardMaterial color="#7c5cff" emissive="#7c5cff" emissiveIntensity={0.4} metalness={0.5} />
        </mesh>
      ))}

      {/* GPU */}
      {hasGpu && (
        <group position={[-0.2, -0.2, 0.55]}>
          <mesh>
            <boxGeometry args={[1.15, 0.3, 0.55]} />
            <meshStandardMaterial color="#1a1a2a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[1.05, 0.06, 0.5]} />
            <meshStandardMaterial color={gpuColor} emissive={gpuColor} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-0.28, 0, 0.28]}>
            <cylinderGeometry args={[0.11, 0.11, 0.05, 16]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0.28, 0, 0.28]}>
            <cylinderGeometry args={[0.11, 0.11, 0.05, 16]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        </group>
      )}

      {/* Storage */}
      {parts.storage && (
        <mesh position={[0.72, 0.1, 0.99]}>
          <boxGeometry args={[0.28, 0.1, 0.05]} />
          <meshStandardMaterial color="#19e8db" emissive="#19e8db" emissiveIntensity={0.3} metalness={0.9} />
        </mesh>
      )}

      {/* PSU */}
      <mesh position={[0, -1.25, 0.4]}>
        <boxGeometry args={[1.3, 0.42, 0.9]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function BuildViewer3D({ parts, useCase }) {
  const USE_CASES_GPU_ALLOC = { gaming: 34, streaming: 27, content: 20, workstation: 26, ai: 40, office: 0 };
  const hasGpu = parts.gpu && (USE_CASES_GPU_ALLOC[useCase] || 0) > 0;
  const gpuIsNvidia = parts.gpu && /nvidia|rtx|gtx/i.test((parts.gpu.brand || "") + (parts.gpu.name || ""));
  const gpuColor = gpuIsNvidia ? "#76b900" : "#ed1c24";
  const ramSticks = parts.ram ? (parts.ram.cap >= 64 ? 4 : 2) : 2;

  return (
    <div style={{ height: "420px", background: "#070a0f", borderRadius: "10px", overflow: "hidden" }}>
      <Canvas camera={{ position: [0, 1, 6], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 4, 3]} intensity={1.2} color="#19e8db" />
        <pointLight position={[-3, -2, 2]} intensity={0.6} color="#7c5cff" />
        <SpinningBuild parts={parts} useCase={useCase} hasGpu={hasGpu} gpuColor={gpuColor} ramSticks={ramSticks} />
      </Canvas>
      <div style={{ textAlign: "center", fontSize: "0.75rem", color: "#7c8798", marginTop: "6px" }}>
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
