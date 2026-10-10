# Taha Sohail / Performance Edition

A locally developed, multi-page portfolio built with React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Framer Motion, and Wouter.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173/).

```sh
npm run typecheck
npm run build
npm run serve
```

No hosting or deployment is required. Fonts, portrait, résumé, and procedural 3D lighting are local. The app makes no runtime font, model, environment-map, or analytics requests.

## Pages

- `/` — 3D drifting-car entrance, oversized portrait hero with cursor-driven color reveal, scroll-driven particle monogram, word-by-word manifesto, interactive Logic / In Motion and Beyond / The Code panels, pinned project exhibition, toolkit marquee, an animated microchip lab preview, and contact.
- `/work` — filterable project collection with pointer-responsive cards and original abstract artwork.
- `/work/:id` — all four projects, their original descriptions, highlights, technology stacks, architecture, and GitHub repositories.
- `/about` — portrait, principles, searchable skills and related technologies, education and project timeline.
- `/lab` — sculpture assembly, rotation speed, angle, material, wireframe, orbit controls, and reset.
- `/contact` — contact details, service selection, validated local email-draft preparation, and useful questions.
- `/resume` — readable, printable résumé plus the original downloadable PDF.

Unknown routes have a designed 404 page with a home link.

## Content

Project content stays in `src/data/projects.data.ts`. The timeline stays in `src/data/experience.data.ts`. Skills reuse `src/components/sections/skills/skills.data.ts`.

The original contact page and résumé listed different email addresses. Both are retained: `tahasohail85@gmail.com` is the primary contact, and `tahaxsohail@gmail.com` appears on the résumé. The original `public/Resume.pdf` is unchanged.

Contact preparation creates a `mailto:` draft. The visitor reviews and sends it in their email client; this local build does not use the former third-party submission endpoint.

## Design and motion

Lime, warm ivory, and dark olive. The direction adapts the portrait-led storytelling, bold mixed typography, and full-screen navigation of [Lando Norris](https://landonorris.com/) to Taha's existing portfolio. Locally hosted Switzer, Georgia for upright display serifs, and a 58 KB subset of Cormorant Garamond italic. Font sources and notices are in `public/fonts/`. The original portrait and custom code artwork supply all imagery.

System reduced motion is respected, with a persistent manual toggle. Motion-off mode removes homepage pinning and automatic scene playback; the project gallery remains usable with buttons. Phone layouts use a normal project exhibition with project selectors and previous/next controls. Canvases pause outside the viewport, pixel ratio is capped, and the Three.js scene is lazy-loaded. CSS sculpture artwork replaces WebGL when unavailable. Important content never waits for 3D. The full-screen menu locks background scrolling, makes background content inert, traps keyboard focus, closes with Escape, and restores focus to its trigger.

## Notes

Research and phase decisions: [docs/design-direction.md](docs/design-direction.md).
Verification record: [docs/verification.md](docs/verification.md).

Browser QA artifacts are generated in the ignored `output/playwright/` directory. The heavy Three.js chunk produces a Vite size advisory; it is loaded separately from the main application and supporting pages.
