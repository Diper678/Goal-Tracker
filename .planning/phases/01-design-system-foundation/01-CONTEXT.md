# Phase 1: Design System Foundation - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Apply the Steam-dark color palette (#020617 bg, steel-blue surfaces, green accent, gold legendary), Fira Code/Fira Sans typography, and fix horizontal scroll overflow. Users see a new cohesive visual identity across the entire app. No new features — visual reskin + layout fix only.

</domain>

<decisions>
## Implementation Decisions

### Color application strategy
- Full-depth palette: restyle everything — page bg, cards, modals, inputs, borders, scrollbar track
- Rarity colors (common/rare/epic/legendary) must be tuned to feel cohesive with the Steam-dark palette — match saturation and brightness family, not just drop in the old values
- Green accent (#22C55E) is for success/completion states only (completed achievements, checkmarks) — NOT for primary action buttons
- Primary actions need a different color (e.g., steel-blue highlight or lighter surface accent)
- Text colors: muted whites — primary text ~#E2E8F0, secondary/label text ~#94A3B8 — no pure white

### Surface & card layering
- Subtle dark shadows for card elevation — cards float slightly above their surface
- Sharp card corners (2-4px border-radius) — industrial/terminal feel, not bubbly
- Modals use the same surface hierarchy: dark semi-transparent overlay + surface-colored card with shadow — consistent with regular cards
- Surface nesting order (bg → surface1 → surface2): Claude's discretion on which elements go where

### Scroll fix & layout
- Fix the horizontal scroll overflow bug (triggered during achievement creation)
- Max-width container ~480px, centered on larger screens — keeps mobile-app feel even on iPad/desktop
- Achievement form modal: full-screen sheet on mobile (slides up, fills screen) — no overflow risk, native feel
- Scroll model: fixed stats panel pinned at top, achievement list scrolls independently beneath it
- Additional spacing/padding tightening alongside overflow fix: Claude's discretion

### Claude's Discretion
- Surface nesting assignments (which elements use surface1 vs surface2)
- Whether to tighten padding/margins elsewhere while fixing overflow
- Primary action button color choice (within the Steam-dark palette, not green)
- Loading state and empty state color treatments
- Exact shadow values and border treatments

</decisions>

<specifics>
## Specific Ideas

- Gaming dashboard aesthetic (Xbox/PS achievement screens) — clean, dark, data-focused
- Sharp corners give an industrial/terminal vibe that fits the gaming theme
- Stats panel always visible (pinned) like a gaming HUD — never scrolls away
- Full-screen sheet for forms matches iOS native patterns (like iOS Settings detail views)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-design-system-foundation*
*Context gathered: 2026-02-25*
