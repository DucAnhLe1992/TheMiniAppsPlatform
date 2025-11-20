import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTheme } from "@shared";

interface MiniAppCardProps {
  title: string;
  description: string;
  icon?: string;
  onClick: () => void;
}

const Card = styled(motion.div)`
  ${props => props.theme.card}
  padding: 1.75rem;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 160px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.theme.colors.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${props => props.theme.colors.textSecondary};
  flex: 1;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid ${props => props.theme.colors.borderLight};
`;

const LaunchButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  transition: all 0.2s ease;
`;

const MiniAppCard: React.FC<MiniAppCardProps> = ({
  title,
  description,
  icon = "🚀",
  onClick,
}) => {
  const { theme } = useTheme();

  return (
    <Card
      theme={theme}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Header>
        <IconContainer theme={theme}>{icon}</IconContainer>
        <Title theme={theme}>{title}</Title>
      </Header>
      <Description theme={theme}>{description}</Description>
      <Footer theme={theme}>
        <LaunchButton theme={theme}>
          Open →
        </LaunchButton>
      </Footer>
    </Card>
  );
};

export default MiniAppCard;
