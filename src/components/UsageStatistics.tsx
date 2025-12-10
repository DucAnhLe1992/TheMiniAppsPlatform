import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { supabase } from "@shared";

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatCard = styled(motion.div)`
  ${props => props.theme.card}
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: ${props => props.theme.colors.gradient};
    opacity: 0.1;
    border-radius: 50%;
    transform: translate(30%, -30%);
  }
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.div`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1;
`;

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: 0.875rem;
  color: ${props => props.positive
    ? props.theme.colors.success
    : props.theme.colors.textSecondary};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StatIcon = styled.div`
  font-size: 1.5rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
  opacity: 0.5;
`;

const LoadingCard = styled(StatCard)`
  justify-content: center;
  align-items: center;
  min-height: 120px;
  color: ${props => props.theme.colors.textSecondary};
`;

interface Stats {
  totalActions: number;
  thisMonthActions: number;
  lastMonthActions: number;
  completedTodos: number;
  pomodoroSessions: number;
  notesCreated: number;
  mostUsedApp: string;
}

const UsageStatistics: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const [
        todosResult,
        todosThisMonthResult,
        todosLastMonthResult,
        pomodoroResult,
        pomodoroThisMonthResult,
        pomodoroLastMonthResult,
        notesResult,
        notesThisMonthResult,
        notesLastMonthResult,
      ] = await Promise.all([
        supabase.from("todos").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("completed", true),
        supabase.from("todos").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("completed", true).gte("completed_at", firstDayThisMonth.toISOString()),
        supabase.from("todos").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("completed", true).gte("completed_at", firstDayLastMonth.toISOString()).lte("completed_at", lastDayLastMonth.toISOString()),
        supabase.from("pomodoro_sessions").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("completed", true),
        supabase.from("pomodoro_sessions").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("completed", true).gte("created_at", firstDayThisMonth.toISOString()),
        supabase.from("pomodoro_sessions").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("completed", true).gte("created_at", firstDayLastMonth.toISOString()).lte("created_at", lastDayLastMonth.toISOString()),
        supabase.from("notes").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("notes").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", firstDayThisMonth.toISOString()),
        supabase.from("notes").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", firstDayLastMonth.toISOString()).lte("created_at", lastDayLastMonth.toISOString()),
      ]);

      const completedTodos = todosResult.count || 0;
      const todosThisMonth = todosThisMonthResult.count || 0;
      const todosLastMonth = todosLastMonthResult.count || 0;

      const pomodoroSessions = pomodoroResult.count || 0;
      const pomodoroThisMonth = pomodoroThisMonthResult.count || 0;
      const pomodoroLastMonth = pomodoroLastMonthResult.count || 0;

      const notesCreated = notesResult.count || 0;
      const notesThisMonth = notesThisMonthResult.count || 0;
      const notesLastMonth = notesLastMonthResult.count || 0;

      const thisMonthTotal = todosThisMonth + pomodoroThisMonth + notesThisMonth;
      const lastMonthTotal = todosLastMonth + pomodoroLastMonth + notesLastMonth;
      const totalActions = completedTodos + pomodoroSessions + notesCreated;

      let mostUsedApp = "To-Do List";
      let maxCount = todosThisMonth;
      if (pomodoroThisMonth > maxCount) {
        mostUsedApp = "Pomodoro Timer";
        maxCount = pomodoroThisMonth;
      }
      if (notesThisMonth > maxCount) {
        mostUsedApp = "Notes Manager";
      }

      setStats({
        totalActions,
        thisMonthActions: thisMonthTotal,
        lastMonthActions: lastMonthTotal,
        completedTodos,
        pomodoroSessions,
        notesCreated,
        mostUsedApp,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StatsContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <LoadingCard>Loading statistics...</LoadingCard>
      </StatsContainer>
    );
  }

  if (!stats) return null;

  const percentageChange = stats.lastMonthActions > 0
    ? Math.round(((stats.thisMonthActions - stats.lastMonthActions) / stats.lastMonthActions) * 100)
    : stats.thisMonthActions > 0 ? 100 : 0;

  const isPositive = percentageChange >= 0;

  return (
    <StatsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <StatCard
        whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <StatIcon>🎯</StatIcon>
        <StatLabel>Total Actions</StatLabel>
        <StatValue>{stats.totalActions.toLocaleString()}</StatValue>
        <StatChange positive={true}>
          All time across all apps
        </StatChange>
      </StatCard>

      <StatCard
        whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <StatIcon>📅</StatIcon>
        <StatLabel>This Month</StatLabel>
        <StatValue>{stats.thisMonthActions.toLocaleString()}</StatValue>
        <StatChange positive={isPositive}>
          {isPositive ? "↑" : "↓"} {Math.abs(percentageChange)}% from last month
        </StatChange>
      </StatCard>

      <StatCard
        whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <StatIcon>✅</StatIcon>
        <StatLabel>Tasks Completed</StatLabel>
        <StatValue>{stats.completedTodos.toLocaleString()}</StatValue>
        <StatChange positive={true}>
          {stats.pomodoroSessions} pomodoros done
        </StatChange>
      </StatCard>

      <StatCard
        whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <StatIcon>⭐</StatIcon>
        <StatLabel>Most Used App</StatLabel>
        <StatValue style={{ fontSize: "1.5rem" }}>{stats.mostUsedApp}</StatValue>
        <StatChange positive={true}>
          {stats.notesCreated} notes created
        </StatChange>
      </StatCard>
    </StatsContainer>
  );
};

export default UsageStatistics;
