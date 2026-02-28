import { useState } from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { AchievementCard } from '@/components/AchievementCard';
import { AchievementForm } from '@/components/AchievementForm';
import { StatsPanel } from '@/components/StatsPanel';
import type { Achievement, RarityType } from '@/types/achievement';
import { Plus, Filter, Gamepad2 } from 'lucide-react';

type FilterType = 'all' | 'completed' | 'pending';

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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const stats = getStats();

  const filteredAchievements = achievements.filter(ach => {
    if (filter === 'completed') return ach.completed;
    if (filter === 'pending') return !ach.completed;
    return true;
  });

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAchievement(null);
  };

  const handleUpdate = (id: string, title: string, description: string, rarity: RarityType, icon: string) => {
    updateAchievement(id, { title, description, rarity, icon });
  };

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
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <Gamepad2 className="w-10 h-10 text-rarity-legendary" />
            <h1
              className="text-4xl md:text-5xl font-bold text-game-text font-mono"
              style={{
                letterSpacing: '0.1em',
                textShadow: '4px 4px 0px #000, -2px -2px 0px #ef4444, 2px -2px 0px #3b82f6, -2px 2px 0px #a855f7, 2px 2px 0px #eab308'
              }}
            >
              LOGROS ANUALES
            </h1>
            <Gamepad2 className="w-10 h-10 text-rarity-legendary" />
          </div>
          <p className="text-game-text-secondary">
            Define tus logros. Completa tu misión.
          </p>
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
              <Gamepad2 className="w-16 h-16 text-game-text-secondary/40 mx-auto mb-4" />
              <p className="text-game-text-secondary text-lg font-mono">
                {filter === 'all'
                  ? 'No hay logros. ¡Crea tu primero!'
                  : filter === 'completed'
                    ? 'No hay logros completados aún.'
                    : '¡Todos los logros completados!'}
              </p>
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
        />

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 p-4 bg-game-surface border-2 border-game-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rarity-common" />
              <span className="text-xs text-game-text-secondary font-mono">Común</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rarity-rare" />
              <span className="text-xs text-game-text-secondary font-mono">Raro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rarity-epic" />
              <span className="text-xs text-game-text-secondary font-mono">Épico</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rarity-legendary" />
              <span className="text-xs text-game-text-secondary font-mono">Legendario</span>
            </div>
          </div>
          <p className="mt-4 text-game-text-secondary/60 text-sm font-mono">
            LOGROS ANUALES v1.0 • Datos guardados localmente
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
