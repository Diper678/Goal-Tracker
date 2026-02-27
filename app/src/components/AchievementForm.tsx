import { useState, useEffect } from 'react';
import type { RarityType, Achievement } from '@/types/achievement';
import { RARITY_COLORS } from '@/types/achievement';
import { X, Plus, Save } from 'lucide-react';

interface AchievementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, rarity: RarityType, icon: string) => void;
  onUpdate?: (id: string, title: string, description: string, rarity: RarityType, icon: string) => void;
  editingAchievement?: Achievement | null;
}

const ICON_OPTIONS = [
  '🏆', '⭐', '💎', '🔥', '⚔️', '🛡️', '💰', '🔑', '📜', '🎯',
  '🎮', '👑', '🏅', '🎖️', '⚡', '🌟', '🗡️', '🧙', '🐉', '🏰',
  '❤️', '💙', '💜', '🧡', '💚', '🖤', '🤍', '💛', '💖', '💗',
  '🎵', '🎨', '📚', '💻', '🚀', '🌙', '☀️', '🌈', '💡', '🧠',
  '💪', '🏃', '🚴', '🏊', '🧘', '🍕', '🍔', '🍰', '☕', '🍺',
  '🌺', '🌻', '🌹', '🍀', '🌵', '🌲', '🔔', '🎁', '🎈', '🎉',
  '✈️', '🚗', '🚲', '🗺️', '🧭', '⏰', '📅', '✅', '❌', '❓',
  '🐱', '🐶', '🦊', '🦁', '🐯', '🦄', '🦋', '🐢', '🐙', '🦕'
];

export function AchievementForm({ isOpen, onClose, onSubmit, onUpdate, editingAchievement }: AchievementFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rarity, setRarity] = useState<RarityType>('common');
  const [icon, setIcon] = useState('🏆');

  useEffect(() => {
    if (editingAchievement) {
      setTitle(editingAchievement.title);
      setDescription(editingAchievement.description);
      setRarity(editingAchievement.rarity);
      setIcon(editingAchievement.icon);
    } else {
      setTitle('');
      setDescription('');
      setRarity('common');
      setIcon('🏆');
    }
  }, [editingAchievement, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      if (editingAchievement && onUpdate) {
        onUpdate(editingAchievement.id, title.trim(), description.trim(), rarity, icon);
      } else {
        onSubmit(title.trim(), description.trim(), rarity, icon);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-game-bg/95 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full w-full max-w-[480px] mx-auto bg-game-surface p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-game-text font-mono tracking-wide">
            {editingAchievement ? 'EDITAR LOGRO' : 'NUEVO LOGRO'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-rarity-rare/20 border-2 border-rarity-rare/60 hover:bg-rarity-rare/30 transition-all duration-150"
          >
            <X className="w-4 h-4 text-rarity-rare" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm text-game-text-secondary font-mono mb-2">
              TÍTULO
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Maestro del Código"
              className="w-full px-3 py-2 bg-game-card border-2 border-game-border text-game-text placeholder:text-game-text-secondary/50 focus:border-primary focus:outline-none transition-colors font-mono"
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-game-text-secondary font-mono mb-2">
              DESCRIPCIÓN
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Completa 100 proyectos de programación"
              className="w-full px-3 py-2 bg-game-card border-2 border-game-border text-game-text placeholder:text-game-text-secondary/50 focus:border-primary focus:outline-none transition-colors resize-none font-mono"
              rows={3}
              maxLength={150}
            />
          </div>

          {/* Rarity Selection */}
          <div>
            <label className="block text-sm text-game-text-secondary font-mono mb-2">
              RAREZA
            </label>
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
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm text-game-text-secondary font-mono mb-2">
              ÍCONO
            </label>
            <div className="grid grid-cols-8 gap-2 max-h-60 overflow-y-auto p-2 border-2 border-game-border bg-game-card/50">
              {ICON_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`
                    w-10 h-10 flex items-center justify-center text-xl border-2 transition-all duration-150
                    ${icon === emoji
                      ? 'border-rarity-legendary bg-rarity-legendary/15'
                      : 'border-game-border bg-game-card hover:border-game-border/80'}
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title.trim() || !description.trim()}
            className={`
              w-full py-3 mt-4 border-2 font-bold font-mono tracking-wide transition-all duration-150
              flex items-center justify-center gap-2
              ${title.trim() && description.trim()
                ? 'bg-primary border-primary/80 text-white hover:bg-primary/90'
                : 'bg-game-card border-game-border text-game-text-secondary/40 cursor-not-allowed'}
            `}
          >
            {editingAchievement ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editingAchievement ? 'GUARDAR CAMBIOS' : 'CREAR LOGRO'}
          </button>
        </form>
      </div>
    </div>
  );
}
