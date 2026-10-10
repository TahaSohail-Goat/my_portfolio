import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, Color, DynamicDrawUsage, MathUtils, ShaderMaterial } from "three";
import type { MotionValue } from "framer-motion";
import { useMotionSettings } from "./Motion";
import "./particle-monogram.css";

type Props = { progress: MotionValue<number> };
type Pointer = { x: number; y: number; active: boolean };

// A local vector mask keeps the initials independent of fonts and network assets.
function createParticles(count: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 400;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(35, 55);
  ctx.lineTo(295, 55);
  ctx.lineTo(295, 121);
  ctx.lineTo(203, 121);
  ctx.lineTo(203, 345);
  ctx.lineTo(127, 345);
  ctx.lineTo(127, 121);
  ctx.lineTo(35, 121);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(575, 101);
  ctx.bezierCurveTo(515, 48, 359, 64, 359, 142);
  ctx.bezierCurveTo(359, 207, 573, 189, 573, 265);
  ctx.bezierCurveTo(573, 349, 411, 355, 348, 301);
  ctx.lineWidth = 66;
  ctx.lineCap = "butt";
  ctx.strokeStyle = "white";
  ctx.stroke();
  const mask = ctx.getImageData(0, 0, 640, 400).data;
  let seed = 85431;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const base = new Float32Array(count * 3);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const offsets = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const lime = new Color("#d5ff00"), silver = new Color("#e5ece5");
  const letterCount = Math.floor(count * 0.91);
  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0;
    if (i < letterCount) {
      do {
        x = Math.floor(random() * 640);
        y = Math.floor(random() * 400);
      } while (mask[(y * 640 + x) * 4 + 3] < 200);
      x = (x - 320) * 0.0082;
      y = (200 - y) * 0.0082;
      z = (random() - 0.5) * 0.56;
    } else {
      const a = random() * Math.PI * 2;
      x = Math.cos(a) * (2.4 + random() * 0.3);
      y = Math.sin(a) * (1.5 + random() * 0.25);
      z = (random() - 0.5) * 1.25;
    }
    base.set([x, y, z], i * 3);
    positions.set([x, y, z], i * 3);
    const color = random() > 0.3 ? lime : silver;
    const brightness = 0.64 + random() * 0.36;
    colors.set([color.r * brightness, color.g * brightness, color.b * brightness], i * 3);
    sizes[i] = i < letterCount ? 0.029 + random() * 0.023 : 0.018 + random() * 0.015;
    phases[i] = random() * Math.PI * 2;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
  return { geometry, base, positions, phases, offsets, velocities, letterCount, count };
}

const vertexShader = `
  attribute float aSize;
  varying vec3 vColor;
  uniform float uPixelRatio;
  uniform float uTime;
  void main() {
    vColor = color * (0.94 + 0.06 * sin(uTime * 1.4 + position.x * 3.0));
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = clamp(aSize * uPixelRatio * 670.0 / -viewPosition.z, 1.0, 9.0);
  }
`;
const fragmentShader = `
  varying vec3 vColor;
  void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float radius = dot(p, p);
    if (radius > 1.0) discard;
    vec3 normal = vec3(p.x, -p.y, sqrt(1.0 - radius));
    float light = max(dot(normal, normalize(vec3(-0.4, 0.65, 1.0))), 0.0);
    float shine = pow(max(dot(normal, normalize(vec3(-0.35, 0.45, 1.0))), 0.0), 24.0);
    vec3 shaded = vColor * (0.38 + light * 0.68) + vec3(0.7) * shine;
    gl_FragColor = vec4(shaded, 1.0 - smoothstep(0.8, 1.0, radius));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function ParticleField({ progress, pointer, enabled, count }: Props & {
  pointer: React.RefObject<Pointer>;
  enabled: boolean;
  count: number;
}) {
  const particles = useMemo(() => createParticles(count), [count]);
  const { gl, viewport, size } = useThree();
  const material = useMemo(() => new ShaderMaterial({
    vertexShader, fragmentShader, vertexColors: true, transparent: true,
    depthWrite: true,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: gl.getPixelRatio() } },
  }), [gl]);
  const time = useRef(0), phase = useRef(progress.get());
  useEffect(() => () => {
    particles.geometry.dispose();
    material.dispose();
  }, [particles, material]);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.033);
    if (enabled) time.current += dt;
    const t = time.current;
    phase.current = MathUtils.damp(phase.current, progress.get(), 8, dt);
    const p = phase.current;
    const gather = MathUtils.smoothstep(p, 0.26, 0.51);
    const ribbon = MathUtils.smoothstep(p, 0.65, 0.8) * (1 - MathUtils.smoothstep(p, 0.84, 0.99));
    const turn = MathUtils.smoothstep(p, 0.83, 1);
    const rotation = 0.24 - turn * 0.67 + Math.sin(t * 0.35) * 0.055;
    const cos = Math.cos(rotation), sin = Math.sin(rotation);
    const fit = Math.min(1, viewport.width / 6.6);
    const cursor = pointer.current;
    const px = cursor.x * viewport.width / 2, py = cursor.y * viewport.height / 2;
    const { base, positions, phases, offsets, velocities, letterCount } = particles;
    for (let i = 0; i < count; i++) {
      const k = i * 3, a = phases[i];
      let x = base[k], y = base[k + 1], z = base[k + 2];
      if (i >= letterCount) {
        const orbit = a + t * 0.22;
        x = Math.cos(orbit) * 2.65;
        y = Math.sin(orbit) * 1.7;
        z = Math.sin(orbit * 2 + t * 0.25) * 0.65;
      } else {
        // Gentle depth waves make the assembled monogram feel alive.
        z += Math.sin(x * 2.2 + t * 1.1 + a) * 0.065;
        y += Math.sin(t * 0.7 + x * 1.5) * 0.025;
      }
      const theta = a + t * 0.38;
      const scatterX = Math.cos(theta) * (1.4 + (i % 29) / 18);
      const scatterY = Math.sin(theta) * (0.8 + (i % 19) / 22);
      const scatterZ = Math.sin(theta * 2) * 0.9;
      x = MathUtils.lerp(scatterX, x, gather);
      y = MathUtils.lerp(scatterY, y, gather);
      z = MathUtils.lerp(scatterZ, z, gather);
      const u = i / letterCount;
      const lane = i % 3;
      const flow = u * Math.PI * 3.5 + t * 0.85 + lane * 1.7;
      x = MathUtils.lerp(x, (u - 0.5) * 4.7, ribbon);
      y = MathUtils.lerp(y, Math.sin(flow) * (0.65 + lane * 0.18), ribbon);
      z = MathUtils.lerp(z, Math.cos(flow) * 0.8 + (lane - 1) * 0.28, ribbon);
      const rx = x * cos + z * sin;
      z = -x * sin + z * cos;
      x = rx * fit;
      y *= fit;
      z *= fit;
      const dx = x + offsets[k] - px, dy = y + offsets[k + 1] - py;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = enabled && cursor.active ? Math.max(0, 1 - distance / 0.85) * 22 : 0;
      // A damped spring returns each particle after the pointer has passed.
      for (let axis = 0; axis < 3; axis++) {
        const direction = axis === 0 ? dx / Math.max(distance, 0.03)
          : axis === 1 ? dy / Math.max(distance, 0.03) : 0.65;
        velocities[k + axis] += (direction * force - offsets[k + axis] * 48 - velocities[k + axis] * 9) * dt;
        offsets[k + axis] += velocities[k + axis] * dt;
      }
      positions[k] = x + offsets[k];
      positions[k + 1] = y + offsets[k + 1];
      positions[k + 2] = z + offsets[k + 2];
    }
    particles.geometry.attributes.position.needsUpdate = true;
    material.uniforms.uTime.value = t;
    // Scale splats with the canvas height, including compact/mobile viewports.
    material.uniforms.uPixelRatio.value = gl.getPixelRatio() * Math.min(1.25, size.height / 650);
  });
  return <points geometry={particles.geometry} material={material} frustumCulled={false} dispose={null} />;
}

function Fallback() {
  return <div className="particle-monogram-fallback">TS</div>;
}
class ParticleBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <Fallback /> : this.props.children; }
}

export default function ParticleMonogram({ progress }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: false });
  const { enabled } = useMotionSettings();
  const [supported, setSupported] = useState(false);
  const [visible, setVisible] = useState(false);
  const [revealed, setRevealed] = useState(() => progress.get() > 0.2);
  const [count] = useState(() => window.matchMedia("(max-width: 600px)").matches ? 3800 : 7600);
  useEffect(() => {
    return progress.on("change", value => setRevealed(value > 0.2));
  }, [progress]);
  useEffect(() => {
    try {
      const probe = document.createElement("canvas");
      const context = probe.getContext("webgl2");
      setSupported(!!context);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { setSupported(false); }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    // Listen on the window: the existing hero deliberately lets pointers pass
    // through its artwork so links, portrait controls and touch scrolling work.
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      pointer.current = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
        active: progress.get() > 0.4 && event.clientX >= rect.left && event.clientX <= rect.right
          && event.clientY >= rect.top && event.clientY <= rect.bottom,
      };
    };
    const leave = () => { pointer.current.active = false; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, [progress]);
  const active = visible && enabled && revealed;
  return (
    <div ref={ref} className="sculpture-canvas particle-monogram" role="img"
      aria-label="Lime and silver particles form TS, flow into ribbons and rebuild as you scroll">
      <ParticleBoundary>
        {supported ? <Canvas camera={{ position: [0, 0, 8], fov: 40 }} resize={{ offsetSize: true }}
          dpr={[1, 1.5]} frameloop={active ? "always" : "demand"}
          gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}>
          <ParticleField progress={progress} pointer={pointer} enabled={active} count={count} />
        </Canvas> : <Fallback />}
      </ParticleBoundary>
    </div>
  );
}
