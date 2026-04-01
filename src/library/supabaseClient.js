/**
 * @module supabaseClient
 * @description Initializes and exports the Supabase client instance.
 * Credentials must be provided via environment variables — no fallback values
 * are permitted to prevent accidental exposure of live credentials in source.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing required Supabase environment variables: " +
      "REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY must be set",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
