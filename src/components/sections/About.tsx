import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const skills = [
  { name: 'C++ / DSA', level: 95 },
  { name: 'Python / ML', level: 80 },
  { name: 'Web Development', level: 90 },
];

const stats = [
  { value: '1', label: 'Years Experience' },
  { value: '99.9%', label: 'Client Satisfaction' },
  { value: '12h', label: 'Fast Delivery' },
  { value: '10', label: 'Revisions' },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-28 relative z-10" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-white/30 mb-4">Who I Am</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white">About Me</h2>
          <div className="mt-4 w-12 h-px bg-white/20" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-white/50 text-lg leading-relaxed mb-10 font-light">
              I'm a Software Engineer from Pakistan with a strong foundation in C++, C , Javascript , Nodejs , Reactjs, Django, Flask, Python, SQL , MongoDB  and web development.
              Whether it's a university project, a custom tool, or a full website. I take it seriously and deliver quality work.
              I won't stop until you're happy with the result.
            </p>

            <div className="space-y-7">
              {skills.map((skill, index) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2.5">
                    <span className="text-sm font-sans font-medium text-white/70">{skill.name}</span>
                    <span className="text-sm font-sans text-white/30">{skill.level}%</span>
                  </div>
                  <div className="h-px w-full bg-white/8 relative overflow-hidden">
                    <motion.div
                      className="h-full bg-white/40"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1.4, delay: 0.4 + index * 0.15, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="p-8 rounded-xl flex flex-col justify-center"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="text-4xl font-display font-bold text-white mb-2">{stat.value}</div>
                <div className="text-xs font-sans uppercase tracking-widest text-white/30">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
