import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MathProblem {
  id: string;
  user_id: string;
  problem_text: string;
  explanation_steps: Step[];
  created_at: string;
  expires_at: string;
}

export interface Step {
  title: string;
  content: string;
}
