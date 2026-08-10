// Canonical Printful credential resolution.
//
// HISTORY — why this file exists and must not be "simplified" back.
//
// The runtime once held a single custom secret named "Shopify & VibeFlex
// Studio" that actually carried the Printful token. To cope, the functions
// resolved the credential by scanning the environment for "the only secret
// that is longer than 20 characters and does not look like a Shopify token".
//
// That heuristic had a failure mode that is easy to miss and very hard to
// diagnose: it required EXACTLY ONE candidate. Adding an unrelated secret --
// AIRTABLE_TOKEN, SHOPIFY_CLIENT_ID, anything -- produced two candidates, the
// scan gave up, and Printful broke. Nothing about Printful had changed, so the
// blast radius pointed at the wrong system entirely.
//
// Resolution is now explicit: PRINTFUL_TOKEN or a clear, named failure.
// It does not infer the token from unrelated secrets and does not depend on
// how many other secrets exist. Do not reintroduce a fallback.

/** Stable, greppable error code surfaced to callers and logs. */
export const MISSING_PRINTFUL_TOKEN = "MISSING_PRINTFUL_TOKEN";

/** The one supported secret name. */
export const PRINTFUL_TOKEN_ENV = "PRINTFUL_TOKEN";

export class PrintfulTokenError extends Error {
  readonly code = MISSING_PRINTFUL_TOKEN;
  constructor() {
    super(
      `${MISSING_PRINTFUL_TOKEN}: secret "${PRINTFUL_TOKEN_ENV}" is not set on this ` +
        `Supabase project. Add it with scripts/fix-supabase-secrets.sh. ` +
        `Printful is never inferred from any other secret.`,
    );
    this.name = "PrintfulTokenError";
  }
}

export type EnvLike = { get(key: string): string | undefined };

/** Adapts a plain object so the resolver is testable outside Deno. */
export function envFromRecord(record: Record<string, string | undefined>): EnvLike {
  return { get: (key) => record[key] };
}

/**
 * Returns the Printful token, or throws PrintfulTokenError.
 *
 * Reads exactly one variable. Whitespace-only is treated as absent, because a
 * blank secret is a misconfiguration that would otherwise surface as an opaque
 * 401 from Printful.
 */
export function resolvePrintfulToken(env: EnvLike): string {
  const raw = env.get(PRINTFUL_TOKEN_ENV);
  if (raw === undefined || raw.trim() === "") throw new PrintfulTokenError();
  return raw.trim();
}
