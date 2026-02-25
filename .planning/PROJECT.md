# Logros Anuales - Goal Tracker

## What This Is

A PWA achievement tracker for annual goals, inspired by Steam/Xbox/PlayStation achievement systems. Users create, categorize, and track personal achievements with a 4-tier rarity system (common, rare, epic, legendary). Built with React 19 + Vite + Tailwind + shadcn/ui, targeting iOS (iPhone 11+) as primary platform. The app is fully in Spanish.

## Core Value

Users can visually track their annual achievements with a satisfying, gaming-inspired experience that feels native on iOS — achievement completion should feel rewarding, like unlocking a trophy.

## Requirements

### Validated

- ✓ Achievement CRUD (create, read, update, delete) — existing
- ✓ 4-tier rarity system (common/blue, rare/red, epic/purple, legendary/gold) — existing
- ✓ Achievement completion toggle with date tracking — existing
- ✓ Emoji-based icon picker (80 options) — existing
- ✓ Stats panel with progress bar and rarity breakdown — existing
- ✓ Filter by rarity and completion status — existing
- ✓ PWA with service worker and offline support — existing
- ✓ Dark theme with 8-bit retro styling — existing
- ✓ localStorage persistence — existing
- ✓ Basic iOS meta tags (apple-mobile-web-app-capable) — existing

### Active

- [ ] iOS optimization (safe areas, splash screens, touch targets, gestures, haptics)
- [ ] UI/UX overhaul: dashboard gaming modern style (Xbox/PS achievement screens) with subtle retro touches
- [ ] New color palette: Steam-like dark (#020617 bg) + steel blue (#0F172A, #1E293B) + green accent (#22C55E) + gold for legendary
- [ ] Typography upgrade: Fira Code (headings/data) + Fira Sans (body) replacing Courier New
- [ ] Replace emoji icons with SVG Lucide icons for professional feel
- [ ] Achievement categories system (salud, trabajo, personal, etc.)
- [ ] Refined achievement card frames with pixel-art borders as subtle retro accent
- [ ] Smooth animations and transitions (150-300ms, prefers-reduced-motion)
- [ ] Accessibility improvements (contrast 4.5:1, focus states, touch targets 44px+)
- [ ] Responsive optimization for iPhone 11 (375px width, safe areas, notch handling)

### Out of Scope

- Backend/server — localStorage is sufficient for personal use
- Multi-user/social features — this is a personal tracker
- Push notifications — no server to send them from
- iPad optimization — iPhone 11 is the priority
- Light mode — dark-only gaming aesthetic
- i18n/multi-language — Spanish only

## Current Milestone: v1.0 UI/UX Overhaul

**Goal:** Transform the functional baseline into a polished, iOS-optimized gaming dashboard with modern design system, categories, and accessibility.

**Target features:**
- iOS optimization (safe areas, splash screens, touch targets, gestures, haptics)
- UI/UX overhaul: gaming dashboard style (Xbox/PS achievement screens) with subtle retro touches
- New color palette: Steam-like dark (#020617 bg) + steel blue + green accent + gold legendary
- Typography upgrade: Fira Code (headings/data) + Fira Sans (body)
- Replace emoji icons with Lucide SVG icons
- Achievement categories system (salud, trabajo, personal, etc.)
- Refined achievement card frames with pixel-art borders as subtle retro accent
- Smooth animations and transitions (150-300ms, prefers-reduced-motion)
- Accessibility improvements (contrast 4.5:1, focus states, touch targets 44px+)
- Responsive optimization for iPhone 11 (375px width, safe areas, notch handling)

## Context

- **Existing codebase:** React 19 + Vite 5 + Tailwind 3 + shadcn/ui (40+ components) + Lucide React icons
- **Current state:** Functional PWA with basic iOS meta tags, needs significant UI polish and iOS-specific handling
- **Design system:** Generated via UI/UX Pro Max skill, persisted at `design-system/logros-anuales/MASTER.md`
- **Target device:** iPhone 11 (828x1792, 6.1" display, notch, iOS Safari PWA)
- **Known issues:** Emojis as achievement icons (unprofessional), no safe area handling, no splash screens, no categories, basic 8-bit style needs refinement toward modern gaming dashboard
- **Style direction:** Modern gaming dashboard (Xbox/PlayStation achievement screens) with subtle retro/pixel-art touches on achievement card frames. NOT full 8-bit — the retro elements are accents, not the primary style.

## Constraints

- **Tech stack:** Must stay React + Vite + Tailwind + shadcn/ui — no framework migration
- **Storage:** localStorage only — no backend dependencies
- **Platform:** PWA — no native app wrappers (Capacitor/Ionic)
- **Device priority:** iPhone 11+ with iOS Safari PWA — must handle notch, safe areas, rubber-banding
- **Design system:** Follow `design-system/logros-anuales/MASTER.md` for colors, typography, spacing, components
- **Performance:** Must remain fast on iPhone 11 (A13 chip) — no heavy animations or large bundles

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Steam-like dark palette over neon cyberpunk | User wants understated, professional gaming feel | — Pending |
| Dashboard gaming style over full 8-bit | User prefers Xbox/PS achievement screen feel with subtle retro touches | — Pending |
| Fira Code + Fira Sans typography | Dashboard/data-focused fonts that read well on mobile | — Pending |
| Replace emojis with Lucide SVG icons | Professional consistency, better rendering across devices | — Pending |
| Add categories for achievements | User requested organization by life areas | — Pending |
| iPhone 11 as target device | User's specific device | — Pending |

---
*Last updated: 2026-02-25 after milestone v1.0 started*
