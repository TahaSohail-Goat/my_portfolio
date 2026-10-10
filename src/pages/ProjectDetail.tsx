import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects.data";
import { ProjectArt } from "@/components/studio/ProjectArt";
import { Reveal } from "@/components/studio/Motion";
import NotFound from "./not-found";
const introductions: Record<string, string> = {
  "disaster-management":
    "When information is scattered, coordination becomes the hardest problem. This project brings emergency tracking, resource allocation, and relief coordination into one full-stack system.",
  cdiem:
    "Good architecture makes complexity manageable. CDIEM explores that idea through a modular desktop application, explicit layer boundaries, and design patterns with a purpose.",
  searoute:
    "A sea route is a graph problem hiding in plain sight. SeaRoute Navigator models ports and their connections, then finds an efficient path using Dijkstra’s algorithm.",
  "magical-pet":
    "A fantasy setting becomes a practical exploration of object-oriented programming. Distinct pet types share a common foundation while expressing their own behavior through polymorphism.",
};
export default function ProjectDetail({ id }: { id: string }) {
  const project = projects.find((p) => p.id === id);
  const index = projects.findIndex((p) => p.id === id);
  const next = projects[(index + 1) % projects.length];
  if (!project) return <NotFound />;
  return (
    <>
      <section className="page-header project-detail-hero">
        <Link href="/work" className="project-back">
          <ArrowLeft size={15} /> Back to the collection
        </Link>
        <Reveal>
          <h1>
            {project.title}
            <span className="detail-period">.</span>
          </h1>
          <dl className="project-meta">
            <div>
              <dt>DISCIPLINE</dt>
              <dd>{project.category}</dd>
            </div>
            <div>
              <dt>TECHNOLOGIES</dt>
              <dd>{project.technologies.join(" / ")}</dd>
            </div>
            <div>
              <dt>EXPLORE THE CODE</dt>
              <dd>
                <a href={project.github} target="_blank" rel="noreferrer">
                  GitHub repository <ArrowUpRight size={16} />
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>
      </section>
      <Reveal className="detail-art">
        <ProjectArt id={id} large />
      </Reveal>
      <section className="project-overview section-pad">
        <Reveal>
          <span className="eyebrow">01 / THE IDEA</span>
          <h2>
            A problem worth
            <br />
            <em>thinking about.</em>
          </h2>
        </Reveal>
        <Reveal>
          <p className="overview-copy">{introductions[id]}</p>
          <p className="project-original-description">{project.description}</p>
          <ul className="highlights">
            {project.highlights?.map((h, i) => (
              <li key={h}>
                <span>0{i + 1}</span>
                {h}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
      {project.architecture && (
        <section className="architecture-section section-pad">
          <Reveal>
            <span className="eyebrow">02 / UNDER THE SURFACE</span>
            <h2>
              Designed to <em>connect.</em>
            </h2>
          </Reveal>
          <div className="architecture-flow">
            {project.architecture.map((node, i) => (
              <Reveal
                key={node.id}
                className="architecture-node"
                delay={i * 0.1}
              >
                <span>
                  0{i + 1} / {node.id.toUpperCase()}
                </span>
                <h3>{node.label}</h3>
                <p>{node.description}</p>
                {i < project.architecture!.length - 1 && (
                  <ArrowRight size={28} />
                )}
              </Reveal>
            ))}
          </div>
        </section>
      )}
      {!project.architecture && (
        <section className="architecture-section section-pad">
          <Reveal>
            <span className="eyebrow">02 / THE FOUNDATION</span>
            <h2>
              Shared roots.
              <br />
              <em>Distinct behaviors.</em>
            </h2>
            <div className="oop-diagram">
              <div>
                Pet <small>Abstract foundation</small>
              </div>
              <span>↓</span>
              <div className="oop-branches">
                <div>Inheritance</div>
                <div>Polymorphism</div>
                <div>Encapsulation</div>
              </div>
              <p>
                A common class hierarchy with type-specific behavior, virtual
                functions, operator overloading, and protected internal state.
              </p>
            </div>
          </Reveal>
        </section>
      )}
      <section className="next-project">
        <span className="eyebrow">
          NEXT IN THE COLLECTION / 0{((index + 1) % projects.length) + 1}
        </span>
        <Link href={`/work/${next.id}`}>
          {next.title}
          <ArrowUpRight strokeWidth={1} />
        </Link>
      </section>
    </>
  );
}
