import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactModal from './components/ContactModal';
import LiquidGlassCursor from './components/LiquidGlassCursor';
import { ContactModalProvider } from './context/ContactModalContext';

export default function App() {
  return (
    <ContactModalProvider>
      <div className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
        <LiquidGlassCursor />
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactModal />
      </div>
    </ContactModalProvider>
  );
}
