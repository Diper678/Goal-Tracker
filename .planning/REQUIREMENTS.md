# Requirements: Logros Anuales

**Defined:** 2026-02-25
**Core Value:** Users can visually track their annual achievements with a satisfying, gaming-inspired experience that feels native on iOS

## v1.0 Requirements

Requirements for UI/UX overhaul milestone. Each maps to roadmap phases.

### Design System

- [ ] **DSGN-01**: User sees new Steam-like dark color palette (#020617 bg, steel blue surfaces, green accent, gold legendary)
- [ ] **DSGN-02**: User sees Fira Code typography for headings/stats and Fira Sans for body text
- [ ] **DSGN-03**: User sees rarity-matched glow effects on achievement cards (color-coded box-shadow)

### iOS Platform

- [ ] **IOS-01**: User can use the app without UI overlapping the notch or home indicator (safe area handling)
- [ ] **IOS-02**: User sees a branded splash screen on launch instead of a white flash
- [ ] **IOS-03**: User sees a polished 180px PNG app icon on the home screen
- [ ] **IOS-04**: User cannot trigger rubber-band overscroll bounce (overscroll-behavior: none)
- [ ] **IOS-05**: User can tap all interactive elements comfortably with 44px+ touch targets

### Achievement Cards

- [ ] **CARD-01**: User sees Lucide SVG icons on achievement cards instead of emojis
- [ ] **CARD-02**: User sees clearly distinct locked (desaturated/dimmed) vs unlocked visual states
- [ ] **CARD-03**: User sees a redesigned gaming dashboard-style achievement card layout
- [ ] **CARD-04**: User sees subtle pixel-art border frames on achievement cards as retro accent
- [ ] **CARD-05**: User sees a satisfying visual animation when completing an achievement

### Categories

- [ ] **CAT-01**: User can assign a category (salud, trabajo, personal, creatividad, etc.) to each achievement
- [ ] **CAT-02**: User can filter achievements by category
- [ ] **CAT-03**: User can see per-category progress breakdown in the stats panel

### Animations & Accessibility

- [ ] **A11Y-01**: User with reduced-motion preference sees no animations (prefers-reduced-motion respected)
- [ ] **A11Y-02**: User can read all text with 4.5:1+ contrast ratio against backgrounds
- [ ] **A11Y-03**: User can navigate all interactive elements via visible focus states
- [ ] **A11Y-04**: User sees smooth entry and transition animations (150-300ms) throughout the app

### Bug Fixes

- [ ] **FIX-01**: User does not experience horizontal scroll overflow when creating achievements

## Future Requirements

Deferred to future releases. Tracked but not in current roadmap.

### Data Management

- **DATA-01**: User can export achievements to JSON file for backup
- **DATA-02**: User can import achievements from JSON file

### Content

- **CONT-01**: User can browse pre-defined achievement templates/presets for common goals

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend/server | localStorage sufficient for personal use |
| Multi-user/social features | Personal tracker only |
| Push notifications | No server; iOS PWA push too fragile for marginal gain |
| iPad optimization | iPhone 11 is priority device |
| Light mode | Dark-only gaming aesthetic is deliberate identity |
| i18n/multi-language | Spanish only |
| Haptics/vibration | iOS Safari does not support Vibration API |
| Drag-and-drop reordering | Categories solve organization without complexity |
| Achievement point/XP system | Rarity tiers provide sufficient hierarchy |
| Cloud sync | Requires backend; violates localStorage constraint |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | Phase 1 | Pending |
| DSGN-02 | Phase 1 | Pending |
| FIX-01 | Phase 1 | Pending |
| IOS-01 | Phase 2 | Pending |
| IOS-02 | Phase 2 | Pending |
| IOS-03 | Phase 2 | Pending |
| IOS-04 | Phase 2 | Pending |
| IOS-05 | Phase 2 | Pending |
| CAT-01 | Phase 3 | Pending |
| CAT-02 | Phase 3 | Pending |
| CAT-03 | Phase 3 | Pending |
| CARD-01 | Phase 4 | Pending |
| CARD-02 | Phase 4 | Pending |
| CARD-03 | Phase 4 | Pending |
| CARD-04 | Phase 4 | Pending |
| CARD-05 | Phase 4 | Pending |
| DSGN-03 | Phase 4 | Pending |
| A11Y-01 | Phase 5 | Pending |
| A11Y-02 | Phase 5 | Pending |
| A11Y-03 | Phase 5 | Pending |
| A11Y-04 | Phase 5 | Pending |

**Coverage:**
- v1.0 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0

---
*Requirements defined: 2026-02-25*
*Last updated: 2026-02-25 — traceability filled after roadmap creation*
