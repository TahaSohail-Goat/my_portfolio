import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Share2, Layers, ArrowRight } from 'lucide-react';
import {
  SKILL_CATEGORIES,
  SKILL_MAP,
  isSkillRelated,
  Skill,
  SkillCategory,
} from './skills/skills.data';
import { ViewSwitcher, ViewMode } from './skills/ViewSwitcher';
import { TechGraphView } from './skills/TechGraphView';

/* ─── Technology Card Component (Ecosystem View) ───────────── */
interface CardProps {
  skill: Skill;
  categoryColor: string;
  activeSkillName: string | null;
  onHover: (s: string | null) => void;
  onClick: (s: string) => void;
}

function TechnologyCard({
  skill,
  categoryColor,
  activeSkillName,
  onHover,
  onClick,
}: CardProps) {
  const isActive = activeSkillName === skill.name;
  const isRelated = isSkillRelated(skill.name, activeSkillName);
  const isDimmed = activeSkillName !== null && !isActive && !isRelated;

  const IconComp = skill.icon;
  const accentColor = isActive
    ? 'var(--accent-neon)'
    : isRelated
    ? categoryColor
    : 'rgba(255,255,255,0.7)';

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
        transition:
          'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
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
          transform: isActive
            ? 'translateY(-2px) scale(1.08)'
            : 'translateY(0) scale(1)',
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

function RelationshipDetailPanel({
  activeSkillName,
  onSelectSkill,
}: PanelProps) {
  const activeData = activeSkillName ? SKILL_MAP.get(activeSkillName) : undefined;
  const activeSkill = activeData?.skill;
  const activeCategory = activeData?.category;

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
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: '100%',
            }}
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
                <activeSkill.icon
                  style={{
                    width: '26px',
                    height: '26px',
                    color: 'var(--accent-neon)',
                  }}
                />
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

            <div
              style={{
                width: '100%',
                height: '1px',
                background: 'rgba(255,255,255,0.07)',
                margin: '4px 0',
              }}
            />

            {/* Connected Ecosystem Section */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '12px',
                }}
              >
                <Share2
                  style={{
                    width: '12px',
                    height: '12px',
                    color: 'var(--accent-neon)',
                  }}
                />
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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {connectedSkills.map(
                    ({ skill: connSkill, category: connCat }) => {
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
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                            }}
                          >
                            <ConnIcon
                              style={{
                                width: '18px',
                                height: '18px',
                                color: connCat.color,
                              }}
                            />
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
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
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
                            <ArrowRight
                              style={{
                                width: '11px',
                                height: '11px',
                                color: 'rgba(255,255,255,0.3)',
                              }}
                            />
                          </div>
                        </button>
                      );
                    }
                  )}
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
          /* Default state when no technology is active */
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
              Hover or click any technology card or graph node to explore its description and connected stack relationships.
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

  // View state: ALWAYS defaults to 'ecosystem' on first visit
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem('skills_view_mode');
      if (saved === 'graph' || saved === 'ecosystem') {
        return saved;
      }
    } catch {
      // localStorage fallback
    }
    return 'ecosystem';
  });

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('skills_view_mode', mode);
    } catch {
      // ignore quota / security errors
    }
  };

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

        {/* ── Header with Heading & View Switcher ─── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-mono-label mb-3">technology ecosystem</p>
            <h2 className="text-h1 font-display text-white">
              Skills &{' '}
              <span style={{ color: 'var(--accent-neon)' }}>Stack</span>
            </h2>
            <div className="mt-4 w-12 h-px" style={{ background: 'var(--accent-neon)', opacity: 0.4 }} />
            <p
              style={{
                marginTop: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.70)',
                letterSpacing: '0.05em',
              }}
            >
              {viewMode === 'ecosystem'
                ? 'hover a technology card to reveal its ecosystem relationships'
                : 'explore interactive technical relationship graph & connections'}
            </p>
          </div>

          {/* View Switcher Control */}
          <div className="shrink-0 self-start md:self-end">
            <ViewSwitcher currentView={viewMode} onViewChange={handleViewChange} />
          </div>
        </motion.div>

        {/* ── Dynamic View Container with Smooth Transition ─── */}
        <AnimatePresence mode="wait">
          {viewMode === 'ecosystem' ? (
            /* ── 1. ECOSYSTEM VIEW (Default Grid Layout) ─── */
            <motion.div
              key="ecosystem-view"
              id="panel-ecosystem"
              role="tabpanel"
              aria-labelledby="tab-ecosystem"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                      transition={{ duration: 0.6, delay: catIdx * 0.05 }}
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
                            background: isCategoryActive
                              ? 'var(--accent-neon)'
                              : category.color,
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
                            color: isCategoryActive
                              ? 'var(--accent-neon)'
                              : category.color,
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
          ) : (
            /* ── 2. GRAPH VIEW (Interactive Obsidian-style Graph) ─── */
            <motion.div
              key="graph-view"
              id="panel-graph"
              role="tabpanel"
              aria-labelledby="tab-graph"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Interactive Graph Visualization (col-span-8) */}
              <div className="lg:col-span-8 w-full">
                <TechGraphView
                  selectedSkillName={selectedSkillName}
                  onSelectSkill={handleSelectSkill}
                  hoveredSkillName={hoveredSkillName}
                  onHoverSkill={setHoveredSkillName}
                />
              </div>

              {/* Right Column: Sticky Relationship Detail Panel (col-span-4) */}
              <div className="lg:col-span-4 w-full self-stretch min-h-full">
                <RelationshipDetailPanel
                  activeSkillName={activeSkillName}
                  onSelectSkill={handleSelectSkill}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile Floating Relationship HUD ─── */}
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
                  boxShadow:
                    '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(0,245,212,0.15)',
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
                          <IconC
                            style={{
                              width: '20px',
                              height: '20px',
                              color: 'var(--accent-neon)',
                            }}
                          />
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
                        Tap node/card
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
                {cat.skills.map(s => (
                  <li key={s.name}>{s.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
