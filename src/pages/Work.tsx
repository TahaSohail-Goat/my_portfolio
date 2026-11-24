import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projectCategories, projects } from "@/data/projects.data";
import { ProjectCard } from "@/components/studio/ProjectArt";
import { Reveal, useMotionSettings } from "@/components/studio/Motion";
import { ArrowLink } from "@/components/studio/Shell";
const filters = [
  { label: "All projects", matches: projects },
  ...projectCategories.map((category) => ({
    label: category,
    matches: projects.filter((project) => project.categories.includes(category)),
  })),
];

export default function Work() {
  const [activeFilter, setActiveFilter] = useState(0);
  const { enabled } = useMotionSettings();
  const filtered = filters[activeFilter].matches;
  return (
    <>
      <section className="page-header">
        <Reveal>
          <span className="eyebrow">THE COLLECTION / 2023 — TILL NOW</span>
          <div className="page-header-row">
            <h1>
              Ideas. Systems.
              <br />
              <em>Things that work.</em>
            </h1>
            <span className="page-header-note">
              {String(projects.length).padStart(2, "0")} ENGINEERING STUDIES
              <br />
              BUILT WITH CURIOSITY & INTENTION
            </span>
          </div>
          <p className="page-intro">
            A collection of problems explored, systems designed, and ideas
            brought to life. From full-stack applications to the fundamentals
            underneath.
          </p>
        </Reveal>
      </section>
      <div className="filter-bar" role="group" aria-label="Filter projects">
        {filters.map(({ label, matches }, i) => (
          <button
            key={label}
            type="button"
            className={`filter-button ${activeFilter === i ? "active" : ""}`}
            aria-pressed={activeFilter === i}
            onClick={() => setActiveFilter(i)}
          >
            {label}
            <small> {String(matches.length).padStart(2, "0")}</small>
          </button>
        ))}
      </div>
      <div className="work-index-grid" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout={enabled}
              initial={enabled ? { opacity: 0, y: 25 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProjectCard project={p} index={projects.indexOf(p)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <section className="work-end section-pad">
        <Reveal>
          <span className="eyebrow">WHAT COMES NEXT?</span>
          <h2>
            The next great idea
            <br />
            <em>could be yours.</em>
          </h2>
          <ArrowLink href="/contact">Let’s build something</ArrowLink>
        </Reveal>
      </section>
    </>
  );
}
