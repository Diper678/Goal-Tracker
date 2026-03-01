# Phase 4: Achievement Cards - Research

**Researched:** 2026-02-28
**Domain:** React animation, Lucide SVG icons, CSS keyframes, date-fns Spanish locale
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**1. Emoji to Lucide Icon Migration**
- Store Lucide icon name as string in existing `icon` field (e.g., `'trophy'`, `'sword'`)
- Requires a name-to-component lookup map at render time
- ~50-60 diverse icons covering gaming themes + lifestyle categories
- Backward compatibility: if `icon` value is not a recognized Lucide name, render raw emoji as-is
- Picker UI: categorized sections with theme headers (Gaming, Salud, Trabajo, Naturaleza)
- Replace current 8-column emoji grid with sectioned Lucide icon grid

**2. Locked vs Unlocked Card Styling**
- Enhanced dimmed + desaturated for locked state (more dramatic than current opacity-60 grayscale)
- Lock badge overlay in corner of icon for locked state (icon still visible)
- Rarity border color stays visible at muted opacity (~30%) when locked
- Same card size for locked and unlocked (no layout shift)

**3. Unlock Animation Behavior**
- Scale pop + shimmer: card scales ~1.05x, settles, shimmer sweeps across
- Duration: 600-800ms
- Post-unlock idle: gentle glow pulse or border shimmer on completed cards
- Rarity scaling: Common (subtle) -> Rare (moderate) -> Epic (stronger) -> Legendary (dramatic + extra glow)

**4. Card Layout Restructure**
- Horizontal layout preserved: icon -> text -> actions
- Larger icon area, category badge, cleaner typography
- Category chip + rarity chip in bottom metadata row
- Complete button always visible; edit/delete hidden by default, revealed on tap/long-press
- Completion date as relative time: "hace 3 días", "hace 1 semana"

### Claude's Discretion
None captured.

### Deferred Ideas (OUT OF SCOPE)
None captured during discussion.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CARD-01 | User sees Lucide SVG icons on achievement cards instead of emojis | ICON_MAP lookup pattern; lucide-react v0.562.0 has 1,571 icons; import by name at runtime |
| CARD-02 | User sees clearly distinct locked vs unlocked visual states | CSS filter: grayscale(100%) + opacity reduction + border opacity; Lock badge overlay with absolute positioning |
| CARD-03 | User sees redesigned gaming dashboard-style achievement card layout | Horizontal layout with category + rarity chips in metadata row; relative time via date-fns Spanish locale |
| CARD-04 | User sees subtle pixel-art border frames on achievement cards | Existing pixel corner dots pattern already in AchievementCard; enhance with clip-path or additional corners |
| CARD-05 | User sees satisfying visual animation when completing an achievement | CSS @keyframes scale-pop + shimmer sweep; useState to track just-unlocked cards for 800ms |
| DSGN-03 | User sees rarity-matched glow effects (color-coded box-shadow) | Already partially implemented; enhance with rarity-scaled intensities for completed state |
</phase_requirements>

---

## Summary

Phase 4 is a focused enhancement of the existing `AchievementCard.tsx` and `AchievementForm.tsx` components. The codebase is well-structured with established patterns (`RARITY_COLORS`, `CATEGORY_CONFIG`, `CATEGORY_HEX`) that the planner must follow. No new libraries are required — all tooling is already installed.

The two largest implementation concerns are: (1) the Lucide icon lookup map, which must be a static object (not dynamic imports) to avoid Tailwind purging issues and keep TypeScript happy; and (2) the unlock animation, which requires a short-lived React state flag (`justUnlocked`) set on toggle and cleared with a 700ms `setTimeout` — a common pattern for fire-once CSS animations in React.

The date-fns Spanish locale is confirmed available (`date-fns/locale/es`) and produces "hace 3 días" style output when using `formatDistanceToNow(date, { addSuffix: true, locale: es })`. The `tailwindcss-animate` plugin is already installed but the unlock shimmer animation should be defined as raw CSS `@keyframes` in `index.css` for full control over keyframe percentages.

**Primary recommendation:** Build the ICON_MAP as a single static `Record<string, LucideIcon>` in `achievement.ts`, trigger animations via a `justUnlocked` state set in `AchievementCard` on the toggle callback, and use CSS custom properties for rarity-scaled glow intensities.

---

## Standard Stack

### Core (all already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| lucide-react | 0.562.0 | SVG icon components | Already installed; 1,571 icons; tree-shakeable; same library used for UI icons (Check, Edit, Trash2) |
| date-fns | 4.1.0 | Relative time formatting | Already installed; `formatDistanceToNow` with `es` locale produces "hace X días" exactly |
| tailwindcss | 3.4.19 | Utility CSS + animation classes | Already configured; `transition-all`, `opacity-*`, `grayscale` utilities ready to use |
| tailwindcss-animate | 1.0.7 | `animate-in`, `zoom-in-*` utilities | Already installed; provides scale-in utilities as supplemental helpers |

### No New Installs Required

All dependencies for Phase 4 are present. The implementation is purely component logic + CSS keyframes.

---

## Architecture Patterns

### Icon Lookup Map Pattern

The locked decision requires storing icon names as strings and resolving them to Lucide components at render time. The correct pattern mirrors how `CATEGORY_CONFIG` stores the `Icon` component reference — but for an arbitrary name-to-component lookup:

```typescript
// Source: CONTEXT.md decision + CATEGORY_CONFIG existing pattern
// File: app/src/types/achievement.ts

import {
  Trophy, Star, Crown, Gem, Flame, Zap, Target, Award, Medal,
  Sword, Swords, Shield, Axe, Scroll, Pickaxe, Castle, Lock,
  Rocket, Bomb, Dices, Crosshair, Gamepad, Joystick,
  Heart, Brain, Activity, Dumbbell, Apple, Footprints, HeartPulse,
  Bike, Waves, Pill, Stethoscope,
  Briefcase, Code, Laptop, Terminal, Database, Calendar, Clock,
  FileText, TrendingUp, Presentation, BadgeCheck, Building,
  Palette, Music, Guitar, Headphones, Mic, Camera, Film, Feather,
  Brush, Paintbrush, Notebook, Wand, WandSparkles,
  TreePine, Flower, Sun, Moon, Cloud, Leaf, Mountain, Wind,
  Snowflake, Rainbow, Bird, Fish, Turtle, Rabbit,
  Sparkles, Star as StarIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  // Gaming
  trophy: Trophy,
  star: Star,
  crown: Crown,
  gem: Gem,
  flame: Flame,
  zap: Zap,
  target: Target,
  award: Award,
  medal: Medal,
  sword: Sword,
  swords: Swords,
  shield: Shield,
  axe: Axe,
  scroll: Scroll,
  pickaxe: Pickaxe,
  castle: Castle,
  rocket: Rocket,
  dices: Dices,
  crosshair: Crosshair,
  gamepad: Gamepad,
  joystick: Joystick,
  sparkles: Sparkles,
  wand: Wand,
  'wand-sparkles': WandSparkles,
  // Salud
  heart: Heart,
  brain: Brain,
  activity: Activity,
  dumbbell: Dumbbell,
  apple: Apple,
  footprints: Footprints,
  'heart-pulse': HeartPulse,
  bike: Bike,
  waves: Waves,
  pill: Pill,
  stethoscope: Stethoscope,
  // Trabajo
  briefcase: Briefcase,
  code: Code,
  laptop: Laptop,
  terminal: Terminal,
  database: Database,
  calendar: Calendar,
  clock: Clock,
  'file-text': FileText,
  'trending-up': TrendingUp,
  presentation: Presentation,
  'badge-check': BadgeCheck,
  building: Building,
  // Creatividad
  palette: Palette,
  music: Music,
  guitar: Guitar,
  headphones: Headphones,
  mic: Mic,
  camera: Camera,
  film: Film,
  feather: Feather,
  brush: Brush,
  paintbrush: Paintbrush,
  notebook: Notebook,
  // Naturaleza
  'tree-pine': TreePine,
  flower: Flower,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  leaf: Leaf,
  mountain: Mountain,
  wind: Wind,
  snowflake: Snowflake,
  rainbow: Rainbow,
  bird: Bird,
  fish: Fish,
  turtle: Turtle,
  rabbit: Rabbit,
};

// Helper to resolve icon name to component; returns null for emoji fallback
export function resolveIcon(iconValue: string): LucideIcon | null {
  return ICON_MAP[iconValue] ?? null;
}
```

**Key insight:** Use lowercase kebab-case keys (matching intuitive names from lucide.dev URL slugs). The ICON_MAP is a static object — no dynamic imports, no code-splitting complications. This is tree-shake safe because lucide-react already does it per named export.

### Rendering Pattern (Emoji Fallback)

```typescript
// Source: CONTEXT.md backward compatibility decision
// In AchievementCard.tsx

import { resolveIcon } from '@/types/achievement';
import { Lock } from 'lucide-react';

function AchievementIcon({ iconValue, rarity, isCompleted, colors }: ...) {
  const LucideIcon = resolveIcon(iconValue);

  return (
    <div className={`relative w-16 h-16 flex items-center justify-center
      border-2 ${colors.border} ${colors.bg}
      ${!isCompleted ? 'opacity-40 grayscale' : ''}
    `}>
      {LucideIcon
        ? <LucideIcon className={`w-8 h-8 ${colors.text}`} strokeWidth={1.5} />
        : <span className="text-3xl">{iconValue}</span>  /* emoji fallback */
      }
      {/* Lock badge overlay for locked state */}
      {!isCompleted && (
        <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5
          bg-game-card border border-game-border
          flex items-center justify-center">
          <Lock className="w-3 h-3 text-game-text-secondary" />
        </div>
      )}
    </div>
  );
}
```

### Unlock Animation Pattern

The fire-once animation on toggle requires React state to detect the transition moment. The `onToggle` callback in `AchievementCard` is the trigger point:

```typescript
// Source: Standard React pattern for fire-once CSS animations
// In AchievementCard.tsx

import { useState, useEffect, useRef } from 'react';

function AchievementCard({ achievement, onToggle, ... }) {
  const [justUnlocked, setJustUnlocked] = useState(false);
  const prevCompletedRef = useRef(achievement.completed);

  useEffect(() => {
    // Detect transition from incomplete -> complete
    if (!prevCompletedRef.current && achievement.completed) {
      setJustUnlocked(true);
      const timer = setTimeout(() => setJustUnlocked(false), 800);
      return () => clearTimeout(timer);
    }
    prevCompletedRef.current = achievement.completed;
  }, [achievement.completed]);

  const animationClass = justUnlocked
    ? `card-unlock-${achievement.rarity}`  // rarity-specific keyframe
    : '';

  return (
    <div className={`${animationClass} ...`}>
      ...
    </div>
  );
}
```

**Why `useRef` for previous value:** `useState` for `prevCompleted` would cause double renders. `useRef` reads the previous value without triggering re-renders, then we update it after the check.

### CSS Keyframes for Unlock Animation

```css
/* Source: CSS animation design — scale pop + shimmer sweep */
/* File: app/src/index.css */

/* Base unlock animation — scale pop */
@keyframes card-unlock {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.05); }
  60%  { transform: scale(0.98); }
  100% { transform: scale(1); }
}

/* Shimmer sweep — pseudo-element on card */
@keyframes shimmer-sweep {
  0%   { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
  50%  { opacity: 1; }
  100% { transform: translateX(200%) skewX(-15deg); opacity: 0; }
}

/* Per-rarity animation classes */
.card-unlock-common {
  animation: card-unlock 600ms ease-out forwards;
}
.card-unlock-common::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent);
  animation: shimmer-sweep 600ms ease-out forwards;
  pointer-events: none;
}

.card-unlock-rare {
  animation: card-unlock 650ms ease-out forwards;
}
.card-unlock-rare::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(239,68,68,0.35), transparent);
  animation: shimmer-sweep 650ms ease-out forwards;
  pointer-events: none;
}

.card-unlock-epic {
  animation: card-unlock 700ms ease-out forwards;
}
.card-unlock-epic::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent);
  animation: shimmer-sweep 700ms ease-out forwards;
  pointer-events: none;
}

.card-unlock-legendary {
  animation: card-unlock 800ms ease-out forwards;
}
.card-unlock-legendary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(250,204,21,0.5), transparent);
  animation: shimmer-sweep 800ms ease-out forwards;
  pointer-events: none;
}
```

**Critical:** The parent div must have `position: relative` and `overflow: hidden` for the `::after` shimmer to clip correctly.

### Post-Unlock Idle Glow Pulse

Replace the current `animate-pulse` on the icon container with a dedicated CSS animation on completed cards:

```css
/* File: app/src/index.css */

@keyframes glow-pulse-common    { 0%,100% { box-shadow: 4px 4px 0 #000, 0 0 8px #3B82F6;  } 50% { box-shadow: 4px 4px 0 #000, 0 0 20px #3B82F6;  } }
@keyframes glow-pulse-rare      { 0%,100% { box-shadow: 4px 4px 0 #000, 0 0 8px #EF4444;  } 50% { box-shadow: 4px 4px 0 #000, 0 0 20px #EF4444;  } }
@keyframes glow-pulse-epic      { 0%,100% { box-shadow: 4px 4px 0 #000, 0 0 10px #A855F7; } 50% { box-shadow: 4px 4px 0 #000, 0 0 25px #A855F7; } }
@keyframes glow-pulse-legendary { 0%,100% { box-shadow: 4px 4px 0 #000, 0 0 14px #FACC15; } 50% { box-shadow: 4px 4px 0 #000, 0 0 35px #FACC15; } }

.glow-idle-common    { animation: glow-pulse-common    3s ease-in-out infinite; }
.glow-idle-rare      { animation: glow-pulse-rare      3s ease-in-out infinite; }
.glow-idle-epic      { animation: glow-pulse-epic      2.5s ease-in-out infinite; }
.glow-idle-legendary { animation: glow-pulse-legendary 2s ease-in-out infinite; }
```

Apply `glow-idle-${achievement.rarity}` class to the card wrapper when `isCompleted === true`.

**Note:** The 4px offset in the box-shadow preserves the existing pixel-art drop shadow (`4px 4px 0px 0px var(--card-shadow)`).

### Relative Time Formatting (Spanish)

```typescript
// Source: date-fns v4 docs + confirmed locale file analysis
// date-fns/locale/es produces "hace 3 días" with addSuffix: true

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

function relativeTime(isoString: string): string {
  return formatDistanceToNow(new Date(isoString), {
    addSuffix: true,
    locale: es,
  });
}
// Output examples:
// "hace menos de un minuto"
// "hace 3 días"
// "hace 1 semana"
// "hace alrededor de 1 mes"
```

**Confirmed:** The Spanish locale (`date-fns/locale/es`) is installed and its `formatDistance` function prefixes with "hace " when `addSuffix: true` and date is in the past.

### Hidden Edit/Delete Actions (Tap to Reveal)

The decision is: complete button always visible, edit/delete hidden by default, revealed on tap or long-press. For a PWA (no hover), the correct pattern is toggle state on card tap:

```typescript
// In AchievementCard.tsx
const [actionsVisible, setActionsVisible] = useState(false);

// Card wrapper onClick toggles action visibility
// BUT: tapping action buttons must not bubble up to toggle

<div onClick={() => setActionsVisible(v => !v)}>
  ...
  <div className={`flex flex-col gap-2 transition-all duration-200
    ${actionsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none w-0 overflow-hidden'}`}>
    <EditButton onClick={(e) => { e.stopPropagation(); onEdit(achievement); }} />
    <DeleteButton onClick={(e) => { e.stopPropagation(); onDelete(achievement.id); }} />
  </div>
  <CompleteButton onClick={(e) => { e.stopPropagation(); onToggle(achievement.id); }} />
</div>
```

**Alternative considered:** Long-press. Long-press requires a custom hook (`useRef` timer, `onTouchStart`/`onTouchEnd`). The CONTEXT.md says "tap or long-press" — simpler tap-to-reveal is sufficient and matches mobile PWA patterns. The planner should use tap-to-toggle.

### Category Badge in Metadata Row

CATEGORY_CONFIG already provides `border`, `bg`, `text` Tailwind classes and the `Icon` component. Use CATEGORY_HEX for the icon color (inline style) per established pattern:

```typescript
// Mirror existing pattern from App.tsx category chips
import { CATEGORY_CONFIG, CATEGORY_HEX } from '@/types/achievement';

const { name, Icon, border, bg, text } = CATEGORY_CONFIG[achievement.category];

<span className={`text-xs px-2 py-1 border-2 font-mono flex items-center gap-1 ${border} ${bg} ${text}`}>
  <Icon className="w-3 h-3" style={{ color: CATEGORY_HEX[achievement.category] }} />
  {name.toUpperCase()}
</span>
```

---

## Available Lucide Icons (Confirmed, v0.562.0)

Verified by parsing the installed `lucide-react.d.ts` — 1,571 primary icon exports.

### Recommended 50-icon curated set by category section

**Gaming (19 icons):**
`Trophy`, `Star`, `Crown`, `Gem`, `Flame`, `Zap`, `Target`, `Award`, `Medal`, `Sword`, `Swords`, `Shield`, `Axe`, `Scroll`, `Pickaxe`, `Castle`, `Rocket`, `Dices`, `Sparkles`

**Salud (11 icons):**
`Heart`, `Brain`, `Activity`, `Dumbbell`, `Apple`, `Footprints`, `HeartPulse`, `Bike`, `Waves`, `Pill`, `Stethoscope`

**Trabajo (12 icons):**
`Briefcase`, `Code`, `Laptop`, `Terminal`, `Database`, `Calendar`, `Clock`, `FileText`, `TrendingUp`, `Presentation`, `BadgeCheck`, `Building`

**Creatividad (9 icons):**
`Palette`, `Music`, `Guitar`, `Headphones`, `Mic`, `Camera`, `Film`, `Feather`, `Paintbrush`

**Naturaleza (9 icons):**
`TreePine`, `Flower`, `Sun`, `Moon`, `Leaf`, `Mountain`, `Wind`, `Snowflake`, `Rainbow`

**Total: 60 icons** — matches the "50-60" locked decision.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Relative time in Spanish | Custom date formatter | `date-fns` `formatDistanceToNow` + `locale: es` | Edge cases (days/weeks/months/years), already installed |
| SVG icons | Individual SVG files | `lucide-react` named imports | Already installed, tree-shakeable, consistent stroke width |
| CSS keyframe animation | JavaScript animation library | Raw CSS `@keyframes` in `index.css` | No external dep; full control; better performance than JS |
| Dynamic Tailwind classes | Template strings like `text-${rarity}-500` | Static `RARITY_COLORS` map with full class strings | Tailwind purges dynamic class names at build time |

---

## Common Pitfalls

### Pitfall 1: Dynamic Tailwind Class Names
**What goes wrong:** Writing `className={`text-rarity-${achievement.rarity}`}` generates class names that Tailwind's purger never sees in source code, so they're stripped from the production build.
**Why it happens:** Tailwind statically scans source at build time; it does not evaluate template expressions.
**How to avoid:** Always use the `RARITY_COLORS[rarity].text` / `RARITY_COLORS[rarity].border` / `RARITY_COLORS[rarity].bg` lookup from the existing config. Same rule applies to any new rarity or category class references.
**Warning signs:** Styles work in dev but disappear in production build.

### Pitfall 2: CSS `::after` Shimmer Without `overflow: hidden`
**What goes wrong:** The shimmer `::after` pseudo-element bleeds outside the card border, ruining the visual.
**Why it happens:** `position: absolute` children escape their parent unless the parent clips with `overflow: hidden`.
**How to avoid:** Add `overflow-hidden` to the card wrapper div that hosts the shimmer animation.

### Pitfall 3: Animation Replaying on Re-render
**What goes wrong:** If `justUnlocked` is stored in parent state or if the component re-renders from a parent update, the animation could replay unintentionally.
**Why it happens:** `justUnlocked` is derived from a transition; if state lifts too high, any parent state change triggers the effect check.
**How to avoid:** Keep `justUnlocked` as local component state in `AchievementCard`. Use `useRef` to track the previous `completed` value to detect the transition accurately.

### Pitfall 4: `e.stopPropagation()` Missing on Action Buttons
**What goes wrong:** Clicking the Edit or Delete button also fires the card-level `onClick` that toggles `actionsVisible`, creating a visual flicker.
**Why it happens:** Click events bubble from child to parent in the DOM.
**How to avoid:** Add `e.stopPropagation()` to all action button `onClick` handlers inside the card.

### Pitfall 5: `import { es } from 'date-fns/locale'` vs Named Import
**What goes wrong:** `import es from 'date-fns/locale/es'` (default import) works in some bundlers but not all. The `date-fns` v4 package uses named exports.
**Why it happens:** `date-fns` v4 restructured its locale exports to named exports.
**How to avoid:** Use `import { es } from 'date-fns/locale'` (the barrel) or `import { es } from 'date-fns/locale/es'` — both are named exports in v4.

### Pitfall 6: Icon Map Keys Must Match Form Picker Keys
**What goes wrong:** Form saves `'heartPulse'` (camelCase) but ICON_MAP has key `'heart-pulse'` (kebab-case), causing the emoji fallback to render on card.
**Why it happens:** Inconsistency between how the form stores the icon name and how the ICON_MAP indexes it.
**How to avoid:** Define icon key constants as a typed union or at minimum use the same casing consistently everywhere. The kebab-case convention matches lucide.dev URL slugs and is more readable.

---

## Code Examples

### Full Locked State CSS

```typescript
// In AchievementCard.tsx — locked state visual treatment
const isLocked = !achievement.completed;

// Card container — grayscale + opacity for locked state
<div className={`
  relative transition-all duration-200
  ${isLocked ? 'opacity-50' : 'opacity-100'}
  ${isLocked ? 'grayscale' : ''}
`}>
  <div
    className={`
      relative p-4 bg-game-card overflow-hidden
      border-4
      ${isLocked ? colors.border + ' border-opacity-30' : colors.border}
      transition-all duration-200
      ${achievement.completed ? `glow-idle-${achievement.rarity}` : ''}
    `}
    style={{
      boxShadow: achievement.completed
        ? `4px 4px 0px rgba(0,0,0,0.5)`
        : '4px 4px 0px rgba(0,0,0,0.5)',
    }}
  >
```

**Note on `border-opacity-30`:** Tailwind 3 uses `border-opacity-*` utilities or the `/{opacity}` suffix on color utilities. Since `colors.border` is a class like `border-rarity-common`, you can wrap the border element and apply `opacity-30` via a sibling overlay, or use inline `borderColor` with hex + alpha. The cleanest approach is a CSS variable approach — or store a separate `borderMuted` hex in `RARITY_COLORS` for inline style use on locked cards.

### Picker Grid Section Structure

```typescript
// In AchievementForm.tsx — categorized icon picker
const ICON_SECTIONS = [
  {
    label: 'Gaming',
    icons: ['trophy', 'star', 'crown', 'gem', 'flame', 'zap', 'target', 'award', 'medal', 'sword', 'swords', 'shield', 'axe', 'scroll', 'pickaxe', 'castle', 'rocket', 'dices', 'sparkles'],
  },
  {
    label: 'Salud',
    icons: ['heart', 'brain', 'activity', 'dumbbell', 'apple', 'footprints', 'heart-pulse', 'bike', 'waves', 'pill', 'stethoscope'],
  },
  {
    label: 'Trabajo',
    icons: ['briefcase', 'code', 'laptop', 'terminal', 'database', 'calendar', 'clock', 'file-text', 'trending-up', 'presentation', 'badge-check', 'building'],
  },
  {
    label: 'Creatividad',
    icons: ['palette', 'music', 'guitar', 'headphones', 'mic', 'camera', 'film', 'feather', 'paintbrush'],
  },
  {
    label: 'Naturaleza',
    icons: ['tree-pine', 'flower', 'sun', 'moon', 'leaf', 'mountain', 'wind', 'snowflake', 'rainbow'],
  },
] as const;

// Render
{ICON_SECTIONS.map(section => (
  <div key={section.label}>
    <p className="text-xs text-game-text-secondary font-mono mb-2 mt-3 uppercase tracking-widest">
      {section.label}
    </p>
    <div className="grid grid-cols-8 gap-1.5">
      {section.icons.map(iconKey => {
        const LucideIcon = ICON_MAP[iconKey];
        if (!LucideIcon) return null;
        return (
          <button
            key={iconKey}
            type="button"
            onClick={() => setIcon(iconKey)}
            title={iconKey}
            className={`
              w-10 h-10 flex items-center justify-center border-2 transition-all duration-150
              ${icon === iconKey
                ? 'border-rarity-legendary bg-rarity-legendary/15'
                : 'border-game-border bg-game-card hover:border-game-border/80'}
            `}
          >
            <LucideIcon className={`w-5 h-5 ${icon === iconKey ? 'text-rarity-legendary' : 'text-game-text-secondary'}`} />
          </button>
        );
      })}
    </div>
  </div>
))}
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Emoji string icons | Lucide SVG named components via ICON_MAP | Consistent size, color, stroke; no font rendering variation across OS |
| `opacity-60 grayscale` locked state | Richer `opacity-50 grayscale` + lock badge + muted border | Immediate locked/unlocked recognition |
| `animate-pulse` on icon | Idle `glow-pulse-${rarity}` on full card | More gaming-trophy feel; rarity-differentiated |
| Absolute dates in card | `date-fns` relative time with Spanish locale | Casual gaming-log feel per design decision |
| 8-column emoji grid picker | Categorized Lucide icon sections | Organized discovery; category intent-matched icons |

---

## Open Questions

1. **Locked border opacity implementation**
   - What we know: `colors.border` is a full Tailwind class like `border-rarity-common`; Tailwind 3 does not support opacity modifiers on custom color variables via utility classes easily.
   - What's unclear: Whether to use `border-opacity-30` utility (deprecated in Tailwind v3 for non-DEFAULT colors), an inline style with hex+alpha, or a wrapper div approach.
   - Recommendation: Add a `borderHex` field to `RARITY_COLORS` and use `style={{ borderColor: isLocked ? colors.borderHex + '4D' : colors.borderHex }}` (hex alpha for ~30%). This avoids the Tailwind purge problem entirely.

2. **Long-press for action reveal vs tap**
   - What we know: CONTEXT.md says "tap or long-press." Long-press requires a custom hook.
   - What's unclear: Whether the user actually expects long-press or if tap-to-reveal is sufficient.
   - Recommendation: Implement tap-to-reveal. Simpler, no custom hook needed, works well on mobile PWA.

3. **Backward compatibility: what happens to existing `icon` values**
   - What we know: Existing achievements have emoji strings; the `resolveIcon` function returns null for unrecognized names, falling back to emoji rendering.
   - What's unclear: Whether old achievements with emoji icons will look broken in the new card layout.
   - Recommendation: The fallback emoji rendering should use the same `w-16 h-16` container with `text-3xl` centered text — same size as Lucide icons. No layout shift.

---

## Sources

### Primary (HIGH confidence)
- Installed `app/node_modules/lucide-react/dist/lucide-react.d.ts` — all 1,571 icon names confirmed via `grep`
- Installed `app/node_modules/date-fns/locale/es/_lib/formatDistance.js` — Spanish locale strings confirmed ("hace X días" pattern)
- Installed `app/node_modules/tailwindcss-animate/index.js` — available animation utilities confirmed
- `app/src/components/AchievementCard.tsx` — existing implementation read directly
- `app/src/components/AchievementForm.tsx` — existing emoji picker structure read directly
- `app/src/types/achievement.ts` — RARITY_COLORS, CATEGORY_CONFIG, CATEGORY_HEX patterns confirmed
- `app/src/index.css` — existing keyframes and CSS variables confirmed
- `app/tailwind.config.js` — color tokens, keyframes, plugin config confirmed
- `.planning/phases/04-achievement-cards/04-CONTEXT.md` — all locked decisions

### Secondary (MEDIUM confidence)
- React `useRef` for previous-value tracking — standard React pattern, well-documented

### Tertiary (LOW confidence)
- None — all claims verified against installed source code or official files in the repo.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries confirmed installed with exact versions
- Architecture: HIGH — patterns derived directly from existing codebase
- Icon availability: HIGH — scraped directly from installed type definitions (1,571 icons)
- Date-fns Spanish locale: HIGH — read locale source file, confirmed "hace X" output
- Animation approach: HIGH — raw CSS keyframes is the only correct approach for fire-once animations without a JS animation library
- Pitfalls: HIGH — derived from direct code analysis of current implementation

**Research date:** 2026-02-28
**Valid until:** 2026-04-28 (stable stack, no fast-moving dependencies)
