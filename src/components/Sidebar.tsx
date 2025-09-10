import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { theme, glassmorphism } from "../theme";

const SidebarContainer = styled(motion.nav)`
  width: 200px;
  height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  ${glassmorphism}
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NavItem = styled(NavLink)`
  color: ${theme.colors.text};
  text-decoration: none;
  font-weight: 600;
  font-size: 1.2rem;

  &.active {
    color: ${theme.colors.accent};
  }
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const Sidebar: React.FC = () => (
  <SidebarContainer
    initial={{ x: -250, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 100 }}
  >
    <NavItem to="/" end>
      Home
    </NavItem>
    <NavItem to="/dashboard">Dashboard</NavItem>
  </SidebarContainer>
);

export default Sidebar;
