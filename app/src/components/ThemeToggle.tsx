import { Sun, Moon } from 'lucide-react';
import type { Theme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isSteam = theme === 'steam';

  return (
    <button
      onClick={onToggle}
      className="min-w-[44px] min-h-[44px] flex items-center justify-center border-2 border-game-border bg-game-surface hover:bg-game-card transition-all duration-150"
      title={isSteam ? 'Cambiar a tema Stardust' : 'Cambiar a tema Steam'}
    >
      {isSteam
        ? <Sun className="w-5 h-5 text-game-text-secondary" />
        : <Moon className="w-5 h-5 text-game-text-secondary" />}
    </button>
  );
}
