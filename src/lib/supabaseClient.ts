import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Indicar si Supabase está completamente configurado con variables de entorno
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Crear el cliente de Supabase (o nulo si no está configurado)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
