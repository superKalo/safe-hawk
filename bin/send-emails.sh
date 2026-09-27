#!/bin/bash
set -euo pipefail

# Check if today is Monday (1 = Monday, 7 = Sunday)
if [ "${FORCE_SEND_EMAILS:-0}" != "1" ] && [ "$(date +%u)" -ne 1 ]; then
  echo "Today is not Monday. Exiting."
  exit 0
fi

export NODE_OPTIONS=--max-old-space-size=512

# Dependencies must be installed during deployment, not on every cron run.
yarn start-server
