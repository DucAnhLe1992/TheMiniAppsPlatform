import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.backgroundElevated};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: ${props => props.theme.colors.gradient};
    opacity: 0.08;
    border-radius: 50%;
    transform: translate(30%, -30%);
  }
`;

const StatIcon = styled.div`
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatSubtext = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

export interface StatItem {
  icon: string;
  value: string | number;
  label: string;
  subtext?: string;
}

interface AppStatsProps {
  stats: StatItem[];
  loading?: boolean;
}

const AppStats: React.FC<AppStatsProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <StatsGrid>
        {[1, 2, 3, 4].map(i => (
          <StatCard key={i}>
            <StatLabel>Loading...</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>
    );
  }

  return (
    <StatsGrid>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <StatIcon>{stat.icon}</StatIcon>
          <StatValue>{stat.value}</StatValue>
          <StatLabel>{stat.label}</StatLabel>
          {stat.subtext && <StatSubtext>{stat.subtext}</StatSubtext>}
        </StatCard>
      ))}
    </StatsGrid>
  );
};

export default AppStats;
