import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "@shared";

const BannerWrap = styled.section`
  ${props => props.theme.card}
  padding: 28px 32px;
  margin-bottom: 28px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  align-items: center;
  position: relative;
  overflow: hidden;
  color: ${props => props.theme.colors.text};

  &:before {
    content: "";
    position: absolute;
    inset: -20% -10% auto auto;
    width: 60%;
    height: 140%;
    background: ${props => props.theme.colors.gradient};
    filter: blur(60px) saturate(1.1);
    opacity: 0.35;
    transform: translate3d(0,0,0);
    pointer-events: none;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    &:before { width: 100%; height: 60%; opacity: 0.3; }
  }
`;

const Greeting = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  h2 {
    margin: 0;
    font-size: 2.25rem;
    font-weight: 800;
    color: ${props => props.theme.colors.text};
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    color: ${props => props.theme.colors.textSecondary};
    font-size: 1.05rem;
    line-height: 1.7;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const ActionBtn = styled.button`
  appearance: none;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundElevated};
  color: ${props => props.theme.colors.text};
  border-radius: 9999px;
  padding: 10px 16px;
  font-weight: 600;
  box-shadow: ${props => props.theme.shadows.sm};
  transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${props => props.theme.colors.borderLight};
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const Illustration = styled.div`
  position: relative;
  border-radius: 16px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  min-height: 160px;
  box-shadow: ${props => props.theme.shadows.md};
  overflow: hidden;

  &:after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient( circle at 30% 30%, ${props => props.theme.colors.primary}26, transparent 60% ),
                radial-gradient( circle at 70% 70%, ${props => props.theme.colors.accent}24, transparent 60% );
  }
`;

export interface BannerProps {
  userName?: string;
  todaySummary?: string;
  onQuickAddEvent?: () => void;
  onQuickAddTask?: () => void;
  onStartPomodoro?: () => void;
  onLearnMore?: () => void;
}

const Banner: React.FC<BannerProps> = ({
  userName,
  todaySummary,
  onQuickAddEvent,
  onQuickAddTask,
  onStartPomodoro,
  onLearnMore,
}) => {
  const [profileName, setProfileName] = useState<string | undefined>(userName);

  // Always show banner: remove hidden state

  useEffect(() => {
    if (profileName) return;
    const loadProfile = async () => {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId) return;
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("full_name")
        .eq("user_id", userId)
        .maybeSingle();
      const p = profile as unknown as { full_name?: string } | null;
      if (p && p.full_name) {
        setProfileName(p.full_name);
      }
    };
    loadProfile();
  }, [profileName]);

  const greeting = profileName ? `Welcome back, ${profileName}` : "Welcome back";
  const summary = todaySummary ?? "All your mini‑apps, elegantly integrated.";

  return (
    <BannerWrap>
      <Greeting>
        <h2>{greeting}</h2>
        <p>{summary}</p>
        <Actions>
          <ActionBtn onClick={onQuickAddEvent}>Start with Calendar</ActionBtn>
          <ActionBtn onClick={onQuickAddTask}>Start with To‑Do</ActionBtn>
          <ActionBtn onClick={onStartPomodoro}>Start Pomodoro</ActionBtn>
          <ActionBtn onClick={onLearnMore}>Learn More</ActionBtn>
        </Actions>
      </Greeting>
      <Illustration />
    </BannerWrap>
  );
};

export default Banner;
