import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  ArrowLeft,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  Code2,
  Star,
  Link as LinkIcon,
} from 'lucide-react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

/* ── Section heading ─────────────────────────────────────── */
function SectionHeading({ icon: Icon, label }: { icon: React.ComponentType<{ style?: React.CSSProperties }>; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '18px',
        paddingBottom: '10px',
        borderBottom: '1px solid rgba(0,245,212,0.15)',
      }}
    >
      <Icon style={{ width: '16px', height: '16px', color: 'var(--accent-neon)' }} />
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </h2>
    </div>
  );
}

/* ── Skill pill ──────────────────────────────────────────── */
function Pill({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        padding: '3px 10px',
        borderRadius: '4px',
        border: '1px solid rgba(0,245,212,0.25)',
        color: 'rgba(255,255,255,0.85)',
        background: 'rgba(0,245,212,0.04)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

/* ── Timeline entry (Education / Experience) ─────────────── */
function TimelineItem({
  date,
  title,
  org,
  points,
  tech,
}: {
  date: string;
  title: string;
  org: string;
  points: string[];
  tech?: string[];
}) {
  return (
    <div style={{ marginBottom: '22px', paddingLeft: '16px', borderLeft: '2px solid rgba(0,245,212,0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
            {title}
          </h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--accent-neon)', opacity: 0.85 }}>
            {org}
          </p>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.50)', whiteSpace: 'nowrap' }}>
          {date}
        </span>
      </div>
      <ul style={{ paddingLeft: '0', margin: '10px 0 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {points.map((pt, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>
            <span style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '1px' }}>→</span>
            {pt}
          </li>
        ))}
      </ul>
      {tech && tech.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
          {tech.map(t => <Pill key={t} label={t} />)}
        </div>
      )}
    </div>
  );
}

/* ── Main Resume page ────────────────────────────────────── */
export default function Resume() {
  useEffect(() => {
    document.title = 'Resume — Taha Sohail';
    return () => { document.title = 'Taha Sohail'; };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        color: '#fff',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ── Top Action Bar ─── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(8,8,8,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '14px 0',
        }}
      >
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.60)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              letterSpacing: '0.04em',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.60)')}
          >
            <ArrowLeft style={{ width: '13px', height: '13px' }} />
            Back to Portfolio
          </a>

          <a
            href="/Resume.pdf"
            download
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 18px',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              color: '#0a0a0a',
              background: 'var(--accent-neon)',
              textDecoration: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 0 20px rgba(0,245,212,0.25)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(0,245,212,0.45)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0,245,212,0.25)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <Download style={{ width: '13px', height: '13px' }} />
            Download PDF
          </a>
        </div>
      </div>

      {/* ── Resume Content ─── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '48px 24px 80px',
        }}
      >
        {/* ── Header ─── */}
        <div
          style={{
            marginBottom: '40px',
            paddingBottom: '32px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--accent-neon)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              curriculum vitae
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
                marginBottom: '8px',
              }}
            >
              Taha Sohail
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.65)',
                marginBottom: '20px',
              }}
            >
              Software Engineer · Full-Stack Developer · C++ Specialist
            </p>

            {/* Contact row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {[
                { icon: Mail, label: 'tahaxsohail@gmail.com', href: 'mailto:tahaxsohail@gmail.com' },
                { icon: MapPin, label: 'Pakistan', href: null },
                { icon: FiGithub, label: 'TahaSohail-Goat', href: 'https://github.com/TahaSohail-Goat' },
                { icon: FiLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/taha-sohail-7b03b8320/' },
              ].map(({ icon: Icon, label, href }) => (
                href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.65)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-neon)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                  >
                    <Icon style={{ width: '12px', height: '12px' }} />
                    {label}
                  </a>
                ) : (
                  <span
                    key={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.65)',
                    }}
                  >
                    <Icon style={{ width: '12px', height: '12px' }} />
                    {label}
                  </span>
                )
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Two-column layout ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 260px',
            gap: '40px',
            alignItems: 'start',
          }}
          className="resume-grid"
        >
          {/* LEFT column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

            {/* Summary */}
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <SectionHeading icon={Star} label="Summary" />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.80)', fontWeight: 300 }}>
                Software Engineering student at FAST-NUCES with a strong foundation in C++, Python, and full-stack web development.
                Passionate about building efficient algorithms, clean architecture, and production-ready applications.
                Experienced across the full stack from low-level systems programming to React and Node.js web applications.
              </p>
            </motion.section>

            {/* Education */}
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <SectionHeading icon={GraduationCap} label="Education" />
              <TimelineItem
                date="2023 - Present"
                title="Bachelor of Science in Software Engineering"
                org="FAST National University of Computer and Emerging Sciences, Pakistan"
                points={[
                  'Core coursework: Data Structures & Algorithms, Object-Oriented Programming, Software Design & Architecture, Database Systems, Web Engineering.',
                  'Worked extensively with C++, Java, Python, and modern web frameworks throughout coursework and projects.',
                ]}
                tech={['C++', 'Java', 'Python', 'DSA', 'OOP', 'Software Architecture']}
              />
            </motion.section>

            {/* Projects */}
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <SectionHeading icon={Code2} label="Projects" />
              <TimelineItem
                date="2024"
                title="Disaster Management MIS"
                org="Academic Project · FAST-NUCES"
                points={[
                  'Built a full-stack Smart Disaster Response Management Information System with real-time emergency tracking and resource allocation.',
                  'Implemented multi-role authentication and a RESTful API backend with Express and MongoDB.',
                  'First end-to-end MERN stack application with a production-grade architecture.',
                ]}
                tech={['React', 'Next.js', 'Node.js', 'Express', 'MongoDB']}
              />
              <TimelineItem
                date="2024"
                title="CDIEM: Software Architecture Project"
                org="Academic Project · FAST-NUCES"
                points={[
                  'Engineered a desktop application applying SOLID principles and multiple design patterns (Factory, Observer, Strategy).',
                  'Built a modular component architecture using JavaFX for the graphical interface.',
                ]}
                tech={['JavaFX', 'Java', 'Design Patterns', 'SOLID']}
              />
              <TimelineItem
                date="2023"
                title="SeaRoute Navigator"
                org="Academic Project · FAST-NUCES"
                points={[
                  "Implemented graph-based pathfinding using Dijkstra's algorithm for optimal sea route computation between ports.",
                  'Deep focus on efficient data structures and algorithm design in C++.',
                ]}
                tech={['C++', 'Graph Algorithms', 'Dijkstra', 'DSA']}
              />
              <TimelineItem
                date="2023"
                title="Magical Pet Kingdom"
                org="Academic Project · FAST-NUCES"
                points={[
                  'Built a C++ class hierarchy demonstrating multi-level inheritance, runtime polymorphism via virtual functions, and operator overloading.',
                ]}
                tech={['C++', 'OOP', 'Inheritance', 'Polymorphism']}
              />
            </motion.section>
          </div>

          {/* RIGHT column — sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Skills */}
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <SectionHeading icon={Briefcase} label="Skills" />

              {[
                { label: 'Languages', items: ['C++', 'C', 'Python', 'JavaScript', 'TypeScript', 'Java', 'SQL'] },
                { label: 'Frontend', items: ['React', 'Next.js', 'Vite', 'HTML/CSS', 'Tailwind', 'Framer Motion'] },
                { label: 'Backend', items: ['Node.js', 'Express', 'Django', 'Flask', 'REST APIs'] },
                { label: 'Databases', items: ['MongoDB', 'MySQL', 'PostgreSQL'] },
                { label: 'AI/ML', items: ['ML/AI', 'Data Analysis', 'Automation'] },
                { label: 'Concepts', items: ['DSA', 'OOP', 'SOLID', 'Design Patterns', 'Systems'] },
                { label: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'JavaFX'] },
              ].map(({ label, items }) => (
                <div key={label} style={{ marginBottom: '16px' }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: 'var(--accent-neon)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                      opacity: 0.85,
                    }}
                  >
                    {label}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {items.map(item => <Pill key={item} label={item} />)}
                  </div>
                </div>
              ))}
            </motion.section>

            {/* Links */}
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <SectionHeading icon={LinkIcon} label="Links" />
              {[
                { label: 'GitHub', url: 'https://github.com/TahaSohail-Goat', display: 'TahaSohail-Goat' },
                { label: 'LinkedIn', url: 'https://www.linkedin.com/in/taha-sohail-7b03b8320/', display: 'taha-sohail-7b03b8320' },
              ].map(({ label, url, display }) => (
                <div key={label} style={{ marginBottom: '12px' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.50)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    {label}
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--accent-neon)', textDecoration: 'none', opacity: 0.85, transition: 'opacity 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}
                  >
                    {display}
                  </a>
                </div>
              ))}
            </motion.section>
          </div>
        </div>
      </motion.div>

      {/* Responsive style for single column on mobile */}
      <style>{`
        @media (max-width: 720px) {
          .resume-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media print {
          .resume-grid { grid-template-columns: 1fr 220px !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}
