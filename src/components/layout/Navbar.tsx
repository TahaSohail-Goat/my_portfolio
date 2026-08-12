import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText } from 'lucide-react';

const NAV_LINKS = [
  { name: 'About',      href: '#about',      id: 'about' },
  { name: 'Projects',   href: '#projects',   id: 'projects' },
  { name: 'Skills',     href: '#skills',     id: 'skills' },
  { name: 'Experience', href: '#experience', id: 'experience' },
  { name: 'Contact',    href: '#contact',    id: 'contact' },
];

const SECTION_IDS = ['home', 'about', 'projects', 'skills', 'experience', 'contact'];

export function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={
        scrolled
          ? {
              background: 'rgba(8, 8, 8, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '12px 0',
            }
          : { padding: '22px 0' }
      }
    >
      <div
        className="max-w-7xl mx-auto px-6"
        style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem' }}
      >
        {/* LEFT — Logo */}
        <div style={{ justifySelf: 'start', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href="#home"
            onClick={e => scrollTo(e, '#home')}
            className="font-display font-bold text-xl text-white tracking-tight"
          >
            Taha<span style={{ color: 'var(--accent-neon)' }}>.</span>
          </a>
        </div>

        {/* CENTER — Nav pill */}
        <div
          className="hidden md:flex items-center gap-0.5"
          style={{
            justifySelf: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '100px',
            padding: '4px 6px',
          }}
        >
          {NAV_LINKS.map(link => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={e => scrollTo(e, link.href)}
                className="relative px-4 py-1.5 text-sm font-sans font-medium transition-all duration-200 rounded-full"
                style={{
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                  background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                }}
              >
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'var(--accent-neon)',
                      boxShadow: '0 0 6px var(--accent-neon)',
                    }}
                  />
                )}
                {link.name}
              </a>
            );
          })}
        </div>

        {/* RIGHT — Resume CTA + mobile toggle */}
        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200"
            style={{
              border: '1px solid rgba(0,245,212,0.3)',
              color: 'var(--accent-neon)',
              background: 'rgba(0,245,212,0.04)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(0,245,212,0.6)';
              e.currentTarget.style.background = 'rgba(0,245,212,0.08)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(0,245,212,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0,245,212,0.3)';
              e.currentTarget.style.background = 'rgba(0,245,212,0.04)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FileText style={{ width: '13px', height: '13px' }} />
            Resume
          </a>

          <button
            className="md:hidden text-white/50 hover:text-white p-1.5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(8,8,8,0.97)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-col p-6 gap-1">
              {NAV_LINKS.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={e => scrollTo(e, link.href)}
                  className="flex items-center justify-between py-3 text-base font-sans font-medium transition-colors border-b"
                  style={{
                    color: activeSection === link.id ? '#fff' : 'rgba(255,255,255,0.55)',
                    borderColor: 'rgba(255,255,255,0.05)',
                  }}
                >
                  {link.name}
                  {activeSection === link.id && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--accent-neon)',
                        boxShadow: '0 0 8px var(--accent-neon)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </a>
              ))}
              <a
                href="/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
                style={{
                  border: '1px solid rgba(0,245,212,0.3)',
                  color: 'var(--accent-neon)',
                  background: 'rgba(0,245,212,0.04)',
                }}
              >
                <FileText style={{ width: '14px', height: '14px' }} />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
