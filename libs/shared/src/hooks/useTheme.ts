import { useThemeContext } from '../contexts/ThemeContext';

// Public hook used throughout the app; now delegates to the global ThemeContext.
export function useTheme() {
  return useThemeContext();
}
