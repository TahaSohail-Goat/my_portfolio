import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Terminal, BrainCircuit, Globe, Layers,
  Smartphone,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

const services = [
  {
    id: '01',
    title: 'C++ Programming',
    description: 'OOP, data structures, algorithms, file handling, and complex problem-solving.',
    icon: Terminal,
  },
  {
    id: '02',
    title: 'Python & ML',
    description: 'Automation scripts, data analysis, ML models, and AI-powered solutions.',
    icon: BrainCircuit,
  },
  {
    id: '03',
    title: 'Web Development',
    description: 'Modern, responsive websites: portfolios, landing pages and web apps.',
    icon: Globe,
  },
  {
    id: '04',
    title: 'MERN Stack',
    description: 'Full-stack apps with MongoDB, Express, React and Node.js. REST APIs, auth.',
    icon: Layers,
  },
  {
    id: '05',
    title: 'Responsive UI / UX',
    description: 'Pixel-perfect, mobile-first interfaces that delight on every screen size.',
    icon: Smartphone,
  },
];

const TOTAL = services.length;
const STEP = 360 / TOTAL;
// Orbit radius optimized to keep cards aligned nicely
const RADIUS = 300;

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(
    (dir: 1 | -1) => setActive(prev => (prev + dir + TOTAL) % TOTAL),
    []
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => advance(1), 3500);
    return () => clearInterval(id);
  }, [paused, advance]);

  return (
    <section id="services" className="py-20 relative z-10 overflow-hidden" ref={sectionRef}>
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-white/70 mb-3">What I Do</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Services</h2>
          <div className="mt-3 w-10 h-px bg-white/20" />
          <p className="mt-4 text-white/75 text-xs max-w-xs leading-relaxed">
            Click the arrows to orbit through all my services.
          </p>
        </motion.div>

        {/* 3-D Stage + Side Controls container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="flex flex-col items-center select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Main stage wrapper containing the stage and absolute side buttons */}
          <div className="relative w-full flex items-center justify-center">

            {/* Left side button */}
            <button
              id="services-prev"
              onClick={() => advance(-1)}
              aria-label="Previous service"
              style={{
                position: 'absolute',
                left: '-8px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 30,
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.7)',
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.12)';
                el.style.borderColor = 'rgba(255,255,255,0.3)';
                el.style.color = '#fff';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.05)';
                el.style.borderColor = 'rgba(255,255,255,0.12)';
                el.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              <ChevronLeft style={{ width: '18px', height: '18px' }} />
            </button>

            {/* Perspective container */}
            <div
              style={{
                perspective: '900px',
                perspectiveOrigin: '50% 50%',
                width: '100%',
                height: '320px',
                position: 'relative',
              }}
            >
              {services.map((service, i) => {
                const Icon = service.icon;
                const offset = (i - active + TOTAL) % TOTAL;
                const angle = offset > TOTAL / 2 ? offset * STEP - 360 : offset * STEP;
                const absAngle = Math.abs(angle);
                const depthRatio = Math.cos((absAngle * Math.PI) / 180);
                const opacity = Math.max(0.05, depthRatio * 0.92);
                const scale = 0.75 + depthRatio * 0.25;
                const isActive = i === active;
                const isVisible = absAngle <= 100;

                return (
                  <div
                    key={service.id}
                    onClick={() => isVisible && !isActive && setActive(i)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '240px',
                      transform: `translateX(-50%) translateY(-50%) rotateY(${angle}deg) translateZ(${RADIUS}px) scale(${scale})`,
                      transition: 'transform 0.6s cubic-bezier(0.34,1.4,0.64,1), opacity 0.5s ease',
                      opacity,
                      zIndex: isActive ? 10 : Math.round(Math.max(0, depthRatio) * 8),
                      cursor: isVisible && !isActive ? 'pointer' : 'default',
                      backfaceVisibility: 'hidden',
                      willChange: 'transform',
                    }}
                  >
                    <div
                      style={{
                        padding: '24px 22px',
                        borderRadius: '16px',
                        background: isActive ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)',
                        border: isActive ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(255,255,255,0.06)',
                        boxShadow: isActive
                          ? '0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset'
                          : '0 8px 30px rgba(0,0,0,0.25)',
                        transition: 'background 0.45s, border-color 0.45s, box-shadow 0.45s',
                        height: '220px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Top row — icon + number */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                            border: isActive ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.07)',
                            transition: 'background 0.45s, border-color 0.45s',
                            flexShrink: 0,
                          }}
                        >
                          <Icon style={{ width: '16px', height: '16px', color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }} />
                        </div>
                        <span
                          style={{
                            fontSize: '36px',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            lineHeight: 1,
                            color: isActive ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                            transition: 'color 0.45s',
                            userSelect: 'none',
                          }}
                        >
                          {service.id}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: '14px',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                          marginBottom: '10px',
                          transition: 'color 0.45s',
                          letterSpacing: '-0.01em',
                          lineHeight: 1.3,
                        }}
                      >
                        {service.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '11.5px',
                          lineHeight: '1.65',
                          color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)',
                          transition: 'color 0.45s',
                          fontWeight: 300,
                        }}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right side button */}
            <button
              id="services-next"
              onClick={() => advance(1)}
              aria-label="Next service"
              style={{
                position: 'absolute',
                right: '-8px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 30,
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.7)',
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.12)';
                el.style.borderColor = 'rgba(255,255,255,0.3)';
                el.style.color = '#fff';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.05)';
                el.style.borderColor = 'rgba(255,255,255,0.12)';
                el.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              <ChevronRight style={{ width: '18px', height: '18px' }} />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5 mt-8">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Service ${i + 1}`}
                style={{
                  width: i === active ? '20px' : '5px',
                  height: '5px',
                  borderRadius: '999px',
                  background: i === active ? '#fff' : 'rgba(255,255,255,0.18)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Label indicating active service */}
          <div className="mt-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '10.5px',
                  fontFamily: 'var(--font-sans)',
                  color: 'rgba(255,255,255,0.75)',
                  letterSpacing: '0.04em',
                }}
              >
                {services[active].id} / {String(TOTAL).padStart(2, '0')} · {services[active].title}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
