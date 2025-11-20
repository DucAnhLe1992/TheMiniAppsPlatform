import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase, useTheme } from '@shared';
import { motion, AnimatePresence } from 'framer-motion';

interface Habit {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  frequency: 'daily' | 'weekly';
  target_days: number[];
  reminder_time: string | null;
  created_at: string;
  archived_at: string | null;
}

interface Completion {
  id: string;
  habit_id: string;
  completed_date: string;
  notes: string;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 4rem 0;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DateNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const DateDisplay = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  min-width: 200px;
  text-align: center;
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.theme.colors.primary};
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const HabitsGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const HabitCard = styled(motion.div)<{ $color: string }>`
  padding: 1.5rem;
  border-radius: 12px;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.$color}40;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.$color};
  }
`;

const HabitHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const HabitIcon = styled.div`
  font-size: 2rem;
  line-height: 1;
`;

const HabitInfo = styled.div`
  flex: 1;
`;

const HabitName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.25rem 0;
`;

const HabitDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const HabitActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const HabitStats = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem 0;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const CheckButton = styled.button<{ $checked: boolean; $color: string }>`
  padding: 1rem 2rem;
  border: 2px solid ${props => props.$checked ? props.$color : props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.$checked ? props.$color : props.theme.colors.surface};
  color: ${props => props.$checked ? '#ffffff' : props.theme.colors.text};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    transform: scale(1.02);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.background};
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ColorPicker = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
`;

const ColorOption = styled.button<{ $color: string; $selected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.$color};
  border: 3px solid ${props => props.$selected ? props.theme.colors.text : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const IconPicker = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
`;

const IconOption = styled.button<{ $selected: boolean }>`
  padding: 0.5rem;
  border-radius: 8px;
  background: ${props => props.$selected ? props.theme.colors.primary : props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$selected ? props.theme.colors.primaryHover : props.theme.colors.surfaceHover};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: ${props => props.$variant === 'secondary' ? `1px solid ${props.theme.colors.border}` : 'none'};
  border-radius: 8px;
  background: ${props => props.$variant === 'secondary' ? props.theme.colors.surface : props.theme.colors.primary};
  color: ${props => props.$variant === 'secondary' ? props.theme.colors.text : '#ffffff'};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$variant === 'secondary' ? props.theme.colors.surfaceHover : props.theme.colors.primaryHover};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
`;

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
const ICONS = ['✓', '⭐', '💪', '📚', '🏃', '🧘', '💧', '🎯', '🎨', '🎵', '💼', '🌱'];

const HabitTracker: React.FC = () => {
  const { theme } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: COLORS[0],
    icon: ICONS[0],
    frequency: 'daily' as 'daily' | 'weekly',
  });

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .is('archived_at', null)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;
      setHabits(habitsData || []);

      const dateStr = selectedDate.toISOString().split('T')[0];
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed_date', dateStr);

      if (completionsError) throw completionsError;
      setCompletions(completionsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (habitId: string): number => {
    return 0;
  };

  const isHabitCompleted = (habitId: string): boolean => {
    return completions.some(c => c.habit_id === habitId);
  };

  const toggleHabitCompletion = async (habitId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const dateStr = selectedDate.toISOString().split('T')[0];
      const existing = completions.find(c => c.habit_id === habitId);

      if (existing) {
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;
        setCompletions(completions.filter(c => c.id !== existing.id));
      } else {
        const { data, error } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completed_date: dateStr,
            notes: '',
          })
          .select()
          .single();

        if (error) throw error;
        setCompletions([...completions, data]);
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const openModal = (habit?: Habit) => {
    if (habit) {
      setEditingHabit(habit);
      setFormData({
        name: habit.name,
        description: habit.description,
        color: habit.color,
        icon: habit.icon,
        frequency: habit.frequency,
      });
    } else {
      setEditingHabit(null);
      setFormData({
        name: '',
        description: '',
        color: COLORS[0],
        icon: ICONS[0],
        frequency: 'daily',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editingHabit) {
        const { error } = await supabase
          .from('habits')
          .update({
            name: formData.name,
            description: formData.description,
            color: formData.color,
            icon: formData.icon,
            frequency: formData.frequency,
          })
          .eq('id', editingHabit.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('habits')
          .insert({
            user_id: user.id,
            name: formData.name,
            description: formData.description,
            color: formData.color,
            icon: formData.icon,
            frequency: formData.frequency,
            target_days: [],
          });

        if (error) throw error;
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return;

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container>
      <Header>
        <Title theme={theme}>Habit Tracker</Title>
        <Subtitle theme={theme}>Build better habits, one day at a time</Subtitle>
      </Header>

      <Controls>
        <DateNav>
          <NavButton theme={theme} onClick={() => navigateDate(-1)}>←</NavButton>
          <DateDisplay theme={theme}>{formatDate(selectedDate)}</DateDisplay>
          <NavButton theme={theme} onClick={() => navigateDate(1)}>→</NavButton>
          {selectedDate.toDateString() !== new Date().toDateString() && (
            <NavButton theme={theme} onClick={goToToday}>Today</NavButton>
          )}
        </DateNav>
        <AddButton theme={theme} onClick={() => openModal()}>+ New Habit</AddButton>
      </Controls>

      {loading ? (
        <EmptyState>
          <EmptyText theme={theme}>Loading habits...</EmptyText>
        </EmptyState>
      ) : habits.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🎯</EmptyIcon>
          <EmptyText theme={theme}>No habits yet. Create your first habit to get started!</EmptyText>
          <AddButton theme={theme} onClick={() => openModal()}>Create Habit</AddButton>
        </EmptyState>
      ) : (
        <HabitsGrid>
          <AnimatePresence>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                $color={habit.color}
                theme={theme}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HabitHeader>
                  <HabitIcon>{habit.icon}</HabitIcon>
                  <HabitInfo>
                    <HabitName theme={theme}>{habit.name}</HabitName>
                    {habit.description && (
                      <HabitDescription theme={theme}>{habit.description}</HabitDescription>
                    )}
                  </HabitInfo>
                  <HabitActions>
                    <IconButton theme={theme} onClick={() => openModal(habit)}>✏️</IconButton>
                    <IconButton theme={theme} onClick={() => deleteHabit(habit.id)}>🗑️</IconButton>
                  </HabitActions>
                </HabitHeader>

                <CheckButton
                  $checked={isHabitCompleted(habit.id)}
                  $color={habit.color}
                  theme={theme}
                  onClick={() => toggleHabitCompletion(habit.id)}
                >
                  {isHabitCompleted(habit.id) ? '✓ Completed' : 'Mark as Complete'}
                </CheckButton>

                <HabitStats theme={theme}>
                  <Stat>
                    <StatLabel theme={theme}>Streak</StatLabel>
                    <StatValue theme={theme}>{calculateStreak(habit.id)}</StatValue>
                  </Stat>
                </HabitStats>
              </HabitCard>
            ))}
          </AnimatePresence>
        </HabitsGrid>
      )}

      <AnimatePresence>
        {showModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              theme={theme}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle theme={theme}>
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </ModalTitle>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label theme={theme}>Habit Name</Label>
                  <Input
                    theme={theme}
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Morning Exercise"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Description (Optional)</Label>
                  <TextArea
                    theme={theme}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add details about your habit..."
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Color</Label>
                  <ColorPicker>
                    {COLORS.map((color) => (
                      <ColorOption
                        key={color}
                        type="button"
                        $color={color}
                        $selected={formData.color === color}
                        theme={theme}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </ColorPicker>
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Icon</Label>
                  <IconPicker>
                    {ICONS.map((icon) => (
                      <IconOption
                        key={icon}
                        type="button"
                        $selected={formData.icon === icon}
                        theme={theme}
                        onClick={() => setFormData({ ...formData, icon })}
                      >
                        {icon}
                      </IconOption>
                    ))}
                  </IconPicker>
                </FormGroup>

                <ButtonGroup>
                  <Button type="button" $variant="secondary" theme={theme} onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" theme={theme}>
                    {editingHabit ? 'Save Changes' : 'Create Habit'}
                  </Button>
                </ButtonGroup>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default HabitTracker;
