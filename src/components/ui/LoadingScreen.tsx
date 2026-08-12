import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const TAHA_CHARS = 'TAHA'.split('');
const SOHAIL_CHARS = 'SOHAIL'.split('');

export function LoadingScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'letters' | 'subtitle' | 'progress' | 'exit'>('letters');
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('subtitle'), 1000);
    const t2 = setTimeout(() => setPhase('progress'), 1400);
    const t3 = setTimeout(() => {
      let p = 0;
      const tick = setInterval(() => {
        p += Math.random() * 8 + 4;
        if (p >= 100) {
          p = 100;
          clearInterval(tick);
          setTimeout(() => {
            setPhase('exit');
            setExiting(true);
            setTimeout(onComplete, 950);
          }, 300);
        }
        setProgress(Math.min(p, 100));
      }, 50);
      return () => clearInterval(tick);
    }, 1400);

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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{ background: '#040404' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── Background volumetric lighting ── */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(0,245,212,0.12) 0%, rgba(16,185,129,0.04) 45%, transparent 75%)',
              animation: 'loadingPulseGlow 3s ease-in-out infinite alternate',
            }}
          />

          {/* ── Split shutter exit panels ── */}
          <motion.div
            className="fixed inset-x-0 top-0 z-[10001] pointer-events-none"
            style={{ height: '50vh', background: '#040404' }}
            animate={exiting ? { y: '-100%' } : { y: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[10001] pointer-events-none"
            style={{ height: '50vh', background: '#040404' }}
            animate={exiting ? { y: '100%' } : { y: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          />

          {/* ── Center 3D Lightning Container ── */}
          <div
            className="relative z-[10002] flex flex-col items-center px-4"
            style={{ perspective: '1000px' }}
          >
            {/* 3D Animated Title Wrapper */}
            <div
              className="relative flex flex-wrap justify-center items-center gap-4 md:gap-8 my-4"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(8deg) rotateY(-4deg)',
              }}
            >
              {/* Lightning streak line behind text */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-80"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0,245,212,0.8), #ffffff, rgba(16,185,129,0.8), transparent)',
                  height: '2px',
                  top: '50%',
                  transform: 'translateY(-50%) scaleX(1.4)',
                  filter: 'blur(3px)',
                  animation: 'laserScan 2.5s ease-in-out infinite alternate',
                }}
              />

              {/* Word 1: TAHA (Glowing White-Cyan 3D) */}
              <div className="flex" style={{ gap: '0.04em' }}>
                {TAHA_CHARS.map((char, i) => (
                  <motion.span
                    key={`taha-${i}`}
                    initial={{ y: 80, opacity: 0, rotateX: -90, rotateY: 30, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0, rotateY: 0, scale: 1 }}
                    transition={{
                      delay: 0.1 + i * 0.08,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: '#ffffff',
                      textShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(0,245,212,0.4), 0 4px 15px rgba(0,0,0,0.9)',
                      letterSpacing: '0.05em',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* Word 2: SOHAIL (Vibrant Dark Green / Emerald Neon 3D) */}
              <div className="flex" style={{ gap: '0.04em' }}>
                {SOHAIL_CHARS.map((char, i) => (
                  <motion.span
                    key={`sohail-${i}`}
                    initial={{ y: 80, opacity: 0, rotateX: 90, rotateY: -30, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0, rotateY: 0, scale: 1 }}
                    transition={{
                      delay: 0.45 + i * 0.08,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      background: 'linear-gradient(135deg, #00f5d4 0%, #10b981 50%, #047857 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 25px rgba(0,245,212,0.5))',
                      letterSpacing: '0.05em',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Separator line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={phase !== 'letters' ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '1px',
                width: '100%',
                maxWidth: '400px',
                background: 'linear-gradient(90deg, transparent, rgba(0,245,212,0.6), transparent)',
                margin: '1rem 0',
              }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={phase !== 'letters' ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                fontSize: '0.72rem',
                color: 'var(--accent-neon)',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                opacity: 0.85,
              }}
            >
              SOFTWARE ENGINEER · SYSTEM ARCHITECT
            </motion.p>

            {/* Neon Progress Bar */}
            <div style={{ width: 'clamp(220px, 35vw, 360px)', position: 'relative', marginTop: '1.5rem' }}>
              <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', width: '100%', borderRadius: '2px' }} />
              <motion.div
                initial={{ opacity: 0 }}
                animate={phase === 'progress' || phase === 'exit' ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '2px',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #00f5d4 0%, #10b981 100%)',
                  boxShadow: '0 0 12px #00f5d4, 0 0 24px #10b981',
                  borderRadius: '2px',
                  transition: 'width 0.05s linear',
                }}
              />

              {/* Progress counter */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={phase === 'progress' || phase === 'exit' ? { opacity: 1 } : { opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: 0,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  color: 'var(--accent-neon)',
                  letterSpacing: '0.08em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {Math.round(progress).toString().padStart(3, '0')}%
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
                width: 24,
                height: 24,
                top: pos.top,
                left: pos.left,
                right: pos.right,
                bottom: pos.bottom,
                borderTop: pos.bt ? '1px solid rgba(0,245,212,0.3)' : undefined,
                borderBottom: pos.bb ? '1px solid rgba(0,245,212,0.3)' : undefined,
                borderLeft: pos.bl ? '1px solid rgba(0,245,212,0.3)' : undefined,
                borderRight: pos.br ? '1px solid rgba(0,245,212,0.3)' : undefined,
              }}
            />
          ))}

          {/* Keyframe animations */}
          <style>{`
            @keyframes loadingPulseGlow {
              0% { opacity: 0.5; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1.08); }
            }
            @keyframes laserScan {
              0% { transform: translateY(-50%) scaleX(0.2); opacity: 0.2; }
              50% { transform: translateY(-50%) scaleX(1.4); opacity: 1; }
              100% { transform: translateY(-50%) scaleX(0.5); opacity: 0.3; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
