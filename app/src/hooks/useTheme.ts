import { useState, useEffect } from 'react';

export type Theme = 'steam' | 'stardust';

const STORAGE_KEY = '8bit-goal-tracker-theme';
const THEME_COLORS: Record<Theme, string> = {
  steam: '#030712',
  stardust: '#FFF5F7',
};

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'steam' || stored === 'stardust') return stored;
  } catch { /* SSR / private browsing */ }
  return 'steam';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLORS[theme]);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'steam' ? 'stardust' : 'steam');

  return { theme, toggleTheme } as const;
}
