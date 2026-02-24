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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-md bg-gray-900 border-4 border-gray-600 p-6"
        style={{
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.5)',
          imageRendering: 'pixelated'
        }}
      >
        {/* Corner pixels */}
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-600" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-600" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gray-600" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-600" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            {editingAchievement ? 'EDITAR LOGRO' : 'NUEVO LOGRO'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-red-900/50 border-2 border-red-600 hover:bg-red-800/50 transition-all duration-150"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-2" style={{ fontFamily: 'monospace' }}>
              TÍTULO
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Maestro del Código"
              className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
              style={{ fontFamily: 'monospace' }}
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-2" style={{ fontFamily: 'monospace' }}>
              DESCRIPCIÓN
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Completa 100 proyectos de programación"
              className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors resize-none"
              style={{ fontFamily: 'monospace' }}
              rows={3}
              maxLength={150}
            />
          </div>

          {/* Rarity Selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-2" style={{ fontFamily: 'monospace' }}>
              RAREZA
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(RARITY_COLORS) as RarityType[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRarity(r)}
                  className={`
                    px-3 py-2 border-2 text-sm transition-all duration-150
                    ${rarity === r 
                      ? `${RARITY_COLORS[r].border} ${RARITY_COLORS[r].bg} text-white` 
                      : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'}
                  `}
                  style={{ fontFamily: 'monospace' }}
                >
                  {RARITY_COLORS[r].name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-2" style={{ fontFamily: 'monospace' }}>
              ÍCONO
            </label>
            <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border-2 border-gray-700 bg-gray-800/50">
              {ICON_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`
                    w-10 h-10 flex items-center justify-center text-xl border-2 transition-all duration-150
                    ${icon === emoji 
                      ? 'border-yellow-400 bg-yellow-900/30' 
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'}
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
              w-full py-3 mt-4 border-2 font-bold transition-all duration-150
              flex items-center justify-center gap-2
              ${title.trim() && description.trim()
                ? 'bg-green-600 border-green-400 text-white hover:bg-green-500'
                : 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'}
            `}
            style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
          >
            {editingAchievement ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editingAchievement ? 'GUARDAR CAMBIOS' : 'CREAR LOGRO'}
          </button>
        </form>
      </div>
    </div>
  );
}
