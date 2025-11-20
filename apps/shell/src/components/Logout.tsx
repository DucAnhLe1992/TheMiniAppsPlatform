import React from "react";
import styled from "styled-components";
import { supabase, useTheme } from "@shared";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.error};
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: ${props => props.theme.colors.error}15;
    border-color: ${props => props.theme.colors.error}40;
  }
`;

const Icon = styled.span`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error during logout: " + error.message);
    } else {
      navigate("/login");
    }
  };

  return (
    <Button theme={theme} onClick={handleLogout}>
      <Icon>🚪</Icon>
      Logout
    </Button>
  );
};

export default Logout;
