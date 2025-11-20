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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const StatSubtext = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textTertiary};
  margin-top: 0.25rem;
`;

interface Stats {
  totalTodos: number;
  completedTodos: number;
  totalNotes: number;
  totalHabits: number;
  habitStreak: number;
  pomodoroSessions: number;
  upcomingEvents: number;
  shoppingLists: number;
}

interface ProfileStatisticsProps {
  theme: any;
}

export const ProfileStatistics: React.FC<ProfileStatisticsProps> = ({ theme }) => {
  const [stats, setStats] = useState<Stats>({
    totalTodos: 0,
    completedTodos: 0,
    totalNotes: 0,
    totalHabits: 0,
    habitStreak: 0,
    pomodoroSessions: 0,
    upcomingEvents: 0,
    shoppingLists: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [
        todosData,
        completedTodosData,
        notesData,
        habitsData,
        pomodoroData,
        eventsData,
        shoppingListsData,
      ] = await Promise.all([
        supabase.from('todos').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('todos').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('completed', true),
        supabase.from('notes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('habits').select('id', { count: 'exact', head: true }).eq('user_id', user.id).is('archived_at', null),
        supabase.from('pomodoro_sessions').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('start_time', new Date().toISOString()),
        supabase.from('shopping_lists').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
      ]);

      const habitStreak = await calculateHabitStreak(user.id);

      setStats({
        totalTodos: todosData.count || 0,
        completedTodos: completedTodosData.count || 0,
        totalNotes: notesData.count || 0,
        totalHabits: habitsData.count || 0,
        habitStreak,
        pomodoroSessions: pomodoroData.count || 0,
        upcomingEvents: eventsData.count || 0,
        shoppingLists: shoppingListsData.count || 0,
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateHabitStreak = async (userId: string): Promise<number> => {
    try {
      const { data } = await supabase
        .from('habit_completions')
        .select('completed_date')
        .eq('user_id', userId)
        .order('completed_date', { ascending: false })
        .limit(365);

      if (!data || data.length === 0) return 0;

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const completionDates = data.map(c => new Date(c.completed_date).getTime());
      const uniqueDates = [...new Set(completionDates)].sort((a, b) => b - a);

      let currentDate = today.getTime();
      for (const date of uniqueDates) {
        if (date === currentDate || date === currentDate - 86400000) {
          streak++;
          currentDate = date - 86400000;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating habit streak:', error);
      return 0;
    }
  };

  if (loading) {
    return (
      <Container>
        <Title theme={theme}>Loading Statistics...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title theme={theme}>Your Statistics</Title>
      <StatsGrid>
        <StatCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <StatIcon>✓</StatIcon>
          <StatLabel theme={theme}>Todos</StatLabel>
          <StatValue theme={theme}>{stats.totalTodos}</StatValue>
          <StatSubtext theme={theme}>{stats.completedTodos} completed</StatSubtext>
        </StatCard>

        <StatCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon>📝</StatIcon>
          <StatLabel theme={theme}>Notes</StatLabel>
          <StatValue theme={theme}>{stats.totalNotes}</StatValue>
          <StatSubtext theme={theme}>Total notes created</StatSubtext>
        </StatCard>

        <StatCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon>🎯</StatIcon>
          <StatLabel theme={theme}>Habits</StatLabel>
          <StatValue theme={theme}>{stats.totalHabits}</StatValue>
          <StatSubtext theme={theme}>{stats.habitStreak} day streak</StatSubtext>
        </StatCard>

        <StatCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon>🍅</StatIcon>
          <StatLabel theme={theme}>Pomodoro</StatLabel>
          <StatValue theme={theme}>{stats.pomodoroSessions}</StatValue>
          <StatSubtext theme={theme}>Sessions completed</StatSubtext>
        </StatCard>

        <StatCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatIcon>📅</StatIcon>
          <StatLabel theme={theme}>Events</StatLabel>
          <StatValue theme={theme}>{stats.upcomingEvents}</StatValue>
          <StatSubtext theme={theme}>Upcoming events</StatSubtext>
        </StatCard>

        <StatCard
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <StatIcon>🛒</StatIcon>
          <StatLabel theme={theme}>Shopping Lists</StatLabel>
          <StatValue theme={theme}>{stats.shoppingLists}</StatValue>
          <StatSubtext theme={theme}>Total lists</StatSubtext>
        </StatCard>
      </StatsGrid>
    </Container>
  );
};
