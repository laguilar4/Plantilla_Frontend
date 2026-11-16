# Frontend Base (React + TypeScript + Vite + Tailwind)

Plantilla reutilizable para las SPAs de los distintos proyectos. Incluye conexión ya resuelta
contra la [API base de NestJS](../Api) (envelope de respuesta, manejo de errores, variables de
entorno), theming claro/oscuro, TanStack Query, enrutamiento y testing configurados.

## Stack

- [React 19](https://react.dev/) + TypeScript 5.9 + [Vite 8](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) (config CSS-first vía `@tailwindcss/vite`, sin
  `tailwind.config.js`)
- [react-router-dom 7](https://reactrouter.com/) (data router)
- [TanStack Query 5](https://tanstack.com/query) para estado de servidor
- `axios` con interceptor que desenvuelve el envelope `{ success, data }` de la API
- Vitest + Testing Library para tests
- ESLint (flat config) + Prettier (con `prettier-plugin-tailwindcss`)

## Estructura

```
src/
├── main.tsx / App.tsx        # bootstrap
├── index.css                  # @import "tailwindcss" + tema y variante dark por clase
├── app/
│   ├── router.tsx             # createBrowserRouter y árbol de rutas
│   └── Providers.tsx          # ErrorBoundary > QueryClientProvider > ThemeProvider > Router
├── config/
│   └── env.ts                 # lectura validada de import.meta.env (falla rápido si falta algo)
├── lib/
│   ├── api-client.ts          # instancia de axios + desenvuelve envelope + ApiError tipado
│   └── query-client.ts        # QueryClient con defaults (staleTime, retry, etc.)
├── types/
│   └── api.ts                  # ApiSuccessResponse / ApiErrorResponse / ApiError, espejo del backend
├── context/
│   └── ThemeContext.tsx        # tema claro/oscuro persistido en localStorage
├── hooks/
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── components/
│   ├── layout/                 # Header, Footer, AppLayout (con <Outlet />)
│   ├── ui/                     # Button, Card, Spinner, ThemeToggle
│   └── ErrorBoundary.tsx
├── features/
│   └── hello/                  # ejemplo end-to-end: api.ts + useGreeting.ts (useQuery)
└── pages/
    ├── HomePage.tsx             # demo real contra GET /hello con loading/error/success
    └── NotFoundPage.tsx
```

## Puesta en marcha

```bash
npm install
cp .env.example .env      # ajusta VITE_API_BASE_URL si la API no corre en localhost:3000
npm run dev
```

Requiere que la [API base](../Api) esté corriendo (`npm run start:dev` allí) para que la página de
inicio pueda consultar `GET /hello`.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL de la API, incluyendo prefijo y versión (`http://localhost:3000/api/v1`) |

`src/config/env.ts` valida que estén presentes al arrancar; si falta una, lanza un error claro en
vez de fallar silenciosamente en el primer fetch.

## Convención de datos

- `apiClient` (axios) ya desenvuelve `{ success: true, data }` — los hooks/servicios reciben `data`
  directamente, no el envelope completo.
- Los errores HTTP se normalizan a `ApiError` (`src/types/api.ts`), con `.message` y `.statusCode`
  listos para mostrar en UI.
- Todo fetch de datos de servidor pasa por TanStack Query (`useQuery`/`useMutation`), no por
  `useEffect` + `useState` manual.

## Theming

`ThemeContext` alterna la clase `dark` en `<html>` y la persiste en `localStorage` (respeta
`prefers-color-scheme` la primera vez). Tailwind 4 está configurado en `index.css` con
`@custom-variant dark (&:where(.dark, .dark *))` para que `dark:` responda a esa clase en vez de
solo a la media query del sistema.

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Type-check (`tsc -b`) + build de producción |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | ESLint con autofix |
| `npm run format` | Prettier sobre `src/` |
| `npm test` | Tests (Vitest, una pasada) |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:cov` | Tests con cobertura |
| `npm run typecheck` | Solo type-check, sin build |

## Añadir un nuevo feature

1. `src/features/<nombre>/api.ts` con las funciones que llaman `apiGet`/`apiPost`/etc.
2. `src/features/<nombre>/use<Algo>.ts` con el hook de TanStack Query (`useQuery`/`useMutation`).
3. `src/pages/<Nombre>Page.tsx` que consume el hook.
4. Registrar la ruta en `src/app/router.tsx`.
5. Reusar `Button`/`Card`/`Spinner` de `components/ui/` y `cn()` para combinar clases de Tailwind.
