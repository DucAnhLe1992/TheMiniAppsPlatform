export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      apps: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          icon: string
          category: string
          is_active: boolean
          entry_point: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          icon?: string
          category: string
          is_active?: boolean
          entry_point: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          icon?: string
          category?: string
          is_active?: boolean
          entry_point?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_app_data: {
        Row: {
          id: string
          user_id: string
          app_id: string
          data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          app_id: string
          data: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          app_id?: string
          data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: string
          favorite_apps: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          favorite_apps?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          favorite_apps?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
