import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function Starfield() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Slow ambient drift
    groupRef.current.rotation.y += delta * 0.018;
    groupRef.current.rotation.x += delta * 0.009;
    // Subtle mouse parallax
    groupRef.current.position.x += (mouse.current.x * 0.5 - groupRef.current.position.x) * 0.04;
    groupRef.current.position.y += (mouse.current.y * 0.5 - groupRef.current.position.y) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={100}
        depth={55}
        count={2500}
        factor={3.5}
        saturation={0}
        fade
        speed={1}
      />
    </group>
  );
}

export function Background3D() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1, background: 'linear-gradient(160deg, #040404 0%, #080808 50%, #040404 100%)' }}
    >
      {/* Three.js starfield */}
      <Canvas dpr={[1, 1.2]} camera={{ position: [0, 0, 1] }}>
        <fog attach="fog" args={['#040404', 30, 95]} />
        <Starfield />
      </Canvas>

      {/* CSS grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 grid-bg"
        style={{ opacity: 0.45 }}
      />

      {/* Top radial accent glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: '80vw',
          height: '50vh',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,245,212,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom vignette */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(4,4,4,0.8), transparent)',
        }}
      />
    </div>
  );
}
