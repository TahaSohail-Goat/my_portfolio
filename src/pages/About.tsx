import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import {
  SKILL_CATEGORIES,
  type Skill,
} from "@/components/sections/skills/skills.data";
import { timelineItems } from "@/data/experience.data";
import { Reveal, useMotionSettings } from "@/components/studio/Motion";
import { ArrowLink } from "@/components/studio/Shell";
const principles = [
  {
    title: "Architecture first.",
    text: "Design the system structure before writing a line of code. The right architecture eliminates unnecessary complexity later.",
  },
  {
    title: "Clean interfaces.",
    text: "Well-defined boundaries between modules, layers, and APIs make systems maintainable. SOLID principles and design patterns where they improve the design.",
  },
  {
    title: "Performance as product.",
    text: "Efficient algorithms and optimized data structures are product decisions. Strong fundamentals translate into better software.",
  },
  {
    title: "Iterative delivery.",
    text: "Ship working software incrementally. Refine with feedback. Clear deliverables and consistent communication throughout the build.",
  },
];
function Toolkit() {
  const [category, setCategory] = useState(0),
    [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Skill>(
    SKILL_CATEGORIES[0].skills[0],
  );
  const all = SKILL_CATEGORIES.flatMap((c) => c.skills);
  const skills = query
    ? all.filter((s) =>
        `${s.name} ${s.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
    : SKILL_CATEGORIES[category].skills;
  function selectRelated(name: string) {
    const cat = SKILL_CATEGORIES.findIndex((c) =>
      c.skills.some((s) => s.name === name),
    );
    const skill = all.find((s) => s.name === name);
    if (skill) {
      setCategory(cat);
      setSelected(skill);
      setQuery("");
    }
  }
  return (
    <section className="toolkit section-pad" id="toolkit">
      <Reveal>
        <span className="eyebrow">02 / AN INTERCONNECTED TOOLKIT</span>
        <h2>
          Different tools.
          <br />
          <em>One curious mind.</em>
        </h2>
        <p className="toolkit-intro">
          Choose a technology to explore how I use it, and what it connects to.
        </p>
      </Reveal>
      <div className="toolkit-layout">
        <div className="toolkit-browser">
          <div
            className="skill-categories"
            role="group"
            aria-label="Skill categories"
          >
            {SKILL_CATEGORIES.map((c, i) => (
              <button
                key={c.id}
                className={i === category && !query ? "active" : ""}
                aria-pressed={i === category && !query}
                onClick={() => {
                  setCategory(i);
                  setQuery("");
                  setSelected(c.skills[0]);
                }}
              >
                {c.label}
                <small>{String(c.skills.length).padStart(2, "0")}</small>
              </button>
            ))}
          </div>
          <label className="skill-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="Find a technology…"
              aria-label="Search skills"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="skill-grid" aria-label="Technologies">
            {skills.map((s) => (
              <button
                key={s.id}
                aria-pressed={selected.id === s.id}
                className={`skill-tile ${selected.id === s.id ? "active" : ""}`}
                onClick={() => setSelected(s)}
              >
                <s.icon className="skill-icon" />
                <span>{s.name}</span>
                <ArrowUpRight size={12} />
              </button>
            ))}
          </div>
          {!skills.length && (
            <p className="empty-skills" role="status">
              No matches. Try a language, framework, or concept.
            </p>
          )}
        </div>
        <div className="skill-detail" aria-live="polite">
          <span className="eyebrow">IN FOCUS</span>
          <selected.icon className="detail-skill-icon" />
          <h3>{selected.name}</h3>
          <p>{selected.description}</p>
          <div className="skill-related">
            <span className="eyebrow">CONNECTED TO</span>
            {selected.related.map((r) =>
              all.some((s) => s.name === r) ? (
                <button key={r} onClick={() => selectRelated(r)}>
                  {r}
                  <ArrowUpRight size={11} />
                </button>
              ) : (
                <span key={r} className="related-label">
                  {r}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled } = useMotionSettings();
  const [location] = useLocation();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  useEffect(() => {
    if (window.location.hash === "#toolkit")
      document
        .getElementById("toolkit")
        ?.scrollIntoView({ behavior: "instant" });
  }, [location]);
  return (
    <>
      <section className="page-header profile-header">
        <Reveal>
          <span className="eyebrow">THE PERSON BEHIND THE PIXELS</span>
          <h1>
            Serious about code.
            <br />
            <em>Curious about everything.</em>
          </h1>
        </Reveal>
      </section>
      <section className="profile-story section-pad">
        <div className="profile-portrait" ref={ref}>
          <motion.img
            src="/taha-photo.png"
            alt="Taha Sohail wearing a black suit"
            width="1254"
            height="1254"
            style={enabled ? { y } : {}}
          />
          <span className="portrait-caption">TAHA SOHAIL / PAKISTAN</span>
          <span className="portrait-star">✳</span>
        </div>
        <Reveal className="profile-biography">
          <span className="eyebrow">01 / A LITTLE CONTEXT</span>
          <h2>
            Hi, I’m Taha.
            <br />
            <em>I build things.</em>
          </h2>
          <p>
            I’m a Software Engineering student at FAST-NUCES, Pakistan, with a
            strong foundation in C++, Python, and full-stack web development.
          </p>
          <p>
            I approach every project, whether a university assignment, a custom
            tool, or a production website, with deliberate design, clean code,
            and delivery that doesn’t stop until the result is right.
          </p>
          <div className="profile-facts">
            <div>
              <span>BASED IN</span>
              <p>Pakistan</p>
            </div>
            <div>
              <span>STUDYING</span>
              <p>BS Software Engineering</p>
            </div>
            <div>
              <span>AT</span>
              <p>FAST-NUCES</p>
            </div>
            <div>
              <span>FOCUS</span>
              <p>Systems + full stack</p>
            </div>
          </div>
          <ArrowLink href="/resume">Explore my résumé</ArrowLink>
        </Reveal>
      </section>
      <section className="principles section-pad">
        <Reveal>
          <span className="eyebrow">HOW I THINK</span>
          <h2>
            Principles before <em>pixels.</em>
          </h2>
        </Reveal>
        <div className="principle-grid">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <span>0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <Toolkit />
      <section className="journey section-pad">
        <Reveal>
          <span className="eyebrow">03 / STILL MOVING FORWARD</span>
          <h2>
            A work <em>in progress.</em>
          </h2>
        </Reveal>
        <div className="journey-timeline">
          {[...timelineItems].reverse().map((t, i) => (
            <Reveal key={t.id} className="journey-item" delay={i * 0.03}>
              <span className="journey-date">{t.date}</span>
              <div>
                <span className="eyebrow">
                  {t.type === "education" ? "EDUCATION" : "PROJECT"} /{" "}
                  {t.organization}
                </span>
                <h3>{t.title}</h3>
                <p>{t.description}</p>
                <div className="journey-tags">
                  {t.technologies?.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Link href="/contact" className="text-link">
          Let’s see what we can build together <ArrowUpRight size={16} />
        </Link>
      </section>
    </>
  );
}
