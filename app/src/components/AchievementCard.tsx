import type { Achievement } from '@/types/achievement';
import { RARITY_COLORS } from '@/types/achievement';
import { Check, Trash2, Edit } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (achievement: Achievement) => void;
}

export function AchievementCard({ achievement, onToggle, onDelete, onEdit }: AchievementCardProps) {
  const colors = RARITY_COLORS[achievement.rarity];
  const isCompleted = achievement.completed;

  return (
    <div
      className={`
        relative group transition-all duration-200
        ${isCompleted ? 'opacity-100' : 'opacity-60 grayscale'}
      `}
    >
      {/* 8-bit pixel border effect */}
      <div className={`
        relative p-4
        bg-gray-900
        border-4 ${colors.border}
        ${isCompleted ? `shadow-lg ${colors.glow}` : ''}
        transition-all duration-200
      `}
        style={{
          boxShadow: isCompleted
            ? `4px 4px 0px 0px rgba(0,0,0,0.5), 0 0 20px ${achievement.rarity === 'legendary' ? '#facc15' : achievement.rarity === 'epic' ? '#a855f7' : achievement.rarity === 'rare' ? '#ef4444' : '#3b82f6'}`
            : '4px 4px 0px 0px rgba(0,0,0,0.5)',
          imageRendering: 'pixelated'
        }}
      >
        {/* Corner pixels for 8-bit effect */}
        <div className={`absolute -top-1 -left-1 w-2 h-2 ${colors.border.replace('border-', 'bg-')}`} />
        <div className={`absolute -top-1 -right-1 w-2 h-2 ${colors.border.replace('border-', 'bg-')}`} />
        <div className={`absolute -bottom-1 -left-1 w-2 h-2 ${colors.border.replace('border-', 'bg-')}`} />
        <div className={`absolute -bottom-1 -right-1 w-2 h-2 ${colors.border.replace('border-', 'bg-')}`} />

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`
            w-16 h-16 flex items-center justify-center text-3xl
            border-2 ${colors.border} ${colors.bg}
            ${isCompleted ? 'animate-pulse' : ''}
          `}
            style={{ imageRendering: 'pixelated' }}
          >
            {achievement.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`
              font-bold text-lg mb-1 truncate
              ${isCompleted ? 'text-white' : 'text-gray-400'}
            `}
              style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
            >
              {achievement.title}
            </h3>
            <p className={`
              text-sm mb-2 line-clamp-2
              ${isCompleted ? 'text-gray-300' : 'text-gray-500'}
            `}
              style={{ fontFamily: 'monospace' }}
            >
              {achievement.description}
            </p>
            <div className="flex items-center gap-2">
              <span className={`
                text-xs px-2 py-1 border-2
                ${colors.border} ${colors.bg}
                ${isCompleted ? 'text-white' : 'text-gray-400'}
              `}
                style={{ fontFamily: 'monospace' }}
              >
                {RARITY_COLORS[achievement.rarity].name.toUpperCase()}
              </span>
              {isCompleted && achievement.completedAt && (
                <span className="text-xs text-gray-500" style={{ fontFamily: 'monospace' }}>
                  {new Date(achievement.completedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onToggle(achievement.id)}
              className={`
                w-10 h-10 flex items-center justify-center
                border-2 transition-all duration-150
                ${isCompleted
                  ? `bg-green-600 border-green-400 hover:bg-green-500`
                  : 'bg-gray-700 border-gray-500 hover:bg-gray-600'}
              `}
              title={isCompleted ? 'Desmarcar' : 'Completar'}
            >
              <Check className={`w-5 h-5 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
            </button>
            <button
              onClick={() => onEdit(achievement)}
              className="w-10 h-10 flex items-center justify-center bg-gray-700 border-2 border-gray-500 hover:bg-gray-600 transition-all duration-150"
              title="Editar"
            >
              <Edit className="w-4 h-4 text-gray-300" />
            </button>
            <button
              onClick={() => onDelete(achievement.id)}
              className="w-10 h-10 flex items-center justify-center bg-red-900/50 border-2 border-red-600 hover:bg-red-800/50 transition-all duration-150"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
