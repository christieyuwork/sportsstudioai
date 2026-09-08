# Architecture — frontend + mocked APIs

## Stack

| Layer | Choice | Role |
| --- | --- | --- |
| Bundler / dev server | Vite | Fast local serve + production build |
| UI | React 19 | Interface and interactions |
| Types | TypeScript | Catch mismatches between UI and backend-shaped data |
| Design system | `@cake-admin/cakeand` | Components, tokens, Rookery New |
| Styling | `styled-components` | Layout + sports overrides on tokens |

## Separation of concerns

```
Page / Component  -->  api/*.ts  -->  (future) real HTTP
        ^                  |
        |                  v
        +-----------  types/*.ts
```

- **Pages** (`src/pages`) own screen state and call API helpers.
- **Components** (`src/components`) are presentational and receive props/callbacks.
- **API** (`src/api`) owns all async “backend” calls. Today they are mocks with
  latency; tomorrow they are real clients. **Keep the function signatures stable.**
- **Types** (`src/types`) own the contract. UI and API both import from here.
- **Lib** (`src/lib`) holds pure formatting helpers shared by data and UI.

`HomePage` currently owns the demo's project-scoped video outputs. A
`ProjectVideoOutput` stores its title and generated clip IDs on its parent
`Project`; replace those state callbacks with API calls when output persistence
is wired to the backend. The agent panel's video-project tab opens
`VideoEditorPanel`; the menu button inside it selects or creates outputs. The editor
reuses one player across Preview, Edit clips, Captions, and Export modes.
Edit clips renders a selectable, reorderable clip strip directly above the
embedded `ClipEditorPanel`; there is no separate pencil entry or back step.
The selected clip exposes Preview, Trim, and Edit content sections in place. Its
trim ranges, playback speed, focus filters, OPTA-style event rows, and
transcript edits are mocked local state; the save actions are the seam where a
future clip-edit API should replace local persistence. Both preview surfaces —
the video-level Preview mode and the clip's Preview section — render
`ClipPreviewFeatures`, which shares the full transcript, expanding focus
filters, and aligned event list. Enabled captions remain on the shared player
through Preview, Edit clips, Captions, and Export. Export options remain
frontend-only until a render service is connected.

Project clip sources remain separate in the contract: `events` are detected
automatically during upload, while `generatedClips` are created by explicit
agent requests. They are presented together under the project-scoped Generated
clips route, but retain separate section labels and page-owned mutations so
source provenance is not lost. The video editor's add-clip menu keeps the same
split with **Detected events** before **User-generated clips**, and video
outputs in every menu carry the video glyph.

Both sources share one title shape — `23′ · YELLOW CARD · Alex Rivera`. Compose
it with `formatClipTitle` (`src/lib/clipTitle.ts`); a `DetectedEvent` stores the
`minute`, `eventType`, `player`, and `country` parts it was built from so the
editor's event log and metadata columns read structured fields instead of
parsing the title or description back apart.

`AgentPreviewPanel` is the single right-hand agent panel — Project media, the
video-project selector, and the video editor. A newly composed agent and one
that has already answered both render it, so the two states cannot drift.
Clip previews never replace the panel: every green preview action opens the
shared `ClipPreviewModal`. Its `useAgentPreviewState` hook holds panel,
media-view, selected-clip-modal, and selected-output state because conversation
cards and panel cards drive the same preview and editor experiences.

`HomePage` owns whether the rail is collapsed. Collapsing unmounts `AppSidebar`
and leaves only `SidebarToggleButton` at the top left; the same component is the
collapse control inside the rail.

User-uploaded media and generated media each have one shared library component.
The full-page project routes and the agent-side Project media panel provide
different layout density only; upload, preview, selection, rename, and delete
callbacks still mutate the same `Project` state in `HomePage`.

Every destructive entry point composes the shared `ConfirmDeleteModal` before
invoking its delete callback. Every segmented control composes
`StudioContentSwitcher` (Figma 211:40760), which is the only place the track,
equal-width segments, and selected-pill treatment are defined — including the
override that keeps the Figma lifted fill instead of the inset ring cake& uses
for a selected segment in the dark themes. The chat legibility scrim belongs to
`HomeBackground`, not the conversation component: it is rendered only while an
agent response is active and peaks near the first horizontal third of the
viewport where the conversation sits.

`StudioScrollbarGlobals` gives every native overflow region the same 2px-rest /
8px-interaction thumb. Bounded cake& scroll areas compose `StudioScrollbar`,
which applies that contract to Radix's custom vertical and horizontal bars.
`TooltipIconButton` is the app-wide icon-only action: it preserves cake& button
behavior and adds a portalled, below-positioned tooltip using the same label.

`ClipLibraryCard` is the single clip-card implementation. Its grid, suggested,
and compact presentations share the same 14px title and `ClipPreviewButton`;
the landing page, generated-media libraries, and agent results only supply
surface-specific metadata and trailing actions. `FullClipPreview` owns the
complete player, transcript, download, and add-to-video experience used by the
agent panel and `ClipPreviewModal`; `AddClipMenu` is shared by card and preview
surfaces. `RecordingBadge` is the shared duration/status pill and uses the
approved concentric recording asset instead of cake&'s generic dot. The landing
page keeps suggested-clip ordering as local presentation state. **Edit in video
editor** sends the ordered IDs with a readable request; after the simulated
agent verification finishes, `AIAgentWorkspace` creates and opens the mocked
`ProjectVideoOutput`. Keep IDs as the machine contract instead of parsing the
multiline prompt. `MediaPlayer` / `useMediaPlayer` are the shared simulated
player chrome and lifecycle, and `PromptControls` owns the prompt field and
suggestion affordances used by project, empty-agent, and active-agent surfaces.
Creating or selecting that output in the agent panel opens the video editor
section (Figma 266:27506). A video with no clips replaces the player with a
same-size empty frame rather than showing a blank preview.

Never call `fetch` (or a third-party SDK) from a page or presentational component.

## Theme

- Sign-in uses `dark.a`.
- `index.html` `data-theme` and `CakeProvider` `mode` must match (see AGENTS.md).
- Product-specific Figma values without an exact cake& equivalent live only in
  `src/styles/sports-tokens.ts`; do not duplicate those literals in components.

## Media

Static files under `public/media` are referenced by absolute paths
(`/media/login/player-kick.webm`). Prefer WebM with MP4 `<source>` fallback.
Thinking animations are small WebMs for UI chrome, not full-screen backgrounds.

## Demo-only behavior and backend ownership

The scaffold deliberately simulates several production concerns. These are
integration seams, not completed features:

- `UploadDropzone` intercepts activation while `DEMO_UPLOAD_BYPASS` is true.
  `uploadProjectVideo` therefore receives a filename, not a `File`. A real
  implementation must forward file bytes, expose upload and processing states,
  and handle cancellation/errors.
- `HomePage` is the in-memory controller for projects, chats, media, clips, and
  videos. Its immutable callbacks define the UI's expected mutations, but each
  must become a typed API operation when persistence is introduced. Choose and
  document an optimistic-update/rollback policy before wiring them.
- New project/chat IDs use `crypto.randomUUID()` and video IDs use `Date.now()`.
  Treat both as temporary client IDs and replace/reconcile them with server IDs.
- `AIAgentWorkspace` uses cancellable timers to stage words, reasoning cards,
  and completion. Replace that sequence with the backend's streaming/event
  protocol; preserve effect cleanup so switching chats cannot leak updates.
- Players render thumbnails and simulated clocks. Download and export actions
  only show success toasts. They require real media URLs, playback, render-job
  status, and failure handling.
- `VideoEditorPanel` keeps clip edits, caption options, and export options in
  component state. `clipEditorSaves` is keyed by clip ID and survives mode
  changes only while that editor instance stays mounted. Persist those settings
  in the video-output contract before relying on them.
- Transcript focus and detected-event editing are UI demonstrations. Labels
  mentioning OPTA do not represent an active OPTA integration.

## Replacing a mock

Example for auth:

1. Keep `SignInRequest` / `SignInResponse` in `src/types/auth.ts`.
2. Rewrite `signIn` in `src/api/auth.ts` to hit the real endpoint.
3. Map HTTP errors into the existing `SignInError` codes (or extend the union
   carefully and update callers).

No router is required yet; `SignInPage` swaps to `HomePage` after mock auth.
Upload lives in `src/api/projects.ts` (`uploadProjectVideo`), but its production
signature must expand from a filename to the selected `File`. Keep picker logic
in `UploadDropzone`, orchestration in the page/controller, and transport in the
API module.
