export interface ShoppingList {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: string;
  list_id: string;
  name: string;
  quantity: string | null;
  category: string | null;
  notes: string | null;
  is_checked: boolean;
  checked_by: string | null;
  checked_at: string | null;
  added_by: string;
  created_at: string;
  updated_at: string;
}

export interface Collaborator {
  id: string;
  list_id: string;
  user_id: string;
  role: "editor" | "viewer";
  invited_by: string;
  invited_at: string;
}

export const CATEGORIES = [
  "Produce",
  "Dairy",
  "Meat",
  "Bakery",
  "Pantry",
  "Frozen",
  "Beverages",
  "Snacks",
  "Other",
] as const;
