# Phase 3: Categories System - Research

**Researched:** 2026-02-28
**Domain:** React state management, TypeScript type extension, localStorage migration, Tailwind CSS UI patterns
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Category List & Identity
- Fixed set of 5 categories + catch-all: **Salud, Trabajo, Personal, Creatividad, Otro**
- Each category gets a **distinct color AND a Lucide icon** for maximum visual differentiation
- Colors must not clash with existing rarity colors (blue/red/purple/yellow) — use complementary tones
- Category field is **required** with **smart default**: pre-selects the last-used category (falls back to first category for brand new users)

#### Assignment UX in Form
- Category picker placed **after rarity, before icon** in the form: Title → Description → Rarity → Category → Icon → Submit
- Picker style: **button grid matching the rarity picker** (2-column or 3-column grid of tappable buttons with category color + icon)
- Selected state uses category color background + border, unselected uses neutral game-card style (matching rarity picker pattern)

#### Data Migration
- Existing achievements without a `category` field get **auto-assigned 'otro'** on first load after update
- Silent migration in `useAchievements` hook — no user prompt, no UI disruption

#### Filter Bar Interaction
- **Horizontal scroll chips** below the existing status filter bar
- "Todas" chip selected by default, tap any category chip to filter
- Both filters work simultaneously with AND logic: status filter × category filter
- **Show achievement counts** on each chip: e.g., "Salud (3)"
- Counts update dynamically based on active status filter
- **Category-specific empty state** message when filtered category has 0 results: "No hay logros en [Categoría]" with the category icon

#### Stats Panel Breakdown
- Per-category stats appear **below the existing rarity grid** as a new section
- Each category row shows: icon + name + **completed/total count + mini progress bar**
- **Hide categories with 0 achievements** — only show categories that have at least 1 achievement
- Section header: "POR CATEGORÍA" in the same font-mono style as rarity labels

### Claude's Discretion
- Exact category colors (must complement existing rarity palette without clashing)
- Lucide icon choices per category
- Column count for category button grid in form (2 or 3 columns based on fit)
- Mini progress bar styling in stats panel
- Category chip scroll behavior details (fade edges, snap scrolling, etc.)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CAT-01 | User can assign a category (salud, trabajo, personal, creatividad, etc.) to each achievement | TypeScript union type + CATEGORY_CONFIG pattern mirrors RARITY_COLORS; form picker reuses rarity button grid pattern; `addAchievement` signature extended; `updateAchievement` via existing `Partial<Omit<Achievement,'id'>>` already handles new field |
| CAT-02 | User can filter achievements by category | New `categoryFilter` state in App.tsx; `filteredAchievements` extended with AND logic; horizontal scroll chip bar follows existing filter bar pattern; count chips calculated from status-filtered set |
| CAT-03 | User can see per-category progress breakdown in the stats panel | `getStats()` extended with `byCategory` map; StatsPanel receives new prop; categories with 0 hidden; mini progress bar styled per category color |
</phase_requirements>

---

## Summary

Phase 3 is a pure frontend data-model + UI extension of the existing codebase. No new libraries are needed. The entire phase works within the project's established patterns: TypeScript union types and config objects (mirroring `RARITY_COLORS`), React state in `useAchievements`, Tailwind utility classes, and Lucide icons already installed at `lucide-react@^0.562.0`.

The most important architectural decision is already locked: a `CATEGORY_CONFIG` constant in `types/achievement.ts` that carries color, Lucide icon component, and Spanish label for each of the six categories. Every consuming component imports this single source of truth, exactly as they do with `RARITY_COLORS` today.

The two places that need new Tailwind color tokens are `tailwind.config.js` (six new `category-*` named colors) and `index.css` (corresponding CSS custom properties, optional but consistent with existing `--color-rarity-*` pattern). The migration path is zero-risk: the load `useEffect` in `useAchievements` already runs before any render; a single `.map()` defaulting missing `category` to `'otro'` is the entire migration.

**Primary recommendation:** Mirror the `RARITY_COLORS` / rarity-picker / byRarity-stats pattern exactly — all design and code patterns already proven in the codebase are directly reusable.

---

## Standard Stack

### Core (already installed — NO new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 19 | ^19.2.0 | Component state and rendering | Already in project |
| TypeScript ~5.9 | ~5.9.3 | Type-safe category union and config | Already in project |
| Tailwind CSS 3 | ^3.4.19 | Utility-class styling for picker chips, progress bar | Already in project |
| lucide-react | ^0.562.0 | Category icons (Heart, Briefcase, User, Palette, FolderOpen) | Already installed; used in StatsPanel, AchievementCard, App |
| tailwindcss-animate | ^1.0.7 | Transition utilities already used project-wide | Already in project |

### No New Dependencies

Phase 3 requires zero new npm packages. All required primitives (icons, state, persistence, styling) already exist in the project.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom chip row | `@radix-ui/react-toggle-group` (already installed) | Radix ToggleGroup would add accessibility but adds abstraction; the existing plain-button filter pattern (App.tsx:87-105) is simpler and already HIG-compliant with min-h-[44px] |
| Tailwind named tokens | Inline hex values | Named tokens (`category-salud`, etc.) keep class names readable and searchable; matches the existing `rarity-common` pattern |

**Installation:**
```bash
# No installation required — all dependencies are present
```

---

## Architecture Patterns

### Recommended Project Structure

No new files strictly required. The plan touches:

```
app/src/
├── types/
│   └── achievement.ts          # Add CategoryType union + CATEGORY_CONFIG
├── hooks/
│   └── useAchievements.ts      # Extend addAchievement, getStats, add migration
├── components/
│   ├── AchievementForm.tsx     # Add category picker section
│   ├── AchievementCard.tsx     # Show category badge (optional display)
│   └── StatsPanel.tsx          # Add byCategory section
├── App.tsx                     # Add categoryFilter state, chip bar, AND-filter logic
└── index.css                   # (optional) --color-category-* CSS vars
```

Optionally extract reusable pieces:
```
app/src/components/
└── CategoryChips.tsx           # Standalone chip bar (if App.tsx grows too large)
```

### Pattern 1: CATEGORY_CONFIG — Mirror of RARITY_COLORS

**What:** A `Record<CategoryType, { border, bg, text, name, icon }>` constant in `types/achievement.ts`. The `icon` field holds the Lucide icon component (or its name string if dynamic import preferred).

**When to use:** Every place that needs category color, label, or icon — form picker, filter chips, stats rows, card badge.

**Example:**
```typescript
// Source: Mirrors existing RARITY_COLORS pattern in app/src/types/achievement.ts

import { Heart, Briefcase, User, Palette, FolderOpen } from 'lucide-react';

export type CategoryType = 'salud' | 'trabajo' | 'personal' | 'creatividad' | 'otro';

export const CATEGORY_CONFIG: Record<CategoryType, {
  border: string;
  bg: string;
  text: string;
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = {
  salud:        { border: 'border-category-salud',        bg: 'bg-category-salud/15',        text: 'text-category-salud',        name: 'Salud',        Icon: Heart },
  trabajo:      { border: 'border-category-trabajo',      bg: 'bg-category-trabajo/15',      text: 'text-category-trabajo',      name: 'Trabajo',      Icon: Briefcase },
  personal:     { border: 'border-category-personal',     bg: 'bg-category-personal/15',     text: 'text-category-personal',     name: 'Personal',     Icon: User },
  creatividad:  { border: 'border-category-creatividad',  bg: 'bg-category-creatividad/15',  text: 'text-category-creatividad',  name: 'Creatividad',  Icon: Palette },
  otro:         { border: 'border-category-otro',         bg: 'bg-category-otro/15',         text: 'text-category-otro',         name: 'Otro',         Icon: FolderOpen },
};
```

### Pattern 2: Tailwind Color Tokens for Categories

**What:** Six new named colors in `tailwind.config.js` following the `rarity-*` naming convention.

**Color Recommendations (Claude's discretion — complementary to existing palette):**

Existing rarity colors to avoid clashing with:
- `rarity-common`: #3B82F6 (blue)
- `rarity-rare`: #EF4444 (red)
- `rarity-epic`: #A855F7 (purple)
- `rarity-legendary`: #FACC15 (yellow)
- `game-accent`: #22C55E (green — completion state)

Recommended category colors (distinct tones not in use):
- `category-salud`: `#10B981` — emerald (distinct from game-accent #22C55E; warmer teal-green)
- `category-trabajo`: `#F97316` — orange (warm, distinct from yellow legendary and red rare)
- `category-personal`: `#06B6D4` — cyan (cool blue-green, distinct from blue common)
- `category-creatividad`: `#EC4899` — pink/fuchsia (distinct from purple epic)
- `category-otro`: `#64748B` — slate (neutral, catch-all feel)

**Example config addition:**
```javascript
// Source: tailwind.config.js — extend existing colors block
'category-salud':       '#10B981',
'category-trabajo':     '#F97316',
'category-personal':    '#06B6D4',
'category-creatividad': '#EC4899',
'category-otro':        '#64748B',
```

### Pattern 3: Smart Last-Used Default

**What:** Store last-used category in `localStorage` separately (or derive from last achievement). Pre-select on form open.

**Implementation approach — minimal, no new keys:**
```typescript
// In AchievementForm.tsx useEffect (edit/new branch)
// For new achievement: default to last achievement's category, or 'salud' if no achievements exist
const defaultCategory = editingAchievement?.category
  ?? (achievements[0]?.category ?? 'salud');
setCategory(defaultCategory);
```

Since `achievements` is passed down (or accessed via context), the last-created achievement (index 0, since prepended) provides the last-used category. No extra localStorage key needed.

### Pattern 4: Silent Data Migration

**What:** During initial load in `useAchievements`, map any achievement missing `category` to `'otro'`.

**Example:**
```typescript
// Source: Mirrors existing load useEffect in app/src/hooks/useAchievements.ts

useEffect(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: Achievement[] = JSON.parse(stored);
      // Silent migration: assign 'otro' to any achievement without a category
      const migrated = parsed.map(a => ({
        ...a,
        category: a.category ?? 'otro'
      } as Achievement));
      setAchievements(migrated);
    }
  } catch (error) {
    console.error('Error loading achievements:', error);
  }
  setIsLoaded(true);
}, []);
```

The migrated data is immediately written back through the save `useEffect` (runs after `isLoaded` becomes true), so the migration persists without extra code.

### Pattern 5: AND-Logic Dual Filter

**What:** `filteredAchievements` in App.tsx applies both `filter` (status) and `categoryFilter` as independent predicates chained with `.filter()`.

**Example:**
```typescript
// Source: Extends existing filteredAchievements in app/src/App.tsx

type CategoryFilterType = 'all' | CategoryType;

const [categoryFilter, setCategoryFilter] = useState<CategoryFilterType>('all');

const filteredAchievements = achievements
  .filter(ach => {
    if (filter === 'completed') return ach.completed;
    if (filter === 'pending') return !ach.completed;
    return true;
  })
  .filter(ach => categoryFilter === 'all' || ach.category === categoryFilter);
```

### Pattern 6: Chip Count Against Status-Filtered Set

**What:** Chip counts reflect how many achievements are in each category *within the current status filter*, so counts update dynamically.

**Example:**
```typescript
// Counts are derived from the status-filtered set, not the full achievements array
const statusFiltered = achievements.filter(ach => {
  if (filter === 'completed') return ach.completed;
  if (filter === 'pending') return !ach.completed;
  return true;
});

const categoryCounts = (Object.keys(CATEGORY_CONFIG) as CategoryType[]).reduce(
  (acc, cat) => ({ ...acc, [cat]: statusFiltered.filter(a => a.category === cat).length }),
  {} as Record<CategoryType, number>
);
// totalCount = statusFiltered.length (for "Todas" chip)
```

### Pattern 7: Horizontal Scroll Chip Bar

**What:** A `div` with `overflow-x-auto` and `flex gap-2` wrapping chip buttons. iOS-friendly: `scrollbar-none` (or `::-webkit-scrollbar { display: none }`), `-webkit-overflow-scrolling: touch` already on body.

**Example:**
```tsx
// Below the existing status filter bar in App.tsx
<div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
  {/* "Todas" chip */}
  <button
    onClick={() => setCategoryFilter('all')}
    className={`
      flex-shrink-0 flex items-center gap-1.5
      px-3 min-h-[44px] border-2 text-sm font-mono whitespace-nowrap
      transition-all duration-150
      ${categoryFilter === 'all'
        ? 'bg-primary border-primary/80 text-white'
        : 'border-game-border bg-game-card text-game-text-secondary'}
    `}
  >
    Todas ({statusFiltered.length})
  </button>
  {/* Category chips */}
  {(Object.keys(CATEGORY_CONFIG) as CategoryType[]).map(cat => {
    const { Icon, name, border, bg, text } = CATEGORY_CONFIG[cat];
    const count = categoryCounts[cat];
    return (
      <button
        key={cat}
        onClick={() => setCategoryFilter(cat)}
        className={`
          flex-shrink-0 flex items-center gap-1.5
          px-3 min-h-[44px] border-2 text-sm font-mono whitespace-nowrap
          transition-all duration-150
          ${categoryFilter === cat ? `${border} ${bg} ${text}` : 'border-game-border bg-game-card text-game-text-secondary'}
        `}
      >
        <Icon className="w-3.5 h-3.5" />
        {name} ({count})
      </button>
    );
  })}
</div>
```

### Pattern 8: Category Picker in Form (Reuse Rarity Grid)

**What:** Button grid identical in structure to lines 112-128 of `AchievementForm.tsx`. User decision allows 2 or 3 columns — 3 columns fits 5+1 items better (two rows of 3), but 2 columns matches rarity picker exactly. Recommendation: 3-column grid for 6 items.

**Example:**
```tsx
{/* Category Selection — placed after Rarity, before Icon */}
<div>
  <label className="block text-sm text-game-text-secondary font-mono mb-2">
    CATEGORÍA
  </label>
  <div className="grid grid-cols-3 gap-2">
    {(Object.keys(CATEGORY_CONFIG) as CategoryType[]).map((cat) => {
      const { name, border, bg, text, Icon } = CATEGORY_CONFIG[cat];
      return (
        <button
          key={cat}
          type="button"
          onClick={() => setCategory(cat)}
          className={`
            flex items-center justify-center gap-1.5
            px-2 py-2 border-2 text-xs font-mono transition-all duration-150
            ${category === cat
              ? `${border} ${bg} ${text}`
              : 'border-game-border bg-game-card text-game-text-secondary hover:border-game-border/80'}
          `}
        >
          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
          {name.toUpperCase()}
        </button>
      );
    })}
  </div>
</div>
```

### Pattern 9: byCategory Stats in getStats()

**What:** Extend `getStats()` return to include `byCategory` with completed and total per category.

**Example:**
```typescript
// Source: Extends getStats() in app/src/hooks/useAchievements.ts

const byCategory = (Object.keys(CATEGORY_CONFIG) as CategoryType[]).reduce(
  (acc, cat) => {
    const catAchs = achievements.filter(a => a.category === cat);
    acc[cat] = { total: catAchs.length, completed: catAchs.filter(a => a.completed).length };
    return acc;
  },
  {} as Record<CategoryType, { total: number; completed: number }>
);

return { total, completed, byRarity, byCategory, percentage: ... };
```

### Pattern 10: Per-Category Stats Rows in StatsPanel

**What:** New section below rarity grid. Hide rows where total === 0. Mini progress bar uses category color via inline style (since Tailwind can't construct dynamic class names from runtime values).

**Example:**
```tsx
{/* POR CATEGORÍA section — below rarity grid */}
{hasAnyCategory && (
  <div className="mt-4 pt-4 border-t-2 border-game-border">
    <p className="text-xs text-game-text-secondary font-mono mb-3">POR CATEGORÍA</p>
    <div className="space-y-2">
      {(Object.keys(CATEGORY_CONFIG) as CategoryType[])
        .filter(cat => byCategory[cat].total > 0)
        .map(cat => {
          const { name, Icon } = CATEGORY_CONFIG[cat];
          const { total, completed } = byCategory[cat];
          const pct = Math.round((completed / total) * 100);
          // categoryColor must be inline — dynamic Tailwind classes are not purge-safe
          const categoryColor = CATEGORY_HEX[cat]; // e.g. { salud: '#10B981', ... }
          return (
            <div key={cat} className="flex items-center gap-2">
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: categoryColor }} />
              <span className="text-xs font-mono w-24 text-game-text-secondary">{name.toUpperCase()}</span>
              <div className="flex-1 h-2 bg-game-card border border-game-border overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: categoryColor }}
                />
              </div>
              <span className="text-xs font-mono text-game-text-secondary w-12 text-right">
                {completed}/{total}
              </span>
            </div>
          );
        })}
    </div>
  </div>
)}
```

**IMPORTANT:** Tailwind's JIT/purge will NOT pick up dynamic class names like `` `text-category-${cat}` `` at runtime. For the mini progress bar and icon colors in StatsPanel, use `inline style` with a `CATEGORY_HEX` map that holds raw hex values. The static class names in CATEGORY_CONFIG (e.g., `'border-category-salud'`) are safe because they are written as literal strings.

### Anti-Patterns to Avoid

- **Dynamic Tailwind class construction:** Never do `` `bg-category-${cat}` `` — Tailwind's content scanner sees this as a template literal, not a full class name, and will not emit the CSS. Always write full class names as string literals (e.g., `'bg-category-salud'`).
- **Storing Lucide icon name as string:** Storing `'Heart'` and doing `React.createElement` or dynamic lookup is fragile. Store the component reference directly in CATEGORY_CONFIG.
- **Mutating migrated data in the save effect before load completes:** The existing guard `if (isLoaded)` in the save effect already prevents premature writes. Migration runs in the load effect and sets state; the save effect fires after, which correctly persists migrated data. Do not add extra guards.
- **Filtering chip counts from full achievements array:** Counts must come from the status-filtered set so they remain consistent with what's shown in the list.
- **onSubmit signature mismatch:** `App.tsx` passes `addAchievement` directly as `onSubmit`. Both `addAchievement` and `AchievementForm.onSubmit` must be updated in lockstep to add the `category` parameter.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Horizontal scroll with touch momentum | Custom scroll with JS listeners | CSS `overflow-x: auto` + `-webkit-overflow-scrolling: touch` (already on body) | Native browser scroll is smoother, less JS |
| Icon display | Custom SVG or emoji | `lucide-react` components already installed | Consistent sizing, strokeWidth, accessible |
| Category filter logic | Complex state machine | Two independent `.filter()` calls chained | Simple AND logic; React re-renders are fast enough for n < 200 achievements |
| Progress bar | Canvas or SVG chart | Plain `div` with `width` inline style | Matches the existing main progress bar pattern (StatsPanel line 55-59) |
| Last-used category persistence | Separate `localStorage` key | Derive from `achievements[0].category` (last-created is at index 0) | Zero extra storage; always in sync with data |

**Key insight:** Every UI primitive in Phase 3 already has a working prototype in the existing codebase. The task is composition, not invention.

---

## Common Pitfalls

### Pitfall 1: Dynamic Tailwind Class Names Not Emitted

**What goes wrong:** Developer writes `` className={`bg-category-${cat}`} `` and sees no background color at runtime. The CSS rule was never generated.

**Why it happens:** Tailwind scans source files for complete class name strings at build time. Template literals with dynamic segments are not recognized as full class names.

**How to avoid:** Always store full, literal class name strings in CATEGORY_CONFIG (e.g., `bg: 'bg-category-salud/15'`). For truly dynamic colors (mini progress bar), use inline `style={{ backgroundColor: hex }}` with a separate `CATEGORY_HEX` map.

**Warning signs:** Color appears in dev but disappears after `vite build`, or color never appears at all if dev server did an HMR of config.

### Pitfall 2: addAchievement / onSubmit Signature Drift

**What goes wrong:** `addAchievement` in hook is updated to accept `category`, but `AchievementForm.onSubmit` prop type or `App.tsx` callback is not updated, causing TypeScript errors or silent data loss.

**Why it happens:** The function is defined in three places: hook signature, form prop interface, and App.tsx handler. They must all change atomically.

**How to avoid:** Update in this order: (1) `Achievement` type, (2) `addAchievement` in hook, (3) `AchievementFormProps.onSubmit`, (4) `handleUpdate` in App.tsx. TypeScript will surface any missed callsite as a type error.

**Warning signs:** `TS2345` argument count mismatch errors after partial update.

### Pitfall 3: Update Flow Missing category

**What goes wrong:** Editing an existing achievement via `onUpdate` / `updateAchievement` does not pass `category`, so category resets or is not persisted.

**Why it happens:** `handleUpdate` in App.tsx currently destructures 5 fields (`id, title, description, rarity, icon`). If `category` is not added to this destructure, it is silently dropped.

**How to avoid:** Add `category` to the `onUpdate` prop, `handleUpdate` function, and the `updateAchievement` call. The existing `Partial<Omit<Achievement, 'id'>>` type for `updates` already supports it without further changes to the hook.

### Pitfall 4: StatsPanel Prop Interface Not Extended

**What goes wrong:** `StatsPanel` receives `byCategory` from App but its prop interface doesn't declare it, causing TypeScript errors or silent prop loss.

**Why it happens:** Props are forwarded with spread `{...stats}` — TypeScript will catch the mismatch if `StatsPanelProps` is not updated.

**How to avoid:** Update `StatsPanelProps` interface to include `byCategory: Record<CategoryType, { total: number; completed: number }>` before writing rendering logic.

### Pitfall 5: Category Filter Persists Stale State Across Context Switch

**What goes wrong:** User filters to "Salud", completes the last salud achievement, switches status filter to "Pendientes" — the category filter still shows "Salud (0)" and the empty state fires. This is actually correct behavior per spec ("No hay logros en Salud"), but a confusing UX if not intentional.

**Why it happens:** Intentional by design (locked decision: AND logic). The count on the chip will show 0, which communicates the state clearly.

**How to avoid:** Ensure the chip count for the active category chip also goes to 0 visually, so the user understands why the list is empty. The category-specific empty state message ("No hay logros en [Categoría]") handles this.

### Pitfall 6: Migration Fires on Every Load Without Guard

**What goes wrong:** The migration `.map()` runs on every localStorage load, even after data is already migrated, adding unnecessary CPU on each app open.

**Why it happens:** No version guard in the migration code.

**How to avoid:** The migration is idempotent — `a.category ?? 'otro'` returns `a.category` unchanged if it already exists. No version flag needed; the overhead is negligible (one pass over the array). This is the correct approach for this scale.

---

## Code Examples

Verified patterns from codebase inspection:

### Existing Rarity Picker (AchievementForm.tsx:112-128) — Template for Category Picker
```tsx
// Source: app/src/components/AchievementForm.tsx lines 112-128
<div className="grid grid-cols-2 gap-2">
  {(Object.keys(RARITY_COLORS) as RarityType[]).map((r) => (
    <button
      key={r}
      type="button"
      onClick={() => setRarity(r)}
      className={`
        px-3 py-2 border-2 text-sm font-mono transition-all duration-150
        ${rarity === r
          ? `${RARITY_COLORS[r].border} ${RARITY_COLORS[r].bg} ${RARITY_COLORS[r].text}`
          : 'border-game-border bg-game-card text-game-text-secondary hover:border-game-border/80'}
      `}
    >
      {RARITY_COLORS[r].name.toUpperCase()}
    </button>
  ))}
</div>
```
Category picker duplicates this structure exactly, replacing `RARITY_COLORS` with `CATEGORY_CONFIG` and adding the `<Icon>` component.

### Existing Status Filter Bar (App.tsx:87-105) — Style Reference for Chip Bar
```tsx
// Source: app/src/App.tsx lines 87-105
<div className="flex bg-game-surface border-2 border-game-border">
  {(['all', 'completed', 'pending'] as FilterType[]).map((f) => (
    <button
      key={f}
      onClick={() => setFilter(f)}
      className={`
        px-4 min-h-[44px] text-sm font-mono uppercase transition-all duration-150
        ${filter === f
          ? 'bg-primary text-white'
          : 'text-game-text-secondary hover:text-game-text hover:bg-game-card'}
      `}
    >
      {f === 'all' ? 'Todos' : f === 'completed' ? 'Completados' : 'Pendientes'}
    </button>
  ))}
</div>
```
Category chips use the same `min-h-[44px]` (Apple HIG 44px requirement from Phase 2), same `font-mono uppercase`, same transition — but are a horizontal scroll strip rather than a joined group.

### Existing Main Progress Bar (StatsPanel.tsx:55-59) — Template for Mini Bars
```tsx
// Source: app/src/components/StatsPanel.tsx lines 55-59
<div className="w-full h-4 bg-game-card border-2 border-game-border mb-4 overflow-hidden">
  <div
    className={`h-full transition-all duration-500 ${percentage === 100 ? 'bg-rarity-legendary' : 'bg-rarity-common'}`}
    style={{ width: `${percentage}%` }}
  />
</div>
```
Mini category bar uses same structure at `h-2` height with `style={{ backgroundColor: categoryHex }}`.

### Existing getStats() (useAchievements.ts:73-83) — Template for byCategory Extension
```typescript
// Source: app/src/hooks/useAchievements.ts lines 73-83
const getStats = useCallback(() => {
  const total = achievements.length;
  const completed = achievements.filter(a => a.completed).length;
  const byRarity = {
    common: achievements.filter(a => a.rarity === 'common').length,
    ...
  };
  return { total, completed, byRarity, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
}, [achievements]);
```
`byCategory` follows the same structure, expanded to carry both `total` and `completed` per category (rarity only tracks total count, categories need both for the progress bar).

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Emoji icons for categories | Lucide SVG icon components | This phase (Phase 3) | Consistent sizing, color control via CSS, no font rendering issues |
| No category field | `category: CategoryType` required field | This phase | All new achievements must have category; old data migrated to 'otro' |
| Single-dimension filter (status only) | Dual AND-filter (status × category) | This phase | `filteredAchievements` becomes two chained `.filter()` calls |

**Deprecated/outdated:**
- Emoji icon picker: remains for the achievement `icon` field (Phase 4 replaces this with Lucide), but categories use Lucide components directly — not user-selectable.

---

## Open Questions

1. **Scrollbar hiding for category chip bar on non-WebKit browsers**
   - What we know: The custom scrollbar in `index.css` uses `::-webkit-scrollbar` (webkit only). On Firefox, the default scrollbar may appear under the chip row.
   - What's unclear: Whether `scrollbar-width: none` (Firefox) is needed alongside `::-webkit-scrollbar { display: none }`.
   - Recommendation: Add both `scrollbar-width: none` and `::-webkit-scrollbar { display: none }` to the chip container. Since primary target is iOS Safari, this is a low-priority polish item; acceptable to address if noticed in testing.

2. **Whether to pass `achievements` to AchievementForm for smart default**
   - What we know: The form currently receives no `achievements` prop. Smart default needs to know the last-used category.
   - What's unclear: Best approach — pass `achievements` array, pass only `lastUsedCategory`, or compute in App.tsx and pass as `defaultCategory` prop.
   - Recommendation: Pass `defaultCategory: CategoryType` as a new prop to `AchievementForm`. Computed in App.tsx as `achievements[0]?.category ?? 'salud'`. Avoids over-passing data to the form.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection — `app/src/types/achievement.ts`, `app/src/hooks/useAchievements.ts`, `app/src/components/AchievementForm.tsx`, `app/src/App.tsx`, `app/src/components/StatsPanel.tsx`, `app/src/index.css`, `app/tailwind.config.js`, `app/package.json`
- Tailwind CSS v3 documentation (content scanning behavior for dynamic class names) — verified against known Tailwind behavior that template literals are not scanned as full class names

### Secondary (MEDIUM confidence)
- Lucide React icon names (`Heart`, `Briefcase`, `User`, `Palette`, `FolderOpen`) — verified against lucide-react package installed in project; exact names subject to version; planner should verify against installed version
- Color contrast analysis (category colors vs. existing rarity palette) — manual comparison of hex values; no formal contrast-ratio tool used

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed and in use in the project
- Architecture: HIGH — all patterns mirror existing code verified by direct inspection
- Pitfalls: HIGH — derived from direct code analysis of the three specific callsites that must change atomically
- Color recommendations: MEDIUM — logical derivation from existing palette, not formally tested for contrast ratios

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (30 days — stable stack, no fast-moving dependencies)
