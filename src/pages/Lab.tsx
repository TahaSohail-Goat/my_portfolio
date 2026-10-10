import { lazy, Suspense, useState } from "react";
import { RotateCcw, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { Reveal, useMotionSettings } from "@/components/studio/Motion";
const Sculpture = lazy(() => import("@/components/studio/Sculpture"));
export default function Lab() {
  const [exploded, setExploded] = useState(0.35),
    [speed, setSpeed] = useState(0.7),
    [variant, setVariant] = useState(0),
    [wireframe, setWireframe] = useState(false),
    [reset, setReset] = useState(0),
    [angle, setAngle] = useState(0);
  const { enabled } = useMotionSettings();
  function resetScene() {
    setExploded(0.35);
    setSpeed(0.7);
    setVariant(0);
    setWireframe(false);
    setAngle(0);
    setReset((n) => n + 1);
  }
  return (
    <>
      <section className="page-header lab-header">
        <Reveal>
          <span className="eyebrow">A SMALL PLACE FOR BIG CURIOSITY</span>
          <div className="page-header-row">
            <h1>
              Less theory.
              <br />
              <em>More play.</em>
            </h1>
            <p className="page-intro">
              An interactive study in form, light, and motion. Make it your own.
            </p>
          </div>
        </Reveal>
      </section>
      <section className="lab-workbench">
        <div className="lab-viewport">
          <div className="lab-viewport-top">
            <span>EXPERIMENT 001</span>
            <span>
              <i className="status-dot" />
              {enabled ? "LIVE SCULPTURE" : "MOTION PAUSED"}
            </span>
          </div>
          <div className="lab-scene">
            <Suspense
              fallback={
                <div className="sculpture-fallback">
                  <span />
                  <span />
                </div>
              }
            >
              <Sculpture
                key={reset}
                interactive
                exploded={exploded}
                speed={speed}
                wireframe={wireframe}
                variant={variant}
                angle={angle}
              />
            </Suspense>
          </div>
          <div className="lab-viewport-bottom">
            <span>DRAG TO ORBIT / USE CONTROLS TO EXPLORE</span>
            <span>FIG. 001 / THE CURIOSITY ENGINE</span>
          </div>
          <div className="lab-crosshair crosshair-a" />
          <div className="lab-crosshair crosshair-b" />
        </div>
        <aside className="lab-controls" aria-label="Sculpture controls">
          <div className="lab-control-heading">
            <span className="eyebrow">YOUR EXPERIMENT</span>
            <h2>
              Change the
              <br />
              <em>perspective.</em>
            </h2>
          </div>
          <label className="lab-slider">
            <span>
              Assembly <output>{Math.round((exploded / 2) * 100)}%</output>
            </span>
            <input
              type="range"
              aria-label="Assembly"
              min="0"
              max="2"
              step=".01"
              value={exploded}
              onChange={(e) => setExploded(Number(e.target.value))}
            />
            <small>
              <span>TOGETHER</span>
              <span>APART</span>
            </small>
          </label>
          <label className="lab-slider">
            <span>
              Rotation speed <output>{speed.toFixed(1)}×</output>
            </span>
            <input
              type="range"
              aria-label="Rotation speed"
              min="0"
              max="2"
              step=".1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={!enabled}
            />
          </label>
          <label className="lab-slider">
            <span>
              Form angle <output>{Math.round((angle * 180) / Math.PI)}°</output>
            </span>
            <input
              type="range"
              aria-label="Form angle"
              min="0"
              max="6.28"
              step=".01"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
            />
          </label>
          <fieldset className="lab-materials">
            <legend>Material & form</legend>
            {["Chrome", "Porcelain", "Faceted"].map((v, i) => (
              <button
                key={v}
                className={variant === i ? "active" : ""}
                aria-pressed={variant === i}
                onClick={() => setVariant(i)}
              >
                <i className={`material-swatch swatch-${i}`} />
                {v}
              </button>
            ))}
          </fieldset>
          <label className="lab-switch">
            <span>Reveal the wireframe</span>
            <input
              type="checkbox"
              checked={wireframe}
              onChange={(e) => setWireframe(e.target.checked)}
            />
          </label>
          <button className="lab-reset" onClick={resetScene}>
            <RotateCcw size={15} />
            Reset experiment
          </button>
          <p className="lab-control-note">
            There’s no right answer here.
            <br />
            Just another way to see things.
          </p>
        </aside>
      </section>
      <section className="lab-after section-pad">
        <Reveal>
          <span className="eyebrow">CURIOSITY IS THE STARTING POINT</span>
          <h2>
            Experiments become ideas.
            <br />
            <em>Ideas become real things.</em>
          </h2>
          <Link href="/work" className="text-link">
            See the engineering behind the play <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
