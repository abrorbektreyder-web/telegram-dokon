import { createClient } from '@supabase/supabase-js'

// Bu ma'lumotlarni siz o'zingizning Supabase loyihangizdan olasiz
// Hozircha placeholder sifatida qoldiramiz
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
