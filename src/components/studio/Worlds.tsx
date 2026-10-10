import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { useScroll } from "framer-motion";
import { Contours } from "./Contours";
import { useMotionSettings } from "./Motion";
import "./worlds.css";

const WorldScene = lazy(() => import("./WorldScene"));
type Kind = "work" | "lab";
type Pointer = { x: number; y: number };

function WorldFallback({ kind }: { kind: Kind }) {
  return <div className={`world-static world-static-${kind}`}>
    {kind === "work" ? <div className="world-static-terminal">
      <span>taha / studio.ts</span><pre>{'const idea = {\n  logic: "clear",\n  motion: "intentional"\n};\n\nbuild(idea);'}</pre>
    </div> : <div className="world-static-core"><i /><i /><i /><span /></div>}
  </div>;
}
class WorldBoundary extends Component<{ children: ReactNode; kind: Kind }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <WorldFallback kind={this.props.kind} /> : this.props.children; }
}

function WorldPanel({ kind, supported }: { kind: Kind; supported: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const timer = useRef<number | undefined>(undefined);
  const { enabled } = useMotionSettings();
  const [, navigate] = useLocation();
  const [near, setNear] = useState(false), [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false), [entering, setEntering] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start .95", "start .25"] });
  useEffect(() => {
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); preload.disconnect(); }
    }, { rootMargin: "320px" });
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) { preload.observe(ref.current); observer.observe(ref.current); }
    return () => { preload.disconnect(); observer.disconnect(); clearTimeout(timer.current); };
  }, []);
  const work = kind === "work";
  const fallback = <WorldFallback kind={kind} />;
  return <Link ref={ref} href={work ? "/work" : "/lab"}
    className={`world-panel immersive-world world-${kind}`} data-entering={entering}
    aria-label={work ? "Logic in motion. Explore my work." : "Beyond the code. Explore the interactive lab."}
    onPointerEnter={e => { if (e.pointerType !== "touch") setHovered(true); }}
    onPointerLeave={() => { setHovered(false); pointer.current = { x: 0, y: 0 }; }}
    onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}
    onPointerMove={e => {
      if (!enabled || e.pointerType === "touch") return;
      const bounds = e.currentTarget.getBoundingClientRect();
      pointer.current = { x: (e.clientX - bounds.left) / bounds.width * 2 - 1,
        y: -((e.clientY - bounds.top) / bounds.height * 2 - 1) };
    }}
    onClick={e => {
      if (!enabled || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (entering) return;
      setEntering(true);
      timer.current = window.setTimeout(() => navigate(work ? "/work" : "/lab"), 420);
    }}>
    <div className="world-heading">
      <span className="eyebrow">{work ? "01 / THE ENGINEER" : "02 / THE EXPLORER"}</span>
      <h2>{work ? "LOGIC" : "BEYOND"}<br /><em>{work ? "IN MOTION." : "THE CODE."}</em></h2>
    </div>
    <div className="world-scene" aria-hidden="true">
      <div className="world-scene-floor" />
      <WorldBoundary kind={kind}>
        {near && supported ? <Suspense fallback={fallback}>
          <WorldScene kind={kind} progress={scrollYProgress} pointer={pointer} hovered={hovered}
            entering={entering} enabled={enabled} active={visible && enabled} />
        </Suspense> : fallback}
      </WorldBoundary>
      <span className="world-scene-label">{work ? "IDEA → SYSTEM → EXPERIENCE" : "FORM ↔ MOTION ↔ POSSIBILITY"}</span>
    </div>
    <div className="world-copy">
      <p>{work ? "Algorithms, architecture, interfaces. Turning complex ideas into software that works."
        : "Form, motion, playful experiments. Exploring what happens when code becomes an experience."}</p>
      <div className="world-destination"><span>{work ? "EXPLORE THE WORK" : "ENTER THE LAB"}</span>
        <span className="world-arrow"><ArrowUpRight /></span></div>
    </div>
  </Link>;
}

export function Worlds() {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      setSupported(!!gl);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { setSupported(false); }
  }, []);
  return <section className="worlds-section immersive-worlds" aria-label="Explore engineering and creative experiments">
    <Contours /><WorldPanel kind="work" supported={supported} /><WorldPanel kind="lab" supported={supported} />
  </section>;
}
