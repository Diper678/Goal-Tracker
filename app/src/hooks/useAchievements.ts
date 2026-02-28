import { useState, useEffect, useCallback } from 'react';
import type { Achievement, RarityType, CategoryType } from '@/types/achievement';

const STORAGE_KEY = '8bit-goal-tracker-achievements';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Achievement[] = JSON.parse(stored);
        const migrated = parsed.map(a => ({
          ...a,
          category: a.category ?? 'otro'
        } as Achievement));
        setAchievements(migrated);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever achievements change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
      } catch (error) {
        console.error('Error saving achievements:', error);
      }
    }
  }, [achievements, isLoaded]);

  const addAchievement = useCallback((title: string, description: string, rarity: RarityType, icon: string, category: CategoryType) => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title,
      description,
      rarity,
      category,
      completed: false,
      icon
    };
    setAchievements(prev => [newAchievement, ...prev]);
    return newAchievement;
  }, []);

  const toggleAchievement = useCallback((id: string) => {
    setAchievements(prev =>
      prev.map(ach =>
        ach.id === id
          ? {
              ...ach,
              completed: !ach.completed,
              completedAt: !ach.completed ? new Date().toISOString() : undefined
            }
          : ach
      )
    );
  }, []);

  const deleteAchievement = useCallback((id: string) => {
    setAchievements(prev => prev.filter(ach => ach.id !== id));
  }, []);

  const updateAchievement = useCallback((id: string, updates: Partial<Omit<Achievement, 'id'>>) => {
    setAchievements(prev =>
      prev.map(ach =>
        ach.id === id ? { ...ach, ...updates } : ach
      )
    );
  }, []);

  const getStats = useCallback(() => {
    const total = achievements.length;
    const completed = achievements.filter(a => a.completed).length;
    const byRarity = {
      common: achievements.filter(a => a.rarity === 'common').length,
      rare: achievements.filter(a => a.rarity === 'rare').length,
      epic: achievements.filter(a => a.rarity === 'epic').length,
      legendary: achievements.filter(a => a.rarity === 'legendary').length
    };
    const byCategory = (['salud', 'trabajo', 'personal', 'creatividad', 'otro'] as const).reduce(
      (acc, cat) => {
        const catAchs = achievements.filter(a => a.category === cat);
        acc[cat] = { total: catAchs.length, completed: catAchs.filter(a => a.completed).length };
        return acc;
      },
      {} as Record<CategoryType, { total: number; completed: number }>
    );
    return { total, completed, byRarity, byCategory, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [achievements]);

  return {
    achievements,
    isLoaded,
    addAchievement,
    toggleAchievement,
    deleteAchievement,
    updateAchievement,
    getStats
  };
}
