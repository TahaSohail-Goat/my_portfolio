import { useState, useRef, lazy, Suspense } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { FiGithub } from 'react-icons/fi';
import { projects, Project } from '@/data/projects.data';

// Lazy-load the heavy R3F orbital scene so it doesn't block first paint
const ProjectOrbitalScene = lazy(() =>
  import('@/components/3d/ProjectOrbitalScene').then(m => ({ default: m.ProjectOrbitalScene }))
);

/* ─── WebGL capability detection ─────────────────────────── */
function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      (window as any).WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/* ─── Architecture diagram ────────────────────────────────── */
function ArchDiagram({ project }: { project: Project }) {
  if (!project.architecture || project.architecture.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {project.architecture.map((node, i) => (
        <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'rgba(0,245,212,0.06)',
              border: '1px solid rgba(0,245,212,0.2)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--accent-neon)',
              width: '100%',
            }}
          >
            {node.label}
          </div>
          {i < project.architecture!.length - 1 && (
            <div style={{ width: '1px', height: '12px', background: 'rgba(0,245,212,0.25)', marginLeft: '20px' }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Stagger variants for project detail ─────────────────── */
type Tab = 'overview' | 'architecture';

const detailVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

const itemV = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ─── Project detail panel ─────────────────────────────────── */
function ProjectDetail({ project }: { project: Project }) {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={project.id}
        variants={detailVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Category */}
        <motion.p
          variants={itemV}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--accent-neon)',
            opacity: 0.90,
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          {project.category}
        </motion.p>

        {/* Title */}
        <motion.h3
          variants={itemV}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            marginBottom: '10px',
            lineHeight: 1.15,
          }}
        >
          {project.title}
        </motion.h3>

        {/* Tabs */}
        <motion.div
          variants={itemV}
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            padding: '3px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {(['overview', 'architecture'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '5px 10px',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.06em',
                textTransform: 'capitalize',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s',
                background: tab === t ? 'rgba(0,245,212,0.12)' : 'transparent',
                color: tab === t ? 'var(--accent-neon)' : 'rgba(255,255,255,0.65)',
              }}
            >
              {t}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '340px', paddingRight: '4px' }}>
          {tab === 'overview' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <motion.p
                variants={itemV}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.83rem',
                  lineHeight: 1.75,
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 300,
                }}
              >
                {project.description}
              </motion.p>

              {project.highlights && project.highlights.length > 0 && (
                <motion.div variants={itemV}>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: 'rgba(255,255,255,0.85)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    Highlights
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '5px', listStyle: 'none', padding: 0, margin: 0 }}>
                    {project.highlights.map((h, i) => (
                      <motion.li
                        key={h}
                        variants={itemV}
                        custom={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.78rem',
                          color: 'rgba(255,255,255,0.80)',
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }}>→</span>
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Tech pills */}
              <motion.div variants={itemV} style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {project.technologies.map((tech, i) => (
                  <motion.span
                    key={tech}
                    variants={itemV}
                    custom={i}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9.5px',
                      padding: '3px 9px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      color: 'rgba(255,255,255,0.85)',
                      background: 'rgba(255,255,255,0.04)',
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          ) : (
            <div>
              {project.architecture ? (
                <ArchDiagram project={project} />
              ) : (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.60)' }}>
                  Architecture diagram not available for this project.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Links */}
        <motion.div
          variants={itemV}
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10.5px',
                color: '#fff',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
              }}
            >
              <FiGithub style={{ width: '12px', height: '12px' }} />
              GitHub
            </a>
          )}
          {project.demo && project.demo !== '#' && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10.5px',
                color: 'var(--accent-neon)',
                background: 'rgba(0,245,212,0.06)',
                border: '1px solid rgba(0,245,212,0.25)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              <ExternalLink style={{ width: '12px', height: '12px' }} />
              Live Demo
            </a>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Fallback card grid ──────────────────────────────────── */
function ProjectCardGrid({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
      }}
    >
      {projects.map((p, i) => (
        <button
          key={p.id}
          onClick={() => setActiveIndex(i)}
          style={{
            textAlign: 'left',
            padding: '16px',
            borderRadius: '12px',
            background: i === activeIndex ? 'rgba(0,245,212,0.06)' : 'rgba(255,255,255,0.02)',
            border: i === activeIndex
              ? '1px solid rgba(0,245,212,0.3)'
              : '1px solid rgba(255,255,255,0.07)',
            cursor: 'pointer',
            transition: 'all 0.25s',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.6)',
              marginBottom: '5px',
            }}
          >
            {p.title}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {p.description}
          </p>
        </button>
      ))}
    </div>
  );
}

/* ─── Main Projects section ───────────────────────────────── */
export function Projects() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const isInView    = useInView(sectionRef, { once: true, margin: '-80px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const webglAvailable = canUseWebGL();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const showOrbital = webglAvailable && !isMobile;

  const advance = (dir: 1 | -1) =>
    setActiveIndex(prev => (prev + dir + projects.length) % projects.length);

  return (
    <section id="projects" className="py-24 relative z-10 overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6"
        >
          <div>
            <p className="text-mono-label mb-3">what I build</p>
            <h2 className="text-h1 font-display text-white">
              Featured{' '}
              <span style={{ color: 'var(--accent-neon)' }}>Projects</span>
            </h2>
            <div className="mt-4 w-12 h-px" style={{ background: 'var(--accent-neon)', opacity: 0.4 }} />
          </div>
          <a
            href="https://github.com/TahaSohail-Goat"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.75)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              letterSpacing: '0.04em',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.95)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
          >
            View GitHub <FiGithub style={{ width: '13px', height: '13px' }} />
          </a>
        </motion.div>

        {/* ── Desktop orbital + panel ─── */}
        {showOrbital ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 320px',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            {/* Orbital scene */}
            <div style={{ position: 'relative' }}>
              <Suspense
                fallback={
                  <div
                    style={{
                      height: '420px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.6)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      loading orbital scene...
                    </span>
                  </div>
                }
              >
                <ProjectOrbitalScene
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              </Suspense>

              {/* Pulsing "click a node" hint — calms once a non-default project is selected */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginTop: '4px',
                }}
              >
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{
                    repeat: activeIndex === 0 ? Infinity : 2,
                    duration: 2.4,
                    ease: 'easeInOut',
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      repeat: activeIndex === 0 ? Infinity : 2,
                      duration: 2.4,
                      ease: 'easeInOut',
                    }}
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--accent-neon)',
                      boxShadow: '0 0 6px var(--accent-neon)',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9.5px',
                      color: 'rgba(255,255,255,0.65)',
                      letterSpacing: '0.07em',
                    }}
                  >
                    click a node to explore
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Detail panel — subtle teal glow border */}
            <motion.div
              animate={{
                borderColor: 'rgba(0,245,212,0.20)',
                boxShadow: '0 0 32px rgba(0,245,212,0.05)',
              }}
              transition={{ duration: 0.5 }}
              style={{
                padding: '22px',
                borderRadius: '16px',
                background: 'rgba(10,10,10,0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(0,245,212,0.20)',
                minHeight: '420px',
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto',
                position: 'sticky',
                top: '96px',
                zIndex: 20,
              }}
            >
              <ProjectDetail project={projects[activeIndex]} />
            </motion.div>
          </motion.div>
        ) : (
          /* ── Mobile / no-WebGL fallback ─── */
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            {/* Carousel navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', justifyContent: 'center' }}>
              <button
                onClick={() => advance(-1)}
                aria-label="Previous project"
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </button>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.06em',
                }}
              >
                {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
              <button
                onClick={() => advance(1)}
                aria-label="Next project"
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Card grid + detail (fallback) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              <ProjectCardGrid activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
              <div
                style={{
                  padding: '20px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(0,245,212,0.18)',
                  minHeight: '300px',
                }}
              >
                <ProjectDetail project={projects[activeIndex]} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
