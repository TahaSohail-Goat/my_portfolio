import { ArrowUp, FileText } from 'lucide-react';
import { FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const socials = [
    { icon: FiGithub,    href: 'https://github.com/TahaSohail-Goat',                   label: 'GitHub' },
    { icon: FiLinkedin,  href: 'https://www.linkedin.com/in/taha-sohail-7b03b8320/',   label: 'LinkedIn' },
    { icon: FiInstagram, href: 'https://www.instagram.com/tahhaaaaaz/',                 label: 'Instagram' },
  ];

  return (
    <footer
      className="relative z-10 pt-14 pb-8"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-10">

          {/* LEFT — Brand */}
          <div>
            <a
              href="#home"
              onClick={e => { e.preventDefault(); scrollToTop(); }}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.4rem',
                color: '#fff',
                letterSpacing: '-0.02em',
                display: 'block',
                marginBottom: '6px',
                textDecoration: 'none',
              }}
            >
              Taha<span style={{ color: 'var(--accent-neon)' }}>.</span>
            </a>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.28)',
                fontWeight: 300,
                maxWidth: '220px',
                lineHeight: 1.6,
              }}
            >
              Software engineer building deliberate, maintainable systems.
            </p>
          </div>

          {/* CENTER — Resume + social links */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
            <a
              href="/Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.04em',
                color: 'var(--accent-neon)',
                border: '1px solid rgba(0,245,212,0.28)',
                background: 'rgba(0,245,212,0.04)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,212,0.5)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,212,0.08)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 14px rgba(0,245,212,0.12)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,212,0.28)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,212,0.04)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <FileText style={{ width: '12px', height: '12px' }} />
              Download Resume
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {socials.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.28)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--accent-neon)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,212,0.3)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,212,0.06)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.28)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <social.icon style={{ width: '15px', height: '15px' }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM — copyright + tech signature + scroll-to-top */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
          className="flex-col md:flex-row md:justify-between md:items-center"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.60)',
              }}
            >
              &copy; {new Date().getFullYear()} Taha Sohail. All rights reserved.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.22)',
              border: '1px solid rgba(255,255,255,0.07)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: 'transparent',
              alignSelf: 'flex-end',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--accent-neon)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,212,0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.22)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
            }}
          >
            <ArrowUp style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>
    </footer>
  );
}
