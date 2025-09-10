import React from "react";
import MiniAppCard from "../components/MiniAppCard";
import styled from "styled-components";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const miniApps = [
  { id: "app1", title: "Mini App 1", description: "Description for App 1" },
  { id: "app2", title: "Mini App 2", description: "Description for App 2" },
  // Extend mini apps list here
];

const Home: React.FC = () => {
  const handleClick = (id: string) => {
    alert(`Navigate to mini app ${id}`);
  };

  return (
    <>
      <h1>Mini Apps</h1>
      <Grid>
        {miniApps.map((app) => (
          <MiniAppCard
            key={app.id}
            title={app.title}
            description={app.description}
            onClick={() => handleClick(app.id)}
          />
        ))}
      </Grid>
    </>
  );
};

export default Home;
