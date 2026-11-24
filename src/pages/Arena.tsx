import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowDownLeft, ArrowRight, Crosshair, Hand, Maximize2, Pause, RotateCcw, Shield, Volume2, VolumeX, Zap } from "lucide-react";
import { Link } from "wouter";
import { useMotionSettings } from "@/components/studio/Motion";
import { ArenaMatch, sideName, weapons, type ArenaSnapshot, type Difficulty, type Side } from "@/components/arena/match";
import { ArenaStage } from "@/components/arena/scene";
import "./arena.css";

const controlKeys = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "KeyR", "KeyE", "KeyF", "Digit1", "Digit2", "ShiftLeft", "ShiftRight", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

function playTone(audio: AudioContext | null, hit: boolean) {
  if (!audio || audio.state !== "running") return;
  const start = audio.currentTime;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = hit ? "sine" : "triangle";
  oscillator.frequency.setValueAtTime(hit ? 750 : 128, start);
  oscillator.frequency.exponentialRampToValueAtTime(hit ? 1040 : 48, start + 0.085);
  gain.gain.setValueAtTime(hit ? 0.055 : 0.09, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + 0.11);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(start + 0.12);
}

export default function Arena() {
  const [side, setSide] = useState<Side>("raiders");
  const [difficulty, setDifficulty] = useState<Difficulty>("standard");
  const [snapshot, setSnapshot] = useState<ArenaSnapshot | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [damage, setDamage] = useState(false);
  const [hit, setHit] = useState(false);
  const [sensitivity, setSensitivity] = useState(1);
  const [stick, setStick] = useState({ x: 0, y: 0 });
  const [touchMode, setTouchMode] = useState(() => window.matchMedia("(pointer: coarse)").matches);
  const { enabled } = useMotionSettings();
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLCanvasElement>(null);
  const stage = useRef<ArenaStage | null>(null);
  const match = useRef<ArenaMatch | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const paused = useRef(false);
  const sensitivityRef = useRef(1);
  const mutedRef = useRef(false);
  const reduce = useRef(!enabled);
  const aim = useRef({ yaw: 0, pitch: 0 });
  const pressed = useRef(new Set<string>());
  const firing = useRef(false);
  const firePointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const pulse = useRef(false);
  const using = useRef(false);
  const stickPosition = useRef({ x: 0, y: 0 });
  const movementPointer = useRef<number | null>(null);
  const aimingPointer = useRef<{ id: number; x: number; y: number; moved: number; mouse: boolean } | null>(null);
  const overlayPrimary = useRef<HTMLButtonElement>(null);

  useEffect(() => { reduce.current = !enabled; }, [enabled]);

  function update() {
    if (match.current) setSnapshot(match.current.snapshot());
  }

  function hasPointerLock() {
    return Boolean(host.current && document.pointerLockElement === host.current);
  }

  function clearInput() {
    pressed.current.clear();
    firing.current = false;
    firePointer.current = null;
    pulse.current = false;
    using.current = false;
    movementPointer.current = null;
    aimingPointer.current = null;
    stickPosition.current = { x: 0, y: 0 };
    setStick(stickPosition.current);
  }

  function changePause(next: boolean) {
    paused.current = next;
    setIsPaused(next);
    clearInput();
    if (next && hasPointerLock()) document.exitPointerLock();
  }

  function loadAudio() {
    try {
      audio.current ??= new AudioContext();
      void audio.current.resume().catch(() => {});
    } catch {
      // Audio is optional on browsers without Web Audio support.
    }
  }

  function lockPointer() {
    if (touchMode || !host.current?.requestPointerLock || hasPointerLock()) return;
    try {
      const requested = host.current.requestPointerLock();
      void requested?.catch(() => {});
    } catch {
      // Drag aiming remains available when pointer lock is blocked.
    }
  }

  function look(dx: number, dy: number) {
    const scale = 0.0023 * sensitivityRef.current;
    aim.current.yaw -= dx * scale;
    aim.current.pitch = Math.max(-1.32, Math.min(1.32, aim.current.pitch - dy * scale));
  }

  function newMatch() {
    if (!host.current || !map.current) return;
    try {
      stage.current ??= new ArenaStage(host.current, map.current);
      setError("");
    } catch {
      setError("This device couldn’t open the 3D arena. The other Lab games are still available.");
      return;
    }
    match.current = new ArenaMatch(side, difficulty);
    aim.current = { yaw: match.current.defaultYaw, pitch: 0 };
    loadAudio();
    changePause(false);
    update();
  }

  function deploy() {
    match.current?.startRound();
    changePause(false);
    frame.current?.focus({ preventScroll: true });
    lockPointer();
    update();
  }

  function advance() {
    const game = match.current;
    if (!game) return;
    game.nextRound();
    aim.current = { yaw: game.defaultYaw, pitch: 0 };
    clearInput();
    update();
  }

  function resume() {
    changePause(false);
    frame.current?.focus({ preventScroll: true });
    if (match.current?.phase === "round" && match.current.player.hp > 0) lockPointer();
  }

  function onLookStart(event: ReactPointerEvent<HTMLDivElement>) {
    if (paused.current || match.current?.phase !== "round" || match.current.player.hp <= 0 || event.button !== 0) return;
    if (event.pointerType === "touch") setTouchMode(true);
    frame.current?.focus({ preventScroll: true });
    if (hasPointerLock()) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    aimingPointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: 0, mouse: event.pointerType === "mouse" };
  }

  function onLookMove(event: ReactPointerEvent<HTMLDivElement>) {
    const pointer = aimingPointer.current;
    if (paused.current || !pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    look(dx * 1.3, dy * 1.3);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.moved += Math.hypot(dx, dy);
  }

  function endLook(event: ReactPointerEvent<HTMLDivElement>) {
    const pointer = aimingPointer.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    if (pointer.mouse && pointer.moved < 4 && event.type === "pointerup") pulse.current = true;
    aimingPointer.current = null;
  }

  function moveStick(event: ReactPointerEvent<HTMLButtonElement>) {
    if (movementPointer.current !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const radius = bounds.width * 0.33;
    const x = (event.clientX - bounds.left - bounds.width / 2) / radius;
    const y = (event.clientY - bounds.top - bounds.height / 2) / radius;
    const length = Math.max(1, Math.hypot(x, y));
    stickPosition.current = { x: x / length, y: y / length };
    setStick(stickPosition.current);
  }

  function endStick(event: ReactPointerEvent<HTMLButtonElement>) {
    if (movementPointer.current !== event.pointerId) return;
    movementPointer.current = null;
    stickPosition.current = { x: 0, y: 0 };
    setStick(stickPosition.current);
  }

  function holdControl(ref: { current: boolean }, event: ReactPointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    ref.current = true;
  }

  function endFire() {
    firing.current = false;
    firePointer.current = null;
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void frame.current?.requestFullscreen?.().catch(() => {});
    }
  }

  useEffect(() => {
    let last = performance.now();
    let lastSync = 0;
    let previousPhase: ArenaSnapshot["phase"] | undefined;
    let shot = 0;
    let landed = 0;
    let id = 0;
    const activeHere = () => Boolean(frame.current?.contains(document.activeElement) || hasPointerLock());
    const onKey = (event: KeyboardEvent) => {
      const game = match.current;
      if (!game || !activeHere() || event.altKey || event.metaKey || event.ctrlKey) return;
      if (event.code === "Escape" && !event.repeat && !paused.current && (game.phase === "round" || game.phase === "buy")) {
        event.preventDefault();
        changePause(true);
        return;
      }
      if (paused.current || game.phase !== "round" || !controlKeys.has(event.code)) return;
      event.preventDefault();
      pressed.current.add(event.code);
      if (event.repeat) return;
      if (event.code === "KeyR") game.reload();
      if (event.code === "Digit1" || event.code === "Digit2") game.equip(Number(event.code.slice(-1)));
    };
    const onKeyUp = (event: KeyboardEvent) => { pressed.current.delete(event.code); };
    const onMouse = (event: MouseEvent) => {
      if (!paused.current && hasPointerLock()) look(event.movementX, event.movementY);
    };
    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 0 && hasPointerLock()) {
        firing.current = true;
        pulse.current = true;
      }
    };
    const onMouseUp = () => { firing.current = false; };
    const onLock = () => {
      const hasLock = hasPointerLock();
      setLocked(hasLock);
      if (!hasLock && match.current?.phase === "round" && !paused.current && match.current.player.hp > 0) changePause(true);
    };
    const onBlur = () => {
      if (match.current?.phase === "round" || match.current?.phase === "buy") changePause(true);
    };
    const onVisibility = () => { if (document.hidden) onBlur(); };
    const registrations: Array<[EventTarget, string, EventListener]> = [
      [window, "keydown", onKey as EventListener], [window, "keyup", onKeyUp as EventListener],
      [window, "mousedown", onMouseDown as EventListener], [window, "mouseup", onMouseUp],
      [document, "mousemove", onMouse as EventListener], [document, "pointerlockchange", onLock],
      [window, "blur", onBlur], [document, "visibilitychange", onVisibility],
    ];
    for (const [target, name, listener] of registrations) target.addEventListener(name, listener);
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const game = match.current;
      if (game && !paused.current) {
        const keys = pressed.current;
        const keyboard = (positive: string, negative: string) => Number(keys.has(positive)) - Number(keys.has(negative));
        if (game.phase === "round") {
          aim.current.yaw += keyboard("ArrowLeft", "ArrowRight") * dt * 1.75;
          aim.current.pitch = Math.max(-1.32, Math.min(1.32, aim.current.pitch + keyboard("ArrowUp", "ArrowDown") * dt * 1.35));
        }
        game.step(dt, {
          forward: keyboard("KeyW", "KeyS") - stickPosition.current.y,
          strafe: keyboard("KeyD", "KeyA") + stickPosition.current.x,
          walk: keys.has("ShiftLeft") || keys.has("ShiftRight"),
          fire: firing.current || pulse.current || keys.has("KeyF"),
          use: using.current || keys.has("KeyE"),
          ...aim.current,
        });
        pulse.current = false;
        stage.current?.render(game, reduce.current);
        if (game.shotSerial !== shot && !mutedRef.current) playTone(audio.current, false);
        if (game.hitSerial !== landed && !mutedRef.current) playTone(audio.current, true);
        shot = game.shotSerial;
        landed = game.hitSerial;
        setDamage(!reduce.current && game.damageFlash > 0);
        setHit(game.hitFlash > 0);
        if (hasPointerLock() && (game.phase !== "round" || game.player.hp <= 0)) {
          document.exitPointerLock();
          clearInput();
        }
        if (now - lastSync > 70 || previousPhase !== game.phase) {
          lastSync = now;
          setSnapshot(game.snapshot());
        }
        previousPhase = game.phase;
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
      for (const [target, name, listener] of registrations) target.removeEventListener(name, listener);
      if (hasPointerLock()) document.exitPointerLock();
      stage.current?.dispose();
      stage.current = null;
      if (audio.current && audio.current.state !== "closed") void audio.current.close().catch(() => {});
      audio.current = null;
    };
  }, []);

  useEffect(() => {
    if (!snapshot || snapshot.phase === "buy" || isPaused || snapshot.phase === "result" || snapshot.phase === "complete") {
      overlayPrimary.current?.focus({ preventScroll: true });
    } else {
      frame.current?.focus({ preventScroll: true });
    }
  }, [isPaused, snapshot?.phase, snapshot?.round]);

  const active = snapshot?.phase === "round" && !isPaused;
  const canAct = active && snapshot.hp > 0;
  const equipment = ["vector", "arc", "shield"] as const;

  return (
    <section className="arena-page" aria-labelledby="arena-heading">
      <header className="arena-heading">
        <Link href="/lab" className="arena-back"><ArrowDownLeft size={17} /> Back to the Lab</Link>
        <h1 id="arena-heading">Relay <em>Sector.</em></h1>
        <p>Win five rounds of 3v3. Raiders deploy a beacon at A or B. Wardens stop the deployment or disable the beacon.</p>
      </header>
      <div
        ref={frame}
        className="arena-frame"
        tabIndex={-1}
        aria-label="Relay Sector game view"
        data-running={Boolean(active)}
      >
        <div
          ref={host}
          className="arena-render"
          onPointerDown={onLookStart}
          onPointerMove={onLookMove}
          onPointerUp={endLook}
          onPointerCancel={endLook}
          onLostPointerCapture={endLook}
        />
        {snapshot && (
          <div className="arena-hud">
            <div className="arena-hud-top">
              <div className="arena-score">
                <span>You <strong>{snapshot.wins}</strong></span>
                <b>{snapshot.time}s</b>
                <span><strong>{snapshot.losses}</strong> Rivals</span>
                <small>Round {snapshot.round} · {sideName(snapshot.side)}</small>
              </div>
              <button
                type="button"
                className="arena-icon"
                onClick={() => changePause(true)}
                aria-label="Pause game"
                hidden={!active}
              ><Pause size={18} /></button>
            </div>
            {active && snapshot.feed.length > 0 && <ul className="arena-feed">{snapshot.feed.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}</ul>}
            {active && snapshot.hp > 0 && <div className="arena-crosshair" data-hit={hit} aria-hidden="true" />}
            {damage && active && <div className="arena-damage" aria-hidden="true" />}
            {active && (
              <>
                <div className="arena-objective">
                  {snapshot.hp === 0 ? "Spectating your team" : snapshot.hint ? `${snapshot.hint}${touchMode ? "" : " · E"}` : snapshot.chargeSite ? `Beacon active at ${snapshot.chargeSite}` : ""}
                  {snapshot.progress > 0 && <progress max={1} value={snapshot.progress} aria-label="Objective progress" />}
                </div>
                <div className="arena-hud-bottom">
                  <span><strong>{snapshot.hp}</strong> HP <Shield size={15} /> {snapshot.shield}</span>
                  <small>{snapshot.allies} vs {snapshot.enemies} alive</small>
                  <span>{snapshot.reloading ? "Reloading" : weapons[snapshot.weapon].name} <strong>{snapshot.ammo}</strong> / {snapshot.reserve}</span>
                </div>
              </>
            )}
          </div>
        )}
        <canvas ref={map} className="arena-map" width={168} height={136} hidden={!snapshot || isPaused} aria-label="Minimap showing allies and objective sites" />
        {canAct && touchMode && (
          <div className="arena-touch">
            <button
              type="button" className="arena-stick" aria-label="Drag to move"
              onPointerDown={(event) => {
                movementPointer.current = event.pointerId;
                event.currentTarget.setPointerCapture(event.pointerId);
                moveStick(event);
              }}
              onPointerMove={moveStick} onPointerUp={endStick} onPointerCancel={endStick} onLostPointerCapture={endStick}
            ><span style={{ transform: `translate(${stick.x * 24}px, ${stick.y * 24}px)` }} /></button>
            <div className="arena-touch-actions">
              {snapshot.primary && (
                <button type="button" onClick={() => match.current?.equip(snapshot.weapon === "spark" ? 2 : 1)}>Swap</button>
              )}
              <button type="button" aria-label="Reload" onClick={() => match.current?.reload()}><RotateCcw size={19} /></button>
              <button
                type="button" aria-label="Hold to interact"
                onPointerDown={(event) => holdControl(using, event)}
                onPointerUp={() => { using.current = false; }}
                onPointerCancel={() => { using.current = false; }}
                onLostPointerCapture={() => { using.current = false; }}
              ><Hand size={19} /></button>
              <button
                type="button" aria-label="Hold to fire"
                onPointerDown={(event) => {
                  holdControl(firing, event);
                  pulse.current = true;
                  firePointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
                }}
                onPointerMove={(event) => {
                  const pointer = firePointer.current;
                  if (pointer?.id !== event.pointerId) return;
                  look((event.clientX - pointer.x) * 1.45, (event.clientY - pointer.y) * 1.45);
                  pointer.x = event.clientX;
                  pointer.y = event.clientY;
                }}
                onPointerUp={endFire}
                onPointerCancel={endFire}
                onLostPointerCapture={endFire}
              ><Crosshair size={23} /></button>
            </div>
          </div>
        )}
        {(!snapshot || isPaused || snapshot.phase !== "round") && (
          <div className="arena-overlay">
            <div className="arena-panel">
              {isPaused ? (
                <>
                  <h2>Paused</h2>
                  <button ref={overlayPrimary} type="button" className="arena-primary" onClick={resume}>Resume <ArrowRight size={18} /></button>
                  {document.fullscreenEnabled && <button type="button" className="arena-secondary" onClick={toggleFullscreen}>Toggle fullscreen</button>}
                  <button type="button" className="arena-secondary" onClick={newMatch}>Start a new match</button>
                  <Link href="/lab" className="arena-secondary">Exit to the Lab</Link>
                </>
              ) : !snapshot ? (
                <>
                  <h2>Enter the arena</h2>
                  <p>Solo match with bots. Pick your starting side and difficulty.</p>
                  <div className="arena-selectors">
                    <label>Starting side<select value={side} onChange={(event) => setSide(event.target.value as Side)}><option value="raiders">Raiders</option><option value="wardens">Wardens</option></select></label>
                    <label>Difficulty<select value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)}><option value="casual">Casual</option><option value="standard">Standard</option><option value="expert">Expert</option></select></label>
                  </div>
                  {error && <p role="alert">{error}</p>}
                  <button ref={overlayPrimary} type="button" className="arena-primary" onClick={newMatch}>Start match <ArrowRight size={18} /></button>
                </>
              ) : snapshot.phase === "buy" ? (
                <>
                  <h2>Buy phase</h2>
                  <p>{snapshot.message} <strong>{snapshot.credits.toLocaleString()} credits</strong></p>
                  <div className="arena-shop">
                    {equipment.map((item) => {
                      const price = item === "shield" ? 500 : weapons[item].price;
                      const owned = item === "shield" ? snapshot.shield === 50 : snapshot.primary === item;
                      return <button key={item} type="button" disabled={owned || snapshot.credits < price} onClick={() => { match.current?.buy(item); update(); }}>
                        <strong>{item === "shield" ? "Shield" : weapons[item].name}</strong>
                        <span>{item === "shield" ? "Absorbs damage" : weapons[item].kind}</span>
                        <small>{owned ? "Equipped" : `${price.toLocaleString()} cr`}</small>
                      </button>;
                    })}
                  </div>
                  <button ref={overlayPrimary} type="button" className="arena-primary" onClick={deploy}>Deploy now <ArrowRight size={18} /></button>
                </>
              ) : (
                <>
                  <h2>{snapshot.phase === "complete" ? snapshot.wins > snapshot.losses ? "Match won" : "Match lost" : "Round complete"}</h2>
                  <p>{snapshot.message}</p>
                  <p><strong>{snapshot.wins}–{snapshot.losses}</strong> · {snapshot.kills} eliminations</p>
                  <button ref={overlayPrimary} type="button" className="arena-primary" onClick={snapshot.phase === "complete" ? newMatch : advance}>
                    {snapshot.phase === "complete" ? "Play again" : "Next round"} <ArrowRight size={18} />
                  </button>
                  {snapshot.phase === "complete" && <Link href="/lab" className="arena-secondary">Exit to the Lab</Link>}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="arena-details">
        <div>
          <h2>Controls</h2>
          <p>{touchMode ? "Drag the left stick to move. Drag the arena to aim. Use the on-screen buttons to fire, reload, or interact." : "WASD to move, mouse or arrows to aim, click or F to fire, R to reload, E to interact, 1 or 2 to switch weapons. Shift slows your movement. Esc pauses."}</p>
          {!touchMode && <p>{locked ? "Mouse captured for aiming." : "If mouse capture is unavailable, drag the arena to aim."}</p>}
        </div>
        <div className="arena-settings">
          <button type="button" className="arena-secondary" aria-pressed={muted} onClick={() => {
            mutedRef.current = !muted;
            setMuted(!muted);
            if (muted && match.current) loadAudio();
          }}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />} {muted ? "Sound off" : "Sound on"}</button>
          {document.fullscreenEnabled && <button type="button" className="arena-secondary" onClick={toggleFullscreen}><Maximize2 size={16} /> Fullscreen</button>}
          <label>Aim sensitivity <input type="range" min="0.5" max="2" step="0.1" value={sensitivity} onChange={(event) => {
            const value = Number(event.target.value);
            sensitivityRef.current = value;
            setSensitivity(value);
          }} /></label>
        </div>
      </div>
      <p className="arena-tip"><Zap size={16} aria-hidden="true" /> Buy equipment with round rewards. Surviving a round keeps your primary weapon and remaining shield.</p>
    </section>
  );
}
