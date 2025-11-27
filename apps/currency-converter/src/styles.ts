import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.div`
  max-width: 1400px;
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

export const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${(props) => props.theme.colors.border};
`;

export const Tab = styled.button<{ $active: boolean }>`
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid
    ${(props) => (props.$active ? props.theme.colors.primary : "transparent")};
  color: ${(props) =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -2px;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const Section = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
`;

export const ConverterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ConversionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.875rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 1.125rem;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const Select = styled.select`
  padding: 0.875rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const SwapButton = styled(motion.button)`
  align-self: center;
  width: 48px;
  height: 48px;
  background: ${(props) => props.theme.colors.primary};
  border: none;
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${(props) => props.theme.colors.primaryHover};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ResultBox = styled.div`
  padding: 1.5rem;
  background: ${(props) => props.theme.colors.surfaceHover};
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 12px;
  margin-top: 1rem;
`;

export const ResultLabel = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

export const ResultValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

export const ResultRate = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 0.5rem;
`;

export const BudgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

export const BudgetCard = styled(motion.div)`
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const BudgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

export const BudgetName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;

export const BudgetPeriod = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: ${(props) => props.theme.colors.primary};
  color: #ffffff;
  border-radius: 4px;
`;

export const ProgressBar = styled.div`
  margin: 1rem 0;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

export const ProgressTrack = styled.div`
  height: 8px;
  background: ${(props) => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled(motion.div)<{ $over: boolean }>`
  height: 100%;
  background: ${(props) =>
    props.$over ? "#ef4444" : props.theme.colors.primary};
  border-radius: 4px;
`;

export const BudgetAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

export const BudgetRemaining = styled.div<{ $over: boolean }>`
  font-size: 0.875rem;
  color: ${(props) =>
    props.$over ? "#ef4444" : props.theme.colors.textSecondary};
  font-weight: 600;
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.$variant === "primary"
      ? props.theme.colors.primary
      : props.theme.colors.surface};
  color: ${(props) =>
    props.$variant === "primary" ? "#ffffff" : props.theme.colors.text};
  border: ${(props) =>
    props.$variant === "secondary"
      ? `1px solid ${props.theme.colors.border}`
      : "none"};

  &:hover {
    background: ${(props) =>
      props.$variant === "primary"
        ? props.theme.colors.primaryHover
        : props.theme.colors.surfaceHover};
  }
`;

export const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled(motion.div)`
  background: ${(props) => props.theme.colors.surface};
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${(props) => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
  }
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

export const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

export const ExpenseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

export const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
`;

export const ExpenseInfo = styled.div`
  flex: 1;
`;

export const ExpenseDescription = styled.div`
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

export const ExpenseDetails = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

export const ExpenseAmount = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

export const DeleteButton = styled.button`
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  margin-left: 0.5rem;

  &:hover {
    background: #fee;
    color: #ef4444;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
`;

export const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const EmptyText = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;
