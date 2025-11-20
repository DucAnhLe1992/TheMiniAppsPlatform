import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: ${props => props.theme.colors.gradient};
  color: white;
  box-shadow: ${props => props.theme.shadows.md};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Message = styled(motion.div)<{ type: 'success' | 'error' }>`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  background: ${props => props.type === 'success'
    ? `${props.theme.colors.success}15`
    : `${props.theme.colors.error}15`};
  border: 1px solid ${props => props.type === 'success'
    ? `${props.theme.colors.success}40`
    : `${props.theme.colors.error}40`};
  color: ${props => props.type === 'success'
    ? props.theme.colors.success
    : props.theme.colors.error};
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.5rem;
`;

interface ProfileSettingsProps {
  theme: any;
}

interface ProfileData {
  displayName: string;
  bio: string;
  timezone: string;
  avatarUrl: string;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ theme }) => {
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState<ProfileData>({
    displayName: '',
    bio: '',
    timezone: 'UTC',
    avatarUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email || '');

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile({
          displayName: profileData.display_name || '',
          bio: profileData.bio || '',
          timezone: profileData.timezone || 'UTC',
          avatarUrl: profileData.avatar_url || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_profiles')
        .update({
          display_name: profile.displayName,
          bio: profile.bio,
          timezone: profile.timezone,
          avatar_url: profile.avatarUrl,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title theme={theme}>Profile Settings</Title>

      <Card
        theme={theme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {message && (
          <Message
            type={message.type}
            theme={theme}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message.text}
          </Message>
        )}

        <Section>
          <SectionTitle theme={theme}>Account Information</SectionTitle>

          <FormGroup>
            <Label theme={theme}>Email</Label>
            <Input
              type="email"
              value={email}
              disabled
              theme={theme}
            />
            <InfoText theme={theme}>Your email cannot be changed</InfoText>
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Display Name</Label>
            <Input
              type="text"
              value={profile.displayName}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
              placeholder="Enter your display name"
              theme={theme}
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Bio</Label>
            <TextArea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              theme={theme}
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle theme={theme}>Preferences</SectionTitle>

          <FormGroup>
            <Label theme={theme}>Timezone</Label>
            <Select
              value={profile.timezone}
              onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              theme={theme}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Asia/Shanghai">Shanghai (CST)</option>
              <option value="Australia/Sydney">Sydney (AEDT)</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Avatar URL</Label>
            <Input
              type="url"
              value={profile.avatarUrl}
              onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
              theme={theme}
            />
            <InfoText theme={theme}>Enter a URL to your profile picture</InfoText>
          </FormGroup>
        </Section>

        <Button
          theme={theme}
          onClick={handleSaveProfile}
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Card>
    </Container>
  );
};
