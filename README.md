# Sports Studio AI

Frontend scaffold for **Sports AI Studio** — a sports-focused AI experience built
with Vite, React, TypeScript, and Lenovo's **cake&** design system.

This repository is intentionally **frontend-only**. There is no backend here.
API calls are mocked behind typed functions so production teams can swap in real
services without rewriting UI.

## Quick start

Requires [Node.js LTS](https://nodejs.org/) and **npm** (pnpm/yarn are not tested
with cake&'s peer graph).

```bash
npm install
npm run dev
```

Other scripts:

| Script | Purpose |
| --- | --- |
| `npm run build` | Typecheck + production bundle |
| `npm run preview` | Serve the production build locally |
| `npm run cake:update` | Pin the newest cake& release tarball |

## What you get today

- Consent-gated **sign-in page** (player-kick WebM background)
- **Studio home** after login (wave WebM background)
  - Empty state: upload CTA to begin a project
  - Mock upload (~3s `ProgressBar`) → success **Toast** → filled home
  - Demo scenario: **Germany vs Netherlands** with generic player names
- Mock **AI agent workspace** with staged reasoning, generated clips, and clip-preview controls
- **Detected events** created automatically from uploaded media, with selectable cards
- **Generated clips** explicitly requested from the AI, managed separately in Project media
- Project-scoped video outputs assembled from one or more generated clips
- Mocked `signIn()` / `uploadProjectVideo()` with shared TypeScript contracts

Figma sources:

- Sign-in: https://www.figma.com/design/gR3R6BRWS9ReGfTnkqxDjf/Sports-AI-Studio?node-id=16-20194
- Empty home: https://www.figma.com/design/gR3R6BRWS9ReGfTnkqxDjf/Sports-AI-Studio?node-id=171-23651
- Filled home: https://www.figma.com/design/gR3R6BRWS9ReGfTnkqxDjf/Sports-AI-Studio?node-id=16-20432

## Demo flow

1. Agree to both consents → **Login**
2. Land on empty **New project** with upload zone
3. Click **Upload videos to this project** (no real file transfer)
4. Watch ~3s progress → toast → filled Germany vs Netherlands home
5. Open **All events**, choose **Select**, and generate from checked events; or submit an AI prompt
6. Review the agent reasoning and preview a generated clip in the side panel
   (transcript evidence is cross-checked against its accessible dense caption)
7. Choose **Add clip to video** to add to an output or create a titled video
8. Manage generated clips, detected events, uploaded media, and video outputs
   under **Project media**
9. **New project** resets the primary project to empty again
10. Account chevron opens a menu with **Log out**

## Project layout

```
src/
  api/           Mocked backend functions (auth, projects/upload)
  types/         Shared request/response contracts
  data/          Demo project seed (Germany vs Netherlands)
  pages/         SignInPage, HomePage
  components/    Sign-in, sidebar, upload, workspace pieces
  styles/        Login, studio home, detected-events, and AI-agent styling
public/
  media/         login / wave / thinking videos + event thumbs
  brand/         Logos, studio icon, upload icon, avatar
```

## Architecture rules (handoff)

1. **UI never talks to the network directly.** Pages call `src/api/*`. Types live
   in `src/types/*`.
2. **Minimal dependencies.** Prefer cake& + what the starter already ships
   (`styled-components`, `radix-ui`, `lucide-react`). Do not add Tailwind, MUI,
   or a second design system.
3. **Tokens first.** Use `var(--color-…)`, `var(--space-…)`, etc. Sports glass
   overlays are documented exceptions in `src/styles/sports-theme.ts`.
4. **Keep the README and agent context current** when behavior or structure
   changes — this repo will be handed to production developers.

See [`context/architecture.md`](context/architecture.md) and [`AGENTS.md`](AGENTS.md).

## Media assets

Large GIFs from the source library were **not** committed (login GIF ~175MB,
wave GIF ~88MB). We keep:

| Path | Use | Format choice |
| --- | --- | --- |
| `public/media/login/player-kick.webm` (+ `.mp4`) | Sign-in background | WebM primary, MP4 Safari fallback |
| `public/media/wave/looping-wave.webm` (+ `.mp4`) | In-app / home backgrounds | Same |
| `public/media/thumbs/*` | Event + media list thumbnails | PNG from design exports |
| `public/media/thinking/thinking-small.webm` | Agent thinking indicator | Small WebM (~79KB) |
| `public/media/thinking/thinking-large.webm` | Larger thinking treatments | WebM (~101KB) |

Videos should use `muted`, `autoPlay`, `loop`, and `playsInline` (see
`VideoBackground`). FIFA AI Pro logos and old branded artifacts were excluded.

Rookery New is loaded by cake& CSS at runtime. OFL license texts live under
`licenses/rookery/` for compliance; do not duplicate font files unless a weight
is missing from the package.

## Replacing mocks with a real API

1. Keep the types in `src/types/auth.ts` (or extend them carefully).
2. Replace the body of `src/api/auth.ts` with `fetch` / your client SDK.
3. Leave pages and components unchanged if the `SignInResponse` shape holds.

## cake& notes

- Storybook: https://cake.lenovo.com/storybook/
- Starter wiring that must stay: `resolve.dedupe` in `vite.config.ts`,
  `@cake-admin/cakeand/cakeand.css` first in `src/main.tsx`, matching
  `data-theme` / `CakeProvider` mode (`dark.a` for sign-in).

## Production handoff checklist

- [ ] Run `npm run build` cleanly
- [ ] Walk the sign-in consent + mock login path
- [ ] Confirm media loads on Chromium and Safari (WebM vs MP4)
- [ ] Swap `src/api/*` for real services
- [ ] Replace `/legal/*` placeholders with real policy pages
- [ ] Add routing / post-login screens as designs land
