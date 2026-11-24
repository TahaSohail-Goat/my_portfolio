import { Link } from "wouter";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects.data";
import { useMotionSettings } from "./Motion";

const photoCaptions: Partial<Record<string, string>> = {
  "traffic-intersection": "Coordinating traffic, priority, and parking.",
  "redline": "Racing strategy on a live graph.",
  "civicpulse": "Getting urgent civic issues seen sooner.",
  "cat-connect": "Connecting shelter teams with the cats in their care.",
  "tasbih-prestige": "A simple digital tasbih.",
  "sabaq-ai": "Answers rooted in your own syllabus.",
  studify: "Study from your own notes.",
  "fleetpulse-ai": "Estimating how many cycles a simulated engine has left.",
  eco28: "A client website for residential architecture.",
  "disaster-management": "Coordinating emergency response and relief.",
  cdiem: "From evidence intake to case closure.",
  searoute: "Finding the shortest route between ports.",
  "magical-pet": "Different creatures, each with their own behavior.",
};

export function ProjectArt({
  id,
  large = false,
}: {
  id: string;
  large?: boolean;
}) {
  const photoCaption = photoCaptions[id];
  return (
    <div
      className={`project-art art-${id} ${photoCaption ? "art-photo" : ""} ${large ? "art-large" : ""}`}
      aria-hidden="true"
    >
      {photoCaption && (
        <div className="art-caption">
          <span>{photoCaption}</span>
        </div>
      )}
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
          <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
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
