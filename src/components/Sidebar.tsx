import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@shared";
import Logout from "./Logout";

// Remove framer-motion transform interference on mobile by using plain nav
const SidebarContainer = styled.nav<{ $isOpen: boolean }>`
  width: 280px;
  height: calc(100vh - 64px); /* Full height minus header */
  padding: 1.5rem 1.5rem;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 100;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 1024px) {
    position: fixed;
    left: 0;
    top: 64px; /* Below header */
    bottom: 0;
    height: calc(100vh - 64px);
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${props => props.$isOpen ? props.theme.shadows.xl : 'none'};
    pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
    overscroll-behavior: contain;
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

const MenuButton = styled.button`
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: transparent;
  border: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.text};
  }

  &:active {
    transform: scale(0.9);
  }

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const NavItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  margin-top: 1rem;

  @media (max-width: 1024px) {
    margin-top: 3.5rem; /* Space for close button */
  }
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

const SectionHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.theme.colors.textTertiary};
  padding: 0.5rem 1rem;
  margin-bottom: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.text};
  }
`;

const ExpandIcon = styled.span<{ $expanded: boolean }>`
  display: flex;
  font-size: 0.875rem;
  transition: transform 0.2s ease;
  transform: rotate(${props => props.$expanded ? '0deg' : '-90deg'});
`;

const CollapsibleContent = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-rows: ${props => props.$expanded ? '1fr' : '0fr'};
  transition: grid-template-rows 0.3s ease;
  
  > div {
    overflow: hidden;
  }
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
  display: none; /* Hidden: actions moved to Header */
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
  top: 12px; /* Centered in 64px header */
  left: 1rem;
  z-index: 201; /* Above header */
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: transparent;
  border: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  opacity: ${props => props.$isOpen ? '0' : '1'};
  pointer-events: ${props => props.$isOpen ? 'none' : 'auto'};

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
  
  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [toolsExpanded, setToolsExpanded] = useState(true);
  const { theme, themeMode, toggleTheme } = useTheme();

  // Lock background scroll when sidebar is open on mobile
  useEffect(() => {
    const lockScroll = () => {
      if (window.innerWidth <= 1024) {
        if (isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      }
    };
    lockScroll();
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <MobileMenuButton theme={theme} $isOpen={isOpen} onClick={() => setIsOpen(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6"/>
          <line x1="4" y1="12" x2="20" y2="12"/>
          <line x1="4" y1="18" x2="20" y2="18"/>
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

      <SidebarContainer theme={theme} $isOpen={isOpen}>
        <MenuButton theme={theme} onClick={() => setIsOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </MenuButton>

        <NavItems>
          <NavSection>
            <SectionLabel theme={theme}>Main</SectionLabel>
            <NavItem theme={theme} to="/" end onClick={() => setIsOpen(false)}>
              <NavIcon>📊</NavIcon>
              Dashboard
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionHeader theme={theme} onClick={() => setToolsExpanded(!toolsExpanded)}>
              <span>Tools</span>
              <ExpandIcon $expanded={toolsExpanded}>▼</ExpandIcon>
            </SectionHeader>
            <CollapsibleContent $expanded={toolsExpanded}>
              <div>
                <NavItem theme={theme} to="/apps/todo-list" onClick={() => setIsOpen(false)}>
                  <NavIcon>✅</NavIcon>
                  To-Do List
                </NavItem>
            <NavItem theme={theme} to="/apps/shopping-list" onClick={() => setIsOpen(false)}>
              <NavIcon>🛒</NavIcon>
              Shopping List
            </NavItem>
            <NavItem theme={theme} to="/apps/pomodoro-timer" onClick={() => setIsOpen(false)}>
              <NavIcon>⏱️</NavIcon>
              Pomodoro Timer
            </NavItem>
            <NavItem theme={theme} to="/apps/notes-manager" onClick={() => setIsOpen(false)}>
              <NavIcon>📝</NavIcon>
              Notes & Snippets
            </NavItem>
            <NavItem theme={theme} to="/apps/text-summarizer" onClick={() => setIsOpen(false)}>
              <NavIcon>📄</NavIcon>
              Text Summarizer
            </NavItem>
            <NavItem theme={theme} to="/apps/currency-converter" onClick={() => setIsOpen(false)}>
              <NavIcon>💱</NavIcon>
              Currency & Budget
            </NavItem>
            <NavItem theme={theme} to="/apps/weather-info" onClick={() => setIsOpen(false)}>
              <NavIcon>🌤️</NavIcon>
              Weather Info
            </NavItem>
            <NavItem theme={theme} to="/apps/calendar" onClick={() => setIsOpen(false)}>
              <NavIcon>📅</NavIcon>
              Calendar
            </NavItem>
            <NavItem theme={theme} to="/apps/habit-tracker" onClick={() => setIsOpen(false)}>
              <NavIcon>🎯</NavIcon>
              Habit Tracker
            </NavItem>
              </div>
            </CollapsibleContent>
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
