# Local verification

## Microchip curiosity engine

- Replaced only the orbit graphic in Break It Apart with a locally generated Three.js microchip. Heading, description, section layout, palette, experiment caption and existing /lab CTA remain unchanged.
- Scroll separates the etched metal lid, processor, circuit board and pin carrier in stages. The lid moves back to keep the lime processor visible. Pointer movement tilts the chip and hover accelerates light pulses along the etched traces. Activating the chip zooms toward it and opens /lab.
- Geometry includes beveled plates, 72 instanced contacts, screw heads, ventilation details and board components. Circuit, die and lid textures are generated locally. Studio lighting and a shadow floor use no network assets. The scene loads near the section and pauses offscreen; motion-off shows a static expanded chip and unavailable WebGL uses a CSS fallback.
- Visually checked desktop 1440 × 900 and mobile 390 × 844, including the mobile entry and expanded views. No horizontal overflow. Mouse click and Enter reached /lab; Ctrl-click opened /lab in a new tab. The existing description and CTA destination were verified unchanged.
- Manual motion-off, system reduced motion and WebGL-unavailable fallback preserve access to /lab. No uncaught errors in checked interactions. TypeScript, production build and whitespace checks pass; the existing Three bundle-size advisory remains.

## Engineering and experiment worlds

- Replaced the two home-page link panels with Logic / In Motion and Beyond / The Code, using the approved descriptions. Their destinations remain /work and /lab. Other page content, the hero and the preloader are unchanged.
- The work preview has a local code texture on a reflective 3D terminal, chrome brackets, floating nodes and connections. Scrolling assembles the surrounding elements; pointer movement tilts the system and hover types the code. The lab preview unfolds six wireframe panels around a chrome/lime core that morphs between sphere, cube and fluid forms, surrounded by orbiting particles.
- Normal activation zooms toward the scene before navigation. Ctrl-click preserves native new-tab behavior, and Enter activates the link. The scene modules load near the section and pause their frame loops offscreen. Motion-off uses a static assembled scene; unavailable WebGL uses CSS terminal/core previews with functioning links.
- Visually checked desktop 1440 × 900, tablet 1024 × 768 and mobile 390 × 844. No horizontal overflow or overflowing tablet headings. Mouse activation reached /work and keyboard activation reached /lab; Ctrl-click opened /work while preserving the current page.
- Manual motion-off and system reduced motion preserve destinations. WebGL-unavailable fallback retained both previews and navigation to /lab. No uncaught errors in checked interactions. TypeScript, production build and whitespace checks pass; the existing Three bundle-size advisory remains.

## Drift preloader

- Added a page-load entrance in the existing lime/dark palette with LOAD TAHA branding. A locally generated Three.js coupe enters from the left, countersteers through the center with spinning wheels, smoke and paired skid marks, then exits right. The drive lasts 3.8 seconds after the scene starts; a 0.65-second wipe reveals the page.
- The sequence waits for local font/high-priority image readiness, with an eight-second maximum wait. Skip Intro and Escape bypass it. Internal route navigation does not replay the preloader.
- Background content remains inert and scrolling stays locked until the exit completes; focus then returns to the main content. Hidden hero particles pause their frame loop before their scroll reveal.
- Visually checked desktop 1440 × 900 and mobile 390 × 844. Verified no mobile horizontal overflow, Tab reaching Skip Intro, Escape and button dismissal, restored scroll/focus, and navigation to /work without replay.
- Reduced motion shows a brief static car. A WebGL2-unavailable check uses an animated SVG car and completes successfully. No uncaught errors in checked flows. TypeScript and production build pass; the existing Three bundle-size advisory remains.

## Hero particle monogram

- Replaced only the hero sculpture with a separate particle component. The lab retains its original sculpture and controls; shared layout, content, typography and palette are unchanged.
- Local vector initials generate 7,600 lime/silver particles on desktop and 3,800 on mobile. Scroll gathers them into TS, morphs them into three flowing ribbons, then reconstructs the initials at another angle. Pointer repulsion uses damped springs.
- Visually checked assembled initials, ribbons, reconstruction, pointer displacement and return at 1440 × 900, plus the mobile scene at 390 × 844. Canvas measurements ignore the parent scroll transform to avoid repeated scaling; the particle field fits narrower canvases.
- Manual motion-off and system reduced-motion modes omit the hero animation. An unavailable WebGL2 context shows a static dotted TS fallback with no uncaught errors.
- TypeScript, production build and whitespace checks pass. Three's existing bundle-size advisory remains.

## Desktop formatting follow-up

Reproduced failures at 1366 × 650 and 1280 × 600. The previous pinned exhibition had a 700 px minimum height: its title was partly covered by the fixed header and its navigation extended below the viewport. The menu grid exceeded the viewport height, and hero actions crowded the bottom caption. The earlier audit checked document width but missed these vertical failures.

- Shared header height now drives scene padding and page offsets. Desktop hero height matches the viewport; title size and spacing respond to available height.
- Pinned exhibition uses bounded grid rows for its heading, artwork, metadata, and controls. At 1366 × 650, heading top is 92 px below a 68 px header and controls end at 626 px. At 1280 × 600, controls end at 576 px.
- Gallery pinning requires at least 900 px width and 540 px height. Shorter windows use normal scrolling so all content remains reachable.
- Menu imagery and type fit available height. Its scroll height equals the viewport at all checked desktop sizes; the compact menu at 683 × 325 also has no vertical overflow.
- Hero actions and bottom caption have separate space. At 683 × 325, actions end at 250 px and the caption starts at 277 px; portrait control stays inside the right edge.
- Verified desktop scene/menu bounds at 1366 × 650, 1280 × 600, 1920 × 950, 1024 × 768, and 1024 × 560. Also checked 1024 × 500, 820 × 540, 390 × 844, and effective viewport sizes corresponding to 125%, 150%, and 200% laptop zoom (1093 × 520, 911 × 433, 683 × 325).
- All supporting routes plus 404 rechecked at 1366 × 650: headings below the fixed header, zero horizontal document overflow, zero uncaught app errors.
- Last-project selection and motion-off mode still work. TypeScript, production build, and whitespace checks pass.

Final screenshots use `output/playwright/layout-verified-*`, `layout-zoom-200-*`, `layout-contact-spacing-final.png`, and `layout-last-project-final.png`.

## Performance edition / Lando reference revision

- All ten content routes plus the 404 route checked at 390 × 844 and 1440 × 900: one h1, correct page titles, zero horizontal document overflow, and zero uncaught app errors in the route audit.
- Homepage also checked at 320 × 740 with zero horizontal overflow.
- Desktop and mobile screenshots reviewed for the portrait hero, project exhibition, work index, profile, lab, and contact.
- Portrait button sets the color reveal's locked state. Pointer position controls the reveal window; the same button works on touch and keyboard.
- Full-screen menu opens, locks body scrolling, and makes the main/footer inert. First-link focus, Shift+Tab to close, focus wrap to the last link, Escape close, restored trigger focus, and menu navigation to Work verified.
- Work full-stack filter returns one project after navigation through the new menu.
- Hero starts with portrait/name opacity 1 and second-panel opacity 0; the hidden second panel is inert. Scrolling opens the chrome/lime assembly and exposes the second message.
- Desktop exhibition Next selects CDIEM. Selecting the last project displays counter 04/04 and the Magical Pet Kingdom URL; opening it navigates to the correct detail page.
- Mobile and motion-off exhibition can select the last project without scroll pinning.
- Manual motion-off preference persists after reload, unpins both homepage sequences, and removes the homepage WebGL canvas. Emulated system reduced motion also defaults to off and stops the marquee.
- WebGL2 disabled: CSS sculpture fallback appears, canvas count is zero, headline remains present.
- Original PDF returns HTTP 200. Homepage resource origins are exclusively http://localhost:5173.
- TypeScript and production build pass. The separately loaded Three.js chunk retains the existing Vite size advisory.

Screenshots are in the ignored `output/playwright/performance-*.png` files. The local server remains running at the user's request.

## Earlier Digital Observatory checks (before reference revision)

- TypeScript strict compilation and Vite production build.
- Home, work, all four project URLs, profile, lab, contact, résumé, and unknown routes load directly with one h1 and no placeholder `href="#"` links.
- All routes checked at 390 px: no horizontal document overflow.
- Home checked at 320 px: no horizontal document overflow.
- Desktop visual inspection: hero, scroll transition, final horizontal project card, work index, lab, résumé.
- Phone visual inspection: hero, profile, lab, contact.
- Work filters: full stack returns one project; C++ and systems returns two.
- Skills: selecting Python updates the detail panel; searching React returns matching technologies; an unmatched query shows an empty state.
- Lab: keyboard End sets assembly to 2, Porcelain and wireframe selections update, reset restores assembly 0.35 / Chrome / wireframe off.
- Motion toggle stores the preference, disables the speed control, and survives navigation.
- Emulated system reduced motion defaults to motion off; hero returns to one viewport and all four work cards remain available.
- Hero native scroll timeline endpoints verified at 90%: opening message opacity 0, second message opacity 1.
- Horizontal work sequence ends with the last project card fully visible.
- WebGL disabled: CSS sculpture fallback appears, canvas count is zero, and the headline remains present.
- Contact: empty form is invalid; valid dummy fields prepare a draft with the correct recipient, chosen service, message, name, and reply email. No email was sent.
- Original résumé PDF remains downloadable.

## Implementation limits

The contact flow prepares an email draft rather than posting to a backend. Actual sending depends on the visitor's email app.

The 3D module is about 937 KB minified / 255 KB gzip and is lazy-loaded. Vite reports a chunk-size advisory. Chrome's graphics backend emitted shader precision warnings during 3D QA; no app runtime errors were observed in the checked pages.

The printable page is separate from the original PDF; the original PDF content has not been rewritten.

Research references are linked in design-direction.md. All work stays in this checkout; no site was registered, synchronized, published, or deployed.
