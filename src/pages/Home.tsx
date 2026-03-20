import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Background3D } from '@/components/3d/Background3D';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Projects } from '@/components/sections/Projects';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <main className="relative w-full min-h-screen bg-transparent">
          <Background3D />
          <Navbar />
          <Hero />
          <About />
          <Services />
          <Projects />
          <Contact />
          <Footer />
        </main>
      )}
    </>
  );
}
