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

// Whether this browser holds anything that could become a session.
//
// The client keeps its session under `sb-<project ref>-auth-token`, and the
// ref is the first label of the project host - the same derivation supabase-js
// makes, read from the same URL, so the two cannot disagree about where to
// look. A session too large for one entry is split across numbered keys beside
// it, and the PKCE verifier a confirmation link comes back to sits under the
// same prefix, so the prefix is what is matched rather than the exact key.
//
// A visitor with nothing under it cannot be signed in, and the whole client -
// auth, postgrest, realtime and storage - is what it would cost to be told so
// by the auth server. The implicit flow is the one case that arrives with a
// session and no key yet: it hands the tokens over in the URL, so a URL that
// carries them is answered the same way a stored key is.
export const hasStoredSession = () => {
  if (typeof window === "undefined" || !supabaseUrl) return false;

  let prefix;
  try {
    prefix = `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;
  } catch {
    return false;
  }

  const hash = window.location.hash || "";
  if (hash.includes("access_token=") || hash.includes("error_description=")) return true;
  if ((window.location.search || "").includes("code=")) return true;

  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(prefix)) return true;
    }
    return false;
  } catch {
    // Storage the browser refuses to open answers nothing either way, and a
    // reader wrongly treated as signed out is worse than a download nobody
    // needed, so the client is left to decide it.
    return true;
  }
};
