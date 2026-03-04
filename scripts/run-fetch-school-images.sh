#!/usr/bin/env bash
# Run the school website image fetch once. Safe to run overnight or in background.
# Usage: ./scripts/run-fetch-school-images.sh [--dry-run]
# Logs to scripts/logs/fetch-YYYYMMDD-HHMM.log and stdout.

set -e
cd "$(dirname "$0")/.."
mkdir -p scripts/logs
LOG="scripts/logs/fetch-$(date +%Y%m%d-%H%M).log"
echo "Log file: $LOG"
npx tsx scripts/fetch-school-images-from-websites.ts "$@" 2>&1 | tee "$LOG"
