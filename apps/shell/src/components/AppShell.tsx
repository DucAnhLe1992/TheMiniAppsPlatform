import React, { useEffect, useState } from "react";
import { supabase } from "@shared";
import Sidebar from "./Sidebar";
import TabBar from "./TabBar";
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
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../theme";
import type { Session } from "@supabase/supabase-js";

const AppWrapper = styled.div`
  display: flex;
  height: 100vh;
  background: ${(props) => props.theme?.colors.background};
  color: ${(props) => props.theme?.colors.text};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const AppShell: React.FC = () => {
  const [session, setSession] = useState<Session | null>(
    // supabase.auth.getSession()?.data?.session ?? null,
    null,
  );

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
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppWrapper>
          <Sidebar />
          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/apps/text-summarizer" element={<TextSummarizer />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainContent>
          <TabBar />
        </AppWrapper>
      </Router>
    </ThemeProvider>
  );
};

export default AppShell;
