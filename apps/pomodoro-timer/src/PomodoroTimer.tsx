import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase, useTheme, AppStats, StatItem } from "@shared";
import { Session, SessionType, TimerStatus, DURATIONS } from "./types";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Grid,
  TimerCard,
  SessionTabs,
  SessionTab,
  TimerDisplay,
  CircularProgress,
  CircleBackground,
  CircleProgress,
  TimeText,
  TimeNumber,
  SessionLabel,
  Controls,
  ControlButton,
  StatsCard,
  StatsTitle,
  StatsGrid,
  StatBox,
  StatValue,
  StatLabel,
  SessionCounter,
  CounterLabel,
  CounterValue,
  HistorySection,
  HistoryTitle,
  HistoryList,
  HistoryItem,
  HistoryType,
  HistoryTime,
  EmptyState,
} from "./styles";

// Supabase typing workaround for insert during refactor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = supabase;

/* Styled components and constants moved to styles.ts & types.ts */

const PomodoroTimer: React.FC = () => {
  const { theme } = useTheme();
  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work * 60);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [history, setHistory] = useState<Session[]>([]);
  const [stats, setStats] = useState({
    todaySessions: 0,
    todayMinutes: 0,
    weekSessions: 0,
    totalSessions: 0,
  });
  const [overviewStats, setOverviewStats] = useState<StatItem[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const getNextSession = useCallback((): SessionType => {
    if (sessionType === "work") {
      return (sessionsCompleted + 1) % 4 === 0 ? "long_break" : "short_break";
    }
    return "work";
  }, [sessionType, sessionsCompleted]);

  const handleSessionComplete = useCallback(async () => {
    setStatus("idle");
    playCompletionSound();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await db.from("pomodoro_sessions").insert({
        user_id: user.id,
        session_type: sessionType,
        duration_minutes: DURATIONS[sessionType],
      });

      if (error) throw error;

      if (sessionType === "work") {
        setSessionsCompleted((prev) => prev + 1);
      }

      await fetchHistory();
      await fetchStats();

      const nextSession = getNextSession();
      setSessionType(nextSession);
      setTimeLeft(DURATIONS[nextSession] * 60);
    } catch (err) {
      console.error("Error saving session:", err);
    }
  }, [sessionType, getNextSession]);

  useEffect(() => {
    if (status === "running" && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, timeLeft, handleSessionComplete]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await db
        .from("pomodoro_sessions")
        .select("*")
        .order("completed_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: allSessions, error } = await db
        .from("pomodoro_sessions")
        .select("*");

      if (error) throw error;

      const sessions = (allSessions || []) as Session[];
      const todaySessions = sessions.filter(
        (s: Session) => new Date(s.completed_at) >= today
      );
      const weekSessions = sessions.filter(
        (s: Session) => new Date(s.completed_at) >= weekAgo
      );

      const todaySessionsCount = todaySessions.filter(
        (s: Session) => s.session_type === "work"
      ).length;
      const todayMinutesCount = todaySessions.reduce(
        (acc: number, s: Session) => acc + s.duration_minutes,
        0
      );
      const weekSessionsCount = weekSessions.filter(
        (s: Session) => s.session_type === "work"
      ).length;
      const totalSessionsCount = sessions.filter(
        (s: Session) => s.session_type === "work"
      ).length;

      setStats({
        todaySessions: todaySessionsCount,
        todayMinutes: todayMinutesCount,
        weekSessions: weekSessionsCount,
        totalSessions: totalSessionsCount,
      });

      const avgSessionsPerDay = weekSessionsCount > 0 ? Math.round(weekSessionsCount / 7) : 0;
      const todayBreaks = todaySessions.filter((s: Session) => s.session_type !== "work").length;

      setOverviewStats([
        {
          icon: "🍅",
          value: todaySessionsCount,
          label: "Today's Focus",
          subtext: `${todayMinutesCount} minutes`,
        },
        {
          icon: "📈",
          value: weekSessionsCount,
          label: "This Week",
          subtext: `${avgSessionsPerDay}/day avg`,
        },
        {
          icon: "⏸️",
          value: todayBreaks,
          label: "Breaks Taken",
          subtext: "Stay balanced!",
        },
        {
          icon: "🎯",
          value: totalSessionsCount,
          label: "All Time",
          subtext: "Total sessions",
        },
      ]);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleStart = () => {
    setStatus("running");
  };

  const handlePause = () => {
    setStatus("paused");
  };

  const handleReset = () => {
    setStatus("idle");
    setTimeLeft(DURATIONS[sessionType] * 60);
  };

  const handleSessionTypeChange = (type: SessionType) => {
    if (status === "running") return;
    setSessionType(type);
    setTimeLeft(DURATIONS[type] * 60);
    setStatus("idle");
  };

  const playCompletionSound = () => {
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiWE0fPTgjMGHm7A7+OZURE"
      );
      audio.volume = 0.3;
      audio.play();
    } catch {
      console.log("Audio playback not supported");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatSessionType = (type: SessionType) => {
    if (type === "work") return "Work";
    if (type === "short_break") return "Short Break";
    return "Long Break";
  };

  const getProgressColor = () => {
    if (sessionType === "work") return theme.colors.primary;
    if (sessionType === "short_break") return "#f59e0b";
    return "#10b981";
  };

  const progress = 1 - timeLeft / (DURATIONS[sessionType] * 60);
  const circumference = 2 * Math.PI * 130;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Container>
      <Header>
        <Title theme={theme}>Pomodoro Timer</Title>
        <Subtitle theme={theme}>
          Stay focused and boost your productivity
        </Subtitle>
      </Header>

      <AppStats stats={overviewStats} />

      <Grid>
        <TimerCard theme={theme}>
          <SessionTabs>
            <SessionTab
              theme={theme}
              $active={sessionType === "work"}
              onClick={() => handleSessionTypeChange("work")}
              disabled={status === "running"}
            >
              Work
            </SessionTab>
            <SessionTab
              theme={theme}
              $active={sessionType === "short_break"}
              onClick={() => handleSessionTypeChange("short_break")}
              disabled={status === "running"}
            >
              Short Break
            </SessionTab>
            <SessionTab
              theme={theme}
              $active={sessionType === "long_break"}
              onClick={() => handleSessionTypeChange("long_break")}
              disabled={status === "running"}
            >
              Long Break
            </SessionTab>
          </SessionTabs>

          <TimerDisplay>
            <CircularProgress>
              <CircleBackground theme={theme} cx="140" cy="140" r="130" />
              <CircleProgress
                $color={getProgressColor()}
                cx="140"
                cy="140"
                r="130"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5 }}
              />
            </CircularProgress>
            <TimeText>
              <TimeNumber theme={theme}>{formatTime(timeLeft)}</TimeNumber>
              <SessionLabel theme={theme}>
                {formatSessionType(sessionType)}
              </SessionLabel>
            </TimeText>
          </TimerDisplay>

          <Controls>
            {status !== "running" ? (
              <ControlButton
                theme={theme}
                $variant="primary"
                onClick={handleStart}
              >
                {status === "paused" ? "▶ Resume" : "▶ Start"}
              </ControlButton>
            ) : (
              <ControlButton
                theme={theme}
                $variant="primary"
                onClick={handlePause}
              >
                ⏸ Pause
              </ControlButton>
            )}
            <ControlButton
              theme={theme}
              $variant="secondary"
              onClick={handleReset}
            >
              ↻ Reset
            </ControlButton>
          </Controls>
        </TimerCard>

        <StatsCard theme={theme}>
          <StatsTitle theme={theme}>Your Statistics</StatsTitle>

          <SessionCounter theme={theme}>
            <CounterLabel theme={theme}>Sessions Today</CounterLabel>
            <CounterValue theme={theme}>{sessionsCompleted} / 8</CounterValue>
          </SessionCounter>

          <StatsGrid>
            <StatBox theme={theme}>
              <StatValue theme={theme}>{stats.todaySessions}</StatValue>
              <StatLabel theme={theme}>Today</StatLabel>
            </StatBox>
            <StatBox theme={theme}>
              <StatValue theme={theme}>{stats.todayMinutes}</StatValue>
              <StatLabel theme={theme}>Minutes</StatLabel>
            </StatBox>
            <StatBox theme={theme}>
              <StatValue theme={theme}>{stats.weekSessions}</StatValue>
              <StatLabel theme={theme}>This Week</StatLabel>
            </StatBox>
            <StatBox theme={theme}>
              <StatValue theme={theme}>{stats.totalSessions}</StatValue>
              <StatLabel theme={theme}>All Time</StatLabel>
            </StatBox>
          </StatsGrid>

          <HistorySection>
            <HistoryTitle theme={theme}>Recent Sessions</HistoryTitle>
            {history.length === 0 ? (
              <EmptyState theme={theme}>
                No sessions yet. Start your first Pomodoro!
              </EmptyState>
            ) : (
              <HistoryList>
                {history.map((session) => (
                  <HistoryItem key={session.id} theme={theme}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "center",
                      }}
                    >
                      <HistoryType $type={session.session_type}>
                        {formatSessionType(session.session_type)}
                      </HistoryType>
                      <span>{session.duration_minutes} min</span>
                    </div>
                    <HistoryTime theme={theme}>
                      {new Date(session.completed_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </HistoryTime>
                  </HistoryItem>
                ))}
              </HistoryList>
            )}
          </HistorySection>
        </StatsCard>
      </Grid>
    </Container>
  );
};

export default PomodoroTimer;
