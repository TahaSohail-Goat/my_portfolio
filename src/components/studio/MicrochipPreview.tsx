import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useScroll } from "framer-motion";
import { useMotionSettings } from "./Motion";
import "./microchip.css";

const MicrochipScene = lazy(() => import("./MicrochipScene"));
function Fallback() {
  return <div className="microchip-fallback" aria-hidden="true"><div>
    <span className="microchip-static-base" /><span className="microchip-static-board" />
    <span className="microchip-static-die">TS</span><span className="microchip-static-lid">TS / ENGINE</span>
  </div></div>;
}
class ChipBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <Fallback /> : this.props.children; }
}
export function MicrochipPreview() {
  const ref = useRef<HTMLAnchorElement>(null), timer = useRef<number | undefined>(undefined);
  const pointer = useRef({ x: 0, y: 0 });
  const { enabled } = useMotionSettings();
  const [, navigate] = useLocation();
  const [supported, setSupported] = useState(false), [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false), [hovered, setHovered] = useState(false), [entering, setEntering] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start .95", "start .2"] });
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas"), gl = canvas.getContext("webgl2");
      setSupported(!!gl); gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { setSupported(false); }
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); preload.disconnect(); }
    }, { rootMargin: "300px" });
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) { preload.observe(ref.current); observer.observe(ref.current); }
    return () => { preload.disconnect(); observer.disconnect(); clearTimeout(timer.current); };
  }, []);
  return <Link ref={ref} href="/lab" className="lab-graphic microchip-preview" data-entering={entering}
    aria-label="Explore the curiosity engine. Open the interactive lab."
    onPointerEnter={e => { if (e.pointerType !== "touch") setHovered(true); }}
    onPointerLeave={() => { setHovered(false); pointer.current = { x: 0, y: 0 }; }}
    onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}
    onPointerMove={e => {
      if (!enabled || e.pointerType === "touch") return;
      const rect = e.currentTarget.getBoundingClientRect();
      pointer.current = { x: (e.clientX - rect.left) / rect.width * 2 - 1,
        y: 1 - (e.clientY - rect.top) / rect.height * 2 };
    }}
    onClick={e => {
      if (!enabled || !supported || !near || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault(); if (entering) return;
      setEntering(true);
      timer.current = window.setTimeout(() => navigate("/lab"), 450);
    }}>
    <ChipBoundary>{supported && near ? <Suspense fallback={<Fallback />}>
      <MicrochipScene progress={scrollYProgress} pointer={pointer} hovered={hovered} entering={entering}
        enabled={enabled} active={visible && enabled} />
    </Suspense> : <Fallback />}</ChipBoundary>
  </Link>;
}
