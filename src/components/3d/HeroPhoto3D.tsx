export function HeroPhoto3D() {
  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Accent glow behind the photo */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-20px',
          borderRadius: '24px',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0,245,212,0.1) 0%, transparent 70%)',
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }}
      />

      {/* Photo card — fixed at one place */}
      <div
        style={{
          width: 300,
          height: 400,
          borderRadius: '20px',
          border: '1px solid rgba(0,245,212,0.25)',
          boxShadow: '0 0 60px rgba(0,245,212,0.12), 0 0 0 1px rgba(255,255,255,0.05), 0 30px 60px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}taha-photo.png`}
          alt="Taha Sohail - Software Engineer"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
          loading="eager"
        />

        {/* Bottom gradient */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.3) 50%, transparent 100%)',
          }}
        />

        {/* Status badge */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
          <div className="flex items-center gap-2">
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--accent-neon)',
                boxShadow: '0 0 8px var(--accent-neon)',
                animation: 'heroBlink 2.5s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.09em',
                color: 'rgba(255,255,255,0.55)',
                textTransform: 'uppercase',
              }}
            >
              Available for Freelance
            </span>
          </div>
        </div>

        {/* Accent border shimmer overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '18px',
            border: '1px solid rgba(0,245,212,0.08)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Floating tech badge — top left */}
      <div
        style={{
          position: 'absolute',
          left: '-50px',
          top: '36px',
          borderRadius: '12px',
          padding: '10px 14px',
          background: 'rgba(8,8,8,0.92)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          textAlign: 'center',
          minWidth: '70px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1,
          }}
        >
          4+
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'rgba(255,255,255,0.35)',
            marginTop: '3px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Projects
        </div>
      </div>

      {/* Floating tech badge — bottom right */}
      <div
        style={{
          position: 'absolute',
          right: '-45px',
          bottom: '70px',
          borderRadius: '12px',
          padding: '10px 14px',
          background: 'rgba(8,8,8,0.92)',
          border: '1px solid rgba(0,245,212,0.15)',
          backdropFilter: 'blur(12px)',
          textAlign: 'center',
          minWidth: '70px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--accent-neon)',
            lineHeight: 1,
          }}
        >
          1+
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'rgba(255,255,255,0.35)',
            marginTop: '3px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Yrs Exp
        </div>
      </div>
    </div>
  );
}
