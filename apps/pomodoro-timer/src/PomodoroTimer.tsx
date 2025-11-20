import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { supabase, useTheme } from '@shared';
import { motion, AnimatePresence } from 'framer-motion';

interface Session {
  id: string;
  session_type: 'work' | 'short_break' | 'long_break';
  duration_minutes: number;
  completed_at: string;
  notes: string | null;
}

type SessionType = 'work' | 'short_break' | 'long_break';
type TimerStatus = 'idle' | 'running' | 'paused';

const DURATIONS = {
  work: 25,
  short_break: 5,
  long_break: 15,
};

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
`;

const TimerCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
`;

const SessionTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const SessionTab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.$active ? '#ffffff' : props.theme.colors.text};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? props.theme.colors.primaryHover : props.theme.colors.surfaceHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TimerDisplay = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  margin: 2rem 0;

  @media (max-width: 768px) {
    width: 240px;
    height: 240px;
  }
`;

const CircularProgress = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

const CircleBackground = styled.circle`
  fill: none;
  stroke: ${props => props.theme.colors.borderLight};
  stroke-width: 12;
`;

const CircleProgress = styled(motion.circle)<{ $color: string }>`
  fill: none;
  stroke: ${props => props.$color};
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke 0.3s ease;
`;

const TimeText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const TimeNumber = styled.div`
  font-size: 4rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const SessionLabel = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ControlButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.$variant === 'primary' ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.$variant === 'primary' ? '#ffffff' : props.theme.colors.text};
  border: ${props => props.$variant === 'secondary' ? `1px solid ${props.theme.colors.border}` : 'none'};

  &:hover {
    background: ${props => props.$variant === 'primary' ? props.theme.colors.primaryHover : props.theme.colors.surfaceHover};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StatsCard = styled(Card)``;

const StatsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatBox = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const SessionCounter = styled.div`
  text-align: center;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  margin-bottom: 1.5rem;
`;

const CounterLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const CounterValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const HistorySection = styled.div`
  margin-top: 2rem;
`;

const HistoryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem 0;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  font-size: 0.875rem;
`;

const HistoryType = styled.span<{ $type: SessionType }>`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  background: ${props => {
    if (props.$type === 'work') return '#dbeafe';
    if (props.$type === 'short_break') return '#fef3c7';
    return '#dcfce7';
  }};
  color: ${props => {
    if (props.$type === 'work') return '#1e40af';
    if (props.$type === 'short_break') return '#92400e';
    return '#166534';
  }};
`;

const HistoryTime = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const PomodoroTimer: React.FC = () => {
  const { theme } = useTheme();
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work * 60);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [history, setHistory] = useState<Session[]>([]);
  const [stats, setStats] = useState({
    todaySessions: 0,
    todayMinutes: 0,
    weekSessions: 0,
    totalSessions: 0,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, timeLeft]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: allSessions, error } = await supabase
        .from('pomodoro_sessions')
        .select('*');

      if (error) throw error;

      const sessions = allSessions || [];
      const todaySessions = sessions.filter(s => new Date(s.completed_at) >= today);
      const weekSessions = sessions.filter(s => new Date(s.completed_at) >= weekAgo);

      setStats({
        todaySessions: todaySessions.filter(s => s.session_type === 'work').length,
        todayMinutes: todaySessions.reduce((acc, s) => acc + s.duration_minutes, 0),
        weekSessions: weekSessions.filter(s => s.session_type === 'work').length,
        totalSessions: sessions.filter(s => s.session_type === 'work').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSessionComplete = async () => {
    setStatus('idle');
    playCompletionSound();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('pomodoro_sessions').insert({
        user_id: user.id,
        session_type: sessionType,
        duration_minutes: DURATIONS[sessionType],
      });

      if (error) throw error;

      if (sessionType === 'work') {
        setSessionsCompleted(prev => prev + 1);
      }

      await fetchHistory();
      await fetchStats();

      const nextSession = getNextSession();
      setSessionType(nextSession);
      setTimeLeft(DURATIONS[nextSession] * 60);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const getNextSession = (): SessionType => {
    if (sessionType === 'work') {
      return (sessionsCompleted + 1) % 4 === 0 ? 'long_break' : 'short_break';
    }
    return 'work';
  };

  const handleStart = () => {
    setStatus('running');
  };

  const handlePause = () => {
    setStatus('paused');
  };

  const handleReset = () => {
    setStatus('idle');
    setTimeLeft(DURATIONS[sessionType] * 60);
  };

  const handleSessionTypeChange = (type: SessionType) => {
    if (status === 'running') return;
    setSessionType(type);
    setTimeLeft(DURATIONS[type] * 60);
    setStatus('idle');
  };

  const playCompletionSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiWE0fPTgjMGHm7A7+OZURE');
      audio.volume = 0.3;
      audio.play();
    } catch (error) {
      console.log('Audio playback not supported');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSessionType = (type: SessionType) => {
    if (type === 'work') return 'Work';
    if (type === 'short_break') return 'Short Break';
    return 'Long Break';
  };

  const getProgressColor = () => {
    if (sessionType === 'work') return theme.colors.primary;
    if (sessionType === 'short_break') return '#f59e0b';
    return '#10b981';
  };

  const progress = 1 - (timeLeft / (DURATIONS[sessionType] * 60));
  const circumference = 2 * Math.PI * 130;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Container>
      <Header>
        <Title theme={theme}>Pomodoro Timer</Title>
        <Subtitle theme={theme}>Stay focused and boost your productivity</Subtitle>
      </Header>

      <Grid>
        <TimerCard theme={theme}>
          <SessionTabs>
            <SessionTab
              theme={theme}
              $active={sessionType === 'work'}
              onClick={() => handleSessionTypeChange('work')}
              disabled={status === 'running'}
            >
              Work
            </SessionTab>
            <SessionTab
              theme={theme}
              $active={sessionType === 'short_break'}
              onClick={() => handleSessionTypeChange('short_break')}
              disabled={status === 'running'}
            >
              Short Break
            </SessionTab>
            <SessionTab
              theme={theme}
              $active={sessionType === 'long_break'}
              onClick={() => handleSessionTypeChange('long_break')}
              disabled={status === 'running'}
            >
              Long Break
            </SessionTab>
          </SessionTabs>

          <TimerDisplay>
            <CircularProgress>
              <CircleBackground
                theme={theme}
                cx="140"
                cy="140"
                r="130"
              />
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
              <SessionLabel theme={theme}>{formatSessionType(sessionType)}</SessionLabel>
            </TimeText>
          </TimerDisplay>

          <Controls>
            {status !== 'running' ? (
              <ControlButton
                theme={theme}
                $variant="primary"
                onClick={handleStart}
              >
                {status === 'paused' ? '▶ Resume' : '▶ Start'}
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
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <HistoryType $type={session.session_type}>
                        {formatSessionType(session.session_type)}
                      </HistoryType>
                      <span>{session.duration_minutes} min</span>
                    </div>
                    <HistoryTime theme={theme}>
                      {new Date(session.completed_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
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
