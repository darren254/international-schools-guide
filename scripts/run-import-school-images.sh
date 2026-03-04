#!/usr/bin/env bash
# Run the school image import once. Safe to run overnight or in background.
# Usage: ./scripts/run-import-school-images.sh [--dry-run]
# Logs to scripts/logs/import-YYYYMMDD-HHMM.log and stdout.

set -e
cd "$(dirname "$0")/.."
mkdir -p scripts/logs
LOG="scripts/logs/import-$(date +%Y%m%d-%H%M).log"
echo "Log file: $LOG"
npx tsx scripts/import-school-images-from-guide.ts "$@" 2>&1 | tee "$LOG"
