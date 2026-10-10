import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useMotionSettings } from "./Motion";
import "./site-entrance.css";

const DriftScene = lazy(() => import("./DriftScene"));
const DURATION = 3.8;

function CarSilhouette() {
  return <svg viewBox="0 0 360 130" fill="none" aria-hidden="true">
    <path d="M20 85 31 63 91 53 127 18 216 18 261 57 328 65 342 90 337 104H22Z" fill="#23291d" />
    <path d="m112 52 26-25h70l32 27Z" fill="#60723c" />
    <path d="M27 76h59m186 0h57M125 61h118" stroke="#d5ff00" strokeWidth="5" />
    {[86, 275].map(x => <g key={x}><circle cx={x} cy="99" r="27" fill="#161a12" /><circle cx={x} cy="99" r="16" stroke="#c6d0b9" strokeWidth="5" /><circle cx={x} cy="99" r="5" fill="#d5ff00" /></g>)}
  </svg>;
}
function FlatDrive({ enabled, onFinish, onPhase }: {
  enabled: boolean; onFinish: () => void; onPhase: (phase: number) => void;
}) {
  useEffect(() => {
    const start = performance.now();
    const tick = window.setInterval(() => onPhase(Math.min(1, (performance.now() - start) / (DURATION * 1000))), 100);
    const end = window.setTimeout(onFinish, enabled ? DURATION * 1000 : 350);
    return () => { clearInterval(tick); clearTimeout(end); };
  }, [enabled, onFinish, onPhase]);
  return <motion.div className="entrance-flat-car" initial={enabled ? { x: "-80vw" } : false}
    animate={enabled ? { x: ["-80vw", "-3vw", "4vw", "90vw"], rotate: [0, -13, 9, 0] } : {}}
    transition={{ duration: DURATION, times: [0, 0.32, 0.7, 1], ease: "easeInOut" }}>
    <CarSilhouette />
  </motion.div>;
}
class DriveBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function Preloader({ onFinish }: { onFinish: () => void }) {
  const { enabled } = useMotionSettings();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [assetsReady, setAssetsReady] = useState(false);
  const [driveDone, setDriveDone] = useState(false);
  const [phase, setPhase] = useState(0);
  const progress = useMotionValue(0);
  const screen = useRef<HTMLElement>(null);
  const onPhase = useCallback((value: number) => {
    progress.set(value);
    setPhase(value < 0.28 ? 0 : value < 0.7 ? 1 : 2);
  }, [progress]);
  const finishDrive = useCallback(() => setDriveDone(true), []);
  useEffect(() => {
    let cancelled = false;
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      setSupported(!!gl);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { setSupported(false); }
    // Readiness is real; the line shows the entrance sequence, not a fake asset percentage.
    const images = Array.from(document.images).filter(img => img.fetchPriority === "high");
    Promise.all([document.fonts.ready, ...images.map(img => img.decode().catch(() => {}))])
      .then(() => { if (!cancelled) setAssetsReady(true); });
    const deadline = window.setTimeout(onFinish, 8000);
    screen.current?.focus({ preventScroll: true });
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") onFinish(); };
    window.addEventListener("keydown", escape);
    return () => { cancelled = true; clearTimeout(deadline); window.removeEventListener("keydown", escape); };
  }, [onFinish]);
  useEffect(() => { if (assetsReady && driveDone) onFinish(); }, [assetsReady, driveDone, onFinish]);
  const fallback = <FlatDrive enabled={enabled} onFinish={finishDrive} onPhase={onPhase} />;
  return <motion.section ref={screen} tabIndex={-1} className="site-entrance" aria-label="Taha Sohail loading screen"
    initial={false} exit={enabled ? { clipPath: "inset(0 0 100% 0)" } : { opacity: 0 }}
    transition={{ duration: enabled ? 0.65 : 0.15, ease: [0.76, 0, 0.24, 1] }}>
    <div className="entrance-top"><span className="entrance-monogram">TS↗</span><span>CODE. CRAFT. CURIOSITY.</span></div>
    <div className="entrance-wordmark" aria-hidden="true">TAHA</div>
    <div className="entrance-scene" aria-hidden="true">
      {enabled && supported ? <DriveBoundary fallback={fallback}>
        <Suspense fallback={<div className="entrance-warming"><CarSilhouette /></div>}>
          <DriftScene duration={DURATION} onFinish={finishDrive} onPhase={onPhase} />
        </Suspense>
      </DriveBoundary> : supported !== null ? fallback : null}
    </div>
    <div className="entrance-bottom">
      <span className="entrance-edition">TAHA SOHAIL<br />PORTFOLIO / VOL. 02</span>
      <div className="entrance-caption">
        <p className="entrance-title">LOAD <em>TAHA</em></p>
        <span className="entrance-status" role="status">{driveDone ? (assetsReady ? "READY TO EXPLORE" : "FINISHING THE DETAILS") : ["IGNITION", "FINDING THE APEX", "FULL THROTTLE"][phase]}</span>
        <div className="entrance-track"><motion.span style={{ scaleX: progress }} /></div>
      </div>
      <button className="entrance-skip" onClick={onFinish}>SKIP INTRO ↗</button>
    </div>
  </motion.section>;
}

export function SiteEntrance({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [blocked, setBlocked] = useState(true);
  const content = useRef<HTMLDivElement>(null);
  const finish = useCallback(() => setVisible(false), []);
  useEffect(() => {
    if (!blocked) {
      content.current?.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
      return;
    }
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [blocked]);
  return <>
    <div ref={content} inert={blocked} aria-hidden={blocked ? true : undefined}>{children}</div>
    <AnimatePresence onExitComplete={() => setBlocked(false)}>
      {visible && <Preloader key="entrance" onFinish={finish} />}
    </AnimatePresence>
  </>;
}
