# Jack -- 3D Creator Portfolio

A single-page 3D creator portfolio built with React, TypeScript, Tailwind CSS, and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Build

```bash
npm run build
npm run preview
```

## Structure

```
src/
  components/
    FadeIn.tsx           reusable scroll/mount fade-up wrapper
    Magnet.tsx            cursor-following magnetic hover effect
    AnimatedText.tsx       character-by-character scroll reveal
    ContactButton.tsx      gradient pill CTA
    LiveProjectButton.tsx  ghost pill button
  sections/
    HeroSection.tsx
    MarqueeSection.tsx
    AboutSection.tsx
    ServicesSection.tsx
    ProjectsSection.tsx
  App.tsx
  main.tsx
  index.css
```

## Notes

- All imagery (hero portrait, about-section decorative renders, marquee GIFs, and
  project photography) is loaded from the external URLs supplied in the brief. Swap
  these for your own hosted assets before shipping.
- The project section uses a sticky-stacking scroll effect (Framer Motion
  `useScroll`/`useTransform`) -- it needs real page height/scroll to see it in action,
  so view it in a full browser rather than a tiny embedded frame.
- This was built without a live npm registry connection in the build sandbox, so
  dependencies haven't been installed/type-checked in that environment -- run
  `npm install` locally to pull everything down before `npm run dev`.
