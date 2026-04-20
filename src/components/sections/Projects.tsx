import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { FiGithub } from 'react-icons/fi';
const projects = [
  {
    title: 'SeaRoute Navigator',
    description: 'Efficient pathfinding algorithms for optimal sea routes between ports, featuring graph-based navigation and shortest path optimization.',
    tech: ['C++', 'Graph Algorithms', 'DSA'],
    image: `${import.meta.env.BASE_URL}images/project-1-bg.png`,
  },
  {
    title: 'Magical Pet Kingdom',
    description: 'Fantasy pet management system demonstrating OOP concepts — inheritance, polymorphism, encapsulation, and abstraction.',
    tech: ['C++', 'OOP', 'CLI'],
    image: `${import.meta.env.BASE_URL}images/magical-pet-kingdom-bg.png`,
  },
  {
    title: 'Tic-Tac-Toe SFML',
    description: 'Classic two-player Tic-Tac-Toe with a clean graphical interface built using the SFML graphics library.',
    tech: ['C++', 'SFML', 'Game Dev'],
    image: `${import.meta.env.BASE_URL}images/project-3-bg.png`,
  },
];

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="py-28 relative z-10" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20 flex flex-col md:flex-row justify-between items-end gap-6"
        >
          <div>
            <p className="text-xs font-sans uppercase tracking-[0.3em] text-white/30 mb-4">Selected Work</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Projects</h2>
            <div className="mt-4 w-12 h-px bg-white/20" />
          </div>
          <button
            onClick={() => window.open('https://github.com/TahaSohail-Goat', '_blank')}
            className="flex items-center gap-2 text-sm font-sans text-white/40 hover:text-white/80 transition-colors duration-300"
          >
            View GitHub <FiGithub className="w-4 h-4" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
              className="rounded-2xl overflow-hidden group transition-all duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: 'brightness(0.7) grayscale(0.3)' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.3) 60%, transparent 100%)' }} />
              </div>

              <div className="p-7">
                <h3 className="text-lg font-display font-bold text-white mb-3 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <p className="text-white/35 text-sm leading-relaxed mb-6 font-light">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map(t => (
                    <span
                      key={t}
                      className="text-xs font-sans px-2.5 py-1 rounded-full text-white/40"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.open('https://github.com/TahaSohail-Goat', '_blank')}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/30 hover:text-white/80 transition-colors duration-200"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    aria-label="View Source"
                  >
                    <FiGithub className="w-4 h-4" />
                  </button>
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/30 hover:text-white/80 transition-colors duration-200"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    aria-label="View Project"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
