import { useState, useEffect } from 'react';
import type { RarityType, CategoryType, Achievement } from '@/types/achievement';
import { RARITY_COLORS, CATEGORY_CONFIG, ICON_MAP, ICON_SECTIONS } from '@/types/achievement';
import { X, Plus, Save } from 'lucide-react';

interface AchievementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, rarity: RarityType, icon: string, category: CategoryType) => void;
  onUpdate?: (id: string, title: string, description: string, rarity: RarityType, icon: string, category: CategoryType) => void;
  editingAchievement?: Achievement | null;
  defaultCategory?: CategoryType;
}

export function AchievementForm({ isOpen, onClose, onSubmit, onUpdate, editingAchievement, defaultCategory = 'salud' }: AchievementFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rarity, setRarity] = useState<RarityType>('common');
  const [icon, setIcon] = useState('trophy');
  const [category, setCategory] = useState<CategoryType>(defaultCategory);

  useEffect(() => {
    if (editingAchievement) {
      setTitle(editingAchievement.title);
      setDescription(editingAchievement.description);
      setRarity(editingAchievement.rarity);
      setIcon(editingAchievement.icon);
      setCategory(editingAchievement.category);
    } else {
      setTitle('');
      setDescription('');
      setRarity('common');
      setIcon('trophy');
      setCategory(defaultCategory);
    }
  }, [editingAchievement, isOpen, defaultCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      if (editingAchievement && onUpdate) {
        onUpdate(editingAchievement.id, title.trim(), description.trim(), rarity, icon, category);
      } else {
        onSubmit(title.trim(), description.trim(), rarity, icon, category);
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

          {/* Category Selection */}
          <div>
            <label className="block text-sm text-game-text-secondary font-mono mb-2">
              CATEGORÍA
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as CategoryType[]).map((cat) => {
                const { name, border, bg, text, Icon } = CATEGORY_CONFIG[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`
                      flex items-center justify-center gap-1.5
                      px-2 py-2 border-2 text-xs font-mono transition-all duration-150
                      ${category === cat
                        ? `${border} ${bg} ${text}`
                        : 'border-game-border bg-game-card text-game-text-secondary hover:border-game-border/80'}
                    `}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    {name.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm text-game-text-secondary font-mono mb-2">
              ÍCONO
            </label>
            <div className="max-h-60 overflow-y-auto p-2 border-2 border-game-border bg-game-card/50">
              {ICON_SECTIONS.map(section => (
                <div key={section.label}>
                  <p className="text-xs text-game-text-secondary font-mono mb-2 mt-3 uppercase tracking-widest first:mt-0">
                    {section.label}
                  </p>
                  <div className="grid grid-cols-8 gap-1.5">
                    {section.icons.map(iconKey => {
                      const LucideIcon = ICON_MAP[iconKey];
                      if (!LucideIcon) return null;
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setIcon(iconKey)}
                          title={iconKey}
                          className={`
                            min-w-[40px] min-h-[40px] flex items-center justify-center border-2 transition-all duration-150
                            ${icon === iconKey
                              ? 'border-rarity-legendary bg-rarity-legendary/15'
                              : 'border-game-border bg-game-card hover:border-game-border/80'}
                          `}
                        >
                          <LucideIcon className={`w-5 h-5 ${icon === iconKey ? 'text-rarity-legendary' : 'text-game-text-secondary'}`} strokeWidth={1.5} />
                        </button>
                      );
                    })}
                  </div>
                </div>
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
