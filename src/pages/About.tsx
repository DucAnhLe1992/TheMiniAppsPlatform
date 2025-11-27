import React from "react";
import styled from "styled-components";

const Wrap = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 0 3rem 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
`;

const Sub = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
`;

const Card = styled.section`
  ${props => props.theme.card}
  padding: 20px 24px;
  margin-top: 20px;
`;

const About: React.FC = () => {
  return (
    <Wrap>
      <Title>About The Mini Apps Platform</Title>
      <Sub>
        A curated set of elegant, fast, and focused tools designed to simplify everyday tasks. Built with a Minimalist + Modern Dashboard aesthetic, tuned for comfort and clarity across light and dark modes.
      </Sub>
      <Card>
        <strong>Design Principles</strong>
        <ul>
          <li>Minimal surfaces with elevated contrast</li>
          <li>Soft shadows, rounded corners, fluid spacing</li>
          <li>Theme-driven gradients and subtle motion</li>
        </ul>
      </Card>
    </Wrap>
  );
};

export default About;
