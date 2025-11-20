import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '@shared';
import { ProfileStatistics } from './profile/ProfileStatistics';
import { ProfileSettings } from './profile/ProfileSettings';
import { DataManagement } from './profile/DataManagement';

const Container = styled.div`
  max-width: 1200px;
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

const Divider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: 3rem 0;
`;

export const Profile: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Container>
      <Header>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Title theme={theme}>Profile</Title>
          <Subtitle theme={theme}>
            Manage your account settings and view your activity
          </Subtitle>
        </motion.div>
      </Header>

      <ProfileStatistics theme={theme} />

      <Divider theme={theme} />

      <ProfileSettings theme={theme} />

      <Divider theme={theme} />

      <DataManagement theme={theme} />
    </Container>
  );
};

export default Profile;
