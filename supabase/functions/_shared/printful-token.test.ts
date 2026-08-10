import { describe, expect, it } from "vitest";
import {
  MISSING_PRINTFUL_TOKEN,
  PrintfulTokenError,
  envFromRecord,
  resolvePrintfulToken,
} from "./printful-token";

const TOKEN = "pf-token-value-that-is-long-enough-to-be-realistic";

describe("resolvePrintfulToken", () => {
  it("returns the token from PRINTFUL_TOKEN", () => {
    expect(resolvePrintfulToken(envFromRecord({ PRINTFUL_TOKEN: TOKEN }))).toBe(TOKEN);
  });

  it("trims surrounding whitespace", () => {
    expect(resolvePrintfulToken(envFromRecord({ PRINTFUL_TOKEN: `  ${TOKEN}\n` }))).toBe(TOKEN);
  });

  it("throws MISSING_PRINTFUL_TOKEN when unset", () => {
    expect(() => resolvePrintfulToken(envFromRecord({}))).toThrow(PrintfulTokenError);
    try {
      resolvePrintfulToken(envFromRecord({}));
    } catch (error) {
      expect((error as PrintfulTokenError).code).toBe(MISSING_PRINTFUL_TOKEN);
    }
  });

  it("treats a blank or whitespace-only secret as missing", () => {
    for (const value of ["", "   ", "\n\t"]) {
      expect(() => resolvePrintfulToken(envFromRecord({ PRINTFUL_TOKEN: value })))
        .toThrow(PrintfulTokenError);
    }
  });

  // The regression this module exists to prevent. The old heuristic scanned for
  // "the only non-Shopify secret" and broke the moment a second secret appeared.
  describe("independence from unrelated secrets", () => {
    it("is unaffected by adding AIRTABLE_TOKEN or SHOPIFY_CLIENT_ID", () => {
      const before = resolvePrintfulToken(envFromRecord({ PRINTFUL_TOKEN: TOKEN }));
      const after = resolvePrintfulToken(
        envFromRecord({
          PRINTFUL_TOKEN: TOKEN,
          AIRTABLE_TOKEN: "pat-airtable-value-long-enough",
          SHOPIFY_CLIENT_ID: "shopify-client-id-value-long-enough",
          SHOPIFY_CLIENT_SECRET: "shpss_secret_value_long_enough_here",
          OWNER_USER_ID: "00000000-0000-4000-8000-000000000000",
        }),
      );
      expect(after).toBe(before);
      expect(after).toBe(TOKEN);
    });

    it("stays stable as the secret count grows", () => {
      const record: Record<string, string> = { PRINTFUL_TOKEN: TOKEN };
      for (let i = 0; i < 25; i++) {
        record[`UNRELATED_SECRET_${i}`] = `unrelated-value-long-enough-${i}`;
        expect(resolvePrintfulToken(envFromRecord(record))).toBe(TOKEN);
      }
    });

    it("never infers Printful from another secret when PRINTFUL_TOKEN is absent", () => {
      // The old code would have happily returned the misnamed secret's value.
      expect(() =>
        resolvePrintfulToken(
          envFromRecord({
            "Shopify & VibeFlex Studio": TOKEN,
            AIRTABLE_TOKEN: "pat-airtable-value-long-enough",
          }),
        ),
      ).toThrow(PrintfulTokenError);
    });

    it("does not accept the legacy PRINTFUL_API_KEY name", () => {
      expect(() => resolvePrintfulToken(envFromRecord({ PRINTFUL_API_KEY: TOKEN })))
        .toThrow(PrintfulTokenError);
    });
  });
});
