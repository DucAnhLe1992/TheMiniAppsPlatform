import styled from "styled-components";
import { motion } from "framer-motion";
import { SessionType } from "./types";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 4rem 0;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled(motion.div)`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
`;

export const TimerCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
`;

export const SessionTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

export const SessionTab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: 1px solid
    ${(props) =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) =>
    props.$active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${(props) => (props.$active ? "#ffffff" : props.theme.colors.text)};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$active
        ? props.theme.colors.primaryHover
        : props.theme.colors.surfaceHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TimerDisplay = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  margin: 2rem 0;

  @media (max-width: 768px) {
    width: 240px;
    height: 240px;
  }
`;

export const CircularProgress = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

export const CircleBackground = styled.circle`
  fill: none;
  stroke: ${(props) => props.theme.colors.borderLight};
  stroke-width: 12;
`;

export const CircleProgress = styled(motion.circle)<{ $color: string }>`
  fill: none;
  stroke: ${(props) => props.$color};
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke 0.3s ease;
`;

export const TimeText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

export const TimeNumber = styled.div`
  font-size: 4rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  line-height: 1;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

export const SessionLabel = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const ControlButton = styled.button<{
  $variant?: "primary" | "secondary";
}>`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(props) =>
    props.$variant === "primary"
      ? props.theme.colors.primary
      : props.theme.colors.surface};
  color: ${(props) =>
    props.$variant === "primary" ? "#ffffff" : props.theme.colors.text};
  border: ${(props) =>
    props.$variant === "secondary"
      ? `1px solid ${props.theme.colors.border}`
      : "none"};

  &:hover {
    background: ${(props) =>
      props.$variant === "primary"
        ? props.theme.colors.primaryHover
        : props.theme.colors.surfaceHover};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StatsCard = styled(Card)``;

export const StatsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const StatBox = styled.div`
  background: ${(props) => props.theme.colors.background};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.25rem;
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

export const SessionCounter = styled.div`
  text-align: center;
  padding: 1rem;
  background: ${(props) => props.theme.colors.background};
  border-radius: 12px;
  margin-bottom: 1.5rem;
`;

export const CounterLabel = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

export const CounterValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

export const HistorySection = styled.div`
  margin-top: 2rem;
`;

export const HistoryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 1rem 0;
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
`;

export const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${(props) => props.theme.colors.background};
  border-radius: 8px;
  font-size: 0.875rem;
`;

export const HistoryType = styled.span<{ $type: SessionType }>`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  background: ${(props) => {
    if (props.$type === "work") return "#dbeafe";
    if (props.$type === "short_break") return "#fef3c7";
    return "#dcfce7";
  }};
  color: ${(props) => {
    if (props.$type === "work") return "#1e40af";
    if (props.$type === "short_break") return "#92400e";
    return "#166534";
  }};
`;

export const HistoryTime = styled.span`
  color: ${(props) => props.theme.colors.textSecondary};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;
