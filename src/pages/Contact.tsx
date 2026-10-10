import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { Reveal } from "@/components/studio/Motion";
const email = "tahasohail85@gmail.com";
const services = [
  "Web development",
  "MERN stack",
  "C++ programming",
  "Python & ML",
  "Responsive UI / UX",
];
export default function Contact() {
  const [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState(false),
    [interest, setInterest] = useState(services[0]),
    [draft, setDraft] = useState<{
      href: string;
      name: string;
      body: string;
    } | null>(null),
    [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Karachi",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 3000);
    return () => clearTimeout(timer);
  }, [copied]);
  function prepareDraft(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name")).trim(),
      reply = String(data.get("email")).trim(),
      message = String(data.get("message")).trim();
    const body = `Hi Taha,\n\n${message}\n\nInterested in: ${interest}\n\n${name}\n${reply}`;
    setDraft({
      name,
      body,
      href: `mailto:${email}?subject=${encodeURIComponent(`${interest} — a conversation with ${name}`)}&body=${encodeURIComponent(body)}`,
    });
  }
  return (
    <>
      <section className="page-header contact-header">
        <Reveal>
          <span className="eyebrow">GOOD THINGS START WITH A CONVERSATION</span>
          <div className="page-header-row">
            <h1>
              Your idea.
              <br />
              <em>Our next chapter.</em>
            </h1>
            <span className="page-header-note">
              PAKISTAN / {time} PKT
              <br />
              OPEN TO COLLABORATIONS
            </span>
          </div>
        </Reveal>
      </section>
      <section className="contact-layout section-pad">
        <Reveal className="contact-information">
          <span className="eyebrow">01 / SAY HELLO</span>
          <h2>
            A question, a project,
            <br />
            <em>or just a hello.</em>
          </h2>
          <p>
            I work across systems programming, full-stack development, and
            Python. Tell me what you have in mind, and let’s figure out the next
            step.
          </p>
          <div className="contact-email-row">
            <a href={`mailto:${email}`}>
              {email}
              <ArrowUpRight size={18} />
            </a>
            <button onClick={copyEmail} aria-label="Copy email address">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <span className="copy-status" role="status">
            {copied
              ? "Email copied."
              : copyError
                ? `Copy this address: ${email}`
                : ""}
          </span>
          <div className="contact-direct">
            <a href="tel:+923328885770">
              <span>PHONE</span>+92 332 8885770
              <ArrowUpRight size={16} />
            </a>
            <a
              href="https://github.com/TahaSohail-Goat"
              target="_blank"
              rel="noreferrer"
            >
              <span>GITHUB</span>TahaSohail-Goat
              <ArrowUpRight size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/taha-sohail-7b03b8320/"
              target="_blank"
              rel="noreferrer"
            >
              <span>LINKEDIN</span>Taha Sohail
              <ArrowUpRight size={16} />
            </a>
          </div>
          <span className="contact-availability">
            <i className="status-dot" />
            Based in Pakistan. Open to working worldwide.
          </span>
        </Reveal>
        <Reveal className="contact-form-wrap" delay={0.1}>
          <span className="eyebrow">02 / TELL ME A LITTLE MORE</span>
          <form onSubmit={prepareDraft} onChange={() => setDraft(null)}>
            <div className="form-row">
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="How should I call you?"
                  required
                  maxLength={100}
                />
              </label>
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  maxLength={150}
                />
              </label>
            </div>
            <fieldset className="interest-options">
              <legend>What are you thinking about?</legend>
              {services.map((s) => (
                <label key={s} className={interest === s ? "active" : ""}>
                  <input
                    type="radio"
                    name="interest"
                    value={s}
                    checked={interest === s}
                    onChange={() => setInterest(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </fieldset>
            <label className="message-label">
              A little about your idea
              <textarea
                name="message"
                rows={5}
                required
                maxLength={3000}
                placeholder="The idea, the challenge, the beautiful possibility…"
              />
            </label>
            <button type="submit" className="prepare-button">
              Prepare an email
              <ArrowUpRight size={21} />
            </button>
            <p className="form-note">
              Create a draft, then open it in your email app to send.
            </p>
          </form>
          {draft && (
            <div className="email-draft" role="status">
              <span className="eyebrow">READY WHEN YOU ARE, {draft.name}</span>
              <p>{draft.body}</p>
              <a href={draft.href} className="open-draft">
                Open email draft
                <ArrowUpRight size={18} />
              </a>
              <small>
                Review and send from your email app. Prefer webmail? Copy your
                message and email me directly.
              </small>
            </div>
          )}
        </Reveal>
      </section>
      <section className="contact-faq section-pad">
        <Reveal>
          <span className="eyebrow">BEFORE WE GET STARTED</span>
          <h2>
            A few useful <em>details.</em>
          </h2>
        </Reveal>
        <div className="faq-list">
          <details>
            <summary>
              What can we build together?<span>+</span>
            </summary>
            <p>
              C++ systems and algorithms, Python automation and ML, responsive
              websites, full-stack MERN applications, and UI / UX. The right
              approach depends on your project.
            </p>
          </details>
          <details>
            <summary>
              Where are you based?<span>+</span>
            </summary>
            <p>
              I’m based in Pakistan and study Software Engineering at
              FAST-NUCES. I’m open to remote collaborations.
            </p>
          </details>
          <details>
            <summary>
              Can I review your code and résumé?<span>+</span>
            </summary>
            <p>
              Every project in the work collection links to its GitHub
              repository. You can read my résumé here or download the original
              PDF.
            </p>
            <a href="/resume" className="text-link">
              Open résumé
              <ArrowUpRight size={15} />
            </a>
          </details>
        </div>
      </section>
    </>
  );
}
