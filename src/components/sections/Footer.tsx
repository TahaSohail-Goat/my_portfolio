import { Github, Linkedin, Instagram, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const socials = [
    { icon: Github, href: 'https://github.com/TahaSohail-Goat', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/taha-sohail-7b03b8320/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/tahhaaaaaz/', label: 'Instagram' },
  ];

  return (
    <footer
      className="relative z-10 pt-14 pb-8"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          <div>
            <a
              href="#home"
              onClick={e => { e.preventDefault(); scrollToTop(); }}
              className="font-display font-bold text-2xl text-white tracking-tight block mb-3"
            >
              Taha<span className="text-white/20">.</span>
            </a>
            <p className="text-white/30 text-sm font-light max-w-xs">
              Building digital experiences that matter.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {socials.map(social => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-white transition-all duration-200"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="text-xs text-white/20 font-sans">
            &copy; {new Date().getFullYear()} Taha Sohail. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/25 hover:text-white transition-colors duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
