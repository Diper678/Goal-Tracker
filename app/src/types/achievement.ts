import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Heart, Briefcase, User, Palette, FolderOpen,
  // Gaming
  Trophy, Star, Crown, Gem, Flame, Zap, Target, Award, Medal,
  Sword, Swords, Shield, Axe, Scroll, Pickaxe, Castle, Rocket,
  Dices, Sparkles, Wand, WandSparkles,
  // Salud
  Brain, Activity, Dumbbell, Apple, Footprints, HeartPulse,
  Bike, Waves, Pill, Stethoscope,
  // Trabajo
  Code, Laptop, Terminal, Database, Calendar, Clock,
  FileText, TrendingUp, Presentation, BadgeCheck, Building,
  // Creatividad
  Music, Guitar, Headphones, Mic, Camera, Film, Feather,
  Paintbrush, Notebook,
  // Naturaleza
  TreePine, Flower, Sun, Moon, Cloud, Leaf, Mountain, Wind,
  Snowflake, Rainbow, Bird, Fish, Turtle, Rabbit,
} from 'lucide-react';

export type RarityType = 'common' | 'rare' | 'epic' | 'legendary';

export type CategoryType = 'salud' | 'trabajo' | 'personal' | 'creatividad' | 'otro';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: RarityType;
  category: CategoryType;
  completed: boolean;
  completedAt?: string;
  icon: string;
}

export const RARITY_COLORS: Record<RarityType, { border: string; bg: string; glow: string; text: string; name: string }> = {
  common: {
    border: 'border-rarity-common',
    bg: 'bg-rarity-common/15',
    glow: 'shadow-rarity-common/50',
    text: 'text-rarity-common',
    name: 'Común'
  },
  rare: {
    border: 'border-rarity-rare',
    bg: 'bg-rarity-rare/15',
    glow: 'shadow-rarity-rare/50',
    text: 'text-rarity-rare',
    name: 'Raro'
  },
  epic: {
    border: 'border-rarity-epic',
    bg: 'bg-rarity-epic/15',
    glow: 'shadow-rarity-epic/50',
    text: 'text-rarity-epic',
    name: 'Épico'
  },
  legendary: {
    border: 'border-rarity-legendary',
    bg: 'bg-rarity-legendary/15',
    glow: 'shadow-rarity-legendary/50',
    text: 'text-rarity-legendary',
    name: 'Legendario'
  }
};

export const CATEGORY_CONFIG: Record<CategoryType, {
  border: string;
  bg: string;
  text: string;
  name: string;
  Icon: ComponentType<{ className?: string }>;
}> = {
  salud:       { border: 'border-category-salud',       bg: 'bg-category-salud/15',       text: 'text-category-salud',       name: 'Salud',       Icon: Heart },
  trabajo:     { border: 'border-category-trabajo',     bg: 'bg-category-trabajo/15',     text: 'text-category-trabajo',     name: 'Trabajo',     Icon: Briefcase },
  personal:    { border: 'border-category-personal',    bg: 'bg-category-personal/15',    text: 'text-category-personal',    name: 'Personal',    Icon: User },
  creatividad: { border: 'border-category-creatividad', bg: 'bg-category-creatividad/15', text: 'text-category-creatividad', name: 'Creatividad', Icon: Palette },
  otro:        { border: 'border-category-otro',        bg: 'bg-category-otro/15',        text: 'text-category-otro',        name: 'Otro',        Icon: FolderOpen },
};

// Raw hex values for inline styles (dynamic Tailwind classes not purge-safe)
export const CATEGORY_HEX: Record<CategoryType, string> = {
  salud:       '#10B981',
  trabajo:     '#F97316',
  personal:    '#06B6D4',
  creatividad: '#EC4899',
  otro:        '#64748B',
};

// Lucide icon name-to-component lookup (kebab-case keys match lucide.dev URL slugs)
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

// Resolve a stored icon name (string) to its Lucide component; returns null for emoji fallback
export function resolveIcon(iconValue: string): LucideIcon | null {
  return ICON_MAP[iconValue] ?? null;
}

// Categorized icon sections for the picker UI
export const ICON_SECTIONS = [
  { label: 'Gaming', icons: ['trophy', 'star', 'crown', 'gem', 'flame', 'zap', 'target', 'award', 'medal', 'sword', 'swords', 'shield', 'axe', 'scroll', 'pickaxe', 'castle', 'rocket', 'dices', 'sparkles', 'wand', 'wand-sparkles'] },
  { label: 'Salud', icons: ['heart', 'brain', 'activity', 'dumbbell', 'apple', 'footprints', 'heart-pulse', 'bike', 'waves', 'pill', 'stethoscope'] },
  { label: 'Trabajo', icons: ['briefcase', 'code', 'laptop', 'terminal', 'database', 'calendar', 'clock', 'file-text', 'trending-up', 'presentation', 'badge-check', 'building'] },
  { label: 'Creatividad', icons: ['palette', 'music', 'guitar', 'headphones', 'mic', 'camera', 'film', 'feather', 'paintbrush', 'notebook'] },
  { label: 'Naturaleza', icons: ['tree-pine', 'flower', 'sun', 'moon', 'cloud', 'leaf', 'mountain', 'wind', 'snowflake', 'rainbow', 'bird', 'fish', 'turtle', 'rabbit'] },
] as const;

// Raw rarity hex values for inline styles on locked card borders
export const RARITY_HEX: Record<RarityType, string> = {
  common: '#3B82F6',
  rare: '#EF4444',
  epic: '#A855F7',
  legendary: '#FACC15',
};
