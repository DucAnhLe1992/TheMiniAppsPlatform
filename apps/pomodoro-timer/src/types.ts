export interface Session {
  id: string;
  session_type: "work" | "short_break" | "long_break";
  duration_minutes: number;
  completed_at: string;
  notes: string | null;
}

export type SessionType = "work" | "short_break" | "long_break";
export type TimerStatus = "idle" | "running" | "paused";

export const DURATIONS: Record<SessionType, number> = {
  work: 25,
  short_break: 5,
  long_break: 15,
};
