import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@shared';

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const apps = [
  { name: 'Dashboard', path: '/', icon: '📊', keywords: ['home', 'overview'] },
  { name: 'To-Do List', path: '/apps/todo-list', icon: '✅', keywords: ['tasks', 'todos', 'checklist'] },
  { name: 'Shopping List', path: '/apps/shopping-list', icon: '🛒', keywords: ['shop', 'groceries', 'buy'] },
  { name: 'Pomodoro Timer', path: '/apps/pomodoro-timer', icon: '⏱️', keywords: ['timer', 'focus', 'productivity'] },
  { name: 'Notes & Snippets', path: '/apps/notes-manager', icon: '📝', keywords: ['notes', 'write', 'snippets', 'code'] },
  { name: 'Text Summarizer', path: '/apps/text-summarizer', icon: '📄', keywords: ['summarize', 'text', 'ai'] },
  { name: 'Currency & Budget', path: '/apps/currency-converter', icon: '💱', keywords: ['currency', 'money', 'convert', 'budget'] },
  { name: 'Weather Info', path: '/apps/weather-info', icon: '🌤️', keywords: ['weather', 'forecast', 'temperature'] },
  { name: 'Calendar', path: '/apps/calendar', icon: '📅', keywords: ['calendar', 'schedule', 'events', 'dates'] },
  { name: 'Habit Tracker', path: '/apps/habit-tracker', icon: '🎯', keywords: ['habits', 'goals', 'track', 'routine'] },
  { name: 'Profile', path: '/profile', icon: '👤', keywords: ['profile', 'account', 'settings', 'user'] },
];

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
`;

const Modal = styled(motion.div)`
  width: 90%;
  max-width: 600px;
  background: ${p => p.theme.colors.surface};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 16px;
  box-shadow: ${p => p.theme.shadows.xl};
  overflow: hidden;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  font-size: 1.125rem;
  color: ${p => p.theme.colors.text};
  outline: none;

  &::placeholder {
    color: ${p => p.theme.colors.textTertiary};
  }
`;

const Results = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
`;

const ResultItem = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: ${p => p.$selected ? p.theme.colors.primary + '15' : 'transparent'};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  color: ${p => p.theme.colors.text};

  &:hover {
    background: ${p => p.$selected ? p.theme.colors.primary + '20' : p.theme.colors.surfaceHover};
  }
`;

const ResultIcon = styled.div`
  font-size: 1.5rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${p => p.theme.colors.background};
`;

const ResultText = styled.div`
  flex: 1;
  
  div:first-child {
    font-weight: 500;
    margin-bottom: 0.125rem;
  }
  
  div:last-child {
    font-size: 0.875rem;
    color: ${p => p.theme.colors.textSecondary};
  }
`;

const Shortcut = styled.kbd`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: ${p => p.theme.colors.background};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 4px;
  font-family: monospace;
  color: ${p => p.theme.colors.textSecondary};
`;

const Footer = styled.div`
  padding: 0.75rem 1rem;
  border-top: 1px solid ${p => p.theme.colors.border};
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: ${p => p.theme.colors.textSecondary};
  
  > div {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
`;

const EmptyState = styled.div`
  padding: 3rem 1.5rem;
  text-align: center;
  color: ${p => p.theme.colors.textSecondary};
  font-size: 0.9375rem;
`;

const QuickSearch: React.FC<QuickSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const filteredApps = useMemo(() => {
    if (!query.trim()) return apps;
    const lowerQuery = query.toLowerCase();
    return apps.filter(app => 
      app.name.toLowerCase().includes(lowerQuery) ||
      app.keywords.some(keyword => keyword.includes(lowerQuery))
    );
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Support number keys 1-9 for quick selection
    if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1;
      if (filteredApps[index]) {
        e.preventDefault();
        navigate(filteredApps[index].path);
        onClose();
        return;
      }
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredApps.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredApps.length) % filteredApps.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredApps[selectedIndex]) {
          navigate(filteredApps[selectedIndex].path);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Modal
          theme={theme}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onClick={e => e.stopPropagation()}
        >
          <SearchInput
            theme={theme}
            type="text"
            placeholder="Search apps..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          
          <Results>
            {filteredApps.length > 0 ? (
              filteredApps.map((app, index) => (
                <ResultItem
                  key={app.path}
                  theme={theme}
                  $selected={index === selectedIndex}
                  onClick={() => handleSelect(app.path)}
                >
                  <ResultIcon theme={theme}>{app.icon}</ResultIcon>
                  <ResultText theme={theme}>
                    <div>{app.name}</div>
                    <div>{app.path}</div>
                  </ResultText>
                  {index < 9 && <Shortcut theme={theme}>{index + 1}</Shortcut>}
                </ResultItem>
              ))
            ) : (
              <EmptyState theme={theme}>
                No apps found for "{query}"
              </EmptyState>
            )}
          </Results>

          <Footer theme={theme}>
            <div><Shortcut theme={theme}>↑↓</Shortcut> Navigate</div>
            <div><Shortcut theme={theme}>↵</Shortcut> Select</div>
            <div><Shortcut theme={theme}>1-9</Shortcut> Quick</div>
            <div><Shortcut theme={theme}>Esc</Shortcut> Close</div>
          </Footer>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

export default QuickSearch;
