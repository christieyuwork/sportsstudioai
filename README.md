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
npm ci
npm run dev
```

`package-lock.json` is committed so local, CI, and production handoff installs
resolve the same cake&, React, Vite, and supporting dependency versions. Run
`npm install` only when intentionally updating dependencies, then commit the
resulting lockfile change.

Other scripts:

| Script | Purpose |
| --- | --- |
| `npm run build` | Typecheck + production bundle |
| `npm run preview` | Serve the production build locally |
| `npm run cake:update` | Pin the newest cake& release tarball |

`npm run build` is the current automated quality gate. There is no committed
unit/E2E test suite or linter yet; production owners should add those before
shipping backend-connected flows.

## What you get today

- Consent-gated **sign-in page** (player-kick WebM background)
- **Studio home** after login (wave WebM background)
  - Fresh sidebar: one New project, disabled media routes, and no prior agents
  - Mock upload (~3s animated detection state + `ProgressBar`) → success **Toast** → enabled project media
  - Demo scenario: **Germany vs Netherlands** with generic player names
- Mock **AI agent workspace** with staged reasoning, generated clips, clip preview, and a video editor with an embedded per-clip preview/trim/metadata workflow, caption controls, and export settings
- Project-scoped **User-uploaded media** with shared upload, rename, and delete controls
- Unified **Generated clips** library containing AI-detected moments and clips explicitly requested from the agent
- Refreshed project landing grid with shared 16px clip cards, previews, and a reorderable **Suggested video**
- Project-scoped video outputs assembled from one or more generated clips
- Mocked `signIn()` / `uploadProjectVideo()` with shared TypeScript contracts

Figma sources:

- Sign-in: https://www.figma.com/design/gR3R6BRWS9ReGfTnkqxDjf/Sports-AI-Studio?node-id=16-20194
- Empty home: https://www.figma.com/design/gR3R6BRWS9ReGfTnkqxDjf/Sports-AI-Studio?node-id=171-23651
- Filled home: https://www.figma.com/design/gR3R6BRWS9ReGfTnkqxDjf/Sports-AI-Studio?node-id=16-20432
- Video editor: https://www.figma.com/design/gR3R6BRWS9ReGfTnkqxDjf/Sports-AI-Studio?node-id=266-27506

## Demo flow

1. Agree to both consents → **Login**
2. Land on empty **New project** with upload zone
3. Click **Upload videos to this project** (no real file transfer)
4. Watch ~3s detection progress → toast → renamed Germany vs Netherlands project with enabled media routes
5. Preview detected moments, drag the **Suggested video** clips into order, then
   choose **Edit in video editor** to verify that order through the agent and
   create a mocked video output
6. Open **Generated clips**, choose **Select** under detected moments, and generate from checked events; or submit an AI prompt
7. Review the agent reasoning and preview a generated clip in the shared modal
   (transcript evidence is cross-checked against its accessible dense caption)
8. Choose **Add clip to video** to add to an output or create a titled video
9. Open the agent-panel video tab; use its adjacent menu to switch outputs, then open **Edit clips** to select/reorder clips and directly edit preview focus, trim, playback, event metadata, and transcripts
10. Manage uploads under **User-uploaded media** and both detected and agent-created clips under **Generated clips**
11. **New project** adds another empty project above existing projects
12. Account chevron opens a menu with **Log out**

## Project layout

```
src/
  api/           Mocked backend functions (auth, projects/upload)
  components/    Reusable UI and feature-level panels
  data/          Demo project seed (Germany vs Netherlands) + mocked agent clips
  lib/           Pure title/time formatting helpers
  pages/         SignInPage, HomePage
  styles/        Login, studio home, detected-events, AI-agent, and video-editor styling
  types/         Shared request/response and project contracts
public/
  brand/         Logos, studio icon, upload icon, avatar
  icons/         Product and player controls
  media/         Login/wave/thinking media + demo thumbnails
context/         Product, architecture, and generated cake& references
```

## Architecture rules (handoff)

1. **UI never talks to the network directly.** Pages call `src/api/*`. Types live
   in `src/types/*`.
2. **Minimal dependencies.** Prefer cake& + what the starter already ships
   (`styled-components`, `radix-ui`, `lucide-react`). Do not add Tailwind, MUI,
   or a second design system.
3. **Tokens first.** Use `var(--color-…)`, `var(--space-…)`, etc. Sports glass
   and AI gradient exceptions are centralized in `src/styles/sports-tokens.ts`.
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

Videos should use `muted`, `autoPlay`, `loop`, and `playsInline` (see
`VideoBackground`). FIFA AI Pro logos and old branded artifacts were excluded.

Rookery New is loaded by cake& CSS at runtime. OFL license texts live under
`licenses/rookery/` for compliance; do not duplicate font files unless a weight
is missing from the package.

## Backend integration guide

Treat `src/types/` as the contract layer and `src/api/` as the only network
boundary. Components should continue receiving data and callbacks; do not add
`fetch` or SDK calls to component files.

Current seams:

- Authentication: replace `signIn()` in `src/api/auth.ts` while preserving the
  `SignInResponse` discriminated union. Add session refresh/logout APIs when the
  real auth model is known.
- Upload: `uploadProjectVideo()` currently receives only a display filename and
  returns demo media after simulated progress. Production must pass the actual
  `File`, report transfer/processing progress, support cancellation and errors,
  and set `DEMO_UPLOAD_BYPASS` in `UploadDropzone` to `false`.
- Projects and chat threads: create/rename/delete operations are immutable local
  state callbacks in `HomePage`. Move async work into `src/api/projects.ts` (or
  focused API modules), then reconcile server IDs and failures in the
  page/controller layer.
- Detected events and generated clips: retain source provenance in the API.
  They share card UI but are different backend resources and lifecycle events.
- Video outputs: persist the title and ordered `clipIds`; current IDs and
  `createdAtLabel` values are demo-only. Clip trims, transcripts, event metadata,
  captions, and export settings are local-only too.
- Agent reasoning, playback, download, and export are visual simulations.
  Connect them to typed stream/media/render services before treating their
  success toasts as completed operations.

The app intentionally has no router or persistence. Refreshing resets all state.

## cake& notes

- Storybook: https://cake.lenovo.com/storybook/
- Starter wiring that must stay: `resolve.dedupe` in `vite.config.ts`,
  `@cake-admin/cakeand/cakeand.css` first in `src/main.tsx`, matching
  `data-theme` / `CakeProvider` mode (`dark.a` for sign-in).

## Production handoff checklist

- [ ] Run `npm run build` cleanly
- [ ] Add unit tests for pure helpers/state transitions and E2E coverage for the critical flow
- [ ] Add lint/format checks and run them in CI
- [ ] Walk the sign-in consent + mock login path
- [ ] Confirm media loads on Chromium and Safari (WebM vs MP4)
- [ ] Define server contracts, auth/session handling, retries, cancellation, and user-facing errors
- [ ] Replace mocks and page-owned mutations without moving network calls into components
- [ ] Replace simulated playback, agent progress, download, and export behavior
- [ ] Persist editor state and reconcile server-generated IDs
- [ ] Replace `/legal/*` placeholders with real policy pages
- [ ] Add routing, error boundaries, observability, and accessibility regression checks
- [ ] Verify upload limits, formats, processing states, and failed-upload recovery
