export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      access_grants: {
        Row: {
          created_at: string
          expires_at: string
          granted_to_producer_id: string
          id: string
          nda_accepted: boolean | null
          script_id: string
          token: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          granted_to_producer_id: string
          id?: string
          nda_accepted?: boolean | null
          script_id: string
          token: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          granted_to_producer_id?: string
          id?: string
          nda_accepted?: boolean | null
          script_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_grants_granted_to_producer_id_fkey"
            columns: ["granted_to_producer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_grants_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          created_at: string
          id: string
          provider_room_id: string | null
          recording_key: string | null
          starts_at: string
          status: Database["public"]["Enums"]["call_status"] | null
          summary: Json | null
          thread_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          provider_room_id?: string | null
          recording_key?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["call_status"] | null
          summary?: Json | null
          thread_id: string
        }
        Update: {
          created_at?: string
          id?: string
          provider_room_id?: string | null
          recording_key?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["call_status"] | null
          summary?: Json | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_items: {
        Row: {
          added_at: string
          collection_id: string
          id: string
          script_id: string
        }
        Insert: {
          added_at?: string
          collection_id: string
          id?: string
          script_id: string
        }
        Update: {
          added_at?: string
          collection_id?: string
          id?: string
          script_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          producer_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          producer_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          producer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_logs: {
        Row: {
          created_at: string
          id: string
          meta: Json | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          meta?: Json | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          meta?: Json | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          id: string
          producer_id: string
          reason: Json | null
          score: number | null
          script_id: string | null
          state: Database["public"]["Enums"]["match_state"] | null
          updated_at: string
          writer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          producer_id: string
          reason?: Json | null
          score?: number | null
          script_id?: string | null
          state?: Database["public"]["Enums"]["match_state"] | null
          updated_at?: string
          writer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          producer_id?: string
          reason?: Json | null
          score?: number | null
          script_id?: string | null
          state?: Database["public"]["Enums"]["match_state"] | null
          updated_at?: string
          writer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_writer_id_fkey"
            columns: ["writer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          created_at: string
          id: string
          last_message_at: string
          producer_id: string
          writer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string
          producer_id: string
          writer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string
          producer_id?: string
          writer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_writer_id_fkey"
            columns: ["writer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string | null
          created_at: string
          file_key: string | null
          id: string
          sender_id: string
          thread_id: string
          type: Database["public"]["Enums"]["message_type"] | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          file_key?: string | null
          id?: string
          sender_id: string
          thread_id: string
          type?: Database["public"]["Enums"]["message_type"] | null
        }
        Update: {
          body?: string | null
          created_at?: string
          file_key?: string | null
          id?: string
          sender_id?: string
          thread_id?: string
          type?: Database["public"]["Enums"]["message_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      producer_profiles: {
        Row: {
          bio: string | null
          created_at: string
          genres: string[] | null
          studio_name: string | null
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          genres?: string[] | null
          studio_name?: string | null
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          genres?: string[] | null
          studio_name?: string | null
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "producer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      scripts: {
        Row: {
          cover_url: string | null
          created_at: string
          drm_hash: string | null
          genre: string | null
          id: string
          logline: string | null
          page_count: number | null
          status: Database["public"]["Enums"]["script_status"] | null
          storage_key: string | null
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["script_visibility"] | null
          writer_id: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          drm_hash?: string | null
          genre?: string | null
          id?: string
          logline?: string | null
          page_count?: number | null
          status?: Database["public"]["Enums"]["script_status"] | null
          storage_key?: string | null
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["script_visibility"] | null
          writer_id: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          drm_hash?: string | null
          genre?: string | null
          id?: string
          logline?: string | null
          page_count?: number | null
          status?: Database["public"]["Enums"]["script_status"] | null
          storage_key?: string | null
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["script_visibility"] | null
          writer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripts_writer_id_fkey"
            columns: ["writer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      video_pitches: {
        Row: {
          caption_key: string | null
          created_at: string
          duration_sec: number | null
          id: string
          script_id: string | null
          storage_key: string
          title: string
          writer_id: string
        }
        Insert: {
          caption_key?: string | null
          created_at?: string
          duration_sec?: number | null
          id?: string
          script_id?: string | null
          storage_key: string
          title: string
          writer_id: string
        }
        Update: {
          caption_key?: string | null
          created_at?: string
          duration_sec?: number | null
          id?: string
          script_id?: string | null
          storage_key?: string
          title?: string
          writer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_pitches_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_pitches_writer_id_fkey"
            columns: ["writer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      writer_profiles: {
        Row: {
          bio: string | null
          created_at: string
          genres: string[] | null
          links: Json | null
          trust_score: number | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          genres?: string[] | null
          links?: Json | null
          trust_score?: number | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          genres?: string[] | null
          links?: Json | null
          trust_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "writer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "writer" | "producer"
      call_status: "scheduled" | "live" | "ended"
      match_state: "suggested" | "liked" | "connected" | "blocked"
      message_type: "text" | "file" | "system"
      script_status: "concept" | "draft" | "final"
      script_visibility: "private" | "protected" | "public"
      verification_status: "unverified" | "pending" | "verified"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["writer", "producer"],
      call_status: ["scheduled", "live", "ended"],
      match_state: ["suggested", "liked", "connected", "blocked"],
      message_type: ["text", "file", "system"],
      script_status: ["concept", "draft", "final"],
      script_visibility: ["private", "protected", "public"],
      verification_status: ["unverified", "pending", "verified"],
    },
  },
} as const
