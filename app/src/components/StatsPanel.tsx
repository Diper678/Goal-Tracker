// StatsPanel component - no additional imports needed
import { Trophy, Target, Crown, Gem } from 'lucide-react';

interface StatsPanelProps {
  total: number;
  completed: number;
  byRarity: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  percentage: number;
}

export function StatsPanel({ total, completed, byRarity, percentage }: StatsPanelProps) {
  return (
    <div className="relative bg-game-surface border-4 border-game-border p-4 mb-6 shadow-lg shadow-black/30">
      {/* Corner pixels */}
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-game-border" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-game-border" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-game-border" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-game-border" />

      {/* Main Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-rarity-legendary" />
            <div>
              <p className="text-xs text-game-text-secondary font-mono">TOTAL</p>
              <p className="text-2xl font-bold text-game-text font-mono">{total}</p>
            </div>
          </div>
          <div className="w-px h-10 bg-game-border" />
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-game-accent" />
            <div>
              <p className="text-xs text-game-text-secondary font-mono">COMPLETADOS</p>
              <p className="text-2xl font-bold text-game-accent font-mono">{completed}</p>
            </div>
          </div>
        </div>

        {/* Percentage */}
        <div className="text-right">
          <p className="text-xs text-game-text-secondary font-mono">PROGRESO</p>
          <p className={`text-3xl font-bold font-mono ${percentage === 100 ? 'text-rarity-legendary' : 'text-rarity-common'}`}>
            {percentage}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-game-card border-2 border-game-border mb-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${percentage === 100 ? 'bg-rarity-legendary' : 'bg-rarity-common'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Rarity Breakdown */}
      <div className="grid grid-cols-4 gap-2">
        <div className="flex items-center gap-2 p-2 bg-rarity-common/10 border-2 border-rarity-common/30">
          <Gem className="w-4 h-4 text-rarity-common" />
          <div>
            <p className="text-xs text-rarity-common font-mono">COMÚN</p>
            <p className="text-lg font-bold text-game-text font-mono">{byRarity.common}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-rarity-rare/10 border-2 border-rarity-rare/30">
          <Gem className="w-4 h-4 text-rarity-rare" />
          <div>
            <p className="text-xs text-rarity-rare font-mono">RARO</p>
            <p className="text-lg font-bold text-game-text font-mono">{byRarity.rare}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-rarity-epic/10 border-2 border-rarity-epic/30">
          <Crown className="w-4 h-4 text-rarity-epic" />
          <div>
            <p className="text-xs text-rarity-epic font-mono">ÉPICO</p>
            <p className="text-lg font-bold text-game-text font-mono">{byRarity.epic}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-rarity-legendary/10 border-2 border-rarity-legendary/30">
          <Crown className="w-4 h-4 text-rarity-legendary" />
          <div>
            <p className="text-xs text-rarity-legendary font-mono">LEGENDARIO</p>
            <p className="text-lg font-bold text-game-text font-mono">{byRarity.legendary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
