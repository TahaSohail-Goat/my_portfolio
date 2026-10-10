import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "wouter";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MoveUpRight,
} from "lucide-react";
import { projects } from "@/data/projects.data";
import { Reveal, useMotionSettings } from "@/components/studio/Motion";
import { ProjectArt } from "@/components/studio/ProjectArt";
import { Contours } from "@/components/studio/Contours";
import { Worlds } from "@/components/studio/Worlds";
import { MicrochipPreview } from "@/components/studio/MicrochipPreview";
const ParticleMonogram = lazy(() => import("@/components/studio/ParticleMonogram"));
function Hero() {
  const ref = useRef<HTMLElement>(null),
    portrait = useRef<HTMLDivElement>(null);
  const { enabled } = useMotionSettings();
  const [locked, setLocked] = useState(false);
  const [secondVisible, setSecondVisible] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    setSecondVisible(value > 0.48),
  );
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.48, 1],
    [1, 1, 0, 0],
  );
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 0.62]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "-17%"]);
  const photoOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.6, 1],
    [1, 1, 0, 0],
  );
  const objectOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.55, 1],
    [0, 0, 1, 1],
  );
  const objectScale = useTransform(scrollYProgress, [0, 1], [0.7, 0.9]);
  return (
    <section
      className={`performance-hero ${enabled ? "is-animated" : ""}`}
      ref={ref}
    >
      <div className="performance-stage">
        <Contours className="hero-contours" />
        <div className="hero-coordinate">
          PAKISTAN · WORLDWIDE
          <br />
          SOFTWARE ENGINEERING / FAST-NUCES
        </div>
        <motion.div
          className="performance-title"
          inherit={false}
          inert={enabled && secondVisible}
          style={enabled ? { y: titleY, opacity: titleOpacity } : {}}
        >
          <span className="hero-small-title">
            CURIOUS MIND. RELENTLESS BUILDER.
          </span>
          <h1 aria-label="Taha Sohail. Software engineer.">
            <span className="performance-title-line">
              <motion.span
                initial={enabled ? { y: "105%" } : false}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <em>TAHA</em>
              </motion.span>
            </span>
            <span className="performance-title-line">
              <motion.span
                initial={enabled ? { y: "105%" } : false}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                SOHAIL<span className="title-period">.</span>
              </motion.span>
            </span>
          </h1>
          <div className="performance-description">
            <p>
              Building thoughtful systems.
              <br />
              Chasing extraordinary experiences.
            </p>
            <Link href="/work" className="performance-button">
              EXPLORE THE WORK <ArrowUpRight size={18} />
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="performance-portrait"
          inert={enabled && secondVisible}
          style={
            enabled
              ? { scale: photoScale, y: photoY, opacity: photoOpacity }
              : {}
          }
          ref={portrait}
          data-locked={locked}
          onPointerMove={(e) => {
            if (!enabled || locked || !portrait.current) return;
            const r = e.currentTarget.getBoundingClientRect();
            portrait.current.style.setProperty(
              "--reveal-x",
              `${((e.clientX - r.left) / r.width) * 100}%`,
            );
            portrait.current.style.setProperty(
              "--reveal-y",
              `${((e.clientY - r.top) / r.height) * 100}%`,
            );
          }}
        >
          <img
            className="portrait-base"
            src="/taha-photo.png"
            alt="Taha Sohail, software engineer"
            width="1254"
            height="1254"
            fetchPriority="high"
          />
          <img
            className="portrait-reveal"
            src="/taha-photo.png"
            alt=""
            aria-hidden="true"
            width="1254"
            height="1254"
          />
          <span className="portrait-scan-line" aria-hidden="true" />
          <button
            className="portrait-lock"
            aria-pressed={locked}
            onClick={() => setLocked(!locked)}
          >
            {locked ? "BACK TO EXPLORING" : "REVEAL THE PERSON"}
            <MoveUpRight size={14} />
          </button>
        </motion.div>
        {enabled && (
          <motion.div
            className="performance-object"
            aria-hidden="true"
            inherit={false}
            style={{ opacity: objectOpacity, scale: objectScale }}
          >
            <Suspense
              fallback={
                <div className="particle-monogram-fallback">TS</div>
              }
            >
              <ParticleMonogram progress={scrollYProgress} />
            </Suspense>
          </motion.div>
        )}
        {enabled && (
          <motion.div
            className="performance-second"
            inert={!secondVisible}
            inherit={false}
            style={{ opacity: objectOpacity }}
          >
            <span className="eyebrow">BEYOND THE SURFACE</span>
            <p>
              BUILT TO
              <br />
              <em>GO FURTHER.</em>
            </p>
            <Link href="/lab" className="performance-button">
              EXPLORE THE ENGINE <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        )}
        <div className="performance-bottom">
          <a href="#intro" className="performance-scroll">
            <span>
              <ArrowDown size={17} />
            </span>{" "}
            SCROLL INTO MY WORLD
          </a>
          <span className="hero-stamp">
            TS / VOL. 02
            <br />
            CODE. CRAFT. CURIOSITY.
          </span>
          <span className="hero-availability">
            <i className="status-dot" />
            OPEN FOR COLLABORATIONS
          </span>
        </div>
      </div>
    </section>
  );
}
function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = useMotionSettings();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start .85", "end .85"],
  });
  const words =
    "I turn complex problems into thoughtful systems. Bringing logic, imagination, and a little beautiful chaos to everything I build.".split(
      " ",
    );
  return (
    <section className="performance-manifesto" id="intro" ref={ref}>
      <span className="eyebrow">THE MINDSET / ALWAYS MOVING FORWARD</span>
      <h2 aria-label={words.join(" ")}>
        {words.map((word, i) => (
          <ManifestoWord
            key={i}
            word={word}
            index={i}
            count={words.length}
            progress={scrollYProgress}
            enabled={enabled}
          />
        ))}
      </h2>
      <div className="manifesto-signoff">
        <span className="signature-mark">Taha.</span>
        <p>
          Software Engineering student at FAST-NUCES.
          <br />
          C++, Python, and the modern web.
        </p>
        <Link href="/about">
          THE PERSON BEHIND THE CODE <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}
function ManifestoWord({
  word,
  index,
  count,
  progress,
  enabled,
}: {
  word: string;
  index: number;
  count: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  enabled: boolean;
}) {
  const opacity = useTransform(
    progress,
    [0, index / count, (index + 1) / count, 1],
    [0.25, 0.25, 1, 1],
  );
  return (
    <motion.span
      aria-hidden="true"
      style={enabled ? { opacity } : {}}
      className={
        ["complex", "thoughtful", "imagination,", "beautiful"].includes(word)
          ? "serif-word"
          : ""
      }
    >
      {word}{" "}
    </motion.span>
  );
}
function ProjectExhibition() {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = useMotionSettings();
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(
    () =>
      window.matchMedia("(min-width: 900px) and (min-height: 540px)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 900px) and (min-height: 540px)",
    );
    const change = () => setDesktop(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (enabled && desktop)
      setActive(Math.min(projects.length - 1, Math.floor(p * projects.length)));
  });
  const p = projects[active];
  function select(index: number) {
    const next = (index + projects.length) % projects.length;
    setActive(next);
    if (enabled && desktop && ref.current) {
      const el = ref.current;
      window.scrollTo({
        top:
          el.getBoundingClientRect().top +
          window.scrollY +
          ((el.offsetHeight - window.innerHeight) * (next + 0.18)) /
            projects.length,
        behavior: "instant",
      });
    }
  }
  return (
    <section
      className={`project-exhibition ${enabled && desktop ? "is-animated" : ""}`}
      ref={ref}
      id="selected-work"
    >
      <div className="exhibition-stage">
        <div className="exhibition-heading">
          <div>
            <span className="eyebrow">01 / BUILT, NOT JUST IMAGINED</span>
            <h2>
              SELECTED <em>WORK.</em>
            </h2>
          </div>
          <Link href="/work" className="exhibition-all">
            ALL PROJECTS (04)
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="exhibition-body">
          <div
            className="exhibition-index"
            role="group"
            aria-label="Choose a project"
          >
            {projects.map((project, i) => (
              <button
                key={project.id}
                aria-pressed={active === i}
                onClick={() => select(i)}
              >
                <span>0{i + 1}</span>
                <b>{project.title}</b>
                <ArrowUpRight size={18} />
              </button>
            ))}
            <span className="exhibition-scroll-label">
              {enabled && desktop
                ? "KEEP SCROLLING TO EXPLORE"
                : "SELECT A PROJECT TO EXPLORE"}
            </span>
          </div>
          <div className="exhibition-feature">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.id}
                initial={enabled ? { opacity: 0, y: 32, rotateX: 5 } : false}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="exhibition-art"
              >
                <Link href={`/work/${p.id}`} aria-label={`Explore ${p.title}`}>
                  <ProjectArt id={p.id} large />
                  <span className="exhibition-open">
                    VIEW PROJECT <ArrowUpRight size={22} />
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
            <div className="exhibition-meta" aria-live="polite">
              <div>
                <span>{p.category}</span>
                <h3>{p.title}</h3>
              </div>
              <span className="exhibition-counter">
                0{active + 1}
                <small>/ 04</small>
              </span>
            </div>
            <div className="exhibition-bottom">
              <p>{p.technologies.slice(0, 3).join(" / ")}</p>
              <div>
                <button
                  aria-label="Previous project"
                  onClick={() => select(active - 1)}
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  aria-label="Next project"
                  onClick={() => select(active + 1)}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default function Home() {
  return (
    <div className="performance-home">
      <Hero />
      <Manifesto />
      <Worlds />
      <ProjectExhibition />
      <section className="performance-toolkit">
        <span className="eyebrow">02 / DIFFERENT TOOLS. ONE CURIOUS MIND.</span>
        <div className="toolkit-marquee" aria-hidden="true">
          {[0, 1].map((n) => (
            <div key={n}>
              C++ <i>✳</i> REACT <i>✳</i> PYTHON <i>✳</i> NEXT.JS <i>✳</i> JAVA{" "}
              <i>✳</i>
            </div>
          ))}
        </div>
        <div className="toolkit-marquee-label">
          <p>
            Strong fundamentals.
            <br />
            Room for the unexpected.
          </p>
          <Link href="/about#toolkit">
            EXPLORE MY TOOLKIT <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="performance-lab">
        <div className="lab-title">
          <Reveal>
            <span className="eyebrow">03 / A LITTLE BEAUTIFUL CHAOS</span>
            <h2>
              BREAK IT
              <br />
              <em>APART.</em>
            </h2>
            <p>
              Change the form. Bend the perspective.
              <br />
              Get your hands on the curiosity engine.
            </p>
            <Link href="/lab" className="performance-button">
              ENTER THE LAB <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </div>
        <MicrochipPreview />
        <span className="lab-experiment-id">
          EXPERIMENT 001 / FORM + MOTION
        </span>
      </section>
      <section className="performance-contact">
        <span className="eyebrow">GOT SOMETHING IN MIND?</span>
        <Link href="/contact">
          <span>LET’S BUILD</span>
          <em>WHAT’S NEXT.</em>
          <ArrowUpRight />
        </Link>
        <div>
          <span>
            <i className="status-dot" />
            OPEN TO IDEAS & COLLABORATIONS
          </span>
          <a href="mailto:tahasohail85@gmail.com">TAHASOHAIL85@GMAIL.COM ↗</a>
        </div>
      </section>
    </div>
  );
}
