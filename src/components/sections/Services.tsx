import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Terminal, BrainCircuit, Globe } from 'lucide-react';

const services = [
  {
    id: '01',
    title: 'C++ Programming',
    description: 'OOP, data structures, algorithms, file handling, and complex problem-solving. Clean, well-commented code for any project.',
    icon: Terminal,
  },
  {
    id: '02',
    title: 'Python & Machine Learning',
    description: 'Automation scripts, data analysis, ML models, and AI-powered solutions — built to your exact requirements.',
    icon: BrainCircuit,
  },
  {
    id: '03',
    title: 'Web Development',
    description: 'Modern, responsive websites. Portfolios, landing pages, business sites, and web apps that look great on any device.',
    icon: Globe,
  },
];

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="py-28 relative z-10" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20 flex flex-col items-center text-center"
        >
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-white/30 mb-4">What I Do</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Services</h2>
          <div className="mt-4 w-12 h-px bg-white/20" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
              className="p-8 rounded-2xl flex flex-col h-full group transition-all duration-300"
              style={{
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              }}
            >
              <div className="flex justify-between items-start mb-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
                >
                  <service.icon className="w-5 h-5 text-white/60" />
                </div>
                <span className="text-5xl font-display font-black text-white/5 group-hover:text-white/8 transition-colors duration-500">
                  {service.id}
                </span>
              </div>

              <h3 className="text-xl font-display font-bold text-white mb-4">
                {service.title}
              </h3>

              <p className="text-white/40 leading-relaxed text-sm font-light">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
