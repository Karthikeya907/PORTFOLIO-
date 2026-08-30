import { useEffect } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { NavBar } from './components/NavBar';
import { Identity } from './components/Identity';
import { Capabilities } from './components/Capabilities';
import { ProjectVault } from './components/ProjectVault';
import { Internships } from './components/Internships';
import { Engineering } from './components/Engineering';
import { Credentials } from './components/Credentials';
import { Connect } from './components/Connect';

import { GlobalCircuits } from './components/GlobalCircuits';
import { FloatingDots } from './components/FloatingDots';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { AudioEngine } from './utils/AudioEngine';

function App() {
  useEffect(() => {
    // Force scroll to top on page reload / refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    AudioEngine.init();

    const handleAudioUnlock = () => {
      AudioEngine.resume();
    };

    window.addEventListener('touchstart', handleAudioUnlock, { passive: true, once: true });
    window.addEventListener('pointerdown', handleAudioUnlock, { passive: true, once: true });
    window.addEventListener('click', handleAudioUnlock, { passive: true, once: true });
    window.addEventListener('scroll', handleAudioUnlock, { passive: true, once: true });
    window.addEventListener('keydown', handleAudioUnlock, { passive: true, once: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('touchstart', handleAudioUnlock);
      window.removeEventListener('pointerdown', handleAudioUnlock);
      window.removeEventListener('click', handleAudioUnlock);
      window.removeEventListener('scroll', handleAudioUnlock);
      window.removeEventListener('keydown', handleAudioUnlock);
    };
  }, []);

  return (
    <PortfolioProvider>
      <div className="bg-core-bg min-h-screen text-text-main font-sans selection:bg-[#00d8ff]/30 selection:text-white">
        

        {/* Background Global Circuits */}
        <GlobalCircuits />
        
        {/* Background Floating Dots */}
        <FloatingDots />

        <NavBar />

        <main>
          {/* 01 - IDENTITY */}
          <Identity />
          
          {/* 02 - ENGINEERING */}
          <Engineering />

          {/* 03 - CAPABILITIES */}
          <Capabilities />
          
          {/* 04 - PROJECT VAULT */}
          <ProjectVault />
          
          {/* 05 - INTERNSHIPS */}
          <Internships />
          
          {/* 06 - CREDENTIALS */}
          <Credentials />
          
          {/* 07 - CONNECT */}
          <Connect />
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </PortfolioProvider>
  );
}

export default App;
