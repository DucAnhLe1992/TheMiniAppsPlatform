import React from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme, supabase } from '@shared';

const Container = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 110; /* Above sidebar */

  @media (max-width: 1024px) {
    display: none;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${p => p.theme.colors.surface};
  border: 1px solid ${p => p.theme.colors.border};
  cursor: pointer;
  font-size: 1.25rem;
  color: ${p => p.theme.colors.text};
  box-shadow: ${p => p.theme.shadows.sm};
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    background: ${p => p.theme.colors.surfaceHover};
  }
  &:active {
    transform: scale(0.95);
  }
`;

const ProfileLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${p => p.theme.colors.surface};
  border: 1px solid ${p => p.theme.colors.border};
  text-decoration: none;
  font-size: 1.15rem;
  color: ${p => p.theme.colors.text};
  box-shadow: ${p => p.theme.shadows.sm};
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover { background: ${p => p.theme.colors.surfaceHover}; }
  &:active { transform: scale(0.95); }
  &.active { outline: 2px solid ${p => p.theme.colors.primary}; }
`;

const UserActions: React.FC = () => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error && !error.message.includes('Auth session missing')) {
      console.error('Logout error:', error);
      return;
    }
    navigate('/login');
  };

  return (
    <Container>
      <ProfileLink to="/profile" theme={theme} title="Profile">👤</ProfileLink>
      <ActionButton onClick={toggleTheme} theme={theme} title="Toggle theme">
        {themeMode === 'dark' ? '🌙' : '☀️'}
      </ActionButton>
      <ActionButton onClick={handleLogout} theme={theme} title="Logout">🚪</ActionButton>
    </Container>
  );
};

export default UserActions;
