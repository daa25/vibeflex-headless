#!/usr/bin/env bash
#
# VibeFlex POD Studio — one-shot Supabase secret correction.
#
# Fixes the credential state on the canonical runtime:
#
#   1. Adds PRINTFUL_TOKEN under its correct name.
#   2. Adds the missing Shopify + Airtable secrets.
#   3. Deletes the misnamed "Shopify & VibeFlex Studio" secret.
#   4. Verifies the result by NAME only.
#
# WHY THE ORDER IS NOT NEGOTIABLE
# -------------------------------
# The project currently holds exactly ONE custom secret. It is named
# "Shopify & VibeFlex Studio" but it actually carries the Printful token.
# The Edge Functions cope with that by falling back to "use the only
# non-Shopify secret present".
#
# That fallback requires EXACTLY ONE candidate. The moment you add
# SHOPIFY_CLIENT_ID or AIRTABLE_TOKEN, there are two or more, the fallback
# gives up, and Printful breaks — even though nothing about Printful changed.
#
# So PRINTFUL_TOKEN must exist under its real name BEFORE anything else is
# added. This script enforces that and refuses to continue if step 1 fails.
#
# SECRET HANDLING
# ---------------
# Values are read with `read -s` (never echoed), held only in shell variables,
# passed to the API via jq --arg (never interpolated into a command line where
# they'd be visible to `ps`), and scrubbed on exit. Nothing is written to disk.
# Every listing in this script prints `.name` only.
#
# USAGE
#   chmod +x fix-supabase-secrets.sh
#   ./fix-supabase-secrets.sh
#
# You need a Supabase Personal Access Token (starts with sbp_) from:
#   https://supabase.com/dashboard/account/tokens

set -euo pipefail
IFS=$'\n\t'

# Keep values out of shell history in case this is sourced rather than run.
set +o history 2>/dev/null || true

PROJECT_REF="uluyuqrikzicapnezmqd"          # canonical: vibeflex-printful-automation
API="https://api.supabase.com/v1/projects/${PROJECT_REF}/secrets"
LEGACY_SECRET_NAME="Shopify & VibeFlex Studio"

cleanup() {
  unset SUPABASE_PAT PRINTFUL_TOKEN SHOPIFY_CLIENT_ID SHOPIFY_CLIENT_SECRET \
        AIRTABLE_TOKEN OWNER_USER_ID 2>/dev/null || true
}
trap cleanup EXIT INT TERM

die() { printf '\nERROR: %s\n' "$1" >&2; exit 1; }
step() { printf '\n=== %s ===\n' "$1"; }

for bin in curl jq; do
  command -v "$bin" >/dev/null 2>&1 || die "'$bin' is required but not installed."
done

cat <<'BANNER'
────────────────────────────────────────────────────────────
 VibeFlex POD Studio — Supabase secret correction
 Project: uluyuqrikzicapnezmqd (vibeflex-printful-automation)

 Values are never echoed, never written to disk, never printed
 back. Only secret NAMES are ever displayed.
────────────────────────────────────────────────────────────
BANNER

# ---------------------------------------------------------------- collect
prompt_secret() { # $1 = var name, $2 = human label, $3 = "required"|"optional"
  local __var="$1" __label="$2" __mode="$3" __val=""
  while :; do
    printf '%s' "  ${__label}: "
    read -rs __val; printf '\n'
    if [[ -n "$__val" ]]; then break; fi
    if [[ "$__mode" == "optional" ]]; then
      printf '    (skipped)\n'; break
    fi
    printf '    Required — please paste a value.\n'
  done
  printf -v "$__var" '%s' "$__val"
}

step "Credentials"
echo "Paste each value. Nothing is displayed as you type."
echo
prompt_secret SUPABASE_PAT         "Supabase access token (sbp_...)"      required
prompt_secret PRINTFUL_TOKEN       "Printful API token"                   required
echo
echo "  The next three are new credentials from the Shopify and Airtable"
echo "  consoles. Press Enter to skip any you don't have yet."
echo
prompt_secret SHOPIFY_CLIENT_ID     "Shopify client ID"                   optional
prompt_secret SHOPIFY_CLIENT_SECRET "Shopify client secret"               optional
prompt_secret AIRTABLE_TOKEN        "Airtable PAT"                        optional
prompt_secret OWNER_USER_ID         "Owner Supabase user UUID (optional)" optional

[[ "$SUPABASE_PAT" == sbp_* ]] || die "That does not look like a Supabase access token (expected sbp_...)."

api() { # $1 = METHOD, $2 = json body ("" for none)
  local method="$1" body="${2:-}" args=(-sS -X "$method" "$API"
      -H "Authorization: Bearer ${SUPABASE_PAT}" -H "Content-Type: application/json")
  [[ -n "$body" ]] && args+=(-d "$body")
  curl "${args[@]}"
}

names_only() { api GET | jq -r '.[].name' | sort; }

step "Connectivity"
if ! BEFORE="$(names_only 2>/dev/null)"; then
  die "Could not reach the Supabase Management API. Check the token and network."
fi
echo "Connected. Secret names currently on the project:"
printf '%s\n' "$BEFORE" | sed 's/^/  - /'

# ------------------------------------------------------- step 1: Printful
step "Step 1 of 3 — add PRINTFUL_TOKEN (must land before anything else)"
BODY="$(jq -n --arg v "$PRINTFUL_TOKEN" '[{name:"PRINTFUL_TOKEN", value:$v}]')"
api POST "$BODY" >/dev/null
if names_only | grep -qx 'PRINTFUL_TOKEN'; then
  echo "  PRINTFUL_TOKEN is present."
else
  die "PRINTFUL_TOKEN was not created. Stopping BEFORE adding other secrets —
       adding them now would break Printful's fallback resolution."
fi

# ------------------------------------------------- step 2: the remainder
step "Step 2 of 3 — add remaining secrets"
ENTRIES="$(jq -n \
  --arg sid "${SHOPIFY_CLIENT_ID:-}" \
  --arg ssec "${SHOPIFY_CLIENT_SECRET:-}" \
  --arg at "${AIRTABLE_TOKEN:-}" \
  --arg owner "${OWNER_USER_ID:-}" \
  '[ {name:"SHOPIFY_CLIENT_ID",     value:$sid},
     {name:"SHOPIFY_CLIENT_SECRET", value:$ssec},
     {name:"AIRTABLE_TOKEN",        value:$at},
     {name:"OWNER_USER_ID",         value:$owner} ]
   | map(select(.value != ""))')"

if [[ "$(jq 'length' <<<"$ENTRIES")" -gt 0 ]]; then
  api POST "$ENTRIES" >/dev/null
  jq -r '.[].name' <<<"$ENTRIES" | sed 's/^/  added: /'
else
  echo "  Nothing to add — all optional values were skipped."
fi

# --------------------------------------------- step 3: drop misnamed key
step "Step 3 of 3 — remove the misnamed secret"
if printf '%s\n' "$BEFORE" | grep -qxF "$LEGACY_SECRET_NAME"; then
  # Deleted by exact name via JSON — the name contains spaces and an
  # ampersand, so it must never be passed through shell word splitting.
  api DELETE "$(jq -n --arg n "$LEGACY_SECRET_NAME" '[$n]')" >/dev/null
  if names_only | grep -qxF "$LEGACY_SECRET_NAME"; then
    echo "  WARNING: could not remove \"${LEGACY_SECRET_NAME}\". Remove it in the dashboard."
  else
    echo "  Removed \"${LEGACY_SECRET_NAME}\"."
  fi
else
  echo "  Not present — nothing to remove."
fi

# ------------------------------------------------------------- verify
step "Result"
AFTER="$(names_only)"
printf '%s\n' "$AFTER" | sed 's/^/  - /'

echo
MISSING=0
for required in PRINTFUL_TOKEN SHOPIFY_CLIENT_ID SHOPIFY_CLIENT_SECRET AIRTABLE_TOKEN; do
  if printf '%s\n' "$AFTER" | grep -qx "$required"; then
    printf '  PASS  %s\n' "$required"
  else
    printf '  MISSING  %s\n' "$required"; MISSING=$((MISSING + 1))
  fi
done

cat <<SUMMARY

────────────────────────────────────────────────────────────
Edge Functions pick up new secrets on their next invocation —
no redeploy needed.

Verify end to end by opening the Studio and pressing
"Test connection" on all three cards. Expected once the
required secrets above are present: Shopify, Printful and
Airtable all report connected.
SUMMARY

if [[ "$MISSING" -gt 0 ]]; then
  echo
  echo "${MISSING} secret(s) still missing — the matching Studio card will fail"
  echo "until they are added. Re-run this script once you have them."
fi

echo "────────────────────────────────────────────────────────────"
