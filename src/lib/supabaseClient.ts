import { createClient } from '@supabase/supabase-js'

// ⚡ Hardcoded Supabase config here
const supabaseUrl = 'https://otrhbyzjrhsqrltdedon.supabase.co' // 🔥 YOUR PROJECT URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cmhieXpqcmhzcXJsdGRlZG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDA1NDgsImV4cCI6MjA2MTA3NjU0OH0.fYYYcmUDiG7GYVy_zH0xKyo1JGDqxrAVWfCD_pptkhU' // 🔥 YOUR ANON KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
