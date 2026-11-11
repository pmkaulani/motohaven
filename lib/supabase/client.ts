import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dfswwtrwoyqzirmyeqht.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_9TJ8Ion_pahnxABDgiV7Dg_gzvVUL57";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
