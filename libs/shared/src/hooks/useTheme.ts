import { useState, useEffect, useMemo } from 'react';
import { lightTheme, darkTheme } from '../theme';

export type ThemeMode = 'light' | 'dark';

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme');
    return (stored as ThemeMode) || 'dark';
  });

  const theme = useMemo(() => {
    return themeMode === 'light' ? lightTheme : darkTheme;
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  return { theme, themeMode, toggleTheme };
}
