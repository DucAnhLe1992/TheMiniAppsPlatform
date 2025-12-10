import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { supabase } from "@shared";

const FeedContainer = styled(motion.div)`
  ${props => props.theme.card}
  padding: 1.5rem;
  margin-bottom: 3rem;
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surface};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.borderLight};
    }
  }
`;

const FeedHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const FeedIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.theme.colors.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const FeedTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    transform: translateX(4px);
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.theme.colors.backgroundElevated};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityText = styled.div`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActivityTime = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ActivityApp = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9375rem;
`;

interface Activity {
  id: string;
  type: string;
  description: string;
  app: string;
  icon: string;
  timestamp: string;
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const allActivities: Activity[] = [];

      const [todosData, pomodoroData, notesData] = await Promise.all([
        supabase
          .from("todos")
          .select("id, title, completed_at")
          .eq("user_id", user.id)
          .eq("completed", true)
          .not("completed_at", "is", null)
          .order("completed_at", { ascending: false })
          .limit(5),
        supabase
          .from("pomodoro_sessions")
          .select("id, created_at, work_duration")
          .eq("user_id", user.id)
          .eq("completed", true)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("notes")
          .select("id, title, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (todosData.data) {
        todosData.data.forEach(todo => {
          allActivities.push({
            id: `todo-${todo.id}`,
            type: "todo",
            description: `Completed: ${todo.title}`,
            app: "To-Do List",
            icon: "✅",
            timestamp: todo.completed_at,
          });
        });
      }

      if (pomodoroData.data) {
        pomodoroData.data.forEach(session => {
          const minutes = Math.round(session.work_duration / 60);
          allActivities.push({
            id: `pomodoro-${session.id}`,
            type: "pomodoro",
            description: `Completed ${minutes} min focus session`,
            app: "Pomodoro Timer",
            icon: "🍅",
            timestamp: session.created_at,
          });
        });
      }

      if (notesData.data) {
        notesData.data.forEach(note => {
          allActivities.push({
            id: `note-${note.id}`,
            type: "note",
            description: `Created: ${note.title}`,
            app: "Notes Manager",
            icon: "📝",
            timestamp: note.created_at,
          });
        });
      }

      allActivities.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(allActivities.slice(0, 10));
    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  if (loading) {
    return (
      <FeedContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FeedHeader>
          <FeedIcon>📊</FeedIcon>
          <FeedTitle>Recent Activity</FeedTitle>
        </FeedHeader>
        <EmptyState>Loading activity...</EmptyState>
      </FeedContainer>
    );
  }

  if (activities.length === 0) {
    return (
      <FeedContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FeedHeader>
          <FeedIcon>📊</FeedIcon>
          <FeedTitle>Recent Activity</FeedTitle>
        </FeedHeader>
        <EmptyState>No recent activity yet. Start using your apps!</EmptyState>
      </FeedContainer>
    );
  }

  return (
    <FeedContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <FeedHeader>
        <FeedIcon>📊</FeedIcon>
        <FeedTitle>Recent Activity</FeedTitle>
      </FeedHeader>
      <ActivityList>
        {activities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ActivityIcon>{activity.icon}</ActivityIcon>
            <ActivityContent>
              <ActivityText>{activity.description}</ActivityText>
              <ActivityTime>
                <ActivityApp>{activity.app}</ActivityApp> · {formatTimeAgo(activity.timestamp)}
              </ActivityTime>
            </ActivityContent>
          </ActivityItem>
        ))}
      </ActivityList>
    </FeedContainer>
  );
};

export default ActivityFeed;
