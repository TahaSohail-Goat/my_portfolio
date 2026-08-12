import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { Typewriter } from '@/components/ui/Typewriter';
import { HeroPhoto3D } from '@/components/3d/HeroPhoto3D';

/* ── Stagger variants ──────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ── Magnetic button hook ─────────────────────────────── */
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const onLeave = () => { el.style.transform = ''; };

    el.addEventListener('mousemove', onMove as unknown as EventListener);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove as unknown as EventListener);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}

const ROLES = [
  'Software Engineer',
  'C++ Developer',
  'Python & ML Dev',
  'Full-Stack Developer',
  'React & Node.js Dev',
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [glowPos, setGlowPos] = useState({ x: '50%', y: '50%' });
  const primaryRef = useMagnetic(0.3) as React.RefObject<HTMLButtonElement>;
  const secondaryRef = useMagnetic(0.25) as React.RefObject<HTMLAnchorElement>;

  /* cursor-reactive glow */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setGlowPos({
        x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
        y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
      });
    };
    el.addEventListener('mousemove', onMove, { passive: true });
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen pt-24 pb-16 flex items-center overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* ── Cursor-reactive glow ─── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 40% 40% at ${glowPos.x} ${glowPos.y}, rgba(0,245,212,0.055) 0%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'background 0.12s linear',
          zIndex: 0,
        }}
      />

      {/* ── Grid overlay ─── */}
      <div
        aria-hidden
        className="absolute inset-0 grid-bg pointer-events-none"
        style={{ opacity: 0.5, zIndex: 0 }}
      />

      {/* ── Top ambient radial ─── */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[60vh] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(0,245,212,0.045) 0%, transparent 65%)',
          zIndex: 0,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* ── LEFT — Text content ─── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start"
        >
          {/* Technical metadata badge */}
          <motion.div variants={itemVariants} className="mb-7">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(0,245,212,0.07)',
                border: '1px solid rgba(0,245,212,0.25)',
                boxShadow: '0 0 20px rgba(0,245,212,0.08)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: 'var(--accent-neon)',
                  boxShadow: '0 0 8px var(--accent-neon)',
                  animation: 'heroBlink 2.5s ease-in-out infinite',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  color: 'var(--accent-neon)',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                Software Engineer &middot; Pakistan
              </span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-display-xxl font-display mb-4"
            style={{ lineHeight: 1.02, color: '#fff' }}
          >
            Hi, I'm
            <br />
            Taha Sohail
          </motion.h1>

          {/* Typewriter role */}
          <motion.div
            variants={itemVariants}
            className="mb-6 h-8"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            <Typewriter words={ROLES} />
          </motion.div>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
              color: 'rgba(255,255,255,0.80)',
              maxWidth: '460px',
              lineHeight: 1.75,
              fontWeight: 300,
              marginBottom: '2.25rem',
            }}
          >
            I build things with C++, Python, Node.js and React, spanning efficient
            algorithms to full-stack products. Clean code, thoughtful architecture,
            and iterative delivery.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-10">
            <button
              ref={primaryRef}
              onClick={() => scrollTo('#projects')}
              id="hero-primary-cta"
              className="px-7 py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide flex items-center gap-2.5 group transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.96)',
                color: '#0a0a0a',
                boxShadow: '0 4px 20px rgba(255,255,255,0.08)',
                transition: 'box-shadow 0.3s, transform 0.3s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 30px rgba(255,255,255,0.18)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(255,255,255,0.08)';
              }}
            >
              View Projects
              <ArrowRight
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <a
              ref={secondaryRef}
              href="#contact"
              onClick={e => { e.preventDefault(); scrollTo('#contact'); }}
              id="hero-secondary-cta"
              className="px-7 py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide flex items-center gap-2.5 transition-all duration-300"
              style={{
                border: '1px solid rgba(0,245,212,0.3)',
                color: 'var(--accent-neon)',
                background: 'rgba(0,245,212,0.04)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,212,0.55)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,212,0.08)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0,245,212,0.12)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,212,0.3)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,212,0.04)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              Get in Touch
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <a
              href="https://github.com/TahaSohail-Goat"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center gap-2 text-sm font-sans transition-all duration-200"
              style={{ color: 'rgba(255,255,255,0.70)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.95)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
            >
              <FiGithub className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <span style={{ color: 'rgba(255,255,255,0.30)' }}>·</span>
            <a
              href="https://www.linkedin.com/in/taha-sohail-7b03b8320/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center gap-2 text-sm font-sans transition-all duration-200"
              style={{ color: 'rgba(255,255,255,0.70)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.95)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
            >
              <FiLinkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </motion.div>
        </motion.div>

        {/* ── RIGHT — Photo ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full flex justify-center lg:justify-end"
        >
          <HeroPhoto3D />
        </motion.div>
      </div>

      {/* ── Scroll indicator ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 10 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase',
          }}
        >
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.15)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
