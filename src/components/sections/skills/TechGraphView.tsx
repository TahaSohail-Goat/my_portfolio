import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGraphData, SKILL_CATEGORIES, isSkillRelated } from './skills.data';
import { Filter, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

/* ─── Force Simulation Types ─────────────────────────────────── */
interface SimNode {
  id: string;
  name: string;
  categoryId: string;
  categoryLabel: string;
  color: string;
  description: string;
  connectionsCount: number;
  // Mutable physics state
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface SimLink {
  sourceId: string;
  targetId: string;
}

/* ─── Pure JS Force Simulation ───────────────────────────────── */
class ForceGraph {
  nodes: SimNode[] = [];
  links: SimLink[] = [];
  width = 800;
  height = 550;
  alpha = 1;
  alphaDecay = 0.03;
  alphaMin = 0.001;
  running = false;
  private rafId: number | null = null;
  private adjacency = new Map<string, Set<string>>();
  onTick: (() => void) | null = null;

  init(
    rawNodes: { id: string; name: string; categoryId: string; categoryLabel: string; color: string; description: string; connectionsCount: number }[],
    rawLinks: { source: string; target: string }[],
    width: number,
    height: number
  ) {
    this.width = width;
    this.height = height;
    this.alpha = 1;
    this.running = false;

    // Build adjacency for link force
    this.adjacency = new Map();
    for (const link of rawLinks) {
      if (!this.adjacency.has(link.source)) this.adjacency.set(link.source, new Set());
      if (!this.adjacency.has(link.target)) this.adjacency.set(link.target, new Set());
      this.adjacency.get(link.source)!.add(link.target);
      this.adjacency.get(link.target)!.add(link.source);
    }

    // Position nodes in a circle to start (avoids pile-up)
    const n = rawNodes.length;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.32;

    this.nodes = rawNodes.map((node, i) => {
      const angle = (2 * Math.PI * i) / n;
      return {
        ...node,
        x: cx + radius * Math.cos(angle) + (Math.random() - 0.5) * 30,
        y: cy + radius * Math.sin(angle) + (Math.random() - 0.5) * 30,
        vx: 0,
        vy: 0,
      };
    });

    this.links = rawLinks.map(l => ({ sourceId: l.source, targetId: l.target }));
  }

  private tick() {
    const alpha = this.alpha;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const nodeMap = new Map(this.nodes.map(n => [n.id, n]));

    // ── 1. Center Gravity Force ─────────────────────────────────
    const gravityStrength = 0.06 * alpha;
    for (const node of this.nodes) {
      node.vx += (cx - node.x) * gravityStrength;
      node.vy += (cy - node.y) * gravityStrength;
    }

    // ── 2. Link Attraction (spring) ──────────────────────────────
    const linkStrength = 0.3 * alpha;
    const targetDist = 110;
    for (const link of this.links) {
      const src = nodeMap.get(link.sourceId);
      const tgt = nodeMap.get(link.targetId);
      if (!src || !tgt) continue;
      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = ((dist - targetDist) / dist) * linkStrength;
      src.vx += dx * force;
      src.vy += dy * force;
      tgt.vx -= dx * force;
      tgt.vy -= dy * force;
    }

    // ── 3. Charge Repulsion (Barnes-Hut simplified O(n²)) ────────
    const repulsionStrength = 2200 * alpha;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i];
        const b = this.nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist2 = dx * dx + dy * dy || 1;
        const dist = Math.sqrt(dist2);
        const force = repulsionStrength / dist2;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }

    // ── 4. Integrate Velocities ──────────────────────────────────
    const friction = 0.78;
    const padding = 32;
    for (const node of this.nodes) {
      node.vx *= friction;
      node.vy *= friction;
      node.x += node.vx;
      node.y += node.vy;
      // Boundary clamp
      node.x = Math.max(padding, Math.min(this.width - padding, node.x));
      node.y = Math.max(padding, Math.min(this.height - padding, node.y));
    }

    this.alpha *= (1 - this.alphaDecay);
    this.onTick?.();
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      if (this.alpha < this.alphaMin) {
        this.running = false;
        this.onTick?.(); // Final render
        return;
      }
      this.tick();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  reheat(newAlpha = 0.5) {
    this.alpha = newAlpha;
    if (!this.running) this.start();
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

/* ─── Graph Props ────────────────────────────────────────────── */
interface TechGraphViewProps {
  selectedSkillName: string | null;
  onSelectSkill: (name: string) => void;
  hoveredSkillName: string | null;
  onHoverSkill: (name: string | null) => void;
}

export function TechGraphView({
  selectedSkillName,
  onSelectSkill,
  hoveredSkillName,
  onHoverSkill,
}: TechGraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<ForceGraph>(new ForceGraph());
  const nodesRef = useRef<SimNode[]>([]);
  const rawData = useMemo(() => getGraphData(), []);

  const [dimensions, setDimensions] = useState({ width: 800, height: 530 });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const [renderTick, setRenderTick] = useState(0); // triggers re-render on tick
  const [isDragging, setIsDragging] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ lastX: number; lastY: number; panning: boolean } | null>(null);

  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // Active skill: hovered or selected
  const activeSkillName = hoveredSkillName || selectedSkillName;

  // ── Observe container resize ───────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      for (const e of entries) {
        const w = e.contentRect.width;
        const h = Math.max(460, Math.min(620, w * 0.62));
        setDimensions({ width: w, height: h });
      }
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Initialize simulation when dimensions change ───────────────
  useEffect(() => {
    const sim = simRef.current;
    sim.stop();

    sim.init(rawData.nodes, rawData.links, dimensions.width, dimensions.height);
    nodesRef.current = sim.nodes;

    sim.onTick = () => {
      setRenderTick(t => t + 1);
    };

    if (!prefersReducedMotion) {
      sim.start();
    } else {
      // Settle instantly without animation
      sim.alpha = 0.001;
      for (let i = 0; i < 200; i++) (sim as unknown as { tick: () => void }).tick?.();
      setRenderTick(t => t + 1);
    }

    return () => sim.stop();
  }, [dimensions, rawData, prefersReducedMotion]);

  // ── Canvas Drawing ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const nodes = nodesRef.current;
    const { width, height } = dimensions;
    const dpr = Math.max(window.devicePixelRatio || 1, 1);

    // Only resize backing store when dimensions actually change
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    // Reset transform, scale for DPR — do this every frame
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, width, height);

    // Apply pan + zoom
    ctx.save();
    // Sub-pixel hint: translate by 0.5 for crisp 1px lines on non-retina
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    const links = simRef.current.links;
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    // ── Draw Links ────────────────────────────────────────────────
    for (const link of links) {
      const src = nodeMap.get(link.sourceId);
      const tgt = nodeMap.get(link.targetId);
      if (!src || !tgt) continue;

      const isConnectedToActive =
        activeSkillName !== null &&
        (link.sourceId === activeSkillName || link.targetId === activeSkillName);

      const matchFilter =
        selectedCategory === 'all' ||
        src.categoryId === selectedCategory ||
        tgt.categoryId === selectedCategory;

      ctx.beginPath();
      ctx.moveTo(Math.round(src.x) + 0.5, Math.round(src.y) + 0.5);
      ctx.lineTo(Math.round(tgt.x) + 0.5, Math.round(tgt.y) + 0.5);
      ctx.setLineDash([]);

      if (activeSkillName !== null) {
        if (isConnectedToActive) {
          ctx.strokeStyle = 'rgba(0,245,212,0.85)';
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = 'rgba(255,255,255,0.05)';
          ctx.lineWidth = 0.8;
          ctx.setLineDash([]);
        }
      } else if (matchFilter) {
        // Normal connection — solid, clearly visible
        ctx.strokeStyle = 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 1;
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 0.6;
        ctx.setLineDash([]);
      }

      ctx.stroke();
      ctx.setLineDash([]);
    }

    // ── Draw Nodes ────────────────────────────────────────────────
    const nodeRadius = 20;
    for (const node of nodes) {
      const isActive = activeSkillName === node.id;
      const isRelated = isSkillRelated(node.id, activeSkillName);
      const matchFilter = selectedCategory === 'all' || node.categoryId === selectedCategory;

      let opacity = matchFilter ? 1 : 0.2;
      if (activeSkillName !== null && !isActive && !isRelated) {
        opacity = matchFilter ? 0.2 : 0.08;
      }

      ctx.globalAlpha = opacity;

      // Outer glow ring for active/related
      if (isActive) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius + 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0,245,212,0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner glow
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeRadius + 14);
        grad.addColorStop(0, 'rgba(0,245,212,0.18)');
        grad.addColorStop(1, 'rgba(0,245,212,0)');
        ctx.fillStyle = grad;
        ctx.fill();
      } else if (isRelated) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = `${node.color}66`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Node background circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      if (isActive) {
        ctx.fillStyle = 'rgba(0,245,212,0.18)';
      } else if (isRelated) {
        ctx.fillStyle = `${node.color}18`;
      } else {
        ctx.fillStyle = 'rgba(12,16,24,0.92)';
      }
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      // Use explicit hex — canvas ctx can't resolve CSS custom properties
      ctx.strokeStyle = isActive ? '#00f5d4' : isRelated ? node.color : 'rgba(255,255,255,0.28)';
      ctx.lineWidth = isActive ? 2.5 : 1.5;
      ctx.stroke();

      // Node label text — use a fallback font stack for best clarity
      ctx.font = `${isActive ? '600' : '400'} ${isActive ? '11px' : '10px'} ui-monospace, 'JetBrains Mono', 'Fira Code', monospace`;
      ctx.fillStyle = isActive ? '#00f5d4' : isRelated ? '#ffffff' : 'rgba(255,255,255,0.85)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(node.name, node.x, node.y + nodeRadius + 5);

      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }, [renderTick, activeSkillName, selectedCategory, zoom, pan, dimensions]);

  // ── Hit-test helper: find node at canvas coords ───────────────
  const getNodeAtPoint = useCallback(
    (cx: number, cy: number): SimNode | null => {
      const nodes = nodesRef.current;
      // Invert pan + zoom transform
      const wx = (cx - pan.x) / zoom;
      const wy = (cy - pan.y) / zoom;
      const radius = 18;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const dx = wx - n.x;
        const dy = wy - n.y;
        if (dx * dx + dy * dy <= (radius + 8) * (radius + 8)) {
          return n;
        }
      }
      return null;
    },
    [pan, zoom]
  );

  // ── Mouse/Touch Events ────────────────────────────────────────
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      if (dragState.current?.panning) {
        const dx = e.clientX - dragState.current.lastX;
        const dy = e.clientY - dragState.current.lastY;
        dragState.current.lastX = e.clientX;
        dragState.current.lastY = e.clientY;
        setPan(p => ({ x: p.x + dx, y: p.y + dy }));
        return;
      }

      const hit = getNodeAtPoint(cx, cy);
      setHoveredNode(hit);
      onHoverSkill(hit ? hit.id : null);
    },
    [getNodeAtPoint, onHoverSkill]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const hit = getNodeAtPoint(cx, cy);
    if (hit) return; // Let click handle node hits
    // Start panning
    dragState.current = { lastX: e.clientX, lastY: e.clientY, panning: true };
    setIsDragging(true);
  }, [getNodeAtPoint]);

  const handlePointerUp = useCallback(() => {
    dragState.current = null;
    setIsDragging(false);
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const hit = getNodeAtPoint(cx, cy);
      if (hit) {
        onSelectSkill(hit.id === selectedSkillName ? '' : hit.id);
      } else {
        onSelectSkill('');
      }
    },
    [getNodeAtPoint, onSelectSkill, selectedSkillName]
  );

  // ── Category filters ─────────────────────────────────────────
  const categoryFilters = [
    { id: 'all', label: 'ALL', color: 'var(--accent-neon)' },
    ...SKILL_CATEGORIES.map(c => ({ id: c.id, label: c.label.toUpperCase(), color: c.color })),
  ];

  return (
    <div className="w-full flex flex-col gap-4">

      {/* ── Filter & Control Bar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
          <Filter className="w-3.5 h-3.5 text-white/40 ml-1 mr-1 shrink-0" />
          <div className="flex items-center gap-1.5 flex-nowrap">
            {categoryFilters.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '5px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9.5px',
                    fontWeight: isSelected ? 600 : 400,
                    letterSpacing: '0.06em',
                    color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.55)',
                    background: isSelected ? `${cat.color}22` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? cat.color : 'rgba(255,255,255,0.07)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.15, 1.8))}
            title="Zoom in"
            className="p-1.5 rounded-lg border border-white/10 bg-white/4 hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.15, 0.5))}
            title="Zoom out"
            className="p-1.5 rounded-lg border border-white/10 bg-white/4 hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
              simRef.current.reheat(0.5);
            }}
            title="Reset graph layout"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/4 hover:bg-white/10 text-white/60 hover:text-white transition-all font-mono text-[9.5px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* ── Canvas Graph Container ─── */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: `${dimensions.height}px`,
          position: 'relative',
          borderRadius: '16px',
          background: 'radial-gradient(ellipse at 40% 50%, rgba(10,16,28,0.97) 0%, rgba(5,8,12,0.99) 100%)',
          border: '1px solid rgba(0, 245, 212, 0.14)',
          boxShadow: 'inset 0 0 48px rgba(0,0,0,0.9), 0 12px 36px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Background dot grid */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.2,
            backgroundImage: 'radial-gradient(circle, rgba(0,245,212,0.3) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            pointerEvents: 'none',
          }}
        />

        {/* Main Canvas — no width/height JSX attrs; useEffect owns the canvas pixel size */}
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            handlePointerUp();
            setHoveredNode(null);
            onHoverSkill(null);
          }}
          onClick={handleCanvasClick}
          style={{
            display: 'block',
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            cursor: isDragging ? 'grabbing' : hoveredNode ? 'pointer' : 'grab',
            borderRadius: '16px',
            imageRendering: 'crisp-edges',
          }}
        />

        {/* ── Hover Tooltip (top-right card) ─── */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              key={hoveredNode.id}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                maxWidth: '260px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(7, 10, 15, 0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(0, 245, 212, 0.28)',
                boxShadow: '0 8px 28px rgba(0,0,0,0.7), 0 0 20px rgba(0,245,212,0.1)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-sm text-white">{hoveredNode.name}</span>
                  <span
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded uppercase"
                    style={{ background: `${hoveredNode.color}20`, color: hoveredNode.color }}
                  >
                    {hoveredNode.categoryLabel}
                  </span>
                </div>
                <p className="font-sans text-[11.5px] text-white/72 leading-relaxed font-light">
                  {hoveredNode.description}
                </p>
                <div className="font-mono text-[9.5px] mt-0.5" style={{ color: 'var(--accent-neon)', opacity: 0.8 }}>
                  {hoveredNode.connectionsCount} connections
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend: instructions */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '9.5px',
            color: 'rgba(255,255,255,0.35)',
            pointerEvents: 'none',
            display: 'flex',
            gap: '14px',
          }}
        >
          <span>◉ Click to select</span>
          <span className="hidden sm:inline">⊞ Drag to pan</span>
          <span className="hidden md:inline">↕ Zoom +/−</span>
        </div>
      </div>
    </div>
  );
}
