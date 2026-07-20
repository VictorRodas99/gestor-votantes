# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SPA de **gestión de campaña electoral** (Pilar, Ñeembucú, Paraguay). El rol es frontend; el
backend es un sistema CodeIgniter 3 heredado que expone una API REST de solo lectura sobre una
DB con estructura ajena a elecciones. Los votantes vienen **precargados desde el padrón**: la app
los **enriquece** (voto seguro, referente, visita, transporte…), aunque los votantes no existenes en el padrón se cargan desde cero.

Idioma: dominio, nombres de archivo, comentarios y UI en **español**. Archivos en **kebab-case**.

## Commands

Usar **bun** (no npm/npx):

```bash
bun run dev            # servidor de desarrollo Vite
bun run build          # tsc -b && vite build
bun run types          # tsc --noEmit (type-check sin emitir)
bun run lint           # eslint . --fix
bun run format         # prettier --write .
bun run format:check   # prettier --check
```

No hay framework de tests configurado. Verificar con `bun run types` + `bun run lint`.

DB local de desarrollo (opcional, estructura heredada `sysventas`, MySQL 5.7 vía Docker):

```bash
docker compose -f database/compose.yaml up -d   # db en :3306, phpMyAdmin en :8081
```

## Stack

React 19 + **React Compiler** (via `@rolldown/plugin-babel` en `vite.config.ts` — no escribir
`useMemo`/`useCallback` manuales salvo necesidad real), TypeScript, Vite, React Router 7 (data
router), TanStack Query, react-hook-form + Zod, MUI v9 + Tailwind v4, ky (HTTP), Leaflet (mapas),
Sonner (toasts), Fuse.js (fuzzy), use-debounce.

## Arquitectura de datos (services → hooks → componentes)

Flujo estricto en tres capas, no saltárselas:

1. **`src/lib/http.ts`** — instancia `ky` con `prefix: API_URL`, retry y un `beforeError` que
   extrae `message` del body. Todos los servicios la usan.
2. **`src/services/*.ts`** — llaman a la API y **castean el crudo al modelo de dominio**. Esto es
   crítico por las rarezas de la API (ver abajo): todo llega como string. Patrón: tipo `XxxRaw`
   (todo string) → función `mapXxx` → tipo de dominio tipado. Ej.: `services/votantes.ts`.
3. **`src/hooks/services/*.ts`** — envuelven los servicios en React Query (`useQuery`,
   `useInfiniteQuery`). Query keys parten de una constante base (ej. `BASE_VOTANTE_QUERY`).
   Los componentes consumen estos hooks, nunca los servicios directamente.

### Rarezas de la API (imprescindible tenerlas en cuenta)

- **Todos los valores de los registros son strings**, incluso números, FKs y booleanos
  (`"afiliacion":"0"`, `"local_votacion_id":"1"`). El map del servicio **debe castear**.
- La API responde **200 + texto plano ante errores**, así que `.json()` lanza `SyntaxError`
  (no `HTTPError`). Los servicios envuelven todo en un `Error` legible — mantener ese patrón.
- **`total_items` no es fiable en catálogos** (`/sectores`, `/local_votacion`): devuelve el nº de
  filas de la página, no el total. Solo es total real en `/votantes`.
- **Algunos filtros los ignora el server.** Regla: filtrar solo por campos reales del votante;
  los que la API ignora se envían igual (los honrará cuando el proveedor los habilite) y se anotan
  en `notes/api/pendientes-server.md`.
- La documentación viva y verificada de la API está en `notes/api/` (gitignored, local).

`API_URL` (`src/constants/config.ts`) apunta por defecto a producción
(`https://elecciones.appbinario.com/...`); se puede override con `VITE_API_URL`. La DB Docker
local es **otra base** distinta de la que sirve la API.

## Routing y navegación (todo sale de `src/config/modules.ts`)

`modules` es la **única fuente de verdad**: define cada módulo (path, ícono, componente lazy, si
va en la bottom-nav). De ahí derivan:

- `src/router.tsx` — genera las rutas desde `modules` (todo bajo `<AppLayout>` con `errorElement`).
- La navegación: `bottomNavItems` (móvil) y `sidebarNavItems` (desktop), más `resolveActiveKey`
  (compartido por ambas navs para no divergir; Inicio matchea exacto, el resto por prefijo).

Agregar un módulo = agregar una entrada a `modules`, no tocar el router a mano. Las páginas se
cargan con `lazy()` (code-splitting por ruta).

## Wizard de votante (`src/pages/votante-wizard.tsx` + `src/forms/votante/`)

Formulario multi-paso con **un único `useForm`** en el contenedor, compartido a los pasos vía
`FormProvider`/`useFormContext` (los pasos no crean su propio form). El **schema de Zod es la
única fuente de verdad** de tipos y validación:

- `paso-uno/dos/tres.schema.ts` — un sub-schema por paso.
- `wizard.schema.ts` — los compone (`.extend(...shape)`) y agrega `superRefine` para reglas
  entre-campos (ej.: referente obligatorio, `valor_inc` requerido si `inc`). `WizardFormData`
  se deriva con `z.infer` — no escribir interfaces a mano.
- Componentes de paso en `src/components/wizard/`.

Ver `notes/wizard-form-architecture.md` para el detalle de la arquitectura.

## Estilos: MUI v9 + Tailwind v4 (puente por CSS variables)

- `src/theme.ts` usa `cssVariables: true` → MUI emite tokens `--mui-*` en `:root`, que el bloque
  `@theme inline` de `src/index.css` mapea a utilidades Tailwind (`bg-primary`, `text-secondary`…).
  Usar los tokens del tema, no colores hardcodeados. Design system: "Civic Vanguard"
  (ver `notes/design/`).
- El orden de capas CSS se declara en `main.tsx` (`@layer theme, base, mui, components, utilities`)
  con `StyledEngineProvider enableCssLayer`. Si hay dudas de interop MUI/Tailwind, invocar la skill
  `material-ui-tailwind`.

## Convenciones (enforced / esperadas)

- **Íconos MUI siempre por subruta**: `import X from '@mui/icons-material/AddRounded'`, nunca desde
  el barril `@mui/icons-material`. Está **prohibido por ESLint** (`no-restricted-imports`). En UI
  **nunca emojis**, siempre ícono de Material UI.
- `consistent-type-imports` con `separate-type-imports` (regla ESLint): usar `import type`.
- Prettier: sin `;`, comillas simples, sin `trailingComma`, `printWidth` 80, 2 espacios. Corre con
  `organize-imports` y `tailwindcss` plugins.
- No escribir comentarios que solo repiten el código; comentar solo el **porqué** no evidente.
- Para trabajo pesado (normalizar, fuzzy, formateo, debounce, http) usar la **librería ya elegida**
  antes que un util casero — hay guías en `notes/` (formatting, use-debounce, http). Consultarlas
  antes de elegir una librería nueva.

## Notas locales

`notes/` y `database/` están **gitignored** (base de conocimiento local, no versionada). Contienen
documentación verificada de la API, planes, refactors y el design system — vale la pena leerlos
antes de tocar áreas relacionadas, aunque no estén en git.
