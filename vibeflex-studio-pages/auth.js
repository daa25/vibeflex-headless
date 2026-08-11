// VibeFlex Studio — Supabase Auth.
//
// This is the Studio's identity layer. It exists so protected operations stop
// travelling on the anon key: the Edge Function needs a real authenticated
// subject to authorize against, and the anon JWT has role "anon", which no
// operator gate can ever accept.
//
// Only the publishable anon key is used here. Service-role credentials must
// never reach the browser -- the anon key grants nothing on its own; the
// session JWT it mints is what carries identity.
//
// Method: email magic link (OTP). Chosen over passwords because the Studio is a
// static GitHub Pages app with no server to run a password reset flow, and a
// magic link needs no secret stored anywhere on the client.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const config = window.VIBEFLEX_CONFIG || {};

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    persistSession: true,      // survives reload -- see restoreSession()
    autoRefreshToken: true,    // keeps long Studio sessions from expiring mid-run
    detectSessionInUrl: true,  // consumes the magic-link fragment on return
  },
});

const listeners = new Set();
let current = { status: "loading", user: null, error: null };

function emit(next) {
  current = { ...current, ...next };
  for (const fn of listeners) fn(current);
}

/** Subscribe to auth state. Fires immediately with the current state. */
export function onAuthState(fn) {
  listeners.add(fn);
  fn(current);
  return () => listeners.delete(fn);
}

export function getState() {
  return current;
}

/**
 * Returns the access token for the CURRENT session, or null.
 * Always read through this rather than caching -- the client refreshes tokens
 * in the background and a stale copy will start failing verification.
 */
export async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token ?? null;
}

export async function signInWithEmail(email) {
  const address = (email || "").trim();
  if (!address) throw new Error("Enter the operator email address.");
  emit({ status: "sending", error: null });

  // Return to the Studio itself; the magic link carries the session in the URL
  // fragment, which detectSessionInUrl consumes on load.
  const emailRedirectTo = window.location.origin + window.location.pathname;
  const { error } = await supabase.auth.signInWithOtp({
    email: address,
    options: { emailRedirectTo },
  });

  if (error) {
    emit({ status: "signed_out", error: error.message });
    throw error;
  }
  emit({ status: "link_sent", error: null });
  return { emailRedirectTo };
}

export async function signOut() {
  await supabase.auth.signOut();
  emit({ status: "signed_out", user: null, error: null });
}

/** Restores any persisted session on boot and keeps state in sync afterwards. */
export async function restoreSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    emit({ status: "signed_out", user: null, error: error.message });
  } else {
    emit({
      status: data?.session ? "signed_in" : "signed_out",
      user: data?.session?.user ?? null,
      error: null,
    });
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    emit({
      status: session ? "signed_in" : "signed_out",
      user: session?.user ?? null,
      error: null,
    });
  });

  // A magic-link return leaves tokens in the URL fragment. Clear it so the
  // session is not re-parsed on reload and does not sit in the address bar.
  if (window.location.hash.includes("access_token")) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  return current;
}
