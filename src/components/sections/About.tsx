import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  SiCplusplus,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiNextdotjs,
  SiMongodb,
  SiMysql,
  SiDjango,
  SiFlask,
  SiPostgresql,
  SiGit,
  SiOpenjdk,
} from 'react-icons/si';

/* ── Engineering principles ── */
const principles = [
  {
    id: '01',
    title: 'Architecture First',
    description:
      'Design the system structure before writing a line of code. Whether it\'s a graph-based pathfinder or a full-stack MIS, the right architecture eliminates unnecessary complexity later.',
  },
  {
    id: '02',
    title: 'Clean Interfaces',
    description:
      'Well-defined boundaries (between modules, layers, and APIs) make systems maintainable. I apply SOLID principles and design patterns where they genuinely improve the design.',
  },
  {
    id: '03',
    title: 'Performance as Product',
    description:
      'Efficient algorithms and optimized data structures are not academic exercises: they\'re product decisions. DSA depth translates directly into measurable quality.',
  },
  {
    id: '04',
    title: 'Iterative Delivery',
    description:
      'Ship working software incrementally. Refine with feedback. Clear deliverables, no scope creep, and consistent communication throughout the build.',
  },
];

/* ── Tech stack with icons & brand colors ── */
const techStack = [
  { name: 'C++',         icon: SiCplusplus,    color: '#00599C' },
  { name: 'Python',      icon: SiPython,       color: '#3776AB' },
  { name: 'JavaScript',  icon: SiJavascript,   color: '#F7DF1E' },
  { name: 'TypeScript',  icon: SiTypescript,   color: '#3178C6' },
  { name: 'React',       icon: SiReact,        color: '#61DAFB' },
  { name: 'Node.js',     icon: SiNodedotjs,    color: '#5FA04E' },
  { name: 'Express',     icon: SiExpress,      color: '#ffffff' },
  { name: 'Next.js',     icon: SiNextdotjs,    color: '#ffffff' },
  { name: 'MongoDB',     icon: SiMongodb,      color: '#47A248' },
  { name: 'MySQL',       icon: SiMysql,        color: '#4479A1' },
  { name: 'PostgreSQL',  icon: SiPostgresql,   color: '#4169E1' },
  { name: 'Django',      icon: SiDjango,       color: '#092E20' },
  { name: 'Flask',       icon: SiFlask,        color: '#ffffff' },
  { name: 'Java',        icon: SiOpenjdk,      color: '#ED8B00' },
  { name: 'Git',         icon: SiGit,          color: '#F05032' },
];

/* ── Skill bars (genuine self-assessment) ── */
const skills = [
  { name: 'C++ / DSA / OOP',  category: 'CORE ENGINEERING', level: 90 },
  { name: 'Web Development',  category: 'FULL STACK',        level: 85 },
  { name: 'Python / ML',      category: 'AI / DATA',         level: 78 },
  { name: 'MERN Stack',       category: 'FULL STACK',        level: 80 },
];

/* ── Detect reduced-motion preference ── */
function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ── Animated count-up number ── */
function CountUp({ target, trigger }: { target: number; trigger: boolean }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    if (prefersReducedMotion()) { setDisplay(target); return; }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [trigger, target]);
  return <>{display}</>;
}

/* ── Single skill row ── */
function SkillMeter(
  { skill, index, trigger }:
  { skill: typeof skills[0]; index: number; trigger: boolean }
) {
  const [hovered, setHovered] = useState(false);
  const reduced = prefersReducedMotion();

  return (
    <div
      style={{
        padding: '14px 16px',
        borderRadius: '10px',
        border: `1px solid ${hovered ? 'rgba(0,245,212,0.18)' : 'rgba(255,255,255,0.05)'}`,
        background: hovered ? 'rgba(0,245,212,0.025)' : 'transparent',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'border-color 0.3s ease, background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: hovered ? '0 4px 24px rgba(0,245,212,0.06)' : 'none',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4px' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.72)',
            letterSpacing: '-0.01em',
            transition: 'color 0.3s ease',
            marginBottom: '2px',
          }}>
            {skill.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            color: 'rgba(255,255,255,0.22)',
            textTransform: 'uppercase',
          }}>
            {skill.category}
          </div>
        </div>
        {/* Percentage */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: hovered ? 'var(--accent-neon)' : 'rgba(0,245,212,0.7)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          transition: 'color 0.3s ease',
          minWidth: '42px',
          textAlign: 'right',
        }}>
          <CountUp target={skill.level} trigger={trigger} />
          <span style={{ fontSize: '0.6rem', opacity: 0.55, marginLeft: '1px' }}>%</span>
        </div>
      </div>

      {/* Progress track */}
      <div style={{
        position: 'relative',
        height: '2px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '2px',
        marginTop: '10px',
        overflow: 'visible',
      }}>
        {/* Filled bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={trigger ? { width: `${skill.level}%` } : { width: 0 }}
          transition={reduced
            ? { duration: 0 }
            : { duration: 1.4, delay: 0.2 + index * 0.13, ease: [0.16, 1, 0.3, 1] }
          }
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            background: 'linear-gradient(90deg, rgba(0,245,212,0.5) 0%, #00f5d4 100%)',
            boxShadow: hovered
              ? '0 0 10px rgba(0,245,212,0.7), 0 0 20px rgba(0,245,212,0.3)'
              : '0 0 6px rgba(0,245,212,0.45)',
            borderRadius: '2px',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {/* Scanner shimmer */}
          {!reduced && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
              backgroundSize: '60px 100%',
              animation: trigger ? 'skillScan 2.2s ease-out forwards' : 'none',
              animationDelay: `${0.5 + index * 0.13}s`,
              borderRadius: '2px',
            }} />
          )}
        </motion.div>

        {/* Glowing end-dot */}
        <motion.div
          initial={{ left: 0, opacity: 0 }}
          animate={trigger ? { left: `${skill.level}%`, opacity: 1 } : { left: 0, opacity: 0 }}
          transition={reduced
            ? { duration: 0 }
            : { duration: 1.4, delay: 0.2 + index * 0.13, ease: [0.16, 1, 0.3, 1] }
          }
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#00f5d4',
            boxShadow: hovered
              ? '0 0 12px rgba(0,245,212,0.9), 0 0 24px rgba(0,245,212,0.5)'
              : '0 0 8px rgba(0,245,212,0.7)',
            transition: 'box-shadow 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}

/* ── Variants ── */
const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemV = {
  hidden: { opacity: 0, scale: 0.9 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

export function About() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="py-28 relative z-10" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Section header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="text-mono-label mb-3">who I am</p>
          <h2 className="text-h1 font-display text-white">
            Technical{' '}
            <span style={{ color: 'var(--accent-neon)' }}>Identity</span>
          </h2>
          <div className="mt-4 w-12 h-px" style={{ background: 'var(--accent-neon)', opacity: 0.4 }} />
        </motion.div>

        {/* ── Top: bio + skills ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">

          {/* BIO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p
              className="mb-10 leading-relaxed font-light"
              style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', color: 'rgba(255,255,255,0.85)' }}
            >
              I'm a Software Engineering student at FAST-NUCES, Pakistan, with a strong foundation
              in C++, Python, and full-stack web development. I approach every project, whether a
              university assignment, a custom tool, or a production website, with the same level
              of seriousness: deliberate design, clean code, and delivery that doesn't stop until
              the result is right.
            </p>

            {/* Skill bars — premium dashboard style */}
            <div>
              {/* Keyframe style for scanner shimmer */}
              <style>{`
                @keyframes skillScan {
                  0%   { background-position: -60px 0; opacity: 1; }
                  80%  { background-position: 200% 0;  opacity: 0.6; }
                  100% { background-position: 200% 0;  opacity: 0; }
                }
                @media (prefers-reduced-motion: reduce) {
                  [data-skill-shimmer] { display: none !important; }
                }
              `}</style>
              <p className="text-mono-label mb-5">proficiency</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {skills.map((skill, i) => (
                  <SkillMeter key={skill.name} skill={skill} index={i} trigger={isInView} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* TECH STACK ICON GRID */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-mono-label mb-5">tech stack & tools</p>
            <motion.div
              variants={containerV}
              initial="hidden"
              animate={isInView ? 'show' : 'hidden'}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))',
                gap: '10px',
              }}
            >
              {techStack.map(tech => {
                const IconComponent = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    variants={itemV}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px 10px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      cursor: 'default',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = `${tech.color}66`;
                      el.style.background = `${tech.color}10`;
                      el.style.boxShadow = `0 0 16px ${tech.color}25`;
                      el.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'rgba(255,255,255,0.07)';
                      el.style.background = 'rgba(255,255,255,0.02)';
                      el.style.boxShadow = 'none';
                      el.style.transform = 'translateY(0)';
                    }}
                  >
                    <IconComponent
                      style={{
                        width: '24px',
                        height: '24px',
                        color: tech.color,
                        filter: `drop-shadow(0 0 6px ${tech.color}44)`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.85)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {tech.name}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>


      </div>
    </section>
  );
}
