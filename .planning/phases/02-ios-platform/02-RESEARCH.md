# Phase 2: iOS Platform - Research

**Researched:** 2026-02-27
**Domain:** iOS PWA — safe areas, splash screen, app icon, scroll lock, touch targets
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Splash Screen**
- Elements: Icon only — no text on the splash screen
- Background: Surface color (#0F172A) — slightly lighter than app background, gives a subtle "loading" feel before content appears
- Text fallback: If a label is ever needed, use Fira Code in white
- Transition: Claude's choice — whatever works best technically (fade or instant)
- Rationale: Seamless, minimal branding moment. The surface color creates a subtle visual shift when the app loads, signaling progress without being flashy.

**App Icon**
- Visual style: Trophy/achievement icon — directly communicates the app's purpose
- Color treatment: Gold (legendary rarity color) icon element on dark background — premium feel
- Background: Subtle dark gradient — stands out on home screen against both light and dark wallpapers
- Generation method: SVG/CSS programmatic — created from code, crisp at any size
- Rationale: Gold trophy is immediately recognizable and ties to the rarity/gaming theme. Programmatic generation keeps assets in our control.

**Scroll & Bounce Behavior**
- Overscroll: Hard lock — no bounce at all. Content stops dead at the edges.
- Pull-to-refresh: None. No data to refresh, keep it simple.
- Short list behavior: No scroll if content fits the viewport. Lock the viewport when all content is visible.
- Rationale: Maximum control. The app should feel like a fixed dashboard, not a scrollable feed. Native-app precision.

### Claude's Discretion

**Safe Area Treatment**
- Approach: Technical decision — ensure no content overlaps notch or home indicator on iPhone 11
- No specific visual preference expressed — implement using standard `env(safe-area-inset-*)` approach
- Key constraint: All existing UI must remain fully visible and usable within safe areas

**Touch Targets**
- Constraint: All interactive elements must be at least 44x44px (Apple HIG)
- No specific visual preference expressed — audit existing buttons/toggles and resize as needed
- Key concern: Don't change visual design, just ensure hit areas are comfortable

### Deferred Ideas (OUT OF SCOPE)

None captured during discussion.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| IOS-01 | User can use the app without UI overlapping the notch or home indicator (safe area handling) | `viewport-fit=cover` + `env(safe-area-inset-*)` CSS — documented in Architecture Patterns |
| IOS-02 | User sees a branded splash screen on launch instead of a white flash | `apple-touch-startup-image` link tags + `@vite-pwa/assets-generator` — documented in Standard Stack |
| IOS-03 | User sees a polished 180px PNG app icon on the home screen | `apple-touch-icon.png` 180x180 + `sharp` SVG-to-PNG pipeline — documented in Standard Stack |
| IOS-04 | User cannot trigger rubber-band overscroll bounce (overscroll-behavior: none) | Two-layer approach: CSS `overscroll-behavior: none` + `body { position: fixed }` wrapper — documented in Architecture Patterns |
| IOS-05 | User can tap all interactive elements comfortably with 44px+ touch targets | Audit existing `w-10 h-10` (40px) buttons in AchievementCard; pad to `min-h-[44px] min-w-[44px]` — documented in Code Examples |
</phase_requirements>

---

## Summary

This phase brings the Logros Anuales PWA to iOS native-feeling quality by addressing five platform-specific requirements. The work is entirely in configuration files, CSS, a small build script, and HTML meta tags — no React component logic changes are needed beyond touch target sizing.

The most technically nuanced problem is overscroll bounce prevention. iOS Safari does not reliably honor `overscroll-behavior: none` on its own — especially in PWA standalone mode. The proven approach is a two-layer strategy: CSS `overscroll-behavior: none` for modern Safari (16+), combined with a `position: fixed` body + scrollable inner container for older iOS. The app already has `apple-mobile-web-app-capable` and `black-translucent` status bar in `index.html`, so the foundation is partially in place.

The splash screen is the most laborious piece due to iOS requiring one `apple-touch-startup-image` link tag per device/orientation/resolution combination. The `@vite-pwa/assets-generator` package automates this entirely from a single SVG source — it generates all PNG files and outputs the correct `<link>` tags to paste into `index.html`. The icon pipeline uses the same source SVG, converted to 180px PNG via `sharp` in a one-time build script.

**Primary recommendation:** Use `@vite-pwa/assets-generator` for both icon and splash screen generation; use the two-layer scroll lock pattern for overscroll; apply `viewport-fit=cover` + `env(safe-area-inset-*)` for safe areas; audit and pad the three action buttons in `AchievementCard` from `w-10 h-10` (40px) to `min-h-[44px] min-w-[44px]`.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@vite-pwa/assets-generator` | latest (^0.2.x) | Generate all iOS icons + splash screen PNGs from one SVG source | Official vite-plugin-pwa companion; handles all device resolutions automatically |
| `sharp` | ^0.33.x | SVG-to-PNG conversion in Node.js | Fastest Node image processor; native libvips; no headless browser needed |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS `env(safe-area-inset-*)` | Native (no install) | Push content away from notch/home bar | Required for `viewport-fit=cover` to work |
| CSS `overscroll-behavior: none` | Native (no install) | Prevent rubber-band bounce on Safari 16+ | First layer of scroll lock |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@vite-pwa/assets-generator` | Manual `sharp` scripting for each device | Manual is feasible but requires maintaining a device list; generator handles 20+ devices automatically |
| `sharp` | `convert-svg-to-png` npm package | `sharp` is 3-5x faster, actively maintained, more widely used |
| CSS-only scroll lock | GSAP `stopOverscroll()` | GSAP requires adding a large dependency; the CSS+JS approach is ~10 lines and zero dependencies |

**Installation:**
```bash
# In app/ directory
npm install -D @vite-pwa/assets-generator sharp
```

---

## Architecture Patterns

### Recommended File Changes

```
app/
├── public/
│   ├── icon.svg                     # EXISTING — source for all generated assets
│   ├── apple-touch-icon.png         # NEW — 180x180 generated by sharp script
│   ├── apple-splash-828-1792.png    # NEW — iPhone 11 portrait, generated
│   ├── apple-splash-1792-828.png    # NEW — iPhone 11 landscape, generated
│   └── pwa-*.png                    # NEW — standard PWA manifest icons (192, 512)
├── scripts/
│   └── generate-icons.mjs           # NEW — sharp conversion script (run once)
├── pwa-assets.config.ts             # NEW — @vite-pwa/assets-generator config
├── index.html                       # MODIFY — add apple-touch-icon + splash links + viewport-fit
└── src/
    └── index.css                    # MODIFY — add safe area padding + scroll lock
```

### Pattern 1: Safe Area Insets

**What:** CSS environment variables that return the safe distance from each edge of the viewport, accounting for the notch and home indicator on iPhone.
**When to use:** Always — for any PWA targeting iPhone with `viewport-fit=cover`.

**Prerequisite — viewport meta tag must include `viewport-fit=cover`:**
```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
```

**CSS application:**
```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/CSS/env */

/* Global body safe area padding */
body {
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}

/* iPhone 11 reference values (PWA standalone mode):
   safe-area-inset-top:    ~44px (notch area, though iPhone 11 has no notch — it's the status bar)
   safe-area-inset-bottom: ~34px (home indicator)
   safe-area-inset-left:   0px
   safe-area-inset-right:  0px
*/
```

**Important clarification:** The iPhone 11 does NOT have a Face ID notch. It has a traditional TrueDepth camera notch at the top (status bar area ~44px) and a home indicator bar at the bottom (~34px). `env(safe-area-inset-top)` still returns ~44px in standalone PWA mode to account for the status bar overlay.

**Tailwind approach (preferred for this project):**
```css
/* In index.css, add to body or a wrapper div */
padding-top: env(safe-area-inset-top, 0px);
padding-bottom: env(safe-area-inset-bottom, 0px);
```

### Pattern 2: Overscroll Bounce Lock (Two-Layer)

**What:** Prevents the iOS rubber-band bounce when scrolling past content boundaries.
**When to use:** Always for fixed-layout PWAs in standalone mode.

**The problem:** `overscroll-behavior: none` alone does NOT work reliably on iOS Safari, particularly in standalone (home screen) mode. This is a long-standing WebKit limitation. Safari 16 added partial support but standalone PWAs still bounce.

**The proven two-layer solution:**
```css
/* Source: verified against multiple community reports, bram.us, CSS-IRL */

/* Layer 1: Modern Safari 16+ — handles standard scroll cases */
html, body {
  overscroll-behavior: none;
  overscroll-behavior-y: none;
}

/* Layer 2: Older iOS + standalone PWA mode — hard viewport lock */
html {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

**Why `position: fixed` on html works:** It tells iOS the viewport itself cannot move — there is nothing to rubber-band against. The inner `body { overflow-y: auto }` lets content scroll normally within that locked frame.

**Caveat:** `position: fixed` on html means `window.scrollY` always returns 0. This does not affect this app since we don't read scroll position anywhere.

### Pattern 3: Apple Touch Icon

**What:** A 180x180px PNG that appears on the iOS home screen when user adds to home.
**When to use:** Every PWA targeting iOS.

**Two-step setup:**

Step 1 — Add link tag to `index.html`:
```html
<!-- Source: vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
```

Step 2 — Update `vite.config.ts` manifest and `includeAssets`:
```typescript
VitePWA({
  includeAssets: ['apple-touch-icon.png', 'icon.svg'],
  manifest: {
    name: 'Logros Anuales',
    icons: [
      { src: 'apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'apple touch icon' },
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ]
  }
})
```

### Pattern 4: iOS Splash Screen

**What:** Static PNG images displayed by iOS when launching a PWA from the home screen, before the app renders. Prevents the white flash.
**When to use:** Every PWA that adds `apple-mobile-web-app-capable`.

**The challenge:** iOS requires one PNG per device/orientation/pixel-ratio combination. There is no dynamic manifest-based splash screen on iOS. You must add `<link rel="apple-touch-startup-image">` tags — one per supported device.

**iPhone 11 specific parameters:**
- Physical resolution: 828 x 1792 px
- CSS viewport: 414 x 896 pt
- Device pixel ratio: 2
- Portrait link tag:
```html
<link rel="apple-touch-startup-image"
  href="/apple-splash-828-1792.png"
  media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
```

**Automation via `@vite-pwa/assets-generator`** (recommended — do not hand-roll):
```typescript
// pwa-assets.config.ts
import {
  combinePresetAndAppleSplashScreens,
  defineConfig,
  minimal2023Preset
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: combinePresetAndAppleSplashScreens(
    minimal2023Preset,
    {
      padding: 0.3,
      resizeOptions: {
        background: '#0F172A',  // Surface color from CONTEXT.md
        fit: 'contain'
      },
      linkMediaOptions: {
        log: true,
        addMediaScreen: true,
        basePath: '/',
        xhtml: false
      }
    }
    // No device filter = generates for ALL devices including iPhone 11
  ),
  images: ['public/icon.svg']
})
```

**Run command (outputs link tags to terminal for copy-paste into index.html):**
```bash
npx pwa-assets-generator --config pwa-assets.config.ts
```

### Pattern 5: SVG Icon Build Script (for apple-touch-icon.png)

**What:** A one-time Node.js script that converts `public/icon.svg` to `public/apple-touch-icon.png` at 180px. The existing `icon.svg` needs to be redesigned first (trophy/gold).

```javascript
// scripts/generate-icons.mjs
// Source: sharp.pixelplumbing.com
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '../public')

async function generateIcons() {
  const inputSvg = path.join(publicDir, 'icon.svg')

  // Apple touch icon — 180x180
  await sharp(inputSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))

  // Standard PWA icons
  await sharp(inputSvg).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'))
  await sharp(inputSvg).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'))

  console.log('Icons generated successfully')
}

generateIcons().catch(console.error)
```

**Run:** `node scripts/generate-icons.mjs`

### Pattern 6: Touch Target Audit

**What:** All interactive elements must be physically 44x44px or larger per Apple HIG.
**Current audit of AchievementCard.tsx:**
- Toggle button: `w-10 h-10` = 40x40px — **2px SHORT** in each dimension
- Edit button: `w-10 h-10` = 40x40px — **2px SHORT**
- Delete button: `w-10 h-10` = 40x40px — **2px SHORT**
- Filter buttons: `px-4 py-2` = ~36px tall — **SHORT**
- "NUEVO LOGRO" button: `py-3` = ~48px tall — PASSES

**Fix pattern — expand to 44px without changing visual design:**
```tsx
// Replace w-10 h-10 with min-w-[44px] min-h-[44px] on action buttons
// The button becomes 44px, icon stays w-5 h-5 inside
<button
  className="min-w-[44px] min-h-[44px] flex items-center justify-center ..."
>
  <Check className="w-5 h-5 ..." />
</button>
```

**Fix for filter buttons:**
```tsx
// Replace py-2 with py-[10px] or min-h-[44px]
<button className="px-4 min-h-[44px] ...">
```

### Anti-Patterns to Avoid

- **Setting `overscroll-behavior: none` only in CSS:** Insufficient for iOS Safari standalone mode. Always pair with the `position: fixed` on html.
- **Setting `position: fixed` without `overflow-y: auto` on body:** The content will not scroll at all. Must have the inner scroll container.
- **Hard-coding safe area values:** Never use `padding-top: 44px` — use `env(safe-area-inset-top, 0px)` so the value adapts to device and orientation.
- **Generating one splash screen for all devices:** iOS will silently ignore a splash screen if dimensions don't exactly match the device. Use the generator.
- **Using SVG as apple-touch-icon directly:** iOS only accepts PNG for `apple-touch-icon`. SVG is ignored on iOS home screen.
- **Forgetting `viewport-fit=cover`:** Without it, `env(safe-area-inset-*)` returns `0` everywhere — safe area CSS has no effect.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| iOS splash screen PNGs for every device | Custom sharp resize script with device list | `@vite-pwa/assets-generator` | 20+ device/orientation combinations; generator knows all dimensions and outputs correct link tags |
| SVG to multi-size PNG conversion | Browser Canvas API, Puppeteer | `sharp` | Native performance; no browser overhead; handles SVG with `librsvg` |
| Detecting iOS standalone mode in JS | `window.navigator.standalone` checks everywhere | CSS `@media (display-mode: standalone)` | Cleaner separation of concerns; no runtime JS needed for display adjustments |

**Key insight:** The splash screen requirement is deceptively complex. iOS does not use the Web App Manifest's `icons` for the launch screen — it uses a completely separate mechanism (`apple-touch-startup-image` link tags) that must cover every supported device at exact pixel dimensions. Attempting to hand-roll the device list will miss devices and leave gaps.

---

## Common Pitfalls

### Pitfall 1: White Flash on Launch Despite Adding Splash Screens

**What goes wrong:** App launches with white flash even though `apple-touch-startup-image` tags exist.
**Why it happens:** iOS caches splash screen assets aggressively. If the user added the PWA to their home screen before the splash screen was added, they see the old behavior until they re-add.
**How to avoid:** Test with a fresh "Add to Home Screen" — never with an existing PWA icon. Also ensure image dimensions exactly match the media query specification (828x1792 for iPhone 11 portrait, 1792x828 for landscape).
**Warning signs:** Splash works in Simulator but not on physical device (cache issue).

### Pitfall 2: Safe Areas Active in Safari But Not in Standalone

**What goes wrong:** Safe area padding looks correct when testing in Safari browser, but gaps appear when launched from home screen.
**Why it happens:** `env(safe-area-inset-top)` returns different values in Safari (status bar visible below) vs. standalone mode (app covers status bar via `black-translucent`).
**How to avoid:** Always test in standalone mode specifically. In standalone mode, `env(safe-area-inset-top)` is typically ~44px; in Safari it may be 0.
**Warning signs:** Layout looks fine in browser DevTools but shows overlap on device.

### Pitfall 3: Scroll Lock Breaks the Full-Screen Sheet (AchievementForm)

**What goes wrong:** The `position: fixed` on html causes `AchievementForm` sheet to lose its scroll, or the keyboard push-up to fail.
**Why it happens:** Fixed-position html disrupts how iOS positions fixed elements and keyboard avoidance.
**How to avoid:** The form is already a full-screen fixed sheet (from Phase 1). Verify scroll within the sheet still works. The inner body `overflow-y: auto` should handle it, but test with long content in the form.
**Warning signs:** Sheet cannot scroll when keyboard is open.

### Pitfall 4: Touch Targets Visually Change

**What goes wrong:** Fixing touch targets to 44px makes buttons look larger or changes card layout.
**Why it happens:** Setting `width: 44px` instead of `min-width: 44px` or using padding changes visual size.
**How to avoid:** Use `min-h-[44px] min-w-[44px]` — the button grows to 44px only if it's smaller, keeping existing layout intact. The 10px gap (40px→44px) is invisible in practice on the dark theme.
**Warning signs:** Card action column width changes, breaking alignment.

### Pitfall 5: Icon.SVG Has Namespace Error

**What goes wrong:** Current `icon.svg` has `xmlns="http://www.w3.org/20MathML"` (typo in the file) — sharp may fail to render it correctly.
**Why it happens:** Existing SVG was written with a malformed namespace. Sharp uses librsvg for SVG rendering; invalid namespaces can cause partial rendering.
**How to avoid:** When creating the new trophy SVG icon, use the correct namespace: `xmlns="http://www.w3.org/2000/svg"` (note: `2000/svg` not `20MathML`).
**Warning signs:** Generated PNG is blank or partially rendered.

---

## Code Examples

Verified patterns from official sources and cross-referenced community findings:

### Complete index.html Head Section

```html
<!-- Source: vite-pwa-org.netlify.app + MDN env() documentation -->
<head>
  <meta charset="UTF-8" />
  <!-- Add viewport-fit=cover to existing viewport tag -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="theme-color" content="#030712" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Logros" />

  <!-- App icon for iOS home screen -->
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />

  <!-- Splash screens — generated by @vite-pwa/assets-generator, copy output here -->
  <!-- iPhone 11 portrait: -->
  <link rel="apple-touch-startup-image"
    href="/apple-splash-828-1792.png"
    media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
  <!-- iPhone 11 landscape: -->
  <link rel="apple-touch-startup-image"
    href="/apple-splash-1792-828.png"
    media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
  <!-- Additional devices output by generator goes here -->

  <title>Logros Anuales</title>
</head>
```

### Scroll Lock CSS (add to index.css)

```css
/* Source: bram.us + CSS-IRL + verified via community consensus */

/* Two-layer overscroll prevention for iOS Safari + standalone PWA */
html {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* Layer 1: modern Safari 16+ */
  overscroll-behavior: none;
}

body {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: none;
  /* Safe area padding applied here */
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}
```

### Trophy SVG Icon (to replace current malformed icon.svg)

```svg
<!-- Correct SVG with proper namespace for sharp compatibility -->
<!-- Background: #030712 (app bg) with subtle radial gradient -->
<!-- Trophy: #FACC15 (legendary gold) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <!-- Background -->
  <rect width="512" height="512" rx="80" fill="url(#bg)"/>
  <!-- Trophy cup body -->
  <path d="M176 96h160v140c0 66-44 110-80 120c-36-10-80-54-80-120Z" fill="#FACC15"/>
  <!-- Trophy handles (left and right) -->
  <path d="M176 120 C136 120, 120 160, 136 180 C150 200, 176 190, 176 176" fill="none" stroke="#FACC15" stroke-width="16" stroke-linecap="round"/>
  <path d="M336 120 C376 120, 392 160, 376 180 C362 200, 336 190, 336 176" fill="none" stroke="#FACC15" stroke-width="16" stroke-linecap="round"/>
  <!-- Trophy stem -->
  <rect x="236" y="356" width="40" height="60" rx="4" fill="#FACC15"/>
  <!-- Trophy base -->
  <rect x="176" y="416" width="160" height="24" rx="8" fill="#FACC15"/>
  <!-- Star accent at top of cup -->
  <text x="256" y="210" text-anchor="middle" font-size="80" fill="#030712">★</text>
</svg>
```

### Touch Target Fix (AchievementCard)

```tsx
// Source: Apple HIG + WCAG 2.5.5 — min 44x44px
// Change: w-10 h-10 (40px) → min-w-[44px] min-h-[44px]

{/* Action buttons in AchievementCard.tsx */}
<div className="flex flex-col gap-2">
  <button
    onClick={() => onToggle(achievement.id)}
    className={`
      min-w-[44px] min-h-[44px] flex items-center justify-center
      border-2 transition-all duration-150
      ${isCompleted
        ? 'bg-game-accent border-game-accent/80 hover:bg-game-accent/90'
        : 'bg-game-card border-game-border hover:bg-game-surface'}
    `}
  >
    <Check className={`w-5 h-5 ${isCompleted ? 'text-white' : 'text-game-text-secondary'}`} />
  </button>
  <button
    onClick={() => onEdit(achievement)}
    className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-game-card border-2 border-game-border hover:bg-game-surface transition-all duration-150"
  >
    <Edit className="w-4 h-4 text-game-text-secondary" />
  </button>
  <button
    onClick={() => onDelete(achievement.id)}
    className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-rarity-rare/20 border-2 border-rarity-rare/60 hover:bg-rarity-rare/30 transition-all duration-150"
  >
    <Trash2 className="w-4 h-4 text-rarity-rare" />
  </button>
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual splash screen PNG per device | `@vite-pwa/assets-generator` automated | ~2023 | Removes device list maintenance; generator knows all Apple device specs |
| `position: fixed; overflow: hidden` body (body lock pattern) | Two-layer: fixed html + scrollable body | ~2022 | More reliable in PWA standalone; preserves inner scroll |
| `apple-mobile-web-app-status-bar-style: black` | `black-translucent` | iOS 11+ | Allows app content to extend under status bar with `viewport-fit=cover` |
| Hard-coded pixel safe area padding | `env(safe-area-inset-*)` | iOS 11+ (widely available 2020) | Dynamic — adapts to device, orientation, and multitasking layout |

**Deprecated/outdated:**
- `-webkit-overflow-scrolling: touch`: Still harmless to include as fallback but deprecated and ignored in modern iOS. Do not rely on it as the sole scroll solution.
- `apple-mobile-web-app-status-bar-style: default` or `black` (non-translucent): Prevents content from reaching under the status bar. Use `black-translucent` for full-screen immersion.

---

## Open Questions

1. **Does `position: fixed` on html break the AchievementForm sheet scroll?**
   - What we know: AchievementForm is a `position: fixed` full-screen overlay (from Phase 1). Fixed-position html is known to interact with iOS keyboard avoidance.
   - What's unclear: Whether the fixed sheet plus overflow-y:auto body causes keyboard push issues when the form input gets focus on iPhone 11.
   - Recommendation: Test this specifically on physical iPhone or Simulator after implementing. If broken, scope the `position: fixed` to only apply in `@media (display-mode: standalone)` to avoid affecting Safari browser view.

2. **iPhone 11 vs older iOS — minimum iOS version target**
   - What we know: The project targets iPhone 11. iPhone 11 shipped with iOS 13, currently runs iOS 17.
   - What's unclear: Whether to support older iOS versions on the same device (e.g., iOS 14/15 still in use).
   - Recommendation: Target iOS 15+ minimum. `overscroll-behavior` support in Safari landed in 16, but the `position: fixed` fallback covers earlier versions. Safe areas have been stable since iOS 11.

3. **Splash screen background color precision**
   - What we know: CONTEXT.md specifies `#0F172A` (surface color) for splash background.
   - What's unclear: Whether `@vite-pwa/assets-generator`'s `resizeOptions.background` accepts hex or requires a specific format.
   - Recommendation: Hex `#0F172A` should work — sharp/libvips accepts standard CSS colors. Verify with a test run of the generator before committing the config.

---

## Sources

### Primary (HIGH confidence)

- MDN Web Docs: `env()` — https://developer.mozilla.org/en-US/docs/Web/CSS/env — safe-area-inset-* syntax, browser support, fallback pattern
- Vite Plugin PWA: PWA Minimal Requirements — https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html — apple-touch-icon 180px requirement, manifest icon configuration
- Vite Plugin PWA: Assets Generator CLI — https://vite-pwa-org.netlify.app/assets-generator/cli — `@vite-pwa/assets-generator` configuration, `createAppleSplashScreens` API
- sharp documentation — https://sharp.pixelplumbing.com/api-output/ — SVG to PNG resize API

### Secondary (MEDIUM confidence)

- Bram.us: Prevent overscroll bounce (updated for modern iOS) — https://www.bram.us/2016/05/02/prevent-overscroll-bounce-in-ios-mobilesafari-pure-css/ — `overscroll-behavior: none` + fixed html pattern; verified by multiple independent sources
- CSS-IRL: Preventing overscroll bounce — https://css-irl.info/preventing-overscroll-bounce-with-css/ — two-layer approach confirmation
- WebMobileFirst: iPhone 11 device specs — https://www.webmobilefirst.com/en/devices/apple-iphone-11/ — CSS viewport 414x896, DPR 2, physical 828x1792
- Appscope / Medium: iOS splash screen link tags — media query format for iPhone 11 portrait/landscape confirmed by yesviz.com device database

### Tertiary (LOW confidence — flag for validation)

- Community consensus on `position: fixed` + standalone PWA behavior: Cannot be verified against Apple official documentation (Apple does not document PWA behavior extensively). Multiple credible developer sources agree on the pattern but real-device testing is required.
- GSAP `stopOverscroll()` as alternative: Documented but requires GSAP dependency — not recommended for this project. LOW confidence on "no standalone bounce" claim.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `@vite-pwa/assets-generator` and `sharp` verified via official docs; MDN env() documentation is authoritative
- Architecture: HIGH for safe areas and icon; MEDIUM for scroll lock (community-verified pattern, not Apple-documented)
- Pitfalls: MEDIUM — derived from developer community experience; SVG namespace bug is directly observed in the codebase

**Research date:** 2026-02-27
**Valid until:** 2026-09-27 (stable domain — CSS environment variables, PWA specs change slowly)
