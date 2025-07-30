export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
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
      check_session_conflict: {
        Args:
          | Record<PropertyKey, never>
          | {
              p_clinician_id: string
              p_proposed_start: string
              p_proposed_end: string
            }
        Returns: undefined
      }
      check_upcoming_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      sync_user_email: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
