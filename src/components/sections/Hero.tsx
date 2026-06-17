import { motion } from 'framer-motion';
import { Typewriter } from '@/components/ui/Typewriter';
import { HeroPhoto3D } from '@/components/3d/HeroPhoto3D';
import { MessageSquare, ArrowRight } from 'lucide-react';

export function Hero() {
  const roles = ["Software Engineer", "C++ Developer", "Python & ML Dev", "Web Developer", "React Developer", "Node.js Developer", "Mern Stack Developer"];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen pt-24 pb-12 flex items-center relative z-10">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
            style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" style={{ animation: 'heroBlink 2s ease-in-out infinite', boxShadow: '0 0 6px rgba(255,255,255,0.5)' }} />
            <span className="text-xs font-sans font-medium text-white/60 tracking-widest uppercase">Available for Freelance</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-5 text-white">
            Hi, I'm<br />
            <span className="text-white">Taha Sohail</span>
          </h1>

          <div className="text-xl md:text-2xl font-display font-medium text-white/40 mb-6 h-[32px]">
            <Typewriter words={roles} />
          </div>

          <p className="text-base text-white/40 max-w-lg mb-10 leading-relaxed font-light">
            I build things with C++, Python, Node.js, React and the web. Clean code, fast delivery, I'll keep refining until you're satisfied.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.open('https://wa.me/923328885770', '_blank')}
              className="px-7 py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide transition-all duration-300 flex items-center gap-2.5"
              style={{
                background: 'rgba(255,255,255,0.96)',
                color: '#0a0a0a',
                boxShadow: '0 4px 20px rgba(255,255,255,0.1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 30px rgba(255,255,255,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,255,255,0.1)')}
            >
              Hire Me <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('#projects')}
              className="px-7 py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide text-white/70 transition-all duration-300 flex items-center gap-2.5 group"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'transparent' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.color = 'rgba(255,255,255,1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              View Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full flex justify-center lg:justify-end"
        >
          <HeroPhoto3D />
        </motion.div>
      </div>

      <style>{`
        @keyframes heroBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </section>
  );
}
