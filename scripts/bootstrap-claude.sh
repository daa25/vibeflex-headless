#!/usr/bin/env bash
set -euo pipefail

printf '\nVibeFlex POD Studio — Claude bootstrap\n'
printf 'Repository: daa25/vibeflex-headless\n'
printf 'Default branch: main\n'
printf 'Current Studio repair branch: claude/vibeos-vibeflex-reconciliation-8jjjg7\n\n'

if ! command -v node >/dev/null 2>&1; then
  echo 'ERROR: Node.js is required.' >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo 'pnpm not found; enabling Corepack...'
  corepack enable
fi

required_nonsecret=(
  VIBEFLEX_ENV
  VIBEFLEX_INTERNAL_TENANT
  SHOPIFY_API_DOMAIN
  SHOPIFY_PUBLIC_DOMAIN
  AIRTABLE_BASE_ID
  SUPABASE_PROJECT_REF
  SUPABASE_PUBLIC_URL
)

echo 'Non-secret cloud configuration:'
for name in "${required_nonsecret[@]}"; do
  if [[ -n "${!name:-}" ]]; then
    echo "  PASS  ${name}"
  else
    echo "  WARN  ${name} is not set in this cloud session"
  fi
done

printf '\nCanonical expected values (non-secret):\n'
printf '  SHOPIFY_API_DOMAIN=hbipmy-3g.myshopify.com\n'
printf '  SHOPIFY_PUBLIC_DOMAIN=vibeflex-813.myshopify.com\n'
printf '  AIRTABLE_BASE_ID=appuaF1jfeBr2PPqn\n'
printf '  SUPABASE_PROJECT_REF=uluyuqrikzicapnezmqd\n'
printf '  SUPABASE_PUBLIC_URL=https://uluyuqrikzicapnezmqd.supabase.co\n'
printf '  VIBEFLEX_INTERNAL_TENANT=490-movement\n\n'

if [[ "${SUPABASE_PROJECT_REF:-}" == "whfbpjgqlsoshrvpsoua" ]]; then
  echo 'ERROR: stale Studio Supabase project detected (whfb...). Use canonical uluyuqrikzicapnezmqd.' >&2
  exit 2
fi

if [[ -n "${SUPABASE_PROJECT_REF:-}" && "${SUPABASE_PROJECT_REF}" != "uluyuqrikzicapnezmqd" ]]; then
  echo "WARN: SUPABASE_PROJECT_REF differs from the current canonical POD runtime. Reconcile before deploying."
fi

echo 'Installing dependencies...'
pnpm install --frozen-lockfile

echo 'Running typecheck...'
pnpm check

if node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.lint ? 0 : 1)"; then
  echo 'Running lint...'
  pnpm lint
else
  echo 'No lint script configured; skipping.'
fi

echo 'Running tests...'
pnpm test

echo 'Running production build...'
pnpm build

printf '\nBootstrap complete.\n'
printf 'Private integration secrets must remain in Supabase/runtime secret storage.\n'
printf 'This script intentionally never reads or prints secret values.\n'
