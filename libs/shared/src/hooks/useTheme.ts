import { useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../theme';

export type ThemeMode = 'light' | 'dark';

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme');
    return (stored as ThemeMode) || 'dark';
  });

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

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
