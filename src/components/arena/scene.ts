import * as THREE from "three";
import { ArenaMatch, cellSize, columns, rows, siteRadius, sites, wallCells } from "./match";

const teamColors = { raiders: 0xffb36c, wardens: 0x66f4e4 };
const spanX = columns * cellSize;
const spanZ = rows * cellSize;

function material(color: number, metalness = 0, roughness = 0.65) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}

function box(parent: THREE.Object3D, surface: THREE.Material, width: number, height: number, depth: number, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), surface);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

function disc(parent: THREE.Object3D, geometry: THREE.BufferGeometry, surface: THREE.Material, x: number, z: number, height: number) {
  const mesh = new THREE.Mesh(geometry, surface);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, height, z);
  parent.add(mesh);
  return mesh;
}

function panelTexture() {
  const panel = document.createElement("canvas");
  panel.width = 256;
  panel.height = 288;
  const ctx = panel.getContext("2d")!;
  ctx.fillStyle = "#60726c";
  ctx.fillRect(0, 0, 256, 288);
  const metal = ctx.createLinearGradient(0, 0, 0, 288);
  metal.addColorStop(0, "#bbcab9");
  metal.addColorStop(0.22, "#8d9f93");
  metal.addColorStop(0.23, "#687e75");
  metal.addColorStop(1, "#445650");
  ctx.fillStyle = metal;
  ctx.fillRect(6, 7, 244, 274);
  ctx.strokeStyle = "#202e2a";
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 35, 232, 215);
  ctx.strokeStyle = "#bbd0be77";
  ctx.lineWidth = 1;
  ctx.strokeRect(15, 38, 227, 209);
  ctx.fillStyle = "#26342e";
  ctx.fillRect(0, 229, 256, 21);
  ctx.fillStyle = "#a78959";
  for (let x = -14; x < 256; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 250);
    ctx.lineTo(x + 13, 250);
    ctx.lineTo(x + 32, 229);
    ctx.lineTo(x + 19, 229);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "#162725";
  ctx.fillRect(26, 15, 204, 4);
  ctx.fillStyle = "#d3ecbe";
  ctx.fillRect(44, 16, 168, 2);
  for (const x of [21, 235]) {
    for (const y of [46, 219, 262]) {
      ctx.beginPath();
      ctx.fillStyle = "#273b35";
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#bdcec0";
      ctx.fillRect(x - 2, y - 1, 4, 1);
    }
  }
  const texture = new THREE.CanvasTexture(panel);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function siteSign(site: (typeof sites)[number], scene: THREE.Scene) {
  const surface = document.createElement("canvas");
  surface.width = 128;
  surface.height = 128;
  const ctx = surface.getContext("2d")!;
  ctx.fillStyle = "#161e20";
  ctx.fillRect(0, 0, 128, 128);
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#efb57a";
  ctx.strokeRect(7, 7, 114, 114);
  ctx.font = "bold 88px sans-serif";
  ctx.fillStyle = "#ffe2bb";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(site.id, 64, 68);
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  const flag = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, fog: true }));
  flag.position.set(site.x, 2.95, site.z);
  flag.scale.set(0.92, 0.92, 1);
  scene.add(flag);
}

function makeAvatar(color: number) {
  const robot = new THREE.Group();
  const suit = material(0x344548, 0.25);
  const shell = material(color, 0.18);
  const dark = material(0x121b1d, 0.45);
  const visor = new THREE.MeshBasicMaterial({ color });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.31, 0.43, 5, 10), suit);
  torso.position.y = 1.03;
  robot.add(torso);
  box(robot, shell, 0.53, 0.27, 0.43, 0, 1.16, -0.025);
  box(robot, dark, 0.43, 0.28, 0.39, 0, 1.62, 0);
  box(robot, visor, 0.41, 0.075, 0.015, 0, 1.64, -0.202);
  const legs = [-0.15, 0.15].map((x) => box(robot, dark, 0.18, 0.54, 0.23, x, 0.34, 0));
  box(robot, suit, 0.14, 0.24, 0.52, 0.31, 1.08, -0.15);
  box(robot, dark, 0.12, 0.12, 0.46, 0.31, 1.15, -0.35);
  return { robot, legs };
}

export class ArenaStage {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(70, 1, 0.055, 115);
  private resize: ResizeObserver;
  private robots: Record<string, ReturnType<typeof makeAvatar>[]> = { raiders: [], wardens: [] };
  private blaster = new THREE.Group();
  private muzzle = new THREE.Mesh(new THREE.IcosahedronGeometry(0.075, 0), new THREE.MeshBasicMaterial({ color: 0xffdd8b }));
  private beacon = new THREE.Group();
  private tracerLines: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  private traceBuffer = new Float32Array(32 * 6);
  private lastShot = 0;
  private flashUntil = 0;
  private mapContext: CanvasRenderingContext2D | null;
  private mapBase: HTMLCanvasElement;
  private previousPositions = new Map<number, { x: number; z: number }>();

  constructor(private host: HTMLElement, private map: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.23;
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(this.renderer.domElement);
    this.mapContext = map.getContext("2d");
    this.mapBase = this.makeMap();

    this.scene.background = new THREE.Color(0x192428);
    this.scene.fog = new THREE.FogExp2(0x192428, 0.024);
    this.scene.add(new THREE.HemisphereLight(0xd0f5ff, 0x604638, 2.05));
    const key = new THREE.DirectionalLight(0xffdc9d, 2.35);
    key.position.set(-12, 15, -9);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0x92ddd8, 1.25);
    fill.position.set(15, 7, 15);
    this.scene.add(fill);

    const concrete = material(0x526760, 0.18);
    const wallPanel = material(0xb6c8bb, 0.13);
    wallPanel.map = panelTexture();
    wallPanel.emissive.set(0x1c2b25);
    wallPanel.emissiveIntensity = 0.32;
    const trim = material(0x68817a, 0.32, 0.52);
    const floor = material(0x293736, 0.16);
    disc(this.scene, new THREE.PlaneGeometry(spanX, spanZ), floor, 0, 0, 0);
    const grid = new THREE.GridHelper(spanX, columns, 0x7e9a83, 0x70847e);
    grid.scale.z = spanZ / spanX;
    grid.position.y = 0.009;
    grid.material.transparent = true;
    grid.material.opacity = 0.19;
    this.scene.add(grid);

    const wall = new THREE.InstancedMesh(
      new THREE.BoxGeometry(cellSize, 2.75, cellSize),
      [wallPanel, wallPanel, concrete, concrete, wallPanel, wallPanel],
      wallCells.length,
    );
    const caps = new THREE.InstancedMesh(new THREE.BoxGeometry(cellSize - 0.03, 0.12, cellSize - 0.03), trim, wallCells.length);
    const matrix = new THREE.Matrix4();
    wallCells.forEach(({ x, z }, index) => {
      wall.setMatrixAt(index, matrix.makeTranslation(x, 1.375, z));
      caps.setMatrixAt(index, matrix.makeTranslation(x, 2.7, z));
      wall.setColorAt(index, new THREE.Color(index % 3 ? 0xe3e7dd : 0xb6c5bd));
    });
    this.scene.add(wall, caps);

    const ring = new THREE.MeshBasicMaterial({ color: 0xeaa670, side: THREE.DoubleSide, transparent: true, opacity: 0.83 });
    const siteFloor = new THREE.MeshBasicMaterial({ color: 0xaf683a, transparent: true, opacity: 0.24, depthWrite: false });
    for (const site of sites) {
      disc(this.scene, new THREE.CircleGeometry(siteRadius, 36), siteFloor, site.x, site.z, 0.015);
      disc(this.scene, new THREE.RingGeometry(siteRadius - 0.065, siteRadius, 36), ring, site.x, site.z, 0.02);
      siteSign(site, this.scene);
    }

    const beams = material(0x202d30, 0.42);
    for (const x of [-22.1, 22.1]) {
      for (const z of [-17, -9, 0, 9, 17]) {
        const direction = x < 0 ? -1 : 1;
        box(this.scene, beams, 0.25, 4.65, 0.35, x + direction * 1.65, 2.3, z);
        box(this.scene, trim, 0.22, 0.14, 1.05, x + direction * 1.48, 4.45, z);
      }
    }
    const outerFrame = material(0x415852, 0.25);
    for (const side of [-1, 1]) {
      box(this.scene, outerFrame, 0.32, 0.38, spanZ - 1.8, side * 23.5, 4.25, 0);
      box(this.scene, beams, 0.19, 0.14, spanZ - 1.8, side * 23.5, 5.1, 0);
      for (const z of [-16, -6, 6, 16]) {
        box(this.scene, outerFrame, 0.2, 1.2, 0.21, side * 23.5, 4.68, z);
      }
    }
    const lane = new THREE.MeshBasicMaterial({ color: 0xffcf88, transparent: true, opacity: 0.45 });
    const line = new THREE.PlaneGeometry(0.042, 0.84);
    for (const x of [-4.8, 4.8]) {
      for (const z of [15.6, 14.4, 13.2, 12, 10.8, 9.6]) disc(this.scene, line, lane, x, z, 0.018);
    }
    const lamp = new THREE.MeshBasicMaterial({ color: 0xe7ffc5 });
    for (const x of [-4.8, 4.8]) {
      box(this.scene, beams, 0.22, 0.31, 3.8, x, 3.85, 14.8);
      box(this.scene, lamp, 0.08, 0.024, 3.12, x, 3.68, 14.8);
    }

    for (let id = 0; id < 6; id++) {
      for (const side of ["raiders", "wardens"] as const) {
        const avatar = makeAvatar(teamColors[side]);
        this.robots[side][id] = avatar;
        this.scene.add(avatar.robot);
      }
    }

    const alloy = material(0x556765, 0.38);
    const grip = material(0x233133, 0.24);
    const accent = new THREE.MeshBasicMaterial({ color: 0xe2fa8d });
    box(this.blaster, grip, 0.18, 0.17, 0.5, 0, 0, -0.23);
    box(this.blaster, alloy, 0.14, 0.09, 0.56, 0, 0.08, -0.28);
    box(this.blaster, grip, 0.185, 0.085, 0.2, 0, 0.135, -0.25);
    box(this.blaster, accent, 0.095, 0.017, 0.13, 0, 0.187, -0.26);
    box(this.blaster, grip, 0.105, 0.12, 0.23, 0, -0.085, -0.22);
    box(this.blaster, accent, 0.008, 0.041, 0.23, -0.094, 0.042, -0.26);
    for (const z of [-0.16, -0.21, -0.26]) {
      box(this.blaster, alloy, 0.194, 0.065, 0.014, 0, 0.015, z);
    }
    this.muzzle.position.set(0, 0.08, -0.61);
    this.blaster.add(this.muzzle);
    this.camera.add(this.blaster);
    this.scene.add(this.camera);

    box(this.beacon, beams, 0.38, 0.21, 0.36);
    box(this.beacon, new THREE.MeshBasicMaterial({ color: 0xffb34d }), 0.27, 0.06, 0.29, 0, 0.12, 0);
    this.scene.add(this.beacon);

    const traceGeometry = new THREE.BufferGeometry();
    traceGeometry.setAttribute("position", new THREE.BufferAttribute(this.traceBuffer, 3).setUsage(THREE.DynamicDrawUsage));
    this.tracerLines = new THREE.LineSegments(traceGeometry, new THREE.LineBasicMaterial({ color: 0xffdda1, transparent: true, opacity: 0.72 }));
    this.tracerLines.frustumCulled = false;
    this.scene.add(this.tracerLines);

    const fit = () => {
      const { clientWidth: width, clientHeight: height } = this.host;
      if (!width || !height) return;
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    };
    this.resize = new ResizeObserver(fit);
    this.resize.observe(host);
    fit();
  }

  private makeMap() {
    const base = document.createElement("canvas");
    base.width = this.map.width;
    base.height = this.map.height;
    const ctx = base.getContext("2d");
    if (!ctx) return base;
    const width = base.width / columns;
    const height = base.height / rows;
    ctx.fillStyle = "#11191bee";
    ctx.fillRect(0, 0, base.width, base.height);
    ctx.fillStyle = "#536963";
    for (const { x, z } of wallCells) {
      const { px, py } = this.mapPoint(x, z);
      ctx.fillRect(px - width / 2, py - height / 2, width, height);
    }
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#ffd292";
    ctx.textAlign = "center";
    for (const site of sites) {
      const { px, py } = this.mapPoint(site.x, site.z);
      ctx.fillText(site.id, px, py + 4);
    }
    return base;
  }

  private mapPoint(x: number, z: number) {
    return { px: (x / spanX + 0.5) * this.map.width, py: (z / spanZ + 0.5) * this.map.height };
  }

  render(match: ArenaMatch, reduced: boolean) {
    const player = match.player;
    const followed = player.hp > 0 ? player : match.actors.find((actor) => actor.side === player.side && actor.hp > 0);
    const cameraActor = followed ?? player;
    this.camera.rotation.set(followed === player ? match.aimPitch + (reduced ? 0 : match.recoil * 0.034) : -0.1, cameraActor.yaw, 0, "YXZ");
    this.camera.position.set(cameraActor.x, followed ? match.eye : 2.15, cameraActor.z);
    this.blaster.visible = player.hp > 0;
    this.blaster.position.set(0.24, -0.245, -0.37 + (reduced ? 0 : match.recoil * 0.07));
    this.blaster.scale.setScalar(match.weapon.id === "spark" ? 0.77 : match.weapon.id === "arc" ? 1.1 : 1);
    if (match.shotSerial !== this.lastShot) {
      this.lastShot = match.shotSerial;
      this.flashUntil = match.t + 0.045;
    }
    this.muzzle.visible = !reduced && match.t < this.flashUntil;
    for (const actor of match.actors) {
      for (const side of ["raiders", "wardens"] as const) {
        const { robot, legs } = this.robots[side][actor.id];
        robot.visible = actor.side === side && actor.hp > 0 && actor !== followed && actor.id !== 0;
        if (!robot.visible) continue;
        robot.position.set(actor.x, 0, actor.z);
        robot.rotation.y = actor.yaw;
        const previous = this.previousPositions.get(actor.id);
        const moving = previous && Math.hypot(actor.x - previous.x, actor.z - previous.z) > 0.005;
        for (let index = 0; index < legs.length; index++) {
          legs[index].rotation.x = !reduced && moving ? Math.sin(match.t * 12 + index * Math.PI) * 0.22 : 0;
        }
        this.previousPositions.set(actor.id, { x: actor.x, z: actor.z });
      }
    }
    this.beacon.visible = Boolean(match.charge);
    if (match.charge) this.beacon.position.set(match.charge.x, 0.16, match.charge.z);
    const traces = match.traces.slice(-32);
    traces.forEach((trace, index) => this.traceBuffer.set(
      [trace.from.x, trace.yFrom, trace.from.z, trace.to.x, trace.yTo, trace.to.z], index * 6,
    ));
    this.tracerLines.geometry.getAttribute("position").needsUpdate = true;
    this.tracerLines.geometry.setDrawRange(0, traces.length * 2);
    this.renderer.render(this.scene, this.camera);

    const ctx = this.mapContext;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.map.width, this.map.height);
    ctx.drawImage(this.mapBase, 0, 0);
    for (const actor of match.actors) {
      if (actor.side !== player.side || actor.hp <= 0) continue;
      const { px, py } = this.mapPoint(actor.x, actor.z);
      ctx.beginPath();
      ctx.fillStyle = actor.id === 0 ? "#e9ff91" : "#76e6d7";
      ctx.arc(px, py, actor.id === 0 ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    if (match.charge) {
      const { px, py } = this.mapPoint(match.charge.x, match.charge.z);
      ctx.fillStyle = "#ffc584";
      ctx.fillRect(px - 3, py - 3, 6, 6);
    }
  }

  dispose() {
    this.resize.disconnect();
    this.renderer.domElement.remove();
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      if (!mesh.material) return;
      for (const surface of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        (surface as THREE.MeshStandardMaterial).map?.dispose();
        surface.dispose();
      }
    });
    this.renderer.dispose();
  }
}
