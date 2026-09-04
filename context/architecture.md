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

`HomePage` currently owns the demo's project-scoped video outputs. A
`ProjectVideoOutput` stores its title and generated clip IDs on its parent
`Project`; replace those state callbacks with API calls when output persistence
is wired to the backend.

Project clip sources remain separate in the contract: `events` are detected
automatically during upload, while `generatedClips` are created by explicit
agent requests. Both currently use page-owned demo mutations for rename/delete.

Never call `fetch` (or a third-party SDK) from a page or presentational component.

## Theme

- Sign-in uses `dark.a`.
- `index.html` `data-theme` and `CakeProvider` `mode` must match (see AGENTS.md).

## Media

Static files under `public/media` are referenced by absolute paths
(`/media/login/player-kick.webm`). Prefer WebM with MP4 `<source>` fallback.
Thinking animations are small WebMs for UI chrome, not full-screen backgrounds.

## Replacing a mock

Example for auth:

1. Keep `SignInRequest` / `SignInResponse` in `src/types/auth.ts`.
2. Rewrite `signIn` in `src/api/auth.ts` to hit the real endpoint.
3. Map HTTP errors into the existing `SignInError` codes (or extend the union
   carefully and update callers).

No router is required yet; `SignInPage` swaps to `HomePage` after mock auth.
Upload lives in `src/api/projects.ts` (`uploadProjectVideo`) so production can
replace the timer with a real multipart upload without touching the dropzone UI.
