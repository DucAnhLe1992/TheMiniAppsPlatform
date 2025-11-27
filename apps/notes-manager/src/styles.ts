import styled from "styled-components";
import { motion } from "framer-motion";
import { ViewMode } from "./types";

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
  flex-wrap: wrap;
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

export const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ViewButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) =>
    props.$active ? props.theme.colors.surface : "transparent"};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
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

export const NotesGrid = styled.div<{ $viewMode: ViewMode }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$viewMode === "grid"
      ? "repeat(auto-fill, minmax(300px, 1fr))"
      : "1fr"};
  gap: 1rem;
`;

export const NoteCard = styled(motion.div)<{ $color?: string }>`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-left: 4px solid
    ${(props) => props.$color || props.theme.colors.primary};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.md};
    transform: translateY(-2px);
  }
`;

export const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const NoteTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FavoriteButton = styled.button<{ $isFavorite: boolean }>`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  margin-left: 0.5rem;
  opacity: ${(props) => (props.$isFavorite ? 1 : 0.3)};
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.2);
  }
`;

export const NoteContent = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0 0 1rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.5;
`;

export const CodePreview = styled.pre`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0 0 1rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  background: ${(props) => props.theme.colors.background};
  padding: 0.75rem;
  border-radius: 6px;
  font-family: "Monaco", "Courier New", monospace;
`;

export const NoteMeta = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

export const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => props.theme.colors.surfaceHover};
  color: ${(props) => props.theme.colors.textSecondary};
`;

export const TypeBadge = styled(Badge)<{ $type: string }>`
  background: ${(props) => {
    if (props.$type === "code") return "#dbeafe";
    if (props.$type === "markdown") return "#fef3c7";
    return "#dcfce7";
  }};
  color: ${(props) => {
    if (props.$type === "code") return "#1e40af";
    if (props.$type === "markdown") return "#92400e";
    return "#166534";
  }};
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
  overflow-y: auto;
`;

export const ModalContent = styled(motion.div)`
  background: ${(props) => props.theme.colors.surface};
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
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
  min-height: 200px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const CodeTextarea = styled(Textarea)`
  font-family: "Monaco", "Courier New", monospace;
  font-size: 0.875rem;
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

export const ColorPicker = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const ColorOption = styled.button<{
  $color: string;
  $selected: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(props) => props.$color};
  border: 2px solid
    ${(props) => (props.$selected ? props.theme.colors.text : "transparent")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  min-height: 50px;
`;

export const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background: ${(props) => props.theme.colors.primary};
  color: #ffffff;
  border-radius: 6px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TagRemove = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;

  &:hover {
    opacity: 0.7;
  }
`;

export const TagInputField = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  min-width: 100px;

  &:focus {
    outline: none;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const Button = styled.button<{
  $variant?: "primary" | "secondary" | "danger";
}>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => {
    if (props.$variant === "danger") return "#ef4444";
    if (props.$variant === "primary") return props.theme.colors.primary;
    return props.theme.colors.surface;
  }};
  color: ${(props) =>
    props.$variant === "primary" || props.$variant === "danger"
      ? "#ffffff"
      : props.theme.colors.text};
  border: ${(props) =>
    props.$variant === "secondary"
      ? `1px solid ${props.theme.colors.border}`
      : "none"};

  &:hover {
    background: ${(props) => {
      if (props.$variant === "danger") return "#dc2626";
      if (props.$variant === "primary") return props.theme.colors.primaryHover;
      return props.theme.colors.surfaceHover;
    }};
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
