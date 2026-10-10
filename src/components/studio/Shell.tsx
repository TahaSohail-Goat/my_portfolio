import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, ArrowUp, X, Pause, Play } from "lucide-react";
import { useMotionSettings } from "./Motion";
import { Contours } from "./Contours";
import { ProjectArt } from "./ProjectArt";
import { projects } from "@/data/projects.data";
const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "The work" },
  { href: "/about", label: "The person" },
  { href: "/lab", label: "The lab" },
  { href: "/contact", label: "Let’s talk" },
];
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`arrow-link ${className}`}>
      {children}
      <span>
        <ArrowUpRight size={19} />
      </span>
    </Link>
  );
}
function Cursor() {
  const { enabled } = useMotionSettings();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!enabled || !matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      ref.current.dataset.active = (e.target as HTMLElement).closest(
        "a,button,[data-cursor]",
      )
        ? "true"
        : "false";
      ref.current.style.opacity = "1";
    };
    const leave = () => {
      if (ref.current) ref.current.style.opacity = "0";
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);
  return enabled ? (
    <div ref={ref} className="cursor-ring" aria-hidden="true">
      <span />
    </div>
  ) : null;
}
export function Footer({ inert = false }: { inert?: boolean }) {
  return (
    <footer className="site-footer" inert={inert}>
      <Link href="/" className="footer-wordmark">
        TAHA<span>©</span>
      </Link>
      <div>
        <p>Software engineer. Curious by default.</p>
        <a href="mailto:tahasohail85@gmail.com">
          tahasohail85@gmail.com <ArrowUpRight size={14} />
        </a>
      </div>
      <div className="footer-links">
        <a
          href="https://github.com/TahaSohail-Goat"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
        <a
          href="https://www.linkedin.com/in/taha-sohail-7b03b8320/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn ↗
        </a>
        <Link href="/resume">Résumé ↗</Link>
      </div>
      <button
        className="back-top"
        aria-label="Back to top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior:
              document.documentElement.dataset.motion === "off"
                ? "instant"
                : "smooth",
          })
        }
      >
        <ArrowUp size={20} />
      </button>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Taha Sohail</span>
        <span>Built with intention. From Pakistan.</span>
      </div>
    </footer>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { enabled, toggle } = useMotionSettings();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 30 });
  useEffect(() => {
    setOpen(false);
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
    const titles: Record<string, string> = {
      "/": "Code. Craft. Curiosity",
      "/work": "Selected work",
      "/about": "Profile",
      "/lab": "Interactive lab",
      "/contact": "Let’s talk",
      "/resume": "Résumé",
    };
    const project = projects.find((p) => location === `/work/${p.id}`);
    document.title = `${titles[location] ?? project?.title ?? "Page not found"} — Taha Sohail`;
  }, [location]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(
      () => menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus(),
      100,
    );
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const items = [
          menuButtonRef.current,
          ...Array.from(
            menuRef.current?.querySelectorAll<HTMLElement>("a,button") ?? [],
          ),
        ].filter((el): el is HTMLElement => !!el);
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handler);
      menuButtonRef.current?.focus();
    };
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main-content" inert={open}>
        Skip to content
      </a>
      <motion.div
        className="reading-progress"
        style={{ scaleX: enabled ? scaleX : scrollYProgress }}
      />
      <header
        className={`site-nav performance-nav ${open ? "menu-is-open" : ""}`}
      >
        <Link
          className="brand"
          href="/"
          aria-label="Taha Sohail home"
          inert={open}
        >
          <em>TAHA</em>
          <span>SOHAIL</span>
        </Link>
        <Link
          href="/"
          className="nav-monogram"
          aria-label="Taha Sohail home"
          inert={open}
        >
          TS<span>↗</span>
        </Link>
        <div className="nav-actions">
          <Link href="/contact" className="nav-contact" inert={open}>
            LET’S TALK <ArrowUpRight size={17} />
          </Link>
          <button
            className="motion-toggle"
            inert={open}
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={enabled ? "Pause animations" : "Enable animations"}
            title={enabled ? "Pause animations" : "Enable animations"}
          >
            {enabled ? <Pause size={13} /> : <Play size={13} />}
            <span>Motion {enabled ? "on" : "off"}</span>
          </button>
          <button
            ref={menuButtonRef}
            className="menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X />
            ) : (
              <span className="menu-lines">
                <i />
                <i />
              </span>
            )}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            ref={menuRef}
            id="mobile-navigation"
            className="mobile-nav performance-menu"
            aria-label="Main navigation"
            initial={enabled ? { clipPath: "inset(0 0 100% 0)" } : false}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{
              duration: enabled ? 0.55 : 0,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <Contours />
            <div className="menu-gallery" aria-hidden="true">
              <div>
                <img src="/taha-photo.png" alt="" />
              </div>
              {projects.slice(0, 3).map((p) => (
                <ProjectArt key={p.id} id={p.id} />
              ))}
            </div>
            <div className="menu-link-list">
              {links.map((l, i) => (
                <Link
                  href={l.href}
                  key={l.href}
                  aria-current={
                    location === l.href ||
                    (l.href === "/work" && location.startsWith("/work/"))
                      ? "page"
                      : undefined
                  }
                  onClick={() => setOpen(false)}
                >
                  <small>0{i + 1}</small>
                  {l.label}
                  <ArrowUpRight />
                </Link>
              ))}
              <div className="menu-contact">
                <a href="mailto:tahasohail85@gmail.com">BUSINESS ENQUIRIES ↗</a>
                <span>CODE. CRAFT. CURIOSITY.</span>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <main id="main-content" key={location} tabIndex={-1} inert={open}>
        {enabled && (
          <motion.div
            className="route-wipe"
            aria-hidden="true"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          />
        )}
        <motion.div
          initial={enabled ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      <Footer inert={open} />
      <Cursor />
    </>
  );
}
