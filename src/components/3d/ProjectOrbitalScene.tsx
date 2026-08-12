/**
 * ProjectOrbitalScene.tsx
 *
 * Interactive solar-system visualization for the Featured Projects section.
 * Each planet uses a real photographic texture sourced from NASA/JPL public-domain imagery.
 * See /public/textures/planets/ATTRIBUTION.md for full attribution details.
 *
 * Planets:
 *   Earth   → project[0]  (Disaster Management System)
 *   Venus   → project[1]  (CDIEM)
 *   Mars    → project[2]  (SeaRoute Navigator)
 *   Neptune → project[3]  (Magical Pet Kingdom)
 */

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { projects, Project } from '@/data/projects.data';

/* ─── Constants ─────────────────────────────────────────── */
const ORBIT_RADIUS = 3.3;
const CENTER_R     = 0.45;

/* ─── Planet Definitions ────────────────────────────────── */
const PLANET_CONFIGS = [
  {
    name:          'Earth',
    texturePath:   '/textures/planets/earth.jpg',
    fallbackColor: '#1a6fd4',
    atmColor:      '#1a6fd4',
    emissive:      '#00f5d4',
    roughness:     0.65,
    metalness:     0.05,
    radius:        0.30,
    rotationSpeed: 0.18,
    ring:          false,
    ringColor:     '#00f5d4',
    ringRadius:    0.46,
    axialTilt:     0.41,
  },
  {
    name:          'Venus',
    texturePath:   '/textures/planets/venus.jpg',
    fallbackColor: '#d97706',
    atmColor:      '#d4a256',
    emissive:      '#c47a1a',
    roughness:     0.5,
    metalness:     0.05,
    radius:        0.26,
    rotationSpeed: 0.06,
    ring:          false,
    ringColor:     '#f59e0b',
    ringRadius:    0.40,
    axialTilt:     3.10,
  },
  {
    name:          'Mars',
    texturePath:   '/textures/planets/mars.png',
    fallbackColor: '#b91c1c',
    atmColor:      '#c1440e',
    emissive:      '#8b2500',
    roughness:     0.85,
    metalness:     0.02,
    radius:        0.22,
    rotationSpeed: 0.20,
    ring:          false,
    ringColor:     '#ef4444',
    ringRadius:    0.36,
    axialTilt:     0.44,
  },
  {
    name:          'Neptune',
    texturePath:   '/textures/planets/neptune.jpg',
    fallbackColor: '#0284c7',
    atmColor:      '#1a4fd4',
    emissive:      '#1565c0',
    roughness:     0.3,
    metalness:     0.1,
    radius:        0.32,
    rotationSpeed: 0.28,
    ring:          true,
    ringColor:     '#38bdf8',
    ringRadius:    0.52,
    axialTilt:     0.49,
  },
];

/* ─── Safe texture loader hook (never throws) ───────────── */
function useSafeTexture(path: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      path,
      (tex) => {
        if (cancelled) { tex.dispose(); return; }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.warn(`[PlanetTexture] Could not load ${path}:`, err);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [path]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { texture?.dispose(); };
  }, [texture]);

  return texture;
}

/* ─── Atmospheric Glow ──────────────────────────────────── */
function AtmosphericGlow({
  radius, color, isActive, isHovered,
}: {
  radius: number; color: string; isActive: boolean; isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    const target = isActive ? 0.55 : isHovered ? 0.38 : 0.18;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, target, delta * 4);
  });

  return (
    <mesh ref={meshRef} renderOrder={-1}>
      <sphereGeometry args={[radius + 0.14, 24, 24]} />
      <meshBasicMaterial
        color={new THREE.Color(color)}
        transparent
        opacity={0.18}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─── Selection Ring ────────────────────────────────────── */
function SelectionRing({ radius, color, visible }: { radius: number; color: string; visible: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += delta * 0.4;
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, visible ? 0.8 : 0, delta * 5);
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
      <ringGeometry args={[radius + 0.14, radius + 0.20, 64]} />
      <meshBasicMaterial
        color={new THREE.Color(color)}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─── Textured Planet Sphere ────────────────────────────── */
function PlanetSphere({
  config, isActive, isHovered,
}: {
  config: typeof PLANET_CONFIGS[0]; isActive: boolean; isHovered: boolean;
}) {
  const planetRef   = useRef<THREE.Mesh>(null);
  const texture     = useSafeTexture(config.texturePath);   // safe — never throws
  const emissiveCol = useMemo(() => new THREE.Color(config.emissive), [config.emissive]);
  const fallbackCol = useMemo(() => new THREE.Color(config.fallbackColor), [config.fallbackColor]);

  useFrame((_, delta) => {
    if (!planetRef.current) return;
    planetRef.current.rotation.y += delta * config.rotationSpeed;

    const mat = planetRef.current.material as THREE.MeshStandardMaterial;
    const targetIntensity = isActive ? 0.45 : isHovered ? 0.25 : 0.06;
    mat.emissive.lerp(emissiveCol, delta * 3);
    (mat as any).emissiveIntensity = THREE.MathUtils.lerp(
      (mat as any).emissiveIntensity ?? 0,
      targetIntensity,
      delta * 4,
    );
    // Swap map if texture just loaded
    if (texture && mat.map !== texture) {
      mat.map = texture;
      mat.color.set(0xffffff);
      mat.needsUpdate = true;
    } else if (!texture && !mat.map) {
      mat.color.copy(fallbackCol);
    }
  });

  return (
    <mesh ref={planetRef} rotation={[config.axialTilt, 0, 0]}>
      <sphereGeometry args={[config.radius, 48, 48]} />
      <meshStandardMaterial
        color={texture ? '#ffffff' : config.fallbackColor}
        map={texture ?? undefined}
        emissive={emissiveCol}
        emissiveIntensity={0.06}
        roughness={config.roughness}
        metalness={config.metalness}
      />
    </mesh>
  );
}

/* ─── Planetary Ring (Neptune) ──────────────────────────── */
function PlanetaryRing({ config, isActive }: { config: typeof PLANET_CONFIGS[0]; isActive: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.15;
  });
  return (
    <mesh ref={ringRef} rotation={[Math.PI / 3.5, 0, 0]}>
      <ringGeometry args={[config.radius + 0.08, config.ringRadius, 64]} />
      <meshBasicMaterial
        color={new THREE.Color(config.ringColor)}
        transparent
        opacity={isActive ? 0.6 : 0.28}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─── Project Planet Node ───────────────────────────────── */
interface NodeProps {
  project: Project;
  index: number;
  total: number;
  activeIndex: number;
  hoveredIndex: number | null;
  onHover: (idx: number | null) => void;
  onClick: (idx: number) => void;
  autoAngle: number;
}

function ProjectPlanetNode({ index, total, activeIndex, hoveredIndex, onHover, onClick, autoAngle }: NodeProps) {
  const groupRef  = useRef<THREE.Group>(null);
  const isActive  = index === activeIndex;
  const isHovered = hoveredIndex === index;
  const config    = PLANET_CONFIGS[index % PLANET_CONFIGS.length];
  const baseAngle = (index / total) * Math.PI * 2;
  const angle     = baseAngle + autoAngle;
  const x = Math.cos(angle) * ORBIT_RADIUS;
  const z = Math.sin(angle) * ORBIT_RADIUS;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = isActive ? 1.5 : isHovered ? 1.22 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
  });

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      <AtmosphericGlow radius={config.radius} color={config.atmColor} isActive={isActive} isHovered={isHovered} />
      <PlanetSphere config={config} isActive={isActive} isHovered={isHovered} />
      {config.ring && <PlanetaryRing config={config} isActive={isActive} />}
      <SelectionRing radius={config.radius} color={config.ringColor} visible={isActive} />
      {/* Invisible hit sphere for clean pointer events */}
      <mesh
        onPointerEnter={() => { onHover(index); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { onHover(null);  document.body.style.cursor = ''; }}
        onClick={e => { e.stopPropagation(); onClick(index); }}
      >
        <sphereGeometry args={[config.radius + 0.12, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ─── Orbit Ring ────────────────────────────────────────── */
const ThreeLine = 'line' as any;

function OrbitRing() {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * ORBIT_RADIUS, 0, Math.sin(a) * ORBIT_RADIUS));
  }
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), []);
  return (
    <ThreeLine geometry={geom}>
      <lineBasicMaterial color="#00f5d4" transparent opacity={0.14} />
    </ThreeLine>
  );
}

/* ─── Connection Rays ───────────────────────────────────── */
function ConnectionRays({ activeIndex, autoAngle }: { activeIndex: number; autoAngle: number }) {
  const lines = useMemo(() =>
    projects.map((_, i) => {
      const angle = (i / projects.length) * Math.PI * 2 + autoAngle;
      const x = Math.cos(angle) * ORBIT_RADIUS;
      const z = Math.sin(angle) * ORBIT_RADIUS;
      const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, 0, z)];
      return {
        geom: new THREE.BufferGeometry().setFromPoints(pts),
        isActive: i === activeIndex,
      };
    }),
  [activeIndex, autoAngle]);

  return (
    <group>
      {lines.map(({ geom, isActive }, i) => (
        <ThreeLine key={i} geometry={geom}>
          <lineBasicMaterial
            color={isActive ? '#00f5d4' : '#062822'}
            transparent
            opacity={isActive ? 0.55 : 0.12}
          />
        </ThreeLine>
      ))}
    </group>
  );
}

/* ─── Central Sun ───────────────────────────────────────── */
function SunCenterNode() {
  const sunRef    = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (sunRef.current)    sunRef.current.rotation.y    += delta * 0.3;
    if (coronaRef.current) coronaRef.current.rotation.z -= delta * 0.2;
  });

  return (
    <group>
      <mesh ref={sunRef}>
        <sphereGeometry args={[CENTER_R, 32, 32]} />
        <meshStandardMaterial color="#00f5d4" emissive="#00f5d4" emissiveIntensity={0.9} roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh ref={coronaRef} rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[CENTER_R + 0.05, CENTER_R + 0.35, 64]} />
        <meshBasicMaterial color="#00f5d4" transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 4, 0, 0]}>
        <ringGeometry args={[CENTER_R + 0.1, CENTER_R + 0.55, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ─── Camera Rig ────────────────────────────────────────── */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_, delta) => {
    const target = new THREE.Vector3(mouse.current.x * 0.35, 5.2 + mouse.current.y * 0.25, 8.5);
    camera.position.lerp(target, delta * 1.2);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─── Scene ─────────────────────────────────────────────── */
interface SceneProps {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  hoveredIndex: number | null;
  setHoveredIndex: (i: number | null) => void;
  autoAngle: number;
}

function SolarScene({ activeIndex, setActiveIndex, hoveredIndex, setHoveredIndex, autoAngle }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.22} />
      <pointLight position={[0, 0, 0]} intensity={3.5} color="#b2f5ea" distance={18} decay={1.5} />
      <directionalLight position={[6, 8, 4]} intensity={1.1} />
      <directionalLight position={[-8, 2, -4]} intensity={0.25} color="#38bdf8" />
      <CameraRig />
      <SunCenterNode />
      <OrbitRing />
      <ConnectionRays activeIndex={activeIndex} autoAngle={autoAngle} />
      {projects.map((project, i) => (
        <ProjectPlanetNode
          key={project.id}
          project={project}
          index={i}
          total={projects.length}
          activeIndex={activeIndex}
          hoveredIndex={hoveredIndex}
          onHover={setHoveredIndex}
          onClick={setActiveIndex}
          autoAngle={autoAngle}
        />
      ))}
    </>
  );
}

/* ─── Public API ────────────────────────────────────────── */
interface OrbitalSceneProps {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}

export function ProjectOrbitalScene({ activeIndex, setActiveIndex }: OrbitalSceneProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const autoAngleRef = useRef(0);
  const [autoAngle, setAutoAngle]       = useState(0);
  const isPaused = hoveredIndex !== null;

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (isPaused || reducedMotion) return;
    let raf: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      autoAngleRef.current += dt * 0.10;
      setAutoAngle(autoAngleRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPaused, reducedMotion]);

  return (
    <div style={{ width: '100%', height: '420px', cursor: 'default', position: 'relative' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 5.2, 8.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <SolarScene
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
          autoAngle={autoAngle}
        />
      </Canvas>

      {/* Planet Name Pills */}
      <div
        aria-label="Select a planet / project"
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
        }}
      >
        {PLANET_CONFIGS.slice(0, projects.length).map((cfg, i) => (
          <button
            key={cfg.name}
            onClick={() => setActiveIndex(i)}
            aria-label={`Select ${cfg.name}`}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              border: i === activeIndex ? `1px solid ${cfg.ringColor}` : '1px solid rgba(255,255,255,0.08)',
              background: i === activeIndex ? `${cfg.ringColor}22` : 'rgba(255,255,255,0.03)',
              color: i === activeIndex ? cfg.ringColor : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: i === activeIndex ? `0 0 10px ${cfg.ringColor}44` : 'none',
            }}
          >
            {cfg.name}
          </button>
        ))}
      </div>
    </div>
  );
}
