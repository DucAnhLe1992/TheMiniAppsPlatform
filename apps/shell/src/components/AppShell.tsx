import React, { useEffect, useState } from "react";
import { supabase } from "@shared";
import Sidebar from "./Sidebar";
import { ThemeWrapper } from "./ThemeWrapper";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import TextSummarizer from "../../../text-summarizer/src/TextSummarizer";
import TodoList from "../../../todo-list/src/TodoList";
import PomodoroTimer from "../../../pomodoro-timer/src/PomodoroTimer";
import styled from "styled-components";
import type { Session } from "@supabase/supabase-js";

const AppWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  position: relative;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding-top: 5rem;
  }

  @media (max-width: 768px) {
    padding: 5rem 1rem 1.5rem;
  }
`;

const AppShell: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);

  const initAuth = async () => {
    const { data, error } = await supabase.auth.getSession();
    const session = data.session;

    if (session && !error) {
      setSession(session);
    }
  };

  useEffect(() => {
    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return (
      <ThemeWrapper>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ThemeWrapper>
    );
  }

  return (
    <ThemeWrapper>
      <Router>
        <AppWrapper>
          <Sidebar />
          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/apps/text-summarizer" element={<TextSummarizer />} />
              <Route path="/apps/todo-list" element={<TodoList />} />
              <Route path="/apps/pomodoro-timer" element={<PomodoroTimer />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainContent>
        </AppWrapper>
      </Router>
    </ThemeWrapper>
  );
};

export default AppShell;
