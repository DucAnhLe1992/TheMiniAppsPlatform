import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { glassmorphism } from "../theme";

const TabBarContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 200px;
  right: 0;
  height: 60px;
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  ${glassmorphism}

  @media (max-width: 768px) {
    left: 0;
  }
`;

const Tab = styled(NavLink)`
  color: #ccc;
  font-weight: 600;
  text-decoration: none;

  &.active {
    color: #b794f4;
  }
`;

const TabBar: React.FC = () => (
  <TabBarContainer>
    <Tab to="/" end>
      Home
    </Tab>
    <Tab to="/dashboard">Dashboard</Tab>
  </TabBarContainer>
);

export default TabBar;
