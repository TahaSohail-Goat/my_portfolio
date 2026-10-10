import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import {
  BufferAttribute, BufferGeometry, DoubleSide, DynamicDrawUsage, ExtrudeGeometry,
  Group, MathUtils, ShaderMaterial, Shape,
} from "three";

type Props = { duration: number; onFinish: () => void; onPhase: (phase: number) => void };
const wheelPositions = [[-1.06, 0.42, 0.78], [-1.06, 0.42, -0.78], [1.05, 0.42, 0.78], [1.05, 0.42, -0.78]] as const;

function Wheel({ index, wheels, steering }: {
  index: number; wheels: React.RefObject<(Group | null)[]>; steering: React.RefObject<(Group | null)[]>;
}) {
  return <group position={[...wheelPositions[index]]} ref={el => { steering.current[index] = el; }}>
    <group ref={el => { wheels.current[index] = el; }}>
      <mesh><torusGeometry args={[0.3, 0.12, 10, 24]} /><meshStandardMaterial color="#12160f" roughness={0.9} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.285, 0.285, 0.18, 24]} /><meshStandardMaterial color="#647264" metalness={0.95} roughness={0.22} /></mesh>
      {[1, -1].map(side => <group key={side} position={[0, 0, side * 0.105]}>
        <mesh><circleGeometry args={[0.235, 24]} /><meshStandardMaterial side={DoubleSide} color="#20271e" metalness={0.6} /></mesh>
        {Array.from({ length: 5 }, (_, i) => <mesh key={i} rotation={[0, 0, i * Math.PI * 2 / 5]}>
          <boxGeometry args={[0.045, 0.43, 0.025]} /><meshStandardMaterial color="#dce4ce" metalness={1} roughness={0.2} />
        </mesh>)}
        <mesh><sphereGeometry args={[0.07, 10, 8]} /><meshStandardMaterial color="#d5ff00" metalness={0.5} roughness={0.3} /></mesh>
      </group>)}
    </group>
  </group>;
}

function Car({ car, wheels, steering }: {
  car: React.RefObject<Group | null>; wheels: React.RefObject<(Group | null)[]>; steering: React.RefObject<(Group | null)[]>;
}) {
  const cabin = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.86, 0.66);
    shape.lineTo(-0.45, 1.18);
    shape.quadraticCurveTo(-0.36, 1.24, -0.22, 1.24);
    shape.lineTo(0.35, 1.2);
    shape.lineTo(0.98, 0.66);
    shape.closePath();
    return new ExtrudeGeometry(shape, { depth: 1.12, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.025, bevelThickness: 0.025 });
  }, []);
  useEffect(() => () => cabin.dispose(), [cabin]);
  return <group ref={car} position={[-16, 0, -0.6]}>
    <RoundedBox args={[3.42, 0.44, 1.5]} radius={0.12} smoothness={3} position={[0, 0.57, 0]} castShadow>
      <meshStandardMaterial color="#263024" metalness={0.85} roughness={0.24} />
    </RoundedBox>
    <RoundedBox args={[1.05, 0.08, 1.39]} radius={0.035} smoothness={2} position={[1.13, 0.79, 0]} rotation={[0, 0, -0.06]} castShadow>
      <meshStandardMaterial color="#273424" metalness={0.9} roughness={0.21} />
    </RoundedBox>
    <mesh geometry={cabin} position={[0, 0, -0.56]} castShadow>
      <meshStandardMaterial color="#354b3e" metalness={0.75} roughness={0.14} />
    </mesh>
    <RoundedBox args={[0.91, 0.055, 1.15]} radius={0.025} smoothness={2} position={[-0.05, 1.24, 0]} rotation={[0, 0, -0.055]} castShadow>
      <meshStandardMaterial color="#1c271c" metalness={0.8} roughness={0.22} />
    </RoundedBox>
    <mesh position={[-0.57, 0.96, 0]} rotation={[0, 0, -0.65]}>
      <boxGeometry args={[0.055, 0.66, 1.18]} /><meshStandardMaterial color="#1b241a" metalness={0.7} roughness={0.3} />
    </mesh>
    <mesh position={[0.3, 0.97, 0]} rotation={[0, 0, 0.1]}>
      <boxGeometry args={[0.045, 0.45, 1.17]} /><meshStandardMaterial color="#1b241a" metalness={0.7} roughness={0.3} />
    </mesh>
    {/* Twin lime stripes run across hood, roof and rear deck. */}
    {[-0.15, 0.15].map(z => <group key={z}>
      <mesh position={[1.12, 0.841, z]} rotation={[0, 0, -0.06]}><boxGeometry args={[1.02, 0.012, 0.09]} /><meshBasicMaterial color="#d5ff00" /></mesh>
      <mesh position={[-0.05, 1.274, z]} rotation={[0, 0, -0.055]}><boxGeometry args={[0.84, 0.008, 0.09]} /><meshBasicMaterial color="#d5ff00" /></mesh>
      <mesh position={[-1.26, 0.797, z]}><boxGeometry args={[0.65, 0.009, 0.09]} /><meshBasicMaterial color="#d5ff00" /></mesh>
    </group>)}
    {[1, -1].map(side => <group key={side}>
      <mesh position={[0, 0.42, side * 0.756]}><boxGeometry args={[2.9, 0.045, 0.026]} /><meshBasicMaterial color="#d5ff00" /></mesh>
      <RoundedBox args={[0.18, 0.08, 0.23]} radius={0.025} smoothness={2} position={[0.75, 0.83, side * 0.69]}><meshStandardMaterial color="#1b241a" metalness={0.8} roughness={0.3} /></RoundedBox>
      <mesh position={[1.719, 0.65, side * 0.52]}><boxGeometry args={[0.025, 0.055, 0.33]} /><meshBasicMaterial color="#f8ffe6" toneMapped={false} /></mesh>
      <mesh position={[-1.72, 0.64, side * 0.52]}><boxGeometry args={[0.025, 0.065, 0.32]} /><meshBasicMaterial color="#fd583c" toneMapped={false} /></mesh>
    </group>)}
    <mesh position={[1.72, 0.45, 0]}><boxGeometry args={[0.045, 0.15, 0.79]} /><meshStandardMaterial color="#0d130c" roughness={0.8} /></mesh>
    <mesh position={[1.71, 0.32, 0]}><boxGeometry args={[0.16, 0.04, 1.65]} /><meshStandardMaterial color="#161e14" metalness={0.7} roughness={0.4} /></mesh>
    <mesh position={[-1.49, 1.04, 0]} castShadow><boxGeometry args={[0.24, 0.065, 1.72]} /><meshStandardMaterial color="#172115" metalness={0.85} roughness={0.25} /></mesh>
    {[-0.5, 0.5].map(z => <mesh key={z} position={[-1.48, 0.91, z]}><boxGeometry args={[0.045, 0.22, 0.045]} /><meshStandardMaterial color="#1b241a" /></mesh>)}
    {wheelPositions.map((_, index) => <Wheel key={index} index={index} wheels={wheels} steering={steering} />)}
  </group>;
}

function createSkid() {
  const geometry = new BufferGeometry();
  const position = new Float32Array(240 * 2 * 3);
  const indices = [];
  for (let i = 0; i < 239; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geometry.setAttribute("position", new BufferAttribute(position, 3).setUsage(DynamicDrawUsage));
  geometry.setIndex(indices);
  geometry.setDrawRange(0, 0);
  return { geometry, position };
}
function createSmoke() {
  const geometry = new BufferGeometry();
  const positions = new Float32Array(48 * 3);
  const lives = new Float32Array(48);
  geometry.setAttribute("position", new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage));
  geometry.setAttribute("aLife", new BufferAttribute(lives, 1).setUsage(DynamicDrawUsage));
  const material = new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uRatio: { value: 1 } },
    vertexShader: `attribute float aLife; varying float vLife; uniform float uRatio;
      void main(){vLife=aLife; vec4 v=modelViewMatrix*vec4(position,1.0);
      gl_Position=projectionMatrix*v; gl_PointSize=(65.0+(1.0-aLife)*90.0)*uRatio/max(1.0,-v.z/10.0);}`,
    fragmentShader: `varying float vLife; void main(){float r=length(gl_PointCoord-0.5)*2.0;
      float a=(1.0-smoothstep(0.0,1.0,r))*vLife*0.24;
      gl_FragColor=vec4(vec3(0.30,0.35,0.24),a);}`,
  });
  return { geometry, positions, lives, material };
}

function Drive({ duration, onFinish, onPhase }: Props) {
  const car = useRef<Group>(null), wheels = useRef<(Group | null)[]>([]), steering = useRef<(Group | null)[]>([]);
  const tracks = useMemo(() => [createSkid(), createSkid()], []);
  const smoke = useMemo(createSmoke, []);
  const start = useRef<number | null>(null), finished = useRef(false), samples = useRef(0), smokeIndex = useRef(0), emission = useRef(0);
  useEffect(() => () => {
    tracks.forEach(track => track.geometry.dispose());
    smoke.geometry.dispose(); smoke.material.dispose();
  }, [tracks, smoke]);
  useFrame(({ gl }, delta) => {
    if (!car.current || finished.current) return;
    const dt = Math.min(delta, 0.05);
    const now = performance.now();
    start.current ??= now;
    const p = Math.min(1, (now - start.current) / (duration * 1000));
    let x: number, z: number, yaw: number;
    if (p < 0.28) {
      const u = p / 0.28;
      x = MathUtils.lerp(-17, -1.6, 1 - Math.pow(1 - u, 2));
      z = -0.5;
      yaw = -0.07;
    } else if (p < 0.7) {
      const u = (p - 0.28) / 0.42;
      x = MathUtils.lerp(-1.6, 2.2, u);
      z = -0.5 + Math.sin(u * Math.PI) * 1.2;
      yaw = -Math.sin(u * Math.PI * 1.15) * 1.12;
    } else {
      const u = (p - 0.7) / 0.3;
      x = 2.2 + Math.pow(u, 1.7) * 17;
      z = MathUtils.lerp(-0.1, -1, u);
      yaw = MathUtils.lerp(0.5, 0, MathUtils.smoothstep(u, 0, 0.4));
    }
    car.current.position.set(x, Math.sin(p * Math.PI * 8) * 0.014, z);
    car.current.rotation.set(0, yaw, Math.sin(p * Math.PI) * -0.026);
    wheels.current.forEach(wheel => { if (wheel) wheel.rotation.z -= dt * (p > 0.7 ? 35 : 22); });
    steering.current.forEach((wheel, i) => { if (wheel && i > 1) wheel.rotation.y = p > 0.28 && p < 0.7 ? -yaw * 0.5 : 0; });
    if (p > 0.28 && p < 0.72 && samples.current < 240) {
      const index = samples.current++;
      tracks.forEach((track, side) => {
        const wz = side === 0 ? 0.78 : -0.78;
        const px = x - 1.06 * Math.cos(yaw) + wz * Math.sin(yaw);
        const pz = z + 1.06 * Math.sin(yaw) + wz * Math.cos(yaw);
        for (let edge = 0; edge < 2; edge++) {
          const spread = edge === 0 ? -0.065 : 0.065;
          track.position.set([px + spread * Math.sin(yaw), 0.012, pz + spread * Math.cos(yaw)], (index * 2 + edge) * 3);
        }
        track.geometry.attributes.position.needsUpdate = true;
        track.geometry.setDrawRange(0, Math.max(0, (index - 1) * 6));
      });
      emission.current += dt;
      if (emission.current > 0.045) {
        emission.current = 0;
        const i = (smokeIndex.current++ % 48);
        smoke.positions.set([x - 1.05 * Math.cos(yaw), 0.45, z + 1.05 * Math.sin(yaw) + 0.6], i * 3);
        smoke.lives[i] = 1;
      }
    }
    for (let i = 0; i < 48; i++) {
      if (smoke.lives[i] <= 0) continue;
      smoke.lives[i] = Math.max(0, smoke.lives[i] - dt * 0.6);
      smoke.positions[i * 3] -= dt * 0.28;
      smoke.positions[i * 3 + 1] += dt * 0.45;
      smoke.positions[i * 3 + 2] += dt * 0.15;
    }
    smoke.geometry.attributes.position.needsUpdate = true;
    smoke.geometry.attributes.aLife.needsUpdate = true;
    smoke.material.uniforms.uRatio.value = gl.getPixelRatio();
    onPhase(p);
    if (p >= 1) { finished.current = true; onFinish(); }
  });
  return <>
    <Car car={car} wheels={wheels} steering={steering} />
    {tracks.map((track, i) => <mesh key={i} geometry={track.geometry} frustumCulled={false} dispose={null}>
      <meshBasicMaterial color="#26311c" transparent opacity={0.28} side={DoubleSide} depthWrite={false} />
    </mesh>)}
    <points geometry={smoke.geometry} material={smoke.material} frustumCulled={false} dispose={null} />
  </>;
}

export default function DriftScene(props: Props) {
  return <Canvas camera={{ position: [3.8, 4.5, 9], fov: 34 }} dpr={[1, 1.5]} shadows
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
    <ambientLight intensity={1.5} />
    <directionalLight position={[-3, 7, 5]} intensity={4} castShadow shadow-mapSize={[1024, 1024]}
      shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-normalBias={0.04} />
    <Environment resolution={64}>
      <Lightformer intensity={4} position={[0, 5, -3]} scale={[10, 3, 1]} />
      <Lightformer intensity={3} position={[-5, 1, 3]} rotation={[0, Math.PI / 2, 0]} scale={[6, 8, 1]} />
      <Lightformer intensity={3} position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 10, 1]} />
    </Environment>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[200, 200]} /><shadowMaterial transparent opacity={0.2} /></mesh>
    <Drive {...props} />
  </Canvas>;
}
