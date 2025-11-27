import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTheme } from "@shared";

interface MiniAppCardProps {
  title: string;
  description: string;
  icon?: string;
  onClick: () => void;
  tag?: string;
  meta?: string;
}

const Card = styled(motion.div)<{ $mode: 'light' | 'dark' }>`
  ${props => props.theme.card}
  padding: 1.85rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  aspect-ratio: 1 / 1; /* keep cards square */
  position: relative;
  overflow: hidden;
  margin: 4px; /* subtle outer margin to increase separation */
  
  /* Subtle gradient backdrop for softer feel */
  background-image: radial-gradient(
      1200px 400px at 10% 0%,
      ${props => props.$mode === 'dark' ? props.theme.colors.primary + '12' : props.theme.colors.primary + '08'},
      transparent 40%
    ),
    radial-gradient(
      800px 400px at 90% 100%,
      ${props => props.$mode === 'dark' ? props.theme.colors.accent + '12' : props.theme.colors.accent + '08'},
      transparent 35%
    );

  /* Softer, subtle top accent */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.$mode === 'dark' ? props.theme.colors.primary + '50' : props.theme.colors.primary + '35'};
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 0.25rem;
`;

const IconContainer = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: ${props => props.theme.colors.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.625rem;
  flex-shrink: 0;
  box-shadow: 0 6px 18px -6px rgba(102, 126, 234, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  ${Card}:hover & {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px -6px rgba(102, 126, 234, 0.3);
  }
`;

const TitleWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: ${props => props.theme.colors.backgroundElevated};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
`;

const MetaText = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textTertiary};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  letter-spacing: -0.02em;
  line-height: 1.35;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.textSecondary};
  flex: 1;
  font-weight: 400;
  letter-spacing: -0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    -webkit-line-clamp: 2;
  }
`;


const MiniAppCard: React.FC<MiniAppCardProps> = ({
  title,
  description,
  icon = "🚀",
  onClick,
  tag,
  meta,
}) => {
  const { theme, themeMode } = useTheme();

  return (
    <Card
      theme={theme}
      $mode={themeMode}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Header>
        <IconContainer theme={theme}>{icon}</IconContainer>
        <TitleWrapper>
          <Title theme={theme}>{title}</Title>
          {(tag || meta) && (
            <MetaRow>
              {tag && <Tag theme={theme}>{tag}</Tag>}
              {meta && <MetaText theme={theme}>{meta}</MetaText>}
            </MetaRow>
          )}
        </TitleWrapper>
      </Header>
      <Description theme={theme}>{description}</Description>
      {/* Removed Open button; card remains clickable */}
    </Card>
  );
};

export default MiniAppCard;
