import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { CanvasTexture, Group, InstancedMesh, MathUtils, Matrix4, SRGBColorSpace, Vector3 } from "three";
import type { MotionValue } from "framer-motion";

type Props = {
  progress: MotionValue<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  hovered: boolean; entering: boolean; enabled: boolean; active: boolean;
};
type Route = { x: number; z: number }[];
const routes: Route[] = [];
for (let side = 0; side < 4; side++) {
  const angle = side * Math.PI / 2;
  for (let lane = 0; lane < 8; lane++) {
    const offset = (lane - 3.5) * 0.19;
    const bend = (lane < 4 ? -1 : 1) * 0.11;
    routes.push([[0.77, offset], [1.0, offset], [1.16, offset + bend], [1.43, offset + bend], [1.58, offset + bend]].map(([x, z]) => ({
      x: x * Math.cos(angle) - z * Math.sin(angle), z: x * Math.sin(angle) + z * Math.cos(angle),
    })));
  }
}

function createTexture(kind: "board" | "lid" | "die") {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 768;
  const ctx = canvas.getContext("2d")!;
  if (kind === "board") {
    ctx.fillStyle = "#19291a"; ctx.fillRect(0, 0, 768, 768);
    const pixel = (value: number) => (value / 3.3 + 0.5) * 768;
    routes.forEach((route, index) => {
      ctx.strokeStyle = index % 4 === 0 ? "#91aa48" : "#405d36";
      ctx.lineWidth = index % 4 === 0 ? 2.2 : 1.5;
      ctx.beginPath(); route.forEach((p, i) => i ? ctx.lineTo(pixel(p.x), pixel(p.z)) : ctx.moveTo(pixel(p.x), pixel(p.z)));
      ctx.stroke();
      const end = route[route.length - 1];
      ctx.fillStyle = "#a1af7b"; ctx.fillRect(pixel(end.x) - 4, pixel(end.z) - 4, 8, 8);
    });
    for (let y = 44; y < 735; y += 48) for (let x = 44; x < 735; x += 48) {
      if (x > 200 && x < 568 && y > 200 && y < 568) continue;
      ctx.fillStyle = "#4c643b"; ctx.beginPath(); ctx.arc(x, y, 1.3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = "#6f8254"; ctx.lineWidth = 2; ctx.strokeRect(17, 17, 734, 734);
    ctx.font = "12px Consolas, monospace"; ctx.fillStyle = "#92a572";
    ctx.fillText("TS / LOGIC BOARD", 38, 41); ctx.fillText("ENGINE 001", 611, 730);
  } else if (kind === "lid") {
    ctx.strokeStyle = "#2a392a"; ctx.lineWidth = 2;
    ctx.strokeRect(74, 74, 620, 620); ctx.strokeRect(86, 86, 596, 596);
    ctx.fillStyle = "#263525"; ctx.textAlign = "center";
    ctx.font = "700 145px Consolas, monospace"; ctx.fillText("TS", 384, 380);
    ctx.font = "21px Consolas, monospace"; ctx.fillText("CURIOSITY / ENGINE", 384, 442);
    ctx.font = "16px Consolas, monospace"; ctx.fillText("LOGIC + IMAGINATION", 384, 482);
    ctx.textAlign = "left"; ctx.font = "14px Consolas, monospace";
    ctx.fillText("VOL. 02", 111, 125); ctx.fillText("001", 612, 125);
    for (let i = 0; i < 24; i++) ctx.fillRect(112 + i * 5, 612, i % 3 === 0 ? 3 : 1, 28);
    ctx.fillText("TAHA SOHAIL", 510, 638);
  } else {
    ctx.fillStyle = "#283c20"; ctx.fillRect(0, 0, 768, 768);
    for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
      const x = 28 + col * 91, y = 28 + row * 91;
      ctx.strokeStyle = (row + col) % 3 === 0 ? "#b6d35e" : "#638544";
      ctx.lineWidth = 2; ctx.strokeRect(x, y, 74, 74);
      ctx.fillStyle = "#39562a"; ctx.fillRect(x + 6, y + 6, 62, 62);
      ctx.strokeStyle = "#67873f"; ctx.lineWidth = 1;
      for (let line = 0; line < 4; line++) { ctx.beginPath(); ctx.moveTo(x + 10, y + 14 + line * 13); ctx.lineTo(x + 61, y + 14 + line * 13); ctx.stroke(); }
    }
    ctx.fillStyle = "#243b1c"; ctx.fillRect(237, 245, 294, 269);
    ctx.strokeStyle = "#d5ff00"; ctx.lineWidth = 3; ctx.strokeRect(248, 256, 272, 247);
    ctx.fillStyle = "#d5ff00"; ctx.textAlign = "center";
    ctx.font = "700 104px Consolas, monospace"; ctx.fillText("TS", 384, 393);
    ctx.font = "17px Consolas, monospace"; ctx.fillText("CORE / 01", 384, 444);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function Pins() {
  const ref = useRef<InstancedMesh>(null);
  useEffect(() => {
    if (!ref.current) return;
    const matrix = new Matrix4();
    let i = 0;
    for (let side = 0; side < 4; side++) for (let pin = 0; pin < 18; pin++) {
      const a = side * Math.PI / 2, offset = (pin - 8.5) * 0.17;
      matrix.makeRotationY(a);
      matrix.setPosition(1.93 * Math.cos(a) - offset * Math.sin(a), -0.015, 1.93 * Math.sin(a) + offset * Math.cos(a));
      ref.current.setMatrixAt(i++, matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return <instancedMesh ref={ref} args={[undefined, undefined, 72]} castShadow>
    <boxGeometry args={[0.42, 0.075, 0.095]} /><meshStandardMaterial color="#bbc6ad" metalness={1} roughness={0.24} />
  </instancedMesh>;
}

function Chip({ progress, pointer, hovered, entering, enabled }: Props) {
  const root = useRef<Group>(null), base = useRef<Group>(null), board = useRef<Group>(null);
  const processor = useRef<Group>(null), lid = useRef<Group>(null), pulses = useRef<InstancedMesh>(null);
  const time = useRef(0), opening = useRef(enabled ? progress.get() : 0.85);
  const { viewport } = useThree();
  const textures = useMemo(() => ({ board: createTexture("board"), lid: createTexture("lid"), die: createTexture("die") }), []);
  const matrix = useMemo(() => new Matrix4(), []), cameraDirection = useMemo(() => new Vector3(5.2, 4.7, 6.6).normalize(), []);
  useEffect(() => () => Object.values(textures).forEach(texture => texture.dispose()), [textures]);
  useFrame((_, delta) => {
    if (!root.current) return;
    const dt = Math.min(delta, 0.05);
    if (enabled) time.current += dt * (hovered ? 1.7 : 1);
    const t = time.current;
    opening.current = MathUtils.damp(opening.current, enabled ? progress.get() : 0.85, 7, dt);
    const p = opening.current;
    const topLift = MathUtils.smoothstep(p, 0.05, 0.52);
    const coreLift = MathUtils.smoothstep(p, 0.27, 0.77);
    const baseDrop = MathUtils.smoothstep(p, 0.48, 0.97);
    if (lid.current) {
      lid.current.position.set(-topLift * 0.35, 0.64 + topLift * 0.94, -topLift * 0.65);
      lid.current.rotation.x = topLift * -0.075;
    }
    if (processor.current) processor.current.position.y = 0.22 + coreLift * 0.37;
    if (board.current) board.current.position.y = -0.06 + coreLift * 0.025;
    if (base.current) base.current.position.y = -0.37 - baseDrop * 0.47;
    const mx = enabled ? pointer.current.x : 0, my = enabled ? pointer.current.y : 0;
    root.current.rotation.x = MathUtils.damp(root.current.rotation.x, my * 0.09, 4, dt);
    root.current.rotation.y = MathUtils.damp(root.current.rotation.y, -0.12 + mx * 0.16 + Math.sin(t * 0.25) * 0.035, 4, dt);
    root.current.rotation.z = MathUtils.damp(root.current.rotation.z, -mx * 0.03, 4, dt);
    const zoom = entering ? 3.8 : 0;
    root.current.position.x = MathUtils.damp(root.current.position.x, cameraDirection.x * zoom, 8, dt);
    root.current.position.y = MathUtils.damp(root.current.position.y, cameraDirection.y * zoom + Math.sin(t * 0.7) * 0.035, 8, dt);
    root.current.position.z = MathUtils.damp(root.current.position.z, cameraDirection.z * zoom, 8, dt);
    root.current.scale.setScalar(Math.min(1, viewport.width / 6.5));
    if (pulses.current) {
      for (let i = 0; i < 16; i++) {
        const route = routes[i * 2];
        const u = (t * 0.38 + i * 0.173) % 1;
        const segment = Math.min(3, Math.floor(u * 4)), fraction = u * 4 - segment;
        matrix.makeTranslation(MathUtils.lerp(route[segment].x, route[segment + 1].x, fraction), 0.077,
          MathUtils.lerp(route[segment].z, route[segment + 1].z, fraction));
        pulses.current.setMatrixAt(i, matrix);
      }
      pulses.current.instanceMatrix.needsUpdate = true;
    }
  });
  return <group ref={root}>
    <group ref={base} position={[0, -0.37, 0]}>
      <RoundedBox args={[3.72, 0.19, 3.52]} radius={0.08} smoothness={3} castShadow>
        <meshStandardMaterial color="#202e1b" metalness={0.75} roughness={0.29} />
      </RoundedBox>
      <mesh position={[0, 0.101, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3.36, 3.2]} /><meshStandardMaterial color="#394a2a" metalness={0.65} roughness={0.36} /></mesh>
      <Pins />
      {[-1.52, 1.52].flatMap(x => [-1.38, 1.38].map(z => <mesh key={`${x}/${z}`} position={[x, 0.13, z]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.15, 12]} /><meshStandardMaterial color="#b7c2a5" metalness={1} roughness={0.25} />
      </mesh>))}
    </group>
    <group ref={board} position={[0, -0.06, 0]}>
      <RoundedBox args={[3.44, 0.1, 3.3]} radius={0.035} smoothness={2} castShadow>
        <meshStandardMaterial color="#37472d" metalness={0.5} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3.3, 3.3]} /><meshBasicMaterial map={textures.board} toneMapped={false} /></mesh>
      <instancedMesh ref={pulses} args={[undefined, undefined, 16]}>
        <sphereGeometry args={[0.029, 8, 6]} /><meshBasicMaterial color="#d5ff00" toneMapped={false} />
      </instancedMesh>
      {[-1.3, 1.3].flatMap(x => [-0.7, 0, 0.7].map(z => <group key={`${x}/${z}`} position={[x, 0.11, z]}>
        <RoundedBox args={[0.3, 0.1, 0.45]} radius={0.018} smoothness={2} castShadow><meshStandardMaterial color="#152211" metalness={0.65} roughness={0.3} /></RoundedBox>
        <mesh position={[0, 0.057, 0]}><boxGeometry args={[0.2, 0.01, 0.25]} /><meshStandardMaterial color="#69785a" metalness={0.9} roughness={0.25} /></mesh>
      </group>))}
      {[-1.16, 1.16].flatMap(z => [-0.62, 0, 0.62].map(x => <mesh key={`${x}/${z}`} position={[x, 0.098, z]} castShadow>
        <boxGeometry args={[0.28, 0.085, 0.15]} /><meshStandardMaterial color="#9fac87" metalness={0.7} roughness={0.28} />
      </mesh>))}
    </group>
    <group ref={processor} position={[0, 0.22, 0]}>
      <RoundedBox args={[1.58, 0.18, 1.53]} radius={0.055} smoothness={3} castShadow><meshStandardMaterial color="#5c7047" metalness={0.85} roughness={0.24} /></RoundedBox>
      <RoundedBox args={[1.34, 0.07, 1.3]} radius={0.035} smoothness={3} position={[0, 0.11, 0]}>
        <meshStandardMaterial color="#d5ff00" metalness={0.5} roughness={0.25} emissive="#b0db00" emissiveIntensity={0.45} />
      </RoundedBox>
      <mesh position={[0, 0.149, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.26, 1.23]} /><meshBasicMaterial map={textures.die} toneMapped={false} /></mesh>
      {[-0.8, 0.8].map(x => <mesh key={x} position={[x, -0.015, 0]}><boxGeometry args={[0.035, 0.035, 1.23]} /><meshBasicMaterial color="#d5ff00" /></mesh>)}
    </group>
    <group ref={lid} position={[0, 0.64, 0]}>
      <RoundedBox args={[3.58, 0.18, 3.34]} radius={0.065} smoothness={3} castShadow>
        <meshPhysicalMaterial color="#c2cbb6" metalness={0.7} roughness={0.27} clearcoat={0.5} clearcoatRoughness={0.2} envMapIntensity={1.5} />
      </RoundedBox>
      <mesh position={[0, 0.096, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3.16, 3.04]} /><meshBasicMaterial map={textures.lid} transparent opacity={0.78} depthWrite={false} /></mesh>
      {[-1.49, 1.49].flatMap(x => [-1.37, 1.37].map(z => <group key={`${x}/${z}`} position={[x, 0.1, z]}>
        <mesh><cylinderGeometry args={[0.075, 0.075, 0.025, 16]} /><meshStandardMaterial color="#687b55" metalness={1} roughness={0.18} /></mesh>
        <mesh position={[0, 0.014, 0]}><boxGeometry args={[0.085, 0.007, 0.017]} /><meshBasicMaterial color="#24331b" /></mesh>
      </group>))}
      {[-1.678, 1.678].flatMap(z => Array.from({ length: 9 }, (_, i) => <mesh key={`${i}/${z}`} position={[(i - 4) * 0.16, 0, z]}>
        <boxGeometry args={[0.085, 0.035, 0.008]} /><meshStandardMaterial color="#20311a" roughness={0.6} />
      </mesh>))}
    </group>
  </group>;
}

export default function MicrochipScene(props: Props) {
  return <Canvas camera={{ position: [5.2, 4.7, 6.6], fov: 37 }} dpr={[1, 1.5]} shadows
    frameloop={props.active ? "always" : "demand"} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
    <ambientLight intensity={0.7} />
    <directionalLight position={[-3, 7, 5]} intensity={3} castShadow shadow-mapSize={[512, 512]}
      shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5}
      shadow-normalBias={0.035} shadow-bias={-0.0002} shadow-radius={3} />
    <Environment resolution={128}>
      <Lightformer intensity={2.5} position={[-4, 6, -5]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 10, 1]} />
      <Lightformer intensity={4} position={[-4, 1, 3]} rotation={[0, Math.PI / 2, 0]} scale={[4, 8, 1]} />
      <Lightformer intensity={3} position={[4, 2, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 8, 1]} />
      <Lightformer color="#d5ff00" intensity={1.2} position={[0, -3, 0]} scale={[5, 3, 1]} />
    </Environment>
    <mesh position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><shadowMaterial transparent opacity={0.18} /></mesh>
    <Chip {...props} />
  </Canvas>;
}
