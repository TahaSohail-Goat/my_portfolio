import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import {
  BufferAttribute, BufferGeometry, CanvasTexture, CatmullRomCurve3, Color,
  DynamicDrawUsage, Group, MathUtils, Mesh, ShaderMaterial, SRGBColorSpace, TubeGeometry, Vector3,
} from "three";
import type { MotionValue } from "framer-motion";

type Props = {
  kind: "work" | "lab";
  progress: MotionValue<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  hovered: boolean;
  entering: boolean;
  enabled: boolean;
  active: boolean;
};
const code = ['const idea = {', '  logic: "clear",', '  motion: "intentional"', '};', '', 'build(idea);'];

function makeScreen() {
  const canvas = document.createElement("canvas");
  canvas.width = 768; canvas.height = 448;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const ctx = canvas.getContext("2d")!;
  const draw = (characters: number, highlighted: boolean) => {
    ctx.fillStyle = "#111b13";
    ctx.fillRect(0, 0, 768, 448);
    ctx.fillStyle = "#1d2a1c"; ctx.fillRect(0, 0, 768, 62);
    ["#758260", "#a8b899", "#d5ff00"].forEach((color, i) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(30 + i * 23, 31, 5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.font = "18px Consolas, monospace"; ctx.fillStyle = "#a5b49c";
    ctx.fillText("taha / studio.ts", 127, 37);
    ctx.fillStyle = "#d5ff00"; ctx.fillText("{ }", 690, 37);
    ctx.font = "27px Consolas, monospace";
    let remaining = characters;
    code.forEach((line, i) => {
      const text = line.slice(0, Math.max(0, remaining));
      remaining -= line.length + 1;
      ctx.font = "18px Consolas, monospace"; ctx.fillStyle = "#586950";
      ctx.fillText(String(i + 1).padStart(2, "0"), 26, 108 + i * 42);
      ctx.font = "27px Consolas, monospace";
      ctx.fillStyle = i === 0 || i === 5 ? "#d5ff00" : "#e1e9d6";
      ctx.fillText(text, 82, 108 + i * 42);
      if (remaining < 0 && remaining > -(line.length + 1) && highlighted) {
        ctx.fillStyle = "#d5ff00"; ctx.fillRect(84 + ctx.measureText(text).width, 87 + i * 42, 3, 25);
      }
    });
    ctx.fillStyle = "#35442e"; ctx.fillRect(24, 378, 720, 1);
    ctx.font = "16px Consolas, monospace"; ctx.fillStyle = "#99ab87";
    ctx.fillText(highlighted ? "↳ translating ideas into experiences" : "↳ ready for the next idea", 27, 415);
    ctx.fillStyle = "#d5ff00"; ctx.fillText("●", 714, 415);
    texture.needsUpdate = true;
  };
  draw(1000, false);
  return { texture, draw };
}

function Terminal({ progress, pointer, hovered, entering, enabled }: Props) {
  const root = useRef<Group>(null), left = useRef<Mesh>(null), right = useRef<Mesh>(null);
  const nodes = useRef<(Group | null)[]>([]);
  const time = useRef(0), typing = useRef(0), wasHovered = useRef(false), lastDraw = useRef(-1);
  const { viewport } = useThree();
  const screen = useMemo(makeScreen, []);
  const bracket = useMemo(() => new TubeGeometry(new CatmullRomCurve3([
    new Vector3(0.32, 1.25, 0), new Vector3(0.02, 1.08, 0), new Vector3(0.04, 0.43, 0),
    new Vector3(-0.31, 0, 0), new Vector3(0.04, -0.43, 0), new Vector3(0.02, -1.08, 0), new Vector3(0.32, -1.25, 0),
  ]), 48, 0.075, 8, false), []);
  const links = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(6 * 6), 3).setUsage(DynamicDrawUsage));
    return geometry;
  }, []);
  useEffect(() => () => { screen.texture.dispose(); bracket.dispose(); links.dispose(); }, [screen, bracket, links]);
  useFrame((_, delta) => {
    if (!root.current) return;
    const dt = Math.min(delta, 0.05);
    if (enabled) time.current += dt;
    const t = time.current;
    const assembled = enabled ? MathUtils.smoothstep(progress.get(), 0, 1) : 1;
    const opening = 1 - assembled;
    const mx = enabled ? pointer.current.x : 0, my = enabled ? pointer.current.y : 0;
    root.current.rotation.x = MathUtils.damp(root.current.rotation.x, -0.1 + my * 0.1, 5, dt);
    root.current.rotation.y = MathUtils.damp(root.current.rotation.y, -0.23 + mx * 0.2 + opening * 0.25, 5, dt);
    root.current.rotation.z = MathUtils.damp(root.current.rotation.z, 0.035 + mx * -0.025, 5, dt);
    root.current.position.y = Math.sin(t * 0.65) * 0.055 - opening * 0.3;
    root.current.position.z = MathUtils.damp(root.current.position.z, entering ? 4.8 : 0, 7, dt);
    root.current.scale.setScalar(Math.min(1, viewport.width / 7.8));
    if (left.current) left.current.position.x = -(2.35 + opening * 0.7);
    if (right.current) right.current.position.x = 2.35 + opening * 0.7;
    const positions = links.attributes.position.array as Float32Array;
    nodes.current.forEach((node, i) => {
      if (!node) return;
      const side = i < 3 ? -1 : 1, row = i % 3;
      const x = side * (2.85 + opening * 1.1 + Math.sin(t * 0.7 + i) * 0.08);
      const y = (row - 1) * 1.3 + Math.sin(t * 0.8 + i * 2) * 0.1;
      node.position.set(x, y, 0.2 + opening * (i % 2 ? 0.8 : -0.8));
      node.rotation.set(t * 0.14 + i, t * 0.2, i * 0.4);
      node.scale.setScalar(hovered && enabled ? 1.1 + Math.sin(t * 2 + i) * 0.13 : 0.85);
      positions.set([side * 1.9, (row - 1) * 0.72, -0.05, x, y, node.position.z], i * 6);
    });
    links.attributes.position.needsUpdate = true;
    if (hovered && !wasHovered.current) typing.current = 0;
    wasHovered.current = hovered;
    if (enabled && hovered) typing.current += dt * 65;
    const letters = enabled && hovered ? Math.min(120, Math.floor(typing.current)) : 1000;
    if (lastDraw.current !== letters) { screen.draw(letters, hovered && enabled); lastDraw.current = letters; }
  });
  return <group ref={root} rotation={[-0.1, -0.23, 0.035]}>
    <RoundedBox args={[4.05, 2.55, 0.23]} radius={0.12} smoothness={3}>
      <meshStandardMaterial color="#64745b" metalness={0.9} roughness={0.23} />
    </RoundedBox>
    <mesh position={[0, 0, 0.125]}><planeGeometry args={[3.84, 2.31]} /><meshBasicMaterial map={screen.texture} toneMapped={false} /></mesh>
    <mesh position={[0, -1.31, 0]}><boxGeometry args={[2.4, 0.025, 0.14]} /><meshBasicMaterial color="#d5ff00" /></mesh>
    <mesh ref={left} geometry={bracket} position={[-2.35, 0, 0.2]}><meshStandardMaterial color="#d8e1ca" metalness={1} roughness={0.2} /></mesh>
    <mesh ref={right} geometry={bracket} position={[2.35, 0, 0.2]} rotation={[0, Math.PI, 0]}><meshStandardMaterial color="#d8e1ca" metalness={1} roughness={0.2} /></mesh>
    <lineSegments geometry={links} frustumCulled={false}><lineBasicMaterial color="#829c48" transparent opacity={0.6} /></lineSegments>
    {Array.from({ length: 6 }, (_, i) => <group key={i} ref={el => { nodes.current[i] = el; }}>
      <mesh><octahedronGeometry args={[0.13, 0]} /><meshStandardMaterial color={i % 2 ? "#d5ff00" : "#d5dfca"} metalness={0.6} roughness={0.22} emissive="#b0d32a" emissiveIntensity={0.15} /></mesh>
      <mesh><boxGeometry args={[0.35, 0.35, 0.35]} /><meshBasicMaterial color="#c3dd82" wireframe transparent opacity={0.35} /></mesh>
    </group>)}
  </group>;
}

function makeCoreMaterial() {
  return new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uMorph: { value: 0 }, uLime: { value: new Color("#d5ff00") } },
    vertexShader: `
      uniform float uTime; uniform float uMorph; varying vec3 vView;
      void main(){
        vec3 n=normalize(position);
        vec3 sphere=n*0.82;
        vec3 cube=n*0.67/max(max(abs(n.x),abs(n.y)),abs(n.z));
        vec3 fluid=sphere*(1.0+0.16*sin(n.y*5.0+uTime*1.3)+0.12*cos(n.x*4.0-uTime));
        vec3 p=uMorph<1.0?mix(sphere,cube,smoothstep(0.0,1.0,uMorph)):
          uMorph<2.0?mix(cube,fluid,smoothstep(1.0,2.0,uMorph)):
          mix(fluid,sphere,smoothstep(2.0,3.0,uMorph));
        vec4 v=modelViewMatrix*vec4(p,1.0); vView=v.xyz; gl_Position=projectionMatrix*v;
      }`,
    fragmentShader: `
      varying vec3 vView; uniform vec3 uLime;
      void main(){
        vec3 n=normalize(cross(dFdx(vView),dFdy(vView)));
        vec3 view=normalize(-vView);
        float fresnel=pow(1.0-max(dot(n,view),0.0),2.0);
        float light=max(dot(n,normalize(vec3(-0.4,0.75,1.0))),0.0);
        vec3 reflection=reflect(-view,n);
        float band=smoothstep(-0.15,0.0,reflection.y)*(1.0-smoothstep(0.26,0.42,reflection.y));
        float edge=pow(max(0.0,1.0-abs(reflection.x+0.55)*5.0),6.0);
        vec3 studio=mix(vec3(0.045,0.075,0.035),vec3(0.58,0.66,0.49),smoothstep(-0.65,0.65,reflection.y));
        vec3 chrome=mix(studio,vec3(0.90,0.96,0.82),band*0.9)+vec3(0.5)*edge;
        chrome*=0.6+light*0.4;
        vec3 color=mix(chrome,uLime,fresnel*0.8);
        gl_FragColor=vec4(color,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}
const faces = [
  { p: [0, 0, 1], r: [0, 0, 0] }, { p: [0, 0, -1], r: [0, Math.PI, 0] },
  { p: [1, 0, 0], r: [0, Math.PI / 2, 0] }, { p: [-1, 0, 0], r: [0, -Math.PI / 2, 0] },
  { p: [0, 1, 0], r: [-Math.PI / 2, 0, 0] }, { p: [0, -1, 0], r: [Math.PI / 2, 0, 0] },
];

function Core({ progress, pointer, hovered, entering, enabled }: Props) {
  const root = useRef<Group>(null), core = useRef<Mesh>(null), field = useRef<Group>(null);
  const panels = useRef<(Group | null)[]>([]), time = useRef(0), morph = useRef(0);
  const { viewport } = useThree();
  const material = useMemo(makeCoreMaterial, []);
  const frame = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array([
      -0.82, -0.82, 0, 0.82, -0.82, 0, 0.82, 0.82, 0, -0.82, 0.82, 0,
    ]), 3));
    return geometry;
  }, []);
  const particles = useMemo(() => {
    const geometry = new BufferGeometry(), positions = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i++) {
      const a = i * 2.39996, y = 1 - i / 129.5, r = Math.sqrt(Math.max(0, 1 - y * y));
      const radius = 1.75 + (i % 7) * 0.045;
      positions.set([Math.cos(a) * r * radius, y * radius, Math.sin(a) * r * radius], i * 3);
    }
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, []);
  useEffect(() => () => { material.dispose(); frame.dispose(); particles.dispose(); }, [material, frame, particles]);
  useFrame((_, delta) => {
    if (!root.current) return;
    const dt = Math.min(delta, 0.05);
    if (enabled) { time.current += dt; morph.current += dt * (hovered ? 0.65 : 0.18); }
    const t = time.current;
    const unfold = enabled ? MathUtils.smoothstep(progress.get(), 0, 1) : 1;
    root.current.rotation.x = MathUtils.damp(root.current.rotation.x, 0.26 + (enabled ? pointer.current.y * 0.15 : 0), 4, dt);
    root.current.rotation.y = MathUtils.damp(root.current.rotation.y, -0.35 + (enabled ? pointer.current.x * 0.2 : 0), 4, dt);
    root.current.position.z = MathUtils.damp(root.current.position.z, entering ? 4.5 : 0, 7, dt);
    root.current.scale.setScalar(Math.min(1, viewport.width / 5.8));
    panels.current.forEach((panel, i) => {
      if (!panel) return;
      const radius = 0.98 + unfold * 0.48 + (hovered && enabled ? 0.18 : 0);
      panel.position.set(faces[i].p[0] * radius, faces[i].p[1] * radius, faces[i].p[2] * radius);
      panel.rotation.set(faces[i].r[0] + unfold * (i < 4 ? 0.1 : 0.27), faces[i].r[1] + t * 0.04, faces[i].r[2] + Math.sin(t * 0.4 + i) * 0.04);
    });
    if (core.current) core.current.rotation.set(t * 0.13, t * 0.2, 0.2);
    if (field.current) field.current.rotation.set(t * 0.06, -t * 0.11, 0.2);
    material.uniforms.uTime.value = t;
    material.uniforms.uMorph.value = morph.current % 3;
  });
  return <group ref={root} rotation={[0.26, -0.35, 0]}>
    <mesh ref={core} material={material}><sphereGeometry args={[1, 64, 48]} /></mesh>
    {faces.map((_, i) => <group key={i} ref={el => { panels.current[i] = el; }}>
      <lineLoop geometry={frame}><lineBasicMaterial color="#d5ff00" transparent opacity={0.7} /></lineLoop>
      <mesh><planeGeometry args={[1.64, 1.64, 3, 3]} /><meshBasicMaterial color="#749044" wireframe transparent opacity={0.17} depthWrite={false} /></mesh>
      {[-0.82, 0.82].map(x => <mesh key={x} position={[x, 0.82, 0]}><sphereGeometry args={[0.035, 8, 6]} /><meshBasicMaterial color="#d5ff00" /></mesh>)}
    </group>)}
    <group ref={field}><points geometry={particles}><pointsMaterial color="#d5ff00" size={0.027} transparent opacity={0.6} depthWrite={false} /></points></group>
  </group>;
}

export default function WorldScene(props: Props) {
  return <Canvas camera={{ position: [0, 0, 6.7], fov: 38 }} dpr={[1, 1.5]}
    frameloop={props.active ? "always" : "demand"} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
    <ambientLight intensity={0.7} /><directionalLight position={[3, 4, 4]} intensity={2} />
    {props.kind === "work" && <Environment resolution={64}>
      <Lightformer intensity={4} position={[0, 4, -3]} scale={[8, 3, 1]} />
      <Lightformer intensity={3} position={[-4, 1, 3]} rotation={[0, Math.PI / 2, 0]} scale={[5, 8, 1]} />
      <Lightformer intensity={3} position={[4, 2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 8, 1]} />
    </Environment>}
    {props.kind === "work" ? <Terminal {...props} /> : <Core {...props} />}
  </Canvas>;
}
