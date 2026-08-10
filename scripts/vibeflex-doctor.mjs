#!/usr/bin/env node
// VibeFlex POD Studio — configuration and integration health check.
//
// Verifies the non-secret configuration the Studio depends on, and reports
// which backend secrets exist BY NAME.
//
// This script never reads, prints, logs, or returns a secret value. The only
// question it ever asks about a secret is "does something with this name
// exist", and the only answer it records is yes or no. Keep it that way.
//
//   node scripts/vibeflex-doctor.mjs
//   node scripts/vibeflex-doctor.mjs --json

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const asJson = process.argv.includes("--json");

// Verified against the live connected systems. See CLAUDE.md.
const CANONICAL = {
  SHOPIFY_API_DOMAIN: "hbipmy-3g.myshopify.com",
  SHOPIFY_PUBLIC_DOMAIN: "vibeflex-813.myshopify.com",
  AIRTABLE_BASE_ID: "appuaF1jfeBr2PPqn",
  SUPABASE_PROJECT_REF: "uluyuqrikzicapnezmqd",
  SUPABASE_PUBLIC_URL: "https://uluyuqrikzicapnezmqd.supabase.co",
  VIBEFLEX_INTERNAL_TENANT: "490-movement",
};

// Named here so a missing secret is reported precisely rather than surfacing
// as an opaque 500 from an Edge Function.
const BACKEND_SECRETS = [
  { name: "PRINTFUL_TOKEN", consumer: "integrations, pod-studio-verify-product, printful-*" },
  { name: "SHOPIFY_CLIENT_ID", consumer: "integrations (Admin OAuth)" },
  { name: "SHOPIFY_CLIENT_SECRET", consumer: "integrations (Admin OAuth)" },
  { name: "AIRTABLE_TOKEN", consumer: "integrations" },
  { name: "OWNER_USER_ID", consumer: "owner gate on Shopify writes" },
];

const results = [];
const record = (level, area, message) => results.push({ level, area, message });

// ---------- non-secret config ----------
let studioConfig = "";
try {
  studioConfig = readFileSync(join(root, "vibeflex-studio-pages/config.js"), "utf8");
} catch {
  record("fail", "config", "vibeflex-studio-pages/config.js is missing.");
}

if (studioConfig) {
  for (const [key, expected] of Object.entries({
    SUPABASE_PUBLIC_URL: CANONICAL.SUPABASE_PUBLIC_URL,
    SHOPIFY_API_DOMAIN: CANONICAL.SHOPIFY_API_DOMAIN,
    SHOPIFY_PUBLIC_DOMAIN: CANONICAL.SHOPIFY_PUBLIC_DOMAIN,
  })) {
    if (studioConfig.includes(expected)) {
      record("ok", "config", `${key} matches the canonical value.`);
    } else {
      record("fail", "config", `${key} does not match the canonical value (${expected}).`);
    }
  }

  // The Studio previously pointed at a Supabase project that does not exist in
  // the owner's organization, which made every Studio action fail. Guard it.
  const ref = studioConfig.match(/https:\/\/([a-z0-9]{20})\.supabase\.co/);
  if (ref && ref[1] !== CANONICAL.SUPABASE_PROJECT_REF) {
    record(
      "fail",
      "config",
      `Studio points at Supabase project ${ref[1]}, not the canonical ` +
        `${CANONICAL.SUPABASE_PROJECT_REF}. Requests will go nowhere useful.`,
    );
  }

  if (/(shpat|shpca|shppa|shpss)_/.test(studioConfig)) {
    record("fail", "security", "A Shopify access token appears in browser config. Remove it.");
  } else {
    record("ok", "security", "No Shopify access token in browser config.");
  }
}

// ---------- secret NAMES only ----------
// Presence is asserted from the environment when the check runs somewhere that
// has it. Values are never read: `in` tests for the key, not the value.
for (const { name, consumer } of BACKEND_SECRETS) {
  const present = name in process.env;
  record(
    present ? "ok" : "warn",
    "secret",
    `${name}: ${present ? "present" : "not visible here"} — required by ${consumer}. ` +
      `Canonical store: Supabase secrets on ${CANONICAL.SUPABASE_PROJECT_REF}.`,
  );
}

record(
  "warn",
  "secret",
  "Known defect: the project's single custom secret is named " +
    '"Shopify & VibeFlex Studio" but carries the Printful token. Functions fall ' +
    "back to picking the only non-Shopify secret, which BREAKS as soon as a " +
    "second custom secret is added. Re-add it as PRINTFUL_TOKEN first.",
);

// ---------- report ----------
if (asJson) {
  console.log(JSON.stringify({ canonical: CANONICAL, results }, null, 2));
} else {
  const icon = { ok: "PASS", warn: "WARN", fail: "FAIL" };
  for (const r of results) console.log(`[${icon[r.level]}] ${r.area}: ${r.message}`);
  const failed = results.filter((r) => r.level === "fail").length;
  console.log(
    failed ? `\n${failed} check(s) failed.` : "\nAll non-secret configuration checks passed.",
  );
}

process.exit(results.some((r) => r.level === "fail") ? 1 : 0);
