#!/usr/bin/env bash
# Pull the latest main and rebuild the production static bundle.
# Nginx serves apps/site/dist directly, so no service reload is needed —
# the new files take effect on the very next request once the build finishes.
#
# NOTE: this resets the working tree to match origin/main exactly, discarding
# any local changes in this checkout. Only run it against this deploy clone.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

echo "==> Fetching latest main..."
git fetch origin main
git checkout main
git reset --hard origin/main

echo "==> Installing dependencies (pnpm, frozen lockfile)..."
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
pnpm install --frozen-lockfile

echo "==> Building production bundle..."
pnpm build

echo "==> Done. Live at https://reactfreejoy.top"
