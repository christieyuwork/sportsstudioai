# Sports Studio AI — agent instructions

This is the **Sports Studio AI** frontend scaffold. Product intent and handoff
rules: read [`context/project.md`](context/project.md) and
[`context/architecture.md`](context/architecture.md) first.

UI is built with **cake&**, Lenovo's design system (`@cake-admin/cakeand`).
Compose what cake& already exports; do not invent a parallel design system.

## Before you write any UI

1. Read `context/project.md` (scope, sports styling, handoff expectations).
2. Read `context/architecture.md` (UI vs mocked API boundary).
3. Read `context/cake-components.md` — inventory of package exports.
4. Before using a component you have not used yet in this session, read
   `context/components/<name>.md` for props, usage, and accessibility.

**Do not guess a component's API.** If it is not in the cake index, it does not exist.

## Hard rules

1. **One import path.** `import { X } from '@cake-admin/cakeand'`. There are no
   deep paths — `@cake-admin/cakeand/Button` does not resolve.
2. **One `CakeProvider`.** It is already mounted in `src/App.tsx`. Never add a
   second: it writes `data-theme` to `<html>`, and two of them fight over it.
3. **Never hardcode a color, spacing, radius, or type size** unless documenting a
   sports exception (e.g. glass overlay on video in `src/styles/sports-theme.ts`).
   Prefer CSS custom properties — `var(--color-…)`, `var(--space-…)`,
   `var(--radius-…)`, `var(--type-size-…)`. Full list: `context/cake-tokens.md`.
4. **Token names are exact.** They are generated from Figma variables. Do not
   guess by analogy — `--color-surfaces-canvas` exists, `--color-surfaces-background`
   does not, and the second one fails silently as an empty string.
5. **Do not install another UI library.** No MUI, no Tailwind, no shadcn, no
   Chakra, no Bootstrap. If cake& lacks something, compose it from cake& parts,
   or build it with `styled-components` + `radix-ui` (both already dependencies)
   styled with tokens. **Ask before inventing a custom control** that replaces a
   cake& component. Allowed without asking: reordering containers inside cake
   components, nesting cake components, swapping icons, recoloring, transparency/blur.
6. **Icons come from `lucide-react`.** That is what cake& itself uses.
7. **Style with `styled-components`.** Already a dependency, already deduped in
   `vite.config.ts`. Never add a second styling library or a second copy.
8. **Do not hand-edit generated cake context.** `context/cake-components.md`,
   `context/cake-tokens.md`, and `context/components/**` are generated upstream.
   Refresh with `npm run cake:update`. **Do** maintain `context/project.md` and
   `context/architecture.md` as this product evolves.
9. **Theme changes touch two files.** `data-theme` on `<html>` in `index.html`
   and the `mode` passed to `CakeProvider` in `src/App.tsx` must agree, or the
   first paint flashes the wrong theme. Change both together.
10. **Keep the stylesheet import at the top of `src/main.tsx`.** It looks
    redundant because the package imports its own CSS, but it fixes the cascade
    order: anything imported below it reliably overrides cake& values. Add your
    own stylesheets after it, never before.
11. **Keep `resolve.dedupe` in `vite.config.ts`.** Removing it lets a second copy
    of `styled-components` in, and cake& components then render unstyled with no
    error at all.
12. **UI never calls the network.** Put async work in `src/api/` with types in
    `src/types/`. Keep mocks until a real backend is wired; do not invent a
    backend in this repo.
13. **Keep the README current** when structure, scripts, or handoff steps change.

## Portalled components

`Modal`, `Dropdown`, `SimpleTooltip`, `RichTooltip`, `Breadcrumb`,
`NumberDropdown` and `Pagination` render through a Radix portal into
`document.body`, outside the React tree. They are themed only because
`CakeProvider` puts `data-theme` on `<html>`. Do not pass `scope="subtree"` to
the provider if you use any of them.

## Verify your work

```bash
npm run dev      # look at it in a browser
npm run build    # must exit 0 — typechecks and bundles
```

A change that has not been run is not done. If you changed layout or styling,
look at the result before reporting success.

## Canonical documentation

- Product / handoff: `context/project.md`, `README.md`
- Architecture: `context/architecture.md`
- cake& Storybook: <https://cake.lenovo.com/storybook/>
