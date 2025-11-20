export interface App {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  is_active: boolean;
  entry_point: string;
  created_at: string;
  updated_at: string;
}

export interface UserAppData {
  id: string;
  user_id: string;
  app_id: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: string;
  favorite_apps: string[];
  created_at: string;
  updated_at: string;
}
