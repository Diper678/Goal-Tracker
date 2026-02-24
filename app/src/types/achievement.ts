export type RarityType = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: RarityType;
  completed: boolean;
  completedAt?: string;
  icon: string;
}

export const RARITY_COLORS: Record<RarityType, { border: string; bg: string; glow: string; name: string }> = {
  common: {
    border: 'border-blue-500',
    bg: 'bg-blue-900/30',
    glow: 'shadow-blue-500/50',
    name: 'Azul'
  },
  rare: {
    border: 'border-red-500',
    bg: 'bg-red-900/30',
    glow: 'shadow-red-500/50',
    name: 'Rojo'
  },
  epic: {
    border: 'border-purple-500',
    bg: 'bg-purple-900/30',
    glow: 'shadow-purple-500/50',
    name: 'Morado'
  },
  legendary: {
    border: 'border-yellow-400',
    bg: 'bg-yellow-900/30',
    glow: 'shadow-yellow-400/50',
    name: 'Dorado'
  }
};
