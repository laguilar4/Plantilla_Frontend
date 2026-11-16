# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A reusable React + TypeScript SPA base meant to be the starting point for multiple separate
frontend projects, not a single product. It's the counterpart to the sibling [../Api](../Api)
NestJS base — this template's `apiClient` and `types/api.ts` are shaped around that API's specific
response envelope. Changes here should stay generic/reusable — project-specific UI/business logic
belongs in its own `src/features/<name>/` and `src/pages/`, not in `lib/`, `components/ui/`, or
`context/`.

## Commands

```bash
npm install
cp .env.example .env    # adjust VITE_API_BASE_URL if the API isn't on localhost:3000
npm run dev             # Vite dev server on :5173
npm run build           # tsc -b (type-check) then vite build
npm run preview         # serve the production build locally
npm run lint            # eslint --fix
npm run format          # prettier over src/
npm test                # vitest, single run
npm run test:watch
npm run test:cov
npm run typecheck       # tsc -b --noEmit only, no build
```

Run a single test file: `npx vitest run src/components/ui/Button.test.tsx`.

The dev server expects the [../Api](../Api) NestJS base running (`npm run start:dev` there) — the
home page calls its `GET /hello` endpoint live; without it, the page shows the error state rather
than failing to load.

## Architecture

**Data flow is: `features/<name>/api.ts` → TanStack Query hook → page/component.** Every feature
that talks to the backend follows the same three-file shape (see `src/features/hello/` as the
reference): a plain async function using `apiGet`/`apiPost`/etc., a `useQuery`/`useMutation` hook
wrapping it, and a page component that only handles `isPending`/`isError`/`data` — no manual
`useEffect` + `useState` data fetching anywhere.

**`apiClient` (`src/lib/api-client.ts`) already unwraps the API's response envelope.** The NestJS
base wraps every success as `{ success: true, statusCode, data }` and every error as
`{ success: false, statusCode, path, timestamp, message }` (see `../Api/src/common/interceptors`
and `.../filters`). An axios response interceptor here replaces `response.data` with just the
inner `data`, and an error interceptor converts the error envelope into a typed `ApiError`
(`src/types/api.ts`) with `.message`/`.statusCode`. Callers (`apiGet`, etc.) and everything built on
them never see the envelope — they get the payload or a thrown `ApiError` directly. If the backend
envelope shape ever changes, update `types/api.ts` and the interceptor together.

**Env vars are read through `src/config/env.ts`, never `import.meta.env` directly.** It validates
required vars eagerly (throws with a clear message) so a missing `VITE_API_BASE_URL` fails at
startup instead of surfacing as an opaque network error inside a component.

**Tailwind 4 is config-in-CSS, not `tailwind.config.js`.** Everything lives in `src/index.css`:
`@import 'tailwindcss'` pulls in the framework, `@theme` defines design tokens (e.g. `--font-sans`),
and `@custom-variant dark (&:where(.dark, .dark *))` is what makes `dark:` utility classes respond
to the `.dark` class on `<html>` rather than only `prefers-color-scheme`. `ThemeContext`
(`src/context/ThemeContext.tsx`) is what toggles that class and persists the choice via
`useLocalStorage`, seeded from `prefers-color-scheme` on first load.

**Provider nesting order matters** (`src/app/Providers.tsx`):
`ErrorBoundary > QueryClientProvider > ThemeProvider > RouterProvider`. The `ErrorBoundary` is
outermost so a render error anywhere — including inside the router or theme context — still shows
a recoverable fallback instead of a blank page.

**Routing uses `createBrowserRouter`** (`src/app/router.tsx`) with a single root layout route
(`AppLayout`, which renders `Header`/`Footer` around an `<Outlet />`) and a catch-all `*` route to
`NotFoundPage`. New pages are added as children of that layout route, not as separate router trees.

**No global client-state library (Redux/Zustand) is included on purpose** — server state goes
through TanStack Query, and the only cross-cutting client state so far (theme) is a small React
Context. Add a store only when a project actually needs shared client state beyond that.

## Adding a new feature

1. `src/features/<name>/api.ts` — functions calling `apiGet`/`apiPost`/`apiPatch`/`apiDelete`.
2. `src/features/<name>/use<Thing>.ts` — `useQuery`/`useMutation` hook wrapping those functions.
3. `src/pages/<Name>Page.tsx` — consumes the hook, handles loading/error/success.
4. Register the route in `src/app/router.tsx`.
5. Reuse `Button`/`Card`/`Spinner` from `components/ui/` and `cn()` (`src/utils/cn.ts`,
   clsx + tailwind-merge) instead of hand-rolling class concatenation.

## Version pinning note

`typescript` is pinned to `^5.9.3` deliberately, even though `typescript@7.x` (the from-scratch
native-compiler rewrite) is available on the registry — it shipped very recently and hasn't been
validated against this stack (Vite/ESLint/Vitest tooling). Don't bump it across the major version
without deliberately testing compatibility first. Vite 8, React 19, Tailwind 4, and the rest are
pinned to their current latest since those majors are already established/verified against each
other here.
