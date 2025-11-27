export interface HabitTrackerProps {
  startDate?: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  frequency: "daily" | "weekly";
  target_days: number[];
  reminder_time: string | null;
  created_at: string;
  archived_at: string | null;
}

export interface Completion {
  id: string;
  habit_id: string;
  completed_date: string;
  notes: string;
}

export const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];
export const ICONS = [
  "✓",
  "⭐",
  "💪",
  "📚",
  "🏃",
  "🧘",
  "💧",
  "🎯",
  "🎨",
  "🎵",
  "💼",
  "🌱",
];
