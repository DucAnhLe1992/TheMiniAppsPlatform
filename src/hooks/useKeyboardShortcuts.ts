import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const appShortcuts: Record<string, string> = {
  '1': '/',
  '2': '/apps/todo-list',
  '3': '/apps/shopping-list',
  '4': '/apps/pomodoro-timer',
  '5': '/apps/notes-manager',
  '6': '/apps/text-summarizer',
  '7': '/apps/currency-converter',
  '8': '/apps/weather-info',
  '9': '/apps/calendar',
};

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Alt/Option key is pressed (not in input fields)
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const target = e.target as HTMLElement;
        // Don't trigger if user is typing in an input or textarea
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }

        const path = appShortcuts[e.key];
        if (path) {
          e.preventDefault();
          navigate(path);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
};
