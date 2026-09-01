import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import ContactButton from '../components/ContactButton';
import { useContactModal } from '../context/ContactModalContext';

const NAV_LINKS = ['About', 'Services', 'Projects', 'Contact'];

const PORTRAIT_URL =
  'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png';

export default function HeroSection() {
  const { openContactModal } = useContactModal();

  return (
    <section className="min-h-screen h-screen flex flex-col justify-between relative" style={{ overflowX: 'clip' }}>
      <FadeIn delay={0} y={-20} as="nav" className="relative z-20">
        <div className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={(e) => {
                if (link === 'Contact') {
                  e.preventDefault();
                  openContactModal();
                }
              }}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] transition-opacity duration-200 hover:opacity-70 cursor-pointer"
            >
              {link}
            </a>
          ))}
        </div>
      </FadeIn>

      {/* Middle empty space: Portrait centered directly above heading */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 min-h-0">
        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
          className="w-[200px] sm:w-[260px] md:w-[320px] lg:w-[380px] max-h-[38vh] flex items-center justify-center"
        >
          <FadeIn delay={0.4} y={30}>
            <img
              src={PORTRAIT_URL}
              alt="Suraj, 3D creator"
              className="w-full h-auto max-h-[36vh] object-contain select-none pointer-events-none"
              draggable={false}
            />
          </FadeIn>
        </Magnet>
      </div>

      <div className="flex flex-col relative z-20">
        <div className="overflow-hidden">
          <FadeIn
            delay={0.15}
            y={40}
            as="h1"
            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
          >
            Hi, i&apos;m Suraj
          </FadeIn>
        </div>

        <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10">
          <FadeIn delay={0.35} y={20}>
            <p
              className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            >
              a 3d creator driven by crafting striking and unforgettable projects
            </p>
          </FadeIn>

          <FadeIn delay={0.5} y={20}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
