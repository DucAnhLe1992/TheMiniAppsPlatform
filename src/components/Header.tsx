import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme, supabase } from '@shared';
import QuickSearch from './QuickSearch';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: ${p => p.theme.colors.backgroundElevated};
  border-bottom: 1px solid ${p => p.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 200;
  box-shadow: ${p => p.theme.shadows.sm};
  backdrop-filter: blur(8px);

  @media (max-width: 1024px) {
    padding: 0 1rem 0 5rem; /* Space for mobile hamburger */
  }
`;

const LogoSection = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${p => p.theme.colors.gradient};
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 3px;
  padding: 7px;
  box-shadow: 0 6px 18px -6px rgba(102, 126, 234, 0.25);
  transition: transform 0.2s ease, box-shadow 0.25s ease;
  
  &::before,
  &::after {
    content: '';
    background: white;
    border-radius: 3px;
  }

  ${LogoSection}:hover & {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px -6px rgba(102, 126, 234, 0.3);
  }
`;

const LogoDot = styled.div`
  background: white;
  border-radius: 3px;
`;

const LogoText = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  letter-spacing: -0.02em;
  
  span {
    font-weight: 400;
    color: ${p => p.theme.colors.textSecondary};
  }
`;

const CenterSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 0 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${p => p.theme.colors.textSecondary};
  
  a {
    color: ${p => p.theme.colors.textSecondary};
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${p => p.theme.colors.text};
    }
  }
  
  span:last-child {
    color: ${p => p.theme.colors.text};
    font-weight: 500;
  }
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1rem;
  border-radius: 10px;
  background: ${p => p.theme.colors.background};
  border: 1px solid ${p => p.theme.colors.border};
  cursor: pointer;
  font-size: 0.875rem;
  color: ${p => p.theme.colors.textSecondary};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 220px;
  box-shadow: ${p => p.theme.shadows.sm};

  &:hover {
    background: ${p => p.theme.colors.surfaceHover};
    border-color: ${p => p.theme.colors.primary};
    box-shadow: ${p => p.theme.shadows.md};
  }
  
  kbd {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: ${p => p.theme.colors.surface};
    border: 1px solid ${p => p.theme.colors.border};
    border-radius: 6px;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    margin-left: auto;
    font-weight: 500;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: ${p => p.theme.colors.background};
  border: 1px solid ${p => p.theme.colors.border};
  cursor: pointer;
  font-size: 1.125rem;
  color: ${p => p.theme.colors.text};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${p => p.theme.shadows.sm};

  &:hover {
    background: ${p => p.theme.colors.surfaceHover};
    border-color: ${p => p.theme.colors.primary};
    box-shadow: ${p => p.theme.shadows.md};
  }
  &:active {
    transform: scale(0.96);
  }
`;

const ProfileLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: ${p => p.theme.colors.background};
  border: 1px solid ${p => p.theme.colors.border};
  text-decoration: none;
  font-size: 1.05rem;
  color: ${p => p.theme.colors.text};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${p => p.theme.shadows.sm};

  &:hover { 
    background: ${p => p.theme.colors.surfaceHover};
    border-color: ${p => p.theme.colors.primary};
    box-shadow: ${p => p.theme.shadows.md};
  }
  &:active { 
    transform: scale(0.96); 
  }
  &.active { 
    background: ${p => p.theme.colors.primary}15;
    border-color: ${p => p.theme.colors.primary};
  }
`;

const Header: React.FC = () => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Dashboard', path: '/' }];
    if (path === '/profile') return [{ label: 'Dashboard', path: '/' }, { label: 'Profile', path: '/profile' }];
    if (path.startsWith('/apps/')) {
      const appName = path.split('/apps/')[1]
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return [
        { label: 'Dashboard', path: '/' },
        { label: appName || 'App', path }
      ];
    }
    return [];
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error && !error.message.includes('Auth session missing')) {
      console.error('Logout error:', error);
      return;
    }
    navigate('/login');
  };

  return (
    <HeaderContainer theme={theme}>
      <LogoSection to="/" theme={theme}>
        <LogoIcon theme={theme}>
          <LogoDot />
          <LogoDot />
          <LogoDot />
          <LogoDot />
        </LogoIcon>
        <LogoText theme={theme}>
          Mini Apps <span>Platform</span>
        </LogoText>
      </LogoSection>

      <CenterSection>
        <SearchButton theme={theme} onClick={() => setSearchOpen(true)}>
          <span>🔍</span>
          <span>Quick search...</span>
          <kbd>⌘K</kbd>
        </SearchButton>
        <Breadcrumbs theme={theme}>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <span>/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span>{crumb.label}</span>
              ) : (
                <NavLink to={crumb.path}>{crumb.label}</NavLink>
              )}
            </React.Fragment>
          ))}
        </Breadcrumbs>
      </CenterSection>

      <Actions>
        <ProfileLink to="/profile" theme={theme} title="Profile">
          👤
        </ProfileLink>
        <ActionButton onClick={toggleTheme} theme={theme} title="Toggle theme">
          {themeMode === 'dark' ? '🌙' : '☀️'}
        </ActionButton>
        <ActionButton onClick={handleLogout} theme={theme} title="Logout">
          🚪
        </ActionButton>
      </Actions>

      <QuickSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </HeaderContainer>
  );
};

export default Header;
