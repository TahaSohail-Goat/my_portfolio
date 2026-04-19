import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const NAME_CHARS = 'TAHA SOHAIL'.split('');

export function LoadingScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'letters' | 'subtitle' | 'progress' | 'exit'>('letters');
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('subtitle'), 1100);
    const t2 = setTimeout(() => setPhase('progress'), 1600);
    const t3 = setTimeout(() => {
      let p = 0;
      const tick = setInterval(() => {
        p += Math.random() * 7 + 3;
        if (p >= 100) {
          p = 100;
          clearInterval(tick);
          setTimeout(() => {
            setPhase('exit');
            setExiting(true);
            setTimeout(onComplete, 950);
          }, 250);
        }
        setProgress(Math.min(p, 100));
      }, 55);
      return () => clearInterval(tick);
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#080808' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Split exit panels */}
          <motion.div
            className="fixed inset-x-0 top-0 z-[10001] pointer-events-none"
            style={{ height: '50vh', background: '#080808' }}
            animate={exiting ? { y: '-100%' } : { y: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[10001] pointer-events-none"
            style={{ height: '50vh', background: '#080808' }}
            animate={exiting ? { y: '100%' } : { y: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          />

          {/* Main content */}
          <div className="relative z-[10002] flex flex-col items-center" style={{ gap: '2rem' }}>

            {/* Animated name — each letter clips in from below */}
            <div className="flex" style={{ gap: '0.02em' }}>
              {NAME_CHARS.map((char, i) => (
                <div
                  key={i}
                  style={{
                    overflow: 'hidden',
                    display: 'inline-block',
                    lineHeight: 1.05,
                  }}
                >
                  <motion.span
                    initial={{ y: '105%' }}
                    animate={{ y: '0%' }}
                    transition={{
                      delay: 0.1 + i * 0.065,
                      duration: 0.65,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      display: 'block',
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                      color: '#ffffff',
                      letterSpacing: char === ' ' ? '0.3em' : '0.04em',
                      width: char === ' ' ? '0.35em' : 'auto',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                </div>
              ))}
            </div>

            {/* Thin separator line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={phase !== 'letters'
                ? { scaleX: 1, opacity: 1 }
                : { scaleX: 0, opacity: 0 }
              }
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '1px',
                width: '100%',
                background: 'rgba(255,255,255,0.12)',
                transformOrigin: 'left',
              }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={phase !== 'letters' ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                marginTop: '-0.5rem',
              }}
            >
              Software Engineer &nbsp;·&nbsp; Portfolio
            </motion.p>

            {/* Progress line */}
            <div style={{ width: 'clamp(200px, 30vw, 320px)', position: 'relative', marginTop: '0.5rem' }}>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', width: '100%' }} />
              <motion.div
                initial={{ opacity: 0 }}
                animate={phase === 'progress' || phase === 'exit' ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '1px',
                  width: `${progress}%`,
                  background: 'rgba(255,255,255,0.8)',
                  boxShadow: '0 0 10px rgba(255,255,255,0.25)',
                  transition: 'width 0.055s linear',
                }}
              />
              {/* Percentage */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={phase === 'progress' || phase === 'exit' ? { opacity: 1 } : { opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: 0,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.2)',
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {Math.round(progress).toString().padStart(3, '0')}
              </motion.span>
            </div>
          </div>

          {/* Corner brackets */}
          {[
            { top: 28, left: 28, bt: true, bl: true },
            { top: 28, right: 28, bt: true, br: true },
            { bottom: 28, left: 28, bb: true, bl: true },
            { bottom: 28, right: 28, bb: true, br: true },
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="fixed pointer-events-none"
              style={{
                width: 20,
                height: 20,
                top: pos.top,
                left: pos.left,
                right: pos.right,
                bottom: pos.bottom,
                borderTop: pos.bt ? '1px solid rgba(255,255,255,0.15)' : undefined,
                borderBottom: pos.bb ? '1px solid rgba(255,255,255,0.15)' : undefined,
                borderLeft: pos.bl ? '1px solid rgba(255,255,255,0.15)' : undefined,
                borderRight: pos.br ? '1px solid rgba(255,255,255,0.15)' : undefined,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
