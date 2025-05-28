export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_chat_logs: {
        Row: {
          created_at: string | null
          id: string
          message: string
          patient_id: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          patient_id?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          patient_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ai_chat_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_reports: {
        Row: {
          chat_date: string | null
          clinician_id: string | null
          content: string | null
          created_at: string | null
          id: string
          patient_id: string | null
          pdf_url: string | null
          report_type: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          chat_date?: string | null
          clinician_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
          pdf_url?: string | null
          report_type?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          chat_date?: string | null
          clinician_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
          pdf_url?: string | null
          report_type?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_reports_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ai_chat_reports_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_chat_reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ai_chat_reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_patient_profiles: {
        Row: {
          clinician_id: string | null
          created_at: string | null
          id: string
          patient_id: string | null
          preferences: Json
        }
        Insert: {
          clinician_id?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
          preferences: Json
        }
        Update: {
          clinician_id?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
          preferences?: Json
        }
        Relationships: [
          {
            foreignKeyName: "ai_patient_profiles_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ai_patient_profiles_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_patient_profiles_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ai_patient_profiles_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_reports: {
        Row: {
          advice: string | null
          created_at: string | null
          id: string
          summary: string | null
          user_id: string | null
        }
        Insert: {
          advice?: string | null
          created_at?: string | null
          id?: string
          summary?: string | null
          user_id?: string | null
        }
        Update: {
          advice?: string | null
          created_at?: string | null
          id?: string
          summary?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_logs: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          exercise_text: string
          id: string
          patient_id: string | null
          recommended_at: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          exercise_text: string
          id?: string
          patient_id?: string | null
          recommended_at?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          exercise_text?: string
          id?: string
          patient_id?: string | null
          recommended_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "exercise_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_entries: {
        Row: {
          created_at: string | null
          id: string
          mood_score: number
          notes: string | null
          patient_id: string
          triggers: string[] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mood_score: number
          notes?: string | null
          patient_id: string
          triggers?: string[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mood_score?: number
          notes?: string | null
          patient_id?: string
          triggers?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "mood_entries_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mood_entries_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_clinician_links: {
        Row: {
          clinician_id: string | null
          created_at: string | null
          id: string
          patient_id: string | null
        }
        Insert: {
          clinician_id?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
        }
        Update: {
          clinician_id?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          language: string | null
          last_name: string | null
          referral_code: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          language?: string | null
          last_name?: string | null
          referral_code?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          language?: string | null
          last_name?: string | null
          referral_code?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      session_audio_uploads: {
        Row: {
          file_path: string | null
          id: string
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          file_path?: string | null
          id?: string
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          file_path?: string | null
          id?: string
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_audio_uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          clinician_id: string | null
          created_at: string | null
          duration_minutes: number
          id: string
          notes: string | null
          patient_id: string | null
          scheduled_time: string
          status: string | null
          timezone: string | null
        }
        Insert: {
          clinician_id?: string | null
          created_at?: string | null
          duration_minutes: number
          id?: string
          notes?: string | null
          patient_id?: string | null
          scheduled_time: string
          status?: string | null
          timezone?: string | null
        }
        Update: {
          clinician_id?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          patient_id?: string | null
          scheduled_time?: string
          status?: string | null
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sessions_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sessions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          clinician_id: string | null
          completed: boolean | null
          description: string | null
          due_date: string | null
          id: string
          inserted_at: string | null
          patient_id: string | null
          title: string
        }
        Insert: {
          clinician_id?: string | null
          completed?: boolean | null
          description?: string | null
          due_date?: string | null
          id?: string
          inserted_at?: string | null
          patient_id?: string | null
          title: string
        }
        Update: {
          clinician_id?: string | null
          completed?: boolean | null
          description?: string | null
          due_date?: string | null
          id?: string
          inserted_at?: string | null
          patient_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string | null
          id: string
          language: string | null
          name: string | null
          role: string | null
        }
        Insert: {
          email?: string | null
          id?: string
          language?: string | null
          name?: string | null
          role?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          language?: string | null
          name?: string | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      clinician_referral_codes: {
        Row: {
          referral_code: string | null
          user_id: string | null
        }
        Insert: {
          referral_code?: string | null
          user_id?: string | null
        }
        Update: {
          referral_code?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_patient_mood_summaries: {
        Args: { clinician_uuid: string }
        Returns: {
          patient_id: string
          first_name: string
          last_name: string
          avg_mood: number
          last_entry: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
