export type Side = "raiders" | "wardens";
export type Difficulty = "casual" | "standard" | "expert";
type Point = { x: number; z: number };
type Phase = "buy" | "round" | "result" | "complete";
export type WeaponId = "spark" | "vector" | "arc";

export const weapons = {
  spark: { name: "Spark", kind: "Sidearm", price: 0, magazine: 12, reserve: 48, damage: 31, interval: 0.29, reload: 1.15, spread: 0.013, range: 28 },
  vector: { name: "Vector", kind: "Carbine", price: 1900, magazine: 28, reserve: 84, damage: 26, interval: 0.115, reload: 1.45, spread: 0.016, range: 38 },
  arc: { name: "Arc", kind: "Precision", price: 2400, magazine: 8, reserve: 32, damage: 58, interval: 0.53, reload: 1.65, spread: 0.006, range: 42 },
} satisfies Record<WeaponId, Record<string, string | number>>;

export const cellSize = 2.4;
export const columns = 21;
export const rows = 17;
export const siteRadius = 2.9;
const buySeconds = 12;
const targetWins = 5;
const actorRadius = 0.34;

export function cellPoint(col: number, row: number): Point {
  return { x: (col + 0.5 - columns / 2) * cellSize, z: (row + 0.5 - rows / 2) * cellSize };
}

export const sites = [
  { id: "A", ...cellPoint(4, 5) },
  { id: "B", ...cellPoint(16, 5) },
];

const blocks = [
  [3, 3, 3, 1], [15, 3, 3, 1],
  [7, 4, 2, 3], [12, 4, 2, 3],
  [10, 5, 1, 3], [10, 9, 1, 3],
  [2, 8, 3, 1], [16, 8, 3, 1],
  [6, 9, 2, 2], [13, 9, 2, 2],
  [3, 12, 2, 1], [16, 12, 2, 1],
  [7, 13, 2, 1], [12, 13, 2, 1],
];
const solid = new Set<number>();
const cellId = (col: number, row: number) => row * columns + col;
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < columns; col++) {
    if (row === 0 || row === rows - 1 || col === 0 || col === columns - 1) solid.add(cellId(col, row));
  }
}
for (const [x, z, width, depth] of blocks) {
  for (let row = z; row < z + depth; row++) {
    for (let col = x; col < x + width; col++) solid.add(cellId(col, row));
  }
}
export const wallCells = [...solid].map((cell) => cellPoint(cell % columns, Math.floor(cell / columns)));

function gridPosition(x: number, z: number) {
  return { col: Math.floor(x / cellSize + columns / 2), row: Math.floor(z / cellSize + rows / 2) };
}
function isWall(x: number, z: number) {
  const { col, row } = gridPosition(x, z);
  return col < 0 || row < 0 || col >= columns || row >= rows || solid.has(cellId(col, row));
}
const distance = (from: Point, to: Point) => Math.hypot(to.x - from.x, to.z - from.z);
const otherSide = (side: Side): Side => side === "raiders" ? "wardens" : "raiders";
export const sideName = (side: Side) => side === "raiders" ? "Raiders" : "Wardens";

function clearLine(from: Point, to: Point, padding = 0) {
  const steps = Math.max(1, Math.ceil(distance(from, to) / 0.3));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = from.x + (to.x - from.x) * t;
    const z = from.z + (to.z - from.z) * t;
    if (isWall(x, z)) return false;
    if (padding > 0 && (
      isWall(x - padding, z - padding) || isWall(x - padding, z + padding) ||
      isWall(x + padding, z - padding) || isWall(x + padding, z + padding)
    )) return false;
  }
  return true;
}

function move(actor: Actor, dx: number, dz: number) {
  const canOccupy = (x: number, z: number) =>
    ![-actorRadius, actorRadius].some((a) => [-actorRadius, actorRadius].some((b) => isWall(x + a, z + b)));
  if (canOccupy(actor.x + dx, actor.z)) actor.x += dx;
  if (canOccupy(actor.x, actor.z + dz)) actor.z += dz;
}

function pathTo(from: Point, goal: Point) {
  const start = gridPosition(from.x, from.z);
  const end = gridPosition(goal.x, goal.z);
  const startId = cellId(start.col, start.row);
  const endId = cellId(end.col, end.row);
  const queue = [startId];
  const parent = new Map<number, number>([[startId, startId]]);
  for (let index = 0; index < queue.length && !parent.has(endId); index++) {
    const cell = queue[index];
    const col = cell % columns;
    const row = Math.floor(cell / columns);
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nextCol = col + dx;
      const nextRow = row + dz;
      const next = cellId(nextCol, nextRow);
      if (nextCol < 0 || nextCol >= columns || nextRow < 0 || nextRow >= rows || solid.has(next) || parent.has(next)) continue;
      parent.set(next, cell);
      queue.push(next);
    }
  }
  if (!parent.has(endId)) return [];
  const route: Point[] = [];
  for (let node = endId; node !== startId; node = parent.get(node)!) {
    route.push(cellPoint(node % columns, Math.floor(node / columns)));
  }
  return route.reverse();
}

export type Actor = Point & {
  id: number;
  name: string;
  side: Side;
  hp: number;
  shield: number;
  yaw: number;
  shotAt: number;
  planAt: number;
  route: Point[];
};
type Trace = { from: Point; to: Point; yFrom: number; yTo: number; side: Side; expires: number };
type Charge = Point & { site: string; endsAt: number };
type Objective = { actor: number; mode: "deploy" | "disable"; progress: number };
type Loadout = { id: WeaponId; ammo: number; reserve: number };
export type Input = {
  forward: number; strafe: number; walk: boolean; fire: boolean; use: boolean;
  yaw: number; pitch: number;
};
export type ArenaSnapshot = {
  phase: Phase;
  side: Side;
  time: number;
  round: number;
  wins: number;
  losses: number;
  credits: number;
  hp: number;
  shield: number;
  kills: number;
  weapon: WeaponId;
  primary: WeaponId | null;
  ammo: number;
  reserve: number;
  reloading: boolean;
  message: string;
  hint: string;
  progress: number;
  chargeSite: string | null;
  allies: number;
  enemies: number;
  feed: string[];
};

function loadout(id: WeaponId): Loadout {
  return { id, ammo: weapons[id].magazine, reserve: weapons[id].reserve };
}

export class ArenaMatch {
  actors: Actor[] = [];
  phase: Phase = "buy";
  t = 0;
  endsAt = buySeconds;
  charge: Charge | null = null;
  traces: Trace[] = [];
  objective: Objective | null = null;
  sidearm = loadout("spark");
  primary: Loadout | null = null;
  weapon: Loadout = this.sidearm;
  reloadAt = 0;
  credits = 1500;
  wins = 0;
  losses = 0;
  round = 1;
  kills = 0;
  feed: string[] = [];
  message = "";
  aimPitch = 0;
  recoil = 0;
  hitFlash = 0;
  damageFlash = 0;
  shotSerial = 0;
  hitSerial = 0;
  private attackSite = 0;
  private startedAs: Side;
  readonly difficulty: Difficulty;

  constructor(side: Side, difficulty: Difficulty) {
    this.startedAs = side;
    this.difficulty = difficulty;
    this.spawn();
  }
  get player() { return this.actors[0]; }
  get eye() { return 1.54; }
  get defaultYaw() { return this.player.side === "raiders" ? 0 : Math.PI; }

  private spawn() {
    const side = this.round <= 4 ? this.startedAs : otherSide(this.startedAs);
    const previous = this.actors[0];
    if (previous && previous.hp <= 0) this.primary = null;
    const shield = previous && previous.hp > 0 ? previous.shield : 0;
    this.actors = Array.from({ length: 6 }, (_, id) => {
      const team = id < 3 ? side : otherSide(side);
      const col = [10, 8, 12][id % 3];
      const point = cellPoint(col, team === "raiders" ? 15 : 1);
      return {
        ...point, id, side: team, yaw: team === "raiders" ? 0 : Math.PI,
        name: ["You", "Io", "Tess", "Rook", "Hex", "Iris"][id],
        hp: 100, shield: id === 0 ? shield : 25, shotAt: id === 0 ? this.t : this.t + 0.6 + Math.random() * 0.7,
        planAt: 0, route: [],
      };
    });
    this.sidearm = loadout("spark");
    if (this.primary) this.primary = loadout(this.primary.id);
    this.weapon = this.primary ?? this.sidearm;
    this.charge = null;
    this.objective = null;
    this.reloadAt = 0;
    this.traces = [];
    this.feed = [];
    this.recoil = 0;
    this.hitFlash = 0;
    this.damageFlash = 0;
    this.aimPitch = 0;
    this.attackSite = (this.round - 1) % sites.length;
    this.phase = "buy";
    this.endsAt = this.t + buySeconds;
    this.message = this.round === 5 ? "Sides switched. Choose your loadout." : "Choose your loadout.";
  }

  buy(id: WeaponId | "shield") {
    if (this.phase !== "buy" || id === "spark") return;
    const price = id === "shield" ? 500 : weapons[id].price;
    if (this.credits < price || (id === "shield" ? this.player.shield === 50 : this.primary?.id === id)) return;
    this.credits -= price;
    if (id === "shield") this.player.shield = 50;
    else {
      this.primary = loadout(id);
      this.weapon = this.primary;
    }
  }

  equip(slot: number) {
    if (this.player.hp <= 0 || this.phase === "complete") return;
    const next = slot === 1 ? this.sidearm : this.primary;
    if (next && next !== this.weapon) {
      this.weapon = next;
      this.reloadAt = 0;
    }
  }

  startRound() {
    if (this.phase !== "buy") return;
    this.phase = "round";
    this.endsAt = this.t + 85;
    this.message = "";
  }

  nextRound() {
    if (this.phase !== "result") return;
    this.round++;
    this.spawn();
  }

  reload() {
    if (this.phase !== "round" || this.player.hp <= 0 || this.reloadAt || !this.weapon.reserve || this.weapon.ammo >= weapons[this.weapon.id].magazine) return;
    this.reloadAt = this.t + weapons[this.weapon.id].reload;
  }

  private finish(side: Side, reason: string) {
    if (this.phase !== "round") return;
    const won = side === this.player.side;
    if (won) this.wins++;
    else this.losses++;
    this.credits = Math.min(9000, this.credits + (won ? 2200 : 1700));
    this.phase = this.wins === targetWins || this.losses === targetWins ? "complete" : "result";
    this.message = `${sideName(side)} win · ${reason}`;
    this.objective = null;
    this.reloadAt = 0;
  }

  private damage(attacker: Actor, target: Actor, damage: number) {
    const absorbed = Math.min(target.shield, Math.floor(damage * 0.45));
    target.shield -= absorbed;
    target.hp = Math.max(0, target.hp - damage + absorbed);
    if (target.id === 0) this.damageFlash = 0.2;
    if (attacker.id === 0) {
      this.hitFlash = 0.16;
      this.hitSerial++;
    }
    if (target.hp > 0) return;
    if (target.id === 0) this.reloadAt = 0;
    this.feed = [`${attacker.name} eliminated ${target.name}`, ...this.feed].slice(0, 4);
    if (attacker.id === 0) {
      this.kills++;
      this.credits = Math.min(9000, this.credits + 250);
    }
  }

  private fire(moving: boolean) {
    const player = this.player;
    if (player.hp <= 0 || player.shotAt > this.t || this.reloadAt) return;
    if (this.weapon.ammo === 0) { this.reload(); return; }
    const info = weapons[this.weapon.id];
    this.weapon.ammo--;
    player.shotAt = this.t + info.interval;
    this.shotSerial++;
    const spread = info.spread * (moving ? 2.2 : 1) + this.recoil * 0.025;
    const yaw = player.yaw + (Math.random() - 0.5) * spread;
    const pitch = this.aimPitch + this.recoil * 0.07 + (Math.random() - 0.5) * spread;
    const dx = -Math.sin(yaw);
    const dz = -Math.cos(yaw);
    this.recoil = Math.min(1, this.recoil + 0.24);
    let reach = info.range;
    for (let travel = 0.2; travel <= info.range; travel += 0.2) {
      if (isWall(player.x + dx * travel, player.z + dz * travel)) { reach = travel; break; }
    }
    let victim: Actor | undefined;
    let victimHeight = 0;
    for (const actor of this.actors) {
      if (actor.id === 0 || actor.hp <= 0) continue;
      const x = actor.x - player.x;
      const z = actor.z - player.z;
      const along = x * dx + z * dz;
      const height = this.eye + Math.tan(pitch) * along;
      if (along <= 0 || along >= reach || height < 0.12 || height > 1.83) continue;
      const radius = height > 1.45 ? 0.29 : 0.37;
      if (Math.abs(dx * z - dz * x) > radius) continue;
      victim = actor;
      victimHeight = height;
      reach = along;
    }
    if (victim && victim.side !== player.side) {
      this.damage(player, victim, Math.round(info.damage * (victimHeight > 1.47 ? 1.75 : 1)));
    }
    this.traces.push({
      from: { x: player.x + dx * 0.5, z: player.z + dz * 0.5 },
      to: { x: player.x + dx * reach, z: player.z + dz * reach },
      yFrom: this.eye - 0.16, yTo: this.eye + Math.tan(pitch) * reach,
      expires: this.t + 0.09, side: player.side,
    });
  }

  private botGoal(actor: Actor) {
    if (this.charge) return this.charge;
    if (actor.side === "raiders") return sites[this.attackSite];
    if (this.t > this.endsAt - 42) {
      const targets = this.actors.filter((target) => target.side !== actor.side && target.hp > 0);
      const nearest = targets.sort((a, b) => distance(a, actor) - distance(b, actor))[0];
      if (nearest) return nearest;
    }
    return sites[actor.id % sites.length];
  }

  private runBot(actor: Actor, dt: number) {
    const target = this.actors
      .filter((candidate) => candidate.side !== actor.side && candidate.hp > 0 && distance(actor, candidate) < 22 && clearLine(actor, candidate))
      .sort((a, b) => distance(actor, a) - distance(actor, b))[0];
    if (target) {
      actor.yaw = Math.atan2(actor.x - target.x, actor.z - target.z);
      if (this.t >= actor.shotAt) {
        const calm = this.difficulty === "casual" ? 0.72 : this.difficulty === "expert" ? 1.25 : 1;
        const scale = actor.side === this.player.side ? 0.95 : calm;
        actor.shotAt = this.t + (0.43 + Math.random() * 0.43) / scale;
        const accuracy = Math.max(0.18, 0.87 - distance(actor, target) * 0.032) * scale;
        const hit = Math.random() < accuracy;
        this.traces.push({
          from: { x: actor.x, z: actor.z },
          to: { x: target.x + (hit ? 0 : 0.65), z: target.z },
          yFrom: 1.22, yTo: 1.25, expires: this.t + 0.09, side: actor.side,
        });
        if (hit) this.damage(actor, target, Math.round((14 + Math.random() * 10) * scale));
      }
      if (distance(actor, target) < 7) {
        const sway = Math.sin(this.t * 2.3 + actor.id) * dt * 1.45;
        move(actor, Math.cos(actor.yaw) * sway, -Math.sin(actor.yaw) * sway);
        return;
      }
    }

    const goal = this.botGoal(actor);
    if (distance(actor, goal) <= (this.charge && actor.side === "wardens" ? 0.85 : 1.15)) return;
    if (this.t >= actor.planAt) {
      actor.route = pathTo(actor, goal);
      actor.planAt = this.t + 0.65 + actor.id * 0.06;
    }
    if (actor.route[0] && distance(actor, actor.route[0]) < 0.24) actor.route.shift();
    const next = clearLine(actor, goal, actorRadius) ? goal : actor.route[0];
    if (!next) return;
    const dx = next.x - actor.x;
    const dz = next.z - actor.z;
    const length = Math.hypot(dx, dz);
    if (length < 0.05) return;
    if (!target) {
      actor.yaw = Math.atan2(-dx, -dz);
      actor.shotAt = Math.max(actor.shotAt, this.t + (this.difficulty === "casual" ? 0.52 : 0.31));
    }
    const stride = Math.min(length, (target ? 2.1 : 3.55) * dt);
    move(actor, dx / length * stride, dz / length * stride);
  }

  private objectiveAt(actor: Actor) {
    if (actor.hp <= 0) return null;
    if (this.charge) {
      return actor.side === "wardens" && distance(actor, this.charge) <= 1.65
        ? { mode: "disable" as const, location: this.charge } : null;
    }
    if (actor.side !== "raiders") return null;
    const site = sites.find((candidate) => distance(actor, candidate) <= siteRadius);
    return site ? { mode: "deploy" as const, location: site } : null;
  }

  private tickObjective(input: Input, dt: number) {
    const player = this.player;
    const wantsUse = input.use && !input.fire && !input.forward && !input.strafe;
    const operator = [player, ...this.actors.slice(1)].find((actor) => {
      if (actor.id === 0) return wantsUse && this.objectiveAt(actor);
      return this.objectiveAt(actor) && this.t - actor.shotAt > -0.2;
    });
    const target = operator && this.objectiveAt(operator);
    if (!operator || !target) { this.objective = null; return; }
    if (this.objective?.actor !== operator.id || this.objective.mode !== target.mode) {
      this.objective = { actor: operator.id, mode: target.mode, progress: 0 };
    }
    this.objective.progress += dt / (target.mode === "deploy" ? 2.35 : 4.3);
    if (this.objective.progress < 1) return;
    this.objective = null;
    if (target.mode === "disable") this.finish("wardens", "Beacon disabled");
    else if ("id" in target.location) {
      this.charge = { x: operator.x, z: operator.z, site: target.location.id, endsAt: this.t + 31 };
      this.feed = [`Beacon deployed at ${this.charge.site}`, ...this.feed].slice(0, 4);
    }
  }

  step(dt: number, input: Input) {
    this.t += dt;
    this.traces = this.traces.filter((trace) => trace.expires > this.t);
    this.recoil = Math.max(0, this.recoil - dt * 1.8);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.damageFlash = Math.max(0, this.damageFlash - dt);
    if (this.phase === "buy") {
      this.player.yaw = input.yaw;
      this.aimPitch = input.pitch;
      if (this.t >= this.endsAt) this.startRound();
      return;
    }
    if (this.phase !== "round") return;
    if (this.charge && this.t >= this.charge.endsAt) { this.finish("raiders", "Beacon activated"); return; }
    if (!this.charge && this.t >= this.endsAt) { this.finish("wardens", "Time expired"); return; }

    const player = this.player;
    if (player.hp > 0) {
      player.yaw = input.yaw;
      this.aimPitch = input.pitch;
      const length = Math.max(1, Math.hypot(input.forward, input.strafe));
      const speed = dt * (input.walk ? 2.65 : 5.5) / length;
      const sin = Math.sin(player.yaw);
      const cos = Math.cos(player.yaw);
      move(player, (input.strafe * cos - input.forward * sin) * speed, (-input.strafe * sin - input.forward * cos) * speed);
      if (this.reloadAt && this.t >= this.reloadAt) {
        const rounds = Math.min(weapons[this.weapon.id].magazine - this.weapon.ammo, this.weapon.reserve);
        this.weapon.ammo += rounds;
        this.weapon.reserve -= rounds;
        this.reloadAt = 0;
      }
      if (input.fire) this.fire(!input.walk && Boolean(input.forward || input.strafe));
    }

    for (const actor of this.actors.slice(1)) if (actor.hp > 0) this.runBot(actor, dt);
    const alive = (side: Side) => this.actors.some((actor) => actor.side === side && actor.hp > 0);
    if (!alive("wardens")) this.finish("raiders", "Wardens eliminated");
    else if (!alive("raiders") && !this.charge) this.finish("wardens", "Raiders eliminated");
    else this.tickObjective(input, dt);
  }

  snapshot(): ArenaSnapshot {
    const player = this.player;
    const available = this.phase === "round" ? this.objectiveAt(player) : null;
    const time = this.charge && this.phase === "round" ? this.charge.endsAt : this.endsAt;
    return {
      phase: this.phase, side: player.side, time: Math.max(0, Math.ceil(time - this.t)),
      round: this.round, wins: this.wins, losses: this.losses, credits: this.credits, kills: this.kills,
      hp: player.hp, shield: player.shield, weapon: this.weapon.id, primary: this.primary?.id ?? null,
      ammo: this.weapon.ammo, reserve: this.weapon.reserve, reloading: Boolean(this.reloadAt),
      message: this.message, progress: this.objective?.actor === 0 ? this.objective.progress : 0,
      hint: available ? (available.mode === "deploy" ? "Hold to deploy beacon" : "Hold to disable beacon") : "",
      chargeSite: this.charge?.site ?? null,
      allies: this.actors.filter((actor) => actor.side === player.side && actor.hp > 0).length,
      enemies: this.actors.filter((actor) => actor.side !== player.side && actor.hp > 0).length,
      feed: this.feed,
    };
  }
}
