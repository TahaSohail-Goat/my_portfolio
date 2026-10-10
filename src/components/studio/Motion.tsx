import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
const MotionContext = createContext({ enabled: true, toggle: () => {} });
export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [preference, setPreference] = useState<boolean | null>(() => {
    try {
      const v = localStorage.getItem("taha-motion");
      return v === null ? null : v === "on";
    } catch {
      return null;
    }
  });
  const enabled = preference ?? !reduced;
  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? "on" : "off";
  }, [enabled]);
  function toggle() {
    const next = !enabled;
    setPreference(next);
    try {
      localStorage.setItem("taha-motion", next ? "on" : "off");
    } catch {
      /* Optional storage. */
    }
  }
  return (
    <MotionContext.Provider value={{ enabled, toggle }}>
      <MotionConfig reducedMotion={enabled ? "never" : "always"}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}
export const useMotionSettings = () => useContext(MotionContext);
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { enabled } = useMotionSettings();
  return (
    <motion.div
      className={className}
      initial={enabled ? { opacity: 0, y: 35 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-35px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
