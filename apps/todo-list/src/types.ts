export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export type FilterType = "all" | "active" | "completed";
export type SortType = "created" | "due_date" | "priority";
