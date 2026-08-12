import { LayoutGrid, Network } from 'lucide-react';

export type ViewMode = 'ecosystem' | 'graph';

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const handleKeyDown = (e: React.KeyboardEvent, targetView: ViewMode) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onViewChange(targetView);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onViewChange(currentView === 'ecosystem' ? 'graph' : 'ecosystem');
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Skills & Stack visualization options"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px',
        borderRadius: '10px',
        background: 'rgba(10, 12, 16, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Ecosystem Tab */}
      <button
        role="tab"
        id="tab-ecosystem"
        aria-selected={currentView === 'ecosystem'}
        aria-controls="panel-ecosystem"
        tabIndex={currentView === 'ecosystem' ? 0 : -1}
        onClick={() => onViewChange('ecosystem')}
        onKeyDown={e => handleKeyDown(e, 'ecosystem')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '6px 14px',
          borderRadius: '7px',
          border: '1px solid transparent',
          background:
            currentView === 'ecosystem'
              ? 'rgba(0, 245, 212, 0.12)'
              : 'transparent',
          borderColor:
            currentView === 'ecosystem'
              ? 'rgba(0, 245, 212, 0.35)'
              : 'transparent',
          color:
            currentView === 'ecosystem'
              ? '#ffffff'
              : 'rgba(255, 255, 255, 0.65)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: currentView === 'ecosystem' ? 600 : 400,
          letterSpacing: '0.04em',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow:
            currentView === 'ecosystem'
              ? '0 0 12px rgba(0, 245, 212, 0.2)'
              : 'none',
          outline: 'none',
        }}
        className="focus-visible:ring-1 focus-visible:ring-[var(--accent-neon)]"
      >
        <LayoutGrid
          style={{
            width: '13px',
            height: '13px',
            color:
              currentView === 'ecosystem'
                ? 'var(--accent-neon)'
                : 'rgba(255, 255, 255, 0.5)',
            transition: 'color 0.2s ease',
          }}
        />
        <span>Ecosystem</span>
      </button>

      {/* Graph Tab */}
      <button
        role="tab"
        id="tab-graph"
        aria-selected={currentView === 'graph'}
        aria-controls="panel-graph"
        tabIndex={currentView === 'graph' ? 0 : -1}
        onClick={() => onViewChange('graph')}
        onKeyDown={e => handleKeyDown(e, 'graph')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '6px 14px',
          borderRadius: '7px',
          border: '1px solid transparent',
          background:
            currentView === 'graph'
              ? 'rgba(0, 245, 212, 0.12)'
              : 'transparent',
          borderColor:
            currentView === 'graph'
              ? 'rgba(0, 245, 212, 0.35)'
              : 'transparent',
          color:
            currentView === 'graph'
              ? '#ffffff'
              : 'rgba(255, 255, 255, 0.65)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: currentView === 'graph' ? 600 : 400,
          letterSpacing: '0.04em',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow:
            currentView === 'graph'
              ? '0 0 12px rgba(0, 245, 212, 0.2)'
              : 'none',
          outline: 'none',
        }}
        className="focus-visible:ring-1 focus-visible:ring-[var(--accent-neon)]"
      >
        <Network
          style={{
            width: '13px',
            height: '13px',
            color:
              currentView === 'graph'
                ? 'var(--accent-neon)'
                : 'rgba(255, 255, 255, 0.5)',
            transition: 'color 0.2s ease',
          }}
        />
        <span>Graph</span>
      </button>
    </div>
  );
}
