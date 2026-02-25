# Roadmap: Logros Anuales

## Overview

Transform the functional Goal Tracker baseline into a polished, iOS-optimized gaming dashboard. The work flows foundation-first: establish the design system and fix layout bugs, harden the iOS experience, introduce the categories data model, redesign the achievement cards using the new design system, then wire in animations and accessibility constraints as a finishing layer.

## Milestone: v1.0 UI/UX Overhaul

## Phases

- [ ] **Phase 1: Design System Foundation** - Apply Steam-dark palette, Fira Code/Fira Sans typography, and fix horizontal scroll bug
- [ ] **Phase 2: iOS Platform** - Safe areas, splash screens, app icon, overscroll lock, and 44px touch targets
- [ ] **Phase 3: Categories System** - Data model, category assignment UI, filter, and per-category stats
- [ ] **Phase 4: Achievement Cards** - Lucide SVG icons, locked/unlocked states, gaming layout, pixel borders, unlock animation
- [ ] **Phase 5: Animations & Accessibility** - Smooth transitions, reduced-motion respect, contrast audit, visible focus states

## Phase Details

### Phase 1: Design System Foundation
**Goal**: Users see the new Steam-dark visual identity applied throughout the app, and horizontal scroll is eliminated
**Depends on**: Nothing (first phase)
**Requirements**: DSGN-01, DSGN-02, FIX-01
**Success Criteria** (what must be TRUE):
  1. User sees the Steam-dark background (#020617), steel-blue surface cards (#0F172A, #1E293B), green accent (#22C55E), and gold legendary color throughout the app
  2. User sees Fira Code font on all headings and stat numbers, and Fira Sans on all body and label text
  3. User does not encounter any horizontal scroll or content overflow when viewing or creating achievements
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Install fonts, configure Steam-dark CSS tokens, Tailwind color/font utilities, update RARITY_COLORS
- [ ] 01-02-PLAN.md — Restyle all components with Steam-dark tokens, convert form to full-screen sheet, fix horizontal scroll

### Phase 2: iOS Platform
**Goal**: The app feels native on iPhone 11 — no UI overlaps the notch or home bar, launch is branded, and all touch targets are comfortable
**Depends on**: Phase 1
**Requirements**: IOS-01, IOS-02, IOS-03, IOS-04, IOS-05
**Success Criteria** (what must be TRUE):
  1. User can use the full app on iPhone 11 without any content hidden behind the notch or home indicator
  2. User sees the branded Logros Anuales splash screen on launch instead of a white flash
  3. User sees the polished 180px app icon on their iOS home screen after adding to home
  4. User cannot trigger the rubber-band overscroll bounce effect when scrolling to the top or bottom
  5. User can tap every button, toggle, and interactive control without needing to aim precisely (all targets 44px+)
**Plans**: TBD

### Phase 3: Categories System
**Goal**: Users can organize achievements by life area, filter to a single category, and see progress broken down per category
**Depends on**: Phase 1
**Requirements**: CAT-01, CAT-02, CAT-03
**Success Criteria** (what must be TRUE):
  1. User can assign a category (salud, trabajo, personal, creatividad, etc.) to any achievement when creating or editing it
  2. User can tap a category filter and see only achievements belonging to that category
  3. User can see a per-category progress breakdown (total and completed counts) in the stats panel
**Plans**: TBD

### Phase 4: Achievement Cards
**Goal**: Achievement cards look like gaming trophies — Lucide SVG icons, clear locked vs unlocked distinction, dashboard-style layout, pixel-art border frames, and a satisfying unlock animation
**Depends on**: Phase 1, Phase 3
**Requirements**: CARD-01, CARD-02, CARD-03, CARD-04, CARD-05, DSGN-03
**Success Criteria** (what must be TRUE):
  1. User sees a consistent Lucide SVG icon on every achievement card instead of an emoji
  2. User can immediately tell locked achievements apart from unlocked ones by visual state (desaturated/dimmed vs full color)
  3. User sees gaming dashboard-style card layout with clear information hierarchy matching the design system
  4. User sees subtle pixel-art border frames as a retro accent on achievement cards
  5. User sees a satisfying visual animation play when they complete (unlock) an achievement
  6. User sees rarity-matched colored glow effects (box-shadow) on achievement cards
**Plans**: TBD

### Phase 5: Animations & Accessibility
**Goal**: The app is smooth and legible for all users, including those who prefer reduced motion, and all interactive elements are keyboard/focus navigable
**Depends on**: Phase 4
**Requirements**: A11Y-01, A11Y-02, A11Y-03, A11Y-04
**Success Criteria** (what must be TRUE):
  1. User with prefers-reduced-motion enabled sees no transitions or animations fire anywhere in the app
  2. User can read all text labels, stats, descriptions, and buttons against their backgrounds at 4.5:1+ contrast ratio
  3. User navigating with a keyboard or assistive technology sees visible focus rings on all interactive elements
  4. User sees smooth 150-300ms entry and state-transition animations on cards, modals, and filter changes
**Plans**: TBD

## Progress

**Execution Order:** 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design System Foundation | 0/TBD | Not started | - |
| 2. iOS Platform | 0/TBD | Not started | - |
| 3. Categories System | 0/TBD | Not started | - |
| 4. Achievement Cards | 0/TBD | Not started | - |
| 5. Animations & Accessibility | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-25*
*Milestone: v1.0 UI/UX Overhaul*
*Requirements coverage: 21/21*
