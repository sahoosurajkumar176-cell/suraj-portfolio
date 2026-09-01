import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function LiquidGlassCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fluid spring physics for the transparent liquid glass lens
  const springConfig = { damping: 26, stiffness: 280, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Crisp precision core dot
  const dotSpringConfig = { damping: 32, stiffness: 480, mass: 0.12 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  useEffect(() => {
    // Check if device is touch or user prefers reduced motion
    const hasTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasTouch || prefersReducedMotion) {
      setIsTouch(true);
      return;
    }
    setIsTouch(false);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Detect interactive elements for transparent glass loupe expansion
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest(
            'a, button, input, textarea, select, [role="button"], .cursor-pointer, label'
          )
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouch) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden select-none">
      {/* Fully Transparent Liquid Glass Lens / Loupe */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.9 : isHovered ? 1.45 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 flex items-center justify-center rounded-full pointer-events-none will-change-transform"
      >
        <div
          className={`rounded-full transition-all duration-300 relative ${
            isHovered
              ? 'w-12 h-12 backdrop-blur-[2.5px] border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.45),inset_0_-1px_1px_rgba(0,0,0,0.2),0_0_16px_rgba(182,0,168,0.12)]'
              : 'w-8 h-8 backdrop-blur-[1.5px] border border-white/18 shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)]'
          }`}
          style={{
            background: isHovered
              ? 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.08) 0%, rgba(215, 226, 234, 0.02) 60%, rgba(182, 0, 168, 0.05) 100%)'
              : 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.05) 0%, rgba(215, 226, 234, 0.01) 70%, transparent 100%)',
          }}
        >
          {/* Subtle Specular Arc Highlight */}
          <div
            className="absolute top-0.5 left-1.5 right-1.5 h-2.5 rounded-full pointer-events-none transition-opacity duration-200"
            style={{
              opacity: isHovered ? 0.65 : 0.35,
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.6) 0%, transparent 75%)',
            }}
          />
        </div>
      </motion.div>

      {/* Subtle Precision Center Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.7 : isHovered ? 0.5 : 1,
          opacity: isVisible ? (isHovered ? 0.4 : 0.9) : 0,
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="absolute top-0 left-0 w-2 h-2 rounded-full bg-[#D7E2EA] shadow-[0_0_6px_rgba(215,226,234,0.6)] pointer-events-none will-change-transform"
      />
    </div>
  );
}
