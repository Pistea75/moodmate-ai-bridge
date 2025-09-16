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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          metadata: Json | null
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          target_user_id?: string | null
        }
        Relationships: []
      }
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
      brodi_interactions: {
        Row: {
          context_data: Json | null
          created_at: string
          effectiveness_score: number | null
          id: string
          interaction_type: string
          message: string
          responded_at: string | null
          user_id: string
          user_response: string | null
        }
        Insert: {
          context_data?: Json | null
          created_at?: string
          effectiveness_score?: number | null
          id?: string
          interaction_type: string
          message: string
          responded_at?: string | null
          user_id: string
          user_response?: string | null
        }
        Update: {
          context_data?: Json | null
          created_at?: string
          effectiveness_score?: number | null
          id?: string
          interaction_type?: string
          message?: string
          responded_at?: string | null
          user_id?: string
          user_response?: string | null
        }
        Relationships: []
      }
      brodi_nudge_history: {
        Row: {
          actual_time: string | null
          context_score: number | null
          created_at: string
          id: string
          nudge_type: string
          scheduled_time: string
          success: boolean | null
          user_action: string | null
          user_id: string
        }
        Insert: {
          actual_time?: string | null
          context_score?: number | null
          created_at?: string
          id?: string
          nudge_type: string
          scheduled_time: string
          success?: boolean | null
          user_action?: string | null
          user_id: string
        }
        Update: {
          actual_time?: string | null
          context_score?: number | null
          created_at?: string
          id?: string
          nudge_type?: string
          scheduled_time?: string
          success?: boolean | null
          user_action?: string | null
          user_id?: string
        }
        Relationships: []
      }
      brodi_pattern_analysis: {
        Row: {
          analysis_data: Json
          confidence_score: number
          created_at: string
          id: string
          last_updated: string
          pattern_type: string
          user_id: string
        }
        Insert: {
          analysis_data: Json
          confidence_score: number
          created_at?: string
          id?: string
          last_updated?: string
          pattern_type: string
          user_id: string
        }
        Update: {
          analysis_data?: Json
          confidence_score?: number
          created_at?: string
          id?: string
          last_updated?: string
          pattern_type?: string
          user_id?: string
        }
        Relationships: []
      }
      brodi_user_preferences: {
        Row: {
          celebration_enabled: boolean
          created_at: string
          frequency_preference: string
          id: string
          interaction_style: string
          mood_reminders_enabled: boolean
          nudge_enabled: boolean
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          task_reminders_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          celebration_enabled?: boolean
          created_at?: string
          frequency_preference?: string
          id?: string
          interaction_style?: string
          mood_reminders_enabled?: boolean
          nudge_enabled?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          task_reminders_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          celebration_enabled?: boolean
          created_at?: string
          frequency_preference?: string
          id?: string
          interaction_style?: string
          mood_reminders_enabled?: boolean
          nudge_enabled?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          task_reminders_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      clinician_marketplace: {
        Row: {
          accepts_insurance: boolean | null
          bio: string | null
          created_at: string | null
          display_name: string
          experience_years: number | null
          hourly_rate: number | null
          id: string
          is_accepting_patients: boolean | null
          languages: string[] | null
          pricing_tier: string | null
          rating_average: number | null
          region: string | null
          specializations: string[] | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          accepts_insurance?: boolean | null
          bio?: string | null
          created_at?: string | null
          display_name: string
          experience_years?: number | null
          hourly_rate?: number | null
          id: string
          is_accepting_patients?: boolean | null
          languages?: string[] | null
          pricing_tier?: string | null
          rating_average?: number | null
          region?: string | null
          specializations?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          accepts_insurance?: boolean | null
          bio?: string | null
          created_at?: string | null
          display_name?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_accepting_patients?: boolean | null
          languages?: string[] | null
          pricing_tier?: string | null
          rating_average?: number | null
          region?: string | null
          specializations?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinician_marketplace_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "clinician_marketplace_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      csrf_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      enhanced_security_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource: string
          risk_score: number | null
          session_id: string | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource: string
          risk_score?: number | null
          session_id?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource?: string
          risk_score?: number | null
          session_id?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      invitation_rate_limits: {
        Row: {
          attempts: number | null
          blocked_until: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          updated_at: string | null
          window_start: string | null
        }
        Insert: {
          attempts?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          ip_address: unknown
          updated_at?: string | null
          window_start?: string | null
        }
        Update: {
          attempts?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          updated_at?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      invitation_validations: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          invitation_id: string | null
          ip_address: unknown | null
          user_agent: string | null
          validated_at: string | null
          validation_token: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string
          id?: string
          invitation_id?: string | null
          ip_address?: unknown | null
          user_agent?: string | null
          validated_at?: string | null
          validation_token: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          invitation_id?: string | null
          ip_address?: unknown | null
          user_agent?: string | null
          validated_at?: string | null
          validation_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitation_validations_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "patient_invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      invited_patients: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone_e164: string
          psychologist_id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone_e164: string
          psychologist_id: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone_e164?: string
          psychologist_id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
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
      notifications: {
        Row: {
          created_at: string
          description: string
          id: string
          is_read: boolean
          metadata: Json | null
          priority: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          priority?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          priority?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
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
      patient_invitations: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          patient_id: string
          psychologist_id: string
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          id?: string
          patient_id: string
          psychologist_id: string
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          patient_id?: string
          psychologist_id?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_invitations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "invited_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_risk_assessments: {
        Row: {
          ai_assessment: string | null
          assessed_at: string
          clinician_id: string
          created_at: string
          data_points: Json | null
          id: string
          patient_id: string
          risk_level: string
          risk_score: number
          updated_at: string
        }
        Insert: {
          ai_assessment?: string | null
          assessed_at?: string
          clinician_id: string
          created_at?: string
          data_points?: Json | null
          id?: string
          patient_id: string
          risk_level: string
          risk_score: number
          updated_at?: string
        }
        Update: {
          ai_assessment?: string | null
          assessed_at?: string
          clinician_id?: string
          created_at?: string
          data_points?: Json | null
          id?: string
          patient_id?: string
          risk_level?: string
          risk_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          id: string
          initial_assessment: string | null
          is_super_admin: boolean | null
          language: string | null
          last_active_at: string | null
          last_name: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          phone: string | null
          referral_code: string | null
          role: string
          status: string | null
          treatment_goals: string | null
          updated_at: string | null
          welcome_message: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id?: string
          initial_assessment?: string | null
          is_super_admin?: boolean | null
          language?: string | null
          last_active_at?: string | null
          last_name?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone?: string | null
          referral_code?: string | null
          role?: string
          status?: string | null
          treatment_goals?: string | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id?: string
          initial_assessment?: string | null
          is_super_admin?: boolean | null
          language?: string | null
          last_active_at?: string | null
          last_name?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          phone?: string | null
          referral_code?: string | null
          role?: string
          status?: string | null
          treatment_goals?: string | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      psychologist_points: {
        Row: {
          created_at: string
          id: string
          points_from_sessions: number | null
          points_from_workshops: number | null
          points_redeemed: number | null
          psychologist_id: string | null
          total_points: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_from_sessions?: number | null
          points_from_workshops?: number | null
          points_redeemed?: number | null
          psychologist_id?: string | null
          total_points?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          points_from_sessions?: number | null
          points_from_workshops?: number | null
          points_redeemed?: number | null
          psychologist_id?: string | null
          total_points?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      psychologist_profiles: {
        Row: {
          bio: string | null
          country: string | null
          created_at: string
          display_name: string
          experience_years: number | null
          hourly_rate: number | null
          id: string
          is_accepting_patients: boolean | null
          is_visible_marketplace: boolean | null
          languages: string[] | null
          region: string | null
          specializations: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          country?: string | null
          created_at?: string
          display_name: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_accepting_patients?: boolean | null
          is_visible_marketplace?: boolean | null
          languages?: string[] | null
          region?: string | null
          specializations?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          country?: string | null
          created_at?: string
          display_name?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_accepting_patients?: boolean | null
          is_visible_marketplace?: boolean | null
          languages?: string[] | null
          region?: string | null
          specializations?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      rate_limit_attempts: {
        Row: {
          action_type: string
          attempt_count: number
          blocked_until: string | null
          created_at: string | null
          id: string
          identifier: string
          updated_at: string | null
          window_start: string
        }
        Insert: {
          action_type: string
          attempt_count?: number
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier: string
          updated_at?: string | null
          window_start?: string
        }
        Update: {
          action_type?: string
          attempt_count?: number
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          updated_at?: string | null
          window_start?: string
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource: string
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource?: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_events_log: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_rate_limits: {
        Row: {
          action_type: string
          attempts: number
          blocked_until: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          window_start: string
        }
        Insert: {
          action_type: string
          attempts?: number
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          window_start?: string
        }
        Update: {
          action_type?: string
          attempts?: number
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          window_start?: string
        }
        Relationships: []
      }
      security_rate_limits_enhanced: {
        Row: {
          action_type: string
          attempts: number
          blocked_until: string | null
          created_at: string | null
          id: string
          identifier: string
          updated_at: string | null
          window_start: string
        }
        Insert: {
          action_type: string
          attempts?: number
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier: string
          updated_at?: string | null
          window_start?: string
        }
        Update: {
          action_type?: string
          attempts?: number
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          updated_at?: string | null
          window_start?: string
        }
        Relationships: []
      }
      sensitive_operations_log: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          operation: string
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          operation: string
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          operation?: string
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
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
      session_inquiries: {
        Row: {
          clinician_response: string | null
          created_at: string
          id: string
          patient_first_name: string
          patient_id: string
          patient_last_name: string
          patient_message: string
          preferred_date: string | null
          preferred_time_slot: string | null
          psychologist_id: string
          session_id: string | null
          session_topic: string
          status: string
          updated_at: string
        }
        Insert: {
          clinician_response?: string | null
          created_at?: string
          id?: string
          patient_first_name: string
          patient_id: string
          patient_last_name: string
          patient_message: string
          preferred_date?: string | null
          preferred_time_slot?: string | null
          psychologist_id: string
          session_id?: string | null
          session_topic: string
          status?: string
          updated_at?: string
        }
        Update: {
          clinician_response?: string | null
          created_at?: string
          id?: string
          patient_first_name?: string
          patient_id?: string
          patient_last_name?: string
          patient_message?: string
          preferred_date?: string | null
          preferred_time_slot?: string | null
          psychologist_id?: string
          session_id?: string | null
          session_topic?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      session_ratings: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          patient_id: string | null
          points_awarded: number | null
          psychologist_id: string | null
          rating: number | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          patient_id?: string | null
          points_awarded?: number | null
          psychologist_id?: string | null
          rating?: number | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          patient_id?: string | null
          points_awarded?: number | null
          psychologist_id?: string | null
          rating?: number | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_ratings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_recordings: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          file_path: string
          file_size: number | null
          id: string
          recording_ended_at: string | null
          recording_started_at: string | null
          session_id: string
          transcription_job_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          file_path: string
          file_size?: number | null
          id?: string
          recording_ended_at?: string | null
          recording_started_at?: string | null
          session_id: string
          transcription_job_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          file_path?: string
          file_size?: number | null
          id?: string
          recording_ended_at?: string | null
          recording_started_at?: string | null
          session_id?: string
          transcription_job_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_recordings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_templates: {
        Row: {
          clinician_id: string
          created_at: string
          default_notes: string | null
          description: string | null
          duration_minutes: number
          id: string
          name: string
          outcome_metrics: Json | null
          preparation_checklist: string[] | null
          session_type: string
          updated_at: string
        }
        Insert: {
          clinician_id: string
          created_at?: string
          default_notes?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          name: string
          outcome_metrics?: Json | null
          preparation_checklist?: string[] | null
          session_type?: string
          updated_at?: string
        }
        Update: {
          clinician_id?: string
          created_at?: string
          default_notes?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          outcome_metrics?: Json | null
          preparation_checklist?: string[] | null
          session_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          ai_report_id: string | null
          ai_report_status: string | null
          attendance_status: string | null
          clinician_id: string | null
          created_at: string | null
          duration_minutes: number
          homework_assigned: string | null
          id: string
          next_session_focus: string | null
          notes: string | null
          outcome_notes: string | null
          outcome_rating: number | null
          patient_id: string | null
          recording_enabled: boolean | null
          recording_file_path: string | null
          recording_status: string | null
          reminder_sent_at: string | null
          scheduled_time: string
          session_template_id: string | null
          session_type: string | null
          status: string | null
          timezone: string | null
          transcription_status: string | null
          transcription_text: string | null
          video_call_room_id: string | null
          video_call_url: string | null
        }
        Insert: {
          ai_report_id?: string | null
          ai_report_status?: string | null
          attendance_status?: string | null
          clinician_id?: string | null
          created_at?: string | null
          duration_minutes: number
          homework_assigned?: string | null
          id?: string
          next_session_focus?: string | null
          notes?: string | null
          outcome_notes?: string | null
          outcome_rating?: number | null
          patient_id?: string | null
          recording_enabled?: boolean | null
          recording_file_path?: string | null
          recording_status?: string | null
          reminder_sent_at?: string | null
          scheduled_time: string
          session_template_id?: string | null
          session_type?: string | null
          status?: string | null
          timezone?: string | null
          transcription_status?: string | null
          transcription_text?: string | null
          video_call_room_id?: string | null
          video_call_url?: string | null
        }
        Update: {
          ai_report_id?: string | null
          ai_report_status?: string | null
          attendance_status?: string | null
          clinician_id?: string | null
          created_at?: string | null
          duration_minutes?: number
          homework_assigned?: string | null
          id?: string
          next_session_focus?: string | null
          notes?: string | null
          outcome_notes?: string | null
          outcome_rating?: number | null
          patient_id?: string | null
          recording_enabled?: boolean | null
          recording_file_path?: string | null
          recording_status?: string | null
          reminder_sent_at?: string | null
          scheduled_time?: string
          session_template_id?: string | null
          session_type?: string | null
          status?: string | null
          timezone?: string | null
          transcription_status?: string | null
          transcription_text?: string | null
          video_call_room_id?: string | null
          video_call_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_ai_report_id_fkey"
            columns: ["ai_report_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_reports"
            referencedColumns: ["id"]
          },
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
          {
            foreignKeyName: "sessions_session_template_id_fkey"
            columns: ["session_template_id"]
            isOneToOne: false
            referencedRelation: "session_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          last_message_reset: string | null
          message_limit_daily: number | null
          messages_used_today: number | null
          patient_limit: number | null
          patients_active: number | null
          patients_sporadic: number | null
          plan_type: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_message_reset?: string | null
          message_limit_daily?: number | null
          messages_used_today?: number | null
          patient_limit?: number | null
          patients_active?: number | null
          patients_sporadic?: number | null
          plan_type?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_message_reset?: string | null
          message_limit_daily?: number | null
          messages_used_today?: number | null
          patient_limit?: number | null
          patients_active?: number | null
          patients_sporadic?: number | null
          plan_type?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
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
      voice_consent_logs: {
        Row: {
          consent_date: string
          consent_given: boolean
          created_at: string
          id: string
          user_id: string
          version: string
        }
        Insert: {
          consent_date?: string
          consent_given: boolean
          created_at?: string
          id?: string
          user_id: string
          version?: string
        }
        Update: {
          consent_date?: string
          consent_given?: boolean
          created_at?: string
          id?: string
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      voice_usage_logs: {
        Row: {
          cost_estimate: number | null
          created_at: string
          duration_seconds: number | null
          id: string
          language: string | null
          method: string | null
          transcript_length: number | null
          type: string
          user_id: string
        }
        Insert: {
          cost_estimate?: number | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          language?: string | null
          method?: string | null
          transcript_length?: number | null
          type: string
          user_id?: string
        }
        Update: {
          cost_estimate?: number | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          language?: string | null
          method?: string | null
          transcript_length?: number | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      waiting_list: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string | null
          status: string
          updated_at: string
          user_type: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message?: string | null
          status?: string
          updated_at?: string
          user_type?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string | null
          status?: string
          updated_at?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "waiting_list_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "clinician_referral_codes"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "waiting_list_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workshop_participants: {
        Row: {
          attended: boolean | null
          id: string
          participant_id: string | null
          registered_at: string
          workshop_id: string | null
        }
        Insert: {
          attended?: boolean | null
          id?: string
          participant_id?: string | null
          registered_at?: string
          workshop_id?: string | null
        }
        Update: {
          attended?: boolean | null
          id?: string
          participant_id?: string | null
          registered_at?: string
          workshop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workshop_participants_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshops: {
        Row: {
          created_at: string
          current_participants: number | null
          description: string | null
          duration_minutes: number | null
          host_psychologist_id: string | null
          id: string
          max_participants: number | null
          points_reward: number | null
          scheduled_date: string
          status: string | null
          title: string
          topic: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          duration_minutes?: number | null
          host_psychologist_id?: string | null
          id?: string
          max_participants?: number | null
          points_reward?: number | null
          scheduled_date: string
          status?: string | null
          title: string
          topic: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          duration_minutes?: number | null
          host_psychologist_id?: string | null
          id?: string
          max_participants?: number | null
          points_reward?: number | null
          scheduled_date?: string
          status?: string | null
          title?: string
          topic?: string
          updated_at?: string
          video_url?: string | null
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
      can_send_message: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      check_security_rate_limit: {
        Args: {
          p_action_type: string
          p_block_minutes?: number
          p_max_attempts?: number
          p_user_id: string
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_session_conflict: {
        Args:
          | Record<PropertyKey, never>
          | {
              p_clinician_id: string
              p_proposed_end: string
              p_proposed_start: string
            }
        Returns: boolean
      }
      check_upcoming_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      emergency_revoke_super_admin: {
        Args: { reason: string; target_user_id: string }
        Returns: boolean
      }
      generate_invitation_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_patient_mood_summaries: {
        Args: { clinician_uuid: string }
        Returns: {
          avg_mood: number
          first_name: string
          last_entry: string
          last_name: string
          patient_id: string
        }[]
      }
      is_current_user_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      normalize_phone_e164: {
        Args: { phone_input: string }
        Returns: string
      }
      reset_daily_message_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      secure_update_user_role: {
        Args: {
          new_role: string
          new_super_admin?: boolean
          target_user_id: string
        }
        Returns: boolean
      }
      sync_user_email: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_edge_function_input: {
        Args: {
          input_data: Json
          max_lengths?: Json
          required_fields: string[]
        }
        Returns: boolean
      }
      validate_invitation_code_secure: {
        Args: { invitation_code: string }
        Returns: Json
      }
      validate_invitation_secure: {
        Args: { p_code: string; p_ip_address?: unknown; p_user_agent?: string }
        Returns: Json
      }
      verify_super_admin_access: {
        Args: { action_description?: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "patient" | "clinician" | "admin" | "super_admin"
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
      user_role: ["patient", "clinician", "admin", "super_admin"],
    },
  },
} as const
