import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Group, MathUtils, Mesh } from "three";
import type { MotionValue } from "framer-motion";
import { useMotionSettings } from "./Motion";
type Props = {
  progress?: MotionValue<number>;
  exploded?: number;
  speed?: number;
  wireframe?: boolean;
  variant?: number;
  interactive?: boolean;
  angle?: number;
};
function Artifact({
  progress,
  exploded = 0,
  speed = 1,
  wireframe = false,
  variant = 0,
  interactive = false,
  angle = 0,
  enabled,
}: Props & { enabled: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
  }, [angle, exploded, variant, wireframe, enabled, invalidate]);
  const group = useRef<Group>(null),
    core = useRef<Mesh>(null);
  const rings = useRef<(Mesh | null)[]>([]),
    elapsed = useRef(0);
  useFrame(({ pointer }, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    if (enabled) elapsed.current += dt * speed;
    const p = enabled ? (progress?.get() ?? 0) : 0;
    const opening = exploded + p * 1.6;
    if (!interactive) {
      group.current.rotation.x = MathUtils.damp(
        group.current.rotation.x,
        0.55 + p * 1.8 + (enabled ? pointer.y * 0.13 : 0),
        3,
        dt,
      );
      group.current.rotation.y = MathUtils.damp(
        group.current.rotation.y,
        -0.5 + elapsed.current * 0.13 + p * 2 + (enabled ? pointer.x * 0.2 : 0),
        3,
        dt,
      );
      group.current.rotation.z = MathUtils.damp(
        group.current.rotation.z,
        -0.28 + p * 0.5,
        3,
        dt,
      );
    } else {
      group.current.rotation.z = -0.28 + angle;
    }
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const a = (i / 32) * Math.PI * 2,
        r = 1.64 + opening * 0.38;
      ring.position.set(
        Math.cos(a) * r,
        Math.sin(a) * r,
        Math.sin(a * 3 + elapsed.current * 0.4) * opening * 0.34,
      );
      ring.rotation.set(
        opening * Math.sin(a) * 0.65,
        opening * Math.cos(a) * 0.65,
        a,
      );
    });
    if (core.current) {
      core.current.rotation.x = elapsed.current * 0.21;
      core.current.rotation.y = elapsed.current * 0.18;
    }
  });
  return (
    <group ref={group} rotation={[0.55, -0.5, -0.28]}>
      {Array.from({ length: 32 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            rings.current[i] = el;
          }}
          position={[
            Math.cos((i / 32) * Math.PI * 2) * 1.64,
            Math.sin((i / 32) * Math.PI * 2) * 1.64,
            0,
          ]}
          rotation={[0, 0, (i / 32) * Math.PI * 2]}
        >
          <torusGeometry args={[0.58, 0.075, 12, 40]} />
          <meshStandardMaterial
            color={variant === 1 ? "#f9f1df" : "#c8ccd1"}
            metalness={variant === 1 ? 0.2 : 1}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      ))}
      <mesh ref={core} scale={0.72}>
        {variant === 2 ? (
          <icosahedronGeometry args={[1.25, 1]} />
        ) : (
          <torusKnotGeometry args={[0.76, 0.24, 140, 18, 2, 3]} />
        )}
        <meshStandardMaterial
          color="#d5ff00"
          metalness={0.45}
          roughness={0.28}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="sculpture-fallback">
        <span />
        <span />
        <span />
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function Sculpture(props: Props) {
  const { enabled } = useMotionSettings();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true),
    [supported, setSupported] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2");
      setSupported(!!gl);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setSupported(false);
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="sculpture-canvas"
      role="img"
      aria-label="Segmented chrome sculpture with a lime knot, opening as you scroll"
    >
      <SceneBoundary>
        {supported ? (
          <Canvas
            camera={{ position: [0, 0, 7.8], fov: 39 }}
            dpr={[1, 1.5]}
            frameloop={visible && enabled ? "always" : "demand"}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 5, 4]} intensity={3} />
            <Environment resolution={128}>
              <Lightformer
                intensity={4}
                position={[0, 5, -3]}
                scale={[10, 3, 1]}
              />
              <Lightformer
                intensity={5}
                position={[-5, 0, 2]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[6, 12, 1]}
              />
              <Lightformer
                intensity={3}
                position={[5, 2, 2]}
                rotation={[0, -Math.PI / 2, 0]}
                scale={[5, 10, 1]}
              />
              <Lightformer
                color="#d5ff00"
                intensity={2}
                position={[0, -4, 1]}
                scale={[6, 2, 1]}
              />
            </Environment>
            <Artifact {...props} enabled={enabled} />
            {props.interactive && (
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate={enabled}
                autoRotateSpeed={props.speed ?? 1}
              />
            )}
          </Canvas>
        ) : (
          <div className="sculpture-fallback">
            <span />
            <span />
            <span />
          </div>
        )}
      </SceneBoundary>
    </div>
  );
}
