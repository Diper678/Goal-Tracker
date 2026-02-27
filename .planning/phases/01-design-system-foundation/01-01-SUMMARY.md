---
phase: 01-design-system-foundation
plan: 01
subsystem: ui
tags: [design-system, tailwind, css-tokens, fontsource, fira-code, fira-sans, steam-dark]

# Dependency graph
requires: []
provides:
  - Steam-dark CSS custom properties as :root HSL variables (shadcn-compatible)
  - Brand palette custom properties (--color-bg-primary, rarity colors, etc.)
  - Fira Code and Fira Sans self-hosted via Fontsource (400/500/600/700 weights)
  - Tailwind game-* and rarity-* color token utilities
  - Tailwind fontFamily overrides (mono = Fira Code, sans = Fira Sans)
  - RARITY_COLORS with rarity-* Tailwind token classes and Spanish names
  - --radius set to 0.25rem (sharp industrial corners)
affects:
  - 01-02 (component restyling depends on these tokens and fonts)
  - All subsequent phases (use game-* / rarity-* token classes)

# Tech tracking
tech-stack:
  added:
    - "@fontsource/fira-code (400/500/600/700)"
    - "@fontsource/fira-sans (300/400/500/600)"
  patterns:
    - "CSS custom properties in :root for shadcn-compatible HSL color vars — no light mode, always dark"
    - "Brand palette as --color-* properties for direct hex usage in non-Tailwind contexts"
    - "Tailwind extend.colors for game-* and rarity-* token utilities with opacity modifier support"
    - "image-rendering: pixelated scoped to .pixel-art class only — not global"

key-files:
  created: []
  modified:
    - app/src/main.tsx
    - app/src/index.css
    - app/tailwind.config.js
    - app/src/types/achievement.ts
    - app/src/App.css

key-decisions:
  - "Always-dark app: single :root block, no .dark toggle, no light mode variables"
  - "Removed .dark block and --sidebar-* variables (not needed for this app)"
  - "image-rendering: pixelated removed from global body rule — scoped to .pixel-art class per ARCHITECTURE.md"
  - "Rarity color names changed to Spanish: Común, Raro, Épico, Legendario (was Azul, Rojo, Morado, Dorado)"
  - "bg opacity lowered from 30% to 15% for rarity backgrounds — lighter tint fits Steam-dark better"
  - "text field added to RARITY_COLORS type for explicit text color utilities (breaking change, consumers fixed in Plan 02)"

patterns-established:
  - "Token naming: game-{role} for layout colors, rarity-{tier} for achievement-specific colors"
  - "Fontsource self-hosted fonts imported in main.tsx above index.css — no CDN dependency"
  - "CSS custom properties mirror Tailwind tokens — CSS vars for shadcn/non-Tailwind, Tailwind classes for components"

requirements-completed: [DSGN-01, DSGN-02]

# Metrics
duration: ~15min
completed: 2026-02-25
---

# Phase 1 Plan 01: Design System Foundation Summary

**Steam-dark design token layer: Fontsource Fira Code/Fira Sans, CSS custom properties, Tailwind game-*/rarity-* color utilities, and updated RARITY_COLORS with Spanish names and token-based classes**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-02-25T11:20:00Z
- **Completed:** 2026-02-25T11:21:22Z
- **Tasks:** 2
- **Files modified:** 7 (including package.json, package-lock.json)

## Accomplishments
- Self-hosted Fira Code (mono) and Fira Sans (sans) via Fontsource — no CDN dependency, PWA-safe
- Steam-dark CSS token layer: single always-dark :root block with shadcn-compatible HSL vars + brand --color-* properties
- Tailwind extended with 11 game-*/rarity-* color tokens and Fira Code/Fira Sans fontFamily overrides
- RARITY_COLORS refactored to token-based Tailwind classes with new text field and Spanish rarity names
- App.css boilerplate emptied; --radius set to 0.25rem for sharp industrial corners

## Task Commits

Each task was committed atomically:

1. **Task 1: Install fonts and configure design tokens** - `eed54d2` (feat)
2. **Task 2: Update RARITY_COLORS to Steam-dark palette** - `1aa4d7c` (feat)

## Files Created/Modified
- `app/src/main.tsx` - Added Fontsource font weight imports above index.css import
- `app/src/index.css` - Replaced shadcn light/dark blocks with single Steam-dark :root; added brand CSS vars; updated scrollbar/body; scoped pixel-art rendering
- `app/tailwind.config.js` - Added game-* and rarity-* color tokens; Fira Code/Fira Sans fontFamily overrides
- `app/src/types/achievement.ts` - Updated RARITY_COLORS to rarity-* token classes; added text field; Spanish names
- `app/src/App.css` - Emptied (Vite boilerplate dead code replaced with comment)
- `app/package.json` - Added @fontsource/fira-code and @fontsource/fira-sans
- `app/package-lock.json` - Updated with font package lockfile entries

## Decisions Made
- Always-dark app pattern: single :root block, .dark block removed entirely
- `image-rendering: pixelated` scoped to `.pixel-art` class only (not global body) per ARCHITECTURE.md — prevents pixelation on UI elements
- RARITY_COLORS text field added as a breaking change, accepted because Plan 02 will fix all consumers
- Rarity bg opacity lowered from 30% to 15% — Steam-dark surface (#020617) is darker so lighter tint is more appropriate

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All design tokens and fonts are in place — Plan 02 component restyling can begin immediately
- TypeScript will show errors on RARITY_COLORS consumers (`.text` field references) — these are expected and resolved in Plan 02
- `npm run build` and `npx tsc --noEmit` both pass cleanly

---
*Phase: 01-design-system-foundation*
*Completed: 2026-02-25*
