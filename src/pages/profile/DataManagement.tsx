import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

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
  margin-bottom: 0.75rem;
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
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

const DangerButton = styled(Button)`
  background: ${props => props.theme.colors.error};
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

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: ${props => props.theme.shadows.xl};
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const SecondaryButton = styled(Button)`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: none;
`;

interface DataManagementProps {
  theme: any;
}

export const DataManagement: React.FC<DataManagementProps> = ({ theme }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleExportData = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const [
        profile,
        todos,
        notes,
        habits,
        habitCompletions,
        pomodoroSessions,
        events,
        shoppingLists,
        savedLocations,
        preferences,
      ] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('todos').select('*').eq('user_id', user.id),
        supabase.from('notes').select('*').eq('user_id', user.id),
        supabase.from('habits').select('*').eq('user_id', user.id),
        supabase.from('habit_completions').select('*').eq('user_id', user.id),
        supabase.from('pomodoro_sessions').select('*').eq('user_id', user.id),
        supabase.from('events').select('*').eq('user_id', user.id),
        supabase.from('shopping_lists').select('*').eq('owner_id', user.id),
        supabase.from('saved_locations').select('*').eq('user_id', user.id),
        supabase.from('user_preferences').select('*').eq('user_id', user.id).maybeSingle(),
      ]);

      const exportData = {
        exported_at: new Date().toISOString(),
        user_email: user.email,
        profile: profile.data,
        todos: todos.data,
        notes: notes.data,
        habits: habits.data,
        habit_completions: habitCompletions.data,
        pomodoro_sessions: pomodoroSessions.data,
        events: events.data,
        shopping_lists: shoppingLists.data,
        saved_locations: savedLocations.data,
        preferences: preferences.data,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `the-platform-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Data exported successfully!' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setMessage({ type: 'error', text: 'Failed to export data. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase.auth.admin.deleteUser(user.id);

      setMessage({ type: 'success', text: 'Account deleted successfully. Redirecting...' });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({
        type: 'error',
        text: 'Unable to delete account automatically. Please contact support.'
      });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <Container>
      <Title theme={theme}>Data Management</Title>

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
          <SectionTitle theme={theme}>Export Your Data</SectionTitle>
          <SectionDescription theme={theme}>
            Download all your data in JSON format. This includes your profile, todos, notes, habits,
            calendar events, and all other app data.
          </SectionDescription>
          <ButtonGroup>
            <Button
              theme={theme}
              onClick={handleExportData}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? 'Exporting...' : 'Export All Data'}
            </Button>
          </ButtonGroup>
        </Section>

        <Section>
          <SectionTitle theme={theme}>Delete Account</SectionTitle>
          <SectionDescription theme={theme}>
            Permanently delete your account and all associated data. This action cannot be undone.
            Make sure to export your data first if you want to keep a copy.
          </SectionDescription>
          <ButtonGroup>
            <DangerButton
              theme={theme}
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Delete Account
            </DangerButton>
          </ButtonGroup>
        </Section>
      </Card>

      {showDeleteModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowDeleteModal(false)}
        >
          <ModalContent
            theme={theme}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalTitle theme={theme}>Delete Account?</ModalTitle>
            <ModalText theme={theme}>
              Are you absolutely sure you want to delete your account? This will permanently remove
              all your data including todos, notes, habits, calendar events, and all other information.
              This action cannot be undone.
            </ModalText>
            <ModalButtons>
              <SecondaryButton
                theme={theme}
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Cancel
              </SecondaryButton>
              <DangerButton
                theme={theme}
                onClick={handleDeleteAccount}
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {loading ? 'Deleting...' : 'Delete Forever'}
              </DangerButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};
