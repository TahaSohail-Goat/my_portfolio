# Performance Edition / Taha Sohail

Local redesign, October 2026. Existing project data and personal information remain the source of truth.

## Phases

1. Research, content inventory, typography, sculpture, homepage.
2. Work index and four project detail pages.
3. Profile, skills explorer, interactive lab, contact, résumé.
4. Desktop/mobile browser QA and production build.
5. Lando Norris reference revision: portrait-led hero, lime/olive identity, mixed uppercase typography, full-screen navigation, pinned project exhibition, and responsive QA.
6. Desktop formatting: height-aware scene sizing, header clearance, bounded gallery rows, compact menus, and checks at laptop resolutions and effective browser-zoom viewports.

## Direction

Dark olive, warm ivory, electric lime. Switzer carries strong uppercase typography, Georgia supplies upright display serifs, and local Cormorant italic supports smaller editorial details. Taha's own portrait fills the hero, with pointer-position color reveal and a keyboard/touch reveal button. Scroll withdraws the portrait and exposes the segmented chrome curiosity engine, now with a lime core. A word-by-word manifesto moves into contrasting engineering/exploration panels and a pinned four-project exhibition. Full-screen navigation combines Taha's portrait and procedural project artwork with large page links. All original data and routes remain available.

The user explicitly supplied https://landonorris.com/ as the new visual reference. Inspected its live menu, scroll manifesto, content structure, and published hero screenshot at https://www.designrush.com/best-designs/websites/lando-norris-website-design. Its live hero hit a WebGL shader/context failure in this browser, so a published image informed the photographic direction. Adapted the design language to Taha; did not import its photos, helmet models, brand marks, scripts, or content. The original abstract engineering artwork remains clearly illustrative.

## Research

- https://minimal.gallery/ — portfolio hierarchy, generous spacing, project-first composition.
- https://recent.design/ — typography, editorial and 3D categories.
- https://www.dark.design/ — balance atmosphere and content legibility.
- https://www.scrolltide.co/ — depth carousel and scroll 3D slider references.
- https://animmasterlib.dev/ — page transitions, hover, text reveal and WebGL categories.
- https://motionsites.ai/ — cinematic hero references and clear next actions.
- https://bruno-simon.com/ — interaction as identity; a separate exploratory lab.
- https://basement.studio/ — strong studio identity and expressive composition.
- https://www.awwwards.com/sites/dennis-snellenberg — personal portfolio navigation and motion reference.

Technical references: https://r3f.docs.pmnd.rs/api/hooks and https://motion.dev/docs/react-use-scroll.
Fonts: https://www.fontshare.com/fonts/switzer and https://github.com/google/fonts/tree/main/ofl/cormorantgaramond.

## Motion

System reduced motion plus a persistent manual toggle. Disable autoplay, pointer tilt and scroll transforms with motion off. Content never waits for WebGL. Desktop project exhibition advances with scroll or explicit selectors; phones and motion-off mode use selectors without pinning. Pause offscreen canvases and cap pixel ratio. Lab controls use buttons and sliders, not mouse-only interactions. Full-screen menu includes focus containment, Escape close, restored trigger focus, background scroll lock, and inert background content. Hero panels become inert while visually hidden.

## Content

All four projects, repositories, architecture, highlights, education and skill categories are retained. The old contact section lists tahasohail85@gmail.com while the old résumé lists tahaxsohail@gmail.com: preserve both, contact email primary and résumé email alternate. Keep the existing PDF. Local contact drafts open the visitor's email client instead of silently submitting to the old external form service.
