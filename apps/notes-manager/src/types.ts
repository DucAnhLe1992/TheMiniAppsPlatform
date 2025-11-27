export interface Note {
  id: string;
  title: string;
  content: string;
  content_type: "note" | "code" | "markdown";
  language: string | null;
  category: string | null;
  tags: string[];
  is_favorite: boolean;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export type ViewMode = "grid" | "list";
export type FilterType = "all" | "favorites" | "notes" | "code" | "markdown";

export const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];
export interface NotesManagerProps {
  initialFolder?: string;
}
