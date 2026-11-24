import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects.data";
import { ProjectArt } from "@/components/studio/ProjectArt";
import { Reveal } from "@/components/studio/Motion";
import NotFound from "./not-found";
const introductions: Record<string, string> = {
  "traffic-intersection":
    "An intersection is a concurrency problem. This simulation models how two controllers share updates, let emergency vehicles through first, and keep parking queues from blocking traffic.",
  "redline": "The circuit is a graph you can race through. The same route logic powers the strategy tools and the interactive Algorithm Lab.",
  "civicpulse": "When every report lands in the same inbox, urgent problems are easy to miss. CivicPulse helps operators sort incoming reports by what needs attention.",
  "cat-connect": "Shelters coordinate care across people and shifts. Cat Connect keeps each animal’s records and next steps in one place.",
  "worksync": "WorkSync brings office operations together. My contribution focused on how people sign in and how their activity is recorded.",
  "flake": "FLAKE brings common university tasks into a single portal, with dashboards shaped around what each campus role needs to do.",
  "tasbih-prestige": "Tasbih Prestige keeps counting simple and offers suggestions when users want help choosing what to recite.",
  "rahbar": "RAHBAR helps students trace answers back to the university’s actual policy text. It declines questions its source material cannot answer.",
  "sabaq-ai":
    "A useful study answer needs to match the student’s actual curriculum. Sabaq AI searches textbook and past-paper material, shows where an answer came from, and declines to guess when its sources do not support one.",
  studify:
    "Students already have the material they need, but finding the right explanation inside a pile of notes takes time. Studify turns those notes into a private, searchable study companion with cited answers and practice tools.",
  "fleetpulse-ai":
    "FleetPulse AI explores how changes in simulated engine sensor readings can help estimate how many operating cycles an engine has left. Its predictions and scheduling scenarios are for research and demonstration only.",
  eco28:
    "The Eco 28 studio site pairs architecture photography with a guided visual experience. A 3D-led opening leads into focused collections for interiors, materials, models, studio work, and project inquiries.",
  "disaster-management":
    "When information is scattered, coordination becomes the hardest problem. This project brings emergency tracking, resource allocation, and relief coordination into one full-stack system.",
  cdiem:
    "An investigation needs a clear record of what was collected, who handled it, and how each decision was made. CDIEM gives officers, forensic analysts, and supervisors a shared workflow for tracking cases and verifying evidence.",
  searoute:
    "A sea route is a graph problem. SeaRoute Navigator puts it on an interactive map so users can compare cost and travel time, build routes across multiple ports, and book cargo.",
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
            {project.github && (
              <div>
                <dt>EXPLORE THE CODE</dt>
                <dd>
                  <a href={project.github} target="_blank" rel="noreferrer">
                    GitHub repository <ArrowUpRight size={16} />
                  </a>
                </dd>
              </div>
            )}
            {project.demo && project.demo !== "#" && (
              <div>
                <dt>LIVE EXPERIENCE</dt>
                <dd>
                  <a href={project.demo} target="_blank" rel="noreferrer">
                    Open live project <ArrowUpRight size={16} />
                  </a>
                </dd>
              </div>
            )}
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
          NEXT IN THE COLLECTION / {String(((index + 1) % projects.length) + 1).padStart(2, "0")}
        </span>
        <Link href={`/work/${next.id}`}>
          {next.title}
          <ArrowUpRight strokeWidth={1} />
        </Link>
      </section>
    </>
  );
}
