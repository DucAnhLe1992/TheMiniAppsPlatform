import React from "react";
import styled from "styled-components";
import { supabase } from "@shared";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.25rem;
  color: #b794f4;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error during logout: " + error.message);
    } else {
      navigate("/login");
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
