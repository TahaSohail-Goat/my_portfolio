import { useId } from "react";
import { Link } from "wouter";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects.data";
import { useMotionSettings } from "./Motion";
export function ProjectArt({
  id,
  large = false,
}: {
  id: string;
  large?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  return (
    <div
      className={`project-art art-${id} ${large ? "art-large" : ""}`}
      aria-hidden="true"
    >
      <div className="art-grid" />
      {id === "disaster-management" && (
        <>
          <div className="radar">
            <i />
            <i />
            <i />
            <i />
            <div className="radar-sweep" />
            <b className="radar-dot dot-a" />
            <b className="radar-dot dot-b" />
            <b className="radar-dot dot-c" />
            <div className="radar-cross" />
          </div>
          <div className="art-caption">
            RESPONSE / COORDINATION
            <br />
            <span>Connected when it matters.</span>
          </div>
          <span className="art-coordinate">
            30.3753° N<br />
            69.3451° E
          </span>
        </>
      )}
      {id === "cdiem" && (
        <>
          <div className="architecture-blocks">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`architecture-block block-${i}`}>
                <span>{["PRESENTATION", "DOMAIN", "PERSISTENCE"][i]}</span>
                <b>{["UI", "LOGIC", "DATA"][i]}</b>
                <i />
              </div>
            ))}
          </div>
          <div className="art-caption">
            FORM FOLLOWS SYSTEM
            <br />
            <span>A study in architecture.</span>
          </div>
        </>
      )}
      {id === "searoute" && (
        <>
          <svg className="sea-map" viewBox="0 0 700 440">
            <defs>
              <linearGradient id={uid}>
                <stop stopColor="#a6c9ca" />
                <stop offset="1" stopColor="#326773" />
              </linearGradient>
            </defs>
            {Array.from({ length: 12 }, (_, i) => (
              <path
                key={i}
                d={`M-50 ${i * 40} C180 ${i * 40 - 100}, 290 ${i * 40 + 150}, 750 ${i * 40 - 50}`}
                fill="none"
                stroke={`url(#${uid})`}
                strokeWidth="1"
                opacity=".3"
              />
            ))}
            <path
              className="route-path"
              d="M100 300 L225 160 L360 240 L510 110 L610 180"
              fill="none"
              stroke="#f1e8d7"
              strokeWidth="3"
              strokeDasharray="8 6"
            />
            {[
              [100, 300],
              [225, 160],
              [360, 240],
              [510, 110],
              [610, 180],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="7" fill="#f1e8d7" />
                <circle
                  cx={x}
                  cy={y}
                  r="17"
                  stroke="#f1e8d7"
                  fill="none"
                  opacity=".3"
                />
                <text
                  x={x + 15}
                  y={y - 20}
                  fill="#f1e8d7"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  PORT 0{i + 1}
                </text>
              </g>
            ))}
          </svg>
          <div className="art-caption">
            FIND A BETTER WAY
            <br />
            <span>From complexity to the shortest path.</span>
          </div>
        </>
      )}
      {id === "magical-pet" && (
        <>
          <div className="pet-orbits">
            <i />
            <i />
            <i />
            <div className="pet-gem">✦</div>
            <span>INHERIT</span>
            <span>EVOLVE</span>
            <span>OVERRIDE</span>
          </div>
          <div className="art-caption">
            A KINGDOM OF POSSIBILITIES
            <br />
            <span>One hierarchy. Many personalities.</span>
          </div>
        </>
      )}
      <span className="art-marker">TS / ENGINEERING STUDIES</span>
    </div>
  );
}
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const { enabled } = useMotionSettings();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), {
      stiffness: 140,
      damping: 25,
    }),
    rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
      stiffness: 140,
      damping: 25,
    });
  return (
    <div
      className="project-card"
      onPointerMove={(e) => {
        if (!enabled || e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <Link href={`/work/${project.id}`} className="project-card-link">
        <motion.div
          className="project-art-frame"
          style={enabled ? { rotateX, rotateY, transformPerspective: 900 } : {}}
        >
          <ProjectArt id={project.id} />
          <span className="card-open">
            <ArrowUpRight size={23} />
          </span>
        </motion.div>
        <div className="project-card-info">
          <span className="project-number">0{index + 1}</span>
          <div>
            <h3>{project.title}</h3>
            <p>{project.category}</p>
          </div>
          <ArrowUpRight size={23} />
        </div>
        <div className="project-tech">
          {project.technologies.slice(0, 3).join(" / ")}
        </div>
      </Link>
    </div>
  );
}
