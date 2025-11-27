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
  flex-wrap: wrap;
  align-items: center;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
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

export const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid
    ${(props) =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) =>
    props.$active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${(props) => (props.$active ? "#ffffff" : props.theme.colors.text)};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$active
        ? props.theme.colors.primaryHover
        : props.theme.colors.surfaceHover};
  }
`;

export const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${(props) => props.theme.colors.primary};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primaryHover};
  }
`;

export const TodoGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

export const TodoCard = styled(motion.div)<{ $completed: boolean }>`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  opacity: ${(props) => (props.$completed ? 0.7 : 1)};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.md};
  }
`;

export const TodoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 2px;
`;

export const TodoContent = styled.div`
  flex: 1;
`;

export const TodoTitle = styled.h3<{ $completed: boolean }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
  text-decoration: ${(props) => (props.$completed ? "line-through" : "none")};
`;

export const TodoDescription = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0 0 0.75rem 0;
`;

export const TodoMeta = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
`;

export const PriorityBadge = styled.span<{ $priority: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => {
    if (props.$priority === "high") return "#fee2e2";
    if (props.$priority === "medium") return "#fef3c7";
    return "#dbeafe";
  }};
  color: ${(props) => {
    if (props.$priority === "high") return "#991b1b";
    if (props.$priority === "medium") return "#92400e";
    return "#1e40af";
  }};
`;

export const CategoryBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  background: ${(props) => props.theme.colors.surfaceHover};
  color: ${(props) => props.theme.colors.textSecondary};
`;

export const DueDate = styled.span<{ $overdue: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  background: ${(props) =>
    props.$overdue ? "#fee2e2" : props.theme.colors.surfaceHover};
  color: ${(props) =>
    props.$overdue ? "#991b1b" : props.theme.colors.textSecondary};
`;

export const TodoActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`;

export const IconButton = styled.button`
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
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
    color: ${(props) => props.theme.colors.text};
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
  max-width: 500px;
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

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const FormSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;

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
`;
