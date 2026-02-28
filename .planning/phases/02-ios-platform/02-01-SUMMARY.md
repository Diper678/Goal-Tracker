---
phase: 02-ios-platform
plan: 01
subsystem: ui
tags: [pwa, ios, sharp, icons, splash-screen, vite-pwa]

# Dependency graph
requires:
  - phase: 01-design-system-foundation
    provides: Design tokens, rarity colors, Steam-dark palette (#020617 bg, #0F172A surface)
provides:
  - Gold trophy SVG icon with correct xmlns namespace (app/public/icon.svg)
  - 180x180 PNG for iOS home screen (app/public/apple-touch-icon.png)
  - 192px and 512px PWA manifest icons (app/public/pwa-192x192.png, pwa-512x512.png)
  - 28 iOS splash screen PNGs covering 14 device sizes (portrait + landscape)
  - Node script for SVG-to-PNG conversion (app/scripts/generate-icons.mjs)
  - Node script for splash screen generation (app/scripts/generate-splash-screens.mjs)
  - Updated index.html with all iOS PWA meta tags (viewport-fit=cover, apple-touch-icon, splash links, app title)
  - Updated vite.config.ts manifest with PNG icon entries
affects:
  - 02-ios-platform (plans 02-05 build on the viewport-fit=cover and safe area foundation)

# Tech tracking
tech-stack:
  added:
    - sharp@0.32.6 (Node 18.12.0 compatible SVG-to-PNG conversion)
    - "@vite-pwa/assets-generator (installed as dev dep, config reference only — CLI unusable on Node 18.12.0)"
  patterns:
    - Manual splash screen generation using sharp with device list (14 devices, 28 files)
    - Trophy SVG with radialGradient background, gold (#FACC15) icon on dark (#020617) gradient

key-files:
  created:
    - app/public/icon.svg (trophy SVG icon — correct xmlns namespace)
    - app/public/apple-touch-icon.png (180x180 PNG)
    - app/public/pwa-192x192.png (192x192 PNG)
    - app/public/pwa-512x512.png (512x512 PNG)
    - app/public/apple-splash-*.png (28 files, 14 device sizes x2 orientations)
    - app/scripts/generate-icons.mjs (sharp SVG-to-PNG script)
    - app/scripts/generate-splash-screens.mjs (manual splash screen generator, Node 18 compat)
    - app/pwa-assets.config.ts (@vite-pwa/assets-generator config — for future use when Node upgrades)
  modified:
    - app/index.html (added viewport-fit=cover, apple-touch-icon link, 28 splash links, apple-mobile-web-app-title)
    - app/vite.config.ts (updated includeAssets, manifest icons now include PNG entries)

key-decisions:
  - "Used sharp@0.32.6 instead of latest — Node 18.12.0 requires sharp <0.33.x; downgraded to maintain compatibility"
  - "Manual splash screen generation script instead of @vite-pwa/assets-generator CLI — CLI's bundled sharp requires Node >=18.17.0"
  - "14-device splash screen list covers all major iPhone and iPad sizes from iPhone SE to iPhone 14 Pro Max"
  - "pwa-assets.config.ts retained as reference config — functional when Node is upgraded to 18.17+"

patterns-established:
  - "Icon pipeline: single icon.svg source -> sharp resize -> apple-touch-icon.png + pwa-*.png"
  - "Splash screen background: #0F172A (surface color) with icon centered at 40% of smaller dimension"

requirements-completed: [IOS-02, IOS-03]

# Metrics
duration: 4min
completed: 2026-02-28
---

# Phase 2 Plan 01: iOS App Icon and Splash Screen Assets Summary

**Gold trophy SVG icon (FACC15 on dark gradient) with 28 iOS splash screen PNGs and fully configured index.html iOS PWA meta tags — replaces broken MathML namespace icon and white flash on launch**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-28T14:53:17Z
- **Completed:** 2026-02-28T14:57:06Z
- **Tasks:** 2
- **Files modified:** 35 (icon.svg, 3 PNG icons, 28 splash PNGs, 2 scripts, pwa-assets.config.ts, index.html, vite.config.ts)

## Accomplishments
- Replaced malformed icon.svg (wrong xmlns MathML namespace) with a gold trophy SVG on dark radial gradient using legendary rarity color (#FACC15)
- Generated apple-touch-icon.png (180x180), pwa-192x192.png, pwa-512x512.png from the SVG source via sharp
- Generated 28 iOS splash screen PNGs covering all major iPhone and iPad devices (portrait + landscape)
- Updated index.html with viewport-fit=cover, apple-touch-icon link, all 28 splash screen link tags, and apple-mobile-web-app-title
- Updated vite.config.ts manifest with PNG icon entries alongside existing SVG entry
- App builds cleanly with no errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create trophy SVG icon and generate PNG assets** - `c2def6d` (feat)
2. **Task 2: Configure splash screens, update index.html and vite.config** - `567d915` (feat)

## Files Created/Modified
- `app/public/icon.svg` - Gold trophy SVG (fixed xmlns, radialGradient bg, #FACC15 trophy, star accent)
- `app/scripts/generate-icons.mjs` - sharp script to generate icon PNGs from SVG
- `app/scripts/generate-splash-screens.mjs` - manual splash screen generator (14 devices, Node 18 compat)
- `app/pwa-assets.config.ts` - @vite-pwa/assets-generator config (for future Node upgrade)
- `app/public/apple-touch-icon.png` - 180x180 iOS home screen icon
- `app/public/pwa-192x192.png` - 192x192 PWA manifest icon
- `app/public/pwa-512x512.png` - 512x512 PWA manifest icon (any maskable)
- `app/public/apple-splash-*.png` - 28 splash screen PNGs (14 device sizes x portrait + landscape)
- `app/index.html` - Added viewport-fit=cover, apple-touch-icon link, 28 splash links, app title meta
- `app/vite.config.ts` - Updated includeAssets (removed favicon.ico/masked-icon.svg), PNG icons in manifest

## Decisions Made
- Used sharp@0.32.6 (Node 18.12.0 compatible) instead of latest sharp — research spec said sharp ^0.33.x but system Node is 18.12.0 which requires <0.33.0
- Replaced @vite-pwa/assets-generator CLI with a manual script — the CLI bundles its own sharp ^0.33.x which fails on Node 18.12.0; the manual approach covers more devices (14 vs the generator's default list)
- Retained pwa-assets.config.ts as a config artifact for future use when the project upgrades Node

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Manual splash screen script instead of @vite-pwa/assets-generator CLI**
- **Found during:** Task 2 (Configure splash screens)
- **Issue:** `@vite-pwa/assets-generator` bundles sharp ^0.33.x internally. CLI fails on Node 18.12.0 with "Could not load the sharp module — requires ^18.17.0". System Node is 18.12.0 and cannot be changed.
- **Fix:** Created `scripts/generate-splash-screens.mjs` using our already-installed sharp@0.32.6. Script covers 14 device sizes (28 files portrait + landscape) manually, matching the generator's device coverage. All splash PNGs generated successfully.
- **Files modified:** app/scripts/generate-splash-screens.mjs (created), app/pwa-assets.config.ts (config retained as reference)
- **Verification:** All 28 PNGs exist in public/, all link tags added to index.html, build succeeds
- **Committed in:** 567d915 (Task 2 commit)

**2. [Rule 3 - Blocking] sharp downgraded from latest to 0.32.6**
- **Found during:** Task 1 (run generate-icons.mjs)
- **Issue:** `npm install -D sharp` installed sharp@0.33.x which requires Node ^18.17.0; system has 18.12.0
- **Fix:** `npm install -D sharp@0.32.6 --legacy-peer-deps` — installs Node 18.12.0-compatible version
- **Files modified:** app/package.json, app/package-lock.json
- **Verification:** `node scripts/generate-icons.mjs` runs and outputs "Icons generated successfully"
- **Committed in:** c2def6d (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 3 — blocking)
**Impact on plan:** Both fixes required due to Node version constraint. Output is equivalent to plan spec: same icon files, same splash screen coverage, same index.html structure. No scope creep.

## Issues Encountered
- Node 18.12.0 incompatibility with sharp ^0.33.x and @vite-pwa/assets-generator CLI — resolved by downgrading sharp and writing a manual splash screen generator script
- kimi-plugin-inspect-react peer dependency conflict with npm — resolved with `--legacy-peer-deps` flag (pre-existing project issue, not introduced by this plan)

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Trophy icon and all splash screen assets are in place for iOS PWA
- index.html has viewport-fit=cover which is the prerequisite for safe area insets (Plan 02)
- All iOS meta tags in place
- Build succeeds cleanly
- Plans 02-05 can proceed: safe areas, scroll lock, touch targets, PWA manifest validation

---
*Phase: 02-ios-platform*
*Completed: 2026-02-28*
