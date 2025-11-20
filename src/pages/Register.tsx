import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, useTheme } from "@shared";
import styled from "styled-components";
import { motion } from "framer-motion";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  padding: 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackgroundGradient = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gradient};
  opacity: 0.15;
  filter: blur(100px);
  top: -200px;
  left: -200px;
  pointer-events: none;
`;

const BackgroundGradient2 = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: ${props => props.theme.colors.accent};
  opacity: 0.1;
  filter: blur(100px);
  bottom: -150px;
  right: -150px;
  pointer-events: none;
`;

const Container = styled(motion.div)`
  width: 100%;
  max-width: 420px;
  padding: 3rem;
  background: ${props => props.theme.colors.surface};
  border-radius: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.xl};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    max-width: 100%;
  }
`;

const Logo = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${props => props.theme.colors.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: ${props => props.theme.colors.gradient};
  color: white;
  box-shadow: ${props => props.theme.shadows.md};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const FooterLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;

  &:hover {
    color: ${props => props.theme.colors.primaryHover};
  }
`;

const ErrorMessage = styled(motion.div)`
  padding: 0.875rem 1rem;
  border-radius: 12px;
  background: ${props => props.theme.colors.error}15;
  border: 1px solid ${props => props.theme.colors.error}40;
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled(motion.div)`
  padding: 0.875rem 1rem;
  border-radius: 12px;
  background: ${props => props.theme.colors.success}15;
  border: 1px solid ${props => props.theme.colors.success}40;
  color: ${props => props.theme.colors.success};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const ThemeToggle = styled(motion.button)`
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  box-shadow: ${props => props.theme.shadows.md};
  z-index: 1000;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    width: 44px;
    height: 44px;
  }
`;

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { theme, themeMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }

  return (
    <PageContainer theme={theme}>
      <ThemeToggle
        theme={theme}
        onClick={toggleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {themeMode === 'dark' ? '🌙' : '☀️'}
      </ThemeToggle>
      <BackgroundGradient theme={theme} />
      <BackgroundGradient2 theme={theme} />

      <Container
        theme={theme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo theme={theme}>AI</Logo>
        <Title theme={theme}>Create Account</Title>
        <Subtitle theme={theme}>Start your AI-powered journey today</Subtitle>

        {error && (
          <ErrorMessage
            theme={theme}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage
            theme={theme}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Account created successfully! Redirecting to login...
          </SuccessMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label theme={theme}>Email</Label>
            <Input
              theme={theme}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label theme={theme}>Password</Label>
            <Input
              theme={theme}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label theme={theme}>Confirm Password</Label>
            <Input
              theme={theme}
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputGroup>

          <Button
            theme={theme}
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </Form>

        <Footer theme={theme}>
          Already have an account?{" "}
          <FooterLink theme={theme} to="/login">
            Sign in
          </FooterLink>
        </Footer>
      </Container>
    </PageContainer>
  );
};

export default Register;
