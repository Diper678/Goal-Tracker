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
    <div className="relative bg-gray-900 border-4 border-gray-600 p-4 mb-6"
      style={{
        boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.5)',
        imageRendering: 'pixelated'
      }}
    >
      {/* Corner pixels */}
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-600" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-600" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gray-600" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-600" />

      {/* Main Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>TOTAL</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'monospace' }}>{total}</p>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-600" />
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>COMPLETADOS</p>
              <p className="text-2xl font-bold text-green-400" style={{ fontFamily: 'monospace' }}>{completed}</p>
            </div>
          </div>
        </div>

        {/* Percentage */}
        <div className="text-right">
          <p className="text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>PROGRESO</p>
          <p className={`text-3xl font-bold ${percentage === 100 ? 'text-yellow-400' : 'text-blue-400'}`}
            style={{ fontFamily: 'monospace' }}>
            {percentage}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-800 border-2 border-gray-600 mb-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${percentage === 100 ? 'bg-yellow-400' : 'bg-blue-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Rarity Breakdown */}
      <div className="grid grid-cols-4 gap-2">
        <div className="flex items-center gap-2 p-2 bg-blue-900/20 border-2 border-blue-500/50">
          <Gem className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-xs text-blue-400" style={{ fontFamily: 'monospace' }}>AZUL</p>
            <p className="text-lg font-bold text-white" style={{ fontFamily: 'monospace' }}>{byRarity.common}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-red-900/20 border-2 border-red-500/50">
          <Gem className="w-4 h-4 text-red-400" />
          <div>
            <p className="text-xs text-red-400" style={{ fontFamily: 'monospace' }}>ROJO</p>
            <p className="text-lg font-bold text-white" style={{ fontFamily: 'monospace' }}>{byRarity.rare}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-purple-900/20 border-2 border-purple-500/50">
          <Crown className="w-4 h-4 text-purple-400" />
          <div>
            <p className="text-xs text-purple-400" style={{ fontFamily: 'monospace' }}>MORADO</p>
            <p className="text-lg font-bold text-white" style={{ fontFamily: 'monospace' }}>{byRarity.epic}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-yellow-900/20 border-2 border-yellow-400/50">
          <Crown className="w-4 h-4 text-yellow-400" />
          <div>
            <p className="text-xs text-yellow-400" style={{ fontFamily: 'monospace' }}>DORADO</p>
            <p className="text-lg font-bold text-white" style={{ fontFamily: 'monospace' }}>{byRarity.legendary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
