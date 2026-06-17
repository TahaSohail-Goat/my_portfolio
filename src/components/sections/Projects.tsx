import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { FiGithub } from 'react-icons/fi';

const projects = [
  {
    title: 'Disaster Management System',
    description: 'Smart Disaster Response Management Information System for tracking emergencies, allocating resources, and coordinating relief efforts.',
    tech: ['React.js', 'Next.js', 'Express.js', 'Node.js'],
    image: `${import.meta.env.BASE_URL}images/disaster-management-bg.png`,
    github: 'https://github.com/TahaSohail-Goat/SmartDisasterResponseMIS',
    demo: '#',
  },
  {
    title: 'CDIEM',
    description: 'A Software Design & Architecture project engineered with modular components, design patterns, and SOLID principles.',
    tech: ['JavaFX', 'App Dev', 'CSS'],
    image: `${import.meta.env.BASE_URL}images/cdiem-architecture-bg.png`,
    github: 'https://github.com/TahaSohail-Goat/CDIEM',
    demo: '#',
  },
  {
    title: 'SeaRoute Navigator',
    description: 'Efficient pathfinding algorithms for optimal sea routes between ports, featuring graph-based navigation and shortest path optimization.',
    tech: ['C++', 'Graph Algorithms', 'DSA'],
    image: `${import.meta.env.BASE_URL}images/project-1-bg.png`,
    github: 'https://github.com/TahaSohail-Goat/SeaRoute-Navigator',
    demo: '#',
  },
  {
    title: 'Magical Pet Kingdom',
    description: 'Fantasy pet management system demonstrating key OOP concepts — inheritance, polymorphism, encapsulation, and abstraction.',
    tech: ['C++', 'OOP', 'CLI'],
    image: `${import.meta.env.BASE_URL}images/magical-pet-kingdom-bg.png`,
    github: 'https://github.com/TahaSohail-Goat/Magical-Pet-Kingdom-in-C-',
    demo: '#',
  },
];

const TOTAL = projects.length;
const STEP = 360 / TOTAL;
// Tight radius for portable fit on smaller displays
const RADIUS = 280;

export function Projects() {
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
    const id = setInterval(() => advance(1), 4500);
    return () => clearInterval(id);
  }, [paused, advance]);

  return (
    <section id="projects" className="py-16 relative z-10 overflow-hidden" ref={sectionRef}>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6"
        >
          <div>
            <p className="text-xs font-sans uppercase tracking-[0.3em] text-white/30 mb-2">Selected Work</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Projects</h2>
            <div className="mt-2.5 w-10 h-px bg-white/20" />
          </div>
          <button
            onClick={() => window.open('https://github.com/TahaSohail-Goat', '_blank')}
            className="flex items-center gap-2 text-xs font-sans text-white/40 hover:text-white/80 transition-colors duration-300"
          >
            View GitHub <FiGithub className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* 3-D Stage + Side Controls container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="relative flex flex-col items-center select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Main stage wrapper containing the stage and absolute side buttons */}
          <div className="relative w-full flex items-center justify-center">
            
            {/* Left side button */}
            <button
              id="projects-prev"
              onClick={() => advance(-1)}
              aria-label="Previous project"
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

            {/* Perspective container (Height reduced to 340px for portable fit) */}
            <div
              style={{
                perspective: '900px',
                perspectiveOrigin: '50% 50%',
                width: '100%',
                height: '340px',
                position: 'relative',
              }}
            >
              {projects.map((project, i) => {
                const offset = (i - active + TOTAL) % TOTAL;
                const angle = offset > TOTAL / 2 ? offset * STEP - 360 : offset * STEP;
                const absAngle = Math.abs(angle);
                const depthRatio = Math.cos((absAngle * Math.PI) / 180);
                const opacity = Math.max(0.04, depthRatio * 0.94);
                const scale = 0.78 + depthRatio * 0.22;
                const isActive = i === active;
                const isVisible = absAngle <= 100;

                return (
                  <div
                    key={project.title}
                    onClick={() => isVisible && !isActive && setActive(i)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '250px',
                      transform: `translateX(-50%) translateY(-50%) rotateY(${angle}deg) translateZ(${RADIUS}px) scale(${scale})`,
                      transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease',
                      opacity,
                      zIndex: isActive ? 10 : Math.round(Math.max(0, depthRatio) * 8),
                      cursor: isVisible && !isActive ? 'pointer' : 'default',
                      backfaceVisibility: 'hidden',
                      willChange: 'transform',
                    }}
                  >
                    <div
                      style={{
                        borderRadius: '14px',
                        background: isActive ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.025)',
                        border: isActive ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.06)',
                        boxShadow: isActive
                          ? '0 15px 45px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04) inset'
                          : '0 6px 20px rgba(0,0,0,0.35)',
                        transition: 'background 0.45s, border-color 0.45s, box-shadow 0.45s',
                        height: '290px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Project Image (Height reduced to 105px) */}
                      <div style={{ position: 'relative', height: '105px', overflow: 'hidden' }}>
                        <img
                          src={project.image}
                          alt={project.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: isActive ? 'brightness(0.85) grayscale(0)' : 'brightness(0.35) grayscale(0.5)',
                            transition: 'filter 0.45s',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '30px',
                            background: 'linear-gradient(to top, rgba(10,10,10,0.95), transparent)',
                          }}
                        />
                      </div>

                      {/* Content area (Tight padding and heights for portable view) */}
                      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <h3
                          style={{
                            fontSize: '12.5px',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                            marginBottom: '4px',
                            transition: 'color 0.45s',
                            letterSpacing: '-0.01em',
                            lineHeight: 1.25,
                          }}
                        >
                          {project.title}
                        </h3>
                        
                        <p
                          style={{
                            fontSize: '10.5px',
                            lineHeight: '1.5',
                            color: isActive ? 'rgba(255,255,255,0.48)' : 'rgba(255,255,255,0.18)',
                            transition: 'color 0.45s',
                            fontWeight: 300,
                            marginBottom: '10px',
                            flexGrow: 1,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {project.description}
                        </p>

                        {/* Tech tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                          {project.tech.map(t => (
                            <span
                              key={t}
                              style={{
                                fontSize: '8.5px',
                                fontFamily: 'var(--font-sans)',
                                padding: '1.5px 6px',
                                borderRadius: '999px',
                                color: isActive ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)',
                                border: isActive ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.06)',
                                transition: 'color 0.45s, border-color 0.45s',
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Action buttons (Smaller, 28px) */}
                        <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(project.github, '_blank');
                            }}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isActive ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                              border: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
                              color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => {
                              if (!isActive) return;
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = 'rgba(255,255,255,0.15)';
                              el.style.borderColor = 'rgba(255,255,255,0.35)';
                            }}
                            onMouseLeave={e => {
                              if (!isActive) return;
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = 'rgba(255,255,255,0.07)';
                              el.style.borderColor = 'rgba(255,255,255,0.15)';
                            }}
                          >
                            <FiGithub style={{ width: '11px', height: '11px' }} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isActive ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                              border: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
                              color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => {
                              if (!isActive) return;
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = 'rgba(255,255,255,0.15)';
                              el.style.borderColor = 'rgba(255,255,255,0.35)';
                            }}
                            onMouseLeave={e => {
                              if (!isActive) return;
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = 'rgba(255,255,255,0.07)';
                              el.style.borderColor = 'rgba(255,255,255,0.15)';
                            }}
                          >
                            <ExternalLink style={{ width: '11px', height: '11px' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right side button */}
            <button
              id="projects-next"
              onClick={() => advance(1)}
              aria-label="Next project"
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

          {/* Dot indicators (Keep it clean below) */}
          <div className="flex items-center gap-1.5 mt-5">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Project ${i + 1}`}
                style={{
                  width: i === active ? '16px' : '4px',
                  height: '4px',
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

          {/* Current Project Title label */}
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
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.04em',
                }}
              >
                {String(active + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')} — {projects[active].title}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
