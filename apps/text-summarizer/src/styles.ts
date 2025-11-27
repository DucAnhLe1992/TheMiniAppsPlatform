import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 0 4rem 0;

  @media (max-width: 1024px) {
    padding-left: 0;
  }
`;

export const Header = styled.div`
  margin-bottom: 3rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
`;

export const Card = styled(motion.div)`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.75rem;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 0.9375rem;
  font-family: inherit;
  resize: vertical;
  line-height: 1.6;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textTertiary};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Button = styled(motion.button)`
  flex: 1;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: ${(props) => props.theme.colors.gradient};
  color: white;
  box-shadow: ${(props) => props.theme.shadows.md};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled(Button)`
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  border: 1px solid ${(props) => props.theme.colors.border};
  box-shadow: none;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.surfaceHover};
    box-shadow: none;
  }
`;

export const ResultBox = styled(motion.div)`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 16px;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const ResultTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ResultIcon = styled.span`
  font-size: 1.5rem;
`;

export const ResultText = styled.p`
  color: ${(props) => props.theme.colors.text};
  line-height: 1.7;
  font-size: 1rem;
  margin: 0;
`;

export const ErrorMessage = styled(motion.div)`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.error}15;
  border: 1px solid ${(props) => props.theme.colors.error}40;
  color: ${(props) => props.theme.colors.error};
  font-size: 0.9375rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${(props) => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const StatLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.colors.textTertiary};
`;

export const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;
