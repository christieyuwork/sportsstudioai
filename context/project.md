# Sports Studio AI — agent brief

Read this before changing product UI or architecture. cake& component rules live
in [`AGENTS.md`](../AGENTS.md) and the generated files under `context/cake-*.md`
and `context/components/`.

## Product

**Sports Studio AI** (UI title: **Sports AI Studio**) is a sports-focused AI
studio experience. This repository is a **lightweight frontend scaffold** meant
to be handed to production developers — not a full product backend.

Figma:

- Sign-in: https://www.figma.com/design/gR3R6BRWS9ReGfTnkqxDjf/Sports-AI-Studio?node-id=16-20194
- Empty home: https://www.figma.com/design/gR3R6BRWS9ReGfTnkqxDjf/Sports-AI-Studio?node-id=171-23651
- Filled home: https://www.figma.com/design/gR3R6BRWS9ReGfTnkqxDjf/Sports-AI-Studio?node-id=16-20432

## Scope

- **In scope:** Vite + React + TypeScript UI, cake& components, sports styling,
  mocked API functions, documentation that stays current.
- **Out of scope:** Real auth servers, databases, agent backends, real file
  uploads, deploying infrastructure. Mock everything that would be a backend call.

## Design intent

- Dark sports aesthetic over full-bleed motion backgrounds (kick on login, wave in-app).
- Sign-in is **consent-gated** (terms + data protection). No username/password.
- Home starts **empty** until a mock upload completes; then shows Germany vs
  Netherlands with **generic player names** (no club-branded Figma placeholders).
- Upload is simulated (~3s progress + toast) — no bytes leave the browser.
- Do **not** recreate the Figma browser chrome (tabs, address bar).
- Prefer cake& controls; apply thin sports overrides when stock surfaces fight video.
- **Cake& only for UI chrome.** Compose from `@cake-admin/cakeand` — do not invent
  parallel controls. Allowed without asking: reordering containers inside a cake
  component, nesting cake components, swapping icons, recoloring, transparency/blur.
  Ask before building a custom component that replaces something cake& already has.
- Icons come from the Figma library (node 243:8374) via `StudioIcon` / `public/icons`.
## Handoff expectations

This code will be maintained by other developers. Prefer:

1. Clear comments for non-obvious choices (video formats, mock boundaries, theme sync).
2. Minimal dependencies — push back if a request adds complexity cake& already covers.
3. Continuous README / `context/project.md` / `context/architecture.md` updates.
4. Clean structure: `pages` compose, `components` present, `api` + `types` own the backend seam.
5. `npm run build` must pass before claiming done.

## Complexity nudges (say these out loud)

- Adding Tailwind / MUI / another CSS framework beside cake& → reject; use tokens + styled-components.
- Vendoring Rookery fonts when cake& already ships them → unnecessary duplication.
- Committing multi‑hundred‑MB GIFs → use WebM + MP4 instead.
- Wiring `fetch` inside a page component → put it in `src/api/` instead.
