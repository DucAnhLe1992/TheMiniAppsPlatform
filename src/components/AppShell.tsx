import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
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
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../theme";

const AppWrapper = styled.div`
  display: flex;
  height: 100vh;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const AppShell: React.FC = () => {
  const [session, setSession] = useState(
    supabase.auth.getSession()?.data.session ?? null,
  );

  useEffect(() => {
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
              {/* Add other routes */}
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
