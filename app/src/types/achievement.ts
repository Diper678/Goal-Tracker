import type { ComponentType } from 'react';
import { Heart, Briefcase, User, Palette, FolderOpen } from 'lucide-react';

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
