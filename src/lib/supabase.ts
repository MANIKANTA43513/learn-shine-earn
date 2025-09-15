import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  passing_score: number
  created_at: string
}

export interface Question {
  id: string
  quiz_id: string
  question_text: string
  options: string[]
  correct_answer: number
  order_index: number
}

export interface Result {
  id: string
  user_id: string
  quiz_id: string
  score: number
  total_questions: number
  passed: boolean
  answers: number[]
  created_at: string
}