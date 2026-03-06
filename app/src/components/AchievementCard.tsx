import { useState, useEffect, useRef } from 'react';
import type { Achievement } from '@/types/achievement';
import { RARITY_COLORS, RARITY_HEX, CATEGORY_CONFIG, resolveIcon } from '@/types/achievement';
import { Check, Trash2, Edit, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface AchievementCardProps {
  achievement: Achievement;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (achievement: Achievement) => void;
}

export function AchievementCard({ achievement, onToggle, onDelete, onEdit }: AchievementCardProps) {
  const [justUnlocked, setJustUnlocked] = useState(false);
  const prevCompletedRef = useRef(achievement.completed);
  const [actionsVisible, setActionsVisible] = useState(false);

  // Fire unlock animation once when transitioning from incomplete -> complete
  useEffect(() => {
    if (!prevCompletedRef.current && achievement.completed) {
      setJustUnlocked(true);
      const timer = setTimeout(() => setJustUnlocked(false), 800);
      return () => clearTimeout(timer);
    }
    prevCompletedRef.current = achievement.completed;
  }, [achievement.completed]);

  const colors = RARITY_COLORS[achievement.rarity];
  const isCompleted = achievement.completed;
  const isLocked = !isCompleted;
  const catConfig = CATEGORY_CONFIG[achievement.category];

  // Resolve icon: Lucide component or null (emoji fallback)
  const LucideIcon = resolveIcon(achievement.icon);

  // Animation class — unlock takes priority over idle glow
  const animationClass = justUnlocked ? `card-unlock-${achievement.rarity}` : '';

  // Relative time in Spanish
  const relativeTime = isCompleted && achievement.completedAt
    ? formatDistanceToNow(new Date(achievement.completedAt), { addSuffix: true, locale: es })
    : null;

  return (
    <div
      className={`
        relative transition-all duration-200
        ${isLocked ? 'opacity-50 grayscale' : 'opacity-100'}
        ${animationClass}
      `}
      onClick={() => setActionsVisible(v => !v)}
    >
      {/* Inner card — overflow-hidden required for shimmer ::after clipping */}
      <div
        className={`
          relative p-4 bg-game-card border-4 overflow-hidden
          transition-all duration-200
          ${isLocked ? '' : colors.border}
          ${isCompleted && !justUnlocked ? `glow-idle-${achievement.rarity}` : ''}
        `}
        style={isLocked ? { borderColor: RARITY_HEX[achievement.rarity] + '4D' } : undefined}
      >
        {/* Pixel corner dots — retro 8-bit accent */}
        <div className={`absolute -top-1 -left-1 w-2 h-2 ${colors.border.replace('border-', 'bg-')}`} />
        <div className={`absolute -top-1 -right-1 w-2 h-2 ${colors.border.replace('border-', 'bg-')}`} />
        <div className={`absolute -bottom-1 -left-1 w-2 h-2 ${colors.border.replace('border-', 'bg-')}`} />
        <div className={`absolute -bottom-1 -right-1 w-2 h-2 ${colors.border.replace('border-', 'bg-')}`} />

        <div className="flex items-start gap-3">
          {/* Left column: icon + chips */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16">
            {/* Icon container — 64px with Lock badge overlay for locked state */}
            <div className={`
              relative w-16 h-16 flex items-center justify-center
              border-2 ${colors.border} ${colors.bg}
              ${isLocked ? 'opacity-40' : ''}
            `}>
              {LucideIcon
                ? <LucideIcon className={`w-8 h-8 ${colors.text}`} strokeWidth={1.5} />
                : <span className="text-3xl">{achievement.icon}</span>
              }
              {isLocked && (
                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-game-card border border-game-border flex items-center justify-center">
                  <Lock className="w-3 h-3 text-game-text-secondary" />
                </div>
              )}
            </div>

            {/* Rarity chip */}
            <span className={`w-full text-center text-[10px] leading-tight px-1 py-0.5 border-2 font-mono ${colors.border} ${colors.bg} ${colors.text}`}>
              {RARITY_COLORS[achievement.rarity].name.toUpperCase()}
            </span>

            {/* Category chip */}
            <span className={`w-full text-center text-[10px] leading-tight px-1 py-0.5 border-2 font-mono flex items-center justify-center gap-0.5 ${catConfig.border} ${catConfig.bg} ${catConfig.text}`}>
              <catConfig.Icon className="w-2.5 h-2.5" />
              {catConfig.name.toUpperCase()}
            </span>

            {/* Relative time — only if completed with a timestamp */}
            {relativeTime && (
              <span className="text-[10px] text-game-text-secondary/60 font-mono text-center leading-tight">
                {relativeTime}
              </span>
            )}
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <h3 className={`
              font-bold text-lg mb-1 truncate font-mono tracking-wide
              ${isCompleted ? 'text-game-text' : 'text-game-text-secondary'}
            `}>
              {achievement.title}
            </h3>
            <p className={`
              text-sm line-clamp-3
              ${isCompleted ? 'text-game-text-secondary' : 'text-game-text-secondary/60'}
            `}>
              {achievement.description}
            </p>
          </div>

          {/* Actions column */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {/* Complete button — ALWAYS visible */}
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(achievement.id); }}
              className={`
                min-w-[44px] min-h-[44px] flex items-center justify-center
                border-2 transition-all duration-150
                ${isCompleted
                  ? 'bg-game-accent border-game-accent/80 hover:bg-game-accent/90'
                  : 'bg-game-card border-game-border hover:bg-game-surface'}
              `}
              title={isCompleted ? 'Desmarcar' : 'Completar'}
            >
              <Check className={`w-5 h-5 ${isCompleted ? 'text-white' : 'text-game-text-secondary'}`} />
            </button>

            {/* Edit/Delete — revealed on card tap */}
            <div className={`flex flex-col gap-2 transition-all duration-200
              ${actionsVisible ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'}`}>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(achievement); }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-game-card border-2 border-game-border hover:bg-game-surface transition-all duration-150"
                title="Editar"
              >
                <Edit className="w-4 h-4 text-game-text-secondary" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(achievement.id); }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-rarity-rare/20 border-2 border-rarity-rare/60 hover:bg-rarity-rare/30 transition-all duration-150"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4 text-rarity-rare" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
