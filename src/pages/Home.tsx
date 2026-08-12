import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Background3D } from '@/components/3d/Background3D';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Loading screen sits on top at z-index 9999 */}
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {/* Main content is ALWAYS mounted — it just fades in once loading completes.
          This eliminates the black flash that occurred when mounting was delayed
          until after onComplete fired (leaving a gap before React painted the DOM). */}
      <motion.main
        className="relative w-full min-h-screen bg-transparent"
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.45, delay: loaded ? 0.05 : 0 }}
        style={{ pointerEvents: loaded ? 'auto' : 'none' }}
      >
        <Background3D />
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
        <Footer />
      </motion.main>
    </>
  );
}
