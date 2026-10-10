import { Download, Printer, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { projects } from "@/data/projects.data";
import { timelineItems } from "@/data/experience.data";
import { SKILL_CATEGORIES } from "@/components/sections/skills/skills.data";
import { Reveal } from "@/components/studio/Motion";
export default function Resume() {
  const education = timelineItems.find((t) => t.type === "education")!;
  return (
    <div className="resume-page">
      <section className="page-header resume-header">
        <Reveal>
          <span className="eyebrow">THE PRACTICAL DETAILS</span>
          <div className="page-header-row">
            <h1>
              The <em>résumé.</em>
            </h1>
            <div className="resume-actions">
              <a href="/Resume.pdf" download="Taha-Sohail-Resume.pdf">
                <Download size={15} />
                Download PDF
              </a>
              <button onClick={() => window.print()}>
                <Printer size={15} />
                Print this page
              </button>
            </div>
          </div>
        </Reveal>
      </section>
      <article className="resume-sheet">
        <header className="resume-identity">
          <div>
            <h2>
              Taha Sohail<span>✳</span>
            </h2>
            <p>Software Engineer · Full-Stack Developer · C++ Specialist</p>
          </div>
          <div className="resume-contact">
            <a href="mailto:tahaxsohail@gmail.com">tahaxsohail@gmail.com</a>
            <a href="mailto:tahasohail85@gmail.com">
              tahasohail85@gmail.com <small>(contact)</small>
            </a>
            <span>Pakistan</span>
            <a
              href="https://github.com/TahaSohail-Goat"
              target="_blank"
              rel="noreferrer"
            >
              GitHub / TahaSohail-Goat ↗
            </a>
            <a
              href="https://www.linkedin.com/in/taha-sohail-7b03b8320/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn / Taha Sohail ↗
            </a>
          </div>
        </header>
        <div className="resume-content">
          <div>
            <section>
              <h3>Profile</h3>
              <p>
                Software Engineering student at FAST-NUCES with a strong
                foundation in C++, Python, and full-stack web development.
                Passionate about efficient algorithms, clean architecture, and
                production-ready applications. Experienced across low-level
                systems programming and React and Node.js web applications.
              </p>
            </section>
            <section>
              <h3>Education</h3>
              <div className="resume-entry">
                <span>{education.date}</span>
                <h4>Bachelor of Science in Software Engineering</h4>
                <p className="resume-org">
                  FAST National University of Computer and Emerging Sciences,
                  Pakistan
                </p>
                <p>{education.description}</p>
              </div>
            </section>
            <section>
              <h3>Selected projects</h3>
              {projects.map((p) => (
                <div className="resume-entry" key={p.id}>
                  <span>
                    {p.id === "disaster-management" || p.id === "cdiem"
                      ? "2024"
                      : "2023"}{" "}
                    / Academic project
                  </span>
                  <h4>
                    <Link href={`/work/${p.id}`}>
                      {p.title}
                      <ArrowUpRight size={14} />
                    </Link>
                  </h4>
                  <p>{p.description}</p>
                  <ul>
                    {p.highlights?.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <div className="resume-tags">
                    {p.technologies.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </div>
          <aside>
            <section>
              <h3>Technical toolkit</h3>
              {SKILL_CATEGORIES.map((c) => (
                <div className="resume-skill-group" key={c.id}>
                  <h4>{c.label}</h4>
                  <p>{c.skills.map((s) => s.name).join(" · ")}</p>
                </div>
              ))}
            </section>
            <section>
              <h3>Engineering principles</h3>
              <p>
                Architecture first
                <br />
                Clean interfaces
                <br />
                Performance as product
                <br />
                Iterative delivery
              </p>
            </section>
            <section>
              <h3>Availability</h3>
              <p>Open to projects, freelance work, and collaborations.</p>
              <Link href="/contact" className="text-link">
                Get in touch
                <ArrowUpRight size={13} />
              </Link>
            </section>
          </aside>
        </div>
      </article>
    </div>
  );
}
