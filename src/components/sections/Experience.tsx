import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Code2, Briefcase } from 'lucide-react';
import { timelineItems, TimelineItem } from '@/data/experience.data';

/* ─── Icon by type ───────────────────────────────────────── */
const TYPE_ICON = {
  education: GraduationCap,
  project:   Code2,
  work:      Briefcase,
} as const;

const TYPE_COLOR = {
  education: '#00f5d4',
  project:   '#7c3aed',
  work:      '#f59e0b',
} as const;

/* ─── Single timeline entry ──────────────────────────────── */
interface EntryProps {
  item: TimelineItem;
  index: number;
  isLast: boolean;
}

function TimelineEntry({ item, index, isLast }: EntryProps) {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const Icon     = TYPE_ICON[item.type];
  const color    = TYPE_COLOR[item.type];
  const isLeft   = index % 2 === 0;

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 40px 1fr',
        gap: '0 16px',
        position: 'relative',
        minHeight: '160px',
      }}
    >
      {/* LEFT side */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          paddingRight: '0',
          paddingBottom: '40px',
        }}
      >
        {isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'right', maxWidth: '340px' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color,
                letterSpacing: '0.1em',
                opacity: 0.8,
                display: 'block',
                marginBottom: '8px',
              }}
            >
              {item.date}
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '5px',
                letterSpacing: '-0.01em',
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                color: color,
                opacity: 0.65,
                marginBottom: '10px',
                letterSpacing: '0.02em',
              }}
            >
              {item.organization}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.80)',
                fontWeight: 300,
                marginBottom: '10px',
              }}
            >
              {item.description}
            </p>
            {item.technologies && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'flex-end' }}>
                {item.technologies.map(t => (
                  <span
                    key={t}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.80)',
                      background: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ) : null}
      </div>

      {/* CENTER — Line + Node */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Line segment above node */}
        {index > 0 && (
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: '32px' } : {}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              width: '1px',
              background: `linear-gradient(to bottom, ${color}40, ${color}20)`,
            }}
          />
        )}

        {/* Node */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: `${color}10`,
            border: `1px solid ${color}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative',
            zIndex: 2,
            boxShadow: `0 0 16px ${color}20`,
          }}
        >
          <Icon style={{ width: '14px', height: '14px', color }} />
        </motion.div>

        {/* Line segment below node */}
        {!isLast && (
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: '100%' } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              flex: 1,
              width: '1px',
              background: `linear-gradient(to bottom, ${color}20, transparent)`,
              minHeight: '60px',
            }}
          />
        )}
      </div>

      {/* RIGHT side */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          paddingBottom: '40px',
        }}
      >
        {!isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'left', maxWidth: '340px' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color,
                letterSpacing: '0.1em',
                opacity: 0.8,
                display: 'block',
                marginBottom: '8px',
              }}
            >
              {item.date}
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '5px',
                letterSpacing: '-0.01em',
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                color: color,
                opacity: 0.65,
                marginBottom: '10px',
                letterSpacing: '0.02em',
              }}
            >
              {item.organization}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.35)',
                fontWeight: 300,
                marginBottom: '10px',
              }}
            >
              {item.description}
            </p>
            {item.technologies && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {item.technologies.map(t => (
                  <span
                    key={t}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: 'rgba(255,255,255,0.38)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

/* ─── Mobile single-column timeline entry ──────────────────── */
function MobileEntry({ item, index, isLast }: EntryProps) {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const Icon     = TYPE_ICON[item.type];
  const color    = TYPE_COLOR[item.type];

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '36px 1fr',
        gap: '0 14px',
        position: 'relative',
      }}
    >
      {/* LEFT — icon column with line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: `${color}10`,
            border: `1px solid ${color}45`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 0 12px ${color}15`,
          }}
        >
          <Icon style={{ width: '14px', height: '14px', color }} />
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: '100%' } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              flex: 1,
              width: '1px',
              background: `linear-gradient(to bottom, ${color}25, transparent)`,
              minHeight: '40px',
            }}
          />
        )}
      </div>

      {/* RIGHT — content */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ paddingBottom: isLast ? 0 : '32px' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9.5px',
            color,
            letterSpacing: '0.1em',
            opacity: 0.75,
            display: 'block',
            marginBottom: '6px',
          }}
        >
          {item.date}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#fff',
            marginBottom: '3px',
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.72rem',
            color: color,
            opacity: 0.6,
            marginBottom: '8px',
          }}
        >
          {item.organization}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.33)',
            fontWeight: 300,
            marginBottom: '8px',
          }}
        >
          {item.description}
        </p>
        {item.technologies && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {item.technologies.map(t => (
              <span
                key={t}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8.5px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Main Experience section ─────────────────────────────── */
export function Experience() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" className="py-24 relative z-10" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="text-mono-label mb-3">journey</p>
          <h2 className="text-h1 font-display text-white">
            Education &{' '}
            <span style={{ color: 'var(--accent-neon)' }}>Experience</span>
          </h2>
          <div className="mt-4 w-12 h-px" style={{ background: 'var(--accent-neon)', opacity: 0.4 }} />
        </motion.div>

        {/* ── Desktop alternating timeline ─── */}
        <div className="hidden md:block">
          {timelineItems.map((item, i) => (
            <TimelineEntry
              key={item.id}
              item={item}
              index={i}
              isLast={i === timelineItems.length - 1}
            />
          ))}
        </div>

        {/* ── Mobile single-column timeline ─── */}
        <div className="md:hidden" style={{ paddingLeft: '0' }}>
          {timelineItems.map((item, i) => (
            <MobileEntry
              key={item.id}
              item={item}
              index={i}
              isLast={i === timelineItems.length - 1}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
