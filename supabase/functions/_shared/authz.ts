// Authorization for protected Studio operations.
//
// Separated from transport so the decision itself is unit-testable. The Edge
// Function verifies the caller's JWT with Supabase (signature, expiry, issuer)
// and passes the RESULT here. This module never parses a token and never trusts
// anything the client asserts about itself.
//
// Three independent conditions must all hold for a protected write:
//   1. the draft gate is enabled          (ALLOW_DRAFT_PRODUCT_CREATE=true)
//   2. the caller is genuinely authenticated (verified by Supabase, not decoded)
//   3. the caller matches the configured operator identity
//
// FUTURE SHAPE — deliberately left open. Today `resolveOperator` answers
// "is this the internal owner?" from environment config. The seam is the
// OperatorContext return value: swapping the body for a workspace/role lookup
// (user -> workspace -> role -> connected store -> permissions) changes this
// file only. Callers already treat the result as a context object rather than
// a boolean, so multi-tenancy does not require re-plumbing every call site.

export const AUTH_REQUIRED = "AUTH_REQUIRED";
export const NOT_AUTHORIZED = "NOT_AUTHORIZED";
export const DRAFT_GATE_DISABLED = "DRAFT_GATE_DISABLED";
export const OPERATOR_NOT_CONFIGURED = "OPERATOR_NOT_CONFIGURED";

export type AuthzCode =
  | typeof AUTH_REQUIRED
  | typeof NOT_AUTHORIZED
  | typeof DRAFT_GATE_DISABLED
  | typeof OPERATOR_NOT_CONFIGURED;

export class AuthzError extends Error {
  constructor(readonly code: AuthzCode, message: string) {
    super(message);
    this.name = "AuthzError";
  }
}

/** A caller whose token Supabase has already verified. */
export interface VerifiedUser {
  id: string;
  email?: string | null;
  role?: string | null;
}

/** What a permitted caller is allowed to be, today. Grows into tenancy later. */
export interface OperatorContext {
  userId: string;
  email: string | null;
  /** Fixed for now. Becomes a real lookup when workspaces land. */
  role: "owner";
  /** How the operator was matched -- useful for audit attribution. */
  matchedBy: "user_id" | "email";
}

export interface AuthzConfig {
  /** ALLOW_DRAFT_PRODUCT_CREATE === "true" */
  draftGateEnabled: boolean;
  /** Preferred, stable operator identity. */
  ownerUserId?: string | null;
  /**
   * Bootstrap identity, used only when ownerUserId is not yet known -- on a
   * fresh project the owner's UUID does not exist until their first sign-in.
   * This is SERVER-side configuration compared against a SERVER-verified token
   * claim. It is never an email supplied by the caller.
   */
  ownerEmail?: string | null;
}

const norm = (v?: string | null) => (v ?? "").trim().toLowerCase();

/**
 * Decides whether a verified caller may perform a protected write.
 * Throws AuthzError with a stable code; returns the operator context on success.
 */
export function authorizeProtectedWrite(
  user: VerifiedUser | null,
  config: AuthzConfig,
): OperatorContext {
  // Gate first: when writes are disabled nobody passes, and we avoid leaking
  // whether a given identity would otherwise have been accepted.
  if (!config.draftGateEnabled) {
    throw new AuthzError(
      DRAFT_GATE_DISABLED,
      "Shopify draft creation is disabled. Set ALLOW_DRAFT_PRODUCT_CREATE=true to enable it.",
    );
  }

  if (!user || !user.id) {
    throw new AuthzError(
      AUTH_REQUIRED,
      "Sign in required. This operation needs an authenticated Supabase session, not the anon key.",
    );
  }

  const ownerId = (config.ownerUserId ?? "").trim();
  const ownerEmail = norm(config.ownerEmail);

  if (!ownerId && !ownerEmail) {
    throw new AuthzError(
      OPERATOR_NOT_CONFIGURED,
      "No operator identity configured. Set OWNER_USER_ID (preferred) or OWNER_EMAIL.",
    );
  }

  // OWNER_USER_ID wins when present: a UUID is stable, an email is reassignable.
  if (ownerId) {
    if (user.id !== ownerId) {
      throw new AuthzError(NOT_AUTHORIZED, "This account is not an authorized operator.");
    }
    return { userId: user.id, email: user.email ?? null, role: "owner", matchedBy: "user_id" };
  }

  if (norm(user.email) !== ownerEmail) {
    throw new AuthzError(NOT_AUTHORIZED, "This account is not an authorized operator.");
  }
  return { userId: user.id, email: user.email ?? null, role: "owner", matchedBy: "email" };
}
