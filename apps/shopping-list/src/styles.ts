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

export const TopControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
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

export const ListsGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  position: sticky;
  top: 2rem;

  @media (max-width: 1024px) {
    position: static;
  }
`;

export const SidebarTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 1rem 0;
`;

export const ListsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ListItem = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1rem;
  background: ${(props) =>
    props.$active ? `${props.theme.colors.primary}15` : "transparent"};
  border: 1px solid
    ${(props) =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  color: ${(props) => props.theme.colors.text};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
  }
`;

export const ListName = styled.div`
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SharedBadge = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: ${(props) => props.theme.colors.primary};
  color: #ffffff;
  border-radius: 4px;
  margin-left: 0.5rem;
`;

export const MainContent = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  min-height: 400px;
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const ContentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0;
  flex: 1;
`;

export const ContentActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const IconButton = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
  }
`;

export const AddItemForm = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  flex: 1;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const Select = styled.select`
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

export const SmallButton = styled.button`
  padding: 0.75rem 1.25rem;
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

export const ItemsByCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const CategorySection = styled.div``;

export const CategoryTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${(props) => props.theme.colors.border};
`;

export const ItemsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Item = styled(motion.div)<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  opacity: ${(props) => (props.$checked ? 0.6 : 1)};
  transition: opacity 0.2s ease;
`;

export const Checkbox = styled.button<{ $checked: boolean }>`
  width: 24px;
  height: 24px;
  border: 2px solid
    ${(props) =>
      props.$checked ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 6px;
  background: ${(props) =>
    props.$checked ? props.theme.colors.primary : "transparent"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1rem;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ItemName = styled.div<{ $checked: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  text-decoration: ${(props) => (props.$checked ? "line-through" : "none")};
`;

export const ItemDetails = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const DeleteButton = styled.button`
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #fee;
    color: #ef4444;
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

export const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  min-height: 100px;
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

export const ProgressBar = styled.div`
  margin-bottom: 2rem;
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

export const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${(props) => props.theme.colors.primary};
  border-radius: 4px;
`;
