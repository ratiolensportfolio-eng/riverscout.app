#!/usr/bin/env bash
# Timestamped local snapshot of the access-point data that ships to
# production (static river-map files + SQL seeds). Does NOT commit
# or push — the backup dir is gitignored. Run this before any cleanup
# or audit pass so manual coord fixes can be recovered if a script
# overwrites them.
#
# Usage: bash scripts/backup-access-points.sh

set -euo pipefail

cd "$(dirname "$0")/.."

STAMP=$(date +%Y-%m-%d_%H%M)
DEST=".backups/access-points-${STAMP}"

mkdir -p "${DEST}/river-maps" "${DEST}/seeds"
cp data/river-maps/*.ts "${DEST}/river-maps/"
cp supabase/seeds/access_points_*.sql "${DEST}/seeds/" 2>/dev/null || true
cp supabase/seeds/cleanup_*.sql "${DEST}/seeds/" 2>/dev/null || true

# Stamp the git HEAD into the backup so we can match a backup to the
# commit that produced it.
git rev-parse HEAD > "${DEST}/GIT_HEAD.txt" 2>/dev/null || true

echo "Backed up to ${DEST}"
ls "${DEST}/river-maps" | wc -l | xargs -I {} echo "  {} river-map files"
ls "${DEST}/seeds" | wc -l | xargs -I {} echo "  {} seed/cleanup SQL files"
