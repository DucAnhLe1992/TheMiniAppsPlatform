import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import MiniAppCard from "../components/MiniAppCard";
import { useApps } from "@shared";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const Header = styled.h1`
  margin-bottom: 1rem;
  color: #e2e8f0;
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #cbd5e0;
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: #a0aec0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #fc8181;
`;

const Dashboard: React.FC = () => {
  const { apps, loading, error } = useApps();
  const navigate = useNavigate();

  if (loading) {
    return <Loading>Loading apps...</Loading>;
  }

  if (error) {
    return <ErrorMessage>Error loading apps: {error.message}</ErrorMessage>;
  }

  const categories = [...new Set(apps.map((app) => app.category))];

  const handleMiniAppClick = (entryPoint: string) => {
    navigate(entryPoint);
  };

  return (
    <div>
      <Header>Dashboard</Header>
      {categories.map((category) => (
        <CategorySection key={category}>
          <CategoryTitle>{category.charAt(0).toUpperCase() + category.slice(1)}</CategoryTitle>
          <Grid>
            {apps
              .filter((app) => app.category === category)
              .map((app) => (
                <MiniAppCard
                  key={app.id}
                  title={app.name}
                  description={app.description}
                  onClick={() => handleMiniAppClick(app.entry_point)}
                />
              ))}
          </Grid>
        </CategorySection>
      ))}
    </div>
  );
};

export default Dashboard;
