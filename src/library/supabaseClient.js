/**
 * @module supabaseClient
 * @description Initializes and exports the Supabase client instance.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  "https://mdxydyeqtoffsepvxqmg.supabase.co";
const supabaseKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  "sb_publishable_9oom7UDUMmJ2RNKIzpM86w_XMM-c5QS";

export const supabase = createClient(supabaseUrl, supabaseKey);
