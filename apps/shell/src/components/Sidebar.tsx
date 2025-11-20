import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@shared";
import Logout from "./Logout";

const SidebarContainer = styled(motion.nav)<{ $isOpen: boolean }>`
  width: 280px;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 100;

  @media (max-width: 1024px) {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${props => props.$isOpen ? props.theme.shadows.xl : 'none'};
  }
`;

const Overlay = styled(motion.div)`
  display: none;

  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.theme.colors.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
`;

const LogoText = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const MenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.text};

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const NavItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const NavSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.theme.colors.textTertiary};
  padding: 0 1rem;
  margin-bottom: 0.75rem;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.text};
  }

  &.active {
    background: ${props => props.theme.colors.primary};
    color: white;
    font-weight: 600;
  }
`;

const NavIcon = styled.span`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const MobileMenuButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 101;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  box-shadow: ${props => props.theme.shadows.md};
  transition: opacity 0.2s ease;
  opacity: ${props => props.$isOpen ? '0' : '1'};
  pointer-events: ${props => props.$isOpen ? 'none' : 'auto'};

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, themeMode, toggleTheme } = useTheme();

  return (
    <>
      <MobileMenuButton theme={theme} $isOpen={isOpen} onClick={() => setIsOpen(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </MobileMenuButton>

      <AnimatePresence>
        {isOpen && (
          <Overlay
            theme={theme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <SidebarContainer
        theme={theme}
        $isOpen={isOpen}
        initial={{ x: 0 }}
        animate={{ x: 0 }}
      >
        <Header>
          <Logo>
            <LogoIcon theme={theme}>AI</LogoIcon>
            <LogoText theme={theme}>Platform</LogoText>
          </Logo>
          <MenuButton theme={theme} onClick={() => setIsOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </MenuButton>
        </Header>

        <NavItems>
          <NavSection>
            <SectionLabel theme={theme}>Main</SectionLabel>
            <NavItem theme={theme} to="/" end onClick={() => setIsOpen(false)}>
              <NavIcon>🏠</NavIcon>
              Home
            </NavItem>
            <NavItem theme={theme} to="/dashboard" onClick={() => setIsOpen(false)}>
              <NavIcon>📊</NavIcon>
              Dashboard
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionLabel theme={theme}>Tools</SectionLabel>
            <NavItem theme={theme} to="/apps/todo-list" onClick={() => setIsOpen(false)}>
              <NavIcon>✅</NavIcon>
              To-Do List
            </NavItem>
            <NavItem theme={theme} to="/apps/pomodoro-timer" onClick={() => setIsOpen(false)}>
              <NavIcon>⏱️</NavIcon>
              Pomodoro Timer
            </NavItem>
            <NavItem theme={theme} to="/apps/text-summarizer" onClick={() => setIsOpen(false)}>
              <NavIcon>📝</NavIcon>
              Text Summarizer
            </NavItem>
          </NavSection>
        </NavItems>

        <Footer theme={theme}>
          <ThemeToggle theme={theme} onClick={toggleTheme}>
            <NavIcon>{themeMode === 'dark' ? '🌙' : '☀️'}</NavIcon>
            {themeMode === 'dark' ? 'Dark' : 'Light'} Mode
          </ThemeToggle>
          <Logout />
        </Footer>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
