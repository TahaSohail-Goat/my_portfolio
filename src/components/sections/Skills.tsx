import { useState, useRef, ComponentType } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  SiCplusplus,
  SiC,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiVite,
  SiHtml5,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiDjango,
  SiFlask,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiGithub,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { VscCode } from 'react-icons/vsc';
import {
  Database,
  Server,
  BrainCircuit,
  Workflow,
  BarChart3,
  GitBranch,
  Code2,
  Boxes,
  Component as ComponentIcon,
  ShieldCheck,
  Cpu,
  AppWindow,
  Share2,
  Layers,
  ArrowRight,
} from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────── */
type Skill = {
  name: string;
  icon: ComponentType<{ style?: React.CSSProperties; className?: string }>;
  description?: string;
  related?: string[];
};

type SkillCategory = {
  id: string;
  label: string;
  color: string;
  skills: Skill[];
};

/* ─── Skill Categories Data ────────────────────────────────── */
const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'languages',
    label: 'Languages',
    color: '#00f5d4',
    skills: [
      { name: 'C++', icon: SiCplusplus, description: 'Core language for low-level systems, high performance algorithms, and competitive programming.', related: ['DSA', 'OOP', 'Systems', 'Algorithms'] },
      { name: 'C', icon: SiC, description: 'Fundamental systems programming language used for memory management and OS concepts.', related: ['Systems', 'C++'] },
      { name: 'Python', icon: SiPython, description: 'Versatile language used for AI/ML, automation scripts, backend services, and data analysis.', related: ['ML/AI', 'Django', 'Flask', 'Automation', 'Data Analysis'] },
      { name: 'JavaScript', icon: SiJavascript, description: 'Primary language for modern interactive web development across client and server.', related: ['React', 'Node.js', 'Express', 'Vite', 'HTML / CSS'] },
      { name: 'TypeScript', icon: SiTypescript, description: 'Strongly typed JavaScript superset for scalable, type-safe application architecture.', related: ['React', 'Next.js', 'Node.js'] },
      { name: 'Java', icon: FaJava, description: 'Object-oriented language used for enterprise desktop software and architectural design patterns.', related: ['JavaFX', 'OOP', 'Design Patterns'] },
      { name: 'SQL', icon: Database, description: 'Declarative language for relational database querying, schema design, and data manipulation.', related: ['PostgreSQL', 'MySQL'] },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    color: '#38bdf8',
    skills: [
      { name: 'React', icon: SiReact, description: 'Component-driven UI library for building dynamic, state-driven web applications.', related: ['Next.js', 'Vite', 'TypeScript', 'Tailwind', 'Framer Motion', 'JavaScript'] },
      { name: 'Next.js', icon: SiNextdotjs, description: 'Production React framework for server-side rendering, static generation, and routing.', related: ['React', 'TypeScript', 'Node.js'] },
      { name: 'Vite', icon: SiVite, description: 'Next-generation frontend tooling and lightning-fast HMR module bundler.', related: ['React', 'JavaScript'] },
      { name: 'HTML / CSS', icon: SiHtml5, description: 'Semantic HTML5 structure and responsive CSS3 layout, flexbox, and grid styling.', related: ['React', 'Tailwind'] },
      { name: 'Tailwind', icon: SiTailwindcss, description: 'Utility-first CSS framework for rapid, responsive, and custom UI design systems.', related: ['React', 'HTML / CSS'] },
      { name: 'Framer Motion', icon: SiFramer, description: 'Production-ready motion library for fluid React micro-interactions and transitions.', related: ['React'] },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    color: '#a78bfa',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, description: 'Asynchronous event-driven JavaScript runtime for scalable server-side applications.', related: ['Express', 'JavaScript', 'TypeScript', 'REST APIs', 'MongoDB'] },
      { name: 'Express', icon: SiExpress, description: 'Minimalist web framework for building Node.js RESTful APIs and middleware.', related: ['Node.js', 'REST APIs', 'MongoDB', 'JavaScript'] },
      { name: 'Django', icon: SiDjango, description: 'High-level Python web framework encouraging rapid development and clean design.', related: ['Python', 'REST APIs'] },
      { name: 'Flask', icon: SiFlask, description: 'Micro Python web framework for lightweight REST microservices and APIs.', related: ['Python', 'REST APIs'] },
      { name: 'REST APIs', icon: Server, description: 'Architectural style for designing networked HTTP APIs with clean endpoints and JSON payloads.', related: ['Express', 'Django', 'Node.js', 'Flask'] },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    color: '#f59e0b',
    skills: [
      { name: 'MongoDB', icon: SiMongodb, description: 'NoSQL document database for flexible JSON-like document storage and aggregation.', related: ['Node.js', 'Express'] },
      { name: 'MySQL', icon: SiMysql, description: 'Popular open-source relational database management system featuring robust SQL query execution.', related: ['SQL'] },
      { name: 'PostgreSQL', icon: SiPostgresql, description: 'Advanced open-source object-relational database with strong ACID compliance and complex queries.', related: ['SQL'] },
    ],
  },
  {
    id: 'ai',
    label: 'AI / ML',
    color: '#34d399',
    skills: [
      { name: 'ML/AI', icon: BrainCircuit, description: 'Machine learning fundamentals, predictive modeling, and intelligent agent algorithms.', related: ['Python', 'Data Analysis'] },
      { name: 'Automation', icon: Workflow, description: 'Automated workflow scripts, task scheduling, and system orchestration.', related: ['Python'] },
      { name: 'Data Analysis', icon: BarChart3, description: 'Data processing, feature extraction, and statistical trend visualization.', related: ['Python', 'ML/AI'] },
    ],
  },
  {
    id: 'concepts',
    label: 'CS Fundamentals',
    color: '#fb7185',
    skills: [
      { name: 'DSA', icon: GitBranch, description: 'Data Structures & Algorithms: trees, graphs, heaps, dynamic programming, and efficiency optimization.', related: ['C++', 'Algorithms', 'OOP'] },
      { name: 'Algorithms', icon: Code2, description: 'Graph traversal (Dijkstra), sorting, searching, and space/time complexity analysis.', related: ['DSA', 'C++'] },
      { name: 'OOP', icon: Boxes, description: 'Object-Oriented Design: encapsulation, inheritance, polymorphism, and abstraction.', related: ['C++', 'Java', 'Design Patterns', 'SOLID'] },
      { name: 'Design Patterns', icon: ComponentIcon, description: 'Software design patterns including Factory, Strategy, Observer, and Singleton.', related: ['OOP', 'SOLID', 'Java'] },
      { name: 'SOLID', icon: ShieldCheck, description: 'The five fundamental principles of object-oriented class design for maintainable software.', related: ['OOP', 'Design Patterns'] },
      { name: 'Systems', icon: Cpu, description: 'Computer architecture, memory allocation, process threads, and OS concepts.', related: ['C', 'C++'] },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    color: '#94a3b8',
    skills: [
      { name: 'Git', icon: SiGit, description: 'Distributed version control system for tracking source code changes and branch management.', related: ['GitHub', 'VS Code'] },
      { name: 'GitHub', icon: SiGithub, description: 'Cloud repository platform for collaborative software development, code reviews, and CI/CD.', related: ['Git'] },
      { name: 'VS Code', icon: VscCode, description: 'Primary code editor configured with extensions, debugging pipelines, and terminal integration.', related: ['Git'] },
      { name: 'JavaFX', icon: AppWindow, description: 'Java GUI framework for building custom-styled desktop application user interfaces.', related: ['Java', 'OOP'] },
    ],
  },
];

/* ─── Fast Map Lookup for Skill Objects ────────────────────── */
const SKILL_MAP = new Map<string, { skill: Skill; category: SkillCategory }>();
for (const cat of SKILL_CATEGORIES) {
  for (const s of cat.skills) {
    SKILL_MAP.set(s.name, { skill: s, category: cat });
  }
}

/* ─── Helper: Bidirectional Relationship Lookup ─────────────── */
function isSkillRelated(targetName: string, activeName: string | null): boolean {
  if (!activeName) return false;
  if (targetName === activeName) return false;

  const target = SKILL_MAP.get(targetName)?.skill;
  const active = SKILL_MAP.get(activeName)?.skill;

  // Direction 1: active lists target
  if (active?.related?.includes(targetName)) return true;
  // Direction 2: target lists active
  if (target?.related?.includes(activeName)) return true;

  return false;
}

/* ─── Technology Card Component ───────────────────────────── */
interface CardProps {
  skill: Skill;
  categoryColor: string;
  activeSkillName: string | null;
  onHover: (s: string | null) => void;
  onClick: (s: string) => void;
}

function TechnologyCard({ skill, categoryColor, activeSkillName, onHover, onClick }: CardProps) {
  const isActive = activeSkillName === skill.name;
  const isRelated = isSkillRelated(skill.name, activeSkillName);
  const isDimmed = activeSkillName !== null && !isActive && !isRelated;

  const IconComp = skill.icon;
  const accentColor = isActive ? 'var(--accent-neon)' : isRelated ? categoryColor : 'rgba(255,255,255,0.7)';

  return (
    <button
      onMouseEnter={() => onHover(skill.name)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(skill.name)}
      aria-label={`${skill.name} technology`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 10px',
        borderRadius: '12px',
        border: `1px solid ${
          isActive
            ? 'var(--accent-neon)'
            : isRelated
            ? `${categoryColor}88`
            : 'rgba(255,255,255,0.08)'
        }`,
        background: isActive
          ? 'rgba(0,245,212,0.12)'
          : isRelated
          ? `${categoryColor}14`
          : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
        opacity: isDimmed ? 0.35 : 1,
        boxShadow: isActive
          ? '0 0 20px rgba(0,245,212,0.28)'
          : isRelated
          ? `0 0 14px ${categoryColor}30`
          : 'none',
      }}
    >
      <IconComp
        style={{
          width: '28px',
          height: '28px',
          color: accentColor,
          transition: 'all 0.2s ease',
          transform: isActive ? 'translateY(-2px) scale(1.08)' : 'translateY(0) scale(1)',
          filter: isActive
            ? 'drop-shadow(0 0 8px rgba(0,245,212,0.7))'
            : isRelated
            ? `drop-shadow(0 0 6px ${categoryColor}66)`
            : 'none',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: isActive
            ? '#ffffff'
            : isRelated
            ? categoryColor
            : 'rgba(255,255,255,0.80)',
          fontWeight: isActive ? 600 : 400,
          letterSpacing: '0.02em',
          transition: 'all 0.2s ease',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {skill.name}
      </span>
    </button>
  );
}

/* ─── Right Side Relationship Detail Panel ─────────────────── */
interface PanelProps {
  activeSkillName: string | null;
  onSelectSkill: (s: string) => void;
}

function RelationshipDetailPanel({ activeSkillName, onSelectSkill }: PanelProps) {
  const activeData = activeSkillName ? SKILL_MAP.get(activeSkillName) : undefined;
  const activeSkill = activeData?.skill;
  const activeCategory = activeData?.category;

  // Find all connected skills (both direct and inverse)
  const connectedSkills: { skill: Skill; category: SkillCategory }[] = [];
  if (activeSkillName) {
    for (const [name, data] of SKILL_MAP.entries()) {
      if (name !== activeSkillName && isSkillRelated(name, activeSkillName)) {
        connectedSkills.push({ skill: data.skill, category: data.category });
      }
    }
  }

  return (
    <div
      style={{
        padding: '22px',
        borderRadius: '16px',
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: activeSkill
          ? '1px solid rgba(0,245,212,0.30)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: activeSkill
          ? '0 8px 32px rgba(0,0,0,0.5), 0 0 32px rgba(0,245,212,0.08)'
          : '0 8px 24px rgba(0,0,0,0.3)',
        minHeight: '340px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        position: 'sticky',
        top: '96px',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <AnimatePresence mode="wait">
        {activeSkill && activeCategory ? (
          <motion.div
            key={activeSkill.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}
          >
            {/* Header: Icon + Name + Category badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0,245,212,0.08)',
                  border: '1px solid rgba(0,245,212,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 0 16px rgba(0,245,212,0.15)',
                }}
              >
                {<activeSkill.icon style={{ width: '26px', height: '26px', color: 'var(--accent-neon)' }} />}
              </div>

              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9.5px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: activeCategory.color,
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '2px',
                  }}
                >
                  {activeCategory.label}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.1,
                  }}
                >
                  {activeSkill.name}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.82rem',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.78)',
                fontWeight: 300,
              }}
            >
              {activeSkill.description}
            </p>

            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />

            {/* Connected Ecosystem Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Share2 style={{ width: '12px', height: '12px', color: 'var(--accent-neon)' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.60)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Connected Ecosystem ({connectedSkills.length})
                </span>
              </div>

              {connectedSkills.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {connectedSkills.map(({ skill: connSkill, category: connCat }) => {
                    const ConnIcon = connSkill.icon;
                    return (
                      <button
                        key={connSkill.name}
                        onClick={() => onSelectSkill(connSkill.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${connCat.color}35`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = 'rgba(0,245,212,0.08)';
                          el.style.borderColor = 'var(--accent-neon)';
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = 'rgba(255,255,255,0.03)';
                          el.style.borderColor = `${connCat.color}35`;
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <ConnIcon style={{ width: '18px', height: '18px', color: connCat.color }} />
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              color: '#ffffff',
                              fontWeight: 500,
                            }}
                          >
                            {connSkill.name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '9px',
                              color: connCat.color,
                              opacity: 0.8,
                              textTransform: 'uppercase',
                            }}
                          >
                            {connCat.label}
                          </span>
                          <ArrowRight style={{ width: '11px', height: '11px', color: 'rgba(255,255,255,0.3)' }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  Core standalone skill.
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          /* Default state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '12px',
              padding: '20px 10px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(0,245,212,0.06)',
                border: '1px solid rgba(0,245,212,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-neon)',
              }}
            >
              <Layers style={{ width: '22px', height: '22px' }} />
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#ffffff',
              }}
            >
              Interactive Ecosystem
            </h4>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.60)',
                lineHeight: 1.6,
                maxWidth: '240px',
              }}
            >
              Hover or click any technology card to explore its description and connected stack relationships.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Skills Section ───────────────────────────────────── */
export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);
  const [hoveredSkillName, setHoveredSkillName] = useState<string | null>(null);

  // Active skill is hovered if present, otherwise selected
  const activeSkillName = hoveredSkillName || selectedSkillName;

  const handleSelectSkill = (name: string) => {
    setSelectedSkillName(prev => (prev === name ? null : name));
    setHoveredSkillName(null);
  };

  return (
    <section id="skills" className="py-24 relative z-10" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <p className="text-mono-label mb-3">technology ecosystem</p>
          <h2 className="text-h1 font-display text-white">
            Skills &{' '}
            <span style={{ color: 'var(--accent-neon)' }}>Stack</span>
          </h2>
          <div className="mt-4 w-12 h-px" style={{ background: 'var(--accent-neon)', opacity: 0.4 }} />
          <p
            style={{
              marginTop: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.70)',
              letterSpacing: '0.05em',
            }}
          >
            hover a technology card to reveal its ecosystem relationships
          </p>
        </motion.div>

        {/* ── 2-Column Layout (Grid on Left, Detail Panel on Right) ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Skill Categories & Tech Cards (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {SKILL_CATEGORIES.map((category, catIdx) => {
              const isCategoryActive =
                activeSkillName !== null &&
                category.skills.some(
                  s => s.name === activeSkillName || isSkillRelated(s.name, activeSkillName)
                );

              const isCategoryDimmed = activeSkillName !== null && !isCategoryActive;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: catIdx * 0.06 }}
                  style={{
                    opacity: isCategoryDimmed ? 0.45 : 1,
                    transition: 'opacity 0.25s ease',
                  }}
                >
                  {/* Category Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: isCategoryActive ? 'var(--accent-neon)' : category.color,
                        boxShadow: isCategoryActive
                          ? '0 0 10px var(--accent-neon)'
                          : `0 0 8px ${category.color}`,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: isCategoryActive ? 'var(--accent-neon)' : category.color,
                        fontWeight: isCategoryActive ? 600 : 500,
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {category.label}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: '1px',
                        background: isCategoryActive
                          ? 'linear-gradient(90deg, rgba(0,245,212,0.5), transparent)'
                          : `linear-gradient(90deg, ${category.color}30, transparent)`,
                        transition: 'background 0.2s ease',
                      }}
                    />
                  </div>

                  {/* Technology Cards Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {category.skills.map(skill => (
                      <TechnologyCard
                        key={skill.name}
                        skill={skill}
                        categoryColor={category.color}
                        activeSkillName={activeSkillName}
                        onHover={setHoveredSkillName}
                        onClick={handleSelectSkill}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Sticky Relationship Detail Panel (col-span-4) */}
          <div className="lg:col-span-4 w-full self-stretch min-h-full">
            <RelationshipDetailPanel
              activeSkillName={activeSkillName}
              onSelectSkill={handleSelectSkill}
            />
          </div>
        </motion.div>

        {/* ── Mobile Floating Relationship HUD (visible on mobile / touch) ─── */}
        <div className="block lg:hidden fixed bottom-6 left-4 right-4 z-50 pointer-events-none">
          <AnimatePresence>
            {activeSkillName && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto p-4 rounded-xl shadow-2xl flex items-center justify-between gap-3"
                style={{
                  background: 'rgba(8,8,8,0.94)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(0,245,212,0.3)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(0,245,212,0.15)',
                }}
              >
                {(() => {
                  const activeData = SKILL_MAP.get(activeSkillName);
                  if (!activeData) return null;
                  const IconC = activeData.skill.icon;
                  return (
                    <>
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            background: 'rgba(0,245,212,0.1)',
                            border: '1px solid rgba(0,245,212,0.3)',
                          }}
                        >
                          <IconC style={{ width: '20px', height: '20px', color: 'var(--accent-neon)' }} />
                        </div>
                        <div className="truncate">
                          <p className="font-display font-bold text-sm text-white truncate">
                            {activeData.skill.name}
                          </p>
                          <p className="font-mono text-[10px] uppercase text-emerald-400">
                            {activeData.category.label}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-white/50 shrink-0">
                        Tap card to view
                      </span>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Accessible text fallback ─── */}
        <div className="sr-only" aria-label="Complete skills list">
          {SKILL_CATEGORIES.map(cat => (
            <div key={cat.id}>
              <h3>{cat.label}</h3>
              <ul>
                {cat.skills.map(s => <li key={s.name}>{s.name}</li>)}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
