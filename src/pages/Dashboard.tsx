import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MiniAppCard from "../components/MiniAppCard";
import { useApps, useTheme } from "@shared";

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 0 4rem 0;

  @media (max-width: 1024px) {
    padding-left: 0;
  }
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const CategorySection = styled(motion.div)`
  margin-bottom: 3rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CategoryIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.theme.colors.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  text-transform: capitalize;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.125rem;
`;

const ErrorMessage = styled.div`
  padding: 1.5rem;
  border-radius: 16px;
  background: ${props => props.theme.colors.error}15;
  border: 1px solid ${props => props.theme.colors.error}40;
  color: ${props => props.theme.colors.error};
  font-size: 1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const categoryIcons: Record<string, string> = {
  text: "📝",
  image: "🖼️",
  data: "📊",
  developer: "💻",
  general: "⚙️",
};

const Dashboard: React.FC = () => {
  const { apps, loading, error } = useApps();
  const navigate = useNavigate();
  const { theme } = useTheme();

  if (loading) {
    return (
      <Container>
        <Loading theme={theme}>Loading your apps...</Loading>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage theme={theme}>
          Error loading apps: {error.message}
        </ErrorMessage>
      </Container>
    );
  }

  if (apps.length === 0) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>🎯</EmptyIcon>
          <EmptyText theme={theme}>No apps available yet</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  const categories = [...new Set(apps.map((app) => app.category))];

  const handleMiniAppClick = (entryPoint: string) => {
    navigate(entryPoint);
  };

  return (
    <Container>
      <Header>
        <Title theme={theme}>Dashboard</Title>
        <Subtitle theme={theme}>
          Explore powerful AI tools to boost your productivity
        </Subtitle>
      </Header>

      {categories.map((category, index) => (
        <CategorySection
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <CategoryHeader>
            <CategoryIcon theme={theme}>
              {categoryIcons[category] || "🚀"}
            </CategoryIcon>
            <CategoryTitle theme={theme}>{category}</CategoryTitle>
          </CategoryHeader>

          <Grid>
            {apps
              .filter((app) => app.category === category)
              .map((app) => (
                <MiniAppCard
                  key={app.id}
                  title={app.name}
                  description={app.description}
                  icon={app.icon || categoryIcons[category] || "🚀"}
                  onClick={() => handleMiniAppClick(app.entry_point)}
                />
              ))}
          </Grid>
        </CategorySection>
      ))}
    </Container>
  );
};

export default Dashboard;
