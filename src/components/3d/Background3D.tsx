import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function Starfield() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to -1 to +1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Natural slow drift
      groupRef.current.rotation.y += delta * 0.03;
      groupRef.current.rotation.x += delta * 0.015;

      // Subtle parallax effect shifting towards mouse
      groupRef.current.position.x += (mouse.current.x * 0.8 - groupRef.current.position.x) * 0.05;
      groupRef.current.position.y += (mouse.current.y * 0.8 - groupRef.current.position.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 
        radius: Sphere radius where stars are created
        depth: Depth of the stars sphere
        count: Number of stars (particles)
        factor: Size factor
        saturation: Color saturation (0 = white/grayscale stars)
        fade: Whether stars fade at edges
        speed: Twinkle speed
      */}
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1.5} />
    </group>
  );
}

export function Background3D() {
  return (
    <div 
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{ background: 'linear-gradient(to bottom, #030303, #0a0a0a)' }}
    >
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 1] }}>
        <fog attach="fog" args={['#030303', 30, 90]} />
        <Starfield />
      </Canvas>
    </div>
  );
}
