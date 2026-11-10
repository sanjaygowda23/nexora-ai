# Architecture

This document explains how Alder is put together and why.

## 1. Overview

The project is one Vite + React + TypeScript application with two experiences that share a design system:

| Experience | Routes | Layout | Theme |
|---|---|---|---|
| Marketing site | `/`, `/solutions`, `/platform`, `/industries`, `/case-studies(/:id)`, `/contact` | `MarketingLayout` (Navbar, Footer, skip link) | Always dark, with one light "paper" section for rhythm |
| Operations console | `/app/sign-in`, `/app/*` | `AppLayout` (collapsible sidebar, top bar, ⌘K) | User-selectable light / dark / system |

```
RouterProvider (createHashRouter)
└── Root  ─ ScrollToTop · ErrorBoundary · Suspense
    ├── MarketingLayout ─ 7 lazy pages + 404
    ├── /app/sign-in
    └── RequireSession ─ AppLayout ─ 8 lazy pages
```

## 2. Routing

- **Data router (`createHashRouter`).** Hash URLs make every deep link work on static hosting without rewrites. The data-router API is required for `useBlocker`, which powers the builder's "Save changes before leaving?" dialog.
- **Lazy routes.** Every page is `React.lazy`. Vite's manual chunks hold only `react` and `framer-motion`; Recharts and React Flow are left to automatic splitting, so they download only with console routes. The marketing entry preloads three files.
- **Protected-style routes.** `RequireSession` redirects to `/app/sign-in` (preserving `from`) when no demo session exists. It is deliberately not real auth — no credentials are collected.
- **URL as state.** Filters, search, sort, view mode, pagination, settings tab and dialogs (`?new=1`) live in search params, so every view is shareable and survives reloads and back/forward.
- **In-page anchors** (`#/solutions#agents`) are resolved by `ScrollToTop`, which retries briefly while a lazy page mounts.

## 3. Design system

**Tokens** (`src/styles/tokens.ts`) are the single source of brand truth: the ink scale (950→100), paper surfaces, electric / violet / signal accents, status colours, type families, a fluid display scale (`display-xl/lg/md`) and easing curves. Tailwind consumes them, and so do JS-driven visuals (canvas, SVG, charts, React Flow).

**Semantic theme variables** (`src/styles/globals.css`) follow the shadcn convention: `--background`, `--surface`, `--card`, `--primary`, `--muted-foreground`, `--border`… defined for `:root` (light) and `.dark`. Components only reference semantic names, so the console flips theme by toggling one class on `<html>`.

`tailwind-merge` is extended with the custom type scale. Without it, `cn("text-display-lg", "text-white")` would drop the size class, treating it as a colour.

**Primitives** (`src/components/ui`) are shadcn-style wrappers over Radix: Button (with the signature *signal dot* that blooms into an arrow on hover), Input/Textarea, Select, Dialog, DropdownMenu, Tabs, Switch, Tooltip, Progress, Badge, Skeleton, EmptyState/ErrorState, and `FormField`.

`FormField` wires label, hint, error, `aria-invalid` and `aria-describedby` onto its control. Because a Radix `Select` root renders no DOM node, it forwards those props to the `SelectTrigger` instead.

## 4. State

| State | Where | Persistence |
|---|---|---|
| Agents, workflows, user-generated logs, settings, session | `AppStoreProvider` (React context) | `localStorage` under `alder:v1:*` (versioned namespace) |
| Filters, pagination, tabs, dialogs | URL search params | URL |
| Builder canvas (nodes/edges/selection/run state) | Local `useNodesState` / `useEdgesState` | Saved to the store explicitly (Save / ⌘S / Save & leave) |
| Sidebar collapsed | `useLocalStorage` | `localStorage` |

- Storage access is wrapped in `try/catch`; the demo still runs in private windows.
- Mock data is generated with a seeded PRNG, so charts and logs are stable across reloads.
- `useSimulatedLoad` adds short, realistic latency, so skeleton states are real code paths, not decoration.
- Context value and callbacks are memoised; React Flow custom nodes are `memo`'d; charts receive memoised series.

## 5. Workflow builder

```
WorkflowBuilder
├── Palette           ─ HTML5 drag source + click-to-add (touch & keyboard)
├── ReactFlow canvas  ─ custom `alder` node type, smoothstep edges, MiniMap, Controls
├── Properties panel  ─ type-aware inputs generated from node config
└── Execution log     ─ live, aria-live step stream
```

- **Node model.** `FlowNodeData = { kind, variant, label, config, run }`. `kind` (trigger · ai · condition · action) decides handles, colour and icon. Conditions expose `true`/`false` source handles.
- **Validation** (`engine.ts`) runs before every execution. It requires at least one trigger, every node reachable from a trigger, no cycles (DFS colouring), and an outgoing branch on every condition. On failure, the offending node is selected and the view zooms to it.
- **Execution** is a breadth-first traversal from the triggers. Each wave shows *running*, then *success*, and animates the outgoing edges. Conditions are evaluated against a simulated payload; the user controls its confidence from the canvas. The untaken branch's subtree is marked *skipped*. *Inject failure* fails the first action node to demonstrate error handling. Runs can be stopped. Results go to the run log and to the global activity feed, and they update the workflow's `lastRun`.
- **Persistence.** Save strips transient run state before writing. Unsaved changes are guarded both in-app (`useBlocker`) and on tab close (`beforeunload`).

## 6. Motion

- Framer Motion handles entrance reveals (`Reveal`, staggered variants), shared-layout indicators (`layoutId` tabs and nav), presence animations and scroll-linked transforms.
- `LetterReveal` animates each character through blur → electric → final colour. Words are kept unbroken, and screen readers get the plain sentence via `aria-label`.
- `HorizonGlow` paints an 80×48 `ImageData` buffer each frame and lets CSS upscale it. This produces a perfectly smooth gradient for about 4k pixels of work per frame. An `IntersectionObserver` pauses it off-screen.
- SVG packets use SMIL `animateMotion`, which runs off the main thread with no React renders.
- `prefers-reduced-motion` disables animation loops and SMIL packets, and shortens CSS transitions. The console has its own "Reduce motion" preference for execution speed.

## 7. Data visualisation

Charts use one validated categorical palette: `#4C7DFF, #C4861E, #9A62F5, #16998A`, in fixed order. It was checked with a CVD/contrast validator against both `#0D121E` and `#FFFFFF`:

- lightness band ✓
- chroma floor ✓
- worst adjacent CVD ΔE ≈ 18 ✓
- normal-vision ΔE ≈ 27 ✓
- ≥ 3:1 contrast ✓

The rules followed throughout:

- **One axis per chart.** Spend and latency are separate charts rather than a dual-axis chart.
- **Recessive grids.** Grid lines and axes stay in the background.
- **Readable tooltips.** Tooltips show values in text ink, with a coloured key beside them.
- **Legends.** Every multi-series chart has a legend.
- **Table views.** A table view is available for the usage trend.

## 8. Accessibility

- **Structure.** Semantic landmarks with a skip link, one `h1` per page and ordered headings.
- **Labels and errors.** Every form control is labelled. Errors use `role="alert"` and are linked through `aria-describedby`.
- **Keyboard.** Tabs, menus, selects and dialogs come from Radix (focus trap, escape, roving focus). The custom tab lists support arrow keys, the architecture diagram supports Tab and Enter, and the command palette is a combobox with active-descendant.
- **Live regions.** Live regions announce the event stream, the calculator output and the execution log.
- **Focus.** Focus-visible rings appear everywhere, and touch targets are at least 32px in the console.

## 9. Performance

- **Code splitting.** Route-level splitting, with heavy libraries isolated to the console.
- **No raster images.** Every visual is SVG, CSS or canvas, so there is nothing to optimise or lazy-load.
- **Fonts.** Fonts are preconnected and use `display=swap`.
- **Cheap animation.** Animations favour `transform` and `opacity`, and the canvas loop pauses off-screen.

## 10. Extending

- **New marketing page.** Add the data to `src/data`, compose `PageHero` with sections, then register a lazy route.
- **New node type.** Add a `PALETTE` entry in `workflow/templates.ts`, a colour and icon in `workflow/meta.ts`, and, if needed, logic in `engine.ts`.
- **Real backend.** Replace `AppStore` actions with API calls (React Query is a natural fit). The component layer already handles loading, empty and error states.
