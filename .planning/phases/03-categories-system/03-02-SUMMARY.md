---
phase: 03-categories-system
plan: 02
subsystem: ui
tags: [react, typescript, tailwind, categories, filter, stats, lucide-icons]

# Dependency graph
requires:
  - phase: 03-categories-system/03-01
    provides: CategoryType union, CATEGORY_CONFIG, CATEGORY_HEX, getStats.byCategory breakdown
  - phase: 02-ios-platform
    provides: 44px touch target standard (min-h-[44px])
provides:
  - Horizontal-scroll category filter chip bar in App.tsx
  - CategoryFilterType state and AND-filter logic (status x category)
  - Dynamic chip counts from statusFiltered set
  - Category-specific empty state with Lucide icon and Spanish message
  - POR CATEGORÍA section in StatsPanel with mini progress bars per category
affects: [future-stats-expansion, any-plan-consuming-StatsPanel]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - AND-filter pattern: statusFiltered intermediate then category filter chain
    - Chip bar pattern: flex gap-2 overflow-x-auto pb-2 scrollbar-none with flex-shrink-0 items
    - Inline style for category colors: CATEGORY_HEX[cat] to backgroundColor/color (purge-safe)
    - categoryCounts derived from statusFiltered (not all achievements) for dynamic chip labels

key-files:
  created: []
  modified:
    - app/src/App.tsx
    - app/src/components/StatsPanel.tsx

key-decisions:
  - "CategoryFilterType = 'all' | CategoryType — mirrors FilterType pattern in same file"
  - "AND logic via statusFiltered intermediate — single-pass filter, counts update on status change"
  - "Chip counts derived from statusFiltered not filteredAchievements — chip shows how many available per status"
  - "Category empty state uses IIFE to access Icon/name without extra variable — avoids eslint no-case-declarations"
  - "POR CATEGORÍA section conditionally rendered only when at least one category has achievements"
  - "Auto-fixed: progress bar/percentage color corrected from bg-rarity-common to bg-game-progress"

patterns-established:
  - "AND filter pattern: compute status-filtered intermediate first, derive counts from it, apply category filter second"
  - "Chip bar pattern: flex overflow-x-auto scrollbar-none + flex-shrink-0 on each chip for iOS horizontal scroll"

requirements-completed: [CAT-02, CAT-03]

# Metrics
duration: 2min
completed: 2026-02-28
---

# Phase 3 Plan 02: Category Filter Chip Bar and Per-Category Stats Summary

**Horizontal-scroll category chip bar with AND-filter logic in App.tsx and POR CATEGORÍA mini progress bar section in StatsPanel**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-28T23:49:28Z
- **Completed:** 2026-02-28T23:51:40Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added horizontal-scroll category filter chip bar below controls with "Todas" + 5 category chips, all 44px touch targets (Apple HIG compliant)
- Implemented AND-filter logic: status filter (Todos/Completados/Pendientes) and category filter work simultaneously via statusFiltered intermediate
- Chip counts dynamically reflect active status filter — switching status filter updates chip numbers instantly
- Added category-specific empty state with Lucide category icon (dimmed) + "No hay logros en [Categoría]" message in Spanish
- Extended StatsPanel with POR CATEGORÍA section: each category with 1+ achievements shows icon + name + mini progress bar + completed/total count using CATEGORY_HEX inline styles

## Task Commits

Each task was committed atomically:

1. **Task 1: Add category filter chip bar and AND-filter logic in App.tsx** - `d450d02` (feat)
2. **Task 2: Add per-category stats breakdown to StatsPanel** - `1d660c2` (feat)

**Plan metadata:** (final commit — see below)

## Files Created/Modified
- `app/src/App.tsx` - Added CATEGORY_CONFIG/CATEGORY_HEX imports, CategoryFilterType type, categoryFilter state, statusFiltered intermediate, categoryCounts, chip bar JSX, category-specific empty state
- `app/src/components/StatsPanel.tsx` - Added CATEGORY_CONFIG/CATEGORY_HEX/CategoryType imports, byCategory prop, POR CATEGORÍA section with mini progress bars; also fixed progress color bug

## Decisions Made
- AND logic split into two filter steps: statusFiltered first, then category filter applied to that — keeps chip counts accurate relative to the active status filter
- Chip bar uses `scrollbar-none` class + `style={{ scrollbarWidth: 'none' }}` — both needed for cross-browser (Chrome + Firefox) scrollbar hiding
- IIFE pattern `{(() => { ... })()}` used in empty state to access Icon/name from CATEGORY_CONFIG without introducing a render-scope variable
- POR CATEGORÍA section uses `.some()` check before rendering — section is hidden entirely if no achievements exist, then `.filter()` hides individual 0-total category rows

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed progress bar and percentage color from rarity-common to game-progress**
- **Found during:** Task 2 (StatsPanel review prior to adding POR CATEGORÍA section)
- **Issue:** Main progress bar and percentage text used `bg-rarity-common` / `text-rarity-common` (blue) instead of the intended `bg-game-progress` / `text-game-progress` token. This was a pre-existing uncommitted change in the working tree.
- **Fix:** Applied the correct `game-progress` token in both the percentage `<p>` and the progress bar `<div>` conditional class
- **Files modified:** `app/src/components/StatsPanel.tsx`
- **Verification:** TypeScript compiles, Vite build succeeds
- **Committed in:** `1d660c2` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug fix)
**Impact on plan:** Pre-existing color token bug corrected. No scope creep — fix was contained within the file being modified for Task 2.

## Issues Encountered

None — both tasks executed cleanly. TypeScript compiled with zero errors after each task. Vite production build succeeded.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Category filter and stats breakdown fully implemented; CAT-02 and CAT-03 requirements complete
- Phase 03 categories system is complete (both plans done)
- Ready for Phase 04 — AchievementCard can display a category badge if desired in future phases
- All TypeScript compiles zero errors; Vite production build succeeds (232KB JS gzip 69KB)

## Self-Check: PASSED

- FOUND: `.planning/phases/03-categories-system/03-02-SUMMARY.md`
- FOUND: `app/src/App.tsx`
- FOUND: `app/src/components/StatsPanel.tsx`
- FOUND: commit `d450d02` (Task 1)
- FOUND: commit `1d660c2` (Task 2)

---
*Phase: 03-categories-system*
*Completed: 2026-02-28*
