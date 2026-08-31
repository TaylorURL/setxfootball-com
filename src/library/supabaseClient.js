// The one Supabase client for the app; the two services are its only importers.
//
// The module is fetched on the first call rather than with the page. The client
// and its auth, realtime and storage layers are about a third of the bundle,
// and a visitor reading about the camp never makes a query: `getSupabase`
// resolves the same instance every time, so the download happens once and only
// for somebody who signs in, signs up, or files a registration.
//
// No hardcoded fallbacks for the URL or key, because a default here is how live
// credentials end up committed. Missing configuration throws on the first call
// rather than returning a client that fails one query at a time.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

let pending = null;

export const getSupabase = () => {
  if (!pending) {
    if (!supabaseUrl || !supabaseKey) {
      return Promise.reject(
        new Error(
          "Missing required Supabase environment variables: " +
            "REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY must be set",
        ),
      );
    }
    pending = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(supabaseUrl, supabaseKey),
    );
  }
  return pending;
};
