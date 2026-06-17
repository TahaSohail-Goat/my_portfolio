import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = ['home', 'about', 'services', 'projects', 'contact'];
    const observers: IntersectionObserver[] = [];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? {
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '14px 0',
      } : { padding: '24px 0' }}
    >
      <div
        className="max-w-7xl mx-auto px-6"
        style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}
      >
        {/* LEFT — Logo */}
        <a
          href="#home"
          onClick={e => scrollTo(e, '#home')}
          className="font-display font-bold text-xl text-white tracking-tight"
          style={{ justifySelf: 'start' }}
        >
          Taha<span style={{ color: 'rgba(255,255,255,0.4)' }}>.</span>
        </a>

        {/* CENTER — Nav Links pill container */}
        <div
          className="hidden md:flex items-center gap-1"
          style={{
            justifySelf: 'center',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '100px',
            padding: '5px 6px',
          }}
        >
          {navLinks.map(link => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={e => scrollTo(e, link.href)}
                className="relative px-4 py-1.5 text-sm font-sans font-medium transition-all duration-200 rounded-full"
                style={{
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.70)',
                  background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = '#fff';
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.70)';
                }}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        {/* RIGHT — Hire Me CTA + mobile toggle */}
        <div
          className="flex items-center gap-3"
          style={{ justifySelf: 'end' }}
        >
          <button
            onClick={() => window.open('https://wa.me/923328885770', '_blank')}
            className="hidden md:block px-5 py-2 rounded-full text-sm font-sans font-medium text-white/70 hover:text-white transition-all duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.28)', color: 'rgba(255,255,255,0.85)' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
            }}
          >
            Hire Me
          </button>

          <button
            className="md:hidden text-white/50 hover:text-white p-1 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10,10,10,0.95)' }}
          >
            <div className="flex flex-col p-6 gap-5">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={e => scrollTo(e, link.href)}
                  className="text-base font-sans font-medium transition-colors"
                  style={{ color: activeSection === link.id ? '#fff' : 'rgba(255,255,255,0.72)' }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
