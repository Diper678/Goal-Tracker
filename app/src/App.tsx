import { useState } from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { useTheme } from '@/hooks/useTheme';
import { AchievementCard } from '@/components/AchievementCard';
import { AchievementForm } from '@/components/AchievementForm';
import { StatsPanel } from '@/components/StatsPanel';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CATEGORY_CONFIG, CATEGORY_HEX } from '@/types/achievement';
import type { Achievement, RarityType, CategoryType } from '@/types/achievement';
import { Plus, Filter, Gamepad2 } from 'lucide-react';

type FilterType = 'all' | 'completed' | 'pending';
type CategoryFilterType = 'all' | CategoryType;

function App() {
  const {
    achievements,
    isLoaded,
    addAchievement,
    toggleAchievement,
    deleteAchievement,
    updateAchievement,
    getStats
  } = useAchievements();

  const { theme, toggleTheme } = useTheme();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterType>('all');

  const stats = getStats();

  const statusFiltered = achievements.filter(ach => {
    if (filter === 'completed') return ach.completed;
    if (filter === 'pending') return !ach.completed;
    return true;
  });

  const filteredAchievements = statusFiltered
    .filter(ach => categoryFilter === 'all' || ach.category === categoryFilter);

  const categoryCounts = (Object.keys(CATEGORY_CONFIG) as CategoryType[]).reduce(
    (acc, cat) => ({ ...acc, [cat]: statusFiltered.filter(a => a.category === cat).length }),
    {} as Record<CategoryType, number>
  );

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAchievement(null);
  };

  const handleUpdate = (id: string, title: string, description: string, rarity: RarityType, icon: string, category: CategoryType) => {
    updateAchievement(id, { title, description, rarity, icon, category });
  };

  const defaultCategory: CategoryType = achievements[0]?.category ?? 'salud';

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-game-bg flex items-center justify-center">
        <div className="text-game-text text-xl font-mono">
          CARGANDO...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-bg py-8 px-4">
      <div className="max-w-[480px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="w-11" />
          <img src="/icon.svg" alt="Logros" className="w-14 h-14 rounded-xl" />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        {/* Stats Panel */}
        <StatsPanel {...stats} />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-game-text-secondary" />
            <div className="flex bg-game-surface border-2 border-game-border">
              {(['all', 'completed', 'pending'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`
                    px-4 min-h-[44px] text-sm font-mono uppercase transition-all duration-150
                    ${filter === f
                      ? 'bg-primary text-white'
                      : 'text-game-text-secondary hover:text-game-text hover:bg-game-card'}
                  `}
                >
                  {f === 'all' ? 'Todos' : f === 'completed' ? 'Completados' : 'Pendientes'}
                </button>
              ))}
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary border-2 border-primary/80 text-white font-bold font-mono tracking-wide hover:bg-primary/90 transition-all duration-150 shadow-lg shadow-black/30"
          >
            <Plus className="w-5 h-5" />
            NUEVO LOGRO
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {/* "Todas" chip */}
          <button
            onClick={() => setCategoryFilter('all')}
            className={`
              flex-shrink-0 flex items-center gap-1.5
              px-3 min-h-[44px] border-2 text-sm font-mono whitespace-nowrap
              transition-all duration-150
              ${categoryFilter === 'all'
                ? 'bg-primary border-primary/80 text-white'
                : 'border-game-border bg-game-card text-game-text-secondary'}
            `}
          >
            Todas ({statusFiltered.length})
          </button>
          {/* Category chips */}
          {(Object.keys(CATEGORY_CONFIG) as CategoryType[]).map(cat => {
            const { Icon, name, border, bg, text } = CATEGORY_CONFIG[cat];
            const count = categoryCounts[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`
                  flex-shrink-0 flex items-center gap-1.5
                  px-3 min-h-[44px] border-2 text-sm font-mono whitespace-nowrap
                  transition-all duration-150
                  ${categoryFilter === cat ? `${border} ${bg} ${text}` : 'border-game-border bg-game-card text-game-text-secondary'}
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {name} ({count})
              </button>
            );
          })}
        </div>

        {/* Achievements Grid */}
        {
          filteredAchievements.length > 0 ? (
            <div className="grid gap-4">
              {filteredAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  onToggle={toggleAchievement}
                  onDelete={deleteAchievement}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-game-surface/50 border-2 border-dashed border-game-border">
              {categoryFilter !== 'all' ? (
                <>
                  {(() => {
                    const { Icon, name } = CATEGORY_CONFIG[categoryFilter];
                    return (
                      <>
                        <span style={{ color: CATEGORY_HEX[categoryFilter], opacity: 0.4 }}>
                          <Icon className="w-16 h-16 mx-auto mb-4" />
                        </span>
                        <p className="text-game-text-secondary text-lg font-mono">
                          No hay logros en {name}
                        </p>
                      </>
                    );
                  })()}
                </>
              ) : (
                <>
                  <Gamepad2 className="w-16 h-16 text-game-text-secondary/40 mx-auto mb-4" />
                  <p className="text-game-text-secondary text-lg font-mono">
                    {filter === 'all'
                      ? 'No hay logros. ¡Crea tu primero!'
                      : filter === 'completed'
                        ? 'No hay logros completados aún.'
                        : '¡Todos los logros completados!'}
                  </p>
                </>
              )}
            </div>
          )
        }

        {/* Achievement Form Modal */}
        <AchievementForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={addAchievement}
          onUpdate={handleUpdate}
          editingAchievement={editingAchievement}
          defaultCategory={defaultCategory}
        />

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-game-text-secondary/60 text-sm font-mono">
            LOGROS ANUALES v1.0 • Datos guardados localmente
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
