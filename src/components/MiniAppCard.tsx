import React from "react";
import styled from "styled-components";
import { glassmorphism } from "../theme";

interface MiniAppCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const Card = styled.div`
  ${glassmorphism}
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #b794f4;
`;

const Description = styled.p`
  margin: 0;
  color: #ddd;
`;

const MiniAppCard: React.FC<MiniAppCardProps> = ({
  title,
  description,
  onClick,
}) => (
  <Card onClick={onClick}>
    <Title>{title}</Title>
    <Description>{description}</Description>
  </Card>
);

export default MiniAppCard;
