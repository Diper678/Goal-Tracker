# Phase 2: iOS Platform — Context

## Phase Boundary

**Goal:** The app feels native on iPhone 11 — no UI overlaps the notch or home bar, launch is branded, and all touch targets are comfortable.

**What's IN scope:** Safe areas, splash screen, app icon, overscroll lock, 44px touch targets.
**What's OUT of scope:** New features, data model changes, component redesigns beyond touch target sizing.

---

## Decisions

### 1. Splash Screen

- **Elements:** Icon only — no text on the splash screen
- **Background:** Surface color (#0F172A) — slightly lighter than app background, gives a subtle "loading" feel before content appears
- **Text fallback:** If a label is ever needed, use Fira Code in white
- **Transition:** Claude's choice — whatever works best technically (fade or instant)
- **Rationale:** Seamless, minimal branding moment. The surface color creates a subtle visual shift when the app loads, signaling progress without being flashy.

### 2. App Icon

- **Visual style:** Trophy/achievement icon — directly communicates the app's purpose
- **Color treatment:** Gold (legendary rarity color) icon element on dark background — premium feel
- **Background:** Subtle dark gradient — stands out on home screen against both light and dark wallpapers
- **Generation method:** SVG/CSS programmatic — created from code, crisp at any size
- **Rationale:** Gold trophy is immediately recognizable and ties to the rarity/gaming theme. Programmatic generation keeps assets in our control.

### 3. Safe Area Treatment (Claude decides)

- **Approach:** Technical decision — ensure no content overlaps notch or home indicator on iPhone 11
- **No specific visual preference expressed** — implement using standard `env(safe-area-inset-*)` approach
- **Key constraint:** All existing UI must remain fully visible and usable within safe areas

### 4. Scroll & Bounce Behavior

- **Overscroll:** Hard lock — no bounce at all. Content stops dead at the edges.
- **Pull-to-refresh:** None. No data to refresh, keep it simple.
- **Short list behavior:** No scroll if content fits the viewport. Lock the viewport when all content is visible.
- **Rationale:** Maximum control. The app should feel like a fixed dashboard, not a scrollable feed. Native-app precision.

### 5. Touch Targets (Claude decides)

- **Constraint:** All interactive elements must be at least 44x44px (Apple HIG)
- **No specific visual preference expressed** — audit existing buttons/toggles and resize as needed
- **Key concern:** Don't change visual design, just ensure hit areas are comfortable

---

## Deferred Ideas

None captured during discussion.

---

## Downstream Guidance

**For researcher:** Investigate iOS PWA splash screen configuration (apple-touch-startup-image), SVG-to-PNG icon pipeline for apple-touch-icon, and CSS overscroll-behavior + touch-action for hard scroll lock on iOS Safari.

**For planner:** The icon needs a build step or static SVG→PNG conversion. Splash screen is likely HTML meta tags + manifest config. Overscroll lock may need both CSS and JS approaches for full iOS Safari coverage.

---
*Created: 2026-02-27*
*Phase: 02-ios-platform*
*Milestone: v1.0 UI/UX Overhaul*
