import { useEffect, useRef } from 'react';

export function Background3D() {
  const starsRef = useRef<{ x: number; y: number; size: number; opacity: number; delay: number; dur: number }[]>([]);

  if (starsRef.current.length === 0) {
    starsRef.current = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.05,
      delay: Math.random() * 6,
      dur: Math.random() * 5 + 4,
    }));
  }

  return (
    <div className="fixed inset-0 z-[-1] bg-[#0a0a0a] pointer-events-none overflow-hidden">
      {starsRef.current.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `starTwinkle ${star.dur}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: var(--op, 0.1); }
          50% { opacity: calc(var(--op, 0.1) * 3); }
        }
      `}</style>
    </div>
  );
}
