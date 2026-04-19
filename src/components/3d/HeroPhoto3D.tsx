import { useRef, useEffect } from 'react';

export function HeroPhoto3D() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -8;
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          width: 300,
          height: 400,
          border: '1px solid rgba(255,255,255,0.12)',
          transition: 'transform 0.15s ease',
          transformStyle: 'preserve-3d',
          boxShadow: '0 0 60px rgba(255,255,255,0.04), 0 30px 60px rgba(0,0,0,0.6)',
        }}
      >
        <img
          src="/taha-photo.jpeg"
          alt="Taha Sohail"
          className="w-full h-full object-cover object-top"
        />

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 40%, transparent 70%)',
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full bg-white"
              style={{ animation: 'statusBlink 2s ease-in-out infinite', boxShadow: '0 0 6px rgba(255,255,255,0.6)' }}
            />
            <span className="text-xs text-white/60 font-sans tracking-wider uppercase">Available for Freelance</span>
          </div>
        </div>
      </div>

      <div
        className="absolute -left-8 top-12 rounded-xl px-4 py-3 text-center"
        style={{
          background: 'rgba(10,10,10,0.9)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          animation: 'subtleFloat 4s ease-in-out infinite',
        }}
      >
        <div className="text-xl font-display font-bold text-white">1+</div>
        <div className="text-xs text-white/40 mt-0.5">Years Exp</div>
      </div>

      <div
        className="absolute -right-8 bottom-20 rounded-xl px-4 py-3 text-center"
        style={{
          background: 'rgba(10,10,10,0.9)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          animation: 'subtleFloat 5s ease-in-out infinite',
          animationDelay: '2s',
        }}
      >
        <div className="text-xl font-display font-bold text-white">99%</div>
        <div className="text-xs text-white/40 mt-0.5">Satisfaction</div>
      </div>

      <style>{`
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes statusBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
