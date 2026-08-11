import { describe, expect, it } from "vitest";
import {
  AUTH_REQUIRED,
  AuthzError,
  DRAFT_GATE_DISABLED,
  NOT_AUTHORIZED,
  OPERATOR_NOT_CONFIGURED,
  authorizeProtectedWrite,
} from "./authz";

const OWNER_ID = "11111111-1111-4111-8111-111111111111";
const OTHER_ID = "22222222-2222-4222-8222-222222222222";
const OWNER_EMAIL = "490.movement@gmail.com";

const owner = { id: OWNER_ID, email: OWNER_EMAIL, role: "authenticated" };
const other = { id: OTHER_ID, email: "someone.else@example.com", role: "authenticated" };
const open = { draftGateEnabled: true, ownerUserId: OWNER_ID };

function codeOf(fn: () => unknown): string {
  try { fn(); return "NO_THROW"; } catch (e) { return (e as AuthzError).code; }
}

describe("authorizeProtectedWrite", () => {
  it("ALLOWS the authenticated owner when the draft gate is true", () => {
    const ctx = authorizeProtectedWrite(owner, open);
    expect(ctx).toMatchObject({ userId: OWNER_ID, role: "owner", matchedBy: "user_id" });
  });

  it("DENIES an unauthenticated caller", () => {
    expect(codeOf(() => authorizeProtectedWrite(null, open))).toBe(AUTH_REQUIRED);
  });

  it("DENIES an authenticated but different user", () => {
    expect(codeOf(() => authorizeProtectedWrite(other, open))).toBe(NOT_AUTHORIZED);
  });

  it("DENIES the owner when the draft gate is false", () => {
    expect(codeOf(() => authorizeProtectedWrite(owner, { ...open, draftGateEnabled: false })))
      .toBe(DRAFT_GATE_DISABLED);
  });

  it("checks the gate before identity, so a closed gate leaks nothing", () => {
    // A wrong user against a closed gate must report the gate, not NOT_AUTHORIZED --
    // otherwise the error distinguishes valid from invalid identities.
    expect(codeOf(() => authorizeProtectedWrite(other, { ...open, draftGateEnabled: false })))
      .toBe(DRAFT_GATE_DISABLED);
  });

  it("DENIES when no operator identity is configured", () => {
    expect(codeOf(() => authorizeProtectedWrite(owner, { draftGateEnabled: true })))
      .toBe(OPERATOR_NOT_CONFIGURED);
    expect(codeOf(() => authorizeProtectedWrite(owner,
      { draftGateEnabled: true, ownerUserId: "  ", ownerEmail: "" })))
      .toBe(OPERATOR_NOT_CONFIGURED);
  });

  describe("email bootstrap (before the owner UUID is known)", () => {
    const byEmail = { draftGateEnabled: true, ownerEmail: OWNER_EMAIL };

    it("ALLOWS a verified email match and records how it matched", () => {
      const ctx = authorizeProtectedWrite(owner, byEmail);
      expect(ctx).toMatchObject({ userId: OWNER_ID, role: "owner", matchedBy: "email" });
    });

    it("is case- and whitespace-insensitive on email", () => {
      const ctx = authorizeProtectedWrite(
        { id: OWNER_ID, email: "  490.Movement@Gmail.COM " },
        byEmail,
      );
      expect(ctx.matchedBy).toBe("email");
    });

    it("DENIES a different email", () => {
      expect(codeOf(() => authorizeProtectedWrite(other, byEmail))).toBe(NOT_AUTHORIZED);
    });

    it("DENIES a user with no email", () => {
      expect(codeOf(() => authorizeProtectedWrite({ id: OWNER_ID, email: null }, byEmail)))
        .toBe(NOT_AUTHORIZED);
    });

    it("prefers OWNER_USER_ID over OWNER_EMAIL once both are set", () => {
      // Someone who matches the email but not the configured UUID must be denied,
      // otherwise the weaker bootstrap check would silently outlive its purpose.
      const both = { draftGateEnabled: true, ownerUserId: OWNER_ID, ownerEmail: OWNER_EMAIL };
      expect(codeOf(() => authorizeProtectedWrite({ id: OTHER_ID, email: OWNER_EMAIL }, both)))
        .toBe(NOT_AUTHORIZED);
      expect(authorizeProtectedWrite(owner, both).matchedBy).toBe("user_id");
    });
  });

  it("never authorizes on a caller-asserted role alone", () => {
    // A token claiming role "service_role" but belonging to the wrong user is
    // still just the wrong user.
    expect(codeOf(() => authorizeProtectedWrite(
      { id: OTHER_ID, email: OWNER_EMAIL, role: "service_role" }, open,
    ))).toBe(NOT_AUTHORIZED);
  });
});
