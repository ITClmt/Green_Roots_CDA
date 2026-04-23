# Green Roots Web

React 19 + TypeScript + Vite SPA.

## Development

```bash
bun dev           # start with hot reload
bun build         # production build
bun lint          # eslint
bun preview       # preview production build
```

## Architecture

```
src/
  app/          root component, routes, providers, layout
  features/     feature modules (auth/, users/...)
  components/   shared UI components
  hooks/        shared custom hooks
  api/          TanStack Query functions
  types/        global TypeScript types
  utils/        helper functions
  assets/       images, fonts, static files
  config/       constants, env config
  lib/          third-party wrappers
```

## Tech notes

- **React Router v7** — declarative mode, `BrowserRouter`
- **TanStack Query v5** — server state, `QueryClient` in `main.tsx`
- **Tailwind CSS v4** — Vite plugin, no config file, `@import "tailwindcss"` in `index.css`
- **lucide-react** — icon library, always use it instead of inline SVGs

## React conventions

- **No unnecessary `useEffect`** — if something can be calculated at render time or handled in an event handler, do not use `useEffect`. See [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).
- `useEffect` is reserved for synchronization with external systems (DOM APIs, WebSockets, timers, etc.).
