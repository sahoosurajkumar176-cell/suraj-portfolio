import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '../components/FadeIn';

interface ServiceItem {
  number: string;
  name: string;
  description: string;
  fare: string;
}

const SERVICES: ServiceItem[] = [
  {
    number: '01',
    name: 'Website Development',
    description:
      'Modern, responsive and professional websites built around your brand, with clean UI, mobile optimization, smooth interactions and a strong user experience.',
    fare: '₹3,499 – ₹7,999',
  },
  {
    number: '02',
    name: 'AI & Business Automation',
    description:
      'Smart automation solutions that reduce repetitive work and help businesses manage leads, forms, messages, emails and everyday workflows more efficiently.',
    fare: '₹2,499 – ₹3,999',
  },
  {
    number: '03',
    name: 'Motion & Web Animation',
    description:
      'Premium motion effects, smooth scroll animations, interactive elements and subtle micro-interactions that make websites feel modern, engaging and memorable.',
    fare: '₹2,999 – ₹5,999',
  },
  {
    number: '04',
    name: 'UI/UX & Brand Design',
    description:
      'Clean and thoughtful visual design covering layouts, typography, responsive interfaces and brand presentation for a consistent professional digital identity.',
    fare: '₹2,499 – ₹4,999',
  },
  {
    number: '05',
    name: 'Website Maintenance',
    description:
      'Regular website updates, content changes, bug fixes, performance improvements and small design adjustments to keep your website reliable and up to date.',
    fare: '₹1,999 – ₹3,999',
  },
];

function ServiceRow({ service, isFirst, isLast, index }: { service: ServiceItem; isFirst: boolean; isLast: boolean; index: number }) {
  const [showFare, setShowFare] = useState(false);

  return (
    <FadeIn delay={index * 0.1} y={20}>
      <div
        className="flex items-start gap-6 sm:gap-10 py-8 sm:py-10 md:py-12"
        style={{
          borderBottom: !isLast ? '1px solid rgba(12, 12, 12, 0.15)' : undefined,
          borderTop: isFirst ? '1px solid rgba(12, 12, 12, 0.15)' : undefined,
        }}
      >
        <span
          className="text-[#0C0C0C] font-black flex-shrink-0"
          style={{ fontSize: 'clamp(3rem, 10vw, 140px)', lineHeight: 1 }}
        >
          {service.number}
        </span>

        <div className="flex flex-col gap-3 sm:gap-4 pt-2 sm:pt-4 flex-1">
          <h3
            className="text-[#0C0C0C] font-medium uppercase"
            style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
          >
            {service.name}
          </h3>
          <p
            className="text-[#0C0C0C] font-light leading-relaxed max-w-2xl"
            style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}
          >
            {service.description}
          </p>

          <div className="flex flex-col items-start gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowFare((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-[#0C0C0C]/80 hover:text-[#0C0C0C] border border-[#0C0C0C]/25 hover:border-[#0C0C0C]/60 rounded-full px-3.5 py-1 transition-all duration-200 cursor-pointer"
            >
              <span>{showFare ? 'Hide Fare' : 'See Fare'}</span>
            </button>

            <AnimatePresence>
              {showFare && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 inline-flex items-baseline gap-2 bg-[#0C0C0C]/5 rounded-xl px-4 py-2 border border-[#0C0C0C]/10">
                    <span className="text-xs uppercase font-medium tracking-wider text-[#0C0C0C]/60">
                      Estimated Fare:
                    </span>
                    <span className="text-[#0C0C0C] font-semibold text-base sm:text-lg tracking-tight">
                      {service.fare}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Services
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto">
        {SERVICES.map((service, i) => (
          <ServiceRow
            key={service.number}
            service={service}
            index={i}
            isFirst={i === 0}
            isLast={i === SERVICES.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
