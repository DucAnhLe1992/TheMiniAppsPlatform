import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 4rem 0;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
`;

export const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const DateNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const NavButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
  }
`;

export const DateDisplay = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  min-width: 200px;
  text-align: center;
`;

export const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.primary};
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;

  &:hover {
    background: ${(props) => props.theme.colors.primaryHover};
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const HabitsGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

export const HabitCard = styled(motion.div)<{ $color: string }>`
  padding: 1.5rem;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.surface};
  border: 2px solid ${(props) => props.$color}40;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${(props) => props.$color};
  }
`;

export const HabitHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const HabitIcon = styled.div`
  font-size: 2rem;
  line-height: 1;
`;

export const HabitInfo = styled.div`
  flex: 1;
`;

export const HabitName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 0.25rem 0;
`;

export const HabitDescription = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
`;

export const HabitActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const IconButton = styled.button`
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 6px;
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
  }
`;

export const HabitStats = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem 0;
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

export const CheckButton = styled.button<{ $checked: boolean; $color: string }>`
  padding: 1rem 2rem;
  border: 2px solid
    ${(props) => (props.$checked ? props.$color : props.theme.colors.border)};
  border-radius: 8px;
  background: ${(props) =>
    props.$checked ? props.$color : props.theme.colors.surface};
  color: ${(props) => (props.$checked ? "#ffffff" : props.theme.colors.text)};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    transform: scale(1.02);
  }
`;

export const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled(motion.div)`
  background: ${(props) => props.theme.colors.background};
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const ColorPicker = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
`;

export const ColorOption = styled.button<{
  $color: string;
  $selected: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(props) => props.$color};
  border: 3px solid
    ${(props) => (props.$selected ? props.theme.colors.text : "transparent")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const IconPicker = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
`;

export const IconOption = styled.button<{ $selected: boolean }>`
  padding: 0.5rem;
  border-radius: 8px;
  background: ${(props) =>
    props.$selected ? props.theme.colors.primary : props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$selected
        ? props.theme.colors.primaryHover
        : props.theme.colors.surfaceHover};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: ${(props) =>
    props.$variant === "secondary"
      ? `1px solid ${props.theme.colors.border}`
      : "none"};
  border-radius: 8px;
  background: ${(props) =>
    props.$variant === "secondary"
      ? props.theme.colors.surface
      : props.theme.colors.primary};
  color: ${(props) =>
    props.$variant === "secondary" ? props.theme.colors.text : "#ffffff"};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$variant === "secondary"
        ? props.theme.colors.surfaceHover
        : props.theme.colors.primaryHover};
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

export const EmptyText = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
`;
