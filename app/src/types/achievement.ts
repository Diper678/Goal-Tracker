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
