import React from "react";
import styled from "styled-components";
import MiniAppCard from "../components/MiniAppCard";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const Header = styled.h1`
  margin-bottom: 1rem;
  color: #b794f4;
`;

const Dashboard: React.FC = () => {
  // Example data - replace with dynamic content or user-specific data if available
  const featuredMiniApps = [
    { id: "app1", title: "Mini App 1", description: "Description for App 1" },
    { id: "app3", title: "Mini App 3", description: "Description for App 3" },
    { id: "app4", title: "Mini App 4", description: "Description for App 4" },
  ];

  const handleMiniAppClick = (id: string) => {
    alert(`Navigate to mini app ${id}`);
  };

  return (
    <div>
      <Header>Dashboard</Header>
      <Grid>
        {featuredMiniApps.map((app) => (
          <MiniAppCard
            key={app.id}
            title={app.title}
            description={app.description}
            onClick={() => handleMiniAppClick(app.id)}
          />
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;
