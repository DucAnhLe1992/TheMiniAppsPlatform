import React, { useEffect, useState } from "react";
import { supabase } from "@shared";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { ThemeWrapper } from "./ThemeWrapper";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import TextSummarizer from "../../apps/text-summarizer/src/TextSummarizer";
import TodoList from "../../apps/todo-list/src/TodoList";
import PomodoroTimer from "../../apps/pomodoro-timer/src/PomodoroTimer";
import NotesManager from "../../apps/notes-manager/src/NotesManager";
import ShoppingList from "../../apps/shopping-list/src/ShoppingList";
import CurrencyConverter from "../../apps/currency-converter/src/CurrencyConverter";
import WeatherInfo from "../../apps/weather-info/src/WeatherInfo";
import Calendar from "../../apps/calendar/src/Calendar";
import HabitTracker from "../../apps/habit-tracker/src/HabitTracker";
import styled from "styled-components";
import type { Session } from "@supabase/supabase-js";

const AppWrapper = styled.div`
  display: flex;
  height: 100vh;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  padding-top: 64px; /* Header height */

  @media (max-width: 1024px) {
    display: block;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2.25rem; /* a bit more breathing room */
  overflow-y: auto;
  height: calc(100vh - 64px); /* Full height minus header */

  @media (max-width: 1024px) {
    height: calc(100vh - 64px);
    padding: 1.75rem 1.125rem;
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

  const AuthenticatedApp = () => {
    useKeyboardShortcuts();
    return (
      <>
        <Header />
        <AppWrapper>
          <Sidebar />
          <MainContent>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/apps/text-summarizer" element={<TextSummarizer />} />
              <Route path="/apps/todo-list" element={<TodoList />} />
              <Route path="/apps/pomodoro-timer" element={<PomodoroTimer />} />
              <Route path="/apps/notes-manager" element={<NotesManager />} />
              <Route path="/apps/shopping-list" element={<ShoppingList />} />
              <Route path="/apps/currency-converter" element={<CurrencyConverter />} />
              <Route path="/apps/weather-info" element={<WeatherInfo />} />
              <Route path="/apps/calendar" element={<Calendar />} />
              <Route path="/apps/habit-tracker" element={<HabitTracker />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainContent>
        </AppWrapper>
      </>
    );
  };

  return (
    <ThemeWrapper>
      <Router>
        {!session ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        ) : (
          <AuthenticatedApp />
        )}
      </Router>
    </ThemeWrapper>
  );
};

export default AppShell;
